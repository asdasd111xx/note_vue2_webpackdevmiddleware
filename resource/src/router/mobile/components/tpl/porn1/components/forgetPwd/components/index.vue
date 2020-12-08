<template>
  <div :class="$style['forget-password']">
    <div :class="$style['form-wrap']">
      <div :class="$style['form-data']">
        <div v-if="currentMethod !== 'phone-step-2'" class="clearfix">
          <div
            :class="[
              $style['method-item'],
              { [$style.active]: currentMethod === 'phone-step-1' },
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
              { [$style.active]: currentMethod === 'email' },
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
              { [$style.active]: currentMethod === 'phone-step-1' },
            ]"
            :style="{
              left: `calc(calc(24.5% - 22.5px + 49% * ${
                currentMethod === 'email' ? 1 : 0
              }))`,
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
              <div :class="$style['form-title']">电子邮箱</div>
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
            <div :class="$style['form-title']">获取验证码</div>
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
                { [$style['active']]: username && !timer },
              ]"
              @click="showCaptchaPopup"
            >
              {{ countdownSec ? `${countdownSec}s` : "获取验证码" }}
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
                  @blur="verification('confirm_password', $event.target.value)"
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
              <div v-if="msg.confirm_password !== ''" :class="$style.errorTips">
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
          { [$style['active']]: username && email },
        ]"
      >
        <div>{{ $t("S_SUBMIT") }}</div>
      </div>
      <div
        v-else
        :class="[
          $style['forget-submit'],
          {
            [$style['active']]: checkSubmit,
          },
        ]"
        @click="send($route.params.type)"
      >
        <div>
          {{ currentMethod === "phone-step-1" ? $t("S_NEXT_STEP") : "提交" }}
        </div>
      </div>
    </div>
    <popup-verification
      v-if="isShowCaptcha"
      :is-show-captcha.sync="isShowCaptcha"
      :captcha.sync="captchaData"
    />
  </div>
</template>
<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import member from '@/api/member';
import joinMemInfo from '@/config/joinMemInfo';
import mobileContainer from '../../common/mobileContainer'
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
      countdownSec: 0,
      timer: null,
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
      memInfo: 'getMemInfo',
      siteConfig: 'getSiteConfig'
    }),
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    headerConfig() {
      return {
        prev: true,
        title: this.currentMethod === 'phone-step-2' ? '重设密码' : '找回密码',
        onClick: () => { this.$router.back(); },
        noBottomBorder: true
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
  mounted() {
    this.$emit("update:currentMethod", this.currentMethod);
  },
  methods: {
    ...mapActions(['actionSetUserdata']),
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
      const msg = this.$text("S_PASSWORD_ERROR", "请输入6-12位字母或数字");

      let errMsg = '';

      if (
        this.password !== this.confirm_password
      ) {
        errMsg = '确认密码预设要跟密码一致';
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
            this.errMsg = `${res.data.msg}`;
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
      this.actionSetUserdata(true).then(() => {
        // 無認證直接呼叫
        if (this.memInfo.config.default_captcha_type === 0) {
          this.getKeyring();
          return;
        }

        // 彈驗證窗並利用Watch captchaData來呼叫 getKeyring()
        this.toggleCaptcha = true;
      })
    },
    // 忘記密碼發送簡訊(驗證碼)
    getKeyring(type) {
      if (this.timer && this.isSendKeyring) return;
      this.isSendKeyring = true;
      // 忘記密碼發送簡訊 - 代理會員
      //   if (type === 'agent') {
      //     agent.pwdForgetMobile(data);
      //     return;
      //   }

      // 忘記密碼發送簡訊 - 會員
      // member.pwdForgetMobile(data);

      axios({
        method: 'post',
        url: '/api/v1/c/player/forget/password/sms',
        data: {
          username: this.username,
          captcha_text: this.captchaData ? this.captchaData : ''
        }
      }).then(res => {
        if (res.data.result === "ok") {
          this.errMsg = "";
          this.countdownSec = 60;
          this.timer = setInterval(() => {
            if (this.countdownSec === 0) {
              clearInterval(this.timer)
              this.timer = null;
              return;
            }
            this.countdownSec -= 1;
          }, 1000)

          if (res.data.code) {
            this.errMsg = `${res.data.msg}`;
          } else {
            this.errMsg = '已發送手機認證碼';
          }
        } else {
          this.errMsg = res.data.msg;
        }
      }).catch(error => {
        this.isSendKeyring = false;

        if (error.response && error.response.status === 429) {
          this.errorMsg = "今日发送次数已达上限";
          this.countdownSec = 0;
          return;
        }

        if (error.response && error.response.data && error.response.data.msg) {
          this.errMsg = `${error.response.data.msg}`;
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

          if (res && res.status === 429) {
            this.errorMsg = "操作太频繁，请稍候再试";
            return;
          }

          if (res && res.data && res.data.msg) {
            this.errMsg = `${res.data.msg}`;
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
          if (res && res.status === 429) {
            this.errorMsg = "操作太频繁，请稍候再试";
            return;
          }

          if (res && res.data && res.data.msg) {
            this.errMsg = `${res.data.msg}`;
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
      this.$emit("update:currentMethod", method);
      this.currentMethod = method;
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.module.scss" module="$style_ey1"></style>
