<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap">
      <red-jackpot />
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from "../../../common/mobileContainer";
import redJackpot from "./components/index";

export default {
  components: {
    mobileContainer,
    redJackpot
  },

  data() {
    return {};
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        title: "红包彩金",
        onClick: () => {
          this.$router.back();
        }
      };
    }
  }
};
</script>
<style lang="scss" module>
.container {
  position: relative;
  background-color: #f8f8f7;
}
</style>
