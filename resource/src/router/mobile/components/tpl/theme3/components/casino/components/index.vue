<template>
    <mobile-container :class="$style['container-bg']" :header-setting="headerSetting">
        <div slot="content" :class="$style['body-wrap']">
            <casino-wrap
                search-theme="theme3"
                label-theme="theme3"
                game-theme="theme3"
                game-empty="theme3"
            />
        </div>
    </mobile-container>
</template>

<script>
import casinoWrap from '@/router/mobile/components/common/casino';
import mobileContainer from '../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        casinoWrap
    },
    computed: {
        headerTitle() {
            const vendor = this.$route.params.vendor || 'all';
            let textCode = '';

            switch (vendor) {
                case 'all':
                case 'activity':
                    textCode = 'S_ALL';
                    break;
                case 'bbin':
                    textCode = 'S_BBCASINO';
                    break;
                case 'gns':
                    textCode = 'S_GENESIS';
                    break;
                case 'mw':
                    textCode = 'S_MEGA_CASINO';
                    break;
                case 'sg':
                case 'pt':
                case 'mg':
                case 'isb':
                case 'jdb':
                case 'cq9':
                case 'ag_casino':
                case 'lg_casino':
                case 'yg_casino':
                case 'ace_casino':
                case 'mt_casino':
                    textCode = `S_${vendor}`.toUpperCase();
                    break;
                default:
                    textCode = `S_${vendor}_CASINO`.toUpperCase();
                    break;
            }
            return this.$text(textCode);
        },
        headerSetting() {
            return {
                left: { show: true },
                center: {
                    show: true,
                    typeGameList: true,
                    text: this.headerTitle
                },
                right: { show: true }
            };
        }
    }
};

</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.body-wrap{
    color: #F8F1EB;
    margin: 47px 0 45px;

    :global(.game-item-wrap) {
        padding: 18px 10px 0px;
        margin: 0 auto;
        max-width: 768px;
        min-width: 320px;
        box-sizing: border-box;
    }
}

@media screen and (min-width: $phone + $sidebar) {
    .body-wrap {
        :global(.game-item-wrap) {
            padding: 13px 20px;
        }
    }
}

@media screen and (min-width: $pad + $sidebar) {
    .body-wrap {
        :global(.game-item-wrap) {
            padding: 13px 40px;
        }
    }
}

</style>
