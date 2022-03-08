<template>
  <mobile-container :has-footer="hasFooter">
    <div
      slot="content"
      :class="[
        $style['iframe-wrap'],
        {
          [$style['has-header']]: headerConfig.hasHeader
        },
        {
          [$style['has-footer']]: headerConfig.hasFooter
        },
        { [$style['fullScreen']]: isFullScreen }
      ]"
    >
      <div
        v-if="headerConfig.hasHeader"
        id="header"
        :class="[$style['header'], { [$style['fullScreen']]: isFullScreen }]"
      >
        <div
          v-show="isFullScreen"
          :class="$style['close-fullscreen']"
          @click="toggleFullScreen"
        >
          <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
        </div>

        <div :class="[$style['btn-prev']]" @click="headerConfig.onClick">
          <img :src="$getCdnPath(`/static/image/common/btn_back_black.png`)" />
        </div>
        <div v-if="headerConfig.title" :class="[$style.title]">
          {{ contentTitle || headerConfig.title }}
        </div>
        <div v-if="headerConfig.hasFunc" :class="[$style.func]">
          <div @click="toggleFullScreen">全屏</div>
          <!-- <div @click="reload">刷新</div> -->
        </div>
      </div>

      <iframe
        v-if="!isMaintain"
        ref="iframe"
        id="iframe"
        :class="[$style['iframe']]"
        :src="src"
        @load="onLoadiframe"
        allow="geolocation; fullscreen"
        scrolling="auto"
        frameborder="0"
        crossorigin
      />

      <div v-else :class="[$style['maintain-wrap']]">
        <div :class="[$style['maintain-title']]">
          直播互动升级中
        </div>

        <div :class="[$style['maintain-content']]">
          <div v-for="(item, index) in maintainInfo" class="cell" :key="index">
            <div :class="$style['time-title']">
              {{ item.title }}
            </div>
            <div :class="$style['content']">
              <div :class="$style['date']">
                {{ getDate(item.startAt) }} <br />
                {{ getTime(item.startAt) }}
              </div>
              <div :class="$style['to-img']">
                <img
                  :src="
                    $getCdnPath(
                      '/static/image/common/mcenter/balanceTrans/ic_transfergo_w.png'
                    )
                  "
                />
              </div>

              <div :class="$style['times']">
                {{ getDate(item.endAt) }} <br />
                {{ getTime(item.endAt) }}
              </div>
            </div>
          </div>
        </div>
        <div :class="$style['go-button-wrap']">
          <div @click="goToMobile">
            前往更多游戏<span :class="$style['sec']">{{ sec }}</span>
          </div>
        </div>
      </div>
      <!-- <page-loading :is-show="isLoading" /> -->
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../common/mobileContainer";
import goLangApiRequest from "@/api/goLangApiRequest";
import iframeEvent from "@/mixins/iframeEvent";
import moment from "moment";

