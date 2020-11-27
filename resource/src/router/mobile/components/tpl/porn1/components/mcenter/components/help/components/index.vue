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
    contact: () => import(/* webpackChunkName: 'contact' */ './template/contact'),
    deposit: () => import(/* webpackChunkName: 'deposit' */ './template/deposit'),
    gameintro: () => import(/* webpackChunkName: 'gameintro' */ './template/gameintro'),
    support: () => import(/* webpackChunkName: 'support' */ './template/support'),
    withdraw: () => import(/* webpackChunkName: 'withdraw' */ './template/withdraw'),
    tips: () => import(/* webpackChunkName: 'tips' */ './template/tips'),
    privacy: () => import(/* webpackChunkName: 'privacy' */ './template/privacy'),
    diamond: () => import(/* webpackChunkName: 'diamond' */ './template/diamond'),
  },
  data() {
    return {
      currentTemplate: '',
      title: '',
      templates: [
        { key: 'contact', title: '联系我们' },
        { key: 'diamond', title: '购买钻石' },
        { key: 'deposit', title: '充值教程' },
        { key: 'gameintro', title: '游戏介绍' },
        { key: 'support', title: '技术支持' },
        { key: 'withdraw', title: '提现教程' },
        { key: 'tips', title: '用户须知' },
        { key: 'privacy', title: '隐私政策' },
      ]
    };
  },
  created() {
    let template = this.templates.find(i => i.key === this.$route.params.key);
    if (!template) {
      window.location.replace('/mobile/mcenter/helpCenter');
      this.$router.push('/mobile/mcenter/helpCenter');
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
            if (localStorage.getItem('help-center-back')) {
              this.$router.replace(`/mobile/${localStorage.getItem('help-center-back')}`);
              localStorage.removeItem('help-center-back');
            } else {
              this.$router.back();
            }
          },
          title: this.title
        };
    }
  },
};
</script>
<style lang="scss" module>
.container {
  background-color: #f8f8f8;
}
</style>
