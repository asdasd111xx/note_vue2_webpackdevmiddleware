<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['page-container']">
            <div :class="$style['people-wrap']">
                <img
                    v-for="num in 5"
                    :key="num"
                    :class="$style[`people-${num}`]"
                    :src="$getCdnPath(`/static/image/tpl/17/customPage/sports/im_img_${num}.png`)"
                />
            </div>
            <div :class="$style['title-img-wrap']">
                <img :class="$style['title-img']" :src="$getCdnPath('/static/image/tpl/17/customPage/sports/im-title.png')" />
                <div :class="$style['title-content']">
                    <img :src="$getCdnPath('/static/image/tpl/17/customPage/sports/im-icon-left.png')" />
                    <span :class="$style['title-left']">最全赛事</span>
                    <span :class="$style['title-btn']" @click="changePage({type: 'games', page: 'tgp'})">立即游戏</span>
                    <span :class="$style['title-right']">一应俱全 </span>
                    <img :src="$getCdnPath('/static/image/tpl/17/customPage/sports/im-icon-right.png')" />
                </div>
            </div>
            <img :class="$style['icon-img']" :src="$getCdnPath('/static/image/tpl/17/customPage/sports/im-icon.png')" />
            <div :class="$style['red-img-wrap']">
                <img
                    v-for="num in 5"
                    :key="num"
                    :class="[$style[`red-img-${num}`], $style['map-animation']]"
                    :src="$getCdnPath('/static/image/tpl/17/customPage/sports/red_img.png')"
                />
            </div>
            <div :class="$style['blue-img-wrap']">
                <img
                    v-for="num in 5"
                    :key="num"
                    :class="[$style[`blue-img-${num}`], $style['map-animation']]"
                    :src="$getCdnPath('/static/image/tpl/17/customPage/sports/blue_img.png')"
                />
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
        };
    }
};
</script>

<style lang="scss" module>
@keyframes iconAnim {
    0% {
        opacity: 0;
        transform: translate3d(0, 50%, 0) scale(0.6);
    }
    100% {
        opacity: 1;
        transform: translateZ(0) scale(1);
    }
}

@keyframes people1 {
    0% {
        transform: translateY(6px) scale(0.95);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

@keyframes people2 {
    0% {
        transform: translateY(-6px) scale(0.95);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

@keyframes people3 {
    0% {
        transform: translateY(6px) scale(0.95);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

.page-wrap {
    height: 902px;
    padding-top: 120px;
    background: url('/static/image/tpl/17/customPage/sports/im_sport_bg.png') 0 100% no-repeat;
    overflow: hidden;
}

.page-container {
    position: relative;
    left: 50%;
    width: 1729px;
    height: 796px;
    margin-left: -865px;
    background: url('/static/image/tpl/17/customPage/sports/im_map.png') 0 100%/100% 239px no-repeat;
}

.people-wrap {
    display: inline-block;
    position: relative;
    top: 137px;
    left: 17%;
    width: 1210px;
    height: 517px;
}

.people-1 {
    position: absolute;
    top: 79px;
    left: 124px;
    animation: people1 1.6s ease-in-out;
}

.people-2 {
    position: absolute;
    top: 37px;
    left: 254px;
    animation: people2 1.6s ease-in-out;
}

.people-3 {
    position: absolute;
    left: 35%;
    animation: people3 1.6s ease-in-out;
}

.people-4 {
    position: absolute;
    right: 243px;
    top: 37px;
    animation: people2 1.6s ease-in-out;
}

.people-5 {
    position: absolute;
    top: 76px;
    right: 127px;
    animation: people1 1.6s ease-in-out;
}

.title-img-wrap {
    position: absolute;
    bottom: 100px;
    left: 472px;
    width: 850px;
    height: 270px;
    text-align: center;
}

.title-content {
    position: relative;
    top: -42px;

    >img {
        vertical-align: middle;
    }
}

.title-left {
    display: inline-block;
    vertical-align: middle;
    font-size: 36px;
    font-style: italic;
    font-weight: 600;
    color: #FF9A00;
}

.title-btn {
    display: inline-block;
    width: 199px;
    height: 59px;
    margin: 0 3px 0 12px;
    line-height: 59px;
    text-align: center;
    font-size: 16px;
    vertical-align: middle;
    font-style: italic;
    background: url('/static/image/tpl/17/customPage/sports/orange_button.png') 0 0 no-repeat;
    cursor: pointer;
    color: #FFF;
}

.title-right {
    display: inline-block;
    vertical-align: middle;
    font-size: 36px;
    font-style: italic;
    font-weight: 600;
    color: #00AEFF;
}

.icon-img {
    position: absolute;
    bottom: 40px;
    left: 25%;
}

.red-img-wrap {
    display: inline-block;
    position: relative;
    width: 357px;
    height: 169px;
    margin: 71px 0 0 207px;
}

.map-animation {
    animation: iconAnim .6s ease-in-out both;
}

.red-img-1 {
    position: absolute;
    top: 22px;
    right: 47px;
    animation-delay: .5s;
}

.red-img-2 {
    position: absolute;
    top: 72px;
    right: 82px;
    animation-delay: .4s;
}

.red-img-3 {
    position: absolute;
    bottom: 62px;
    right: 151px;
    animation-delay: .3s;
}

.red-img-4 {
    position: absolute;
    bottom: 42px;
    left: 126px;
    animation-delay: .2s;
}

.red-img-5 {
    position: absolute;
    bottom: 20px;
    left: 51px;
    animation-delay: .1s;
}

.blue-img-wrap {
    float: right;
    position: relative;
    width: 223px;
    height: 200px;
    right: 280px;
    top: 44px;
}

.blue-img-1 {
    position: absolute;
    top: 30px;
    left: 35px;
    animation-delay: .5s;
}

.blue-img-2 {
    position: absolute;
    top: 66px;
    right: 90px;
    animation-delay: .4s;
}

.blue-img-3 {
    position: absolute;
    bottom: 100px;
    left: 22px;
    animation-delay: .3s;
}

.blue-img-4 {
    position: absolute;
    bottom: 64px;
    right: 33px;
    animation-delay: .2s;
}

.blue-img-5 {
    position: absolute;
    bottom: 44px;
    right: 112px;
    animation-delay: .1s;
}
</style>
