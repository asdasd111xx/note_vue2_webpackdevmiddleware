<template>
  <transition :name="'fade'">
    <!-- 手動配卡提交資料彈窗 -->
    <div
      v-if="depositData.is_manual_card"
      :class="[$style['detail-alert-wrap']]"
    >
      <div :class="[$style['alert-wrap'], $style['deposit']]">
        <div :class="[$style['alert-title'], $style[siteConfig.ROUTER_TPL]]">
          {{ $text("S_SUBMIT_DEPOSIT", "提交资料") }}
          <div
            v-if="['aobo1', 'sp1'].includes(this.routerTPL)"
            :class="$style['alert-close-wrap']"
            @click="closeFuc(false)"
          >
            <icon name="times" width="20" height="20" />
          </div>
        </div>
        <div :class="$style['alert-body-wrap']">
          <div :class="$style['detail-block']">
            <div :class="[$style['detail-cell']]">
              <div :class="[$style['title']]">
                {{ $text("S_ORDER_NUMBER_2", "订单号") }}
              </div>
              <div :class="$style['value']">{{ depositData.id }}</div>
            </div>
            <!-- <div :class="[$style['detail-cell']]">
              <div :class="[$style['title']]">
                {{
                  depositData.type_id === 6
                    ? $text("S_PAY_MODE", "支付方式")
                    : $text("S_YOUR_BANK", "您的银行")
                }}
              </div>
              <div :class="$style['value']">
                {{ depositData.bank_name }}
              </div>
            </div> -->
            <speed-pay-field
              :class-style="$style"
              :required-fields="requiredFields"
              :speed-field.sync="resultSpeedField"
              :method-id="depositData.method_id"
              :type-id="depositData.type_id"
              :manual-card="depositData.is_manual_card"
            />
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
          <div :class="[$style['btn-wrap'], $style[siteConfig.ROUTER_TPL]]">
            <div :class="$style['cancel-btn']" @click="closeFuc(false)">
              {{ $text("S_CANCEL", "取消") }}
            </div>
            <div
              :class="[
                $style['confirm-btn'],
                {
                  [$style['disabled']]: manualCardSubmitDisabled
                },
                $style[siteConfig.ROUTER_TPL]
              ]"
              @click="saveDepositData"
            >
              {{ $text("S_ENTER_SHORT", "提交") }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 一般提交資料彈窗 -->
    <div v-else :class="[$style['detail-alert-wrap']]">
      <div :class="[$style['alert-wrap'], $style['deposit']]">
        <div :class="[$style['alert-title'], $style[siteConfig.ROUTER_TPL]]">
          {{ $text("S_SUBMIT_DEPOSIT", "提交资料") }}
          <div
            v-if="['aobo1', 'sp1'].includes(this.routerTPL)"
            :class="$style['alert-close-wrap']"
            @click="closeFuc(false)"
          >
            <icon name="times" width="20" height="20" />
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
                    : $text("S_YOUR_BANK", "您的银行")
                }}
              </div>
              <div :class="$style['value']">
                {{ depositData.bank_name }}
              </div>
            </div>
            <speed-pay-field
              :class-style="$style"
              :required-fields="requiredFields"
              :speed-field.sync="resultSpeedField"
              :method-id="depositData.method_id"
              :type-id="depositData.type_id"
            />
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
          <div :class="[$style['btn-wrap'], $style[siteConfig.ROUTER_TPL]]">
            <div :class="$style['cancel-btn']" @click="closeFuc(false)">
              {{ $text("S_CANCEL", "取消") }}
            </div>
            <div
              :class="[
                $style['confirm-btn'],
                { [$style.disabled]: isSubmitDisabled },
                $style[siteConfig.ROUTER_TPL]
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
import goLangApiRequest from "@/api/goLangApiRequest";
import { mapGetters, mapActions } from "vuex";
import Vue from "vue";

