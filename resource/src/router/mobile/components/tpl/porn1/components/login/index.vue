<template>
  <mobile-container :header-config="headerConfig" :hasFooter="false">
    <div slot="content" class="content-wrap">
      <div class="container">
        <div class="login-wrap clearfix">
          <div class="login-logo">
            <img :src="'/static/image/porn1/common/logo_b.png'" />
          </div>
          <div class="login-form-wrap">
            <!-- 錯誤訊息 -->
            <div class="err-msg">
              <div v-show="errMsg">
                {{ errMsg }}
              </div>
            </div>
            <form>
              <!-- 帳號 -->
              <span class="login-unit login-unit-username">
                <input
                  ref="username"
                  v-model="username"
                  :title="$text('S_ACCOUNT', '帐号')"
                  :placeholder="$text('S_USER_NAME', '用户名')"
                  class="login-input"
                  maxlength="20"
                  tabindex="1"
                  @keydown.13="keyDownSubmit()"
                  @input="
                    username = $event.target.value
                      .toLowerCase()
                      .replace(' ', '')
                      .trim()
                      .replace(/[\W]/g, '')
                  "
                />
                <div class="input-icon">
                  <img
                    :src="
                      $getCdnPath(`/static/image/common/login/icon_account.png`)
                    "
                  />
                </div>
                <div class="clear" v-if="username">
                  <img
                    :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
                    @click="username = ''"
                  />
                </div>
              </span>
              <!-- 密碼 -->
              <span class="login-unit login-unit-password">
                <input
                  ref="password"
                  id="pwd"
                  v-model="password"
                  :title="$text('S_PASSWORD', '密码')"
                  :placeholder="$text('S_PASSWORD', '密码')"
                  class="login-input"
                  type="password"
                  maxlength="12"
                  tabindex="2"
                  @input="
                    password = $event.target.value
                      .replace(' ', '')
                      .trim()
                      .replace(/[\W]/g, '')
                  "
                  @keydown.13="keyDownSubmit()"
                  autocomplete="password"
                />
                <div class="eye">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/common/login/btn_eye_${
                          isShowPwd ? 'n' : 'd'
                        }.png`
                      )
                    "
                    @click="toggleEye('confPwd')"
                  />
                </div>
                <div class="input-icon">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/common/login/icon_password.png`
                      )
                    "
                  />
                </div>
              </span>
              <!-- 拼圖驗證 -->
              <puzzle-verification
                v-if="memInfo.config.login_captcha_type === 3"
                ref="puzzleVer"
                :puzzle-obj.sync="puzzleObj"
              />
              <!-- 驗證碼 -->
              <div
                v-if="hasCaptchaText"
                class="login-unit login-unit-captcha clearfix"
              >
                <input
                  ref="captcha"
                  v-model="captcha"
                  placeholder="请填写验证码"
                  class="login-input"
                  maxlength="4"
                  tabindex="3"
                  @input="captchaVerification($event.target.value)"
                  @keydown.13="keyDownSubmit()"
                />
                <div class="input-icon">
                  <img
                    :src="
                      $getCdnPath(`/static/image/common/login/sign_captcha.png`)
                    "
                  />
                </div>
                <img
                  class="captchaImg"
                  v-if="captchaImg"
                  :src="captchaImg"
                  height="25"
                />
                <div class="captchaText-refresh" @click="getCaptcha">
                  <img
                    :src="'/static/image/common/ic_verification_reform.png'"
                  />
                </div>
              </div>
              <div class="login-deposit-username clearfix">
                <div class="icon-wrap" @click="rememberPwd = !rememberPwd">
                  <img
                    :src="
                      `/static/image/common/icon_${
                        rememberPwd ? '' : 'no'
                      }remember.png`
                    "
                  />
                </div>
                <span class="deposit-text">{{
                  $text("S_SAVE_PASSWORD", "记住密码")
                }}</span>
                <!-- 忘記密碼 -->
                <span
                  class="login-unit-link"
                  @click="$router.push('/mobile/forgetpwd/member')"
                  >{{ $text("S_PASSWORD_FORGET", "忘记密码") }}?</span
                >
              </div>
              <div class="login-bottom-wrap">
                <!-- 滑動驗證 -->
                <slide-verification
                  v-if="memInfo.config.login_captcha_type === 2"
                  :is-enable="isSlideAble"
                  :success-fuc="slideLogin"
                  page-status="login"
                />
                <!-- 登入鈕 -->
                <div
                  v-else
                  class="login-button login-submit"
                  @click="handleClickLogin"
                >
                  <div>
                    {{ $text("S_LOGIN_TITLE", "登录") }}
                  </div>
                </div>
              </div>
              <div class="login-link-wrap">
                <!-- 加入會員 -->
                <div class="link-button link-join-mem">
                  <span @click="linktoJoin()">
                    {{ $text("S_FREE_REGISTER", "免费注册") }}
                  </span>
                </div>
                <div
                  class="link-button link-submit"
                  @click="$router.push('/mobile/service')"
                >
                  {{ $text("S_CUSTOMER_SERVICE_ONLINE", "在线客服") }}
                </div>
              </div>
            </form>
          </div>
          <security-check
            v-if="checkItem"
            :check-item.sync="checkItem"
            :theme="$styleSecurityCheck"
            :on-login="login"
          />
          <div class="version">
            {{ version }}
          </div>
        </div>
      </div>
      <page-loading :is-show="isLoading" />
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters } from "vuex";
import loginForm from "@/mixins/loginForm";
import slideVerification from "@/components/slideVerification";
import puzzleVerification from "@/components/puzzleVerification";
import mobileContainer from "../common/mobileContainer";
import { getCookie, setCookie } from "@/lib/cookie";

