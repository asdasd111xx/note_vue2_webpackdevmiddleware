<template>
    <mobile-container
        :header-config="headerConfig"
        :has-footer="false"
        :class="$style.container"
    >
        <div slot="content" class="content-wrap">
            <bank-rebate />
        </div>
    </mobile-container>
</template>

<script>
import bankRebate from '@/router/mobile/components/common/mcenter/theme1/bankRebate';
import mobileContainer from '../../../common/new/mobileContainer';

export default {
    components: {
        mobileContainer,
        bankRebate
    },
    computed: {
        headerConfig() {
            return {
                prev: true,
                title: '我的返水',
                onClick: () => {
                    this.$router.back();
                }
            };
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