export default {
  mixins: [iframeEvent],
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    mobileContainer
  },
  data() {
    return {
      isLoading: true,
      src: "",
      isFullScreen: false,
      contentTitle: "",
      hasFooter: true,
      isMaintain: false,
      maintainInfo: [],
      sec: 5,
      maintainTimer: null
    };
  },

  beforeDestroy() {
    clearInterval(this.updateBalanceTimer);
    this.updateBalanceTimer = null;

    clearInterval(this.maintainTimer);
    this.maintainTimer = null;
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      liveMaintain: "getLiveMaintain"
    }),
    pageType() {
      return this.$route.params.page;
    },
    headerConfig() {
      const query = this.$route.query;

      this.isFullScreen =
        query.fullscreen === undefined ? false : query.fullscreen === "true";

      this.hasFooter =
        query.hasFooter === undefined ? false : query.hasFooter === "true";

      let baseConfig = {
        hasHeader:
          query.hasHeader === undefined ? false : query.hasHeader === "true",
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
          this.$router.back();
        }
      };
    }
  },
  watch: {
    liveMaintain(val) {
      if (val && val.start) {
        this.showMaintainInfo();
        this.isMaintain = true;
      } else {
        this.isMaintain = false;
      }
    },
    "$route.params.page"() {
      this.initPage();
    },
    "$route.query.hasFooter"(value) {
      this.hasFooter = value === undefined ? true : value === "true";
    }
  },
  created() {},
  mounted() {
    // check maintain
    this.actionGetExtRedirect({
      api_uri: "/api/platform/v1/user/front-page?check=1",
      method: "get"
    }).then(() => this.initPage());

    this.updateBalanceTimer = setInterval(() => {
      if (!this.loginStatus) {
        clearInterval(this.updateBalanceTimer);
        this.updateBalanceTimer = null;
      } else {
        this.actionSetUserBalance();
      }
    }, 30000);
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionGetExtRedirect",
      "actionSetUserBalance",
      "actionMemInit"
    ]),
    initPage() {
      let clientUri = "";

      if (this.liveMaintain && this.liveMaintain.start) {
        return;
      }

      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/view-path",
        method: "get"
      }).then(res => {
        if (res && res.result) {
          let isFrom = false;
          if (localStorage.getItem("live-iframe-event-from")) {
            if (
              this.pageType === "home" &&
              (!localStorage.getItem("live-iframe-set-home") ||
                localStorage.getItem("live-iframe-set-home") !== "true")
            ) {
              clientUri = localStorage.getItem("live-iframe-event-from");
              isFrom = true;
            }
          }

          localStorage.removeItem("live-iframe-event-from");
          localStorage.removeItem("live-iframe-set-home");

          if (!isFrom) {
            const list = res.result;
            Object.keys(list).some(key => {
              if (key === this.pageType) {
                this.liveHomeSrc = list["home"];
                clientUri = list[key];
                return;
              }
            });
          }

          goLangApiRequest({
            method: "post",
            url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/Customize`,
            params: {
              code: "cubechat_master",
              clientUri: clientUri
              // clientUri: "https://client-dev.cubechat.asia/"
            }
          }).then(res => {
            if (res && res.data && res.data.uri) {
              let url = res.data.uri;

              if (
                !localStorage.getItem("live-iframe-launch-home") &&
                this.pageType === "home"
              ) {
                url += "&isLaunch=true";
                localStorage.setItem("live-iframe-launch-home", true);
              }

              if (!this.loginStatus) {
                url += `&gcid=${localStorage.getItem("guestCid") || ""}`;
              }

              this.src = url;
            }
            this.isLoading = false;
          });
        }
      });
    },
    showMaintainInfo() {
      const start = moment(this.liveMaintain.start * 1000)
        .add(-12, "hours")
        .format("YYYY-MM-DD HH:mm:ss");
      const end = moment(this.liveMaintain.end * 1000)
        .add(-12, "hours")
        .format("YYYY-MM-DD HH:mm:ss");

      this.maintainInfo = [
        {
          title: "-美东时间-",
          startAt: start,
          endAt: end
        },
        {
          title: "-北京时间-",
          startAt: moment(this.liveMaintain.start * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          endAt: moment(this.liveMaintain.end * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        }
      ];

      this.maintainTimer = setInterval(() => {
        if (this.sec === 0 && !this.$route.query.test) {
          clearInterval(this.maintainTimer);
          this.maintainTimer = null;
          this.goToMobile();
          return;
        }
        this.sec -= 1;
      }, 1000);
    },
    getDate(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    getTime(date) {
      return moment(date).format("HH:mm:ss");
    },
    goToMobile() {
      this.$router.push({
        name: "home"
      });
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
    },
    toogleFooter(data = {}) {
      const show = data.data === true || data.data === "true";
      if (show) {
        this.$router.push({ query: { hasFooter: "true" } });
      } else {
        this.$router.push({ query: { hasFooter: "false" } });
      }
    },
    redirectLive(target = "home") {
      this.$router.push(`/mobile/live/iframe/${target}?hasFooter=true`);

      switch (target) {
        case "home":
          goLangApiRequest({
            method: "post",
            url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/Customize`,
            params: {
              code: "cubechat_master",
              clientUri: this.liveHomeSrc
              // clientUri: "https://client-dev.cubechat.asia/"
            }
          }).then(res => {
            if (res && res.data && res.data.uri) {
              this.src = res.data.uri;
            }
          });
          return;
      }
    },
    onSendMessage() {
      this.iframeOnSendMessage(e);
    }
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";

.iframe-wrap {
  height: calc(100vh);
  width: 100%;
  background-color: #fff;
  transition: margin 0.31s, height 0.31s;
  padding-bottom: 1px;
  overflow: hidden;
  -webkit-overflow-scrolling: touch !important;

  &.fullScreen {
    margin-top: unset !important;
    height: 100vh !important;
  }

  &.has-header {
    margin-top: 43px;
  }

  &.has-footer {
    height: calc(100vh - 66px);
  }
}

.iframe {
  border: none;
  display: block;
  height: 100%;
  margin: 0 auto;
  max-width: $mobile_max_width;
  min-width: 0;
  padding: 0;
  width: 100%;

  -webkit-overflow-scrolling: touch !important;
}

.header {
  margin: 0 auto;
  max-width: $mobile_max_width;
  position: absolute;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  background: white;
  color: #ffffff;
  text-align: center;
  animation: slide-down 0.31s forwards;

  &.fullScreen {
    animation: slide-up 0.31s forwards;
    top: -43px;
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
  color: black;

  > div {
    padding: 0 3px;
    height: 43px;
    line-height: 43px;
  }
}

.maintain-wrap {
  text-align: center;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.maintain-title {
  font-size: 16px;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
  font-weight: 700;
  text-align: center;
  color: #000000;
}

.maintain-content {
  color: #a2a2a2;
  font-weight: 700;
  margin-top: 12px;
  padding: 0 15%;
}

.time-title {
  min-width: 180px;
}

.content {
  display: flex;
  align-content: center;
  justify-content: center;
}

.date,
.times {
  flex: 2;
  padding: 2px 0;
  font-size: 12px;
}

.to-img {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  img {
    width: 12px;
    height: 9px;
  }
}

.go-button-wrap {
  margin-top: 25px;
  text-align: center;
  width: 100%;
  font-weight: 700;

  > div {
    background: #000000;
    border-radius: 25px;
    color: #fff;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    opacity: 1;
    width: 300px;
  }

  .sec {
    color: #e53266;
    margin-left: 6px;
  }
}
</style>
