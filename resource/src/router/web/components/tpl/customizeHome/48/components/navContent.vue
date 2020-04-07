<template>
    <div :class="$style['header-bottom']" :style="{ left: `${distance}px` }">
        <sports v-show="currentType === 'sports'" key="sports" />
        <esports v-show="currentType === 'esports'" key="esports" />
        <live
            v-show="currentType === 'live'"
            key="live"
            :change-page="changePage"
        />
        <lottery
            v-show="currentType === 'lottery'"
            key="lottery"
            :change-page="changePage"
        />
        <casino
            v-show="currentType === 'casino'"
            key="casino"
            :change-page="changePage"
        />
        <card
            v-show="currentType === 'card'"
            key="card"
            :change-page="changePage"
        />
        <app v-show="currentType === 'app'" key="app" />
        <promotions
            v-show="currentType === 'promotions'"
            key="promotions"
            :change-page="changePage"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import sports from './sports';
import esports from './esports';
import live from './live';
import lottery from './lottery';
import casino from './casino';
import card from './card';
import app from './app';
import promotions from './promotions';

export default {
    components: {
        sports,
        esports,
        live,
        lottery,
        casino,
        card,
        app,
        promotions
    },
    props: {
        currentType: {
            type: String,
            default: ''
        },
        distance: {
            type: Number,
            default: 0
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage({ type = '', page = '', subPage = '' }) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({ type, page, subPage });
        }
    }
};
</script>

<style lang="scss" module>
.header-bottom {
    position: fixed;
    left: 0;
    width: 100%;
    min-width: 1340px;
    height: 300px;
    background: rgba(239,242,245,.95);
    background-size: 100% 100%;
    z-index: 1000;
    line-height: initial;
    cursor: initial;
}
</style>
