<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" class="content-wrap">
      <tcenter-manage-rebate
        :set-header-title="setHeaderTitle"
        :set-back-func="setBackFunc"
      />
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
          //判斷是否從推廣賺錢來
          if (this.$route.query.giftDetail) {
            this.$router.replace("/mobile/mcenter/tcenterLobby");
          } else {
            this.$router.back();
          }
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
