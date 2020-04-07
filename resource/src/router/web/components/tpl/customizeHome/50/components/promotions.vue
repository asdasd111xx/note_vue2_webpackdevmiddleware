<template>
    <div :class="[$style.container, 'clearfix']">
        <div :class="$style['item-wrap']" @click="changePage.stop({ page: '10521' })">
            <div :class="$style['title-img']">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/50/promotions/preferential_1.png')" />
            </div>
            <div :class="$style.content">
                <div :class="$style.title">{{ $text('S_YABO_TEXT12', '劲爆优惠') }}</div>
                <div :class="$style.text">{{ $text('S_YABO_TEXT13', '体育首存即送50%红利') }}</div>
                <div :class="$style['game-text']">PROMOTIONS</div>
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
    }
};
</script>

<style lang="scss" module>
.container {
    width: 1500px;
    height: 100%;
    margin: 0 auto;
    text-align: center;
}

.item-wrap {
    display: inline-block;
    width: 576px;
    height: 100%;
    padding-top: 19px;
    text-align: left;
    cursor: pointer;

    &:hover {
        background-color: #FFF;
        opacity: .9;

        .title-img {
            transition: all .5s;
            transform: scale(1.03);
        }
    }
}

.title-img {
    display: inline-block;
    vertical-align: middle;
}

.content {
    display: inline-block;
    margin-left: 30px;
    vertical-align: middle;
}

.title {
    position: relative;
    font-size: 40px;
    color: #343434;
    font-weight: 500;

    > img {
        position: absolute;
        top: -30px;
        right: -15px;
    }
}

.text {
    margin: 17px 0 13px;
    color: #999;
    font-size: 16px;
}

.game-text {
    color: #000;
    font-size: 24px;
}
</style>
