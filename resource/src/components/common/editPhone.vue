<template>
  <div>
    <slot
      :country-codes="countryCodes"
      :old-phone="oldPhone"
      :new-phone="newPhone"
      :check-code="checkCode"
      :send-btn="sendBtn"
      :countdown-sec="countdownSec"
      :on-send="onSend"
      :on-submit="onSubmit"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import mcenter from '@/api/mcenter';
import ajax from '@/lib/ajax';

export default {
  props: {
    info: {
      type: Object,
      required: true
    },
    oldCode: {
      type: String,
      required: true
    },
    oldValue: {
      type: String,
      required: true
    },
    newCode: {
      type: String,
      required: true
    },
    newValue: {
      type: String,
      required: true
    },
    codeValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timer: '',
      countdownSec: 0,
      options: []
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
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
        label: this.$text('S_SMS_RECEPTION'),
        isShow: this.info.verification,
        countdownSec: this.countdownSec
      };
    }
  },
  created() {
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
        this.$emit('update:newCode', ret[0]);
        this.$emit('update:oldCode', ret[0]);
      }
    });
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetWithdrawCheck'
    ]),
    locker() {
      if (this.countdownSec === 0) {
        this.countdownSec = 60;
      }

      this.timer = setInterval(() => {
        if (this.countdownSec === 0) {
          clearInterval(this.timer);
          return;
        }
        this.countdownSec -= 1;
      }, 1000);
    },
    onSend() {
      if (this.countdownSec) {
        return Promise.resolve({ status: false });
      }

      const getOldPhone = () => {
        if (this.fieldValue) {
          return this.info.status === 'ok' ? `${this.newCode.replace('+', '')}-${this.newValue}` : `${this.oldCode.replace('+', '')}-${this.oldValue}`;
        }

        return '';
      };

      const result = {
        status: false,
        msg: ''
      };

      return mcenter.accountPhoneSend({
        params: {
          old_phone: getOldPhone(),
          phone: `${this.newCode.replace('+', '')}-${this.newValue}`
        },
        success: () => {
          this.actionSetUserdata(true);
          this.locker();
          result.status = true;
          result.msg = this.$text('S_SEND_CHECK_CODE_PHONE');
        }
      }).then(() => result).catch(() => result);
    },
    onSubmit() {
      const result = {
        status: false,
        msg: ''
      };

      // 驗證手機
      if (this.info.verification) {
        return mcenter.accountPhoneCheck({
          params: {
            phone: `${this.newCode.replace('+', '')}-${this.newValue}`,
            keyring: this.codeValue
          },
          success: () => {
            this.actionSetUserdata(true);
            this.actionSetWithdrawCheck();
            result.status = true;
            result.msg = this.$text('S_CR_SUCCESS');
          }
        }).then(() => result).catch(() => result);
      }

      // 不驗證直接設定手機
      return mcenter.accountPhoneEdit({
        params: {
          phone: `${this.newCode.replace('+', '')}-${this.newValue}`
        },
        success: () => {
          this.actionSetUserdata(true);
          result.status = true;
          result.message(this.$text('S_EDIT_SUCCESS'));
        }
      }).then(() => result).catch(() => result);
    }
  }
};
</script>
