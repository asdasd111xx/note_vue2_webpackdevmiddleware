<template>
  <div :class="$style['game-item']" @click="onEnter">
    <div :class="$style['game-image']">
      <img v-lazy="getImg" />
    </div>
    <div :class="$style['game-text']">{{ gameData.name }}</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import openGame from "@/lib/open_game";
import isMobile from "@/lib/is_mobile";

export default {
  props: {
    gameData: {
      type: Object,
      default: {}
      //  {
      //    "code": "string",
      //    "enable": true,
      //    "is_mobile": true,
      //    "is_pc": true,
      //    "kind": 0,
      //    "mobile_trial;": true,
      //    "name": "string",
      //    "online_at": "string",
      //    "trial": true,
      //    "type": 0,
      //    "vendor": "string",
      //    "vendor_abridge": "string"
      //  }
    },
    lobbyInfo: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters({
      isBackEnd: "getIsBackEnd",
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      BBOSDomain: "getBBOSDomain"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    getImg() {
      let resultUrl = `${this.BBOSDomain}/elibom/gameIcon/${this.lobbyInfo.alias}/Game_${this.gameData.code}.png`;

      return {
        src: `${resultUrl}?v=${Date.now().toString()}`,
        error: this.$getCdnPath("/static/image/game_loading_s.gif"),
        loading: this.$getCdnPath("/static/image/game_loading_s.gif")
      };
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    /**
     * 點擊立即遊戲
     * @method onEnter
     */
    onEnter() {
      if (localStorage.getItem("is-open-game")) {
        return;
      }
      if (this.isBackEnd) {
        return;
      }

      let isMobileView;

      try {
        isMobileView = this.$route.matched[0].meta.isMobile;
      } catch (e) {
        isMobileView = false;
      }

      const { vendor, kind, code, mobile_trial, trial } = this.gameData;

      if (!this.loginStatus && !(isMobile() ? mobile_trial : trial)) {
        if (isMobileView) {
          this.$router.push("/mobile/login");
        } else {
          alert(this.$i18n.t("S_LOGIN_TIPS"));
        }

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
          this.actionSetGlobalMessage({
            msg: data.msg,
            code: data.code
            // origin: this.redirectCard()
          });
        }
      };

      openGame({ vendor, kind, code }, openGameSuccessFunc, openGameFailFunc);
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
