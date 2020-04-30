<template>
  <transition :name="'fade'">
    <div :class="[$style['deposit-alert-wrap'], colorClass]">
      <div :class="$style['alert-wrap']">
        <div :class="$style['alert-title']">
          {{ $text("S_SUBMIT_DEPOSIT", "提交存款资料") }}
          <div :class="$style['alert-close-wrap']" @click="closeFuc(false)">
            <div>
              <icon name="times" width="20" height="20" />
            </div>
          </div>
        </div>
        <div :class="$style['alert-body-wrap']">
          <div :class="$style['detail-block']">
            <div :class="[$style['detail-cell']]">
              <div :class="[$style['title']]">
                {{ $text("S_ORDER_NUMBER", "订单号") }}
              </div>
              <div :class="$style['value']">{{ depositData.id }}</div>
            </div>
            <div :class="[$style['detail-cell']]">
              <div :class="[$style['title']]">
                {{
                  depositData.type_id === 6
                    ? $text("S_PAY_MODE", "支付方式")
                    : $text("S_USE_BANK", "使用银行")
                }}
              </div>
              <div :class="$style['value']">
                {{ depositData.bank_name }}
              </div>
            </div>
            <!-- <speed-pay-field
              :class-style="$style"
              :required-fields="requiredFields"
              :speed-field.sync="resultSpeedField"
              :method-id="depositData.method_id"
              :type-id="depositData.type_id"
            /> -->
            <div :class="[$style['detail-cell']]">
              <div :class="[$style['title']]">
                {{ $text("S_LAST_SUBMIT_TIME", "上次提交时间") }}
              </div>
              <div :class="$style['value']">
                {{
                  depositData.submit_at ||
                    $text("S_NOT_ENTER_SHORT", "尚未提交")
                }}
              </div>
            </div>
          </div>
          <div :class="$style['tip-time']">
            {{ $text("S_RECORD_TIP01", "将以您最后提交时的存款资料做审核") }}
          </div>
          <div :class="$style['btn-wrap']">
            <div :class="$style['cancel-btn']" @click="closeFuc(false)">
              {{ $text("S_CANCEL", "取消") }}
            </div>
            <div
              :class="[
                $style['confirm-btn'],
                { [$style.disabled]: isSubmitDisabled }
              ]"
              @click="saveDepositData"
            >
              {{ $text("S_ENTER_SHORT", "提交") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ajax from '@/lib/ajax';
import { API_TRADE_RELAY } from '@/config/api';
import { mapGetters } from 'vuex';

export default {
  components: {
  },
  props: {
    requiredFields: {
      type: Array,
      required: true
    },
    closeFuc: {
      type: Function,
      default: () => { }
    },
    depositData: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      speedField: {
        depositMethod: '',
        depositTime: '',
        depositAccount: '',
        depositName: '',
        bankBranch: '',
        serialNumber: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
    }),
    colorClass() {
      return [
        {
          [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
          [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
        }
      ];
    },
    resultSpeedField: {
      get() {
        return this.speedField;
      },
      set(value) {
        this.speedField[value.objKey] = value.data;
      }
    },
    isSubmitDisabled() {
      const checkItemMap = {
        method: {
          key: 'bankBranch'
        },
        deposit_at: {
          key: 'depositTime'
        },
        pay_account: {
          key: 'depositAccount'
        },
        pay_username: {
          key: 'depositName'
        },
        sn: {
          key: 'serialNumber'
        }
      };
      return this.requiredFields.find((item) => {
        const check = checkItemMap[item.name];

        // 存款方式不是存款方式不是ATM或銀行櫃台 則不需檢查銀行支行的必填
        if (item.name === 'method' && !['2', '4'].includes(this.speedField.depositMethod)) {
          return false;
        }

        return check && item.required && !this.speedField[check.key];
      });
    }
  },
  created() {
    this.speedField = {
      ...this.speedField,
      depositTime: this.depositData.deposit_at,
      depositAccount: this.depositData.pay_account,
      depositName: this.depositData.pay_username,
      depositMethod: String(this.depositData.method) || '1',
      bankBranch: this.depositData.branch,
      serialNumber: this.depositData.sn
    };
  },
  methods: {
    saveDepositData() {
      if (this.isSubmitDisabled) {
        return { status: 'ok' };
      }

      return ajax({
        method: 'put',
        url: API_TRADE_RELAY,
        errorAlert: true,
        params: {
          api_uri: `/api/trade/v2/c/entry/${this.depositData.id}/submit`,
          deposit_at: this.speedField.depositTime,
          pay_account: this.speedField.depositAccount,
          pay_username: this.speedField.depositName,
          method: this.speedField.depositMethod,
          branch: this.speedField.bankBranch,
          sn: this.speedField.serialNumber
        }
      }).then((response) => {
        this.closeFuc(false);

        if (response.result === 'ok') {
          // 流量分析事件 - 成功
          window.dataLayer.push({
            event: 'ga_click',
            eventCategory: 'deposit',
            eventAction: 'submit',
            eventLabel: 'success'
          });
          return;
        }

        // 流量分析事件 - 失敗
        window.dataLayer.push({
          event: 'ga_click',
          eventCategory: 'deposit',
          eventAction: 'submit',
          eventLabel: 'failure'
        });
      });
    }
  }
};
</script>
<style lang="scss" src="../../css/edit.module.scss" module></style>

