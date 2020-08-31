<template>
  <mobile-container
    :header-config="headerConfig"
    :update-search-status="updateSearchStatus"
  >
    <div slot="content" class="content-wrap">
      <mahjong-wrap
        :slot-sort="['search', 'list']"
        :is-show-search.sync="isShowSearch"
        :label-theme="'ey1'"
        :game-theme="'ey1'"
      />
    </div>
  </mobile-container>
</template>

<script>
import mahjongWrap from '@/router/mobile/components/common/mahjong';
import mobileContainer from '../common/mobileContainer';

export default {
  components: {
    mahjongWrap,
    mobileContainer
  },
  data() {
    return {
      searchStatus: false
    };
  },
  computed: {
    headerTitle() {
      const vendor = this.$route.params.vendor || 'all';
      let textCode = '';

      switch (vendor) {
        case 'all':
          textCode = 'S_ALL';
          break;
        default:
          textCode = `S_${vendor}`.toUpperCase();
          break;
      }

      return this.$text(textCode);
    },
    headerConfig() {
      return {
        prev: true,
        title: this.headerTitle,
        hasSearchBtn: true,
        onClick: () => { this.$router.back(); }
      };
    },
    isShowSearch: {
      get() {
        return this.searchStatus;
      },
      set() {
        this.searchStatus = !this.searchStatus;
      }
    }
  },
  methods: {
    updateSearchStatus() {
      this.searchStatus = !this.searchStatus;
    }
  }
};

</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

:global {
  .game-item-wrap {
    max-width: 960px;
    min-width: 320px;
    margin: 0 auto;
    padding: 45px 10px;
  }
}

@media screen and (min-width: $phone) {
  :global {
    .game-item-wrap {
      padding: 62px 20px;
    }
  }
}
</style>
