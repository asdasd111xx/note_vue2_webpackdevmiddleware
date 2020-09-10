<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="false"
  >
    <div slot="content" :class="$style['content-wrap']">
      <tcenter func="gameRecord" />
    </div>
  </mobile-container>
</template>

<script>
import tcenter from "@/router/mobile/components/common/mcenter/theme1/tcenter";
import mobileContainer from '../../../../common/mobileContainer';

export default {
  components: {
    mobileContainer,
    tcenter
  },
  data() {
    return {
      divHeight: 0
    };
  },
  computed: {
    headerConfig() {
      return {
        title: this.$text("S_TEAM_CENTER", "我的推广"),
        prev: true,
        onClick: () => {
          //   if (
          //     this.func === "management" &&
          //     this.$route.params.page === "member" &&
          //     this.$route.params.date
          //   ) {
          //     this.$router.push("/mobile/mcenter/tcenter/management/member");
          //     return;
          //   }

          //   if (
          //     (this.func === "gameRecord" && this.$route.params.page === "bet") ||
          //     (this.func === "commission" && this.$route.params.page === "detail")
          //   ) {
          //     this.$router.back();
          //     return;
          //   }
        //if(localStorage.getItem('back')==='home')
        //  this.$router.push("/mobile/");
        //else
        //  this.$router.push("/mobile/mcenter");

        if (this.$route.params.page === "bet"){
            this.$router.push("/mobile/mcenter/tcenter/gameRecord/main");
          }else{
            this.$router.push("/mobile/mcenter");
          }

        }
      };
    },
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
