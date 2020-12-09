<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['content-wrap']">
      <bet-recoard />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../../../common/mobileContainer";
import betRecoard from "@/router/mobile/components/tpl/porn1/components/mcenter/components/betRecord/components/index";
export default {
  components: {
    mobileContainer,
    betRecoard,
  },
  data() {
    return {};
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        title: this.$text("S_BETHISTORYBTN", "投注记录"),
        onClick: () => {
          this.$router.back();
        },
      };
    },
  },
  created() {},
};
</script>
<style lang="scss" module>
.content-wrap {
  background: #f8f8f7;
  min-height: calc(100vh - 43px);
  position: relative;
  padding-top: 50px;
}
</style>
