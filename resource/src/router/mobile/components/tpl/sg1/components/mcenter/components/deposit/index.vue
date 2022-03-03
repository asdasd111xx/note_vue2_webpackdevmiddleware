<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="hasFooter"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap">
      <depsoit ref="depsoit" />
    </div>
  </mobile-container>
</template>

<script>
import depsoit from "@/router/mobile/components/common/mcenter/theme1/deposit";
import mobileContainer from "../../../common/mobileContainer";

export default {
  data() {
    return {};
  },
  components: {
    mobileContainer,
    depsoit
  },
  computed: {
    hasFooter() {
      return this.$route.query.hasFooter
        ? this.$route.query.hasFooter === "true"
        : false;
    },
    headerConfig() {
      return {
        prev: !this.hasFooter,
        title: "充值",
        hasHelp: {
          type: "deposit",
          url: "/mobile/mcenter/help/deposit"
        },
        onClick: () => {
          let step =
            this.$refs.depsoit.resultHeaderSetting &&
            this.$refs.depsoit.resultHeaderSetting.submitStatus;
          if (step === "stepTwo") {
            window.location.reload();
            this.$router.push("/mobile/mcenter/deposit");
          } else {
            // 由直播間進入，需返回直播間
            if (["diamond", "live"].includes(this.$route.query.redirect)) {
              this.$router.back();
            } else {
              this.$router.push("/mobile/mcenter");
            }
          }
        }
      };
    }
  }
};
</script>

<style lang="scss" module>
.container {
  // position: relative;
  background-color: #f8f8f7;

  .content-wrap {
    border-top: 1px solid #eee;
  }
}
</style>
