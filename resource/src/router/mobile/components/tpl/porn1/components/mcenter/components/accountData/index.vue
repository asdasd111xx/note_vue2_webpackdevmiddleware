<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap">
      <account />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../common/mobileContainer";
import account from "./components/index";

export default {
  components: {
    mobileContainer,
    account
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.push("/mobile/mcenter/home");
        },
        title: this.$text("S_PERSON_INFO", "个人资料")
      };
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.content-wrap {
  height: calc(100vh - 110px);
  background-color: #f8f8f8;
}
</style>
