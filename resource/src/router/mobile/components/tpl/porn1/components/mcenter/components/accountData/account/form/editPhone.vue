<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
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
              {{ $text("S_MOBILE_NUMBER", "手机号码") }}
            </div>
            <div :class="$style['input-wrap']">
              <!-- <select
                v-model="oldCode"
                :class="[$style.select, $style['phone-select']]"
                :readonly="true"
                :disabled="true"
              >
                <template v-for="option in countryCodes.options">
                  <option
                    :key="option"
                    :value="option"
                    :selected="option == '+86'"
                    >{{ option }}</option
                  >
                </template>
              </select> -->
              <input
                v-model="oldValue"
                :placeholder="oldPhone.label"
                :class="$style.input"
                type="text"
              />
            </div>
          </div>
        </template>

        <template v-if="newPhone.isShow">
          <div :class="$style.block">
            <div :class="$style.title">
              {{ $text("S_MOBILE_NUMBER", "手机号码") }}
            </div>
            <div :class="$style['input-wrap']">
              <!-- <select
                v-model="newCode"
                :class="[$style.select, $style['phone-select']]"
                :readonly="true"
                :disabled="true"
              >
                <template v-for="option in countryCodes.options">
                  <option
                    :key="option"
                    :value="option"
                    :selected="option == '+86'"
                    >{{ option }}</option
                  >
                </template>
              </select> -->

              <input
                v-model="newValue"
                :placeholder="
                  $text('S_PLEASE_ENTER_MOBILE_NUMBER', '请输入手机号码')
                "
                :class="$style.input"
                type="text"
              />
            </div>
          </div>
        </template>

        <template v-if="checkCode.isShow">
          <div :class="$style.block">
            <div :class="$style.title">
              手机验证码
            </div>
            <div :class="$style['input-wrap']">
              <input
                v-model="codeValue"
                :placeholder="$text('S_MOBILE_CAPTCHA', '请输入手机验证码')"
                :class="$style.input"
                type="text"
              />

              <div
                v-if="sendBtn.isShow"
                :class="[
                  $style['btn-send'],
                  { [$style.active]: newValue && !timer }
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

      <popupVerification
        v-if="isShowCaptcha"
        :is-show-captcha.sync="isShowCaptcha"
        :captcha.sync="captchaData"
      />
      <!-- <service-tips /> -->
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import ajax from '@/lib/ajax';
import member from '@/api/member';
import mobileContainer from '../../../../../common/new/mobileContainer';
import serviceTips from '../../serviceTips';
import mcenter from '@/api/mcenter';
import popupVerification from '@/components/popupVerification';

