<template>
    <div :class="$style['card-wrap']">
        <card
            search-theme="basicMobile"
            game-theme="basic"
            label-theme="basicMobile"
        />
    </div>
</template>

<script>
import card from '@/router/mobile/components/common/card';

export default {
    components: {
        card
    }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.card-wrap {
    min-height: calc(100vh - 99px);
    background:#302E38;

    :global(.game-item-wrap) {
        padding: 13px 0;
        margin: 0 auto;
        width: 306px;
        box-sizing: border-box;
    }
}

@media screen and (min-width: $phone + $sidebar) {
    .card-wrap {
        :global(.game-item-wrap) {
            width: 408px;
        }
    }
}

@media screen and (min-width: $pad + $sidebar) {
    .card-wrap {
        :global(.game-item-wrap) {
            width: 744px;
        }
    }
}

@media screen and (min-width: $pc + $sidebar) {
    .card-wrap {
        :global(.game-item-wrap) {
            width: 936px;
        }
    }
}
</style>
