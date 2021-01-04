<template>
  <div :style="{ position: 'relative' }">
    <div :id="$style['js-nc-check-bar']" :class="$style['drag-verify-wrap']">
      <div v-if="isBackEnd" :class="$style['nc_wrapper']">
        <div :class="$style['nc_text']">
          {{ $t(slideText[pageStatus][0]) }}
        </div>
        <div :class="$style['nc_scale']">
          <span :class="[$style['nc_iconfont'], $style['btn_slide']]"></span>
        </div>
      </div>
    </div>
    <div
      v-if="!isEnable"
      :class="$style['unable-wrap']"
      id="slide-verification-unable-wrap"
    >
      {{ $t(slideText[pageStatus][0]) }}
    </div>
  </div>
</template>
<script>
/* global noCaptcha */
import { mapGetters } from "vuex";
export default {
  props: {
    cssStyle: {
      type: Object,
      default: () => {}
    },
    successFuc: {
      type: Function,
      default: () => {}
    },
    isEnable: {
      type: Boolean,
      default: true
    },
    pageStatus: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      nc: null,
      slideText: {
        verify: ["S_SLIDE_VERIFY", "向右滑动验证"],
        register: ["S_SLIDE_REGISTER", "向右滑动即注册"],
        login: ["S_SLIDE_LOGIN", "向右滑动即登入"],
        error: ["S_SLIDE_ERROR", "哎呀，出错了，点击刷新试试"],
        errorNetwork: ["S_SLIDE_ERROR_NETWORK", "网络不给力！刷新试试"],
        yesText: ["S_SLIDE_YES_TEXT", "验证通过"]
      }
    };
  },
  computed: {
    ...mapGetters({
      curLang: "getCurLang",
      isBackEnd: "getIsBackEnd",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    langContrast() {
      return {
        "zh-tw": "tw",
        "zh-cn": "cn",
        en: "en",
        ja: "ja_JP",
        vi: "vi_VN"
      };
    },
    ncObject() {
      const ncToken = [
        this.currentSlideData.appkey,
        new Date().getTime(),
        Math.random()
      ].join(":");
      return {
        renderTo: this.$style["js-nc-check-bar"],
        appkey: this.currentSlideData.appkey,
        scene: this.currentSlideData.scene,
        token: ncToken,
        customWidth: "100%",
        // 錯誤訊息格式
        trans: { key1: "code0" },
        elementID: ["usernameID"],
        is_Opt: 0,
        language: this.langContrast[this.curLang],
        isEnabled: this.isEnable,
        timeout: 3000,
        times: 5
      };
    },
    currentSlideData() {
      const data = {
        pc: {
          register: {
            scene: "nc_register",
            appkey: "FFFF0N0N000000009172"
          },
          login: {
            scene: "nc_login",
            appkey: "FFFF0N0N000000009172"
          },
          verify: {
            scene: "nc_login",
            appkey: "FFFF0N0N000000009172"
          }
        },
        mobile: {
          register: {
            scene: "nc_register_h5",
            appkey: "FFFF0N0N000000009172"
          },
          login: {
            scene: "nc_login_h5",
            appkey: "FFFF0N0N000000009172"
          },
          verify: {
            scene: "nc_login",
            appkey: "FFFF0N0N000000009172"
          }
        }
      };
      return data[
        window.location.pathname.split("/")[1] === "mobile" ? "mobile" : "pc"
      ][this.pageStatus];
    }
  },
  watch: {
    isEnable() {
      if (this.isBackEnd) {
        return;
      }
      this.creatSlide();
    }
  },
  mounted() {
    if (this.isBackEnd) {
      return;
    }
    this.creatSlide();
  },
  methods: {
    creatSlide() {
      // eslint-disable-next-line new-cap
      this.nc = new noCaptcha({
        ...this.ncObject,
        callback: data => {
          this.successFuc({
            data: {
              token: data.token,
              csessionid: data.csessionid,
              sig: data.sig,
              scene: this.currentSlideData.scene,
              appkey: this.currentSlideData.appkey
            },
            slideFuc: this.nc
          });
        }
      });
      const refreshIcon = "<i class='refresh-icon'></i>";
      this.nc.upLang(this.langContrast[this.curLang], {
        _startTEXT: this.$text(...this.slideText[this.pageStatus]),
        _yesTEXT: this.$text(...this.slideText.yesText),
        _error300: `<a href=\"javascript:__nc.reset()\">${refreshIcon}${this.$text(
          ...this.slideText.error
        )}</a>`,
        _errorNetwork: `<a href=\"javascript:__nc.reset()\">${refreshIcon}${this.$text(
          ...this.slideText.errorNetwork
        )}</a>`
      });
    },
    ncReload() {
      this.nc.reload();
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/sliderbg/porn1.module.scss"
  module="$style_porn1"
></style>

<style lang="scss">
#slide-verification-unable-wrap {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: slidetounlock 3s infinite;
  -webkit-text-size-adjust: none;
}
</style>

<style
  lang="scss"
  src="@/css/page/sliderbg/sg1.module.scss"
  module="$style_sg1"
></style>
