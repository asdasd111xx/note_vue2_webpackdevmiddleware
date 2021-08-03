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
        title: "推广信息",
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
  background-color: $main_background_white1;
}
</style>
