<template>
  <!-- 提款前提示彈窗 -->
  <transition name="fade">
    <div
      :class="[sliderClass, $style['container']]"
      :style="isSlider ? {} : { animation: 'unset' }"
    >
      <div :class="$style['wiithdraw-account-header']">
        <div :class="$style['btn-prev']">
          <img
            :src="
              $getCdnPath(
                `/static/image/common/btn_back_${
                  themeTPL === 'porn1'
                    ? 'grey'
                    : themeTPL === 'sg1'
                    ? 'black'
                    : null
                }.png`
              )
            "
            @click="onClose(true)"
          />
        </div>
        <span :class="$style['title']"> {{ "帐户资料" }}</span>
        <!-- <div :class="$style['btn-icon']">
          <img
            :src="$getCdnPath(`/static/image/${themeTPL}/common/btn_help.png`)"
            @click="$router.push('/mobile/mcenter/helpCenter')"
          />
        </div> -->
      </div>

      <div :class="$style['wiithdraw-account-wrap']">
        <div :class="[$style['err-msg'], $style['api-msg']]">
          {{ tipMsg }}
        </div>

        <div v-if="formData['name'].show" :class="$style['cell']">
          <div :class="$style['err-msg']">
            {{ formData["name"].msg }}
          </div>

          <div :class="$style['form-title']">{{ formData["name"].title }}</div>
          <div :class="$style['form-input']">
            <input
              v-model="formData['name'].value"
              @input="verification('name')"
              @blur="verification('name')"
              :placeholder="formData['name'].placeholder"
            />
          </div>
        </div>

        <div v-if="formData['withdraw_password'].show" :class="$style['cell']">
          <div :class="$style['err-msg']">
            {{ formData["withdraw_password"].msg }}
          </div>
          <div :class="$style['form-title']">
            {{ formData["withdraw_password"].title }}
          </div>
          <div :class="$style['form-input']">
            <input
              v-for="(item, index) in formData['withdraw_password'].value"
              v-model="formData['withdraw_password'].value[index]"
              :key="`widthdrawPwd-${index}`"
              @input="verification('withdraw_password', index)"
              @blur="verification('withdraw_password', index)"
              :data-key="`withdraw_password_${index}`"
              :class="$style['withdraw-pwd-input']"
              :maxlength="1"
              :minlength="1"
              :placeholder="formData['withdraw_password'].placeholder"
              type="tel"
            />
          </div>
          <div :class="$style['withdraw-password-tips']">
            {{ `请输入0-9数字` }}
          </div>
        </div>

        <div v-if="formData['phone'].show" :class="$style['cell']">
          <div :class="$style['err-msg']">
            {{ formData["phone"].msg }}
          </div>
          <div :class="$style['form-title']">
            {{ formData["phone"].title }}
          </div>
          <div :class="$style['form-input']">
            <input
              v-model="formData['phone'].value"
              @input="verification('phone')"
              @blur="verification('phone')"
              :class="$style['phone-input']"
              :placeholder="formData['phone'].placeholder"
              type="tel"
            />
          </div>
        </div>

        <div v-if="formData['phone'].show" :class="$style['cell']">
          <div :class="$style['err-msg']">
            {{ formData["keyring"].msg }}
          </div>
          <div :class="$style['form-title']">
            {{ formData["keyring"].title }}
          </div>
          <div :class="$style['form-input']">
            <input
              v-model="formData['keyring'].value"
              id="phone-code"
              :placeholder="formData['keyring'].placeholder"
              @input="verification('keyring')"
              @blur="verification('keyring')"
              type="tel"
            />
            <div
              :class="[
                $style['btn-send'],
                { [$style.active]: isVerifyPhone && !timer && !isSendKeyring }
              ]"
              @click="showCaptchaPopup"
            >
              <span v-if="countdownSec">{{ `${countdownSec}s` }}</span>
              <span v-else> {{ "获取验证码" }} </span>
            </div>
          </div>
        </div>

        <div
          :class="[
            $style['btn-submit'],
            { [$style.active]: !isSendForm && checkFormData && isVerifyPhone }
          ]"
          @click="sendFormData"
        >
          <div>确认</div>
        </div>
      </div>
      <page-loading :is-show="isLoading" />
      <popup-verification
        v-if="isShowCaptcha"
        @show-captcha="showCaptcha"
        @set-captcha="setCaptcha"
        :page-type="'default'"
      />
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import mixin from "@/mixins/mcenter/withdraw";
import ajax from "@/lib/ajax";
import { API_MCENTER_USER_CONFIG } from "@/config/api";
import { getCookie, setCookie } from "@/lib/cookie";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  props: {
    isSlider: {
      default: false
    }
  },
  mixins: [mixin],
  components: {
    popupVerification: () =>
      import(
        /* webpackChunkName: 'popupVerification' */ "@/components/popupVerification"
      ),
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      )
  },
  data() {
    return {
      // 國碼
      phoneHead: "+86",
      phoneHeadOption: [],
      sliderClass: "slider",
      tipMsg: "",
      isVerifyPhone: false,
      isSendKeyring: false,
      isSendForm: false,
      countdownSec: 0,
      checkBankSwitch: false, // 此參數是從廳主端直接綁定卡片，Bank 則會有影響
      timer: null,
      thirdyCaptchaObj: null,
      isShowCaptcha: false,
      checkFormData: false,
      isLoading: false,
      ttl: 60,
      formData: {
        name: {
          title: "持卡人姓名",
          show: false,
          value: "",
          msg: "",
          placeholder: "请输入持卡人姓名"
        },
        withdraw_password: {
          title: "提现密码",
          show: false,
          value: ["", "", "", ""],
          msg: "",
          placeholder: "--"
        },
        phone: {
          title: "手机号码",
          show: false,
          value: "",
          msg: "",
          placeholder: "请输入手机号码"
        },
        keyring: {
          title: "手机验证码",
          show: false,
          value: "",
          msg: "",
          placeholder: "请输入手机验证码"
        }
      },

      // 投注/轉帳前需設定提現資料
      withdraw_info_before_bet: false,
      // 投注/轉帳前需綁定銀行卡其他條件，0:主功能關閉，1:至少需一張銀行卡，2:銀行卡/電子錢包擇一
      ub_before_bet_mode: 0
    };
  },
  created() {
    this.isLoading = true;
    this.getAccountDataStatus().then(data => {
      this.checkBankSwitch = data.ret.bank;

      Object.keys(data.ret).forEach(i => {
        if (this.formData[i]) {
          if (i === "phone") {
            this.formData["keyring"].show = !data.ret[i];

            // 無手機欄位時候不需要驗證
            this.isVerifyPhone = data.ret[i];
          }

          // 鴨博/絲瓜 無提現密碼
          if (
            ["porn1", "sg1"].includes(this.themeTPL) &&
            i == "withdraw_password"
          ) {
            this.formData["withdraw_password"].show = false;
            return;
          }
          this.formData[i].show = !data.ret[i];
        }
      });

      // 當資料皆已填寫完(防呆且行動網頁版會考慮到)
      // 04/19 當接收到 Error Code 導去 msg，因未綁定電子錢包的 Error Code 統一導到帳戶資料頁面，因此有可能還是會進入此判斷
      if (
        !this.formData.name.show &&
        !this.formData.phone.show &&
        !this.formData.withdraw_password.show
      ) {
        this.getDomainConfig().then(() => {
          this.$router.back();
        });
      }
      this.isLoading = false;
    });

    // 國碼
    ajax({
      method: "get",
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then(response => {
      if (response && response.result === "ok") {
        this.phoneHeadOption = response.ret.config.phone.country_codes;
      }
    });
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      domainConfig: "getDomainConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    redirect() {
      let redirect = this.$route.query.redirect || "home";
      return redirect;
    }
  },
  watch: {
    thirdyCaptchaObj(val) {
      this.sendKeyring();
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionVerificationFormData",
      "actionSetUserWithdrawCheck",
      "actionGetToManyRequestMsg",
      "actionSetDomainConfigV2"
    ]),
    setCaptcha(obj) {
      this.thirdyCaptchaObj = obj;
    },
    showCaptcha() {
      this.isShowCaptcha = !this.isShowCaptcha;
    },
    getDomainConfig() {
      return axios({
        method: "get",
        url: "/api/v2/c/domain-config"
      })
        .then(res => {
          if (res && res.data && res.data.ret) {
            // 投注/轉帳前需設定提現資料
            this.withdraw_info_before_bet =
              res.data.ret.withdraw_info_before_bet;

            // 投注/轉帳前需綁定銀行卡其他條件
            this.ub_before_bet_mode = res.data.ret.ub_before_bet_mode;
          }
        })
        .catch(res => {
          this.actionSetGlobalMessage({
            msg: res.response.data.msg,
            code: res.response.data.code,
            origin: "home"
          });
        });
    },
    onClose(isBack) {
      if (this.isSlider) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$emit("close");
          }, 280);
        });
        this.sliderClass = "slider-close slider";
      } else {
        if (isBack) {
          this.$router.back();
          return;
        }

        const _redirect = this.redirect;

        this.getDomainConfig().then(() => {
          // 鴨/絲：只有投注/轉帳前需設定提現資料為 true 才會進到帳戶資料頁面
          this.$router.back();
          return;
        });

        // 提現資料上一頁應回到原本位置 避免迴圈
        // this.$router.back();
        // if (this.redirect) {

        //   switch (this.redirect) {
        //     case "home":
        //       this.$router.push(`/mobile/`);
        //       return;
        //     case "deposit":
        //     case "withdraw":
        //     case "balanceTrans":
        //     case "wallet":
        //       this.$router.push(`/mobile/mcenter/${this.redirect}`);
        //       return;
        //     default:
        //       this.$router.back();
        //       return;
        //   }
        // }

        // this.$router.back();
        return;
      }
    },
    verification(key, index) {
      let target = this.formData[key];
      let errorMsg = "";
      if (key === "name") {
        const re = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF.．·]/g;
        target.value = target.value.replace(re, "");

        // if (!target.value) {
        //   errorMsg = "请勿输入、数字空白及特殊符号"
        // }
      }

      if (key === "withdraw_password") {
        let correct_value = target.value[index]
          .replace(" ", "")
          .trim()
          .replace(/[^\d+]$/g, "");

        if (target.value[index].length > 1) {
          target.value[index] = target.value[index].substring(0, 1);
        }

        if (target.value[index] === correct_value && correct_value !== "") {
          if (index < 3) {
            document
              .querySelector(`input[data-key="${key}_${index + 1}"]`)
              .focus();
          }
        } else if (
          target.value[index] === correct_value &&
          correct_value === ""
        ) {
          if (index > 0) {
            document
              .querySelector(`input[data-key="${key}_${index - 1}"]`)
              .focus();
          }
        }
        target.value[index] = correct_value;
      }

      if (key === "phone") {
        // this.isVerifyPhone = target.value.length >= 11;

        if (target.value.length >= 11) {
          this.isVerifyPhone = true;
        } else {
          this.isVerifyPhone = false;
        }
        this.actionVerificationFormData({
          target: "phone",
          value: target.value
        }).then(res => {
          target.value = res;
        });
      }

      if (key === "keyring") {
        this.actionVerificationFormData({
          target: "code",
          value: target.value
        }).then(res => {
          target.value = res;
        });
      }

      let check = true;
      if (
        (this.formData["name"].show && !this.formData["name"].value) ||
        (this.formData["phone"].show && !this.formData["phone"].value) ||
        (this.formData["keyring"].show &&
          !this.formData["keyring"].value &&
          this.showKeyring)
      ) {
        check = false;
      }

      if (this.formData["withdraw_password"].show) {
        for (let i = 0; i < 4; i++) {
          if (!this.formData["withdraw_password"].value[i]) {
            check = false;
            break;
          }
        }
      }

      this.checkFormData = check;
      target.msg = errorMsg;
    },
    showCaptchaPopup() {
      if (this.formData.phone.value === "") {
        return;
      }

      const params = [
        this.actionSetUserdata(true),
        this.actionSetDomainConfigV2()
      ];

      Promise.all(params).then(() => {
        // 無認證直接呼叫
        if (this.memInfo.config.default_captcha_type === 0) {
          this.sendKeyring();
          return;
        }

        // 彈驗證窗並利用Watch thirdyCaptchaObj來呼叫 getKeyring()
        this.showCaptcha();
      });
    },
    // 回傳會員手機驗證簡訊剩餘秒數可以重送
    getPhoneTTL() {
      return axios({
        method: "get",
        url: "/api/v1/c/player/phone/ttl"
      })
        .then(res => {
          if (res && res.data && res.data.result === "ok") {
            this.ttl = res.data.ret;
          }
        })
        .catch(error => {
          this.tipMsg = `${error.response.data.msg}`;
        });
    },
    sendKeyring() {
      this.isSendKeyring = true;
      this.tipMsg = "";
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Verify/UserBank/Sms`,
        params: {
          lang: "zh-cn",
          phone: `${this.phoneHead.replace("+", "")}-${
            this.formData.phone.value
          }`,
          captcha_text: this.thirdyCaptchaObj ? this.thirdyCaptchaObj : "",
          aid: getCookie("aid") || localStorage.getItem("aid") || ""
        }
      }).then(res => {
        if (this.timer) return;

        if (res && res.status === "000" && res.data === "operate success") {
          if (this.domainConfig && this.domainConfig.auto_keyring) {
          } else {
            this.actionSetGlobalMessage({
              msg: this.$text("S_SEND_CHECK_CODE_VALID_TIME_10")
            });
          }
          this.getPhoneTTL().then(() => {
            this.countdownSec = this.ttl;
            this.timer = setInterval(() => {
              if (this.countdownSec === 0) {
                clearInterval(this.timer);
                this.timer = null;
                return;
              }
              this.countdownSec -= 1;
            }, 1500);
          });
        } else {
          if (res && res.status === "506") {
            this.actionGetToManyRequestMsg(res.msg).then(res => {
              this.tipMsg = res;
            });
          } else if (res.msg) {
            this.tipMsg = res.msg;
          }
        }

        this.isSendKeyring = false;
      });
    },
    sendFormData() {
      this.isSendForm = true;
      this.tipMsg = "";
      let param = {};

      Object.keys(this.formData).forEach(i => {
        if (this.formData[i].show) {
          if (i === "phone") {
            param[i] =
              this.phoneHead.replace("+", "") +
              "-" +
              this.formData["phone"].value;
          } else if (i === "withdraw_password") {
            param[i] = this.formData.withdraw_password.value.join("");
          } else {
            param[i] = this.formData[i].value;
          }
        }
      });

      axios({
        method: "put",
        url: "/api/v1/c/player/info",
        data: param
      })
        .then(res => {
          this.isSendForm = false;
          if (res && res.data && res.data.result !== "ok") {
            this.tipMsg =
              Object.keys(res.data.errors).length === 0 ? res.data.msg : "";
            Object.keys(res.data.errors).forEach(item => {
              this.formData[item].msg = res.data.errors[item];
            });
          } else {
            this.actionSetGlobalMessage({
              msg: "设定成功",
              cb: () => {
                this.actionSetUserWithdrawCheck();
                this.onClose();
              }
            });
          }
        })
        .catch(error => {
          this.tipMsg = `${error.response.data.msg}`;
          this.isSendForm = false;
        });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.index.scss" module="$style_sg1"></style>
