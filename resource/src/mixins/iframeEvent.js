import { mapActions, mapGetters } from "vuex";

import axios from "axios";
import goLangApiRequest from "@/api/goLangApiRequest";
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
      withdrawCheckStatus: "getWithdrawCheckStatus"
    })
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
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
            if (this.loginStatus) {
              return;
            } else {
              this.$router.push("/mobile/login");
            }

            return;

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

          case "EVENT_PAO_DEPOSIT":
            this.$router.push(`/mobile/live/iframe/exchange_diamond`);
            return;

          case "EVENT_PAO_EXCHANGE_DIAMOND":
            this.$router.push(`/mobile/mcenter/live/diamond`);
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

          default:
            return;
        }
      }
    },
    linkToGame(data, event) {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;

      if (!data) {
        return;
      }

      if (!data || !data.split) {
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
          const vendor = target[1] || "";
          const kind = target[2] || "";
          const code = target[3] || "";

          switch (vendor) {
            default:
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
    iframeOnSendMessage(event, response) {
      const iframe = this.$refs["iframe"];
      if (event === "EVENT_GET_GAME_URL_TOKEN") {
        iframe.contentWindow.postMessage(
          {
            event: "EVENT_GAME_URI",
            data: response,
            title: localStorage.getItem("iframe-third-url-title"),
            origin: this.originData
          },
          "*"
        );
      }
    }
  }
};
