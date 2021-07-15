<template>
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
                    .replace(/\_/g, '')
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
                { [$style['active']]: username && !timer }
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
                  id="password"
                  v-model="password"
                  :class="$style['form-input']"
                  :placeholder="$text('S_NEW_PASSWORD_PLACEHOLDER')"
                  type="password"
                  maxlength="12"
                  @blur="verification('password', $event.target.value)"
                  @input="verification('password', $event.target.value)"
                />
                <div :class="$style['eye']">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/common/login/btn_eye_${
                          isShowPwd ? 'n' : 'd'
                        }.png`
                      )
                    "
                    @click="toggleEye('password')"
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
                  id="confirm_password"
                  v-model="confirm_password"
                  :class="$style['form-input']"
                  placeholder="请再次输入密码"
                  type="password"
                  maxlength="12"
                  @blur="verification('confirm_password', $event.target.value)"
                  @input="verification('confirm_password', $event.target.value)"
                />
                <div :class="$style['eye']">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/common/login/btn_eye_${
                          isShowPwd ? 'n' : 'd'
                        }.png`
                      )
                    "
                    @click="toggleEye('confirm_password')"
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
          {{ currentMethod === "phone-step-1" ? $t("S_NEXT_STEP") : "提交" }}
        </div>
      </div>
    </div>
    <popup-verification
      v-if="isShowCaptcha"
      @show-captcha="showCaptcha"
      @set-captcha="setCaptcha"
      :page-type="'default'"
    />
  </div>
</template>
<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import member from "@/api/member";
import mobileContainer from "../../common/mobileContainer";
import popupVerification from "@/components/popupVerification";
import joinMemInfo from "@/config/joinMemInfo";

