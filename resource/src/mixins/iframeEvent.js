import { mapActions, mapGetters } from "vuex";

import axios from "axios";
import goLangApiRequest from "@/api/goLangApiRequest";
import mobileLinkOpen from "@/lib/mobile_link_open";
import openGame from "@/lib/open_game";

export default {
  data() {
    return {
      originData: ""
    };
  },
  beforeDestroy() {
    window.removeEventListener("message", this.iframeOnListener);
    localStorage.removeItem("iframe-third-url-title");
    localStorage.removeItem("iframe-third-url");
  },
  created() {
    // setTimeout(() => {
    //   this.iframeOnListener({
    //     data: {
    //       event: "EVENT_GET_GAME_URL_TOKEN",
    //       data: "game-pao_ly-4"
    //     }
    //   });
    // }, 3000);
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      withdrawCheckStatus: "getWithdrawCheckStatus",
      promotionLink: "getPromotionLink"
    })
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionSetAgentLink"]),
    onLoadiframe() {
      window.addEventListener("message", this.iframeOnListener);
      window.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    },
    iframeOnListener(e) {
      if (e.data) {
        let data = e.data;

        if (!data.event) {
          return;
        }

        console.log("[EVENT]:", data.event);
        console.log("[DATA]:", data.data);

        switch (data.event) {
          case "EVENT_GET_GAME_URL_TOKEN":
          case "EVENT_THIRDPARTY_SWITCH_GAME":
            if (this.loginStatus) {
              this.linkToGame(data.data, data.event);
            } else {
              this.actionSetGlobalMessage({
                msg: "请重新登入",
                cb: () => {
                  this.$router.push("/mobile/login");
                }
              });
            }

            return;

          case "EVENT_EXIT":
          case "EVENT_THIRDPARTY_CLOSE":
            this.$router.replace(this.originUrl);
            return;

          // 避免迴圈重複本站
          case "SELF_INTO":
            if (
              this.$route.params.page.toUpperCase() === "PROMOTION" &&
              !this.src.includes("popcontrol")
            ) {
              this.$router.replace("/mobile/login");
              return;
            }
            return;

          case "EVENT_THIRDPARTY_LOGIN":
            this.$router.push("/mobile/login");
            return;

          case "EVENT_GUEST_REGISTER":
          case "EVENT_THIRDPARTY_JOINMEMBER":
            if (this.loginStatus) {
              return;
            } else {
              this.$router.push("/mobile/joinmember?prev=home");
            }

            return;

          case "EVENT_THIRDPARTY_WALLET":
            if (this.loginStatus) {
              this.$router.push("/mobile/mcenter/wallet?prev=back");
              return;
            } else {
              this.$router.push("/mobile/login");

              // if (this.themeTPL === "ey1") {
              //   this.$router.replace("/mobile/login");
              // } else {
              //   this.$router.replace("/mobile/joinmember?prev=home");
              // }
            }

            return;

          case "EVENT_THIRDPARTY_CURRENCY_NOT_ENOUGH":
          case "EVENT_THIRDPARTY_DEPOSIT":
            this.$router.push("/mobile/mcenter/swag?tab=0&prev=back");
            return;

          case "EVENT_THIRDPARTY_MAIN_DEPOSIT":
            if (this.loginStatus) {
              this.$router.push("/mobile/mcenter/deposit?prev=back");
            } else {
              this.$router.replace("/mobile/login");
            }

            return;

          case "EVENT_THIRDPARTY_HOME":
            this.$router.push("/mobile");
            return;

          // 彩金任務
          // 去推广
          case "EVENT_BOUNS_PROMOTE":
            const { tagId, cid, userid, domain } = data;
            return;

          // 绑定银行卡
          case "EVENT_THIRDPARTY_BANKCARD":
            this.$router.push(
              `/mobile/mcenter/bankCard?redirect=home&type=bankCard`
            );
            return;

          case "EVENT_SWITCH_CUSTOMER_SERVICE":
            this.$router.push(`/mobile/mcenter/service`);
            return;

          case "EVENT_USER_SESSION_ERROR":
            this.actionSetGlobalMessage({
              msg: "请重新登入",
              cb: () => {
                this.$router.push("/mobile/login");
              }
            });
            return;

          case "EVENT_CHATROOM":
            this.toogleFooter(data);
            return;

          case "EVENT_REDIRECT_PAGE":
            let _data = data.data.toUpperCase();
            switch (_data) {
              case "EXCHANGEDIAMOND":
                localStorage.setItem("live-iframe-event-from", data.from);
                this.$router.push(`/mobile/mcenter/live/diamond`);
                return;
              case "CUSTOMERSERVICE":
                this.$router.push(`/mobile/mcenter/service`);
                return;
              case "MCENTERHOME":
                this.$router.push(`/mobile/mcenter/`);
                return;
              case "EDITPROFILE":
                this.$router.push(`/mobile/mcenter/`);
                return;
            }
            return;

          case "EVENT_GET_QRCODE_URL":
            goLangApiRequest({
              method: "get",
              url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Promotion`,
              params: {
                // 1:代理獨立網址, 2:會員pwa, 3:會員推廣頁, 4:代理登入頁, 5:代理pwa, 6:落地頁, 7:前導頁
                clientType: 3
              }
            }).then(res => {
              if (res && res.data) {
                // 縮網址推廣連結
                this.iframeOnSendMessage("EVENT_GET_QRCODE_URL", res.data.url);
              }
            });
            return;

          case "EVENT_OPEN_GAME":
            this.linkToGame(null, "", data.data);
            return;

          case "EVENT_QUEST":
            switch (data.data.toUpperCase()) {
              case "FIRSTBUYDIAMOND":
                this.$router.push(`/mobile/mcenter/live/diamond`);
                return;
              case "CUMULATIVEDONATE":
              case "CHATSTREAM":
              case "VIEWSTREAM":
              case "FIRSTDONATE":
              case "FIRSTGUARDIAN":
              case "STREAMHOME":
                this.redirectLive("home");
                // console.log(this.$refs["iframe"].contentWindow.history);
                return;

              case "SHARESTREAM":
                this.$router.push(`/mobile/mcenter/memberCard`);
                return;
            }

            return;
          case "EVENT_SWIPER_LINK":
            mobileLinkOpen({
              ...data.data,
              site: this.siteConfig.ROUTER_TPL
            });
            return;
          default:
            return;
        }
      }
    },
    linkToGame(data, event, params = null) {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      let vendor = "";
      let kind = "";
      let code = "";

      if ((!data || (data && !data.split)) && !params) {
        return;
      }

      const openGameSuccessFunc = res => {
        this.isLoading = false;

        if (event === "EVENT_GET_GAME_URL_TOKEN") {
          this.iframeOnSendMessage(event, res);
        }

        if (this.$route.query.vendor === "sigua_ly") {
          this.$router.push("/mobile");
        }
      };

      const openGameFailFunc = res => {
        this.isLoading = false;

        if (event === "EVENT_GET_GAME_URL_TOKEN") {
          this.iframeOnSendMessage(event, res);
        }

        if (res && res.data) {
          let data = res.data;
          this.actionSetGlobalMessage({
            msg: data.msg,
            code: data.code,
            origin: "home"
          });
        }
      };

      if (params) {
        // 0421 進入遊戲前檢查withdrawcheck(維護時除外)
        if (!this.withdrawCheckStatus.account) {
          lib_useGlobalWithdrawCheck("home");
          return;
        }

        openGame(
          {
            kind: params.kind,
            vendor: params.vendor_name,
            code: params.code,
            getGames: true
          },
          openGameSuccessFunc,
          openGameFailFunc
        );
        return;
      }

      let target = data.split("-");
      this.originData = data;

      if (target[0]) {
        target[0] = target[0].toLowerCase();
      }

      switch (target[0]) {
        case "lobby":
          let type = "casino";
          switch (target[2]) {
            case "5":
              type = "card";
              break;
            case "3":
            default:
              type = "card";
              break;
          }
          this.$router.push(`/mobile/${type}/${target[1]}`);
          break;

        case "game":
          vendor = target[1] || "";
          kind = target[2] || "";
          code = target[3] || "";

          switch (vendor) {
            default:
              // 0421 進入遊戲前檢查withdrawcheck(維護時除外)
              if (!this.withdrawCheckStatus.account) {
                lib_useGlobalWithdrawCheck("home");
                return;
              }

              openGame(
                {
                  kind: kind,
                  vendor: vendor,
                  code: code,
                  getGames: true,
                  gameType: event === "EVENT_GET_GAME_URL_TOKEN" ? "event" : ""
                },
                openGameSuccessFunc,
                openGameFailFunc
              );

              break;
          }

        default:
          return;
      }
    },
    iframeOnSendMessage(event, data) {
      const iframe = this.$refs["iframe"];
      if (event === "EVENT_GET_GAME_URL_TOKEN") {
        iframe.contentWindow.postMessage(
          {
            event: "EVENT_GAME_URI",
            data: data,
            title: localStorage.getItem("iframe-third-url-title"),
            origin: this.originData
          },
          "*"
        );
      } else {
        iframe.contentWindow.postMessage(
          {
            event: event,
            data: data
          },
          "*"
        );
      }
    }
  }
};
