<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="false"
  >
    <div slot="content" :class="$style['content-wrap']">
      <tcenter
        func="management"
        :set-header-title="setHeaderTitle"
        :set-back-func="setBackFunc"
      />
    </div>
  </mobile-container>
</template>

<script>
import tcenter from "@/router/mobile/components/common/mcenter/theme1/tcenter";
import mobileContainer from "../../../../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    tcenter
  },
  data() {
    return {
      divHeight: 0,
      headerConfig: {
        title: this.$text("S_TEAM_CENTER", "我的推广"),
        prev: true,
        onClick: () => {
          if (this.$route.params.date) {
            this.$router.replace("/mobile/mcenter/tcenter/management/member");
          } else {
            this.$router.back();
          }
        }
      }
    };
  },
  computed: {
    // headerConfig() {
    //   return {
    //     title: this.$text("S_TEAM_CENTER", "我的推广"),
    //     prev: true,
    //     onClick: () => {
    //       if (this.$route.params.date) {
    //         this.$router.replace("/mobile/mcenter/tcenter/management/member");
    //       } else {
    //         this.$router.back();
    //       }
    //     }
    //   };
    // }
  },
  methods: {
    setHeaderTitle(value) {
      this.$set(this.headerConfig, "title", value);
    },
    setBackFunc(cb) {
      this.$set(this.headerConfig, "onClick", cb);
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
