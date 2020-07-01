<template>
  <mobile-container :header-config="headerConfig" :hasFooter="false">
    <div slot="content" class="content-wrap">
      <div :class="$style['forget-password']">
        <div :class="$style['form-wrap']">
          <div :class="$style['form-data']">
            <div v-if="currentMethod !== 'phone-step-2'" class="clearfix">
              <div
                :class="[
                  $style['method-item'],
                  { [$style.active]: currentMethod === 'phone-step-1' }
                ]"
                @click="
                  changeMethod(currentMethod === 'phone-step-1'),
                    changeCurrentMethod('phone-step-1')
                "
              >
                {{ $t("S_RETRIEVE_PHONE") }}
              </div>
              <div
                :class="[
                  $style['method-item'],
                  { [$style.active]: currentMethod === 'email' }
                ]"
                @click="
                  changeMethod(currentMethod === 'email'),
                    changeCurrentMethod('email')
                "
              >
                {{ $t("S_RETRIEVE_EMAIL") }}
              </div>
              <div
                :class="[
                  $style['active-slider'],
                  { [$style.active]: currentMethod === 'phone-step-1' }
                ]"
                :style="{
                  left: `calc(calc(24.5% - 22.5px + 49% * ${
                    currentMethod === 'email' ? 1 : 0
                  }))`
                }"
              />
            </div>

            <!-- 錯誤訊息 -->
            <div :class="$style['err-msg']">
              <div v-show="errMsg">
                {{ errMsg }}
              </div>
            </div>

            <div :class="$style['user-data']">
              <div
                v-if="currentMethod !== 'phone-step-2'"
                :class="$style['form-control']"
              >
                <div class="clearfix">
                  <div :class="$style['form-title']">
                    {{ $t("S_USER_NAME") }}
                  </div>
                  <input
                    v-model="username"
                    :class="$style['form-input']"
                    :placeholder="$t('S_PLEASE_ENTER_USER_NAME')"
                    type="text"
                    maxlength="20"
                    @input="
                      username = $event.target.value
                        .toLowerCase()
                        .replace(' ', '')
                        .trim()
                        .replace(/[\W]/g, '')
                    "
                  />
                </div>
                <div v-if="msg.username !== ''" :class="$style.errorTips">
                  {{ msg.username }}
                </div>
              </div>
              <div>
                <div v-if="currentMethod === 'email'" class="clearfix">
                  <div :class="$style['form-title']">
                    电子邮箱
                  </div>
                  <input
                    v-model="email"
                    :placeholder="$t('S_PLEASE_ENTER_EMAIL')"
                    :class="$style['form-input']"
                    type="text"
                  />
                </div>
                <!-- eslint-disable vue/no-v-html -->
                <div
                  v-if="msg.email !== ''"
                  :class="$style.errorTips"
                  v-html="msg.email"
                />
                <!-- eslint-enable vue/no-v-html -->
              </div>
              <div v-if="currentMethod === 'phone-step-1'" class="clearfix">
                <div :class="$style['form-title']">
                  获取验证码
                </div>
                <input
                  v-model="keyring"
                  :placeholder="$t('S_ENABLE_KEYRING')"
                  :class="[$style['form-input'], $style['keyring-input']]"
                  type="text"
                  @input="
                    keyring = $event.target.value
                      .replace(' ', '')
                      .trim()
                      .replace(/[\W]/g, '')
                  "
                />
                <div
                  :class="[
                    $style['send-keyring'],
                    { [$style['active']]: username && !keyRingTimer }
                  ]"
                  @click="showCaptchaPopup"
                >
                  {{ keyRingTime ? `${keyRingTime}s` : "获取验证码" }}
                </div>
              </div>
              <!-- 重設密碼 -->
              <template v-if="currentMethod === 'phone-step-2'">
                <div :class="$style['form-control']">
                  <div class="clearfix">
                    <div :class="$style['form-title']">
                      {{ $t("S_NEW_PWD") }}
                    </div>
                    <input
                      id="pwd"
                      v-model="password"
                      :class="$style['form-input']"
                      placeholder="请输入6-12位字母或数字"
                      type="password"
                      maxlength="12"
                      @blur="verification('password', $event.target.value)"
                      @input="
                        password = $event.target.value
                          .toLowerCase()
                          .replace(' ', '')
                          .trim()
                          .replace(/[\W]/g, '')
                      "
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
                        @click="toggleEye('pwd')"
                      />
                    </div>
                  </div>
                  <div v-if="msg.password !== ''" :class="$style.errorTips">
                    {{ msg.password }}
                  </div>
                </div>
                <div :class="$style['form-control']">
                  <div class="clearfix">
                    <div :class="$style['form-title']">
                      {{ $t("S_ENABLE_CHK_PWD") }}
                    </div>
                    <input
                      id="confPwd"
                      v-model="confirm_password"
                      :class="$style['form-input']"
                      placeholder="请再次输入密码"
                      type="password"
                      maxlength="12"
                      @blur="
                        verification('confirm_password', $event.target.value)
                      "
                      @input="
                        confirm_password = $event.target.value
                          .toLowerCase()
                          .replace(' ', '')
                          .trim()
                          .replace(/[\W]/g, '')
                      "
                    />
                    <div :class="$style['eye']">
                      <img
                        :src="
                          $getCdnPath(
                            `/static/image/_new/login/btn_eye_${
                              isShowConfPwd ? 'n' : 'd'
                            }.png`
                          )
                        "
                        @click="toggleEye('confPwd')"
                      />
                    </div>
                  </div>
                  <div
                    v-if="msg.confirm_password !== ''"
                    :class="$style.errorTips"
                  >
                    {{ msg.confirm_password }}
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div v-if="currentMethod === 'phone-step-2'" :class="$style.tip">
            请避免使用与其他网站相同或易于被他人猜测到的密码
          </div>
          <div
            v-if="currentMethod === 'email'"
            @click="sendEmail($route.params.type)"
            :class="[
              $style['forget-submit'],
              { [$style['active']]: username && email }
            ]"
          >
            <div>{{ $t("S_SUBMIT") }}</div>
          </div>
          <div
            v-else
            :class="[
              $style['forget-submit'],
              {
                [$style['active']]: checkSubmit
              }
            ]"
            @click="send($route.params.type)"
          >
            <div>
              {{
                currentMethod === "phone-step-1" ? $t("S_NEXT_STEP") : "提交"
              }}
            </div>
          </div>
        </div>
      </div>

      <popup-verification
        v-if="isShowCaptcha"
        :is-show-captcha.sync="isShowCaptcha"
        :captcha.sync="captchaData"
      />
    </div>
  </mobile-container>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import member from '@/api/member';
