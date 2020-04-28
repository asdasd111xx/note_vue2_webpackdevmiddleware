<template>
    <mobile-container
        :header-config="headerConfig"
        :has-footer="false"
        :class="$style.container"
    >
        <div slot="content" class="content-wrap">
            <money-detail />
        </div>
    </mobile-container>
</template>

<script>
import moneyDetail from '@/router/mobile/components/common/mcenter/theme1/moneyDetail';
import mobileContainer from '../../../common/new/mobileContainer';

export default {
    components: {
        mobileContainer,
        moneyDetail
    },
    computed: {
        headerConfig() {
            return {
                prev: true,
                title: this.$route.params.page === 'detail' ? '交易详情' : '交易明细',
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
