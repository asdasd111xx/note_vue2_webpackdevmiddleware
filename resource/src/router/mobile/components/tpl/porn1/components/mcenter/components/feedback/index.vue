<template>
    <mobile-container :header-config="headerConfig" :has-footer="false">
        <div slot="content" :class="$style['content-wrap']">
            <component :is="$route.params.page" />
        </div>
    </mobile-container>
</template>

<script>
import mobileContainer from '../../../common/new/mobileContainer';

export default {
    components: {
        mobileContainer,
        sendFeedback: () => import(/* webpackChunkName: 'sendFeedback' */ './components/sendFeedback'),
        feedbackList: () => import(/* webpackChunkName: 'feedbackList' */ './components/feedbackList')
    },
    computed: {
        headerConfig() {
            return {
                prev: true,
                title: this.$route.params.page === 'sendFeedback'
                    ? this.$text('S_FEEDBACK', '意见反馈') : this.$text(...this.$route.params.id ? ['S_FEEDBACK_DETAIL', '反馈详情'] : ['S_MY_FEEDBACK', '我的反馈']),
                hasFeedBackBtn: this.$route.params.page === 'sendFeedback',
                onClick: () => { this.$router.back(); }
            };
        }
    }
};
</script>

<style lang="scss" module>
.content-wrap {
  background: #F8F8F7;
    // min-height: calc(100vh - 0.86rem);
    min-height: calc(100vh - 44px);
    position: relative;
}
</style>
