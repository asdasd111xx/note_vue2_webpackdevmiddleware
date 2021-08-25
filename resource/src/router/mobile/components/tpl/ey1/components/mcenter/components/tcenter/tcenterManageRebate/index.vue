<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" class="content-wrap">
      <div :class="$style['manage-rebate']">
        <tcenter-manage-rebate
          :set-header-title="setHeaderTitle"
          :set-back-func="setBackFunc"
        />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../../../../common/mobileContainer";
import tcenterManageRebate from "@/router/mobile/components/common/mcenter/theme1/tcenterManageRebate";

export default {
  components: {
    tcenterManageRebate,
    mobileContainer
  },
  data() {
    return {
      headerConfig: {
        // Title 由各接口設定
        prev: true,
        onClick: () => {
          this.$router.back();
        }
      }
    };
  },
  methods: {
    setHeaderTitle(value) {
      this.$set(this.headerConfig, "title", value);
    },
    setBackFunc(cb) {
      this.$set(this.headerConfig, "onClick", cb);
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.manage-rebate {
  margin-top: 87px;
}
</style>
