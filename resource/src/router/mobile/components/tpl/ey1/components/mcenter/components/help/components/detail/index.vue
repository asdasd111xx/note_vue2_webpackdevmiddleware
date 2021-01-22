<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :is-app="isApp"
    :class="$style.container"
  >
    <div slot="content">
      <template v-if="type == 'withdraw'">
        <withdraw-record />
      </template>

      <template v-if="type == 'deposit'">
        <deposit-record />
      </template>
    </div>
  </mobile-container>
</template>

<script>
import { API_WITHDRAW_RECORD } from "@/config/api";
import { mapGetters } from "vuex";
import ajax from "@/lib/ajax";
import depositRecord from "@/router/mobile/components/tpl/porn1/components/mcenter/components/help/components/detail/depositRecord";
import member from "@/api/member";
import mobileContainer from "../../../../../common/mobileContainer";
import withdrawRecord from "@/router/mobile/components/tpl/porn1/components/mcenter/components/help/components/detail/withdrawRecord";

export default {
  components: {
    mobileContainer,
    depositRecord,
    withdrawRecord
  },
  data() {
    return {
      type: "withdraw" | "deposit"
    };
  },
  created() {
    let query = this.$route.query;
    if (["withdraw", "deposit"].includes(query.type)) {
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

<style lang="scss" module>
@import "../../css/index.module.scss";
.detail-wrap {
  background-color: unset;
}

.no-data-wrap {
  .btn-deposit {
    background: #e42a30;
  }
}
</style>
