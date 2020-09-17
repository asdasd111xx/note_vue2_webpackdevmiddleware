<template>
  <div slot="content" :class="$style['content-wrap']">
    <account-header :header-config="headerConfig" />
    <!-- 錯誤訊息 -->
    <div :class="$style['top-tips']">
      <div v-show="tipMsg">
        {{ tipMsg }}
      </div>
    </div>
    <div :class="[$style.wrap, 'clearfix']">
      <template v-if="oldPhone.isShow">
        <div :class="$style.block">
          <div :class="$style.title">
            {{ oldPhone.label }}
          </div>
          <div :class="$style['input-wrap']">
            <input
              v-model="oldValue"
              :placeholder="oldPhone.label"
              :class="$style.input"
              @input="verification($event.target.value, 'oldValue')"
              type="tel"
            />
            <div :class="$style['clear-input']" v-if="oldValue">
              <img
                :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
                @click="oldValue = ''"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-if="newPhone.isShow">
        <div :class="$style.block">
          <div :class="$style.title">
            {{ newPhone.label }}
          </div>
          <div :class="$style['input-wrap']">
            <input
              v-model="newValue"
              :placeholder="
                $text('S_PLEASE_ENTER_MOBILE_NUMBER', '请输入手机号码')
              "
              :class="$style.input"
              @input="verification($event.target.value, 'newValue')"
              type="tel"
            />
            <div :class="$style['clear-input']" v-if="newValue">
              <img
                :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
                @click="newValue = ''"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-if="checkCode.isShow || isfromWithdraw">
        <div :class="$style.block">
          <div :class="$style.title">
            手机验证码
          </div>
          <div :class="$style['input-wrap']">
            <input
              v-model="codeValue"
              :placeholder="$text('S_MOBILE_CAPTCHA', '请输入手机验证码')"
              :class="$style.input"
              @input="verification($event.target.value, 'code')"
              type="tel"
            />
            <div :class="$style['clear-input']" v-if="codeValue">
              <img
                :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
                @click="codeValue = ''"
              />
            </div>
            <div
              v-if="sendBtn.isShow"
              :class="[
                $style['btn-send'],
                { [$style.active]: isVerifyPhone && !timer }
              ]"
              @click="showCaptchaPopup"
            >
              <template>
                <span v-if="sendBtn.countdownSec">{{
                  `${countdownSec}s`
                }}</span>
                <span v-else> {{ sendBtn.label }} </span>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>

    <popup-verification
      v-if="isShowCaptcha"
      :is-show-captcha.sync="isShowCaptcha"
      :captcha.sync="captchaData"
    />
    <service-tips :type="'phone'" />
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import ajax from '@/lib/ajax';
import member from '@/api/member';
import serviceTips from '../../serviceTips';
import mcenter from '@/api/mcenter';
import popupVerification from '@/components/popupVerification';
import accountHeader from '../../accountHeader';
import { getCookie, setCookie } from '@/lib/cookie';

