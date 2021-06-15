<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" class="content-wrap">
      <activity :lobby-name.sync="lobbyName" />
    </div>
  </mobile-container>
</template>

<script>
import activity from "@/router/mobile/components/common/activity";
import mobileContainer from "../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    activity
  },
  data() {
    return {
      searchStatus: false,
      lobbyTitle: ""
    };
  },
  computed: {
    headerConfig() {
      let title = localStorage.getItem("iframe-third-url-title");
      return {
        prev: true,
        title: title || this.lobbyName, // 大廳名稱由子元件同步回傳上來
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
    lobbyName: {
      get() {
        return this.lobbyTitle;
      },
      set(value) {
        this.lobbyTitle = value;
      }
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
</style>
