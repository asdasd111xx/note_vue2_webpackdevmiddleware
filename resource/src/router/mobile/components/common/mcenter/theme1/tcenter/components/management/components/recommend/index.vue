<template>
  <div>
    <div :class="[$style['code-wrap'], 'clearfix']">
      <div :class="$style.title">
        {{ $text("S_PROMOTION_CODE", "推广代码") }}
      </div>
      <div :class="$style.code">{{ agentLink.agentCode }}</div>
    </div>
    <div v-if="getAgentLink" :class="[$style['promote-wrap'], 'clearfix']">
      <div :class="$style['qrcode-wrap']">
        <qrcode
          :value="getAgentLink"
          :options="{ width: 129, margin: 2 }"
          tag="img"
        />
      </div>
      <div :class="$style['button-wrap']">
        <div class="download-qrcode" @click="onQrcodeOpen">
          <span :class="[$style.icon, $style['icon-qrcode']]" />
          <span :class="$style['button-text']">{{
            $text("S_DOWNLOAD_QRCODE", "下载二维码")
          }}</span>
        </div>
        <div class="copy-link" @click="onCopy('LINK')">
          <span :class="[$style.icon, $style['icon-copy']]" />
          <span :class="$style['button-text']">{{
            $text("S_COPY_PROMOTION_LINK", "复制推广连结")
          }}</span>
        </div>
        <div class="copy-code" @click="onCopy('CODE')">
          <span :class="[$style.icon, $style['icon-copy']]" />
          <span :class="$style['button-text']">{{
            $text("S_COPY_PROMOTION_CODE", "复制推广代码")
          }}</span>
        </div>
      </div>
      <!-- v-if="memInfo.config.infinity_register" -->
      <div
        v-if="memInfo.config.infinity_register"
        :class="$style['button-create']"
        @click="isShow = !isShow"
      >
        <span :class="[$style['icon-arrow'], { [$style.active]: isShow }]" />
        <span>新增一级好友</span>
      </div>
    </div>
    <transition name="slide-down">
      <div v-if="isShow" :class="$style['register-wrap']">
        <div :class="$style.line" />
        <div v-for="key in allInput" :key="key" :class="$style['input-group']">
          <!-- 欄位名稱 -->
          <div :class="$style['input-title']">
            {{ $text(allText[key].placeholder) }}
          </div>
          <!-- 輸入框 -->
          <div
            :class="[
              $style[key],
              $style.placeholder,
              { [$style.error]: allText[key].error }
            ]"
          >
            <template v-if="!allValue[key]">
              {{ $text(texts[key].placeholder) }}
            </template>
            <input
              v-if="key !== 'password' && key !== 'confirm_password'"
              v-validate="'required'"
              :class="[
                {
                  [$style.active]: allValue[key],
                  [$style.error]: allText[key].error,
                  [$style['show-placeholder']]: !allValue[key]
                }
              ]"
              :maxlength="allText[key].maxLength"
              v-model="allValue[key]"
              data-vv-scope="form-page"
              @input="onInput($event.target.value, key)"
              @keydown.13="onSubmit"
            />
            <input
              v-else="key === 'password' || key === 'confirm_password'"
              v-validate="'required'"
              :class="[
                {
                  [$style.active]: allValue[key],
                  [$style.error]: allText[key].error,
                  [$style['show-placeholder']]: !allValue[key]
                }
              ]"
              :data-key="key"
              :maxlength="allText[key].maxLength"
              v-model="allValue[key]"
              type="password"
              data-vv-scope="form-page"
              @input="onInput($event.target.value, key)"
              @keydown.13="onSubmit"
            />
            <div
              v-if="['password', 'confirm_password'].includes(key)"
              :class="[
                $style['btn-show-password'],
                { [$style.active]: isShowEyes }
              ]"
              @click="onShowPassword()"
            />
          </div>
          <!-- 錯誤訊息 -->
          <div
            v-if="allText[key].error && texts[key].error"
            :class="$style['error-message']"
          >
            {{ $text(texts[key].error) }}
          </div>
        </div>
        <!-- 驗證碼 -->
        <div
          v-if="memInfo.config.default_captcha_type === 1"
          style="display: none"
        >
          <div :class="$style['input-title']" style="font-size: 12px">
            验证码
          </div>
          <div
            :class="[
              $style['captcha-unit'],
              $style['captcha-unit-captcha'],
              $style['clearfix']
            ]"
          >
            <input
              ref="captcha"
              v-model="allValue['captcha']"
              placeholder="请填写验证码"
              :class="$style['captcha-input']"
              maxlength="4"
              @input="captchaVerification($event.target.value)"
              @keydown.13="onSubmit"
            />
            <div class="input-icon"></div>
            <img
              :class="$style['captchaImg']"
              v-if="captchaImg"
              :src="captchaImg"
              height="25"
            />
            <div :class="$style['captchaText-refresh']" @click="getCaptcha">
              <img :src="'/static/image/common/ic_verification_reform.png'" />
            </div>
          </div>
        </div>
        <popup-verification
          v-if="isShowCaptcha"
          :is-show-captcha.sync="isShowCaptcha"
          :captcha.sync="captchaData"
          style="display: none"
        />
        <button @click="onSubmit">{{ $text("S_ADD") }}</button>
      </div>
    </transition>

    <!-- 訊息 -->
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>

    <!-- 連結複製提示與 QR Code -->
    <popup
      v-if="isPopup"
      :type="popupType"
      :link="getAgentLink"
      @close="onPopupClose"
    />
  </div>
