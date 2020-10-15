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
            :src="$getCdnPath(`/static/image/${themeTPL}/common/btn_back.png`)"
            @click="onClose"
          />
        </div>
        <span :class="$style['title']"> {{ "帐户资料" }}</span>
        <div :class="$style['btn-icon']">
          <img
            :src="$getCdnPath('/static/image/ey1/common/btn_help.png')"
            @click="$router.push('/mobile/mcenter/helpCenter')"
          />
        </div>
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
            <template v-if="themeTPL === 'ey1'">
              <select v-model="phoneHead" :class="$style['phone-selected']">
                <option v-for="option in phoneHeadOption" v-bind:value="option">
                  {{ "+" + option }}
                </option>
              </select>
            </template>
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

        <div
          v-if="formData['phone'].show && showKeyring"
          :class="$style['cell']"
        >
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
          <div>
            确认
          </div>
        </div>
      </div>
      <page-loading :is-show="isLoading" />
      <popup-verification
        v-if="isShowCaptcha"
        :is-show-captcha.sync="isShowCaptcha"
        :captcha.sync="captchaData"
      />
    </div>
  </transition>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import mixin from '@/mixins/mcenter/withdraw';

export default {
  props: {
    isSlider: {
      default: false
    }
  },
  mixins: [mixin],
  components: {
    popupVerification: () => import(/* webpackChunkName: 'popupVerification' */ '@/components/popupVerification'),
    pageLoading: () => import(/* webpackChunkName: 'pageLoading' */ '@/router/mobile/components/common/pageLoading'),
  },
  data() {
    return {
      // 國碼
      phoneHead: '86',
      phoneHeadOption: [
        '86', '852', '853'
      ],
      sliderClass: 'slider',
      tipMsg: '',
      isVerifyPhone: false,
      isSendKeyring: false,
      isSendForm: false,
      countdownSec: 0,
      checkBankSwitch: false,
      timer: null,
      toggleCaptcha: false,
      captcha: null,
      checkFormData: false,
      isLoading: false,
      ttl: 60,
      formData: {
        name: {
          title: '持卡人姓名',
          show: false,
          value: '',
          msg: '',
          placeholder: '请输入持卡人姓名'
        },
        withdraw_password: {
          title: '提现密码',
          show: false,
          value: ['', '', '', ''],
          msg: '',
          placeholder: '--'
        },
        phone: {
          title: '手机号码',
          show: false,
          value: '',
          msg: '',
          placeholder: '请输入手机号码'
        },
        keyring: {
          title: '手机验证码',
          show: false,
          value: '',
          msg: '',
          placeholder: '请输入手机验证码'
        }
      }
    }
  },
  created() {
    // axios({
    //   method: 'get',
    //   url: '/api/v2/c/withdraw/check',
    // }).then((res) => {

    // });

    this.isLoading = true;
    this.getAccountDataStatus().then((data) => {
      this.checkBankSwitch = data.ret.bank

      Object.keys(data.ret).forEach(i => {
        if (this.formData[i]) {
          if (i === "phone") {
            this.formData['keyring'].show = !data.ret[i];
            // 無手機欄位時候不需要驗證
            this.isVerifyPhone = data.ret[i];
          }

          this.formData[i].show = !data.ret[i];
        }
      })
      if (!this.formData.name.show &&
        !this.formData.phone.show &&
        !this.formData.withdraw_password.show) {
        if (!this.checkBankSwitch) {
          this.$router.replace(`/mobile/mcenter/bankCard?redirect=${this.redirect}&type=wallet`)
        } else {
          this.$router.back();
        }
      }
      this.isLoading = false;
    });
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
    }),
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    showKeyring() {
      return this.memInfo.config.player_user_bank_mobile;
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
    redirect() {
      let redirect = this.$route.query.redirect;
      return this.$route.query.redirect;
    }
  },
  watch: {
    captchaData(val) {
      this.sendKeyring()
    },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage',
      'actionVerificationFormData'
    ]),
    onClose() {
      if (this.isSlider) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$emit('close');
          }, 280)
        });
        this.sliderClass = 'slider-close slider'
      } else {
        if (this.redirect) {
          switch (this.redirect) {
            case 'home':
              this.$router.push(`/mobile/`);
              return;
            case "deposit":
            case "withdraw":
            case "balanceTrans":
            case "wallet":
              this.$router.push(`/mobile/mcenter/${this.redirect}`);
              return;
            default:
              this.$router.back();
              return;
          }
        }

        this.$router.back();
        return;
      }
    },
    verification(key, index) {
      let target = this.formData[key];
      let errorMsg = '';
      if (key === "name") {
        const re = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF.．·]/g;
        target.value = target.value.replace(re, '');

        if (!target.value) {
          errorMsg = "请勿输入、数字空白及特殊符号"
        }
      }

      if (key === "withdraw_password") {
        let correct_value = target.value[index]
          .replace(' ', '')
          .trim()
          .replace(/[^\d+]$/g, '');

        if (target.value[index].length > 1) {
          target.value[index] = target.value[index].substring(0, 1);
        }

        if (target.value[index] === correct_value && correct_value !== '') {
          if (index < 3) {
            document.querySelector(`input[data-key="${key}_${index + 1}"]`).focus();
          }
        } else if (target.value[index] === correct_value && correct_value === '') {
          if (index > 0) {
            document.querySelector(`input[data-key="${key}_${index - 1}"]`).focus();
          }
        }
        target.value[index] = correct_value
      }

      if (key === "phone") {
        this.isVerifyPhone = target.value.length >= 11;

        if (!this.isVerifyPhone) {
          errorMsg = '手机格式不符合要求';
        }
        this.actionVerificationFormData({ target: 'phone', value: target.value }).then((res => {
          target.value = res;
        }));
      }

      if (key === "keyring") {
        this.actionVerificationFormData({ target: 'code', value: target.value }).then((res => {
          target.value = res;
        }));
      }

      let check = true;
      if (this.formData['name'].show && !this.formData['name'].value ||
        (this.formData['phone'].show && !this.formData['phone'].value) ||
        (this.formData['keyring'].show && !this.formData['keyring'].value && this.showKeyring)) {
        check = false;
      }

      if (this.formData['withdraw_password'].show) {
        for (let i = 0; i < 4; i++) {
          if (!this.formData['withdraw_password'].value[i]) {
            check = false;
            break;
          }
        }
      }

      this.checkFormData = check;
      target.msg = errorMsg;
    },
    showCaptchaPopup() {
      if (this.formData.phone.value === '') {
        return;
      }

      // 無認證直接呼叫
      if (this.memInfo.config.default_captcha_type === 0) {
        this.sendKeyring();
        return;
      }

      // 彈驗證窗並利用Watch captchaData來呼叫 getKeyring()
      this.toggleCaptcha = true;
    },
    // 回傳會員手機驗證簡訊剩餘秒數可以重送
    getPhoneTTL() {
      return axios({
        method: 'get',
        url: '/api/v1/c/player/phone/ttl',
      }).then(res => {
        if (res && res.data && res.data.result === "ok") {
          this.ttl = res.data.ret;
        }
      }).catch(error => {
        this.tipMsg = `${error.response.data.msg}`;
      })
    },
    sendKeyring() {
      this.isSendKeyring = true;
      this.tipMsg = '';

      axios({
        method: 'post',
        url: '/api/v1/c/player/verify/user_bank/sms',
        data: {
          phone: `${this.phoneHead}-${this.formData.phone.value}`,
          captcha_text: this.captchaData ? this.captchaData : ''
        }
      }).then(res => {
        if (this.timer) return;

        this.getPhoneTTL().then(() => {
          this.countdownSec = this.ttl;
          this.timer = setInterval(() => {
            if (this.countdownSec === 0) {
              clearInterval(this.timer);
              this.timer = null;
              if (this.tipMsg.indexOf('已发送')) {
                this.tipMsg = ''
              }
              return;
            }
            this.countdownSec -= 1;
          }, 1000);
          this.tipMsg = this.$text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", '五');
          this.isSendKeyring = false;
        })
      }).catch(error => {
        this.countdownSec = '';
        this.tipMsg = `${error.response.data ? error.response.data.msg : ''}`;
        this.isSendKeyring = false;

        if (error.response && error.response.status === 429) {
          this.tipMsg = "操作太频繁，请稍候在试";
          return;
        }
      })
    },
    sendFormData() {
      this.isSendForm = true;
      this.tipMsg = '';
      let param = {};

      Object.keys(this.formData).forEach(i => {
        if (this.formData[i].show) {
          if (i === "phone") {
            param[i] = this.phoneHead + '-' + this.formData['phone'].value;
          }
          else if (i === "withdraw_password") {
            param[i] = this.formData.withdraw_password.value.join('')
          }
          else {
            param[i] = this.formData[i].value;
          }
        }
      })

      axios({
        method: 'put',
        url: '/api/v1/c/player/info',
        data: param
      }).then(res => {
        this.isSendForm = false;
        if (res && res.data && res.data.result !== "ok") {
          this.tipMsg = res.data.msg;
          Object.keys(res.data.errors).forEach((item) => {
            this.formData[item].msg = res.data.errors[item];
          });
        } else {
          this.actionSetUserdata(true).then(() => {
            this.onClose();

            if (!this.checkBankSwitch) {
              this.$router.push(`/mobile/mcenter/bankCard?redirect=${this.redirect}&type=wallet`)
            }
          });
        }
      }).catch(error => {
        this.tipMsg = `${error.response.data.msg}`;
        this.isSendForm = false;
      })
    }
  },
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.index.scss" module="$style_ey1"></style>
