<template>
  <div
    :class="[
      $style['iframe-wrap'],
      {
        [$style['has-header']]: headerConfig.hasHeader
      },
      { [$style['fullScreen']]: isFullScreen }
    ]"
    :style="{ height: `calc(100vh - ${iframeHeight}px)` }"
  >
    <div
      v-if="headerConfig.hasHeader"
      id="header"
      :class="[
        $style['header'],
        $style[themeTPL],
        { [$style['fullScreen']]: isFullScreen }
      ]"
    >
      <div
        v-show="isFullScreen"
        :class="$style['close-fullscreen']"
        @click="toggleFullScreen"
      >
        <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
      </div>

      <div
        :class="[$style['btn-prev'], $style[themeTPL]]"
        @click="headerConfig.onClick"
      >
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
        />
        <div>返回</div>
      </div>
      <div v-if="headerConfig.title" :class="[$style.title, $style[themeTPL]]">
        {{ headerConfig.title }}
      </div>

      <div v-if="headerConfig.hasFunc" :class="[$style.func, $style[themeTPL]]">
        <div @click="toggleFullScreen">全屏</div>
        <!-- <div @click="reload">刷新</div> -->
      </div>
    </div>
    <iframe
      :ref="'iframe'"
      :class="[$style['iframe'], $style[$route.params.page]]"
      :src="src"
      @load="onLoadiframe"
      allow="fullscreen"
      allowfullscreen="allowfullscreen"
      frameborder="0"
      crossorigin
    />
    <page-loading :is-show="isLoading" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import yaboRequest from "@/api/yaboRequest";
import goLangApiRequest from "@/api/goLangApiRequest";
import openGame from "@/lib/open_game";