export default {
  components: {
    mobileContainer,
    serviceTips,
    popupVerification
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
      info: {
        key: 'phone',
        text: 'S_TEL',
        status: '',
        value: '',
        verification: true,
        isShow: true
      },
      toggleCaptcha: false,
      captcha: null
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      webInfo: 'getWebInfo'
    }),
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
        funcBtnActive: !!(this.newValue)
      };
    },
    fieldValue() {
      return this.memInfo.phone.phone;
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
        isShow: this.fieldValue && this.info.status === 'already'
      };
    },
    newPhone() {
      return {
        label: this.fieldValue && this.info.status === 'already'
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
        isShow: this.info.verification,
        countdownSec: this.countdownSec
      };
    }
  },
  watch: {
    captchaData() {
      this.handleSend()
    }
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

    // 取驗證倒數秒數
    member.joinConfig({
      success: (response) => {
        // 從舊版複製過來，不良的寫法，後續再優化
        this.info.verification = response.ret.phone.code;

        if (response.ret.phone.code) {
          mcenter.accountPhoneSec({
            success: (data) => {
              if (data.ret > 0) {
                this.countdownSec = data.ret;
                this.locker();
              }
            }
          });
        }
      }
    });

    ajax({
      method: 'get',
      url: '/api/v1/c/player/country_codes',
      success: ({ result, ret }) => {
        if (result !== 'ok') {
          return;
        }

        this.options = ret;

        // this.$emit('update:newCode', ret[0]);
        // this.$emit('update:oldCode', ret[0]);
      }
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetWithdrawCheck',
      'actionSetＭcenterBindMessage'
    ]),
    locker() {
      if (this.countdownSec === 0) {
        this.countdownSec = 60;
      }

      this.timer = setInterval(() => {
        if (this.countdownSec === 0) {
          clearInterval(this.timer);
          this.timer = null;
          return;
        }
        this.countdownSec -= 1;
      }, 1000);
    },
    showCaptchaPopup() {
      // 無認證直接呼叫
      if(this.memInfo.config.default_captcha_type === 0) {
        this.handleSend()
        return
      }

      // 彈驗證窗並利用Watch captchaData來呼叫 getKeyring()
      this.toggleCaptcha = true
    },
    handleSend() {
      if (!this.newValue || this.timer) return;

      const getOldPhone = () => {
        if (this.fieldValue) {
          return this.info.status === 'ok' ? `${this.newCode.replace('+', '')}-${this.newValue}` : `${this.oldCode.replace('+', '')}-${this.oldValue}`;
        }

        return '';
      };

      if (this.isfromWithdraw) {
        ajax({
          method: 'post',
          url: '/api/v1/c/player/withdraw/verify/sms',
          errorAlert: false,
          params: {
            phone: `${this.newCode.replace('+', '')}-${this.newValue}`
          },
          fail: (res) => {
            this.countdownSec = '';
            this.tipMsg = res.data.msg;
          },
          success: (res) => {
            if (res && res.result === 'ok') {
              this.countdownSec = 60;
              this.actionSetUserdata(true);
              this.locker();
              this.tipMsg = this.$text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", 5)
            }
          }
        });
      } else {
        mcenter.accountPhoneSend({
          params: {
            old_phone: this.memInfo.phone.phone ? `${this.newCode.replace('+', '')}-${this.newValue}` : '',
            phone: `${this.newCode.replace('+', '')}-${this.newValue}`,
            captcha_text: this.captchaData ? this.captchaData : ''
          },
          success: () => {
            this.countdownSec = 60;
            this.actionSetUserdata(true);
            this.locker();
            this.tipMsg = this.$text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", 5)
          },
          fail: (res) => {
            this.countdownSec = '';
            this.tipMsg = res.data.msg;
          }
        });
      }
    },
    handleSubmit() {
      if (this.isfromWithdraw) {
        ajax({
          method: 'put',
          url: '/api/v1/c/player/withdraw/sms/verify',
          errorAlert: false,
          params: {
            keyring: this.codeValue
          },
          fail: (res) => {
            this.tipMsg = res.data.msg;
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
              phone: `${this.newCode.replace('+', '')}-${this.newValue}`,
              keyring: this.codeValue
            },
            success: (res) => {
              this.actionSetUserdata(true);
              this.actionSetWithdrawCheck();
              this.successMessage();
              this.$router.push('/mobile/mcenter/accountData');
            },
            fail: (res) => {
              this.tipMsg = res.data.msg;
            }
          });
        }

        // 不驗證直接設定手機
        return mcenter.accountPhoneEdit({
          params: {
            phone: `${this.newCode.replace('+', '')}-${this.newValue}`
          },
          success: () => {
            this.actionSetUserdata(true);
            this.successMessage();
            this.$router.push('/mobile/mcenter/accountData');
          },
          fail: (res) => {
            this.tipMsg = res.data.msg;
          }
        });
      }
    },
    successMessage() {
      this.actionSetＭcenterBindMessage({
        msg: this.$text('S_BIND_SUCCESSFULLY', '绑定成功'),
        msgIcon: true
      });
    }
  }
};
</script>
<style src="../../css/index.module.scss" lang="scss" module>
