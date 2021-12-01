<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['']">
      <member-card-info
        :card-info="paopaoMemberCardInfo"
        :card-info-top="paopaoMemberCardInfoTop"
      />
      <page-loading :is-show="isLoading" />
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "@/router/mobile/components/tpl/sg1/components/common/mobileContainer";
import openGame from "@/lib/open_game";
import goLangApiRequest from "@/api/goLangApiRequest";
import memberCardInfo from "./components/memberCardInfo";
export default {
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    mobileContainer,
    memberCardInfo
  },
  data() {
    return {
      isLoading: true,
      paopaoMemberCardInfo: {},
      paopaoMemberCardInfoTop: {}
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.push("/mobile/mcenter/home");
        },
        title: this.paopaoMemberCardInfoTop.alias
      };
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionGetExtRedirect"]),
    init() {
      //取得個人信息資料 暱稱,地區,感情
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/personal-info",
        method: "get"
      }).then(data => {
        this.isLoading = false;
        if (data && data.error_code === "0") {
          this.paopaoMemberCardInfo = data.result;
        } else {
          this.actionSetGlobalMessage({
            msg: data && data.error_text,
            code: data && data.error_code
          });
        }
      });

      //取得追蹤人數,道具數量
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/front-page",
        method: "get"
      }).then(data => {
        this.isLoading = false;
        if (data && data.result && data.error_code === "0") {
          this.paopaoMemberCardInfoTop = data.result;
        } else {
          this.actionSetGlobalMessage({
            msg: data && data.error_text,
            code: data && data.error_code
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";
</style>
