<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="false"
  >
    <div slot="content" class="content-wrap">
      <div :class="$style['join-member-wrap']">
        <join-member :theme="$style">
          <template slot="join-header" />
        </join-member>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import joinMember from "@/router/web/components/page/join_member";
import mobileContainer from "../common/mobileContainer";

export default {
  components: {
    joinMember,
    mobileContainer
  },
  data() {
    return {
      script: null
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          if (this.$route.query.login === "1") {
            this.$router.replace(`/mobile/login`);
          } else {
            this.$router.push(`/mobile/home`);
          }
        },
        hasClose: true,
        title: "领取彩金"
      };
    }
  },
  beforeDestroy() {},
  created() {
    if (this.loginStatus) {
      this.$router.push("/mobile");
      return;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
@import "~@/css/page/joinMem.module.scss";
@import "~@/css/variable.scss";

.join-member-wrap {
  min-height: calc(100vh - 43px);
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/image/porn1/common/bg.png");

  // form {
  //   width: 90vw;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  // }
}

.join-input {
  background-color: #fff;

  &::placeholder {
    color: #a5a5a5;
  }
}

.join-withdraw-password-help-show {
  width: 290px;
  font-size: 12px;
  text-align: start;
  position: relative;
  left: -90px;
}

.join-btn {
  margin: 0 auto;
  background: var(--main_gradient_color1);
  border-radius: 30px;
  height: 50px;
  line-height: 50px;
  width: 100%;
  max-width: 300px;
  font-size: 13px;
  font-family: Segoe UI, Segoe UI-Bold;
  font-weight: 700;
  text-align: center;
  color: var(--main_text_color1);

  &.disable {
    background: var(--main_gradient_color2);
    pointer-events: none;
  }

  &.porn1 {
    color: #ffffff;
    background: $befa_main_color;
  }

  &.sp1 {
    color: $main_text_color6;
    background: $sp1_main_color1;

    &.disable {
      opacity: 0.5;
    }
  }
}

.js-nc-check-bar {
  max-width: 300px;
  padding: 0;
  width: 100%;
}
</style>
