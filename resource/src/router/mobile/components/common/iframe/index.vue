<script>
//一定是內嵌才會進來（if ( embedGame &&!localStorage.getItem("reload-game") &&gameType !== "event")）
//initiframe() 取得src 放進iframe裡
//src為/game/lg_sport/1 其實連到內部的 path: 'game/:vendor/:kind/:code?'的檔案（resource/src/router/game/components/index.vue）

//headerConfig 控制標題

//reload
//開遊戲時src="/game/jdb/3/39045" 但進去之後會用iframe-third-url跳轉（https://game.jygrq.com/?lang=cn&homeUrl=&isAPP=false&gameType=15&mType=15009&gName=NinjaRush_99f865c&e=api_demo_2&mute=0&x=e9tkQRED2CC-OKWfOynIr9Q8AQFAu3F_mDPfQAv-BDn-ZzAm51JEr5E85poniuj9uDavBBIPQOZ5THrv_AsGE3Ue_QXVMsc-D-cQZwC_QVVkgH5Fd9X1gzj-NvRaSm6Cvt_VCh4mMyhxvf4R）
//開優小蜜時src = https://yb01.iplay.bet/p/2205260001?code=promotion&jwt_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjg4MTM2LCJ1c2VybmFtZSI6Imphc29udHNhaSIsInJvbGUiOiJwbGF5ZXIiLCJkb21haW4iOiI1MDAwMTUiLCJsYW5ndWFnZSI6InpoLWNuIiwic291cmNlX2RldmljZSI6Img1IiwiZG9tYWluX25hbWUiOiLluIHlj5FCSUZB5byA5Y-R56uZIiwiaWF0IjoxNjU0MDU0MjE3LCJleHAiOjE2NTQwNTQ1MTd9.iXoCldgoraCBPSnI18DqF52tmccA3PqLzSmivqtBbGw&type=customize&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjg4MTM2LCJ1c2VybmFtZSI6Imphc29udHNhaSIsInJvbGUiOiJwbGF5ZXIiLCJkb21haW4iOiI1MDAwMTUiLCJsYW5ndWFnZSI6InpoLWNuIiwic291cmNlX2RldmljZSI6Img1IiwiZG9tYWluX25hbWUiOiLluIHlj5FCSUZB5byA5Y-R56uZIiwiaWF0IjoxNjU0MDU0MjE3LCJleHAiOjE2NTQwNTQ1MTd9.iXoCldgoraCBPSnI18DqF52tmccA3PqLzSmivqtBbGw&source=http%3A%2F%2Flocalhost%3A8787&v=m&platform=h5
//所以在reload遊戲時，要先src ＝‘’ (讓game.vue重啟) ，並重新存('iframe-third-url')(讓game.vue有新的網址去replace)

