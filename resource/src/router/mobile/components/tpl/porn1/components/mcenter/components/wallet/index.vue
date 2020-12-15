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

export default {
  components: {
    mobileContainer,
    wallet
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.push("/mobile/mcenter");
        },
        title: this.$text("S_WALLET2", "钱包"),
        customLinkTitle: this.$text("S_TRANSACTION_RECORD", "交易记录"),
        customLinkAction: () => {
          this.$router.push("/mobile/mcenter/moneyDetail");
        }
      };
    }
  }
};
</script>

<style lang="scss" module>
.container {
  background-color: #f8f8f8;
}
</style>
