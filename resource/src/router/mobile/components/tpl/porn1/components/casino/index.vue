<template>
  <mobile-container
    :header-config="headerConfig"
    :update-search-status="updateSearchStatus"
  >
    <div slot="content" class="content-wrap">
      <casino-wrap
        :is-show-search.sync="isShowSearch"
        :game-show-jackpot="true"
      />
    </div>
  </mobile-container>
</template>

<script>
import casinoWrap from "@/router/mobile/components/common/casino";
import mobileContainer from "../common/mobileContainer";
import { mapGetters } from "vuex";

export default {
  components: {
    mobileContainer,
    casinoWrap
  },
  data() {
    return {
      searchStatus: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    headerConfig() {
      let vendor = this.$route.params.vendor;
      const target = this.memInfo.vendors.find(item => item.vendor === vendor);
      return {
        prev: true,
        title: target.alias || "",
        hasSearchBtn: true,
        onClick: () => {
          this.$router.back();
        }
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