export default {
  components: {
    speedPayField: () =>
      import(
        /* webpackChunkName: 'speedPayField' */ "./components/speedPayField"
      )
  },
  props: {
    requiredFields: {
      type: Array,
      required: true
    },
    closeFuc: {
      type: Function,
      default: () => {}
    },
    depositData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      speedField: {
        depositMethod: "",
        depositTime: "",
        depositAccount: "",
        depositName: "",
        bankBranch: "",
        serialNumber: ""
      }
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    resultSpeedField: {
      get() {
        return this.speedField;
      },
      set(value) {
        this.speedField[value.objKey] = value.data;
      }
    },
    manualCardSubmitDisabled() {
      //手動配卡 圖片欄位未填寫時提交按鈕禁能
      if (this.depositData.is_manual_card && this.speedField.payUrl === "") {
        return true;
      }
      return false;
    },
    isSubmitDisabled() {
      if (!this.manualCardSubmitDisabled) {
        return;
      }
      const checkItemMap = {
        method: {
          key: "bankBranch"
        },
        deposit_at: {
          key: "depositTime"
        },
        pay_account: {
          key: "depositAccount"
        },
        pay_username: {
          key: "depositName"
        },
        sn: {
          key: "serialNumber"
        }
      };
      return this.requiredFields.find(item => {
        const check = checkItemMap[item.name];

        // 存款方式不是存款方式不是ATM或銀行櫃台 則不需檢查銀行支行的必填
        if (
          item.name === "method" &&
          !["2", "4"].includes(this.speedField.depositMethod)
        ) {
          return false;
        }

        return check && item.required && !this.speedField[check.key];
      });
    },
    localTime() {
      if (this.depositData.submit_at) {
        //api回傳時間 轉成 utc時間
        var utcDate = Vue.moment(this.depositData.submit_at)
          .add(4, "hours")
          .format("YYYY-MM-DD HH:mm:ss");

        // 現在當地時間的"時區"
        const now_timezone = Vue.moment(new Date()).utcOffset() / 60;

        //再轉成當地時間
        this.depositData.submit_at = Vue.moment(utcDate)
          .add(now_timezone, "hours")
          .format("YYYY-MM-DD HH:mm:ss");

        return this.depositData.submit_at;
      }
    }
  },
  created() {
    this.speedField = {
      ...this.speedField,
      depositTime: this.depositData.deposit_at,
      depositAccount: this.depositData.pay_account,
      depositName: this.depositData.pay_username,
      depositMethod: String(this.depositData.method) || "1",
      bankBranch: this.depositData.branch,
      serialNumber: this.depositData.sn,
      manualCard: this.depositData.manual_card,
      payUrl: this.depositData.pay_url
    };
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    saveDepositData() {
      if (this.isSubmitDisabled) {
        return { status: "ok" };
      }
      //一般充值
      const params = {
        remitEntryID: this.depositData.id,
        lang: "zh-cn",
        depositAt: this.speedField.depositTime,
        payAccount: this.speedField.depositAccount,
        payUsername: this.speedField.depositName,
        method: this.speedField.depositMethod,
        branch: this.speedField.bankBranch,
        sn: this.speedField.serialNumber
      };
      //手動配卡
      const m_params = {
        remitEntryID: this.depositData.id,
        lang: "zh-cn",
        depositAt: this.speedField.depositTime,
        pay_url: this.speedField.payUrl
      };

      //充值明細彈窗提交資料
      goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Entry/${this.depositData.id}/Submit`,
        params: this.depositData.is_manual_card ? m_params : params
      }).then(res => {
        this.closeFuc(false);
        if (res && res.status === "000") {
          // 流量分析事件 - 成功
          window.dataLayer.push({
            event: "ga_click",
            eventCategory: "deposit",
            eventAction: "submit",
            eventLabel: "success"
          });
          return;
        } else {
          this.actionSetGlobalMessage({ msg: res.msg });
          // 流量分析事件 - 失敗
          window.dataLayer.push({
            event: "ga_click",
            eventCategory: "deposit",
            eventAction: "submit",
            eventLabel: "failure"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" src="../../css/edit.module.scss" module></style>