</template>

<script>
import friendsRecommend from "@/mixins/mcenter/management/friendsRecommend";
import promoteFunction from "@/mixins/mcenter/management/promoteFunction";
import message from "@/router/mobile/components/common/message";
import { mapGetters, mapActions } from "vuex";
import puzzleVerification from "@/components/puzzleVerification";
import slideVerification from "@/components/slideVerification";
import popupVerification from "@/components/popupVerification";
import bbosRequest from "@/api/bbosRequest";
import * as apis from "@/config/api";
import { getCookie, setCookie } from "@/lib/cookie";

export default {
  components: {
    popup: () => import(/* webpackChunkName: 'popup' */ "../popup/index"),
    message,
    slideVerification,
    puzzleVerification,
    popupVerification
  },
  mixins: [friendsRecommend, promoteFunction],
  data() {
    return {
      texts: {
        username: {
          placeholder: "S_USERNAME_ERROR",
          error: "S_USERNAME_ERROR"
        },
        // 密碼
        password: {
          placeholder: "S_PASSWORD_ERROR",
          error: "S_PASSWORD_ERROR"
        },
        // 確認密碼
        confirm_password: {
          placeholder: "S_PWD_CONFIRM",
          error: "S_JM_PASSWD_CONFIRM_ERROR"
        },
        // 會員姓名
        name: {
          placeholder: "S_REGISTER_TIPS",
          error: "S_NO_SYMBOL_DIGIT_CHEN"
        }
      },
      puzzleData: null,
      isGetCaptcha: false, // 重新取得驗證碼
      captchaImg: "",
      toggleCaptcha: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      isBackEnd: "getIsBackEnd"
    }),
    puzzleObj: {
      get() {
        return this.puzzleData;
      },
      set(value) {
        this.puzzleData = value;
      }
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    isShowCaptcha: {
      get() {
        return this.toggleCaptcha;
      },
      set(value) {
        return (this.toggleCaptcha = value);
      }
    },
    captchaData: {
      get() {
        return this.allValue["captcha"];
      },
      set(value) {
        return (this.allValue["captcha"] = value);
      }
    }
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    getCaptcha() {
      if (this.isBackEnd || this.isGetCaptcha) {
        return;
      }

      this.isGetCaptcha = true;
      setTimeout(() => {
        this.isGetCaptcha = false;
      }, 800);

      bbosRequest({
        method: "post",
        url: this.siteConfig.BBOS_DOMIAN + "/Captcha",
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: {
          lang: "zh-cn",
          format: "png"
        }
      }).then(res => {
        if (res.data && res.data.data) {
          this.captchaImg = res.data.data;
          this.aid = res.data.cookie.aid;
          setCookie("aid", res.data.cookie.aid);
        }
      });
    },
    captchaVerification(val) {
      this.allValue["captcha"] = val.replace(/[\W\_]/g, "");
    },
    showCaptchaPopup() {
      // 無認證直接呼叫
      if (this.memInfo.config.default_captcha_type === 0) {
        this.handleSend();
        return;
      }
      // 四碼驗證
      if (this.memInfo.config.default_captcha_type === 1) {
        this.onSubmit();
        return;
      }

      // 彈驗證窗並利用Watch captchaData來呼叫 getKeyring()
      this.toggleCaptcha = true;
    },
    handleSend() {
      this.onSubmit();
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
