<template>
    <div :class="[$style['middel-container'], 'clearfix']">
        <div
            v-for="(card, index) in cardList"
            :key="index"
            :class="$style['card-wrap']"
        >
            <div :class="$style['cover-wrap']" :style="{ background: `url('/static/image/tpl/customizeHome/48/img_${card.cover.type}.png') 0 0 no-repeat` }">
                <div :class="$style['img-wrap']">
                    <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/icon_${card.cover.type}.png`)" />
                </div>
                <div :class="$style['cover-title']">{{ card.cover.title }}</div>
                <div :class="$style['cover-text']">{{ card.cover.text }}</div>
            </div>
            <div :class="[$style['link-wrap'], {[$style.center]: index === 1 || index === 2}]">
                <div
                    v-for="(links, cardIndex) in card.links"
                    :key="links.vendor"
                    :class="$style.item"
                    @click.stop="changePage(links.vendor)"
                >
                    <div :class="$style['item-line']" />
                    <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/logo_${links.vendor}.png`)" />
                    <div class="item-text">{{ links.text }}</div>
                    <div v-if="(cardIndex + 1) === card.links.length" :class="$style['item-line']" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            cardList: [
                {
                    cover: { type: 'live_casino', title: this.$text('S_LIVE', '真人娱乐'), text: 'LIVE CASINO' },
                    links: [
                        { vendor: 'ag', text: this.$text('S_AG', 'AG视讯') },
                        { vendor: 'gd', text: this.$text('S_GD', 'GD视讯') },
                        { vendor: 'ab', text: this.$text('S_AB_LIVE', 'AB视讯') },
                        { vendor: 'bg', text: this.$text('S_BG_LIVE', 'BG视讯') },
                        { vendor: 'bblive', text: this.$text('S_BBIN_LIVE', 'BBIN视讯') }
                    ]
                },
                {
                    cover: { type: 'electric', title: this.$text('S_ESPORTS', '电子竞技'), text: 'ELECTRIC CONTEST' },
                    links: [
                        { vendor: 'tgp', text: this.$text('S_TGP', 'IM电竞') }
                    ]
                },
                {
                    cover: { type: 'lottery', title: this.$text('S_LOTTERY_BETTING', '彩票投注'), text: 'LOTTERY GAME' },
                    links: [
                        { vendor: 'lottery', text: this.$text('S_BBLOTTERY', 'BB彩票') },
                        { vendor: 'lg_lottery', text: this.$text('S_LGLOTTERY', 'XBB彩票') },
                        { vendor: 'vr', text: this.$text('S_VRLOTTERY', 'VR彩票') }
                    ]
                },
                {
                    cover: { type: 'video', title: this.$text('S_FISH_VIDEO_GAME', '捕鱼电玩'), text: 'VIDEO GAME' },
                    links: [
                        { vendor: 'bbcasino', text: this.$text('S_BBCASINO', 'BB电子') },
                        { vendor: 'mg', text: this.$text('S_MG', 'MG电子') },
                        { vendor: 'pt', text: this.$text('S_PT', 'PT电子') },
                        { vendor: 'jdb', text: this.$text('S_JDB', 'JDB电子') },
                        { vendor: 'ag_casino', text: this.$text('S_AG_CASINO', 'AG电子') }
                    ]
                },
                {
                    cover: { type: 'chess', title: this.$text('S_CARD', '棋牌游戏'), text: 'CHESS AND CARD' },
                    links: [
                        { vendor: 'ky', text: this.$text('S_KY', '开元棋牌') },
                        { vendor: 'yg', text: this.$text('S_YG', '易游棋牌') },
                        { vendor: 'lg_card', text: this.$text('S_LG_CARD', 'XBB棋牌') },
                        { vendor: 'jdb_card', text: this.$text('S_JDB_CARD', 'JDB棋牌') }
                    ]
                }
            ]
        };
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(page) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({ type: 'games', page });
        }
    }
};
</script>

<style lang="scss" module>
.middel-container {
    width: 1200px;
    margin: 0 auto;
    padding-top: 32px;
}

.card-wrap {
    position: relative;
    float: left;
    width: 194px;
    height: 442px;
    margin-right: 57px;
    color: #FFF;
    text-align: center;
    cursor: pointer;

    &:last-child {
        margin: 0;
    }

    &:hover {
        .cover-wrap {
            transform: rotateY(-180deg) translateZ(0);
        }

        .link-wrap {
            z-index: 1;
            transform: rotateY(0deg) translateZ(0) scale(1.186);
        }
    }
}

.cover-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    padding-top: 286px;
    transition: .8s ease-in-out;
    color: #D8B26A;
}

.link-wrap {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    padding-top: 20px;
    background: url('/static/image/tpl/customizeHome/48/bg_black.png') 0 0 no-repeat;
    transition: .8s ease-in-out;
    transform: rotateY(180deg) translateZ(0);
}

.item {
    width: 131px;
    height: 68px;
    margin: 0 auto;

    img {
        height: 40px;
    }

    &:hover {
        background: url('/static/image/tpl/customizeHome/48/icon_hover.png') 0 0 no-repeat;
    }
}

.item-line {
    height: 1px;
    background: url('/static/image/tpl/customizeHome/48/icon_xian.png') 0 0 no-repeat;
}

.center {
    padding-top: 140px;
}
</style>
