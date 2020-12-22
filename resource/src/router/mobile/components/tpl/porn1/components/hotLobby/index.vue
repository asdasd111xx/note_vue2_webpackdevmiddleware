<template>
  <mobile-container
    :header-config="headerConfig"
    :update-search-status="updateSearchStatus"
  >
    <div slot="content" class="content-wrap">
      <hot-lobby
        :lobby-name.sync="lobbyName"
        :is-show-search.sync="isShowSearch"
      />
    </div>
  </mobile-container>
</template>

<script>
import hotLobby from "@/router/mobile/components/common/hotLobby";
import mobileContainer from "../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    hotLobby
  },
  data() {
    return {
      searchStatus: false,
      lobbyTitle: ""
    };
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        title: this.lobbyName, // 大廳名稱由子元件同步回傳上來
        hasSearchBtn: true,
        onClick: () => {
          this.$router.back();
        }
      };
    },
    lobbyName: {
      get() {
        return this.lobbyTitle;
      },
      set(value) {
        this.lobbyTitle = value;
      }
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
</style>
