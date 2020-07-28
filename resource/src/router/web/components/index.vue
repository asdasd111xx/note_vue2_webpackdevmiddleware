<template>
  <div :style="backgroundStyle" class="index">
    <!-- 模板 -->
    <template>
      <component :is="templateName" />
    </template>
    <!-- 玩過、最愛 -->
    <collection v-if="!isWebview" />
    <!-- 拉頁 -->
    <change-ver v-if="isChangeVerShow" />
    <!-- 各彈窗 (前台才顯示) -->
    <ele-pop v-if="!isBackEnd" />
    <!-- 最新消息彈跳視窗 -->
    <pop-news v-if="!isBackEnd" />
    <!-- 推播中心視窗 -->
    <notice-center
      v-show="!isBackEnd && noticeData.length > 0"
      :notice-data="noticeData"
    />
  </div>
</template>

<script>
/* global $ */
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { API_CDN } from '@/config/api';
import bodyBg from '@/config/body_bg';
import jackpotDefault from '@/config/jackpotDefault';
import apiBalanceAutoBack from '@/lib/balance_auto_back';
import store from '@/store';
import links from '@/config/links';
import exceptionList from '@/config/exceptionList';
import isMobile from '@/lib/is_mobile';
import popNews from './common/popNews';
import noticeCenter from './common/noticeCenter';

