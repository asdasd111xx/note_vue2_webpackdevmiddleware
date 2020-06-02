<script>
import { mapGetters } from 'vuex';
import apiBalanceAutoBack from '@/lib/balance_auto_back';
import store from '@/store';
import config from './route/config';
import { getCookie, setCookie } from '@/lib/cookie';

export default {
  components: config.root,
  beforeRouteEnter(to, from, next) {
    // 指定為預覽模式，抓取廳主自改預覽資料
    if (to.name && to.name === 'preview') {
      store.dispatch('actionSetPreview', true);
    }

    if (to.name && to.name === 'agcenter') {
      next();
      return;
    }

    (async () => {
      await store.dispatch('actionMemInit');
      store.dispatch('actionGetMobileInfo', store.state.memInfo.user.domain);
      next();
    })();
  },
  data() {
    return {
      tabFocused: true,
      screenHidden: ''
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo'
    }),
    theme() {
      return 'root-porn1';
    }
  },
  created() {
    // 版本&平台
    let platform = this.$route.query.platform || getCookie('platform') || '';
    setCookie('platform', platform);


    // 設置隱藏屬性和改變可見屬性的事件的名稱
    let visibilityChange;
    if (typeof document.hidden !== 'undefined') {
      this.screenHidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      this.screenHidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      this.screenHidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    window.addEventListener(visibilityChange, this.screenVisibilityCheck, false);

    // 使用者離開頁面時通知rd5，自動回收機制-回收
    window.onbeforeunload = () => {
      // 登入狀態，且網頁正被開啟才觸發離開網頁
      if (this.loginStatus && this.tabFocused) {
        apiBalanceAutoBack('out');
      }
    };

    // 使用者回來頁面時通知rd5，自動回收機制-取消回收
    if (this.loginStatus) {
      apiBalanceAutoBack('in');
    }

    if (this.loginStatus && this.memInfo.user.password_reset) {
      this.$router.push('/mobile/resetPwd');
    }
  },
  methods: {
    /**
     * 檢查網頁是否正被開啟
     * @method screenVisibilityCheck
     */
    screenVisibilityCheck() {
      this.tabFocused = !document[this.screenHidden];
    }
  },
  render(createElement) {
    return createElement(this.theme);
  }
};
</script>
