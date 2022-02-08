<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['']">
      <div :class="$style['custom-footer']">
        <div :class="$style['custom-footer-content']">
          <img
            :src="$getCdnPath(`/static/image/sg1/live/bar_ic_diamond.png`)"
          />
          <span :class="$style['custom-footer-money']">{{
            "123,456.000"
          }}</span>
          <div :class="$style['custom-footer-btn']">
            <div>{{ $text("S_EXCHANGE") }}</div>
          </div>
        </div>
        <div :class="$style['hover']" />
        <div :class="$style['custom-footer-content']">
          <img :src="$getCdnPath(`/static/image/sg1/live/bar_ic_gold.png`)" />
          <span :class="$style['custom-footer-money']">{{
            "123,456.000"
          }}</span>
          <div :class="$style['custom-footer-btn']">
            <div>{{ $text("S_DEPOSIT_BTN") }}</div>
          </div>
        </div>
      </div>

      <div v-show="showBuyTip" :class="$style['buy-tips-wrap']"></div>
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../../common/mobileContainer";
import openGame from "@/lib/open_game";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    mobileContainer
  },
  data() {
    return {
      showBuyTip: false
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: "商城"
      };
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    click() {}
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";

.custom-footer {
  background: #000000;
  bottom: 0;
  margin: 0 auto;
  max-width: $mobile_max_width;
  height: 90px;
  position: fixed;
  transition: unset !important;
  width: 100%;
  z-index: 5;
}

.custom-footer-money {
  font-size: 12px;
  font-family: Acumin Pro, Acumin Pro-Regular;
  font-weight: 400;
  text-align: right;
  color: #ffffff;
  letter-spacing: 0px;
  margin-left: 14px;
}

.custom-footer-content {
  align-items: center;
  display: inline-flex;
  height: 40px;
  padding: 0 17px;

  > img {
    width: 17px;
    height: 17px;
  }
}

.custom-footer-btn {
  text-align: center;
  display: inline-block;
  width: 40px;
  opacity: 1;
  background: linear-gradient(180deg, #ffcd5c, #c48800);
  border-radius: 13px;
  margin-left: 7px;

  > div {
    font-size: 12px;
    font-family: Acumin Pro, Acumin Pro-Regular;
    font-weight: 400;
    text-align: center;
    color: #000000;
    letter-spacing: 0px;
  }
}

.hover {
  width: 1px;
  background: white;
  height: 20px;
  display: inline-flex;
}
</style>
