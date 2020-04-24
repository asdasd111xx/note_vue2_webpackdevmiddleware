<template>
    <mobile-container :header-config="headerConfig" :class="$style.container">
        <div slot="content" class="content-wrap">
            <home-slider />
            <home-new />
            <home-content />
        </div>
    </mobile-container>
</template>

<script>
import homeSlider from './components/homeSlider';
import homeNew from './components/homeNew';
import homeContent from './components/homeContent';
import mobileContainer from '../common/new/mobileContainer';

export default {
    components: {
        mobileContainer,
        homeSlider,
        homeNew,
        homeContent
    },
    computed: {
        headerConfig() {
            return {
                hasLogo: true,
                hasMemInfo: true,
                hasSearchBtn: false,
                onClick: () => {
                    this.onClick();
                }
            };
        }
    },
    methods: {
        onClick() {
            this.$router.push('/mobile');
        }
    }
};
</script>

<style lang="scss" module>
div.container {
    background-color: #FFF;
}
</style>
