<template>
    <mobile-container :header-config="headerConfig" :update-search-status="updateSearchStatus">
        <div slot="content" class="content-wrap">
            <casino-wrap :is-show-search.sync="isShowSearch" />
        </div>
    </mobile-container>
</template>

<script>
import casinoWrap from '@/router/mobile/components/common/casino';
import mobileContainer from '../common/new/mobileContainer';

export default {
    components: {
        mobileContainer,
        casinoWrap
    },
    data() {
        return {
            searchStatus: false
        };
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
                case 'mg2':
                    textCode = 'S_MG2_CASINO';
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
        headerConfig() {
            return {
                prev: true,
                title: this.headerTitle,
                hasSearchBtn: true,
                onClick: () => { this.$router.back(); }
            };
        },
        isShowSearch: {
            get() {
                return this.searchStatus;
            },
            set() {
                this.searchStatus = !this.searchStatus;
            }
        }
    },
    methods: {
        updateSearchStatus() {
            this.searchStatus = !this.searchStatus;
        }
    }
};

</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

:global {
    .game-item-wrap{
        max-width: 960px;
        min-width: 320px;
        margin: 0 auto;
        padding: 18px 10px;
    }
}

@media screen and (min-width: $phone) {
    :global {
        .game-item-wrap {
            padding: 13px 20px;
        }
    }
}

@media screen and (min-width: $pad) {
    :global {
        .game-item-wrap {
            padding: 13px 40px;
        }
    }
}
</style>
