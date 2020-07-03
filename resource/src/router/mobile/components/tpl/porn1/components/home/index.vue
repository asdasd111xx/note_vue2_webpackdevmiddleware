<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" class="content-wrap">
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
import mobileContainer from '../common/new/mobileContainer';
import mcenter from '@/api/mcenter';

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
        hasSearchBtn: false,
        onClick: () => {
          this.onClick();
        }
      };
    }
  },
  created() {
    if (localStorage.getItem('new_user')) {
      mcenter.accountDataSet({
        params: {
          content_rating: 1
        },
        success: () => {
          this.actionSetUserdata(true);
          localStorage.removeItem('new_user');
          window.location.reload();
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

    this.updateBalance = setInterval(() => {
      this.actionSetUserBalance()
    }, 20000)
  },
  beforeDestroy() {
    clearInterval(this.updateBalance)
    this.updateBalance = null
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
div.container {
  background-color: #fff;
}
</style>
