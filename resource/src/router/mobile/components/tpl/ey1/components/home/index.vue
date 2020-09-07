<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :is-home="true"
  >
    <div slot="content" class="content-wrap">
      <div :class="$style['top-bg']" />
      <home-slider />
      <home-new />
      <home-content />
      <popup v-if="isShowPop" @close="closePop" :sitePostList="sitePostList" />
    </div>
  </mobile-container>
</template>

<script>
import { getCookie, setCookie } from '@/lib/cookie';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import homeContent from './components/homeContent';
import homeNew from './components/homeNew';
import homeSlider from './components/homeSlider';
import mcenter from '@/api/mcenter';
import mobileContainer from '../common/mobileContainer';
import popup from './components/popup';

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
      isShowPop: false,
      sitePostList: null,
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

    // 先顯示彈跳公告關閉後再顯示一般公告
    if (this.loginStatus && !localStorage.getItem('is-show-popup-announcement')) {
      axios({
        method: 'get',
        url: '/api/v1/c/player/popup-announcement',
      }).then((res) => {
        if (res.data && res.data.ret && res.data.ret.length > 0) {
          this.sitePostList = res.data.ret;
          this.isShowPop = true;
        }
      }).catch(res => { });
    }
  },
  watch: {
    isShowPop(val) {
      if (val) {
        document.querySelector('body').style = 'overflow: hidden';
      } else {
        document.querySelector('body').style = '';
      }
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
    },
    closePop(isFromSitePost) {
      this.isShowPop = false;
      this.sitePostList = null;

      if (!localStorage.getItem('do-not-show-home-post')) {
        setTimeout(() => {
          this.$nextTick(() => {
            if (isFromSitePost) {
              this.isShowPop = true;
            }
          })
        }, 500)
      }
    }
  }
};
</script>


<style lang="scss" module>
@import "~@/css/variable.scss";

.top-bg {
  background: url("/static/image/ey1/common/pic_top.png");
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  height: 120px;
  width: 100%;
  top: 0;
  position: absolute;
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
