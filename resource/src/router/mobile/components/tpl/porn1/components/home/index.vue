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
  methods: {
    ...mapActions([
      'actionSetPost'
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
