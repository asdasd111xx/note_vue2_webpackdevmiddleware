<template>
  <mobile-container :header-config="headerConfig" :hasFooter="false">
    <div slot="content" class="content-wrap">
      <div class="container">
        <div :class="['login-wrap', this.siteConfig.ROUTER_TPL]">
          <div class="login-logo">
            <img :src="`/static/image/${routerTPL}/common/logo_b.png`" />
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
                  :placeholder="$text('S_ACCOUNT', '帐号')"
                  class="login-input"
                  maxlength="20"
                  tabindex="1"
                  @keydown.13="keyDownSubmit()"
                  @input="verification('username', $event.target.value)"
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
                  @input="verification('login_password', $event.target.value)"
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
              <!-- 3拼圖驗證/4手繪/5行為驗證 -->
              <thirdy-verification
                v-if="[3, 4, 5].includes(memInfo.config.login_captcha_type)"
                ref="thirdyCaptchaObj"
                @set-captcha="setCaptcha"
                :page-type="'login'"
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
                  ref="slide-verification"
                  :is-enable="isSlideAble"
                  :success-fuc="slideLogin"
                  page-status="login"
                />
                <!-- 登入鈕 -->
                <div
                  v-else
                  :class="['login-button', 'login-submit']"
                  @click="handleClickLogin"
                >
                  <div>
                    {{ $text("S_LOGIN_TITLE", "登录") }}
                  </div>
                </div>
              </div>
              <div class="login-link-wrap">
                <!-- 加入會員 -->
                <div :class="['link-button', 'link-join-mem']">
                  <span @click="checkLayeredURL">
                    {{ $text("S_FREE_REGISTER", "免费注册") }}
                  </span>
                </div>
                <div
                  :class="['link-button', 'link-submit']"
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
import { mapGetters, mapActions } from "vuex";
import loginForm from "@/mixins/loginForm";
import slideVerification from "@/components/slideVerification";
import thirdyVerification from "@/components/thirdyVerification";
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
    thirdyVerification,
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
      thirdyCaptchaObj: null,
      script: null
    };
  },
  watch: {
    thirdyCaptchaObj() {
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
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  created() {},
  methods: {
    ...mapActions([
      "actionGetLayeredURL",
      "actionGetActingURL",
      "actionGetRegisterURL"
    ]),
    slideLogin(loginInfo) {
      this.loginCheck({ captcha: loginInfo.data }, loginInfo.slideFuc);
    },
    setCaptcha(obj) {
      this.thirdyCaptchaObj = obj;
    },
    checkLayeredURL() {
      if (getCookie("platform") === "h") {
        // this.actionGetActingURL().then(res => {
        //   if (res.length > 0 && res.indexOf(window.location.host) != -1) {
        //     this.linktoJoin();
        //   } else {
        //     this.actionGetLayeredURL().then(res => {
        //       if (res.indexOf(window.location.host) != -1 || res.length < 1) {
        //         this.linktoJoin();
        //       } else {
        //         window.location.replace(
        //           `https://${res[0]}/mobile/joinmember?login=1`
        //         );
        //       }
        //     });
        //   }
        // });
        this.actionGetRegisterURL().then(res => {
          console.log(res);
          if (res.redirect_url) {
            window.location.replace(
              res.redirect_url + "/mobile/joinmember?login=1"
            );
          } else {
            this.linktoJoin();
          }
        });
      } else {
        this.linktoJoin();
      }
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
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  max-width: 340px;
  color: #fff;
  font-size: 14px;
  border-radius: 10px;
}

.title {
  margin-bottom: 16px;
  padding: 15px 20%;
  background: #fff;
  width: 100%;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  color: #414655;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 700;
  border-radius: 10px;
}
.field {
  margin: 0 auto 7px;
  width: 80%;

  .field-title {
    line-height: 3;
    color: #a6a9b2;
  }

  input {
    display: block;
    background-color: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 8px;
    width: 100%;
    height: 40px;
    text-indent: 10px;
    outline: none;
    color: #a5a5a5;

    &::-webkit-input-placeholder {
      color: #a5a5a5;
    }
  }
}

.link-submit {
  color: #9ca3bf;
}

.choose {
  text-align: center;
  margin: auto;
  width: 100%;
  height: 59px;
  font-size: 0;
  border-top: 1px solid #eeeeee;
  font-weight: 700;
  .cancel,
  .submit {
    font-size: 16px;
    display: inline-block;
    margin: 0 auto;

    cursor: pointer;
    text-align: center;
    padding: 0 59px;
    line-height: 58px;
  }
  .cancel {
    color: var(--popup_tip_close_color);
  }
  .submit {
    border-left: 1px solid #eeeeee;
    color: var(--popup_tip_ok_color);
  }
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
  background-image: url("/static/image/common/btn_close_white.png");
  &:hover {
    transform: rotate(90deg);
  }
}

.tip {
  margin: 0 auto 22px auto;
  width: 80%;
  font-size: 15px;
  color: #a5a5a5;
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
