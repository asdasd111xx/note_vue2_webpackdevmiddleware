<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content" class="content-wrap">
            <fisharea-wrap
                search-theme="theme3"
                game-theme="theme3"
                game-empty="theme3"
            />
        </div>
    </mobile-container>
</template>

<script>
import fishareaWrap from '@/router/mobile/components/common/fisharea';
import mobileContainer from '../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        fishareaWrap
    },
    computed: {
        headerConfig() {
            return {
                prev: true,
                title: this.$text('S_GAME_GROUP_BY_888FISH'),
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
