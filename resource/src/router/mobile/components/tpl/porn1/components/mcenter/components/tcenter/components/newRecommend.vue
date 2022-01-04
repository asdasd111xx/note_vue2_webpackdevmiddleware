<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="false"
  >
    <div slot="content" :class="$style['content-wrap']">
      <newRecommend />
    </div>
  </mobile-container>
</template>

<script>
import newRecommend from "@/router/mobile/components/common/mcenter/theme1/tcenter/components/newRecommend/components";
import mobileContainer from "../../../../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    newRecommend
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
          this.$route.query.makeFriend === "true" ? "推广信息" : "新增一级好友",
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
