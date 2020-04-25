<template>
    <mobile-container
        :header-config="headerConfig"
        :has-footer="false"
        :class="$style.container"
    >
        <div slot="content" class="content-wrap">
            <depsoit />
        </div>
    </mobile-container>
</template>

<script>
import depsoit from '@/router/mobile/components/common/mcenter/theme1/deposit';
import mobileContainer from '../../../common/new/mobileContainer';

export default {
    components: {
        depsoit,
        mobileContainer
    },
    computed: {
        headerConfig() {
            return {
                prev: true,
                title: '充值',
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
