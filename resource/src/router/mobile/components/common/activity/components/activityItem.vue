<template>
  <div
    :class="[
      $style['game-item'],
      { [$style['in-game-lobby']]: displayType === 'game-lobby' },
      'clearfix'
    ]"
    @click="onEnter"
  >
    <div v-if="displayType !== 'game-lobby'" :class="$style['game-text']">
      {{ eventData.alias }}
    </div>
    <div
      :name="eventData.name"
      :class="[
        $style['game-image'],
        { [$style['in-game-lobby']]: displayType === 'game-lobby' },
        'clearfix'
      ]"
    >
      <img
        v-if="eventData.bg_image && displayType !== 'game-lobby'"
        :src="eventData.bg_image"
        :class="[$style['bg']]"
      />

      <img v-lazy="getImg" :class="[$style['item']]" />

      <img
        v-if="displayType === 'game-lobby'"
        :src="eventData.status_inner_image"
        :class="[$style['status']]"
      />
      <img v-else :src="eventData.status_image" :class="[$style['status']]" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import openGame from "@/lib/open_game";
import goLangApiRequest from "@/api/goLangApiRequest";
import { getCookie } from "@/lib/cookie";
import { sendUmeng } from "@/lib/sendUmeng";

export default {
  props: {
    eventData: {
      type: Object,
      default: {}
    },
    displayType: {
      type: String,
      default: ""
    },
    trialList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      withdrawCheckStatus: "getWithdrawCheckStatus"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    getImg() {
      let img = this.eventData.image;
      return {
        src: `${img}`,
        error: this.$getCdnPath("/static/image/game_loading_s.gif"),
        loading: this.$getCdnPath("/static/image/game_loading_s.gif")
      };
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionSetShowRedEnvelope"]),
    onEnter() {
      sendUmeng(
        76,
        `${this.eventData.alias}_${this.eventData.name}_${this.eventData.id}`
      );
      if (localStorage.getItem("is-open-game")) {
        return;
      }

      const { kind, vendor } = this.eventData;

      let hasTrial = this.trialList.find(
        i => i.vendor === vendor && +i.kind === kind && i.mobile_trial
      );

      if (!hasTrial && !this.loginStatus) {
        this.$router.push("/mobile/login");
        return;
      }

      // 活動大廳
      if (this.displayType !== "game-lobby") {
        let lobbyType = "";
        if (kind) {
          switch (kind) {
            case 3:
              lobbyType = "casino";
              break;

            case 5:
              lobbyType = "card";
              break;

            case 6:
              lobbyType = "mahjong";
              break;
          }
          if (lobbyType) {
            const isActiviy = +this.eventData.status === 3;

            if (this.loginStatus && !isActiviy) {
              this.$router.push(`/mobile/${lobbyType}/${vendor}?label=hot`);
              return;
            }

            this.$router.push(
              `/mobile/${lobbyType}/${vendor}?label=${
                isActiviy || (isActiviy && this.loginStatus)
                  ? "activity"
                  : "trial"
              }`
            );
            return;
          }
        }

        if (this.isLoading) {
          return;
        }

        this.isLoading = true;

        const openGameSuccessFunc = res => {
          this.isLoading = false;
        };

        const openGameFailFunc = res => {
          this.isLoading = false;

          if (res && res.data) {
            let data = res.data;

            if (data.code === "C50101" || data.code === "C50100") {
              goLangApiRequest({
                method: "get",
                url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Drawing/GetDrawing`,
                params: {
                  cid: getCookie("cid")
                }
              }).then(res => {
                if (res.status === "000") {
                  if (res.data.status != -1) {
                    this.actionSetShowRedEnvelope(res.data);
                  } else {
                    this.actionSetGlobalMessage({
                      msg: data.msg,
                      code: data.code,
                      origin: `activity-${this.$route.params.vendor}`
                    });
                  }
                }
              });
            } else {
              this.actionSetGlobalMessage({
                msg: data.msg,
                code: data.code,
                origin: `activity-${this.$route.params.vendor}`
              });
            }
          } else {
            this.actionSetGlobalMessage({
              msg: data.msg,
              code: data.code,
              origin: `activity-${this.$route.params.vendor}`
            });
          }
        };

        openGame(
          { vendor, kind, code: "", gameName: "" },
          openGameSuccessFunc,
          openGameFailFunc
        );

        return;
      }

      // 遊戲大廳內活動連結
      let newWindow;
      if (this.eventData.url) {
        if (!this.eventData.is_secure || this.eventData.is_secure === "false") {
          let url = this.eventData.url;
          if (url.indexOf("://") === -1) {
            url = `https://${url}`;
          }
          newWindow = window.open(url);
          return;
        }

        if (this.displayType === "game-lobby") {
          // 直接使用客端網址+url
          // url: `${window.location.origin}${this.eventData.url}`;
          let cid = getCookie("cid");
          newWindow = window.open(`${this.eventData.url}&cid=${cid}`, "_blank");
          return;
          //   goLangApiRequest({
          //     method: "get",
          //     url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Casino/Event?lang=zh-ch`,
          //     params: {
          //       lang: "zh-cn",
          //       url: this.eventData.url,
          //       vendor: vendor,
          //       kind: kind
          //       // eventId: this.eventData.eventId
          //     }
          //   })
          //     .then(res => {
          //       if (res.status === "000") {
          //         newWindow.location.href = res.data.ret;
          //       } else {
          //         newWindow.close();
          //         this.actionSetGlobalMessage({ msg: res.msg, code: res.code });
          //       }
          //     })
          //     .catch(error => {
          //       newWindow.close();
          //       if (error && error.data && error.data.msg) {
          //         this.actionSetGlobalMessage({ msg: error.data.msg });
          //       }
          //     });

          //   return;
        }
      }
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
