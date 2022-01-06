<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['content-wrap']">
      <balanceBack :has-link="true" />

      <balanceTrans
        :is-show-block-tips.sync="isShowBlockTips"
        :is-show-more-out.sync="isShowMoreOut"
      />
      <blockListTips
        v-if="isShowBlockTips"
        type="transfer"
        @close="closeTips"
      />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceBack from "../../../mcenter/components/common/balanceBack";
import balanceTrans from "./components/index";
import blockListTips from "../../../common/blockListTips";
// import swagBlock from "./components/swagBlock";
import mobileContainer from "../../../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    blockListTips,
    balanceTrans,
    balanceBack
    // swagBlock
  },
  data() {
    return {
      isShowBlockTips: false,
      isShowMoreOut: true,
      title: this.$route.query.title ? `title=${this.$route.query.title}` : ""
    };
  },
  created() {
    if (this.$route.query.more !== undefined && this.$route.query.more !== "") {
      this.isShowMoreOut = JSON.parse(this.$route.query.more.toLowerCase());
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    headerConfig() {
      return {
        title: this.$text("S_transfer", "转帐"),
        prev: true,
        onClick: () => {
          if (
            this.$route.query.more != undefined &&
            this.$route.query.more !== ""
          ) {
            if (this.$route.query.title === "wallet") {
              this.$router.push("/mobile/mcenter/wallet");
            } else {
              this.$router.push("/mobile");
            }
          } else {
            this.$router.back();
          }
        },
        hasHelp: {
          url: `/mobile/mcenter/helpCenter?more=${this.isShowMoreOut}&${this.title}`
        }
      };
    }
  },
  methods: {
    closeTips() {
      this.isShowBlockTips = false;
      this.$router.back();
    }
  }
};
</script>
<style lang="scss" module>
.content-wrap {
  position: relative;
  overflow-y: auto;
  padding-bottom: 60px;
  background: #eee;
}
</style>
