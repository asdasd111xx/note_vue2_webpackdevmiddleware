<template>
  <mobile-container :header-config="headerConfig" :hasFooter="false">
    <div slot="content" class="content-wrap">
      <div class="container">
        <div v-if="mobileLoginSwitch" :class="['login-tabs-wrap']">
          <div
            v-for="(tab, index) in tabs"
            :key="`${tab}-${index}`"
            @click="currentTab(index)"
            :class="[
              siteConfig.ROUTER_TPL,
              { active: currentLogin === tab.page }
            ]"
          >
            {{ tab.name }}
          </div>
        </div>
        <div :class="['login-wrap', this.siteConfig.ROUTER_TPL]">
          <div class="login-logo">
            <img :src="`/static/image/${routerTPL}/common/logo_b.png`" />
          </div>
          <div class="login-form-wrap">
            <!-- 錯誤訊息 -->
            <div
              v-show="errMsg && currentLogin === 'accountlogin'"
              class="err-msg"
            >
              {{ errMsg }}
            </div>
            <div
              v-show="mobileLoginErrMsg && currentLogin === 'mobilelogin'"
              class="err-msg"
            >
              {{ mobileLoginErrMsg }}
            </div>

            <form>
              <template v-if="currentLogin === 'accountlogin'">
                <!-- ***帳號登入*** -->
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
                        $getCdnPath(
                          `/static/image/common/login/icon_account.png`
                        )
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
                    v-if="!isShowPwd"
                    v-model="password"
                    :title="$text('S_PASSWORD', '密码')"
                    :placeholder="$text('S_PASSWORD', '密码')"
                    class="login-input"
                    type="password"
                    maxlength="12"
                    tabindex="2"
                    @input="verification('login_password', $event.target.value)"
                    @keydown.13="keyDownSubmit()"
                  />
                  <input
                    v-else
                    v-model="password"
                    :title="$text('S_PASSWORD', '密码')"
                    :placeholder="$text('S_PASSWORD', '密码')"
                    class="login-input"
                    type="text"
                    maxlength="12"
                    tabindex="2"
                    @input="verification('login_password', $event.target.value)"
                    @keydown.13="keyDownSubmit()"
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
                      @click="isShowPwd = !isShowPwd"
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
              </template>
              <template v-if="currentLogin === 'mobilelogin'">
                <!-- ***手機號碼登入*** -->
                <span class="login-unit login-unit-phone">
                  <!-- <v-select
                  v-model="selectData['countryCode'].selected"
                  :options="selectData['countryCode'].options"
                  :searchable="false"
                  :class="['contrycode-select']"
                /> -->
                  <input
                    ref="phone"
                    v-model="phone"
                    :title="$text('S_MOBILE_NUMBER', '手机号码')"
                    :placeholder="$text('S_MOBILE_NUMBER', '手机号码')"
                    :class="['login-input']"
                    maxlength="15"
                    tabindex="1"
                    @keydown.13="keyDownSubmit()"
                    @input="verification('phone', $event.target.value)"
                  />
                  <div class="input-icon">
                    <img
                      :src="
                        $getCdnPath(`/static/image/common/login/icon_phone.png`)
                      "
                    />
                  </div>
                  <div class="clear" v-if="phone">
                    <img
                      :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
                      @click="phone = ''"
                    />
                  </div>
                </span>
                <!-- 手機驗證碼 -->
                <span
                  v-if="mobileLoginTypeSwitch == 1"
                  class="login-unit login-unit-phone"
                >
                  <input
                    ref="phone_validation_code"
                    v-model="phone_validation_code"
                    :title="$text('S_MOBILE_VERIFICATION', '手机验证')"
                    :placeholder="$text('S_ENABLE_KEYRING', '输入验证码')"
                    :class="['login-input']"
                    maxlength="6"
                    tabindex="1"
                    @keydown.13="keyDownSubmit()"
                    @input="
                      verification('phone_validation_code', $event.target.value)
                    "
                  />
                  <div class="input-icon">
                    <img
                      :src="
                        $getCdnPath(`/static/image/common/login/icon_code.png`)
                      "
                    />
                  </div>
                  <button
                    :class="[
                      'getkeyring',
                      phone.length > 10 && !phoneVerifybtnSubmit ? 'active' : ''
                    ]"
                    @click.prevent="getKeyring"
                  >
                    {{
                      phoneVerifybtnSubmit ? ttlCountDown + "s" : "获取验证码"
                    }}
                  </button>
                </span>
                <a
                  v-if="mobileLoginTypeSwitch === 1"
                  href="/mobile/mcenter/help/support"
                  :class="['not-receive-code']"
                  >收不到验证码？</a
                >

                <!-- 密碼 -->
                <span
                  v-if="mobileLoginTypeSwitch === 2"
                  class="login-unit login-unit-password"
                >
                  <input
                    v-if="m_isShowPwd"
                    v-model="mpassword"
                    :title="$text('S_PASSWORD', '密码')"
                    :placeholder="$text('S_PASSWORD', '密码')"
                    class="login-input"
                    type="text"
                    maxlength="12"
                    tabindex="2"
                    @input="
                      verification('m_login_password', $event.target.value)
                    "
                    @keydown.13="keyDownSubmit()"
                  />
                  <input
                    v-else
                    v-model="mpassword"
                    :title="$text('S_PASSWORD', '密码')"
                    :placeholder="$text('S_PASSWORD', '密码')"
                    class="login-input"
                    type="password"
                    maxlength="12"
                    tabindex="2"
                    @input="
                      verification('m_login_password', $event.target.value)
                    "
                    @keydown.13="keyDownSubmit()"
                  />
                  <div class="input-icon">
                    <img
                      :src="
                        $getCdnPath(
                          `/static/image/common/login/icon_password.png`
                        )
                      "
                    />
                  </div>
                  <div class="eye">
                    <img
                      :src="
                        $getCdnPath(
                          `/static/image/common/login/btn_eye_${
                            m_isShowPwd ? 'n' : 'd'
                          }.png`
                        )
                      "
                      @click="m_isShowPwd = !m_isShowPwd"
                    />
                  </div>
                </span>
              </template>
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
                      $getCdnPath(`/static/image/common/login/icon_code.png`)
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
              <!-- 帳號登入記住密碼忘記密碼 -->
              <div
                class="login-deposit-username clearfix"
                v-if="this.currentLogin === 'accountlogin'"
              >
                <div class="icon-wrap" @click="rememberPwd = !rememberPwd">
                  <img
                    :src="
                      `/static/image/common/icon_${
                        rememberPwd ? '' : 'no'
                      }remember.png`
                    "
                  />
                </div>
                <span :class="['deposit-text', `${routerTPL}`]">{{
                  $text("S_SAVE_PASSWORD", "记住密码")
                }}</span>

                <span
                  class="login-unit-link"
                  @click="$router.push('/mobile/forgetpwd/member')"
                  >{{ $text("S_PASSWORD_FORGET", "忘记密码") }}?</span
                >
              </div>
              <!-- 手機登入記住密碼忘記密碼 -->
              <div
                class="login-deposit-username clearfix"
                v-if="
                  this.currentLogin === 'mobilelogin' &&
                    this.mobileLoginTypeSwitch === 2
                "
              >
                <div class="icon-wrap" @click="m_rememberPwd = !m_rememberPwd">
                  <img
                    :src="
                      `/static/image/common/icon_${
                        m_rememberPwd ? '' : 'no'
                      }remember.png`
                    "
                  />
                </div>
                <span :class="['deposit-text', `${routerTPL}`]">{{
                  $text("S_SAVE_PASSWORD", "记住密码")
                }}</span>
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
                  :class="[
                    'login-button',
                    'login-submit',
                    { disabled: submitBtnLock || isLoading }
                  ]"
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
                  :class="['link-button', 'link-submit', `${routerTPL}`]"
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
import vSelect from "vue-select";
import goLangApiRequest from "@/api/goLangApiRequest";
import axios from "axios";
import { sendUmeng } from "@/lib/sendUmeng";

