<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :is-app="isApp"
    :class="$style.container"
  >
    <div slot="content">
      <template v-if="type == 'withdraw'">
        <withdraw-record :is-app="isApp" />
      </template>

      <template v-if="type == 'deposit'">
        <deposit-record :is-app="isApp" />
      </template>
      <template v-if="type == 'buymethod'">
        <buymethod :is-app="isApp" />
      </template>
      <template v-if="type == 'usage'">
        <usage :is-app="isApp" />
      </template>
    </div>
  </mobile-container>
</template>

<script>
import { API_WITHDRAW_RECORD } from "@/config/api";
import { mapGetters } from "vuex";
import ajax from "@/lib/ajax";
import buymethod from "./buymethod";
import depositRecord from "@/router/mobile/components/tpl/porn1/components/mcenter/components/help/components/detail/depositRecord";
import member from "@/api/member";
import mobileContainer from "../../../../../common/mobileContainer";
import usage from "./usage";
import withdrawRecord from "@/router/mobile/components/tpl/porn1/components/mcenter/components/help/components/detail/withdrawRecord";

export default {
  components: {
    mobileContainer,
    depositRecord,
    withdrawRecord,
    buymethod,
    usage
  },
  data() {
    return {
      type: "withdraw" | "deposit" | "buymethod" | "usage"
    };
  },
  created() {
    let query = this.$route.query;
    if (
      [
        "withdraw",
        "deposit",
        "gameintro",
        "support",
        "buymethod",
        "usage"
      ].includes(query.type)
    ) {
      this.type = query.type;
    } else {
      this.$router.push("/mobile/mcenter/helpCenter");
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus"
    }),
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );
      return isApp;
    },
    beforeDestroy() {
      document.title = "";
    },
    headerConfig() {
      let title = "";

      switch (this.type) {
        case "withdraw":
          title = this.$text("S_RECENTLY_WITHDRAW", "近10笔提现记录");
          break;

        case "deposit":
          title = this.$text("S_RECENTLY_DEPOSIT", "8日内充值记录");
          break;

        case "buymethod":
          title = "SWAG 钻石购买说明";
          break;

        case "usage":
          title = "SWAG 钻石使用方法";
          break;

        default:
          break;
      }
      document.title = title;

      if (!this.isApp) {
        return {
          prev: true,
          onClick: () => {
            if (localStorage.getItem("help-center-back")) {
              this.$router.replace(
                `/mobile/${localStorage.getItem("help-center-back")}`
              );
              localStorage.removeItem("help-center-back");
            } else {
              this.$router.back();
            }
          },
          title: title
        };
      }
    }
  }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module />