import joinMemInfo from '@/config/joinMemInfo';
import mobileContainer from '../common/new/mobileContainer'
import popupVerification from '@/components/popupVerification';

export default {
  components: {
    mobileContainer,
    popupVerification
  },
  data() {
    return {
      currentMethod: 'phone-step-1',
      resetKeyring: '',
      errMsg: '',
      keyRingTime: 0,
      keyRingTimer: null,
      isShowPwd: false,
      isShowConfPwd: false,
      msg: {
        username: '',
        email: '',
        keyring: '',
        password: '',
        confirm_password: ''
      },
      username: '',
      email: '',
      phone: '',
      keyring: '',
      password: '',
      confirm_password: '',
      toggleCaptcha: false,
      captcha: null
    };
  },
  currentMethod() {
    this.msg = {
      username: '',
      email: '',
      keyring: '',
      password: '',
      confirm_password: ''
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    headerConfig() {
      return {
        prev: true,
        title: this.currentMethod === 'phone-step-2' ? '重设密码' : '找回密码',
        onClick: () => { this.$router.back(); }
      };
    },
    isShowCaptcha: {
      get() {
        return this.toggleCaptcha
      },
      set(value) {
        return this.toggleCaptcha = value
      }
    },
    captchaData: {
      get() {
        return this.captcha
      },
      set(value) {
        return this.captcha = value
      }
    },
    checkSubmit() {
      if (this.currentMethod === 'phone-step-1') {
        return this.username && this.keyring;
      }
      return this.password === this.confirm_password &&
        this.password &&
        this.confirm_password;
    },
  },
  watch: {
    captchaData() {
      this.getKeyring()
    }
  },
  methods: {
    toggleEye(key) {
      let target = key === "pwd" ? this.isShowPwd : this.isShowConfPwd
      if (target) {
        document.getElementById(key).type = 'password';
      } else {
        document.getElementById(key).type = 'text';
      }

      if (key === "pwd") {
        this.isShowPwd = !this.isShowPwd
      } else {
        this.isShowConfPwd = !this.isShowConfPwd
      }
    },
    changeMethod(status) {
      this.errMsg = "";
      if (status) return;
      this.username = '';
      this.email = '';
      this.phone = '';
      this.keyring = '';
      this.password = '';
      this.confirm_password = '';
    },
    verification(key, value) {
      const re = /^[a-z0-9._\-!@#$&*+=|]{6,12}$/;
      const msg = this.$text("S_PASSWORD_ERROR", "请输入6-12码英文小写、数字");

      let errMsg = '';

      if (
        this.password !== this.confirm_password
      ) {
        errMsg = '新密码与确认密码栏位不一致';
        this.msg.confirm_password = errMsg;
        return;
      } else {
        this.msg.confirm_password = '';
        this.msg.password = '';
      }

      if (!value) {
        errMsg = '该栏位不得为空';
      }

      if (!re.test(value)) {
        errMsg = msg;
      }

      this.msg[key] = errMsg;
    },
    sendEmail(type) {
      const url = '/mobile/resetpwd';
      const data = {
        params: {
          username: this.username,
          email: this.email,
          callback: url
        },
        success: (res) => {
          if (res.result === 'ok') {
            this.errMsg = (this.$text('FORGET_PWD_SEND', '确认信已发送，请至信箱查看。'));
          }
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.errMsg = `${res.data.msg}[${res.data.code}]`;
          }
        }
      };

      // 忘記密碼 - 代理會員
      if (type === 'agent') {
        agent.pwdForget(data);
        return;
      }

      // 忘記密碼 - 會員
      member.pwdForget(data);
    },
    send(type) {
      if (this.currentMethod === 'phone-step-1') {
        if (!this.username || !this.keyring) return
      } else {
        if (!this.password || !this.confirm_password) return
      }

      if (this.currentMethod === 'phone-step-1') {
        this.verifySms(type);
        return;
      }
      if (this.currentMethod === 'phone-step-2') {
        this.resetPwd(type);
        return;
      }
    },
    showCaptchaPopup() {
      // 無認證直接呼叫
      if (this.memInfo.config.default_captcha_type === 0) {
        this.getKeyring()
        return
      }

      // 彈驗證窗並利用Watch captchaData來呼叫 getKeyring()
      this.toggleCaptcha = true
    },
    // 忘記密碼發送簡訊(驗證碼)
    getKeyring(type) {
      if (this.keyRingTimer) return;
      const data = {
        params: {
          username: this.username,
          captcha_text: this.captchaData ? this.captchaData : ''
        },
        success: (response) => {
          this.errMsg = "";
          this.keyRingTime = 60;
          this.keyRingTimer = setInterval(() => {
            if (this.keyRingTime === 0) {
              clearInterval(this.keyRingTimer)
              this.keyRingTimer = null;
              this.keyRingTime = 0;
              return;
            }
            this.keyRingTime -= 1;
          }, 1000)
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.errMsg = `${res.data.msg}[${res.data.code}]`;
          }
        }
      };

      // 忘記密碼發送簡訊 - 代理會員
      if (type === 'agent') {
        agent.pwdForgetMobile(data);
        return;
      }

      // 忘記密碼發送簡訊 - 會員
      // member.pwdForgetMobile(data);
      axios({
        method: 'post',
        url: '/api/v1/c/player/forget/password/sms',
        data: {
          username: this.username,
          captcha_text: this.captchaData ? this.captchaData : ''
        }
      }).then(response => {
        this.errMsg = "";
        this.keyRingTime = 60;
        this.keyRingTimer = setInterval(() => {
          if (this.keyRingTime === 0) {
            clearInterval(this.keyRingTimer)
            this.keyRingTimer = null;
            this.keyRingTime = 0;
          }
          this.keyRingTime -= 1;
        }, 1000)

        if (response.data.code) {
          this.errMsg = `${response.data.msg}[${response.data.code}]`;
        } else {
          this.errMsg = '已發送手機認證碼';
        }

      }).catch(res => {
        if (res.response && res.response.data && res.response.data.msg) {
          this.errMsg = `${res.response.data.msg}[${res.response.data.code}]`;
        }
      })

      if (this.toggleCaptcha) {
        this.toggleCaptcha = false
      }
    },
    // 驗證簡訊(驗證碼)
    verifySms(type) {
      const data = {
        params: {
          username: this.username,
          keyring: this.keyring
        },
        success: (response) => {
          if (response.result === 'ok') {
            //   驗證成功重設密碼
            this.resetKeyring = response.ret.keyring;
            this.currentMethod = 'phone-step-2';
            this.errMsg = '';
          }
        },
        fail: (res) => {
          this.msg.keyring = '';
          if (res && res.data && res.data.msg) {
            this.errMsg = `${res.data.msg}[${res.data.code}]`;
          }
        }
      };

      // 忘記密碼驗證簡訊 - 代理會員
      if (type === 'agent') {
        agent.pwdMobileVerify(data);
        return;
      }

      // 忘記密碼驗證簡訊 - 會員
      member.pwdMobileVerify(data);
    },
    resetPwd(type) {
      if (this.msg.password || this.msg.confirm_password) {
        alert(this.$text('S_CHECK_FAIL', '验证失败'));
        return;
      }

      const data = {
        params: {
          username: this.username,
          new_password: this.password,
          confirm_password: this.confirm_password,
          keyring: this.resetKeyring
        },
        success: (response) => {
          this.errMsg = '';
          if (response.result === 'ok') {
            this.$router.push(`/mobile/${type === 'agent' ? 'aglogin' : 'login'}`);
          }
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.errMsg = `${res.data.msg}[${res.data.code}]`;
          }
        }
      };

      // 忘記密碼簡訊重設密碼 - 代理會員
      if (type === 'agent') {
        agent.pwdResetMobile(data);
        return;
      }

      // 忘記密碼簡訊重設密碼 - 會員
      member.pwdResetMobile(data);
    },
    changeCurrentMethod(method) {
      this.currentMethod = method;
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.err-msg {
  padding: 2px 0;
  color: $main_error_color1;
  min-height: 40px;
  line-height: 40px;
}

.forget-password {
  min-height: 100%;
  font-size: 14px;
}

.form-wrap {
  margin: 0 auto;
  padding: 0 14px;
}

.form-data {
  margin-top: 11px;
  > div {
    position: relative;
  }
}

.method-item {
  width: 49%;
  display: inline-block;
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: #a6a9b2;
  position: relative;

  &.active {
    color: #5e626d;
  }
}

.active-slider {
  position: absolute;
  bottom: 1.5px;
  left: calc(25% - 25px);
  height: 2px;
  background-color: #be9e7f;
  width: 45px;
  transition: left 0.31s;
}

.form-control {
  margin-bottom: 12px;
  position: relative;
}

.form-input {
  font-size: 14px;
  float: left;
  width: 88%;
  padding: 8px 0 17px 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid #f8f8f7;
  outline: 0;
  color: #414655;

  &::placeholder {
    color: #cbced8;
  }

  &.keyring-input {
    width: 60%;
  }
}

.errorTips {
  padding: 2px 0;
  color: $main_error_color1;
  min-height: 25px;
  line-height: 25px;
}

.forget-submit {
  margin-top: 20px;
  height: 45px;
  width: 100%;
  line-height: 45px;
  color: #f3ede7;
  text-align: center;

  > div {
    max-width: 375px;
    width: 100%;
    border-radius: 3px;
    background: linear-gradient(to left, #e9dacb 0%, #eee5db 100%);
    margin: 0 auto;
  }

  &.active {
    > div {
      color: #ffffff;
      background: linear-gradient(to left, #bd9d7d 0%, #f9ddbd 100%);
    }
  }
}

.form-title {
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  text-align: left;
  color: #414655;
}

.send-keyring {
  color: white;
  width: 100px;
  height: 30px;
  background: #e9dacc;
  border-radius: 3px;
  pointer-events: none;
  right: 14px;
  position: absolute;
  text-align: center;
  line-height: 30px;
  font-weight: 500;

  &.active {
    pointer-events: unset;
    background: #bd9d7d;
  }
}

.eye {
  display: flex;
  align-items: center;
  height: 25px;
  width: 18px;
  position: absolute;
  right: 14px;
  top: 25px;

  > img {
    width: 18px;
    height: 18px;
  }
}

.tip {
  margin-top: 15px;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #a6a9b2;
}
</style>
