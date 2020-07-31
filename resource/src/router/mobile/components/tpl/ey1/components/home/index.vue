<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" class="content-wrap">
      <div :class="$style['top-bg']" />
      <home-slider />
      <home-new />
      <home-content />
      <popup
        v-if="popStatus && isShow && !isHidePop"
        @close="popStatus = false"
      />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import homeSlider from './components/homeSlider';
import homeNew from './components/homeNew';
import homeContent from './components/homeContent';
import popup from './components/popup';
import mobileContainer from '../common/mobileContainer';
import mcenter from '@/api/mcenter';
import { getCookie, setCookie } from '@/lib/cookie';

export default {
  components: {
    mobileContainer,
    homeSlider,
    homeNew,
    homeContent,
    popup
  },
  data() {
    return {
      updateBalance: null,
      popStatus: false,
      isShow: false,
      isHidePop: false
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      post: 'getPost'
    }),
    headerConfig() {
      return {
        hasLogo: true,
        hasMemInfo: true,
        onClick: () => {
          this.onClick();
        }
      };
    }
  },
  created() {
    if (localStorage.getItem('new_user')) {
      localStorage.setItem('content_rating', "1");
      localStorage.removeItem('new_user');
      mcenter.accountDataSet({
        params: {
          content_rating: 1
        },
        success: () => {
          this.actionSetUserdata(true);
          window.location.reload(true);
        }
      });
    }

    if (!this.loginStatus) {
      localStorage.setItem('pop', true);
      return;
    }
    this.isHidePop = this.$cookie.get(`hidepop${this.post.config.last_modified_at}`) || false;
    this.popStatus = this.post.list.length > 0;
    this.isShow = localStorage.getItem('pop') || false;
    if (this.isShow) {
      document.querySelector('body').style = 'overflow: hidden';
    }
  },
  mounted() {
    this.updateBalance = setInterval(() => {
      let cid = getCookie("cid");

      if (!cid) {
        clearInterval(this.updateBalance);
        this.updateBalance = null;
      } else {
        this.actionSetUserBalance();
      }
    }, 30000)
  },
  beforeDestroy() {
    clearInterval(this.updateBalance);
    this.updateBalance = null;
  },
  methods: {
    ...mapActions([
      'actionSetPost',
      'actionSetUserBalance',
      'actionSetUserdata'
    ]),
    onClick() {
      this.$router.push('/mobile');
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.top-bg {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: url("/static/image/ey1/common/pic_top.png");
  height: 18%;
  max-height: 130px;
  max-width: $mobile_max_width;
  position: absolute;
  top: 0;
  width: 100vw;
}

@media (orientation: landscape) {
  .top-bg {
    max-width: $mobile_max_landscape_width !important;
  }
}

div.container {
  background-color: #fff;
}
</style>
