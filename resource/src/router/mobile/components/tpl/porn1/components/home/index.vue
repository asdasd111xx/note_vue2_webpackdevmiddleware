<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" class="content-wrap">
      <template v-if="['sp1'].includes(siteConfig.ROUTER_TPL)">
        <div
          id="home-top-bg"
          :class="$style['top-bg']"
          :style="{
            'background-image': `url(${`/static/image/${siteConfig.ROUTER_TPL}/common/pic_top.png`})`
          }"
        />
      </template>
      <home-slider />
      <home-new />
      <home-content />
      <envelope
        v-if="needShowRedEnvelope"
        @closeEvelope="closeEvelope"
        :redEnvelopeData="redEnvelopeData"
      />
    </div>
  </mobile-container>
</template>

<script>
import { getCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import homeContent from "./components/homeContent";
import homeNew from "@/router/mobile/components/common/home/homeNew";
import homeSlider from "@/router/mobile/components/common/home/homeSlider";
import mobileContainer from "../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    homeSlider,
    homeNew,
    homeContent,
    envelope: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/home/redEnvelope"
      )
  },
  data() {
    return {
      updateBalance: null,
      needShowRedEnvelope: false,
      redEnvelopeData: {}
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      loginStatus: "getLoginStatus",
      showRedEnvelope: "getShowRedEnvelope"
    }),
    headerConfig() {
      return {
        hasLogo: true,
        hasMemInfo: true,
        hasSearchBtn: false,
        onClick: () => {
          this.onClick();
        }
      };
    }
  },
  watch: {
    showRedEnvelope() {
      // if(this.showRedEnvelope.data.status != -1){
      this.needShowRedEnvelope = true;
      this.redEnvelopeData = this.showRedEnvelope;
      // }
    }
  },
  mounted() {
    this.updateBalance = setInterval(() => {
      let cid = getCookie("cid");

      if (!cid) {
        clearInterval(this.updateBalance);
        this.updateBalance = null;
      } else {
        this.actionSetUserBalance();
      }
    }, 30000);
  },
  beforeDestroy() {
    clearInterval(this.updateBalance);
    this.updateBalance = null;
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionSetPost",
      "actionSetUserBalance",
      "actionSetUserdata",
      "actionSetShowRedEnvelope"
    ]),
    onClick() {
      this.$router.push("/mobile");
    },
    closeEvelope() {
      this.needShowRedEnvelope = false;
      this.actionSetGlobalMessage({
        msg: "红包派发中，到帐后即可畅玩游戏"
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: #fff;
}

.top-bg {
  // background: url("/static/image/sp1/common/pic_top.png");
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  height: 120px;
  width: 100%;
  max-width: $mobile_max_width;
  top: 0;
  z-index: 0;
  position: absolute;
}
</style>
