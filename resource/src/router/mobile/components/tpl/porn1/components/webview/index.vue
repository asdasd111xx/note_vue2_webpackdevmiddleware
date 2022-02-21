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

      <div :class="$style['header-icon']" v-if="themeTPL === 'sg1'">
        <div
          :class="$style['icon']"
          v-for="(item, index) in iconListSg1"
          :key="index"
        >
          <div :class="$style['img']">
            <img :src="$getCdnPath(item.imgSrc)" alt="icon" />
          </div>
          <div :class="[$style['text'], $style[themeTPL]]">{{ item.text }}</div>
        </div>
      </div>
      <div :class="$style['header-icon']" v-else>
        <div
          :class="$style['icon']"
          v-for="(item, index) in iconList"
          :key="index"
        >
          <div :class="$style['img']">
            <img :src="$getCdnPath(item.imgSrc)" alt="icon" />
          </div>
          <div :class="[$style['text'], $style[themeTPL]]">{{ item.text }}</div>
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
    <img
      :class="$style[`info-card`]"
      @click="clickService(0)"
      :src="
        serviceImg[0]
          ? serviceImg[0]
          : $getCdnPath(
              `/static/image/${themeTPL}/service/service_service01.png`
            )
      "
    />
    <img
      :class="$style[`info-card`]"
      @click="clickService(1)"
      :src="
        serviceImg[1]
          ? serviceImg[1]
          : $getCdnPath(
              `/static/image/${themeTPL}/service/service_service02.png`
            )
      "
    />
  </div>
</template>

<script>
import goLangApiRequest from "@/api/goLangApiRequest";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      isIos: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      downloadConfigData: [],
      downloadToggle: {
        ios: {
          show: false,
          bundleID: ""
        },
        pwa: {
          show: false,
          bundleID: ""
        },
        hide: {
          show: false,
          link: ""
        }
      },
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
      iconListSg1: [
        {
          text: "多种玩法",
          imgSrc: "/static/image/sg1/webview/ic_service03.png"
        },
        {
          text: "存取便捷",
          imgSrc: "/static/image/sg1/webview/ic_service04.png"
        },
        {
          text: "专业客服",
          imgSrc: "/static/image/sg1/webview/ic_service05.png"
        }
      ],
      yaboIconSrc: "/static/image/common/webview/appicon_yabo.png",
      serviceUrl: [],
      serviceImg: []
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      systemConfig: "getSystemConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.ROUTER_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    iosCard() {
      return [
        {
          text: "极速版",
          isShow: this.downloadToggle.pwa.show,
          onClick: () => {
            this.download(2, this.downloadToggle.pwa.bundleID);
          }
        },
        {
          text: "IOS版",
          isShow: this.downloadToggle.ios.show,
          onClick: () => {
            this.download(1, this.downloadToggle.ios.bundleID);
          }
        },
        {
          text: "隐藏版",
          isShow: this.downloadToggle.hide.show,
          onClick: () => {
            window.open(this.downloadToggle.hide.link, "_blank");
          }
        }
      ].filter(item => item.isShow === "true");
    }
  },
  created() {
    // 取得開關設定 & 隱藏版 url
    this.actionSetLCFSystemConfig().then(() => {
      let systemConfig = this.systemConfig("lcf");
      this.downloadConfigData = systemConfig;

      const iTarget = this.downloadConfigData.find(item => {
        return item.name === "showIPADownload";
      });

      const iOSBundleID = this.downloadConfigData.find(item => {
        return item.name === "bbosApiIOSBundleID";
      });

      const pTarget = this.downloadConfigData.find(item => {
        return item.name === "showPWADownload";
      });

      const pwaBundleID = this.downloadConfigData.find(item => {
        return item.name === "bbosApiPWABundleID";
      });

      const hTarget = this.downloadConfigData.find(item => {
        return item.name === "showStoreDownload";
      });

      const hBundleID = this.downloadConfigData.find(item => {
        return item.name === "bbosApiMajaLink";
      });

      this.downloadToggle = {
        ios: {
          show: iTarget.value,
          bundleID: iOSBundleID.value
        },
        pwa: {
          show: pTarget.value,
          bundleID: pwaBundleID.value
        },
        hide: {
          show: hTarget.value,
          link: hBundleID.value
        }
      };
      this.getService();
    });
  },
  methods: {
    ...mapActions(["actionSetLCFSystemConfig"]),
    clickService(idx) {
      const url = this.serviceUrl[idx];
      window.open(url);
      // 在線客服流量分析事件
      window.dataLayer.push({
        dep: 2,
        event: "ga_click",
        eventCategory: "online_service",
        eventAction: "online_service_contact",
        eventLabel: "online_service_contact"
      });
    },
    getService() {
      goLangApiRequest({
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/For/Customer/Service`
      }).then(res => {
        if (res && res.status === "000" && res.errorCode === "00") {
          this.serviceUrl = res.data.map(v => v.url);
          this.serviceImg = res.data.map(v => v.image);
        }
      });
    },
    download(platform = null, bundleID = "") {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/App/Download`,
        params: {
          bundleID,
          platform
        }
      }).then(res => {
        if (res.data && res.status === "000" && res.data.url) {
          let a = document.createElement("a");
          a.download = "res.data.url";
          a.href = res.data.url;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
        }
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.index.scss" module="$style_sg1"></style>