export default {
  components: {
    mobileContainer,
    popupVerification
  },
  data() {
    return {
      currentMethod: "phone-step-1",
      resetKeyring: "",
      errMsg: "",
      countdownSec: 0,
      timer: null,
      isShowPwd: false,
      msg: {
        username: "",
        email: "",
        keyring: "",
        password: "",
        confirm_password: ""
      },
      username: "",
      email: "",
      phone: "",
      keyring: "",
      password: "",
      confirm_password: "",
      thirdyCaptchaObj: null,
      isShowCaptcha: false
    };
  },

  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    checkSubmit() {
      if (this.currentMethod === "phone-step-1") {
        return this.username && this.keyring;
      }

      return (
        this.password === this.confirm_password &&
        this.password &&
        this.confirm_password &&
        this.errMsg === "" &&
        !Object.keys(this.msg).some(key => this.msg[key] !== "")
      );
    }
  },
  watch: {
    thirdyCaptchaObj() {
      this.getKeyring();
    },
    currentMethod() {
      this.msg = {
        username: "",
        email: "",
        keyring: "",
        password: "",
        confirm_password: ""
      };
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionVerificationFormData",
      "actionGetToManyRequestMsg"
    ]),
    setCaptcha(obj) {
      this.thirdyCaptchaObj = obj;
    },
    showCaptcha(toggle) {
      if (toggle !== undefined) {
        this.isShowCaptcha = toggle;
      } else {
        this.isShowCaptcha = !this.isShowCaptcha;
      }
    },
    toggleEye(key) {
      let password = document.getElementById("password"),
        confirm_password = document.getElementById("confirm_password");

      if (this.isShowPwd) {
        if (password) {
          password.type = "password";
        }
        if (confirm_password) {
          confirm_password.type = "password";
        }
      } else {
        if (password) {
          password.type = "text";
        }
        if (confirm_password) {
          confirm_password.type = "text";
        }
      }
      this.isShowPwd = !this.isShowPwd;
    },
    changeMethod(status) {
      if (status) return;
    },
    verification(key, value) {
      let errMsg = "";
      this.actionVerificationFormData({
        target: key,
        value: value
      }).then(val => {
        this[key] = val;
        const regex = new RegExp(joinMemInfo[key].regExp);
        const msg = joinMemInfo[key].errorMsg;

        if (["confirm_password"].includes(key)) {
          if (!val) {
            this.errMsg = errMsg;
            return;
          }

          if (this.password !== this.confirm_password) {
            errMsg = this.$text("S_PASSWD_CONFIRM_ERROR");
          }
        } else if (["password"].includes(key)) {
          if (!val) {
            this.errMsg = errMsg;
            return;
          }

          if (!val.match(regex)) {
            errMsg = msg;
          }
        } else {
          if (!regex.test(value)) {
            errMsg = msg;
          }
        }
        this.msg[key] = errMsg;
      });
    },
    sendEmail(type) {
      if (this.isSendEmail) {
        return;
      }

      this.isSendEmail = true;
      setTimeout(() => {
        this.isSendEmail = false;
      }, 1200);

      const url = "/mobile/resetPwd";
      const data = {
        params: {
          username: this.username,
          email: this.email,
          callback: url,
          errorAlert: false
        },
        success: res => {
          if (res.result === "ok") {
            this.actionSetGlobalMessage({
              msg: this.$text("FORGET_password_SEND", "重设密码信件已发送")
            });
          }
        },
        fail: res => {
          if (res && res.data && res.data.msg) {
            this.errMsg = `${res.data.msg}`;
          }
        }
      };

      // 忘記密碼 - 代理會員
      if (type === "agent") {
        agent.pwdForget(data);
        return;
      }

      // 忘記密碼 - 會員
      member.pwdForget(data);
    },
    send(type) {
      if (this.currentMethod === "phone-step-1") {
        if (!this.username || !this.keyring) return;
      } else {
        if (!this.password || !this.confirm_password) return;
      }

      if (this.currentMethod === "phone-step-1") {
        this.verifySms(type);
        return;
      }
      if (this.currentMethod === "phone-step-2") {
        this.resetpassword(type);
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
        this.showCaptcha(true);
      });
    },
    // 忘記密碼發送簡訊(驗證碼)
    getKeyring(type) {
      if (this.timer && this.isSendKeyring) return;
      this.isSendKeyring = true;
      // 忘記密碼發送簡訊 - 代理會員
      //   if (type === 'agent') {
      //     agent.passwordForgetMobile(data);
      //     return;
      //   }

      // 忘記密碼發送簡訊 - 會員
      // member.passwordForgetMobile(data);

      axios({
        method: "post",
        url: "/api/v1/c/player/forget/password/sms",
        data: {
          username: this.username,
          captcha_text: this.thirdyCaptchaObj ? this.thirdyCaptchaObj : ""
        }
      })
        .then(res => {
          if (res.data.result === "ok") {
            this.errMsg = "";
            this.countdownSec = 60;
            this.timer = setInterval(() => {
              if (this.countdownSec === 0) {
                clearInterval(this.timer);
                this.timer = null;
                return;
              }
              this.countdownSec -= 1;
            }, 1000);

            if (res.data.code) {
              this.errMsg = `${res.data.msg}`;
            } else {
              this.actionSetGlobalMessage({
                msg: "已发送手机验证码"
              });
            }
          } else {
            this.errMsg = res.data.msg;
          }
        })
        .catch(error => {
          this.isSendKeyring = false;

          if (error.response && error.response.status === 429) {
            this.actionGetToManyRequestMsg(error.response).then(res => {
              this.errMsg = res;
            });
            return;
          }

          // if (error.response && error.response.status === 429) {
          //   this.errorMsg = "今日发送次数已达上限";
          //   this.countdownSec = 0;
          //   return;
          // }

          if (
            error.response &&
            error.response.data &&
            error.response.data.msg
          ) {
            this.errMsg = `${error.response.data.msg}`;
          }
        });

      this.showCaptcha(false);
    },
    // 驗證簡訊(驗證碼)
    verifySms(type) {
      const data = {
        params: {
          username: this.username,
          keyring: this.keyring
        },
        success: response => {
          if (response.result === "ok") {
            //   驗證成功重設密碼
            this.errMsg = "";
            this.resetKeyring = response.ret.keyring;
            this.currentMethod = "phone-step-2";
            this.$emit("setTitle", this.$text("S_PASSWORD_RESET"));
          }
        },
        fail: res => {
          this.msg.keyring = "";

          if (res && res.status === 429) {
            this.actionGetToManyRequestMsg(res).then(result => {
              this.errorMsg = result;
            });
            return;
          }

          if (res && res.data && res.data.msg) {
            this.errMsg = `${res.data.msg}`;
          }
        }
      };

      // 忘記密碼驗證簡訊 - 代理會員
      if (type === "agent") {
        agent.pwdMobileVerify(data);
        return;
      }

      // 忘記密碼驗證簡訊 - 會員
      member.pwdMobileVerify(data);
    },
    resetpassword(type) {
      if (this.msg.password || this.msg.confirm_password) {
        return;
      }

      const data = {
        params: {
          username: this.username,
          new_password: this.password,
          confirm_password: this.confirm_password,
          keyring: this.resetKeyring,
          errorAlert: false
        },
        success: response => {
          this.errMsg = "";
          if (response.result === "ok") {
            this.$router.push(
              `/mobile/${type === "agent" ? "aglogin" : "login"}`
            );
          }
        },
        fail: res => {
          if (res && res.status === 429) {
            this.actionGetToManyRequestMsg(res).then(result => {
              this.errorMsg = result;
            });
            return;
          }

          if (res && res.data && res.data.msg) {
            this.errMsg = `${res.data.msg}`;
          }
        }
      };

      // 忘記密碼簡訊重設密碼 - 代理會員
      if (type === "agent") {
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
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
