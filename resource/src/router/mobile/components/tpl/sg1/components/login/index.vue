<template>
  <mobile-container :header-config="headerConfig" :hasFooter="false">
    <div slot="content" class="content-wrap">
      <div class="container">
        <div class="login-wrap clearfix">
          <div class="login-logo">
            <img :src="'/static/image/sg1/common/logo_b.png'" />
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
                  :placeholder="
                    $text('S_PASSWORD_PLACEHOLDER', '请输入6-12位字母及数字')
                  "
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
                  <span @click="checkLayeredURL">
                    {{ $text("S_FREE_REGISTER", "免费注册") }}
                  </span>
                </div>
                <div class="link-button ">
                  <span @click="handleClick('live')">
                    {{ $text("S_JOINTOLIVERS", "成为主播") }}
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
import { mapGetters, mapActions } from "vuex";
import loginForm from "@/mixins/loginForm";
import slideVerification from "@/components/slideVerification";
import thirdyVerification from "@/components/thirdyVerification";
import mobileContainer from "../common/mobileContainer";
import { getCookie, setCookie } from "@/lib/cookie";
import goLangApiRequest from "@/api/goLangApiRequest";

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
      onlineService: "getOnlineService",
      version: "getVersion"
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
            this.$router.push(`/mobile/live/iframe/home`);
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
    ...mapActions([
      "actionGetLayeredURL",
      "actionGetActingURL",
      "actionGetRegisterURL"
    ]),
    handleClick(target) {
      if (target === "live") {
        goLangApiRequest({
          method: "get",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Common/Jackfruit/List`,
          params: {
            version: "2"
          }
        }).then(res => {
          if (
            res &&
            res.data &&
            res.data.data.case_data &&
            res.data.data.case_data["LINK_H5_STREAMER_SERVICE"]
          ) {
            window.open(
              res.data.data.case_data["LINK_H5_STREAMER_SERVICE"].data[0]
                .linkTo["zh-cn"]
            );
          }
        });
      }
    },

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
            window.location.replace(res.redirect_url);
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
  padding-bottom: 45px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  max-width: 270px;
  color: #5e626d;
  font-size: 14px;
  border-radius: 14px;
}

.title {
  padding: 18px 20%;
  width: 100%;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  color: #414655;
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
    background-color: #ffffff;
    border: 1px solid #e3e3e3;
    font-size: 12px;
    border-radius: 60px;
    width: 100%;
    height: 40px;
    text-indent: 10px;
    outline: none;
    color: #000;

    &::-webkit-input-placeholder {
      color: #a5a5a5;
    }
  }
}

.link-submit {
  color: $main_text_color1;
}
.submit {
  background: #fff;
  width: 50%;
  height: 40px;
  line-height: 40px;
  color: #e53266;
  cursor: pointer;
  text-align: center;
  font-size: 18px;
  position: absolute;
  right: 0;
  bottom: 8px;
  border-left: 1px solid #f8f8f7;
}

.close {
  position: absolute;
  bottom: 8px;
  left: 0px;
  width: 50%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #414655;
  cursor: pointer;
  transition: all 0.3s ease;

  &::before {
    content: "取消";
    font-size: 18px;
  }
}

.tip {
  margin: 20px auto 0;
  width: 100%;
  font-size: 14px;
  text-align: center;
  color: #ff1010;
  margin: 8px 0;
  padding: 0 0 12px 0;
  border-bottom: 1px solid #f8f8f7;
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
