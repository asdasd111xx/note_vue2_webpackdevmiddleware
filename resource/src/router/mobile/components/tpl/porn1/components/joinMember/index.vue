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
  beforeDestroy() {
    // let script = document.querySelector('script[data-name="esabgnixob"]');
    // if (script) {
    //   script.parentElement.removeChild(script);
    // }
  },
  created() {
    if (this.loginStatus) {
      this.$router.push("/mobile");
      return;
    }

    if (!document.querySelector('script[data-name="esabgnixob"]')) {
      this.script = document.createElement("script");
      this.script.setAttribute("type", "text/javascript");
      this.script.setAttribute("data-name", "esabgnixob");

      if (window.location.host.includes("localhost")) {
        this.script.setAttribute(
          "src",
          "https://yb01.66boxing.com/mobile/esabgnixob.js"
        );
      } else {
        this.script.setAttribute("src", "esabgnixob.js");
      }

      document.head.appendChild(this.script);
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

  form {
    width: 90vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.field-wrap {
  &.aobo1 {
    width: 80vw;
    background: transparent;
    position: relative;
    z-index: 0;
    &::after {
      position: absolute;
      top: 0px;
      width: 80vw;
      height: 40px;
      background: #fff;
      border: 1px solid #e3e3e3;
      z-index: -1;
    }

    .field-right {
      width: 62%;
    }
    .field-title {
      width: 83px;
    }
    .join-tip-show {
      width: 320px;
      text-align: end;
      font-size: 12px;
    }
    .join-help-show {
      width: 300px;
      text-align: start;
      position: relative;
      left: -95px;
      font-size: 12px;
    }
    .field-text {
      text-align: start;
      color: #5e626d;
      font-size: 14px;
    }
    .field-username {
      span {
        &::before {
          content: "*";
          color: red;
        }
      }
    }
    .field-password {
      span {
        &::before {
          content: "*";
          color: red;
        }
      }
    }
    .field-confirm_password {
      span {
        &::before {
          content: "*";
          color: red;
        }
      }
    }
  }
}
.join-input {
  background-color: #fff;
  border: 1px solid #d8d8d8;

  &::placeholder {
    color: #a5a5a5;
  }
  &.aobo1 {
    border: 1px solid transparent;
    background-color: transparent;
  }
}

.join-input-birthday {
  &.aobo1 {
    border: 1px solid transparent;
  }
}

.join-input-gender {
  &.aobo1 {
    border: 1px solid transparent;
  }
}

.select-gender {
  &.aobo1 {
    background-color: #fff;
    color: #5e626d;
    width: 170px;
    position: relative;
    top: 10px;
    right: 5px;
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
  background: $share_main_button_color;
  border-radius: 30px;
  height: 50px;
  line-height: 50px;
  width: 100%;
  max-width: 300px;
  font-size: 13px;
  font-family: Segoe UI, Segoe UI-Bold;
  font-weight: 700;
  text-align: center;
  color: $share_main_button_text_color;

  &.disable {
    background: linear-gradient(#e9dacb, #eee5db);
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

.thirdy-block {
  &.aobo1 {
    max-width: 90%;
    margin: 10px auto;
  }
}

.js-nc-check-bar {
  max-width: 300px;
  padding: 0;
  width: 100%;
}
</style>