export default {
  components: {
    serviceTips,
    popupVerification,
    accountHeader
  },
  data() {
    return {
      // 國碼固定
      oldCode: '+86',
      newCode: '+86',
      oldValue: '',
      newValue: '',
      codeValue: '',
      tipMsg: '',
      countdownSec: 0,
      options: {},
      isLock: false,
      timer: null,
      ttl: 60,
      isSendSMS: false,
      isVerifyPhone: false,
      info: {
        key: 'phone',
        text: 'S_TEL',
        status: '',
        value: '',
        verification: false,
        isShow: true
      },
      toggleCaptcha: false,
      captcha: null
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      webInfo: 'getWebInfo',
      siteConfig: "getSiteConfig",
    }),
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
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
    isfromWithdraw() {
      const { query } = this.$route;
      let redirect = query.redirect;
      if (redirect) {
        switch (redirect) {
          case "withdraw":
            return true;
          default:
            return false;
        }
      }
    },
    headerConfig() {
      let _funcBtnActive = true;
      let checkActiveArray = [this.newValue];
      //  提現前驗證不需要舊手機欄位
      if (this.checkCode.isShow || this.isfromWithdraw) {
        checkActiveArray.push(!!(this.codeValue));
      }

      if (this.memInfo.phone.phone && !this.isfromWithdraw) {
        checkActiveArray.push(!!(this.oldValue));
      }

      checkActiveArray.forEach((status) => {
        if (!status) _funcBtnActive = false;
      })

      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text('S_TEL', '手机号码'),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text('S_COMPLETE', '完成'),
        funcBtnActive: _funcBtnActive
      };
    },
    countryCodes() {
      return {
        label: this.$text('S_COUNTRY_CODE', '国码'),
        isShow: true,
        options: this.options
      };
    },
    oldPhone() {
      return {
        label: this.$text('S_ORIGINAL_PHONE'),
        isShow: this.isfromWithdraw ? false : this.memInfo.phone.phone
      };
    },
    newPhone() {
      return {
        label: this.memInfo.phone.phone && !this.isfromWithdraw
          ? this.$text('S_NEW_PHONE')
          : this.$text('S_TEL'),
        isShow: true
      };
    },
    checkCode() {
      return {
        label: this.$text('S_CHECK_CODE'),
        isShow: this.info.verification
      };
    },
    sendBtn() {
      return {
        label: this.$text('S_GET_VERIFICATION_CODE', '获取验证码'),
        isShow: this.info.verification || this.isfromWithdraw,
        countdownSec: this.countdownSec
      };
    }
  },
  watch: {
    captchaData(val) {
      this.handleSend()
    },
    oldValue() {
      if (this.oldValue.length >= 11) {
        this.tipMsg = '';
      } else {
        this.tipMsg = '手机格式不符合要求'
      }
    },
    newValue() {
      if (this.newValue.length >= 11) {
        this.tipMsg = '';
        this.isVerifyPhone = true;
      } else {
        this.tipMsg = '手机格式不符合要求'
        this.isVerifyPhone = false;
      }
    }
  },
  mounted() {
    this.countdownSec = "";
    clearInterval(this.timer);
    this.timer = null;
  },
  created() {
    ajax({
      method: 'get',
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then((response) => {
      if (response && response.result === 'ok') {
        this.info.verification = response.ret.config[this.info.key].code;
      }
    });

    // 手機區碼
    // ajax({
    //   method: 'get',
    //   url: '/api/v1/c/player/country_codes',
    //   success: ({ result, ret }) => {
    //     if (result !== 'ok') {
    //       return;
    //     }

    //     this.options = ret;

    //     // this.$emit('update:newCode', ret[0]);
    //     // this.$emit('update:oldCode', ret[0]);
    //   }
    // });
  },
  beforeDestroy() {
    this.countdownSec = "";
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetWithdrawCheck',
      'actionVerificationFormData'
    ]),
    verification(value, target) {
      if (target === 'newValue' || target === 'oldValue') {
        this.actionVerificationFormData({ target: 'phone', value: value }).then((val => {
          if (target === "newValue") {
            this.newValue = val;
          }

          if (target === "oldValue") {
            this.oldValue = val;
          }
        }));
      }

      if (target === 'code') {
        this.actionVerificationFormData({ target: 'code', value: value }).then((val => {
          this.codeValue = val;
        }));
      }
    },
    locker() {
      if (this.timer) return;
      this.countdownSec = this.ttl;
      this.tipMsg = this.$text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", '五');

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
    },
    showCaptchaPopup() {
      if (this.newValue === '') {
        return;
      }

      // 無認證直接呼叫
      if (this.memInfo.config.default_captcha_type === 0) {
        this.handleSend();
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
    handleSend() {
      if (!this.newValue || this.timer || this.isSendSMS) return;

      this.isSendSMS = true;
      let captchaParams = {};
      captchaParams['captcha_text'] = this.captchaData || "";

      if (this.isfromWithdraw) {
        axios({
          method: 'post',
          url: '/api/v1/c/player/withdraw/verify/sms',
          data: {
            phone: `${this.newCode.replace('+', '')}-${this.newValue}`,
            ...captchaParams,
          }
        }).then(res => {
          if (res && res.data && res.data.result === "ok") {
            this.getPhoneTTL().then(() => {
              this.toggleCaptcha = false;
              this.locker();
              this.isSendSMS = false;
            })
          } else {
            this.tipMsg = res.data.msg;
          }
        }).catch(error => {
          this.toggleCaptcha = false;
          this.countdownSec = '';
          this.tipMsg = `${error.response.data.msg}`;
          this.isSendSMS = false;
        })
      } else {
        axios({
          method: 'post',
          url: '/api/v1/c/player/verify/phone',
          data: {
            old_phone: this.memInfo.phone.phone ? `${this.newCode.replace('+', '')}-${this.oldValue}` : '',
            phone: `${this.newCode.replace('+', '')}-${this.newValue}`,
            ...captchaParams,
          }
        }).then(res => {
          if (res && res.data && res.data.result === "ok") {
            this.getPhoneTTL().then(() => {
              this.locker();
              this.toggleCaptcha = false;
              this.isSendSMS = false;
            })
          } else {
            this.tipMsg = res.data.msg;
          }
        }).catch(error => {
          this.toggleCaptcha = false;
          this.countdownSec = '';
          this.tipMsg = `${error.response.data.msg}`;
          this.isSendSMS = false;
        })
      }
    },
    handleSubmit() {
      // 提款手機驗證
      if (this.isfromWithdraw) {
        ajax({
          method: 'put',
          url: '/api/v1/c/player/withdraw/sms/verify',
          errorAlert: false,
          params: {
            keyring: this.codeValue
          },
          fail: (res) => {
            this.tipMsg = `${res.data.msg}`;
          },
          success: (res) => {
            if (res && res.result === 'ok') {
              localStorage.setItem('tmp_w_1', res.ret);
              this.$router.push('/mobile/mcenter/withdraw');
            }
          }
        })
      } else {
        // 驗證手機
        if (this.info.verification) {
          return mcenter.accountPhoneCheck({
            params: {
              old_phone: this.memInfo.phone.phone ? `${this.newCode.replace('+', '')}-${this.oldValue}` : '',
              phone: `${this.newCode.replace('+', '')}-${this.newValue}`,
              keyring: this.codeValue
            },
            success: (res) => {
              this.actionSetWithdrawCheck();
              setTimeout(() => {
                localStorage.setItem('set-account-success', true);
                this.$router.push('/mobile/mcenter/accountData?success=true');
              }, 200)
            },
            fail: (res) => {
              this.tipMsg = `${res.data.msg}`;
            }
          });
        }

        // 不驗證直接設定手機
        return mcenter.accountPhoneEdit({
          params: {
            phone: `${this.newCode.replace('+', '')}-${this.newValue}`
          },
          success: () => {
            setTimeout(() => {
              localStorage.setItem('set-account-success', true);
              this.$router.push('/mobile/mcenter/accountData');
            }, 200)
          },
          fail: (res) => {
            this.tipMsg = `${res.data.msg}`;
          }
        });
      }
    },
  }
};
</script>

<style lang="scss" src="../../../css/index.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../../../css/ey1.module.scss" module="$style_ey1"></style>

