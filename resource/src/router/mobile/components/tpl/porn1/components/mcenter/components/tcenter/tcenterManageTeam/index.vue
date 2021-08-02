<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" class="content-wrap">
      <div class="manage-rebate-wrap">
        <tcenter-manage-team
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
import tcenterManageTeam from "@/router/mobile/components/common/mcenter/theme1/tcenterManageTeam";

export default {
  components: {
    tcenterManageTeam,
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
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/css/variable.scss";
.manage-rebate-wrap {
  margin-top: 87px;
}
</style>
