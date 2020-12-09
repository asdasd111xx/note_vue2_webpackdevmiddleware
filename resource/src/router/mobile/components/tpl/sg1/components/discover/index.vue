<template>
  <mobile-container :class="$style.container" :header-config="headerConfig">
    <div slot="content" class="content-wrap">
      <component :is="template" />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../common/mobileContainer';

export default {
  components: {
    mobileContainer,
    discoverHome: () => import('./components/discoverHome'),
    discoverSponsor: () => import('./components/discoverSponsor')
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    isAdult() {
      if (localStorage.getItem('content_rating')) {
        return localStorage.getItem('content_rating') === "1" ? true : false;
      } else {
        return this.memInfo.config.content_rating && this.memInfo.user.content_rating;
      }
    },
    headerConfig() {
      const name = this.$route.params.page || 'home';
      const trans = {
        // home: this.$text('S_DISCOVER', '发现'),
        // sponsor: '联盟伙伴',
        // rank: this.$text('S_RANK', '排行'),
        // artist: this.$text('S_ARTIST', '女优'),
        // tag: this.$text('S_TAG', '标签')
      };

      return {
        prev: true,
        isBackgroundGradient: true,
        hasSearchBtn: name === 'home' && this.isAdult,
        title: '联盟伙伴',
        onClick: () => {
          this.$router.back();
        }
      };
    },
    template() {
      return 'discover-sponsor';
      // if (this.isAdult) {
      //   return this.$route.params.page ? `discover-${this.$route.params.page}` : 'discover-sponsor';
      // } else {
      //   let page = this.$route.params.page || "";
      // switch (page) {
      //   case "tag":
      //   case "artist":
      //   case "rank":
      //   case "":
      //     return 'discover-home';
      //   default:
      //     return `discover-${page}`;
      // }
      // }
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: $main_background_white1;
}
</style>
