<template>
  <mobile-container
    :header-config="headerConfig"
    :update-search-status="updateSearchStatus"
    :has-footer="false"
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
      kind: 6,
      searchStatus: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    headerConfig() {
      let vendor = this.$route.params.vendor;
      const target = this.memInfo.vendors.find(
        item => item.vendor === vendor && item.kind === this.kind
      );
      return {
        prev: true,
        title: this.$route.query.title || target.alias,
        hasSearchBtn: true,
        onClick: () => {
          if (localStorage.getItem("_iframe-back-route")) {
            const target =
              Number(localStorage.getItem("_iframe-back-route")) || 3;
            localStorage.removeItem("_iframe-back-route");
            this.$router.push("/mobile");
            return;
          }
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
</style>
