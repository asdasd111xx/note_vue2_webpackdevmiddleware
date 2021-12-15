<template>
  <transition name="fade">
    <div
      v-if="downloadConfigData.show"
      :class="[
        $style['apptips-wrap'],
        { [$style['close']]: !downloadConfigData.show }
      ]"
    >
      <div :class="$style['container']">
        <div :class="$style['close-icon-wrap']" @click.stop="handleClose()">
          <div :class="$style['close-icon']">
            <img
              :src="$getCdnPath('/static/image/common/btn_close_grey.png')"
            />
          </div>
        </div>

        <div :class="$style['icon-wrap']">
          <div :class="$style['icon']">
            <img
              :src="`/static/image/${siteConfig.ROUTER_TPL}/common/appicon.png`"
            />
          </div>
        </div>

        <div :class="$style['content-wrap']">
          <div :class="[$style['title']]">
            {{ siteName + "APP" }}
          </div>
          <div :class="$style['desc']">
            {{ getText }}
          </div>
        </div>

        <div :class="$style['download-wrap']">
          <div @click="handleClickToLanding" :class="$style['download-btn']">
            <span> {{ $text("S_NOW_DOWNLOAD") }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
import { sendUmeng } from "@/lib/sendUmeng";

export default {
  data() {
    return {
      lang: {
        C_WS_DEPOSIT: "您的款项已入帐，请前往查看"
      },
      isDownloading: false,
      downloadConfigData: {
        platform: "",
        show: false,
        bundleID: ""
      },
      href: ""
    };
  },
  created() {
    if (
      ["porn1", "sg1", "sp1", "aobo1"].includes(this.siteConfig.ROUTER_TPL) &&
      this.$route.name === "home" &&
      !window.navigator.standalone &&
      (this.isMobileSafari() || this.isMobileAndroid())
    ) {
      // this.showAppTips = true;
      this.actionSetLCFSystemConfig().then(() => {
        let systemConfig = this.systemConfig("lcf");
        let showData = false,
          bundleIDData = "";

        if (this.isMobileSafari()) {
          this.downloadConfigData.platform = "PWA";
        } else if (this.isMobileAndroid()) {
          this.downloadConfigData.platform = "ANDROID";
        } else {
          return;
        }

        if (systemConfig) {
          if (this.downloadConfigData.platform === "PWA") {
            showData = systemConfig.find(item => {
              return item.name === "showPWADownload";
            });
            bundleIDData = systemConfig.find(item => {
              return item.name === "bbosApiPWABundleID";
            });
          } else if (this.downloadConfigData.platform === "ANDROID") {
            showData = systemConfig.find(item => {
              return item.name === "showAPKDownload";
            });
            bundleIDData = systemConfig.find(item => {
              return item.name === "bbosApiAndBundleID";
            });
          } else if (this.downloadConfigData.platform === "IOS") {
            showData = systemConfig.find(item => {
              return item.name === "showIPADownload";
            });
            bundleIDData = systemConfig.find(item => {
              return item.name === "bbosApiIOSBundleID";
            });
          }

          this.downloadConfigData["show"] = !window.navigator.standalone;

          this.downloadConfigData["bundleID"] = bundleIDData
            ? bundleIDData.value
            : "";
        }

        if (this.downloadConfigData.show) {
          this.$emit("toogleAppTips", true);

          goLangApiRequest({
            method: "get",
            url:
              this.siteConfig.YABO_GOLANG_API_DOMAIN +
              "/xbb/Domain/Hostnames/V2?lang=zh-cn",
            params: {
              // 1:代理獨立網址, 2:會員pwa, 3:會員推廣頁, 4:代理登入頁, 5:代理pwa, 6:落地頁, 7:前導頁
              clientType: 3
            }
          }).then(res => {
            if (res && res.data && res.data[0]) {
              this.href = `${res.data[0]}`;
            }
          });
        } else {
          this.$emit("toogleAppTips", false);
        }
      });
    } else {
      this.$emit("toogleAppTips", false);
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus",
      systemConfig: "getSystemConfig"
    }),
    siteName() {
      switch (this.siteConfig.ROUTER_TPL) {
        case "sg1":
          return "泡泡直播";
        case "porn1":
          return "币发BIFA ";
      }
      return this.siteConfig.SITE_NAME;
    },
    getText() {
      return "游戏最多、开奖最疯，一键下载轻松享受尊荣体验";
    }
  },
  methods: {
    ...mapActions([
      "actionNoticeData",
      "actionSetGlobalMessage",
      "actionSetLCFSystemConfig"
    ]),
    setGAObj() {
      if (typeof ga === "undefined") {
        return;
      }

      let site = "";

      switch (this.siteConfig.ROUTER_TPL) {
        case "porn1":
          site = "Bifa";
          break;
        case "sg1":
          site = "Paopao";
          break;
        case "sp1":
          site = "SP";
        case "aobo1":
          site = "AOBO";
          break;
      }

      let gaObj = {
        event_category: "Click",
        event_label: `Download_${this.downloadConfigData.platform}_${site}`,
        value: "1"
      };

      // event_label: `Download_PWA_YABO`,
      // event_label: `Download_ANDROID_YABO`,
      // event_label: `Download_PWA_SG`,
      // event_label: `Download_ANDROID_SG`,
      if (ga) {
        ga("event", "Download Click", gaObj);
      }

      console.log("Download Click:", gaObj);
    },
    handleClickToLanding() {
      if (!this.downloadConfigData.show) {
        return;
      }
      const promotionCode = localStorage.getItem("promotionCode");
      if (promotionCode && promotionCode != "" && !this.loginStatus) {
        this.$router.push("/mobile/login");
        return;
      }
      sendUmeng(105);
      this.isDownloading = true;
      this.setGAObj();

      console.log(this.href);
      // safari
      setTimeout(() => {
        location.href = `https://${this.href}`;
      }, 250);
    },
    handleClickDownload() {
      if (this.isDownloading || !this.downloadConfigData.show) {
        return;
      }
      this.isDownloading = true;
      this.setGAObj();

      let platformMapping = {
        IOS: 1,
        PWA: 2,
        ANDROID: 3
      };

      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/App/Download`,
        params: {
          bundleID: this.downloadConfigData.bundleID,
          platform: platformMapping[this.downloadConfigData.platform]
        }
      }).then(res => {
        setTimeout(() => {
          this.isDownloading = false;
        }, 1500);

        if (res.data && res.status === "000") {
          location.href = res.data.url;
        }
      });
    },
    handleClose() {
      this.downloadConfigData.show = false;
      setTimeout(() => {
        this.$emit("toogleAppTips", false);
      }, 310);
    },
    isMobileSafari() {
      return !!(
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/)
      );
    },
    isMobileAndroid() {
      return !!navigator.userAgent.match(/Android/i);
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.apptips-wrap {
  &.close {
    animation: slide-up 1s forwards;
  }
  .title {
    color: $apptip_title;
  }

  // -webkit-animation-timing-function: forwards;
  // -webkit-opacity: 1;
  // animation-timing-function: forwards;
  // animation: slide-down 1s forwards;
  background: #fefffe;
  height: 60px;
  max-width: $mobile_max_width;
  opacity: 1;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 50;
}

.container {
  width: 100%;
  height: 60px;
  padding: 3px 12px;
  position: relative;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
  text-align: left;
  display: inline-flex;

  .close-icon-wrap,
  .icon-wrap,
  .content-wrap,
  .download-wrap {
    display: inline-flex;
  }

  .icon-wrap {
    margin-left: 10px;
  }

  .content-wrap {
    margin-left: 7px;
    width: calc(100% - 88px - 56px);
    display: block;
  }

  .download-wrap {
    align-items: center;
    height: 100%;
    position: absolute;
    right: 7px;
    width: 88px;

    > .download-btn {
      align-items: center;
      background: $apptip_btn;
      border-radius: 13.5px;
      display: flex;
      height: 27px;
      justify-content: center;
      text-align: center;
      width: 100%;

      span {
        color: $main_text_color2;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
      }
    }
  }

  .title {
    margin-top: 5px;
    margin-left: 5px;
    font-size: 14px;
    font-weight: 700;
    color: $share_main_button_color;
    height: 20px;
  }

  .close-icon {
    width: 11px;
    height: 100%;
    display: flex;
    align-items: center;
    img {
      width: 11px;
      height: 11px;
    }
  }

  .icon {
    width: 32px;
    height: 100%;
    display: flex;
    align-items: center;

    img {
      width: 32px;
      height: 32px;
    }
  }

  .desc {
    color: #6e6e6e;
    font-size: 12px;
    font-weight: 700;
    height: 30px;
    height: 30px;
    line-height: 14px;
    margin-left: 5px;
  }

  .download {
    display: flex;
    align-items: center;
  }
}

@media (orientation: landscape) {
  .apptips-wrap {
    max-width: 768px !important;
  }
}

@keyframes slide-down {
  0% {
    opacity: 0;
    top: -140px;
  }

  100% {
    opacity: 1;
    top: 0;
  }
}

@-webkit-keyframes slide-down {
  0% {
    opacity: 0;
    top: -140px;
  }

  100% {
    opacity: 1;
    top: 0;
  }
}

@keyframes slide-up {
  0% {
    opacity: 1;
    top: 0;
  }

  100% {
    opacity: 0;
    top: -140px;
  }
}

@-webkit-keyframes slide-up {
  0% {
    opacity: 1;
    top: 0;
  }

  100% {
    opacity: 0;
    top: -140px;
  }
}
</style>
