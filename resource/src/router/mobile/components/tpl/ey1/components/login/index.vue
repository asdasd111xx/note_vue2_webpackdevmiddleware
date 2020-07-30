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
            <img :src="'/static/image/ey1/common/logo_b.png'" />
          </div>
          <div class="login-form-wrap">
            <!-- 錯誤訊息 -->
            <div :class="$style['err-msg']">
              <div v-show="errMsg">
                {{ errMsg }}
              </div>
            </div>

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
                @change="onSaveAccount"
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
                    .toLowerCase()
                    .replace(' ', '')
                    .trim()
                    .replace(/[\W]/g, '')
                "
                @keydown.13="keyDownSubmit()"
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
            <puzzle-verification
              v-if="memInfo.config.login_captcha_type === 3"
              ref="puzzleVer"
              :puzzle-obj.sync="puzzleObj"
            />
            <span
              v-if="hasCaptchaText"
              class="login-unit login-unit-captcha clearfix"
            >
              <input
                ref="captcha"
                v-model="captcha"
                :title="$text('S_RELOAD_PIC', '( 点选此处产生新验证码 )')"
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
              <div
                v-else
                class="login-button login-submit"
                @click="handleClickLogin"
              >
                {{ $text("S_LOGIN_TITLE", "登录") }}
              </div>
            </div>
            <div class="login-link-wrap">
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
import slideVerification from '@/components/slideVerification';
import puzzleVerification from '@/components/puzzleVerification';
import mobileContainer from '../common/mobileContainer';
import { getCookie, setCookie } from '@/lib/cookie';

export default {
  components: {
    securityCheck: () => import(/* webpackChunkName: 'securityCheck' */'@/router/web/components/common/securityCheck'),
    slideVerification,
    puzzleVerification,
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
      version: "",
      isShowPwd: false,
      puzzleData: null,
      script: null,
    };
  },
  watch: {
    puzzleObj() {
      this.errMsg = "";
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
        onClick: () => { this.$router.back(); },
        hasClose: true,
        title: this.$text("S_LOGON", "登录"),
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
      window.location.replace('/mobile/login');
    }
  },
  created() {
    if (!document.querySelector('script[data-name="esabgnixob"]')) {
      this.script = document.createElement('script');
      this.script.setAttribute('type', 'text/javascript');
      this.script.setAttribute('data-name', 'esabgnixob');

      if (window.location.host.includes("localhost")) {
        this.script.setAttribute('src', 'https://yb01.66boxing.com/mobile/esabgnixob.js');
      } else {
        this.script.setAttribute('src', 'esabgnixob.js');
      }

      document.head.appendChild(this.script);
    }

    this.getCaptcha();
    this.username = localStorage.getItem('username') || '';
    this.password = localStorage.getItem('password') || '';
    this.depositStatus = localStorage.getItem('depositStatus') || false;
    this.version = `${this.siteConfig.VERSION}${getCookie('platform') || ''}`;
  },
  methods: {
    linktoJoin() {
      this.$nextTick(() => {
        this.$router.push('/mobile/joinmember');
      });
    },
    keyDownSubmit() {
      if (this.memInfo.config.login_captcha_type === 2) {
        return
      }
      this.handleClickLogin();
    },
    toggleEye() {
      if (this.isShowPwd) {
        document.getElementById("pwd").type = 'password';
      } else {
        document.getElementById("pwd").type = 'text';
      }

      this.isShowPwd = !this.isShowPwd;
    },
    handleClickLogin() {
      if (!this.username) {
        this.errMsg = "用户名不得为空";
        return;
      }

      if (!this.password) {
        this.errMsg = "密码不得为空";
        return;
      }

      switch (this.memInfo.config.login_captcha_type) {
        // 無驗證
        case 0:
          this.loginCheck();
          break;

        // 數字驗證
        case 1:
          this.loginCheck();
          break;

        // 拼圖驗證
        case 3:
          if (!this.puzzleObj) {
            this.errMsg = "请先点击按钮进行验证";
            return;
          }
          this.loginCheck({ captcha: this.puzzleObj });
          this.puzzleData = null;
          break;

        default:
          break;
      }
    },
    slideLogin(loginInfo) {
      this.loginCheck({ captcha: loginInfo.data }, loginInfo.slideFuc);
    },
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
  background: #fff;
  padding-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  max-width: 340px;
  font-size: 14px;
}

.title {
  margin-bottom: 16px;
  padding: 15px 20%;
  background: #ff8400;
  width: 100%;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
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
    background-color: #e3e3e3;
    border: none;
    border-radius: 8px;
    width: 100%;
    height: 40px;
    text-indent: 10px;
    outline: none;
    color: #a5a5a5;

    &::-webkit-input-placeholder {
      color: #fff;
    }
  }
}

.submit {
  margin: 0 auto;
  border-radius: 8px;
  background: #e42a30;
  width: 80%;
  height: 40px;
  line-height: 40px;
  color: #ffffff;
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
  background-image: url("/static/image/ey1/common/btn_close.png");
  &:hover {
    transform: rotate(90deg);
  }
}

.tip {
  margin: 20px auto 0;
  width: 80%;
  font-size: 15px;
  text-align: center;
  color: #ff1010;
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
  color: #ff1010;
  min-height: 25px;
  line-height: 25px;
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
