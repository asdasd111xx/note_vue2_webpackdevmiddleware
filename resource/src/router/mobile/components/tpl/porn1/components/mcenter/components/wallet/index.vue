<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap">
      <wallet />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../common/mobileContainer";
import wallet from "./components/index";
import { sendUmeng } from "@/lib/sendUmeng";

export default {
  components: {
    mobileContainer,
    wallet
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          let redirect = this.$route.query.redirect;
          let prev = this.$route.query.prev;
          if (redirect) {
            if (redirect === "home") {
              this.$router.back();
            }
          } else if (prev && prev === "back") {
            this.$router.back();
          } else {
            this.$router.push("/mobile/mcenter");
          }
        },
        title: this.$text("S_WALLET2", "钱包"),
        customLinkTitle: this.$text("S_TRANSACTION_RECORD", "交易记录"),
        customLinkAction: () => {
          sendUmeng(38);
          this.$router.push("/mobile/mcenter/moneyDetail");
        }
      };
    }
  },
  created() {
    sendUmeng(37);
  }
};
</script>

<style lang="scss" module>
.container {
  background-color: #f8f8f8;
}
</style>
