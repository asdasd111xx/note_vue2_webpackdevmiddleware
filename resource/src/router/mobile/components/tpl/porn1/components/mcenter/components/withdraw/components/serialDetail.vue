<template>
  <div :class="sliderClass">
    <div :class="[$style['serial-header'], [$style[theme]]]">
      <div :class="$style['btn-prev']">
        <img
          :src="
            $getCdnPath(
              `/static/image/common/btn_back_${
                themeTPL === 'porn1'
                  ? 'grey'
                  : themeTPL === 'ey1'
                  ? 'white'
                  : themeTPL === 'sg1'
                  ? 'black'
                  : null
              }.png`
            )
          "
          @click="onClose()"
        />
      </div>
      <span :class="$style['title']">
        {{ $text("S_SERIAL_DETIAL", "流水详情") }}</span
      >
    </div>
    <div :class="[$style['serial-number-wrap']]">
      <!-- <div :class="$style['serial-time']">
        {{ $text("S_CHECK_TIME", "检查时间") }}：{{ getNowTime() }}
      </div> -->

      <div :class="[$style['basic-info-wrap'], 'clearfix']" v-if="data">
        <div :class="$style['serial-basic-cell']">
          <div :class="$style['serial-basic-title']">
            {{ $text("S_VALID_BET", "有效投注") }}
          </div>
          <div :class="$style['serial-basic-value']">
            {{ data.effective_betting }}
          </div>
        </div>

        <div :class="$style['serial-basic-cell']">
          <div :class="$style['serial-basic-title']">
            {{ $text("S_DEDUCTION_MONEY", "扣除金额") }}
          </div>
          <div :class="$style['serial-basic-value']">
            {{ getDeductionNumber(data.deduction) }}
          </div>
        </div>
      </div>

      <div :class="[$style['detail-wrap'], 'clearfix']" v-if="data">
        <div v-for="item in detailList">
          <span>{{ item.title }} </span>
          <span>{{ item.value }} </span>
        </div>
      </div>

      <div v-for="list in auditList" :class="$style['detail-wrap']">
        <div v-for="item in list" :class="$style['audit-cell']">
          <span>
            <span>{{ item.title }} </span>
            <span>{{ item.rateValue }} </span>
          </span>
          <span
            >{{
              item.deduction
                ? item.deduction + ":" + item.value
                : item.rateValue === "-"
                ? "-"
                : item.value
                ? $text("S_COMPLETE", "完成")
                : $text("S_NOT_FINISH", "未完成")
            }}
          </span>
        </div>
      </div>

      <div :class="$style.tips">
        如需帮助，请
        <span @click="$router.push('/mobile/service')">联系客服</span>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/mixins/mcenter/withdraw/serialNumber";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [mixin],
  data() {
    return {
      sliderClass: "slider",
      serialNumberList: [],
      isShow: true
    };
  },
  props: {
    handleClose: {
      type: Function,
      default: () => {}
    },
    data: {}
  },
  created() {
    console.log(this.data);
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    detailList() {
      return [
        {
          title: this.$text("S_CREATED_TIME", "建立时间"),
          value: this.data.confirm_at
        },
        {
          title: this.$text("S_REMARK", "备注"),
          value: this.data.memo
        },
        {
          title: this.$text("S_TYPE", "类别"),
          value: this.data.opcode
        },
        { title: "充值金额", value: this.data.amount },
        {
          title: this.$text("S_OFFER_MONEY", "优惠金额"),
          value: this.data.offer
        }
      ];
    },
    auditList() {
      // 2020/09/15
      // 充值稽核倍数 audit_rate
      // 充值稽核扣除金額 administrative_amount
      // 充值稽核流水要求 audit_amount
      // 完成/未完成 administrative_checked

      // 优惠稽核倍数 offer_audit_rate
      // 優惠稽核扣除金額 offer
      // 優惠稽核流水要求 offer_audit_amount
      // 完成/未完成 offer_checked
      return [
        [
          {
            title: this.$text("S_SERIAL_AUDIT", "充值稽核倍数"),
            rateValue: this.data.audit_rate > 0 ? this.data.audit_rate : "-",
            value: this.data.administrative_checked
          },
          {
            title: this.$text("S_SERIAL_NUMBER", "流水要求"),
            rateValue:
              this.data.audit_amount > 0 ? this.data.audit_amount : "-",
            value: this.getDeductionNumber(this.data.administrative_amount),
            deduction: this.$text("S_DEDUCTION_MONEY", "扣除金额")
          }
        ],
        [
          {
            title: this.$text("S_SERIAL_STATUS02", "优惠稽核倍数"),
            rateValue:
              this.data.offer_audit_rate > 0 ? this.data.offer_audit_rate : "-",
            value: this.data.offer_checked
          },
          {
            title: this.$text("S_SERIAL_NUMBER", "流水要求"),
            rateValue:
              this.data.offer_audit_amount > 0
                ? this.data.offer_audit_amount
                : "-",
            value: this.getDeductionNumber(this.data.offer),
            deduction: this.$text("S_DEDUCTION_MONEY", "扣除金额")
          }
        ]
      ];
    }
  },
  methods: {
    onClose() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.handleClose();
        }, 280);
      });
      this.sliderClass = "slider-close slider";
    }
  }
};
</script>

<style lang="scss" src="../css/serialNumber.scss" module></style>
