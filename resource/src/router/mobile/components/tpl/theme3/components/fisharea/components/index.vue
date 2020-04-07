<template>
    <mobile-container :class="$style['container-bg']" :header-setting="headerSetting">
        <div slot="content" :class="$style['body-wrap']">
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
import mobileContainer from '../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        fishareaWrap
    },
    computed: {
        headerSetting() {
            return {
                left: { show: true },
                center: {
                    show: true,
                    typeGameList: true,
                    text: this.$text('S_GAME_GROUP_BY_888FISH')
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
