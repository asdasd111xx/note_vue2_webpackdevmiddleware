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
      <div>●&nbsp;单笔转让不得少于199元</div>
      <div>●&nbsp;完成提现流水要求，额度转让即赠返利1%</div>
      <div>●&nbsp;未完成提现流水要求，额度转让无返利</div>
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
  components: {
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
  },
  created() {

  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      'actionSetGlobalMessage'
    ]),
    setCurrentTab(index) {

    },
  }
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
