<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="false"
  >
    <div slot="content" class="content-wrap">
      <div :class="$style['join-member-wrap']">
        <template
          v-if="this.activity.isActivity && this.activity.totalAmount > 0"
          ><img
            :class="$style['slide-banner']"
            src="/static/image/sg1/mcenter/tcenter/slidebanner.png"
            alt=""
        /></template>

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
      loginStatus: "getLoginStatus",
      activity: "getActivity"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          if (this.$route.query.login === "1") {
            this.$router.replace(`/mobile/login`);
          } else {
            this.$router.push(`/mobile/live/iframe/home?hasFooter=true`);
          }
        },
        hasClose: true,
        title:
          this.activity.isActivity && this.activity.totalAmount > 0
            ? "领取彩金"
            : "访客注册"
      };
    }
  },
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

.join-member-wrap {
  min-height: calc(100vh - 43px);
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/image/sg1/common/bg.png");
}

// .join-input {
//   background-color: unset !important;
//   border: unset;
// border-radius: 0 75px 75px 0;
//   &::placeholder {
//     color: #a5a5a5;
//   }
// }

.join-btn {
  margin: 0 auto;
  background: var(--main_button_color1);
  border-radius: 25px;
  height: 50px;
  line-height: 50px;
  width: 100%;
  max-width: 300px;
  font-size: 13px;
  font-family: Segoe UI, Segoe UI-Bold;
  font-weight: 700;
  text-align: center;
  color: var(--main_button_text_color1);

  &.disable {
    background: var(--main_button_color2);
    color: var(--main_button_text_color2);
  }
}

.js-nc-check-bar {
  max-width: 300px;
  padding: 0;
  width: 100%;
}

.slide-banner {
  width: 85%;
  border-radius: 5px;
  display: block;
  margin: 15px auto 0 auto;
}

.has-visitor {
  span {
    padding: 0 10px;
  }

  span:nth-child(3) {
    color: #6aaaf5;
  }
}

// .field-wrap {
//   margin-left: 12px;
//   margin-right: 12px;
//   background-color: #fff;
//   border: 1px solid #d8d8d8;
//   border-radius: 75px;
//   margin-bottom: 28px;
// }
// .field-text {
//   text-align: left;
//   padding-left: 10px;
// }

// .field-right {
//   width: calc(100% - 95px);
//   background: #fff;
// }

// .join-tip-show {
//   display: inline-block;
//   position: absolute;
//   bottom: -24px;
//   padding: 0;
//   right: 0;
// }

.join-input:-webkit-autofill {
  &,
  &:hover,
  &:focus,
  &:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
  }
}

.thirdy-block {
  margin: 0 12px;
  max-width: 100%;

  .click-unit {
    border-radius: 20px;
  }
}

.get-verify-btn {
  border-radius: 15px;
}
</style>
