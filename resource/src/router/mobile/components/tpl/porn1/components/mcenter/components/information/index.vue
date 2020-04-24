<template>
    <mobile-container
        :header-config="headerConfig"
        :has-footer="false"
        :class="$style.container"
    >
        <div slot="content" class="content-wrap">
            <information />
        </div>
    </mobile-container>
</template>

<script>
import information from '@/router/mobile/components/common/mcenter/theme1/information';
import mobileContainer from '../../../common/new/mobileContainer';

export default {
    components: {
        mobileContainer,
        information
    },
    computed: {
        headerConfig() {
            const trans = { message: '通知', news: '活动', post: '公告' };

            return {
                prev: true,
                title: this.$route.params.pid ? trans[this.$route.params.page] : '消息中心',
                onClick: () => {
                    if (this.$route.params.pid) {
                        this.$router.back();
                        return;
                    }
                    this.onClick();
                }
            };
        }
    },
    methods: {
        onClick() {
            this.$router.push('/mobile/mcenter');
        }
    }
};
</script>

<style lang="scss" module>
.container {
    position: relative;
    background-color: #F8F8F7;
}
</style>
