<template>
    <div :class="[$style.container, 'clearfix']">
        <div :class="$style['img-wrap']">
            <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/esports/tgpball.png`)" />
        </div>
        <div :class="$style.rebate">
            <div :class="$style['rebate-vendor']">{{ $text('S_THEME3_CASINO', '电子竞技') }}</div>
            <div :class="$style['rebate-title']">
                ELECTRONIC<br />SPORTS
            </div>
            <div :class="$style['rebate-text']">{{ $text('S_YABO_TEXT03', '返水最高可达') }}</div>
            <div :class="$style['percent-img']">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/48/esports/icon-15.png')" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.container {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 0 138px 0 117px;
}

.img-wrap {
    float: left;
    margin-top: 27px;
    width: calc(100% - 166px);
    cursor: pointer;
}

.rebate {
    float: right;
    padding: 47px 0 0 12px;
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
