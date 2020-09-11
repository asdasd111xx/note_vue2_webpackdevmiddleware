<template>
  <div
    :class="[
      $style['iframe-wrap'],
      {
        [$style['has-header']]: headerConfig.hasHeader
      }
    ]"
    :style="{ height: `calc(100vh - ${iframeHeight})` }"
  >
    <div v-if="headerConfig.hasHeader" id="header" :class="$style['header']">
      <div :class="$style['btn-prev']" @click="headerConfig.onClick">
        <img
          :src="$getCdnPath(`/static/image/${themeTPL}/common/btn_back.png`)"
        />
      </div>
      <div v-if="headerConfig.title" :class="[$style.title]">
        <div :class="[[$style.title]]">
          {{ headerConfig.title }}
        </div>
      </div>
    </div>
    <iframe
      :ref="'iframe'"
      :class="[$style['iframe']]"
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
  created() {
    // localStorage.setItem('open-game-link', 'https://star.xbb-slot-test.com:8888/starfruit/slot/1000030?lang=zh-cn&sid=8eedfbc72ec4e46dc8e83fcafee5c7afe292dcc40546150ce9dffdd54116ff14')
  },
  mounted() {
    const params = this.$route.params;
    switch (params.page.toUpperCase()) {
      case 'LF':
      case 'APB':
      case 'BALE':
      case 'STB':
      case 'JPB':
      case 'DSC':
      case 'PPV':
      case 'SF':
        yaboRequest({
          method: 'get',
          url: `${this.siteConfig.YABO_API_DOMAIN}/thirdparty/url`,
          headers: {
            'x-domain': this.memInfo.user.domain
          },
          params: {
            type: params.page.toUpperCase(),
            userid: this.memInfo.user.id
          },
        }).then(res => {
          this.src = res.data;
        })
        break;
      case 'THIRD':
        axios({
          method: 'get',
          url: '/api/v1/c/link/customize',
          params: {
            code: 'fengniao',
            client_uri: localStorage.getItem('iframe-third-url')
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
      default:
        this.$router.back();
        break;
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
    }),
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
        hasFooter: query.hasFooter === undefined ? false : query.hasFooter === 'true',
        prev: query.prev === undefined ? true : query.prev,
        title: query.title || '',
        onClick: () => {
          this.$router.push('/mobile/')
          if (query.prev) {
          }
        }
      };
    },
  },
  beforeDestroy() {
    window.removeEventListener("message", this.onListener);
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    onListener(event) {
      //   console.log(event)
    },
    onLoadiframe(event) {
      console.log('onLoadiframe:', event)
      this.$nextTick(() => {
        setTimeout(() => {
          this.isLoading = false;
        }, 310)
      })
      try {
        window.addEventListener('message', this.onListener);
        const self = this;
        this.$refs.iframe.contentWindow.onbeforeunload = (e) => {
          console.log(e)
          // 取消預設關閉 取代成回上一頁
          e.preventDefault();
          e.stopPropagation();
          //   self.$router.back();
        }
      } catch (e) {
        console.log('onbeforeunload Catch:', e)
      }
    },
    linkTo(item) {

    }
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.iframe-wrap {
  height: calc(100vh);
  width: 100%;
  overflow-x: hidden;

  &.has-header {
    padding-top: 43px;
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
  //   background: linear-gradient(#fe2a2a, #b60303);
  background: #c7c7cc;
  color: #ffffff;
  text-align: center;
  border-bottom: 1px solid #eee;
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
  color: #ffffff;
  font-size: 17px;
  font-weight: 500;
  margin: 0 auto;
}

.iframe {
  //   overflow: auto !important;
  //   -webkit-overflow-scrolling: touch !important;

  background-color: #f2f2f2;
  border: none;
  display: block;
  height: 100%;
  margin: 0 auto;
  max-width: $mobile_max_width;
  min-width: 0;
  padding: 0;
  width: 100%;
}
</style>
