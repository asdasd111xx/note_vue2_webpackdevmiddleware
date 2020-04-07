<template>
    <div :class="[$style.container, 'clearfix']">
        <div
            v-for="data in dataList"
            :key="data.link"
            :class="$style['item-wrap']"
            @click.stop="changePage({page: 'casino', subPage: data.link})"
        >
            <div :class="$style['title-img']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/casino/${data.link}-icon.png`)" />
            </div>
            <div :class="$style.text">{{ data.text }}</div>
            <div :class="$style['img-wrap']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/casino/${data.link}.png`)" />
            </div>
        </div>
        <div :class="$style['more-btn-wrap']" @click.stop="changePage({page: 'casino'})">
            <div :class="$style['more-text']">更多游戏</div>
            <div :class="$style['more-img']">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/casino/more.png')" />
            </div>
        </div>
        <div :class="$style.rebate">
            <div :class="$style['rebate-vendor']">{{ $text('S_CASINO', '电子游艺') }}</div>
            <div :class="$style['rebate-title']">
                SLOT<br />GAME
            </div>
            <div :class="$style['rebate-text']">{{ $text('S_YABO_TEXT03', '返水最高可达') }}</div>
            <div :class="$style['percent-img']">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/casino/icon-100.png')" />
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
                { link: 'bbin', text: this.$text('S_BBCASINO', 'BB电子') },
                { link: 'mg2', text: this.$text('S_MG2_CASINO', 'MG电子') },
                { link: 'pt', text: this.$text('S_PT', 'PT电子') },
                { link: 'jdb', text: this.$text('S_JDB', 'JDB电子') },
                { link: 'ag_casino', text: this.$text('S_AG_CASINO', 'AG电子') }
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
    padding-top: 34px;
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
    height: 43px;
    line-height: 43px;
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