//iframe 加key
//iframe的歷史紀錄也會算在瀏覽器的history裡面，但用這種方式，整個iframe會被砍掉重新插進dom裡面，iframe就是最新的，不會有歷史記錄了
</script>
<template>
  <div
    :class="[
      $style['iframe-wrap'],
      {
        [$style['has-header']]: headerConfig.hasHeader
      },
      { [$style['fullScreen']]: isFullScreen }
    ]"
    :style="{
      height: `calc(${innerHeight}px - ${iframeHeight}px)`
    }"
  >
    <!-- 泡泡真人視訊離開防呆提示 ⬇️-->
    <transition name="fade">
      <div v-if="exitCheck" :class="$style['pop-wrap']">
        <div :class="$style['pop-mask']" />
        <div :class="$style['pop-block']">
          <div :class="$style['title']">
            温馨提示
          </div>

          <div :class="$style['content-wrap']">
            <div :class="$style['content']">
              <span>
                您确定返回到大厅吗?
              </span>

              <template>
                <div :class="$style['button-wrap']">
                  <div
                    :class="[$style['button-item'], $style['close']]"
                    @click="closePop"
                  >
                    取消
                  </div>

                  <div
                    :class="[$style['button-item'], $style['confirm']]"
                    @click="$router.push('/mobile')"
                  >
                    确定
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 泡泡真人視訊離開防呆提示 ⬆️ -->
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
                  : themeTPL === 'sg1'
                  ? 'black'
                  : null
              }.png`
            )
          "
        />
        <div v-if="showBack">{{ $text("S_GO_BACK") }}</div>
      </div>
      <div v-if="headerConfig.title" :class="[$style.title, $style[themeTPL]]">
        {{ headerConfig.title }}
      </div>
      <div v-if="headerConfig.hasFunc" :class="[$style.func, $style[themeTPL]]">
        <div @click="toggleFullScreen">全屏</div>
        <div v-if="$route.params.page === 'game'" @click="reloadIframe">
          刷新
        </div>
      </div>
    </div>
    <iframe
      id="iframe"
      :ref="'iframe'"
      :class="[$style['iframe'], $style[$route.params.page]]"
      :src="src"
      :key="src"
      @load="onLoadiframe"
      allow="geolocation; fullscreen"
      scrolling="auto"
      frameborder="0"
      crossorigin
      style="width: 1px !important; min-width: 100%"
      :style="[
        isFullScreen
          ? {
              height: `calc(${innerHeight}px)`,
              marginTop: 'unset'
            }
          : ''
      ]"
    />
    <!-- @load ->iframe載入後，被觸發（應用在父層） -->
    <page-loading :is-show="isLoading" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import goLangApiRequest from "@/api/goLangApiRequest";
import openGame from "@/lib/open_game";
import { lib_useGlobalWithdrawCheck } from "@/lib/withdrawCheckMethod";
import { getEmbedGameVendor } from "@/lib/game_option";
import { iframeEvent } from "@/mixins/iframeEvent";

export default {
  data() {
    return {
      isLoading: true,
      isFullScreen: false,
      src: "",
      showBack: true,
      contentTitle: "",
      exitCheck: false,
      innerHeight: window.innerHeight
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
    //行動裝置翻轉重取innerHeight
    window.onorientationchange = () => {
      setTimeout(() => {
        this.innerHeight = window.innerHeight;
      }, 200);
    };
    localStorage.removeItem("_iframe-back-route");
    // localStorage.setItem('open-game-link', 'https://star.xbb-slot-test.com:8888/starfruit/slot/1000030?lang=zh-cn&sid=8eedfbc72ec4e46dc8e83fcafee5c7afe292dcc40546150ce9dffdd54116ff14')
  },
  mounted() {
    this.initIframe();
    if (this.$route.params.page === "history") {
      document.title = "搓合查询";
    }
  },
  watch: {
    "$route.params.page"() {
      this.isLoading = true;
      this.initIframe();
    },
    "$route.query"() {
      this.isLoading = true;
      this.initIframe();
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      webInfo: "getWebInfo",
      withdrawCheckStatus: "getWithdrawCheckStatus"
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
        case "GIFT":
          return "/mobile";
        case "PROMOTION":
          return "/mobile/promotion";
        case "TCENTERLOBBY":
          return "/mobile/mcenter/tcenterLobby";
        case "VIPINFO":
          return "/mobile/mcenter/accountVIP";
        case "EPOINT":
          return `/mobile/mcenter/bankCard?redirect=epoint&type=wallet&wallet=epoint`;
        case "EPOINTFROMDEPOSIT":
          return `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=epoint&swift=BBEPWACN1`;
        case "EPOINT2FROMDEPOSIT":
          return `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=epoint&swift=BBEPWACN2`;
        default:
          return "/mobile";
      }
    },

    iframeHeight() {
      let result = [];
      // if (this.headerConfig.hasHeader && !this.isFullScreen) {
      //   result.push(43);
      // }

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

      let vendor = this.$route.query.vendor;
      const target = this.memInfo.vendors.find(item => item.vendor === vendor);

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
          this.contentTitle ||
          query.title ||
          localStorage.getItem("iframe-third-url-title") ||
          ""
      };
      return {
        ...baseConfig,
        onClick: () => {
          const iframeThirdOrigin = localStorage.getItem("iframe-third-origin");
          let embedGame = getEmbedGameVendor(
            this.$route.query.vendor,
            this.$route.query.kind,
            this.$route.query.code
          );

          if (embedGame && typeof embedGame !== "undefined") {
            this.$router.replace(this.originUrl);
            return;
          }

          if (this.$route.query.vendor === "lg_live") {
            this.exitCheck = true;
            return;
          }

          if (
            this.$route.params.page.toUpperCase() === "GAME" &&
            iframeThirdOrigin &&
            (iframeThirdOrigin.includes("casino") ||
              iframeThirdOrigin.includes("card"))
          ) {
            localStorage.setItem("_iframe-back-route", "2");
            this.$router.replace(`${this.originUrl}`);
            return;
          }

          if (
            (this.$route.params.page.toUpperCase() === "GIFT" ||
              this.$route.params.page.toUpperCase() === "HISTORY" ||
              this.$route.params.page.toUpperCase() === "DEPOSIT" ||
              this.$route.params.page.toUpperCase() === "BCWALLET" ||
              this.$route.params.page.toUpperCase() === "GAME" ||
              this.$route.params.page.toUpperCase() === "USM" ||
              this.$route.params.page.toUpperCase() === "LIVEPROMOTION") &&
            !iframeThirdOrigin
          ) {
            window.history.back();
            return;
          }
          // console.log(this.originUrl);
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
    reload() {
      //reload實現
      // 1.會cross
      // document.getElementById("iframe").contentWindow.location.reload();

      //2.會增加歷史紀錄
      const iframe = document.getElementById("iframe");
      iframe.src = iframe.src;
    },

    ...mapActions(["actionSetGlobalMessage"]),
    closePop() {
      this.exitCheck = false;
      return;
    },
    initIframe() {
      let container = document.getElementById("mobile-container");
      if (container && container.style) {
        container.style = "min-height:unset";
      }

      const params = this.$route.params;
      const query = this.$route.query;
      const vendor = query.vendor || params.page || "";
      if (!params.page) {
        this.src = localStorage.getItem("iframe-third-url");
        return;
      }
      switch (params.page.toUpperCase()) {
        case "THIRD":
        case "THIRDPARTY":
          if (localStorage.getItem("iframe-third-url")) {
            const vendor = query.vendor;
            if (vendor === "SL") {
              window.sportEvent = type => {
                if (type === "GO_IM_SPORT") {
                  if (!this.loginStatus) {
                    this.$router.push("/mobile/login");
                    return;
                  } else {
                    // 0421 進入遊戲前檢查withdrawcheck
                    if (!this.withdrawCheckStatus.account) {
                      lib_useGlobalWithdrawCheck("home");
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
            url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/ThirdParty/${vendor}/${userId}?123`
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

          break;

        case "GAME":
          if (localStorage.getItem("iframe-third-url")) {
            this.src = localStorage.getItem("iframe-third-url");

            return;
          }

          const openGameSuccessFunc = res => {
            this.isShowLoading = false;
            this.src = localStorage.getItem("iframe-third-url");
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

        case "GIFT":
        case "VIPINFO":
          this.showBack = false;
        case "PROMOTION":
        case "LIVEPROMOTION":
          const { promoUri, alias, title } = this.$route.query;
          if (promoUri) {
            this.getCustomizeLink(promoUri);
            if (!title) this.getPromotionTitle();
            return;
          }

          switch (alias) {
            case "self_collect_promotion": // 领取优惠
            case "verify_promotion": // 审核查询
              let uri = "";
              let targetUri = {
                self_collect_promotion: "collect_status",
                verify_promotion: "verify_status"
              };

              let getPromotionForestageConfig = () => {
                return goLangApiRequest({
                  method: "get",
                  url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Promotion/Forestage/Config`
                }).then(res => {
                  if (res && res.data && res.data.path) {
                    uri = res.data.path[targetUri[alias]];
                  }
                });
              };

              getPromotionForestageConfig().then(() => {
                if (!uri) {
                  this.src = "";
                  return;
                }
                this.getCustomizeLink(uri);
              });
              return;
            default:
              this.getExternalUrl("promotion");
              break;
          }
          break;

        case "TCENTERLOBBY":
          this.showBack = false;
          this.src = localStorage.getItem("iframe-third-url");
          break;

        case "PAO8D":
          this.src = "https://pao8d.tv";
          break;

        default:
          this.src = localStorage.getItem("iframe-third-url");
          break;
      }
    },
    reloadIframe() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.src = "";
      this.initIframe();
    },
    getExternalUrl(externalCode = "promotion") {
      this.isLoading = true;

      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
        params: {
          urlName: this.$route.query.alias || "",
          lang: "zh-cn",
          needToken: "true",
          externalCode: externalCode
        }
      }).then(res => {
        this.isLoading = false;
        if (res && res.data && res.data.uri) {
          let url = res.data.uri;

          if (externalCode === "fengniao") {
            url = res.data.uri + "&cors=embed";
          }

          if (!url.includes("v=m")) {
            url = `${url}&v=m`;
          }

          this.src = url;
        }

        if (res && res.msg) {
          this.actionSetGlobalMessage({ msg: res.msg });
          return;
        }

        this.getPromotionTitle();
      });
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
    },
    getCustomizeLink(clientUri) {
      this.isLoading = true;
      return goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/Customize`,
        params: { code: "promotion", clientUri }
      }).then(res => {
        this.isLoading = false;
        if (res && res.status === "000" && res.errorCode === "00") {
          if (res.data && res.data.uri) {
            let uri = res.data.uri;
            if (!uri.includes("v=m")) {
              uri = `${uri}&v=m`;
            }

            const isH5 = !window.navigator.standalone;
            if (!uri.includes("platform=h5") && isH5) {
              uri = `${uri}&platform=h5`;
            }
            this.src = uri;
          } else {
            this.src = "";
          }
        } else {
          this.actionSetGlobalMessage({ msg: res.msg, code: res.code });
        }
      });
    },
    getPromotionTitle() {
      // 標題
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Promotion/List`,
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res.status === "000") {
          let promotionId = this.src.split("?")[0].split("/")[
            this.src.split("?")[0].split("/").length - 1
          ];

          if (!promotionId) {
            this.contentTitle = "";
            return;
          }

          res.data.ret.forEach(promo => {
            if (promo.link.includes(promotionId)) {
              this.contentTitle = promo.name;
            }
          });
        }
      });
    },
    onListener(e) {
      // console.log(window.document);//應用在父層
      if (e.data) {
        let data = e.data;

        if (!data.event) {
          return;
        }
        return iframeEvent(this, data, "iframe");
      }
    },
    linkToGame(data) {
      if (this.isLoading) {
        return;
      }

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
                if (this.$route.query.vendor === "sigua_ly") {
                  this.$router.push("/mobile");
                }
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

              // 0421 進入遊戲前檢查withdrawcheck(維護時除外)
              if (!this.withdrawCheckStatus.account) {
                lib_useGlobalWithdrawCheck("home");
                return;
              }

              openGame(
                {
                  kind: kind,
                  vendor: vendor,
                  code: code,
                  getGames: true
                },
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

  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  &.has-header {
    > iframe {
      margin-top: 43px;
      height: calc(100% - 43px);
    }
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
  position: fixed;
  top: 0;
  z-index: 10;
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

  &.porn1 {
    color: black;
  }
}

.close-fullscreen {
  z-index: 999;
  position: fixed;
  top: 0;
  margin: 0 auto;
  height: 19px;
  margin: 0 auto;
  left: calc(50% - 15px);
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0 0 5px 5px;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  > img {
    height: 15px;
    transform: rotate(90deg);
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
}

// Popup Style
.pop-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.pop-mask {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
}

.pop-block {
  position: absolute;
  width: 65%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fefffe;
  border-radius: 8px;
  text-align: center;
  color: #a6a9b2;
  font-size: 14px;
  .title {
    color: #414655;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }
}

.button-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  border-top: 1px solid #f7f8fb;
  margin-top: 20px;

  .button-item {
    font-size: 18px;
    width: 50%;
    padding: 10px 0;
    &.close {
      // color: var(--popup_tip_close_color);
      color: #6aaaf5;
      border-right: 1px solid #f7f8fb;
    }
    &.confirm {
      // color: var(--popup_tip_ok_color);
      color: #6aaaf5;
    }
  }
}
</style>
