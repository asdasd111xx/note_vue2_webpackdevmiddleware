<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="false"
  >
    <div slot="content" :class="$style['content-wrap']">
      <newCommission />
    </div>
  </mobile-container>
</template>

<script>
import newCommission from "@/router/mobile/components/common/mcenter/theme1/tcenter/components/newCommission";
import mobileContainer from "../../../../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    newCommission
  },
  data() {
    return {
      divHeight: 0
    };
  },
  computed: {
    headerConfig() {
      return {
        title:
          this.$route.query.makeFriend === "true" ? "推广信息" : "一级好友",
        prev: true,
        onClick: () => {
          this.$router.back();
        }
      };
    }
  },

  mounted() {
    this.divHeight = document.body.offsetHeight;
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.content-wrap {
  background-color: #f8f8f8;
}
</style>
