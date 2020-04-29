<template>
  <mobile-container :class="$style.container" :header-config="headerConfig">
    <div slot="content" class="content-wrap">
      <component :is="template" v-if="isAdult" />
      <no-porn v-else />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../common/new/mobileContainer';

export default {
  components: {
    mobileContainer,
    noPorn: () => import('./components/new/noPorn'),
    discoverHome: () => import('./components/new/discoverHome'),
    discoverTag: () => import('./components/new/discoverTag'),
    discoverArtist: () => import('./components/new/discoverArtist'),
    discoverRank: () => import('./components/new/discoverRank'),
    discoverSponsor: () => import('./components/new/discoverSponsor')
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    isAdult() {
      return this.memInfo.config.content_rating && this.memInfo.user.content_rating;
    },
    headerConfig() {
      const name = this.$route.params.page || 'home';
      const trans = {
        home: this.$text('S_DISCOVER', '发现'),
        sponsor: this.$text('S_SPONSOR_PARTNERS', '赞助伙伴'),
        rank: this.$text('S_RANK', '排行'),
        artist: this.$text('S_ARTIST', '女优'),
        tag: this.$text('S_TAG', '标签')
      };

      return {
        isBackgroundGradient: true,
        hasSearchBtn: name === 'home',
        title: trans[name],
      };
    },
    template() {
      return this.$route.params.page ? `discover-${this.$route.params.page}` : 'discover-home';
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
