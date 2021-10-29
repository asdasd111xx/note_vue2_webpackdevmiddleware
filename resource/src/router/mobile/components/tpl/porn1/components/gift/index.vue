<template>
  <mobile-container :class="$style.container">
    <div slot="content" class="content-wrap">
      <div :class="$style['header-title']">
        <img
          :src="
            $getCdnPath(
              `/static/image/common/btn_back_${
                themeTPL === 'porn1'
                  ? 'grey'
                  : themeTPL === 'ey1'
                  ? 'white'
                  : themeTPL === 'sg1'
                  ? 'black'
                  : null
              }.png`
            )
          "
          @click="goBack"
        />
        {{ giftTitle }}
      </div>
      <!-- <iframe-content :src="giftIfrUrl"/> -->
      <iframe :style="giftIfrStyle" :src="giftIfrUrl"></iframe>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../common/mobileContainer";
import * as siteConfigOfficial from "@/config/siteConfig/siteConfigOfficial";
import goLangApiRequest from "@/api/goLangApiRequest";
// import iframeContent from "@/router/mobile/components/common/iframe";

export default {
  components: {
    mobileContainer
    // iframeContent
  },
  data() {
    return {
      url: "",
      giftTitle: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    giftIfrUrl() {
      return `/mobile/iframe/gift?alias=specific_promotion&fullscreen=false&hasHeader=false`;
    },
    giftIfrStyle() {
      return {
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        border: "none"
      };
    },
    routerTPL() {
      //先用ROUTER_TPL判斷aobo
      return this.siteConfig.ROUTER_TPL;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    goBack() {
      if (this.$router.history.current.path == "/mobile/gift") {
        window.history.back();
      } else {
        this.$router.push("/mobile");
      }
    }
  },

  created() {
    localStorage.removeItem("iframe-third-url-title");

    let header = {};
    if (this.routerTPL === "aobo1") {
      //因為澳博目前沒有這支"/xbb/Link/External/Url" api,所以先用鴨博代替
      header = { "x-domain": "500015" };
    }

    goLangApiRequest({
      method: "get",
      url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
      headers: header,
      params: {
        lang: "zh-cn",
        urlName: "specific_promotion",
        needToken: false
      }
    }).then(res => {
      if (res.status === "000") {
        this.url = res.data.uri;

        //取得優小祕優惠頁面標題
        goLangApiRequest({
          method: "get",
          headers: header,
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Promotion/List`,
          params: {
            lang: "zh-cn"
          }
        }).then(res => {
          if (res.status === "000") {
            let promotionId = this.url.split("?")[0].split("/")[
              this.url.split("?")[0].split("/").length - 1
            ];

            res.data.ret.forEach(promo => {
              if (promo.link.includes(promotionId)) {
                this.giftTitle = promo.name;
                localStorage.setItem("iframe-third-url-title", promo.name);
              }
            });
          }
        });
      } else {
        this.actionSetGlobalMessage({
          msg: res.msg || res.data,
          code: res.errodCode
        });
      }
    });
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: $main_background_white1;
}

.header-title {
  width: 100%;
  height: 52px;
  background-color: #fff;
  font-size: 1.15rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 0, 0, 0.05);

  img {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 15px;
  }
}
</style>
