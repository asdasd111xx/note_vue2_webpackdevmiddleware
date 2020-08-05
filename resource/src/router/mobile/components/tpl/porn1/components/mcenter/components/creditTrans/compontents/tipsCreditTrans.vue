<template>
  <div :class="$style['tips']">
    <div :class="$style['title']">
      <div :class="$style['hr']"><div /></div>
      <div :class="$style['title-tips']">
        温馨提示，如需帮助
        <span :class="$style['link']" @click="$router.push('/mobile/service')">
          请联系客服
        </span>
      </div>
      <div :class="$style['hr']"><div /></div>
    </div>
    <div :class="$style['content']">
      <div>●&nbsp;限制代理转让给旗下会员</div>
      <div>●&nbsp;{{ tipContent1 }}</div>
      <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ tipContent1_desc }}</div>
      <div>●&nbsp;{{ tipContent2 }}</div>
      <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ tipContent2_desc }}</div>
      <div
        :class="$style['link']"
        @click="$router.push('/mobile/mcenter/help/withdraw?key=6')"
      >
        ●&nbsp;查看流水规则
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      tipContent1: "",
      tipContent1_desc: "",
      tipContent2: "",
      tipContent2_desc: "",
    }
  },
  computed: {
    ...mapGetters({
      rechargeConfig: 'getRechargeConfig',
    }),
  },
  methods: {
    ...mapActions([
      'actionSetRechargeConfig'
    ]),
  },
  created() {
    this.actionSetRechargeConfig();
  },
  mounted() {
    this.tipContent1 = `完成提现流水要求，额度转让即赠返利${this.rechargeConfig.recharger_offer_percent || 0}%，转让无上限`;
    this.tipContent1_desc = `单笔转让最低${this.rechargeConfig.recharge_limit}元、最高${this.rechargeConfig.recharge_limit}元`;

    this.tipContent2 = `未完成提现流水要求，额度转让无返利`;
    this.tipContent2_desc = `单笔转让最低${this.rechargeConfig.recharge_limit}元、最高${this.rechargeConfig.recharge_limit}元`;

    // this.tipContent2 = `未完成提现流水要求，额度转让无返利`;
  },
};
</script>
<style lang="scss"  module>
@import "../css/index.module.scss";

.tips {
  margin-top: 35px;
  color: #a6a9b2;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-size: 14px;
  font-weight: 400;
}

.hr {
  height: 24px;
  left: 0;
  top: 0;
  position: absolute;
  width: calc((100% - 240px) * 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 100%;
    height: 1px;
    background: #dddddd;
  }
}

.title {
  align-items: center;
  display: flex;
  height: 24px;
  justify-content: center;
  line-height: 24px;
  text-align: center;
  position: relative;

  .hr:last-of-type {
    left: unset;
    right: 0;
  }

  > .title-tips {
    width: 205px;
  }
}

.content {
  font-size: 12px;
  font-weight: 400;
  margin-top: 3px;
  padding: 0 20px;
  text-align: left;

  > div:not(:last-of-type) {
    margin-bottom: 2.5px;
  }
}

.link {
  color: #6aaaf5;
}
</style>
