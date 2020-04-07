<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['vendor-wrap']">
            <div :class="$style['vendor-content-wrap']">
                <div :class="$style['vendor-img-wrap']">
                    <div
                        v-for="data in imgData"
                        v-show="currentVendor === data.type"
                        :key="data.type"
                        :class="[$style[`${data.type}-wrap`], $style['img-wrap']]"
                    >
                        <img
                            v-for="img in data.imgList"
                            :key="img"
                            :class="[$style[`${data.type}-${img}`], $style['img-container']]"
                            :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/lottery/${data.type}/img_${img}.png`)"
                        />
                    </div>
                </div>
                <transition-group name="slide-opacity-right">
                    <div
                        v-for="vendor in vendorList"
                        v-show="currentVendor === vendor.link"
                        :key="vendor.link"
                        :class="$style['vendor-container']"
                    >
                        <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/lottery/${vendor.link}/wz_${vendor.link}.png`)" />
                        <div :class="$style['vendor-copy']">{{ vendor.content }}</div>
                        <div :class="$style['vendor-ball-wrap']">
                            <img
                                v-for="num in 5"
                                :key="num"
                                :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/lottery/${vendor.link}/img_${vendor.link}_${num}.png`)"
                            />
                        </div>
                        <div :class="$style.btn" @click="changePage({type: 'games', page: vendor.link})">{{ $text('S_PLAY_NOW', '立即游戏') }}</div>
                    </div>
                </transition-group>
            </div>
            <div :class="$style['vendor-btn-wrap']">
                <span
                    v-for="vendor in vendorList"
                    :key="vendor.link"
                    :class="[$style['vendor-btn'], { [$style.current]: currentVendor === vendor.link }]"
                    @mouseenter="hoverVendor = vendor.link"
                    @mouseleave="hoverVendor = ''"
                    @click="currentVendor = vendor.link"
                >
                    <img v-show="currentVendor === vendor.link || hoverVendor === vendor.link" :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/lottery/${vendor.link}/logo_${vendor.link}_active.png`)" />
                    <img v-show="hoverVendor !== vendor.link && currentVendor !== vendor.link" :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/lottery/${vendor.link}/logo_${vendor.link}.png`)" />
                    {{ vendor.text }}
                </span>
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
            vendorList: [
                { text: this.$text('S_BBIN_LOTTERY', 'bbin彩票'), link: 'lottery', content: 'BBIN彩票打造着高品质游戏体验、不断地求新求变，寻找最新的创意，秉持最好的服务……，种种这些都注定BBIN彩票的不俗传说，超百种彩票玩法任您赢！' },
                { text: this.$text('S_LGLOTTERY', 'XBB彩票'), link: 'lg_lottery', content: '专注彩票研发20年团队打造，经典创新兼具的彩票平台，六合彩、时时彩、PK十、即开彩票-秒秒彩，齐全的功能、简易投注接口，让您玩彩轻松快速。' },
                { text: this.$text('S_XBBLOTTERY', 'XBB微彩'), link: 'xbb_lottery', content: '以微信群投为灵感所开发的聊天室投注游戏。囊括最新颖、最火热的高频彩票游戏，超高赔率边投边聊，跟投追号紧张刺激，让您每次投注好玩又有趣！' },
                { text: this.$text('S_VRLOTTERY', 'VR彩票'), link: 'vr', content: '超人气名模开奖现场全程直播，提供性感热舞，聊天打赏功能，带给您血脉喷张的投注体验。' }
            ],
            currentVendor: 'lottery',
            hoverVendor: '',
            imgData: [
                { type: 'lottery', imgList: ['con', 'greenball', 'redball'] },
                { type: 'lg_lottery', imgList: ['canada', 'green_r', 'red_ball', 'zi'] },
                { type: 'xbb_lottery', imgList: ['horse', 'ball_l', 'ball_r'] },
                { type: 'vr', imgList: ['con', 'leftball', 'rightball'] }
            ]
        };
    }
};
</script>

<style lang="scss" module>
@keyframes lottery_left_outer {
    0% {
        transform: rotateX(20deg);
        opacity: 0;
    }
    100% {
        transform: rotateX(0);
        opacity: 1;
    }
}

@keyframes moveY01 {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(20px);
    }
    100% {
        transform: translateY(0);
    }
}

@keyframes moveY02 {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
    100% {
        transform: translateY(0);
    }
}

.page-wrap {
    height: 920px;
    padding-top: 120px;
    background-color: #F4F6F9;
}

.vendor-wrap {
    width: 1200px;
    margin: 0 auto;
}

.vendor-content-wrap {
    position: relative;
    height: 630px;
}

.vendor-img-wrap {
    width: 712px;
    height: 618px;
    background: url('/static/image/tpl/customizeHome/500000/lottery/bg_water.png') 0 0 no-repeat;
}

.img-wrap {
    position: relative;
}

.img-container {
    position: absolute;
}

.lottery-wrap {
    height: 518px;
    transform-style: preserve-3d;
    transform-origin: bottom center;
    animation: lottery_left_outer .8s ease;
    animation-fill-mode: forwards;

    .lottery-con {
        top: -26px;
        left: -20px;
    }

    .lottery-greenball {
        top: 286px;
        left: 70px;
        animation: moveY02 5s ease infinite;
    }

    .lottery-redball {
        top: 214px;
        right: 5px;
        animation: moveY01 5s ease infinite;
    }
}

.lg_lottery-wrap {
    height: 518px;
    transform-style: preserve-3d;
    transform-origin: bottom center;
    animation: lottery_left_outer .8s ease;
    animation-fill-mode: forwards;

    .lg_lottery-canada {
        top: 19px;
        left: 58px;
    }

    .lg_lottery-green_r {
        top: 210px;
        right: 13px;
        animation: moveY02 5s ease infinite;
    }

    .lg_lottery-red_ball {
        top: 59px;
        right: 94px;
        animation: moveY01 5s ease infinite;
    }

    .lg_lottery-zi {
        top: 135px;
        left: 61px;
        animation: moveY02 5s ease infinite;
    }
}

.xbb_lottery-wrap {
    height: 518px;
    transform-style: preserve-3d;
    transform-origin: bottom center;
    animation: lottery_left_outer .8s ease;
    animation-fill-mode: forwards;

    .xbb_lottery-horse {
        top: 19px;
        left: 58px;
    }

    .xbb_lottery-ball_l {
        top: 100px;
        right: 460px;
        animation: moveY02 5s ease infinite;
    }

    .xbb_lottery-ball_r {
        top: 240px;
        right: 70px;
        animation: moveY01 5s ease infinite;
    }
}

.vr-wrap {
    height: 518px;
    transform-style: preserve-3d;
    transform-origin: bottom center;
    animation: lottery_left_outer .8s ease;
    animation-fill-mode: forwards;

    .vr-con {
        top: -26px;
        left: -20px;
    }

    .vr-leftball {
        top: 120px;
        left: 50px;
        animation: moveY02 5s ease infinite;
    }

    .vr-rightball {
        top: 200px;
        right: 30px;
        animation: moveY01 5s ease infinite;
    }
}

.vendor-btn-wrap {
    margin-top: 35px;
    text-align: center;
}

.vendor-btn {
    display: inline-block;
    width: 280px;
    height: 80px;
    border-radius: 10px;
    line-height: 80px;
    margin-right: 25px;
    font-size: 16px;
    font-weight: 400;
    color: #666;
    text-align: center;
    background-image: linear-gradient(180deg,#FFF,#E8E8E8);
    box-shadow: 0 10px 10px 0 hsla(0,0%,74.9%,.3);
    cursor: pointer;

    &:last-child {
        margin-right: 0;
    }

    > img {
        vertical-align: middle;
        margin-right: 10px;
    }
}

.current,
.vendor-btn:hover {
    color: #FFF;
    background: linear-gradient(270deg, #955D2C, #F3D382);
    box-shadow: 0 10px 20px 6px rgba(145, 87, 40, 0.4);
}

.vendor-container {
    position: absolute;
    top: 120px;
    right: 0;
    width: 450px;

    > img {
        display: block;
        margin: 0 auto 43px;

        &:last-child {
            margin-top: 62px;
        }
    }
}

.vendor-copy {
    margin-top: 40px;
    padding: 0 25px;
    color: #666;
    line-height: 26px;
}

.vendor-ball-wrap {
    margin-top: 57px;
    margin: 57px 0 55px;
}

.btn {
    width: 188px;
    height: 50px;
    margin: 0 auto;
    line-height: 50px;
    border-radius: 25px;
    text-align: center;
    font-size: 18px;
    color: #FFF;
    background: linear-gradient(270deg, #955D2C, #F3D382);
    box-shadow: 0 10px 20px 6px rgba(145, 87, 40, 0.4);
    cursor: pointer;
}

:global {
    .slide-opacity-right-enter-active,
    .slide-opacity-right-leave-active {
        transition: .2s ease;
    }

    .slide-opacity-right-enter-active {
        transition-delay: .2s
    }

    .slide-opacity-right-enter,
    .slide-opacity-right-leave-to {
        opacity: 0;
        transform: translateX(10%);
    }
}
</style>