/**
 * 登入共用元件
 */
export default {
  components: {
    vSelect,
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
      script: null,
      tabs: [
        { name: "帐号登录", page: "accountlogin" },
        { name: "手机登录", page: "mobilelogin" }
      ],
      currentLogin: "accountlogin",
      phoneVerifybtnSubmit: false,
      ttlCountDown: 0,
      phoneTimer: null
      // selectData: {
      //   countryCode: {
      //     options: [{ label: "+86", value: "1" }],
      //     selected: { label: "+86", value: "1" }
      //   }
      // }
    };
  },
  watch: {
    thirdyCaptchaObj() {
      this.errMsg = "";
      this.mobileLoginErrMsg = "";
    },
    currentLogin() {
      this.captcha = "";
    }
  },
  computed: {
    ...mapGetters({
      webInfo: "getWebInfo",
      cdnDomain: "getCdnDomain",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      onlineService: "getOnlineService",
      domainConfig: "getDomainConfig"
    }),
    submitBtnLock() {
      if (this.currentLogin === "accountlogin") {
        if (this.username || this.password || this.captcha) {
          return false;
        }
      }
      if (
        this.currentLogin === "mobilelogin" &&
        this.mobileLoginTypeSwitch === 1
      ) {
        if (this.phone || this.phone_validation_code || this.captcha) {
          return false;
        }
      }

      if (
        this.currentLogin === "mobilelogin" &&
        this.mobileLoginTypeSwitch === 2
      ) {
        if (this.phone || this.mpassword || this.captcha) {
          return false;
        }
      }
      return true;
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
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    mobileLoginSwitch() {
      // 手機登入開關-簡訊驗證登入 0: 關, 1:簡訊, 2:密碼
      if (
        this.domainConfig.sms_login_type &&
        this.domainConfig.sms_login_type !== 0
      ) {
        //開
        return true;
      }
      //預設關閉
      return false;
    },
    mobileLoginTypeSwitch() {
      // 手機登入開關-簡訊驗證登入 0: 關, 1:簡訊, 2:密碼
      if (
        this.domainConfig.sms_login_type &&
        this.domainConfig.sms_login_type !== 0
      ) {
        return this.domainConfig.sms_login_type;
      }
      //開啟時 預設為1簡訊
      return 1;
    }
  },
  methods: {
    ...mapActions([
      "actionGetLayeredURL",
      "actionGetActingURL",
      "actionGetRegisterURL",
      "actionGetToManyRequestMsg"
    ]),
    currentTab(index) {
      if (index === 0) {
        this.currentLogin = "accountlogin";
        return;
      }
      if (index === 1) {
        this.currentLogin = "mobilelogin";
        return;
      }
    },
    getKeyring() {
      if (this.phone.length > 10) {
        this.getPhoneVerifyCode();
      }
      return;
    },
    getPhoneTTL() {
      //會員登入手機簡訊倒數秒數
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Login/Phone/TTL`,
        params: {
          phone: `86-${this.phone}`
        }
      }).then(res => {
        if (res && res.status === "000") {
          this.ttlCountDown = res.data;
          this.phoneVerifybtnSubmit = true;
          this.phoneTimer = setInterval(() => {
            if (this.ttlCountDown <= 1) {
              this.ttlCountDown = 0;
              clearInterval(this.phoneTimer);
              this.phoneVerifybtnSubmit = false;
              this.phoneTimer = null;
              return;
            }
            this.ttlCountDown -= 1;
          }, 1500);
        }
      });
    },
    getPhoneVerifyCode() {
      //會員登入手機簡訊驗證
      goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Login/Phone/Verify`,
        params: {
          phone: `86-${this.phone}`
        }
      }).then(res => {
        if (res && res.status === "000") {
          this.actionSetGlobalMessage({ msg: "验证码已发送 有效时间为10分钟" });
          this.getPhoneTTL();
        } else {
          if (res && res.status === "506") {
            this.actionGetToManyRequestMsg(res.msg).then(res => {
              this.mobileLoginErrMsg = res;
            });
          } else {
            this.mobileLoginErrMsg = res.msg;
          }
        }
      });
    },
    slideLogin(loginInfo) {
      this.loginCheck({ captcha: loginInfo.data }, loginInfo.slideFuc);
      localStorage.setItem("slideObj", JSON.stringify(loginInfo.data));
    },
    setCaptcha(obj) {
      this.thirdyCaptchaObj = obj;
    },
    checkLayeredURL() {
      sendUmeng(69);
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
  display: flex;
  font-size: 0;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #eeeeee;
  font-weight: 700;
  line-height: 58px;

  .cancel,
  .submit {
    width: 100%;
    font-size: 16px;
    margin: 0 auto;
    cursor: pointer;
  }
  .cancel {
    border-right: 1px solid #eeeeee;
    // color: var(--popup_tip_close_color);
    color: #6aaaf5;
  }
  .submit {
    // color: var(--popup_tip_ok_color);
    color: #6aaaf5;
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
  clear: both;
}

.checkerr {
  line-height: initial;
  max-width: 375px;
  padding: 2px 6px;
  margin: 6px auto;
  color: #fff;
  background-color: #db6372;
  border-radius: 3px;
  float: right;
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
