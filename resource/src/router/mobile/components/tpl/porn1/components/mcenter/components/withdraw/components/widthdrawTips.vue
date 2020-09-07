<template>
  <!-- 提款前提示彈窗 -->
  <transition name="fade">
    <div v-if="show" :class="$style['check-wrap']">
      <div
        :class="[
          $style['check-container'],
          {
            [$style['deposit']]: type === 'deposit'
          }
        ]"
      >
        <div :class="$style['check-header']">
          <div :class="$style['title']">温馨提示</div>
          <div
            v-if="type === 'tips'"
            :class="$style['btn-close']"
            @click="closeTips"
          >
            <img
              :src="$getCdnPath('/static/image/_new/common/btn_close_w.png')"
              alt="close"
            />
          </div>
        </div>
        <div :class="$style['check-content']">
          <template v-if="type === 'tips'">
            <div :class="$style['time']">流水检查时间：{{ nowTime }}</div>
            <div :class="$style['hr']" />
            <div v-if="serialNumberData && serialNumberData.total">
              <div :class="$style['check-cell']">
                <span :class="$style['sub-title']">
                  流水要求
                </span>
                <span :class="$style['money']">
                  {{ serialNumberData.total.audit_amount }}
                </span>
              </div>
              <div :class="$style['check-cell']">
                <span :class="$style['sub-title']">
                  {{ $text("S_SERIAL_POOR", "流水不足") }}
                </span>
                <span :class="$style['money']">
                  {{ serialNumberData.total.audit_amount_lack }}
                </span>
              </div>

              <div :class="[$style['check-cell'], $style['check-total']]">
                <span :class="$style['sub-title']">
                  提现金额
                </span>
                <span :class="$style['money']">
                  {{ withdrawValue }}
                </span>
              </div>

              <div :class="$style['check-cell']">
                <span :class="$style['sub-title']">
                  {{ $text("S_DEDUCTION_MONEY", "扣除金额") }}
                  行政费用:({{ `${serialNumberData.administrative_rate}%` }})
                </span>
                <span :class="$style['money']">
                  {{ getDeductionNumber(serialNumberData.total.deduction) }}
                </span>
              </div>

              <div :class="$style['check-cell']">
                <span :class="$style['sub-title']">
                  {{ $text("S_FEE", "手续费") }}
                </span>
                <span :class="$style['money']">
                  {{ getDeductionNumber(serialNumberData.total.fee) }}
                </span>
              </div>

              <div :class="[$style['check-cell'], $style['check-total']]">
                <span :class="$style['sub-title']">
                  扣除总计
                </span>
                <span :class="$style['money']">
                  {{
                    getDeductionNumber(serialNumberData.total.total_deduction)
                  }}
                </span>
              </div>

              <div :class="[$style['check-cell'], $style['check-actual']]">
                <span :class="$style['sub-title']">
                  实际提现金额
                </span>
                <span :class="$style['money']">
                  {{ actualMoney.toFixed(2) }}
                </span>
              </div>

              <div
                v-if="selectedCard.withdrawType === 'crypto_id'"
                :class="[$style['check-cell'], $style['check-crypto']]"
              >
                <span :class="$style['sub-title']">
                  USDT到帐
                </span>
                <span :class="[$style['money'], $style['check-crypto']]">
                  {{ cryptoMoney }}
                </span>
              </div>
            </div>
          </template>
          <template v-if="type === 'deposit'">
            <div :class="$style['title']">只需充值一次 开通提现功能</div>
          </template>
        </div>

        <div :class="$style['check-button-wrap']">
          <div :class="$style['check-btn']" @click="handleCheckRule">
            查看规则
          </div>
          <div :class="$style['check-btn']" @click="handleBack">
            继续游戏
          </div>
          <div
            v-if="type === 'tips'"
            :class="[$style['check-btn'], $style['submit']]"
            @click="$emit('submit')"
          >
            确认提现
          </div>
          <div
            v-else="type === 'deposit'"
            :class="[$style['check-btn'], $style['submit']]"
            @click="$router.push('/mobile/mcenter/deposit')"
          >
            立即充值
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import mixin from "@/mixins/mcenter/withdraw/serialNumber";
import { mapGetters } from "vuex";

export default {
  mixins: [mixin],
  data() {
    return {};
  },
  props: {
    type: {
      type: String,
      default: "tips" //tip deposit
    },
    show: {
      type: Boolean,
      default: false
    },
    actualMoney: {
      type: Number,
      default: 0
    },
    cryptoMoney: {
      type: Number,
      default: 0
    },
    withdrawValue: {
      type: Number,
      default: 0
    },
    closeFunc: {
      type: Function
    },
    selectedCard: {
      type: Object,
      default: {}
    }
  },
  mounted() {},
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return (
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1
      );
    }
  },
  methods: {
    closeTips() {
      this.$emit("close");
    },
    handleCheckRule() {
      this.$emit("save", true);
      if (this.type === "tips") {
        this.$router.push("/mobile/mcenter/help/withdraw?&key=6");
      } else if (this.type === "deposit") {
        this.$router.push("/mobile/mcenter/help/withdraw?&key=0");
      }
    },
    handleBack() {
      if (this.type === "tips") {
        this.$router.push("/mobile/mcenter/wallet");
      } else if (this.type === "deposit") {
        this.$router.back();
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.getSerialNumberData();
      }
    }
  }
};
</script>

<style lang="scss" src="../css/index.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.module.scss" module="$style_ey1"></style>