export default {
  metaInfo() {
    return this.metaInfo;
  },
  components: {
    collection: () => import(/* webpackChunkName: 'collection' */'./tpl/common/collection'),
    changeVer: () => import(/* webpackChunkName: 'changeVer' */'./tpl/common/changeVer'),
    elePop: () => import(/* webpackChunkName: 'elePop' */'./tpl/common/pop'),
    popNews,
    noticeCenter
  },
  data() {
    return {
      metaInfo: {
        title: '',
        meta: [{
          name: 'viewport',
          content: ''
        }]
      }
    };
  },
  computed: {
    ...mapGetters({
      isBackEnd: 'getIsBackEnd',
      isWebview: 'getIsWebview',
      siteConfig: 'getSiteConfig',
      nowpage: 'getNowpage',
      webInfo: 'getWebInfo',
      tplTxtStyle: 'getTplTxtStyle',
      background: 'getBackground',
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
      jackpot: 'getJackpot',
      page: 'getPage',
      cdnDomain: 'getCdnDomain',
      noticeData: 'getNoticeData'
    }),
    templateName() {
      return `template${this.webInfo.model}`;
    },
    /**
     * 是否為客製首頁
     */
    isCustomizeHome() {
      // 新版不顯示客製化首頁
      if (this.webInfo.multi_config.status === 1) {
        return false;
      }

      // RD1 測試站，判斷是否有設定要測試的客製首頁
      if (!this.isBackEnd && this.siteConfig.TESTER === 'Y') {
        return this.$cookie.get('TEST_HOME') !== null && this.$cookie.get('TEST_HOME') !== '';
      }

      return this.siteConfig.CUSTOMIZE_HOME_TPL_PATH.length > 0 && this.siteConfig.CUSTOMIZE_HOME_TPL_PATH.includes(this.webInfo.model);
    },
    /**
     * 是否開啟拉頁
     * @method isChangeVerShow
     * @returns {boolean} true or false
     */
    isChangeVerShow() {
      // 拉頁只在首頁顯示
      if (this.nowpage !== this.webInfo.page[0].pid) {
        return false;
      }

      return this.webInfo.multi_config.status === 2 && this.webInfo.multi_config.switch;
    },
    pageData() {
      for (let i = 0; i < this.page.length; i += 1) {
        if (+this.page[i].pid === +this.nowpage) {
          return this.page[i];
        }

        if (this.page[i].sub_page && this.page[i].sub_page.length) {
          for (let si = 0; si < this.page[i].sub_page.length; si += 1) {
            if (+this.page[i].sub_page[si].pid === +this.nowpage) {
              return this.page[i].sub_page[si];
            }
          }
        }
      }

      return null;
    },
    backgroundStyle() {
      if (this.pageData && this.pageData.custom_background && this.pageData.custom_background === 'custom') {
        return this.backgroundStyleHandler(this.pageData);
      }

      return this.backgroundStyleHandler(this.background);
    },
    // 特例判斷
    isException() {
      const { wonderCasino, knightCasino } = exceptionList;
      return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
    }
  },
  watch: {
    /* eslint-disable object-shorthand */
    '$route.params.pid'() {
      if (String(this.nowpage) === this.$route.params.pid || (!this.$route.params.pid && this.nowpage === this.webInfo.page[0].pid)) {
        return;
      }
      this.actionChangePage({ page: this.$route.params.pid || this.webInfo.page[0].pid, subPage: this.$route.params.subId || '' });
    },
    jackpot(nextJackpot, prevJackpot) {
      if (this.isBackEnd) {
        return;
      }

      Object.keys(nextJackpot).forEach((key) => {
        if (nextJackpot[key].isShow !== prevJackpot[key].isShow) {
          this.actionGetJackpot({ casinoType: key });

          setInterval(() => {
            this.actionGetJackpot({ casinoType: key });
          }, 600000);
        }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    const isPreview = to.path.split('/').includes('preview');

    if (to.query.newsite && to.query.newsite === 'Y') {
      Vue.cookie.set('newsite', true);
    }

    // 指定為預覽模式，抓取廳主自改預覽資料
    if (isPreview) {
      if (Vue.cookie.get('newsite') && !to.query.newsite) {
        Vue.cookie.delete('newsite');
      }

      store.dispatch('actionSetPreview', true);
    }

    if (from.name === 'home' || from.name === 'page') {
      next();
      return;
    }
    store.dispatch('actionMemInit').then(() => { next(); });
  },
  beforeRouteUpdate(to, from, next) {
    const isPreview = from.path.split('/').includes('preview');

    if (isPreview && !to.path.split('/').includes('preview')) {
      next(`/preview${to.path}`);
      return;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    const isPreview = from.path.split('/').includes('preview');

    if (isPreview && !to.path.split('/').includes('preview')) {
      next({ path: `/preview${to.path}` });
      return;
    }

    next();
  },
  created() {
    if (this.siteConfig.IS_MOBILE) {
      window.location.href = '/mobile';
      return;
    }
    const isLogin = this.loginStatus;

    // 使用者離開頁面時通知rd5，自動回收機制-回收
    window.onbeforeunload = () => {
      if (isLogin) {
        apiBalanceAutoBack('out');
      }
    };

    // 使用者回來頁面時通知rd5，自動回收機制-取消回收
    if (isLogin) {
      apiBalanceAutoBack('in');
    }

    console.log(`%cversion: ${process.env.TIMESTAMP}`, 'background: #222; color: #BADA55');

    const webName = this.memInfo.config.domain_name[this.$i18n.locale];
    const webTitle = this.webInfo.web_title[this.$i18n.locale];

    // 設定網站資訊
    this.metaInfo = {
      ...this.metaInfo,
      title: `${webName}-${webTitle}`
    };
    $("meta[name='keywords']").attr('content', this.webInfo.web_keyword ? this.webInfo.web_keyword[this.$i18n.locale] : '');
    $("meta[name='description']").attr('content', this.webInfo.web_description ? this.webInfo.web_description[this.$i18n.locale] : '');
    $("link[type='image/x-icon']").attr('href', this.webInfo.fav_icon ? `${API_CDN}${this.webInfo.fav_icon}` : '');

    // 登入前如果代理端為登入狀態即登出
    if (!this.loginStatus) {
      store.dispatch('actionSetAgentdata');
    }

    // 如果網址列有串a導到會員註冊頁
    if (this.$route.params && this.$route.params.agentId) {
      this.$cookie.set('a', this.$route.params.agentId);

      if (this.isException) {
        this.$router.push({ name: 'home' });
        return;
      }

      // 威尼斯電腦版代理推廣導頁
      if (!isMobile() && (this.webInfo.alias === '500000' || this.webInfo.alias === '48' || this.webInfo.alias === '50')) {
        const { domain } = this.memInfo.user;
        const link = {
          500000: '31312',
          48: '10483',
          50: '10515'
        };

        this.actionChangePage({ page: link[domain] });
        return;
      }

      this.actionChangePage({ page: 'join', type: '' });
      return;
    }

    const pageObj = this.webInfo.page.filter((info) => info.page_type === 'custom')[0];
    const pageAvailable = this.webInfo.pageData[this.$route.params.pid] || links.static.some((item) => item.value === this.$route.params.pid);

    if (this.$route.query.page) {
      if (this.$route.query.page === 'pwdreset') {
        this.actionChangePage({ page: this.$route.query.page, config: { type: this.$route.query.type, kr: this.$route.query.kr } });
      } else {
        this.actionChangePage({ page: this.$route.query.page, type: '' });
      }
    } else if (pageAvailable || this.$route.params.pid === 'mcenter') {
      this.actionChangePage({ page: this.$route.params.pid, type: '', subPage: this.$route.params.subId || '' });
    } else if (pageObj) {
      this.actionChangePage({ page: pageObj.pid, type: pageObj.page_type });
    }

    if (this.$route.name === 'webview') {
      const pid = this.nowpage;
      this.actionChangePage({ page: pid, type: 'webview' });
    }

    if (this.isBackEnd) {
      this.actionSetJackpot(jackpotDefault);
    }
  },
  mounted() {
    const $body = $('.body');

    // 版面色系
    $body.addClass(this.webInfo.style_color);
  },
  methods: {
    ...mapActions([
      'actionSetWebview',
      'actionChangePage',
      'actionGetJackpot',
      'actionSetJackpot'
    ]),
    backgroundStyleHandler(styleData) {
      const style = {};

      if (this.nowpage === 'mcenter' && bodyBg[this.webInfo.model] && bodyBg[this.webInfo.model][this.webInfo.style_color]) {
        style.background = bodyBg[this.webInfo.model][this.webInfo.style_color];
        return style;
      }

      // 背景圖片
      if (styleData.bg_img) {
        style['background-image'] = `url(${this.$getCdnPath(`${this.cdnDomain}/${styleData.bg_img}`)})`;
      }

      // 背景顏色 (前台- 新舊版共存特例)
      if ((styleData.isbgColor && styleData.isbgColor === 'Y') || (!styleData.isbgColor && styleData.bg_Color) || styleData.custom_color) {
        style['background-color'] = styleData.bg_color;
      }

      // 背景捲動
      if (styleData.bg_scroll === 'Y') {
        style['background-attachment'] = 'fixed';
      }

      // 背景重複
      if (styleData.bg_repeat) {
        style['background-repeat'] = styleData.bg_repeat;
      }

      // 背景位置
      if (styleData.bg_align) {
        const bgAlign = styleData.bg_align.split('');

        const positionX = {
          c: 'center',
          r: 'right',
          l: 'left'
        };

        const positionY = {
          c: 'center',
          t: 'top',
          b: 'bottom'
        };

        style['background-position-x'] = positionX[bgAlign[0]];
        style['background-position-y'] = positionY[bgAlign[1]];
      }

      // 版面字型
      if (this.webInfo.txt_style === 'default') {
        style['font-family'] = this.tplTxtStyle.default;
      } else {
        style['font-family'] = `${this.tplTxtStyle[this.webInfo.txt_style]}, ${this.tplTxtStyle.default}`;
      }

      return style;
    }
  }
};
</script>

<style lang="scss" scoped>
.index {
  min-height: 100%;
}
</style>
