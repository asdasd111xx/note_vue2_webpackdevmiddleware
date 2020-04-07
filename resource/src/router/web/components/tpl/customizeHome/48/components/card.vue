<template>
    <div :class="[$style.container, 'clearfix']">
        <div
            v-for="data in dataList"
            :key="data.link"
            :class="$style['item-wrap']"
            @click.stop="changePage({type: 'games', page: data.link})"
        >
            <div :class="$style['title-img']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/card/${data.link}-icon.png`)" />
            </div>
            <div :class="$style.text">{{ data.text }}</div>
            <div :class="$style['img-wrap']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/card/${data.link}.png`)" />
            </div>
        </div>
        <div :class="$style.rebate">
            <div :class="$style['rebate-vendor']">{{ $text('S_CARD', '棋牌游戏') }}</div>
            <div :class="$style['rebate-title']">
                CARD<br />GAMES
            </div>
            <div :class="$style['rebate-text']">{{ $text('S_YABO_TEXT03', '返水最高可达') }}</div>
            <div :class="$style['percent-img']">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/48/card/icon-100.png')" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        changePage: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            dataList: [
                { link: 'ky', text: this.$text('S_KY', '开元棋牌') },
                { link: 'yg', text: this.$text('S_YG', '易游棋牌') },
                { link: 'lg_card', text: this.$text('S_LG_CARD', 'XBB棋牌') },
                { link: 'jdb_card', text: this.$text('S_JDB_CARD', 'JDB棋牌') }
            ]
        };
    }
};
</script>

<style lang="scss" module>
.container {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
}

.item-wrap {
    float: left;
    width: 170px;
    height: 100%;
    padding-top: 19px;
    text-align: center;
    cursor: pointer;

    &:hover {
        background-color: #FFF;
        opacity: .9;

        .img-wrap {
            transition: all .5s;
            transform: scale(1.03);
        }
    }
}

.title-img {
    height: 58px;
    line-height: 86px;
    margin: 0 auto;
}

.text {
    margin-top: 10px;
    font-size: 16px;
    color: #000;
}

.rebate {
    float: right;
    padding: 47px 0 0 22px;
}

.rebate-vendor {
    font-size: 30px;
    color: #C39E51;
}

.rebate-title {
    font-size: 20px;
    color: #343434;
}

.rebate-text {
    font-size: 18px;
    color: #666;
}

.percent-img {
    margin-top: 18px;
}
</style>
