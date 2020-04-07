<template>
    <div :class="[$style.container, 'clearfix']">
        <div
            v-for="data in dataList"
            :key="data.link"
            :class="$style['item-wrap']"
            @click.stop="changePage({type: 'games', page: data.link})"
        >
            <div :class="$style['title-img']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/50/live/${data.link}-icon.png`)" />
            </div>
            <div :class="$style.text">{{ data.text }}</div>
            <div :class="$style['img-wrap']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/50/live/${data.link}.png`)" />
            </div>
        </div>
        <div :class="$style['more-btn-wrap']" @click.stop="changePage({page: '10325'})">
            <div :class="$style['more-text']">更多游戏</div>
            <div :class="$style['more-img']">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/50/live/more.png')" />
            </div>
        </div>
        <div :class="$style.rebate">
            <div :class="$style['rebate-vendor']">{{ $text('S_LIVE', '真人娱乐') }}</div>
            <div :class="$style['rebate-title']">
                LIVE<br />CASINO
            </div>
            <div :class="$style['rebate-text']">{{ $text('S_YABO_TEXT03', '返水最高可达') }}</div>
            <div :class="$style['percent-img']">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/50/live/icon-100.png')" />
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
                { text: this.$text('S_BBIN_LIVE2', 'BBIN真人'), link: 'bblive' },
                { text: this.$text('S_AG_LIVE', 'AG真人'), link: 'ag' },
                { text: this.$text('S_GD_LIVE', 'GD真人'), link: 'gd' },
                { text: this.$text('S_AB_LIVE2', 'AB真人'), link: 'ab' },
                { text: this.$text('S_BG_LIVE2', 'BG真人'), link: 'bg' }
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
    width: 160px;
    height: 100%;
    padding-top: 35px;
    text-align: center;
    cursor: pointer;

    &:hover {
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
    margin-bottom: 15px;
    font-size: 16px;
    color: #000;
}

.rebate {
    float: left;
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

.more-btn-wrap {
    float: left;
    padding-top: 94px;
    cursor: pointer;

    &:hover {
        .more-img>img {
            transition: all .5s;
            transform: scale(1.03);
        }
    }
}

.more-text {
    margin-bottom: 15px;
    line-height: 21px;
    font-size: 16px;
    color: #000;
    text-align: center;
}
</style>
