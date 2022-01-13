<template>
  <div
    :class="
      isClose ? [$style['dialog'], $style['dialog-close']] : $style['dialog']
    "
  >
    <div :class="[$style['earn-wrap'], $style['earn-wrap-ad']]">
      <div :class="[$style['title-coin'], $style['title-ad']]">
        <img
          :src="$getCdnPath('/static/image/porn1/activesBouns/coin_title.png')"
        />
      </div>
      <img
        :class="[$style['title-close']]"
        :src="
          $getCdnPath(
            `/static/image/porn1/activesBouns/${closeIconArr[closeIconIdx]}.png`
          )
        "
        @click="handleClose"
      />
      <img
        :class="$style['link-to-img']"
        :src="adData.AdPic"
        @click="handleLinkTo"
      />
    </div>
  </div>
</template>
<script>
import { getCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
import yaboRequest from "@/api/yaboRequest";
import mobileLinkOpen from "@/lib/mobile_link_open";
import Vue from "vue";

export default {
  props: {
    adData: {
      type: Object,
      default: null
    }
  },
  watch: {},
  data() {
    return {
      isShow: false,
      isClose: false,
      closeIconArr: [
        "ic_countdown_5",
        "ic_countdown_4",
        "ic_countdown_3",
        "ic_countdown_2",
        "ic_countdown_1",
        "ic_close"
      ],
      closeIconIdx: 0,
      timer: null
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      loginStatus: "getLoginStatus"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  mounted() {},
  beforeDestroy() {},
  created() {
    this.timer = setInterval(() => {
      if (this.closeIconIdx >= 5) {
        clearInterval(this.timer);
      } else {
        this.closeIconIdx += 1;
      }
    }, 1000);
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    mobileLinkOpen,
    handleClose() {
      if (this.closeIconIdx != 5) {
        return;
      }
      this.isClose = true;
      setTimeout(() => {
        this.$emit("close");
        this.isClose = false;
      }, 300);
    },
    handleLinkTo() {
      // localStorage.setItem("iframe-third-url", this.adData.AdUrl);
      // this.$router.push(`/mobile/iframe/home`);
      // this.adData = { AdUrl: "https://yb01.666uxm.com/p/2106250001" };

      let usmCode = this.adData.AdUrl.split("/")[
        this.adData.AdUrl.split("/").length - 1
      ];
      usmCode = usmCode.split("?")[0];

      this.getPromotionList(usmCode);
    },
    getPromotionList(id) {
      this.promotionId = +id;
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Promotion/List`,
        params: {
          tabId: 0
        }
      }).then(res => {
        if (res && res.data) {
          let linkData = res.data.ret.find(data => {
            return data.id === this.promotionId;
          });
          if (linkData) {
            localStorage.setItem("iframe-third-url", linkData.link);
            localStorage.setItem("iframe-third-url-title", linkData.name);
            this.$router.push(`/mobile/iframe/usm`);
            // this.mobileLinkOpen({
            //   linkType: "mi",
            //   linkTitle: linkData.name,
            //   linkTo: linkData.link
            // });
          } else {
            localStorage.setItem("iframe-third-url", this.adData.AdUrl);
            localStorage.setItem("iframe-third-url-title", "  ");
            this.$router.push(`/mobile/iframe/usm`);
            // this.mobileLinkOpen({
            //   linkType: "mi",
            //   linkTitle: "    ",
            //   linkTo: this.adData.AdUrl
            // });
          }
        }
      });
    }
  }
};
</script>
<style src="../index.scss" lang="scss" module></style>
