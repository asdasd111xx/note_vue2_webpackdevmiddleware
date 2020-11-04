<template>
  <div
    :class="[
      $style['iframe-wrap'],
      {
        [$style['has-header']]: headerConfig.hasHeader
      }
    ]"
    :style="{ height: `calc(100vh - ${iframeHeight}px)` }"
  >
    <div
      v-if="headerConfig.hasHeader"
      id="header"
      :class="[$style['header'], $style[themeTPL]]"
    >
      <div :class="$style['btn-prev']" @click="headerConfig.onClick">
        <img
          :src="$getCdnPath(`/static/image/${themeTPL}/common/btn_back.png`)"
        />
      </div>
      <div v-if="headerConfig.title" :class="[$style.title, $style[themeTPL]]">
        {{ headerConfig.title }}
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
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import yaboRequest from '@/api/yaboRequest';
import goLangApiRequest from '@/api/goLangApiRequest';

export default {
  data() {
    return {
      isLoading: true,
      src: '',
    }
  },
  components: {
    pageLoading: () => import(/* webpackChunkName: 'pageLoading' */ '@/router/mobile/components/common/pageLoading'),
  },
  beforeDestroy() {
    let container = document.getElementById('mobile-container');
    if (container && container.style) {
      container.style = "";
    }
  },
  created() {
    // localStorage.setItem('open-game-link', 'https://star.xbb-slot-test.com:8888/starfruit/slot/1000030?lang=zh-cn&sid=8eedfbc72ec4e46dc8e83fcafee5c7afe292dcc40546150ce9dffdd54116ff14')
  },
  mounted() {
    let container = document.getElementById('mobile-container');
    if (container && container.style) {
      container.style = "min-height:unset";
    }

    const params = this.$route.params;
    if (!params.page) {
      this.src = localStorage.getItem('iframe-third-url');
      return;
    }

    switch (params.page.toUpperCase()) {
      case 'LF':
      case 'APB':
      case 'BALE':
      case 'STB':
      case 'JPB':
      case 'DSC':
      case 'PPV':
      case 'SF':
      case 'SWAG':
        // yaboRequest({
        //   method: 'get',
        //   url: `${this.siteConfig.YABO_API_DOMAIN}/thirdparty/url`,
        //   headers: {
        //     'x-domain': this.memInfo.user.domain
        //   },
        //   params: {
        //     type: params.page.toUpperCase(),
        //     userid: this.memInfo.user.id
        //   },
        // }).then(res => {
        //   this.src = res.data;
        // })
        let userId = 'guest';
        if (this.memInfo && this.memInfo.user && this.memInfo.user.id && this.memInfo.user.id !== 0) {
          userId = this.memInfo.user.id;
        }

        goLangApiRequest({
          method: 'get',
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/ThirdParty/${params.page.toUpperCase()}/${userId}`,
          headers: {
            'x-domain': this.memInfo.user.domain
          },
        }).then(res => {
          this.src = res.data;
        })
        // SWAG
        // this.src = 'https://feature-yabo.app.swag.live/';
        break;
      case 'THIRD':
        axios({
          method: 'get',
          url: '/api/v1/c/link/customize',
          params: {
            code: 'fengniao',
            client_uri: localStorage.getItem('iframe-third-url') || ''
          }
        }).then(res => {
          this.isLoading = false;
          if (res && res.data && res.data.ret && res.data.ret.uri) {
            this.src = res.data.ret.uri;
          }
        }).catch(error => {
          this.isLoading = false;
          if (error && error.data && error.date.msg) {
            this.actionSetGlobalMessage({ msg: error.data.msg });
          }
        })
        break;
      case 'GAME':
        this.src = localStorage.getItem('iframe-third-url');
        break;
      case 'PROMOTION':
        // 優小秘
        let url = localStorage.getItem('iframe-third-url');
        if (url && url.indexOf('?') > 0) {
          url = `${url}&v=m`;
        } else {
          url = `${url}?v=m`;
        }
        this.src = url
        break;

      default:
        this.src = localStorage.getItem('iframe-third-url');
        break;
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
      webInfo: 'getWebInfo',
    }),
    originUrl() {
      let origin = this.$route.params.page.toUpperCase();
      switch (origin) {
        case 'THIRD':
          return '/mobile/gift';
        case 'PROMOTION':
          return '/mobile/promotion';
        default:
          return '/mobile';
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
      return {
        hasHeader: query.hasHeader === undefined ? false : query.hasHeader === 'true',
        hasFooter: query.hasFooter === undefined ? true : query.hasFooter === 'true',
        prev: query.prev === undefined ? true : query.prev,
        title: query.title || localStorage.getItem('iframe-third-url-title') || '',
        onClick: () => {
          this.$router.push(this.originUrl);
        }
      };
    },
  },
  beforeDestroy() {
    window.removeEventListener("message", this.onListener);
    localStorage.removeItem('iframe-third-url-title');
    localStorage.removeItem('iframe-third-url');
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    getCustomizeLink(params) {
      axios({
        method: 'get',
        url: '/api/v1/c/link/customize',
        params: params
      }).then(res => {
        this.isLoading = false;
        if (res && res.data && res.data.ret && res.data.ret.uri) {
          this.src = res.data.ret.uri;
        }
      }).catch(error => {
        this.isLoading = false;
        if (error && error.data && error.date.msg) {
          this.actionSetGlobalMessage({ msg: error.data.msg });
        }
      })
    },
    onListener(e) {
      console.log(e)
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
        console.log(data);

        if (!data.event) {
          return;
        }

        switch (data.event) {
          case 'EVENT_THIRDPARTY_CLOSE':
          case 'close':
            this.$router.push(this.originUrl);
            return;

          case 'EVENT_THIRDPARTY_LOGIN':
            this.$router.push('/mobile/login');
            return;

          case 'EVENT_THIRDPARTY_CURRENCY_NOT_ENOUGH':
            this.$router.push('/mobile/mcenter/swag?tab=0');
            return;

          default:
            return;
        }
      }
    },
    onLoadiframe(event) {
      // console.log('onLoadiframe:', event)
      this.$nextTick(() => {
        setTimeout(() => {
          this.isLoading = false;
        }, 310)
      })
      try {
        window.addEventListener('message', this.onListener);
        // const self = this;
        // this.$refs.iframe.contentWindow.onbeforeunload = (e) => {
        //   console.log(e)
        //   //   // 取消預設關閉 取代成回上一頁
        //   //   e.preventDefault();
        //   //   e.stopPropagation();
        //   //   self.$router.back();
        // }
      } catch (e) {
        console.log('onbeforeunload Catch:', e)
      }
    },
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.iframe-wrap {
  height: 100vh;
  width: 100%;
  background-color: #fff;
  // overflow: hidden;

  &.has-header {
    margin-top: 43px;
  }
}

.header {
  margin: 0 auto;
  max-width: $mobile_max_width;
  position: fixed;
  top: 0;
  z-index: 3;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  background: white;
  color: #ffffff;
  text-align: center;
  // border-bottom: 1px solid #eee;

  &.ey1 {
    background: linear-gradient(#fe2a2a, #b60303);
  }

  &.porn1 {
    background: white;
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

  > img {
    display: block;
    width: 100%;
  }
}

.wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.title {
  height: 43px;
  line-height: 43px;
  color: black;
  font-size: 17px;
  font-weight: 500;
  margin: 0 auto;

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
