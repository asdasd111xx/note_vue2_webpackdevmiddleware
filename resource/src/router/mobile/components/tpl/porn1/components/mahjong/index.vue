<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content" class="content-wrap">
            <mahjong-wrap :slot-sort="['search', 'list']" />
        </div>
    </mobile-container>
</template>

<script>
import mahjongWrap from '@/router/mobile/components/common/mahjong';
import mobileContainer from '../common/new/mobileContainer';

export default {
    components: {
        mahjongWrap,
        mobileContainer
    },
    computed: {
        headerTitle() {
            const vendor = this.$route.params.vendor || 'all';
            let textCode = '';

            switch (vendor) {
                case 'all':
                    textCode = 'S_ALL';
                    break;
                default:
                    textCode = `S_${vendor}`.toUpperCase();
                    break;
            }

            return this.$text(textCode);
        },
        headerConfig() {
            return {
                prev: true,
                title: this.headerTitle,
                onClick: () => { this.$router.back(); }
            };
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
