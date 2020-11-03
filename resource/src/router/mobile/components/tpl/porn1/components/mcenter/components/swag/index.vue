<template>
  <mobile-container :header-config="headerSetting" :has-footer="false">
    <div slot="content" :class="[$style['content-wrap'], 'clearfix']">
      <div :class="[$style['tab-wrap']]">
        <div
          v-for="(item, index) in tabItem"
          :key="`tab-${item.key}`"
          :class="[
            $style['tab-item'],
            { [$style['is-current']]: currentTab === index },
            { [$style['SWAG']]: index === 2 }
          ]"
          @click="setCurrentTab(index)"
        >
          {{ item.text }}
        </div>
        <div
          :class="$style['active-slider']"
          :style="{
            left: `calc(16.5% + 33% * ${currentTab})`
          }"
        />
      </div>

      <div :class="[$style['credit-trans-container']]">
        <component :is="currentTemplate" />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../common/mobileContainer";
import buyDiamond from './compontents/buyDiamond';
import recoardDiamond from './compontents/recoardDiamond';
import axios from 'axios';

export default {
  components: {
    mobileContainer,
    buyDiamond,
    recoardDiamond,
  },
  data() {
    return {
      transferMoney: null,
      headerSetting: {
        title: this.$text("S_BUY_DIAMOND", "购买钻石"),
        prev: true,
        onClick: () => {
          this.$router.back();
        },
      },
      currentTab: 0, //buy recoard
      currentTemplate: "buy-diamond"
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
    }),
    tabItem() {
      return [
        {
          key: "buy",
          text: this.$text("S_DIAMOND_DISCOUNT", "钻石优惠"),
        },
        {
          key: "recoard",
          text: this.$text("S_DIAMOND_RECOARD", "钻石记录"),
        },
        {
          key: "linkToSWAG",
          text: '进入SWAG',
          text: this.$text("S_INTO_SWAG", "进入SWAG"),
        },
      ]
    },
  },
  created() {
    if (this.$route.query && this.$route.query.tab) {
      this.setCurrentTab(Number(this.$route.query.tab));
    } else {
      this.$router.replace(`/mobile/mcenter/swag?tab=0`);
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      'actionSetGlobalMessage',
      "actionGetRechargeStatus",
    ]),
    setCurrentTab(index) {

      switch (index) {
        default:
        case 0:
          this.currentTemplate = "buy-diamond";
          this.currentTab = index;
          this.$router.replace(`/mobile/mcenter/swag?tab=${index}`);

          break;
        case 1:
          this.currentTemplate = "recoard-diamond";
          this.currentTab = index;
          this.$router.replace(`/mobile/mcenter/swag?tab=${index}`);

          break;
        case 2:
          // 鴨博色播
          this.$router.push(`/mobile/iframe/SWAG?&title=鴨博色播&hasFooter=false&hasHeader=true`);
          break;
      }
    },
  }
};
</script>
<style lang="scss" src="./css/index.module.scss" module></style>
