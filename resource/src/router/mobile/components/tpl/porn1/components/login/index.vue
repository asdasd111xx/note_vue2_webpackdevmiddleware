<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :hasFooter="false"
  >
    <div slot="content" class="content-wrap">
      <div class="container">
        <div class="login-wrap clearfix">
          <div class="login-logo">
            <img :src="$getCdnPath('/static/image/_new/login/logo.png')" />
          </div>
          <div class="login-form-wrap">
            <!-- 錯誤訊息 -->
            <div :class="$style['err-msg']">
              <div v-show="errMsg">
                {{ errMsg }}
              </div>
            </div>

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
                @keydown.13="loginCheck"
                @change="onSaveAccount"
                @input="
                  username = $event.target.value
                    .toLowerCase()
                    .replace(' ', '')
                    .trim()
                "
              />
              <div class="input-icon">
                <img
                  :src="
                    $getCdnPath(`/static/image/_new/login/icon_account.png`)
                  "
                />
              </div>
              <div :class="$style['clear']" v-if="username">
                <img
                  :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
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
                @keydown.13="loginCheck"
                @change="onSaveAccount"
              />
              <div :class="$style['eye']">
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/_new/login/btn_eye_${
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
                    $getCdnPath(`/static/image/_new/login/icon_password.png`)
                  "
                />
              </div>
            </span>
            <!-- 驗證碼 -->
            <span
              v-if="hasCaptchaText"
              class="login-unit login-unit-captcha clearfix"
            >
              <input
                ref="captcha"
                v-model="captcha"
                :title="$text('S_RELOAD_PIC', '( 点选此处产生新验证码 )')"
                :placeholder="$text('S_CHECK_CODE', '验证码')"
                class="login-input"
                maxlength="4"
                tabindex="3"
                @focus="getCaptcha"
                @keydown.13="loginCheck"
              />
              <div class="input-icon">
                <img
                  :src="
                    $getCdnPath(`/static/image/_new/login/sign_captcha.png`)
                  "
                />
              </div>
              <img
                class="captchaImg"
                v-if="captchaImg"
                :src="captchaImg"
                height="25"
                @click="getCaptcha"
              />
            </span>
            <div class="login-bottom-wrap">
              <!-- 滑動驗證 -->
              <slide-verification
                v-if="memInfo.config.login_captcha_type === 2"
                :is-enable="isSlideAble"
                :success-fuc="slideLogin"
                page-status="login"
              />
              <div
                v-else
                class="login-button login-submit"
                @click="handleClickLogin"
              >
                {{ $text("S_LOGIN_TITLE", "登录") }}
              </div>
            </div>
            <div class="login-deposit-username clearfix" @click="onSaveAccount">
              <div class="icon-wrap" @click="depositStatus = !depositStatus">
                <img
                  :src="
                    `/static/image/_new/common/icon_${
                      depositStatus ? '' : 'no'
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
            <div class="login-link-wrap">
              <!-- 加入會員 -->
              <div class="link-button link-join-mem">
                <router-link to="/mobile/joinmember">{{
                  $text("S_FREE_REGISTER", "免费注册")
                }}</router-link>
              </div>
              <!-- 登入鈕 -->
              <div
                class="link-button link-submit"
                @click="$router.push('/mobile/service')"
              >
                {{ $text("S_CUSTOMER_SERVICE_ONLINE", "在线客服") }}
              </div>
            </div>
          </div>
          <security-check
            v-if="checkItem"
            :check-item.sync="checkItem"
            :theme="$styleSecurityCheck"
            :on-login="login"
          />
          <div :class="$style.version">
            {{ version }}
          </div>
        </div>
      </div>
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters } from 'vuex';
import loginForm from '@/mixins/loginForm';
import mobileLinkOpen from '@/lib/mobile_link_open';
import slideVerification from '@/components/slideVerification';
import joinMember from '@/router/web/components/page/join_member';
import mobileContainer from '../common/new/mobileContainer'
import { getCookie, setCookie } from '@/lib/cookie';

/**
 * 登入共用元件
 */
export default {
  components: {
    securityCheck: () => import(/* webpackChunkName: 'securityCheck' */'@/router/web/components/common/securityCheck'),
    slideVerification,
    mobileContainer
  },
  mixins: [loginForm],
  props: {
    redirect: {
      type: String,
      default: '/mobile'
    }
  },
  data() {
    return {
      errMsg: "",
      version: "",
      isShowPwd: false,
    }
  },
  computed: {
    ...mapGetters({
      webInfo: 'getWebInfo',
      cdnDomain: 'getCdnDomain',
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
      onlineService: 'getOnlineService'
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        hasClose: true,
        title: this.$text("S_LOGON", "登录"),
      };
    },
    mobileColor() {
      return this.$cookie.get('MOBILE_COLOR') || this.siteConfig.MOBILE_COLOR;
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
  created() {
    this.username = localStorage.getItem('username') || '';
    this.password = localStorage.getItem('password') || '';
    this.depositStatus = localStorage.getItem('depositStatus') || false;

    let version = this.$route.query.version || getCookie('version');
    if (version) {
      this.version = version;
      setCookie('version', version);
    }

    let script = document.createElement('script');
    script.setAttribute('src', 'esabgnixob.js');
    script.setAttribute('type', 'text/javascript');
    document.head.appendChild(script);
  },
  methods: {
    mobileLinkOpen,
    toggleEye() {
      if (this.isShowPwd) {
        document.getElementById("pwd").type = 'password';
      } else {
        document.getElementById("pwd").type = 'text';
      }

      this.isShowPwd = !this.isShowPwd;
    },
    handleClickLogin() {
      if (!this.username || !this.password) return
      this.loginCheck(undefined, undefined, this.errorCallBack);
    },
    slideLogin(loginInfo) {
      this.loginCheck({ captcha: loginInfo.data }, loginInfo.slideFuc, this.errorCallBack);
    },
    // 錯誤訊息call back
    errorCallBack(res) {
      if (res && res.msg) {
        this.errMsg = `${res.msg}(${res.code})`;
      } else if (res && res.status) {
        this.errMsg = res.status;
      } else if (res && res.data) {
        this.errMsg = res.data.msg;
      }
    }
  }
};
</script>

<style src="./css/index.scss" lang="scss"  scoped>
</style>

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

// 藍紫色系
:global(.bluePurple) :local {
  .content {
    background: #1b1a44;

    .title {
      background: #6a69f5;
    }
  }

  .field input {
    background: #6a69f5;
  }

  .submit {
    background: #ce5cef;
    color: #fff;
  }

  .mask {
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>

<style lang="scss" module>
@import "~@/css/variable.scss";

.version {
  color: $main_text_color3;
  position: absolute;
  right: 14px;
  bottom: 5vh;
  font-size: 12px;
}

.err-msg {
  padding: 2px 0;
  color: $main_error_color1;
  min-height: 40px;
}

.eye {
  display: flex;
  align-items: center;
  height: 100%;
  width: 18px;
  position: absolute;
  right: 10px;
  top: 0;

  > img {
    width: 18px;
    height: 18px;
  }
}

.clear {
  display: flex;
  align-items: center;
  height: 100%;
  width: 12px;
  position: absolute;
  right: 10px;
  top: 0;

  > img {
    width: 12px;
    height: 12px;
  }
}
</style>
