<template>
  <div :class="sliderClass">
    <div :class="$style['serial-header']">
      <div :class="$style['btn-prev']">
        <img
          :src="$getCdnPath('/static/image/_new/common/btn_back.png')"
          @click="onClose()"
        />
      </div>
      <span :class="$style['title']">
        {{ $text("S_SERIAL_DETIAL", "流水详情") }}</span
      >
    </div>
    <div :class="[$style['serial-number-wrap']]">
      <div :class="$style['serial-time']">
        {{ $text("S_CHECK_TIME", "检查时间") }}：{{ nowTime }}
      </div>

      <div :class="[$style['basic-info-wrap'], 'clearfix']" v-if="data">
        <div :class="$style['serial-basic-cell']">
          <div :class="$style['serial-basic-title']">
            {{ $text("S_VALID_BET_TOTAL", "总有效投注") }}
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
            {{ data.deduction }}
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
import mixin from '@/mixins/mcenter/withdraw/serialNumber';

export default {
  mixins: [mixin],
  data() {
    return {
      sliderClass: 'slider',
      serialNumberList: [],
      isShow: true
    }
  },
  props: {
    handleClose: {
      type: Function,
      default: () => { }
    },
    data: {

    }
  },
  computed: {
    detailList() {
      return [{ title: this.$text('S_CREATED_TIME', '建立时间'), value: this.data.confirm_at },
      { title: this.$text('S_REMARK', '备注'), value: this.data.memo },
      { title: this.$text('S_TYPE', '类别'), value: this.data.opcode },
      { title: this.$text('S_DEPOSIT_MONEY', '存款金额'), value: this.data.amount },
      { title: this.$text('S_OFFER_MONEY', '优惠金额'), value: this.data.offer },
      ]
    },
    auditList() {
      return [[
        {
          title: this.$text('S_SERIAL_AUDIT', '稽核倍数'),
          rateValue: this.data.audit_rate,
          value: this.data.audit_amount        },
        {
          title: this.$text('S_SERIAL_NUMBER', '流水要求'),
          rateValue: this.data.total_audit_amount,
          value: this.data.deduction,
          deduction: this.$text('S_DEDUCTION_MONEY', '扣除金额')
        },
      ],
      [
        {
          title: this.$text('S_SERIAL_STATUS02', '优惠稽核'),
          rateValue: this.data.offer_audit_rate,
          value: this.data.offer_audit_amount
        },
        {
          title: this.$text('S_SERIAL_NUMBER', '流水要求'),
          rateValue: this.data.total_audit_amount,
          value: this.data.offer_deduction,
          deduction: this.$text('S_DEDUCTION_MONEY', '扣除金额')
        },
      ]]
    }
  },
  methods: {
    onClose() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.handleClose();
        }, 280)

      });
      this.sliderClass = 'slider-close slider'
    }
  },
};
</script>

<style lang="scss" src="./css/serialNumber.scss" module></style>