/**
 * 登入共用元件
 */
export default {
  components: {
    securityCheck: () =>
      import(
        /* webpackChunkName: 'securityCheck' */ "@/router/web/components/common/securityCheck"
      ),
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    slideVerification,
    puzzleVerification,
    mobileContainer
  },
  mixins: [loginForm],
  props: {
    redirect: {
      type: String,
      default: "/mobile"
    }
  },
  data() {
    return {
      puzzleData: null,
      script: null
    };
  },
  watch: {
    puzzleObj() {
      this.errMsg = "";
    }
  },
  computed: {
    ...mapGetters({
      webInfo: "getWebInfo",
      cdnDomain: "getCdnDomain",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      onlineService: "getOnlineService"
    }),
    puzzleObj: {
      get() {
        return this.puzzleData;
      },
      set(value) {
        this.puzzleData = value;
      }
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          // 目前與億元的返回流程不同
          if (this.$route.query && this.$route.query.prev) {
            let prev = this.$route.query.prev;
            switch (prev) {
              case "back":
              default:
                this.$router.push(`/mobile/${prev}`);
                return;
            }
          } else {
            this.$router.push(`/mobile/home`);
          }
        },
        hasClose: true,
        title: this.$text("S_LOGON", "登录")
      };
    },
    hasCaptchaText() {
      if (this.memInfo.config.login_captcha_type === 1) {
        return true;
      }

      return false;
    },
    isSlideAble() {
      if (!this.username || !this.password) {
        return false;
      }

      return true;
    }
  },
  beforeCreate() {
    if (this.$route.query.logout) {
      setCookie("cid", "");
      setCookie("y_token", "");
      setCookie("aid", "");
      window.location.replace("/mobile/login");
    }
  },
  created() {
    if (!document.querySelector('script[data-name="esabgnixob"]')) {
      this.script = document.createElement("script");
      this.script.setAttribute("type", "text/javascript");
      this.script.setAttribute("data-name", "esabgnixob");

      if (window.location.host.includes("localhost")) {
        this.script.setAttribute(
          "src",
          "https://yb01.66boxing.com/mobile/esabgnixob.js"
        );
      } else {
        this.script.setAttribute("src", "esabgnixob.js");
      }

      document.head.appendChild(this.script);
    }
  },
  methods: {
    slideLogin(loginInfo) {
      this.loginCheck({ captcha: loginInfo.data }, loginInfo.slideFuc);
    }
  }
};
</script>

<style src="./css/index.scss" lang="scss" scoped></style>

<style lang="scss" module="$styleSecurityCheck">
@import "~@/css/variable.scss";

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.content {
  position: relative;
  margin: 194px auto 0;
  border-radius: 4px;
  background: #222;
  padding-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  max-width: 340px;
  color: #fff;
  font-size: 14px;
}

.title {
  margin-bottom: 16px;
  padding: 15px 20%;
  background: #493535;
  width: 100%;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.field {
  margin: 0 auto 16px;
  width: 80%;

  .field-title {
    line-height: 3;
  }

  input {
    display: block;
    background-color: #56433c;
    border: none;
    border-radius: 8px;
    width: 100%;
    height: 40px;
    text-indent: 10px;
    outline: none;
    color: #fff;

    &::-webkit-input-placeholder {
      color: #fff;
    }
  }
}

.link-submit {
  color: $main_text_color1;
}
.submit {
  margin: 0 auto;
  border-radius: 8px;
  background: #f2c925;
  width: 80%;
  height: 40px;
  line-height: 40px;
  color: #493535;
  cursor: pointer;
  text-align: center;
}

.close {
  position: absolute;
  top: 5px;
  right: 10px;
  width: 40px;
  height: 40px;
  line-height: 36px;
  font-size: 36px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(90deg);
  }
}

.tip {
  margin: 20px auto 0;
  width: 80%;
  font-size: 15px;
  text-align: center;
  color: #f94444;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}
</style>
