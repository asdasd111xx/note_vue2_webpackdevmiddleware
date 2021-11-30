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
import mobileContainer from "../../../common/mobileContainer";
import wallet from "@/router/mobile/components/tpl/porn1/components/mcenter/components/wallet/components/index";
import { sendUmeng } from "@/lib/sendUmeng";

export default {
  components: {
    mobileContainer,
    wallet
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
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
          sendUmeng(37);
          this.$router.push("/mobile/mcenter/moneyDetail");
        }
      };
    }
  },
  created() {
    sendUmeng(36);
  }
};
</script>

<style lang="scss" module>
.container {
  background-color: #f8f8f8;
}
</style>
