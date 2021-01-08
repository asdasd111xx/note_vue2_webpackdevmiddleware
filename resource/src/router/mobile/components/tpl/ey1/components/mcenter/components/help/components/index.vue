<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :is-app="isApp"
    :class="$style.container"
  >
    <div slot="content">
      <template v-if="currentTemplate">
        <component :is="currentTemplate" />
      </template>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from "../../../../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    contact: () =>
      import(/* webpackChunkName: 'contact' */ "./template/contact"),
    deposit: () =>
      import(/* webpackChunkName: 'deposit' */ "./template/deposit"),
    faq: () => import(/* webpackChunkName: 'faq' */ "./template/faq"),
    gameintro: () =>
      import(/* webpackChunkName: 'gameintro' */ "./template/gameintro"),
    rules: () => import(/* webpackChunkName: 'rules' */ "./template/rules"),
    support: () =>
      import(/* webpackChunkName: 'support' */ "./template/support"),
    withdraw: () =>
      import(/* webpackChunkName: 'withdraw' */ "./template/withdraw"),
    bird: () => import(/* webpackChunkName: 'bird' */ "./template/bird")
  },
  data() {
    return {
      currentTemplate: "",
      title: "",
      templates: [
        { key: "contact", title: "联系我们" },
        { key: "deposit", title: "充值教程" },
        { key: "faq", title: "常见问题" },
        { key: "gameintro", title: "游戏介绍" },
        { key: "support", title: "技术支持" },
        { key: "withdraw", title: "提现教程" },
        { key: "deposit", title: "常见问题" },
        { key: "rules", title: "会员协议规章" },
        { key: "bird", title: "蜂鸟钱包" }
      ]
    };
  },
  created() {
    let template = this.templates.find(i => i.key === this.$route.params.key);
    if (!template) {
      this.$router.back();
      return;
    } else {
      this.title = template.title;
      this.currentTemplate = template.key;
    }
  },
  computed: {
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );

      return isApp;
    },
    headerConfig() {
      document.title = this.title;

      if (!this.isApp)
        return {
          prev: true,
          onClick: () => {
            this.$router.back();

            // 109/11/10 FB:454458
            // this.$router.push("/mobile/mcenter");
          },
          title: this.title
        };
    }
  }
};
</script>
<style lang="scss" module>
.container {
  background-color: #f8f8f8;
}
</style>
