<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['content-wrap']">
      <feedback />
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from '../../../common/mobileContainer';

export default {
  components: {
    mobileContainer,
    feedback: () => import(/* webpackChunkName: 'sendFeedback' */ '@/router/mobile/components/tpl/porn1/components/mcenter/components/feedback/components/index'),
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        title: this.$route.params.page === 'sendFeedback'
          ? this.$text('S_FEEDBACK', '意见反馈') : this.$text(...this.$route.params.id ? ['S_FEEDBACK_DETAIL', '反馈详情'] : ['S_MY_FEEDBACK', '我的反馈']),
        customLinkTitle: this.$route.params.page === 'sendFeedback' ? this.$text("S_MY_FEEDBACK", "我的反馈") : false,
        customLinkAction: () => {
          this.$router.push('/mobile/mcenter/feedback/feedbackList')
        },
        onClick: () => { this.$router.back(); }
      };
    }
  }
};
</script>

<style lang="scss" module>
.content-wrap {
  background: #f8f8f7;
  min-height: calc(100vh - 44px);
  position: relative;
  padding-bottom: 20px;
}
</style>
