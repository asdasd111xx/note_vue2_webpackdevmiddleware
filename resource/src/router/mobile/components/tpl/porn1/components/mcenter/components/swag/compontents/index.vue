<template>
  <div>
    <div :class="[$style['tab-wrap']]">
      <div
        v-for="(item, index) in tabItem"
        :ref="item.key"
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
        :class="[$style['active-slider'], $style[themeTPL]]"
        :style="{
          left: `calc(16.5% + 33% * ${currentTab})`
        }"
      />
    </div>

    <div :class="[$style['credit-trans-container']]">
      <component :is="currentTemplate" @handleLinkToSWAG="handleLinkToSWAG" />
    </div>
    <maintain-block
      v-if="maintainInfo"
      :content="maintainInfo"
      @close="handleCloseMaintainInfo"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../../common/mobileContainer";
import buyDiamond from './buyDiamond';
import recoardDiamond from './recoardDiamond';
import axios from 'axios';
import goLangApiRequest from '@/api/goLangApiRequest';
import mixin from "@/mixins/mcenter/swag/swag";
import maintainBlock from "@/router/mobile/components/common/maintainBlock";

export default {
  mixins: [mixin],
  components: {
    mobileContainer,
    buyDiamond,
    recoardDiamond,
    maintainBlock
  },
  data() {
    return {
      transferMoney: null,
      headerSetting: {
        title: this.$text("S_BUY_DIAMOND", "购买钻石"),
        prev: true,
        onClick: () => {
          localStorage.removeItem("tmp_d_1");
          localStorage.removeItem("tmp_d_currentSelRate");
          if (this.$route.query && this.$route.query.prev) {
            let prev = this.$route.query.prev;
            switch (prev) {
              case 'back':
              default:
                this.$router.back();
                return;
            }
          } else {
            this.$router.push('/mobile/mcenter/wallet');
          }
        },
      },
      currentTab: 0, //buy recoard
      currentTemplate: "buy-diamond",
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig'
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
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
    handleLinkToSWAG() {
      if (this.loginStatus) {
        this.checkSWAGMaintain({ linkTo: true, origin: 'mcenter/swag?tab=0' });
      } else {
        this.$router.push('/mobile/login');
        return;
      }
    },
    setCurrentTab(index) {

      switch (index) {
        default:
        case 0:
          this.currentTemplate = "buy-diamond";
          this.currentTab = index;
          // this.$router.replace(`/mobile/mcenter/swag?tab=${index}`);
          break;

        case 1:
          this.currentTemplate = "recoard-diamond";
          this.currentTab = index;
          // this.$router.replace(`/mobile/mcenter/swag?tab=${index}`);
          break;

        case 2:
          // 鴨博色播
          this.handleLinkToSWAG();
          break;
      }
    },
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";

.content-wrap {
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
}

.credit-trans-container {
  padding-top: 42px;
  z-index: 1;
}

.tab-wrap {
  display: flex;
  background: #fff;
  border-bottom: 2px solid #eee;
  position: fixed;
  width: 100%;
  max-width: $mobile_max_width;
  z-index: 10;

  .SWAG {
    font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #36e6d2;
  }
}

@media (orientation: landscape) {
  .tab-wrap {
    max-width: $mobile_max_landscape_width !important;
  }
}

.tab-item {
  position: relative;
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: #a6a9b2;
  width: 33%;

  &.is-current {
    color: #5e626d;
  }
}

.active-slider {
  position: absolute;
  width: 40px;
  height: 2px;
  bottom: 1.5px;
  transform: translateX(-50%);
  background: #be9e7f;
  left: calc(33% / 2 - 20px);
  transition: left 0.31s;

  &.sg1 {
    background: #e61938;
  }
}
</style>
