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
import { mapGetters } from 'vuex';
export default {
  props: {
    cssStyle: {
      type: Object,
      default: () => { }
    },
    successFuc: {
      type: Function,
      default: () => { }
    },
    isEnable: {
      type: Boolean,
      default: true
    },
    pageStatus: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      slideText: {
        verify: ['S_SLIDE_VERIFY' , '向右滑动验证'],
        register: ['S_SLIDE_REGISTER', '向右滑动即注册'],
        login: ['S_SLIDE_LOGIN', '向右滑动即登入'],
        error: ['S_SLIDE_ERROR', '哎呀，出错了，点击刷新试试'],
        errorNetwork: ['S_SLIDE_ERROR_NETWORK', '网络不给力！刷新试试'],
        yesText: ['S_SLIDE_YES_TEXT', '验证通过']
      }
    };
  },
  computed: {
    ...mapGetters({
      curLang: 'getCurLang',
      isBackEnd: 'getIsBackEnd'
    }),
    $style() {
      if (this.cssStyle) {
        return this.cssStyle;
      }
      return this.$styleDefault;
    },
    langContrast() {
      return {
        'zh-tw': 'tw',
        'zh-cn': 'cn',
        en: 'en',
        ja: 'ja_JP',
        vi: 'vi_VN'
      };
    },
    ncObject() {
      const ncToken = [this.currentSlideData.appkey, (new Date()).getTime(), Math.random()].join(':');
      return {
        renderTo: this.$style['js-nc-check-bar'],
        appkey: this.currentSlideData.appkey,
        scene: this.currentSlideData.scene,
        token: ncToken,
        customWidth: '100%',
        // 錯誤訊息格式
        trans: { key1: 'code0' },
        elementID: ['usernameID'],
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
            scene: 'nc_register',
            appkey: 'FFFF0N0N000000009172'
          },
          login: {
            scene: 'nc_login',
            appkey: 'FFFF0N0N000000009172'
          },
          verify: {
            scene: 'nc_login',
            appkey: 'FFFF0N0N000000009172'
          }
        },
        mobile: {
          register: {
            scene: 'nc_register_h5',
            appkey: 'FFFF0N0N000000009172'
          },
          login: {
            scene: 'nc_login_h5',
            appkey: 'FFFF0N0N000000009172'
          },
          verify: {
            scene: 'nc_login',
            appkey: 'FFFF0N0N000000009172'
          }
        }
      };
      return data[window.location.pathname.split('/')[1] === 'mobile' ? 'mobile' : 'pc'][this.pageStatus];
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
      const nc = new noCaptcha({
        ...this.ncObject,
        callback: (data) => {
          this.successFuc({
            data: {
              token: data.token,
              csessionid: data.csessionid,
              sig: data.sig,
              scene: this.currentSlideData.scene,
              appkey: this.currentSlideData.appkey
            },
            slideFuc: nc
          });
        }
      });
      const refreshIcon = "<i class='refresh-icon'></i>";
      nc.upLang(this.langContrast[this.curLang], {
        _startTEXT: this.$text(...this.slideText[this.pageStatus]),
        _yesTEXT: this.$text(...this.slideText.yesText),
        _error300: `<a href=\"javascript:__nc.reset()\">${refreshIcon}${this.$text(...this.slideText.error)}</a>`,
        _errorNetwork: `<a href=\"javascript:__nc.reset()\">${refreshIcon}${this.$text(...this.slideText.errorNetwork)}</a>`
      });
    }
  }
};
</script>

<style lang="scss" module="$styleDefault">
.drag-verify-wrap {
  min-height: 40px;
  line-height: 40px;
}

#js-nc-check-bar {
  &.drag-verify-wrap {
    :global {
      .nc_wrapper {
        min-height: inherit;
        height: initial;
      }

      .nc_scale {
        min-height: inherit;
        height: initial;
        border-radius: 5px;

        .nc_bg {
          width: 0px;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          background: -webkit-linear-gradient(to right, #f9ddbd, #bd9d7d);
          background: -o-linear-gradient(to right, #f9ddbd, #bd9d7d);
          background: -moz-linear-gradient(to right, #f9ddbd, #bd9d7d);
          background: linear-gradient(to right, #f9ddbd, #bd9d7d);
        }

        .nc_iconfont {
          border-radius: 5px;
          color: #000;
        }

        .btn_ok {
          color: #bd9d7d;
        }
      }

      .nc_iconfont {
        min-height: inherit;
        line-height: inherit;
      }

      .scale_text {
        min-height: inherit;
        height: initial;
        line-height: inherit;
      }

      // 錯誤訊息
      .errloading {
        width: 100%;
        min-height: inherit;
        height: initial;
        padding: 9px 5px;
        background-color: #f3dcdb;
      }
    }
  }
}

// 廳主端樣式預設
.nc_wrapper {
  width: auto;
  height: inherit;
}

.nc_scale {
  position: relative;
  width: auto;
  height: inherit;
  margin: 0;
  padding: 0;
  background: #e8e8e8;
}

.nc_iconfont {
  position: absolute;
  z-index: 2;
  width: 40px;
  min-height: inherit;
  height: initial;
  line-height: inherit;
  left: 0;
  text-align: center;
  font-size: 16px;
  font-family: "nc_iconfont";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  border: 1px solid #ccc;
  cursor: move;
  background: #fff;
}

.unable-wrap {
  width: 100%;
  line-height: 40px;
  height: 40px;
  top: 0;
  position: absolute;
  font-size: 12px;
  text-align: center;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0, #4d4d4d),
    color-stop(0.4, #4d4d4d),
    color-stop(0.5, #fff),
    color-stop(0.6, #4d4d4d),
    color-stop(1, #4d4d4d)
  );
}
</style>

<style lang="scss">
#slide-verification-unable-wrap {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: slidetounlock 3s infinite;
  -webkit-text-size-adjust: none;
}
</style>
