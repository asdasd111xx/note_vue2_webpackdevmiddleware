<template>
  <mobile-container :class="$style.container" :is-home="true">
    <div slot="content" class="content-wrap">
      <!-- <div :class="$style['top-bg']" /> -->
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
    </div>
  </mobile-container>
</template>

<script>
import { getCookie, setCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import homeContent from "./components/homeContent";
import homeNew from "@/router/mobile/components/common/home/homeNew";
import homeSlider from "@/router/mobile/components/common/home/homeSlider";
import homeDraggable from "@/router/mobile/components/common/home/homeDraggable";
import mcenter from "@/api/mcenter";
import mobileContainer from "../common/mobileContainer";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    mobileContainer,
    homeSlider,
    homeNew,
    homeDraggable,
    homeContent
  },
  data() {
    return {
      updateBalance: null,
      floatData: {}
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    })
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
    ...mapActions(["actionSetUserBalance", "actionSetUserdata"]),
    onClick() {
      this.$router.push("/mobile");
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

.top-bg {
  background: url("/static/image/ey1/common/pic_top.png");
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  height: 120px;
  width: 100%;
  max-width: $mobile_max_width;
  top: 0;
  position: absolute;
}

@media (orientation: landscape) {
  .top-bg {
    max-width: $mobile_max_landscape_width !important;
  }
}

div.container {
  background-color: #fff;
}
</style>