export default {
  data() {
    return {
      isLoading: true,
      isFullScreen: false,
      src: ""
    };
  },
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      )
  },
  beforeDestroy() {
    let container = document.getElementById("mobile-container");
    if (container && container.style) {
      container.style = "";
    }
  },
  created() {
    // localStorage.setItem('open-game-link', 'https://star.xbb-slot-test.com:8888/starfruit/slot/1000030?lang=zh-cn&sid=8eedfbc72ec4e46dc8e83fcafee5c7afe292dcc40546150ce9dffdd54116ff14')
  },
  mounted() {
    let container = document.getElementById("mobile-container");
    if (container && container.style) {
      container.style = "min-height:unset";
    }

    const params = this.$route.params;
    const query = this.$route.query;
    const vendor = query.vendor;
    if (!params.page) {
      this.src = localStorage.getItem("iframe-third-url");
      return;
    }

    switch (params.page.toUpperCase()) {
      case "THIRDPARTY":
        // vendor
        // case "APB":
        // case "BALE":
        // case "STB":
        // case "JPB":
        // case "DSC":
        // case "PPV":
        // case "SF":
        // case "SL":
        // case "SWAG":
        if (localStorage.getItem("iframe-third-url")) {
          const vendor = query.vendor;
          if (vendor === "SL") {
            window.sportEvent = type => {
              if (type === "GO_IM_SPORT") {
                if (!this.loginStatus) {
                  this.actionSetGlobalMessage({
                    code: "M00001",
                    origin: "home"
                  });
                  return;
                } else {
                  const openGameSuccessFunc = res => {
                    this.isShowLoading = false;
                  };

                  const openGameFailFunc = res => {
                    this.isShowLoading = false;

                    if (res && res.data) {
                      let data = res.data;
                      this.actionSetGlobalMessage({
                        msg: data.msg,
                        code: data.code
                      });
                    }
                  };
                  openGame(
                    { vendor: "boe", kind: 1 },
                    openGameSuccessFunc,
                    openGameFailFunc
                  );
                }
              }
            };
          }
          this.src = localStorage.getItem("iframe-third-url");
          return;
        }

        let userId = "guest";
        if (
          this.memInfo &&
          this.memInfo.user &&
          this.memInfo.user.id &&
          this.memInfo.user.id !== 0
        ) {
          userId = this.memInfo.user.id;
        }

        goLangApiRequest({
          method: "get",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/ThirdParty/${vendor}/${userId}`
        }).then(res => {
          if (res && res.status !== "000") {
            // 維護非即時更新狀態
            if (res.msg && res.code !== "77700029") {
              this.actionSetGlobalMessage({ msg: res.msg, code: res.code });
            }

            if (res.code === "77700029") {
              this.$router.back();
              return;
            }
          } else {
            this.src = res.data;
          }
        });
        // SWAG
        // this.src = 'https://feature-yabo.app.swag.live/';
        break;
      case "THIRD":
        let type = this.$route.params.type;

        switch (type) {
          case "fengniao":
            if (query.alias) {
              goLangApiRequest({
                method: "get",
                url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
                params: {
                  urlName: query.alias,
                  lang: "zh-cn",
                  needToken: "true",
                  externalCode: "fengniao"
                }
              }).then(res => {
                this.isLoading = false;

                if (res && res.data && res.data.uri) {
                  this.src = res.data.uri + "&cors=embed";
                  return;
                }

                if (res && res.msg) {
                  this.actionSetGlobalMessage({ msg: res.msg });
                  return;
                }
              });
              return;
            }

          default:
            axios({
              method: "get",
              url: "/api/v1/c/link/customize",
              params: {
                code: "fengniao",
                client_uri: localStorage.getItem("iframe-third-url") || ""
              }
            })
              .then(res => {
                this.isLoading = false;
                if (res && res.data && res.data.ret && res.data.ret.uri) {
                  this.src = res.data.ret.uri;
                }
              })
              .catch(error => {
                this.isLoading = false;
                if (error && error.data && error.data.msg) {
                  this.actionSetGlobalMessage({ msg: error.data.msg });
                }
              });
            return;
        }
        break;
      case "GAME":
        if (localStorage.getItem("iframe-third-url")) {
          this.src = localStorage.getItem("iframe-third-url");
          return;
        }

        const openGameSuccessFunc = res => {
          this.isShowLoading = false;
        };

        const openGameFailFunc = res => {
          this.isShowLoading = false;

          if (res && res.data) {
            let data = res.data;
            this.actionSetGlobalMessage({
              msg: data.msg,
              code: data.code,
              origin: "home"
            });
          }
        };

        openGame(
          {
            kind: this.$route.query.kind || "",
            vendor: this.$route.query.vendor || "",
            code: this.$route.query.code || "",
            gameType: this.$route.query.gameType || "",
            gameName:
              this.$route.query.gameName ||
              localStorage.getItem("iframe-third-url-title") ||
              ""
          },
          openGameSuccessFunc,
          openGameFailFunc
        );

        break;
      case "PROMOTION":
        // 優小秘
        let url = localStorage.getItem("iframe-third-url") || "";
        if (url) {
          if (!url.includes("v=m")) {
            url = `${url}&v=m`;
          }
          this.src = url;
          return;
        }

        if (query.alias) {
          goLangApiRequest({
            method: "get",
            url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
            params: {
              urlName: query.alias,
              lang: "zh-cn",
              needToken: "true",
              externalCode: "promotion"
            }
          }).then(res => {
            this.isLoading = false;
            if (res && res.data && res.data.uri) {
              url = res.data.uri;
              // 由API提供
              // if (!url.includes("v=m")) {
              //   url = `${url}&v=m`;
              // }
              this.src = url;
            }

            if (res && res.msg) {
              this.actionSetGlobalMessage({ msg: res.msg });
              return;
            }
          });
        }
        break;

      default:
        this.src = localStorage.getItem("iframe-third-url");
        break;
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      webInfo: "getWebInfo"
    }),
    originUrl() {
      let origin = this.$route.params.page.toUpperCase();
      let from = localStorage.getItem("iframe-third-origin");

      if (from) {
        localStorage.removeItem("iframe-third-origin");
        return `/mobile/${from}`;
      }

      switch (origin) {
        case "THIRD":
          return "/mobile/gift";
        case "PROMOTION":
          return "/mobile/promotion";
        case "SWAG":
          return "/mobile";
        default:
          return "/mobile";
          return;
      }
    },
    iframeHeight() {
      let result = [];
      if (this.headerConfig.hasHeader) {
        result.push(43);
      }

      if (this.headerConfig.hasFooter) {
        result.push(65);
      }
      return result.length > 0 ? result.reduce((a, b) => a + b) : 0;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    headerConfig() {
      const query = this.$route.query;
      const origin = this.$route.params.page.toUpperCase();

      this.isFullScreen =
        query.fullscreen === undefined ? false : query.fullscreen === "true";

      let baseConfig = {
        hasHeader:
          query.hasHeader === undefined ? true : query.hasHeader === "true",
        hasFooter:
          query.hasFooter === undefined ? false : query.hasFooter === "true",
        prev: query.prev === undefined ? true : query.prev,
        hasFunc: query.func === undefined ? true : query.func === "true",
        title:
          query.title || localStorage.getItem("iframe-third-url-title") || ""
      };

      // SWAG 固定
      switch (origin) {
        case "SWAG":
          baseConfig.hasHeader = true;
          baseConfig.hasFooter = false;
          baseConfig.title = "SWAG";
          this.isFullScreen = true;
          break;
      }

      return {
        ...baseConfig,
        onClick: () => {
          this.$router.replace(this.originUrl);
          return;
        }
      };
    }
  },
  beforeDestroy() {
    window.removeEventListener("message", this.onListener);
    localStorage.removeItem("iframe-third-url-title");
    localStorage.removeItem("iframe-third-url");
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    reload() {
      if (this.isLoading) {
        return;
      }
      // reload 當前網址
      document.getElementById("iframe").contentWindow.location.reload();
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
    },
    getCustomizeLink(params) {
      axios({
        method: "get",
        url: "/api/v1/c/link/customize",
        params: params
      })
        .then(res => {
          this.isLoading = false;
          if (res && res.data && res.data.ret && res.data.ret.uri) {
            this.src = res.data.ret.uri;
          }
        })
        .catch(error => {
          this.isLoading = false;
          if (error && error.data && error.data.msg) {
            this.actionSetGlobalMessage({ msg: error.data.msg });
          }
        });
    },
    onListener(e) {
      console.log(e);
      // //  需要監聽的白名單
      // let whiteList = [window.location.origin,
      //   'https://play.qybtv.xyz',
      //   'https://play.pybtv.xyz',
      //   'https://play.qybpb.xyz',
      //   'https://play.pybpb.xyz',
      //   'https://dglzsm.com',
      //   'http://47.240.78.53',
      //   'http://47.240.57.135',
      //   'http://47.240.117.62',
      //   'http://eyt.iplay.bet',
      //   'http://eyd.666uxm.com',
      //   'https://688lg410.666uxm.com/'
      // ];
      if (e.data) {
        let data = e.data;
        // console.log(data);

        if (!data.event) {
          return;
        }

        console.log("[EVENT]:", data.event);
        console.log("[DATA]:", data.data);

        switch (data.event) {
          case "EVENT_THIRDPARTY_SWITCH_GAME":
            this.linkToGame(data.data);
            return;

          case "EVENT_THIRDPARTY_CLOSE":
            this.$router.replace(this.originUrl);
            return;

          // 避免迴圈重複本站
          case "SELF_INTO":
            if (
              this.$route.params.page.toUpperCase() === "PROMOTION" &&
              !this.src.includes("popcontrol")
            ) {
              this.$router.replace("/mobile/login");
              return;
            }
            return;
          case "EVENT_THIRDPARTY_LOGIN":
            this.$router.replace("/mobile/login?prev=home");
            return;

          case "EVENT_THIRDPARTY_CURRENCY_NOT_ENOUGH":
          case "EVENT_THIRDPARTY_DEPOSIT":
            this.$router.push("/mobile/mcenter/swag?tab=0&prev=back");
            return;

          default:
            return;
        }
      }
    },
    linkToGame(data) {
      this.isLoading = true;

      if (!data) {
        return;
      }

      let target = data.split("-");

      switch (target[0]) {
        case "lobby":
          let type = "casino";
          switch (target[2]) {
            case "5":
              type = "card";
              break;
            case "3":
            default:
              type = "card";
              break;
          }
          this.$router.push(`/mobile/${type}/${target[1]}`);
          break;

        case "game":
          const vendor = target[1] || "";
          const kind = target[2] || "";
          const code = target[3] || "";

          switch (vendor) {
            default:
              const openGameSuccessFunc = res => {
                this.isLoading = false;
              };

              const openGameFailFunc = res => {
                this.isLoading = false;

                if (res && res.data) {
                  let data = res.data;
                  this.actionSetGlobalMessage({
                    msg: data.msg,
                    code: data.code,
                    origin: "home"
                  });
                }
              };

              openGame(
                { kind: kind, vendor: vendor, code: code },
                openGameSuccessFunc,
                openGameFailFunc
              );
              break;
          }

        default:
          return;
      }
    },
    onLoadiframe(event) {
      // console.log('onLoadiframe:', event)
      this.$nextTick(() => {
        setTimeout(() => {
          this.isLoading = false;
        }, 310);
      });
      try {
        window.addEventListener("message", this.onListener);
        // const self = this;
        // this.$refs.iframe.contentWindow.onbeforeunload = (e) => {
        //   console.log(e)
        //   //   // 取消預設關閉 取代成回上一頁
        //   //   e.preventDefault();
        //   //   e.stopPropagation();
        //   //   self.$router.back();
        // }
      } catch (e) {
        console.log("onbeforeunload Catch:", e);
      }
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.iframe-wrap {
  height: 100vh;
  width: 100%;
  background-color: #fff;
  transition: margin 0.31s, height 0.31s;

  // overflow: hidden;

  &.fullScreen {
    margin-top: unset !important;
    height: 100vh !important;
  }

  &.has-header {
    margin-top: 43px;
  }
}

@keyframes slide-up {
  0% {
    top: 0;
  }
  100% {
    top: -43px;
  }
}

@keyframes slide-down {
  0% {
    top: -43px;
  }
  100% {
    top: 0;
  }
}

.header {
  margin: 0 auto;
  max-width: $mobile_max_width;
  position: absolute;
  top: 0;
  z-index: 3;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  background: white;
  color: #ffffff;
  text-align: center;
  animation: slide-down 0.31s forwards;

  // border-bottom: 1px solid #eee;

  &.fullScreen {
    animation: slide-up 0.31s forwards;
    top: -43px;
  }

  &.ey1 {
    background: linear-gradient(#fe2a2a, #b60303);
  }

  &.porn1 {
    background: white;
  }

  &.sg1 {
    color: black;
  }
}

@media (orientation: landscape) {
  .header,
  .iframe {
    max-width: $mobile_max_landscape_width !important;
  }
}

.btn-prev {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  width: 20px;
  height: 20px;
  margin: auto;
  z-index: 2;
  color: black;

  &.ey1 {
    color: white;
  }

  &.porn1 {
    color: black;
  }

  > img {
    display: block;
    width: 100%;
  }

  > div {
    display: block;
    position: absolute;
    top: 0;
    width: 40px;
    left: 20px;
  }
}

.wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.title {
  color: black;
  font-size: 17px;
  font-weight: 500;
  height: 43px;
  line-height: 43px;
  margin: 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 60%;

  &.ey1 {
    color: white;
  }

  &.porn1 {
    color: black;
  }
}

.close-fullscreen {
  position: absolute;
  top: 43px;
  margin: 0 auto;
  transform: rotate(90deg);
  height: 18px;
  margin: 0 auto;
  left: calc(50% - 9px);
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0 5px 5px 0;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    height: 14px;
  }
}

.func {
  position: absolute;
  right: 12px;
  top: 0;
  font-size: 14px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    // width: 50%;
    padding: 0 3px;
    height: 43px;
    line-height: 43px;
  }

  &.ey1 {
    color: white;
  }

  &.porn1 {
    color: black;
  }
}
.iframe {
  //   overflow: auto !important;
  //   -webkit-overflow-scrolling: touch !important;

  border: none;
  display: block;
  height: 100%;
  margin: 0 auto;
  max-width: $mobile_max_width;
  min-width: 0;
  padding: 0;
  width: 100%;

  &.promotion {
    // height: calc(100% + 50px);
    // margin-top: -50px;
  }
}
</style>
