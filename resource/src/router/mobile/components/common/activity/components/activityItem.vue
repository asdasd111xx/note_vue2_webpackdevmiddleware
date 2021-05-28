<template>
  <div
    :class="[
      $style['game-item'],
      { [$style['in-game-lobby']]: displayType === 'game' },
      'clearfix'
    ]"
    @click="onEnter"
  >
    <div
      :name="eventData.name"
      :class="[
        $style['game-image'],
        { [$style['in-game-lobby']]: displayType === 'game' },
        'clearfix'
      ]"
    >
      <img
        v-if="eventData.bg_image"
        :src="eventData.bg_image"
        :class="[$style['bg']]"
      />

      <img v-lazy="getImg" :class="[$style['item']]" />

      <img
        v-if="displayType === 'game'"
        :src="eventData.status_inner_image"
        :class="[$style['status']]"
      />
      <img v-else :src="eventData.status_image" :class="[$style['status']]" />
    </div>
    <!-- <div :class="$style['game-text']">{{ eventData.name }}</div> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import openGame from "@/lib/open_game";
import goLangApiRequest from "@/api/goLangApiRequest";
import { getCookie } from "@/lib/cookie";

export default {
  props: {
    eventData: {
      type: Object,
      default: {}
    },
    displayType: {
      type: String,
      default: ""
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
      BBOSDomain: "getBBOSDomain",
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
      if (localStorage.getItem("is-open-game")) {
        return;
      }
      let newWindow;
      if (!this.eventData.is_secure || this.eventData.is_secure === "false") {
        let url = this.eventData.url;
        if (url.indexOf("://") === -1) {
          url = `https://${url}`;
        }
        newWindow = window.open(url);
        return;
      }

      if (this.displayType === "game") {
        newWindow = window.open();

        goLangApiRequest({
          method: "get",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Casino/Event?lang=zh-ch`,
          params: {
            lang: "zh-cn",
            url: this.eventData.url,
            vendor: this.eventData.vendor,
            kind: this.eventData.kind
            // eventId: this.eventData.eventId
          }
        })
          .then(res => {
            if (res.status === "000") {
              newWindow.location.href = res.data.ret;
            } else {
              newWindow.close();
              this.actionSetGlobalMessage({ msg: res.msg, code: res.code });
            }
          })
          .catch(error => {
            newWindow.close();
            if (error && error.data && error.data.msg) {
              this.actionSetGlobalMessage({ msg: error.data.msg });
            }
          });

        return;
      }

      if (this.isShowLoading) {
        return;
      }

      const { kind, vendor } = this.eventData;
      switch (kind) {
        case 3:
          this.$router.push(`/mobile/casino/${vendor}?label=activity`);
          return;

        case 4:
          this.$router.push(`/mobile/card/${vendor}?label=activity`);
          return;
      }

      this.isShowLoading = true;

      const openGameSuccessFunc = res => {
        this.isShowLoading = false;
        window.GAME_RELOAD = true;
      };

      const openGameFailFunc = res => {
        this.isShowLoading = false;
        window.GAME_RELOAD = undefined;

        if (res && res.data) {
          let data = res.data;
          if (this.siteConfig.MOBILE_WEB_TPL != "ey1") {
            if (data.code === "C50101" || data.code === "C50100") {
              goLangApiRequest({
                method: "get",
                url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Drawing/GetDrawing`,
                params: {
                  cid: getCookie("cid")
                }
              }).then(res => {
                console.log(res);
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
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
