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
import depositRecord from "./depositRecord";
import member from "@/api/member";
import mobileContainer from "../../../../../common/mobileContainer";
import withdrawRecord from "./withdrawRecord";
import buymethod from "./buymethod";
import usage from "./usage";

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
      ["withdraw", "deposit", "gameintro", "support", "buymethod", "usage"].includes(query.type)
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
    title() {
      switch (this.type.toLocaleLowerCase()) {
        case "withdraw":
          return this.$text("S_RECENTLY_WITHDRAW", "近10笔提现记录");
          break;

        case "deposit":
          return this.$text("S_RECENTLY_DEPOSIT", "8日内充值记录");
          break;

        case "buymethod":
          return "SWAG 钻石购买说明";
          break;

        case "usage":
          return "SWAG 钻石使用方法";
          break;

        default:
          break;
      }
    },
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );
      return isApp;
    },
    headerConfig() {
      if (!this.isApp) {
        return {
          prev: true,
          onClick: () => {
            this.$router.back();
          },
          title: this.title
        };
      }
    }
  }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module />
