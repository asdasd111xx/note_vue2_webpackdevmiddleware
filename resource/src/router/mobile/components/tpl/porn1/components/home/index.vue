<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" class="content-wrap">
      <template v-if="['sp1', 'aobo1'].includes(siteConfig.ROUTER_TPL)">
        <div
          id="home-top-bg"
          :class="[$style['top-bg'], $style[routerTPL]]"
          :style="{
            'background-image': `url(${`/static/image/${siteConfig.ROUTER_TPL}/common/pic_top.png`})`
          }"
        />
      </template>

      <home-slider />
      <home-new />
      <home-content />
      <template v-for="(item, idx) in floatData">
        <home-draggable
          v-bind:key="idx"
          :floatData="item"
          :listIndex="idx"
          :totalCount="floatData.length"
        />
      </template>
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
import homeDraggable from "@/router/mobile/components/common/home/homeDraggable";
import mobileContainer from "../common/mobileContainer";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    mobileContainer,
    homeSlider,
    homeNew,
    homeDraggable,
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
      redEnvelopeData: {},
      floatData: {}
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      loginStatus: "getLoginStatus",
      showRedEnvelope: "getShowRedEnvelope"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
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

    this.getFloatList();
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
    },
    getFloatList() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Games/Float/Image/List`
      }).then(res => {
        // console.log(res);
        if (res.status === "000") {
          if (!localStorage.getItem("do-not-show-float-list")) {
            localStorage.setItem("do-not-show-float-list", JSON.stringify([]));
          }
          let notShowList = JSON.parse(
            localStorage.getItem("do-not-show-float-list")
          );
          this.floatData = res.data.filter(data => {
            return !notShowList.includes(data.id);
          });
        }
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
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  height: 120px;
  width: 100%;
  max-width: $mobile_max_width;
  top: 0;
  z-index: 0;
  position: absolute;

  &.sp1 {
    background: url("/static/image/sp1/common/pic_top.png");
    background-size: 100% 100%;
  }
  &.aobo1 {
    background: url("/static/image/aobo1/common/pic_top.png");
    background-size: 100% 100%;
  }
}
@media (orientation: landscape) {
  .top-bg {
    max-width: $mobile_max_landscape_width !important;
  }
}
</style>
