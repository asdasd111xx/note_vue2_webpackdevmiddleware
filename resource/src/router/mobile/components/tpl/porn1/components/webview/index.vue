<template>
  <div :class="$style['content']">
    <div :class="$style['header']">
      <div :class="$style['header-background']">
        <img
          :src="
            $getCdnPath(`/static/image/${themeTPL}/webview/bg_service_app.png`)
          "
          alt="background"
        />
      </div>

      <div :class="$style['header-desc']">
        <div>我的客服</div>
        <div>24小时为您服务</div>
      </div>

      <div :class="$style['header-icon']">
        <div
          :class="$style['icon']"
          v-for="(item, index) in iconList"
          :key="index"
        >
          <div :class="$style['img']">
            <img :src="$getCdnPath(item.imgSrc)" alt="icon" />
          </div>
          <div :class="$style['text']">{{ item.text }}</div>
        </div>
      </div>
    </div>

    <div v-if="isIos" :class="$style['card-wrap']">
      <div
        v-for="(item, index) in iosCard"
        :key="'iOS-' + index"
        :class="$style['card']"
      >
        <div :class="$style['img']">
          <img
            :src="$getCdnPath(`/static/image/${themeTPL}/webview/appicon.png`)"
            alt="icon"
          />
        </div>
        <div>
          <div :class="$style['text']">{{ item.text }}</div>
          <div :class="$style['download']" @click="item.onClick">
            立即下载
          </div>
        </div>
      </div>
    </div>

    <div :class="$style['info-card']" @click="clickService">
      <div>
        <div>
          <img
            :src="$getCdnPath(`/static/image/common/webview/ic_service01.png`)"
          />
          &nbsp;
          <span>在线客服1</span>
        </div>
        <div>Main Customer Support</div>
        <div>7*24小时专线服务 贴心至上</div>
      </div>

      <div :class="$style['btn-next']">
        <img
          :src="
            $getCdnPath(`/static/image/common/webview/ic_service_arrow.png`)
          "
        />
      </div>
    </div>

    <div :class="$style['info-card2']" @click="clickService">
      <div>
        <div>
          <img
            :src="$getCdnPath(`/static/image/common/webview/ic_service02.png`)"
          />
          &nbsp;
          <span>在线客服2</span>
        </div>
        <div>Reserve Customer Support</div>
        <div>7*24小时专线服务 贴心至上</div>
      </div>

      <div :class="$style['btn-next']">
        <img
          :src="
            $getCdnPath(`/static/image/common/webview/ic_service_arrow.png`)
          "
        />
      </div>
    </div>
  </div>
</template>

<script>
import mobileLinkOpen from "@/lib/mobile_link_open";
import bbosRequest from "@/api/bbosRequest";
import yaboRequest from "@/api/yaboRequest";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isIos: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      downloadConfigData: [],
      downloadToggle: {},
      iconList: [
        {
          text: "多种玩法",
          imgSrc: "/static/image/common/webview/ic_service03.png"
        },
        {
          text: "存取便捷",
          imgSrc: "/static/image/common/webview/ic_service04.png"
        },
        {
          text: "专业客服",
          imgSrc: "/static/image/common/webview/ic_service05.png"
        }
      ],
      yaboIconSrc: "/static/image/common/webview/appicon_yabo.png"
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    iosCard() {
      return [
        {
          text: "极速版",
          isShow: this.downloadToggle.pwa,
          onClick: () => {
            let bundleID = "";
            switch (this.memInfo.user.domain) {
              // 鴨博
              case "500015":
              case "69":
              case "67":
                bundleID = "yaboxxxapp01.com.platformG";
                break;

              // 絲瓜
              case "500035":
              case "81":
              case "80":
                bundleID = "siguaxxxapp01.com.platformG";
                break;

              default:
                break;
            }
            this.download(2, bundleID);
          }
        },
        {
          text: "IOS版",
          isShow: this.downloadToggle.ios,
          onClick: () => {
            let bundleID = "";
            switch (this.memInfo.user.domain) {
              //　鴨博
              case "500015":
                bundleID = "bbin.mobile.xbbPorn.qa";
                break;

              case "69":
                bundleID = "chungyo.foxyporn.stage.enterprise";
                break;

              case "67":
                bundleID = "chungyo.foxyporn.prod.enterprise";
                break;

              // 絲瓜
              case "500035":
                bundleID = "bbin.mobile.sigua.qa";
                break;

              case "81":
                bundleID = "bbin.mobile.sigua.stage";
                break;

              case "80":
                bundleID = "bbin.mobile.sigua";
                break;

              default:
                break;
            }

            this.download(1, bundleID);
          }
        },
        {
          text: "隐藏版",
          isShow: this.downloadToggle.hide,
          onClick: () => {
            const target = this.downloadConfigData.find(item => {
              return item.name === "appStoreMajaLink";
            });
            window.open(target.value, "_blank");
          }
        }
      ].filter(item => item.isShow === "true");
    }
  },
  created() {
    // 取得開關設定 & 隱藏版 url
    yaboRequest({
      method: "get",
      url: `${this.siteConfig.YABO_API_DOMAIN}/System/config`,
      params: {
        type: "lcf"
      }
    }).then(res => {
      if ((res.status === "ok" || res.status === "000") && res.data) {
        this.downloadConfigData = res.data;

        const iTarget = this.downloadConfigData.find(item => {
          return item.name === "showIPADownload";
        });

        const pTarget = this.downloadConfigData.find(item => {
          return item.name === "showPWADownload";
        });

        const hTarget = this.downloadConfigData.find(item => {
          return item.name === "showStoreDownload";
        });

        this.downloadToggle = {
          ios: iTarget.value,
          pwa: pTarget.value,
          hide: hTarget.value
        };
      }
    });
  },
  methods: {
    mobileLinkOpen,
    clickService() {
      this.mobileLinkOpen({ linkType: "static", linkTo: "service" });
    },
    download(platform = null, bundleID = "") {
      bbosRequest({
        method: "get",
        url: this.siteConfig.BBOS_DOMIAN + "/App/Download",
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: {
          bundleID,
          lang: "zh-cn",
          platform
        }
      }).then(res => {
        if (res.status === "000" && res.data && res.data.url) {
          location.href = res.data.url;
        }
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.index.scss" module="$style_sg1"></style>
