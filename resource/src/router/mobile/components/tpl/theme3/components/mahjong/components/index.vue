<template>
    <mobile-container :class="$style['container-bg']" :header-setting="headerSetting">
        <div slot="content" :class="$style['body-wrap']">
            <mahjong-wrap
                :slot-sort="['search', 'list']"
                search-theme="theme3"
                game-theme="theme3"
                game-empty="theme3"
            />
        </div>
    </mobile-container>
</template>

<script>
import mahjongWrap from '@/router/mobile/components/common/mahjong';
import mobileContainer from '../../common/mobileContainer';

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
