<template>
    <div :class="$style['middel-container']">
        <div :class="$style.title">
            <h1>{{ $text('S_YABO_TEXT17', '凡所应有 无所不有') }}</h1>
            <h4>{{ $text('S_YABO_TEXT18', '威尼斯人贵宾厅为您提供最优质的服务') }}</h4>
        </div>
        <div :class="$style['circle-progress']">
            <div :class="$style['circle-content']">
                <div :class="$style.progress">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/48/img_browntime.png')" />
                    <svg
                        ref="svgAnimation"
                        :class="$style['progress-svg']"
                        x="0"
                        y="0"
                        viewBox="0 0 133 133"
                        version="1.1"
                    >
                        <path
                            ref="circleAngle"
                            :class="[$style['circle-time'], {[$style['circle-time-ready']]: isReady}]"
                            d="M107 110 A57 60,0 1 0 26 110"
                            fill="none"
                            stroke="#F7F7F8CC"
                            stroke-width="18"
                        />
                    </svg>
                    <div :class="$style['circle-container']">
                        <div :class="$style['circle-num']">60</div>
                        <div :class="$style['circle-text']">{{ $text('S_SECOND', '秒') }}</div>
                    </div>
                </div>
                <div :class="$style['progress-content']">
                    <h5>VENETIAN</h5>
                    <h5>ADVANTAGE</h5>
                    <p>{{ $text('S_AVERAGE_DEPOSIT_TIME', '平均存款时间') }}</p>
                </div>
            </div>
            <div :class="$style['circle-content']">
                <div :class="$style.progress">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/48/img_browntime.png')" />
                    <svg
                        ref="svgAnimation"
                        :class="$style['progress-svg']"
                        x="0"
                        y="0"
                        viewBox="0 0 133 133"
                        version="1.1"
                    >
                        <path
                            ref="circleAngle"
                            :class="[$style['circle-payment'], {[$style['circle-payment-ready']]: isReady}]"
                            d="M107 110 A57 60,0 1 0 26 110"
                            fill="none"
                            stroke="#F7F7F8CC"
                            stroke-width="18"
                        />
                    </svg>
                    <div :class="$style['circle-container']">
                        <div :class="$style['circle-num']">80</div>
                        <div :class="$style['circle-text']">{{ $text('S_FAMILY', '家') }}</div>
                    </div>
                </div>
                <div :class="$style['progress-content']">
                    <h5>VENETIAN</h5>
                    <h5>ADVANTAGE</h5>
                    <p>{{ $text('S_COOPERATIVE_PAYMENT_PLATFORM', '合作支付平台') }}</p>
                </div>
            </div>
            <div :class="$style['circle-content']">
                <div :class="$style.progress">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/48/img_browntime.png')" />
                    <svg
                        ref="svgAnimation"
                        :class="$style['progress-svg']"
                        x="0"
                        y="0"
                        viewBox="0 0 133 133"
                        version="1.1"
                    >
                        <path
                            ref="circleAngle"
                            :class="[$style['circle-time'], {[$style['circle-time-ready']]: isReady}]"
                            d="M107 110 A57 60,0 1 0 26 110"
                            fill="none"
                            stroke="#F7F7F8CC"
                            stroke-width="18"
                        />
                    </svg>
                    <div :class="$style['circle-container']">
                        <div :class="$style['circle-num']">90</div>
                        <div :class="$style['circle-text']">{{ $text('S_SECOND', '秒') }}</div>
                    </div>
                </div>
                <div :class="$style['progress-content']">
                    <h5>VENETIAN</h5>
                    <h5>ADVANTAGE</h5>
                    <p>{{ $text('S_AVERAGE_WITHDRAWAL_TIME', '平均取款时间') }}</p>
                </div>
            </div>
            <div :class="$style['circle-content']">
                <div :class="$style.progress">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/48/img_browntime.png')" />
                    <svg
                        ref="svgAnimation"
                        :class="$style['progress-svg']"
                        x="0"
                        y="0"
                        viewBox="0 0 133 133"
                        version="1.1"
                    >
                        <path
                            ref="circleAngle"
                            :class="[$style['circle-game'], {[$style['circle-game-ready']]: isReady}]"
                            d="M107 110 A57 60,0 1 0 26 110"
                            fill="none"
                            stroke="#F7F7F8CC"
                            stroke-width="18"
                        />
                    </svg>
                    <div :class="$style['circle-container']">
                        <div :class="$style['circle-num']">14</div>
                        <div :class="$style['circle-text']">{{ $text('S_FAMILY', '家') }}</div>
                    </div>
                </div>
                <div :class="$style['progress-content']">
                    <h5>VENETIAN</h5>
                    <h5>ADVANTAGE</h5>
                    <p>{{ $text('S_COOPERATIVE_GAME_PLATFORM', '合作游戏平台') }}</p>
                </div>
            </div>
        </div>
        <div class="clearfix">
            <div
                v-for="item in itemList"
                :key="item.img"
                :class="$style.item"
            >
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/icon_${item.img}.png`)" />
                <div :class="$style['item-content']">
                    <div :class="$style['item-title']">{{ item.title }}</div>
                    <div :class="$style['item-text']">{{ item.text }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            itemList: [
                { img: 'pb', title: '更专业', text: '每天为您提供近千场精彩体育赛事，更有真人、彩票、电子游戏等多种娱乐方式 选择，让您拥有完美游戏体验。' },
                { img: 'convenient', title: '更安全', text: '独家开发，采用128位加密技术和严格的安全管理体系，客户资金得到最 完善的保障，让您全情尽享娱乐、赛事投注，无后顾之忧！' },
                { img: 'security', title: '更便捷', text: '引领市场的卓越技术，自主研发了全套终端应用，让您畅享 Web、H5，更有 iOS、Android原生App，让您随时随地，娱乐投注随心所欲！7×24小时在线 客服提供最贴心、最优质的服务。' },
                { img: 'kuaijie', title: '更快速', text: '最新技术自主研发的财务处理系统，真正做到极速存、取、转。独家网络优 化技术，为您提供一流的游戏体验，最大优化网络延迟。' }
            ],
            isReady: false
        };
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.isReady = true;
            }, 2000);
        });
    }
};
</script>

<style lang="scss" module>
.middel-container {
    width: 1200px;
    margin: 0 auto;
    padding-top: 32px;
    padding: 32px 0 104px;
}

.progress-svg {
    position: absolute;
}

.circle-time {
    stroke-dasharray: 525;
}

.circle-time-ready {
    stroke-dashoffset: 381;
    transition: stroke-dashoffset .5s ease-in-out ;
}

.circle-payment {
    stroke-dasharray: 291;

}

.circle-payment-ready {
    stroke-dashoffset: 267;
    transition: stroke-dashoffset .5s ease-in-out ;
}

.circle-game {
    stroke-dasharray: 381;
}

.circle-game-ready {
    stroke-dashoffset: 200;
    transition: stroke-dashoffset .5s ease-in-out ;
}

.title {
    color: #BA8C4E;
    text-align: center;

    h1 {
        margin: 0;
        font-size: 52px;
        font-weight: 300;
    }

    h4 {
        margin: 0;
        font-size: 24px;
        font-weight: 300;
    }
}

.circle-progress {
    margin-top: 44px;
}

.circle-content {
    display: inline-block;
    margin-right: 218px;
    width: 133px;

    &:last-child {
        margin: 0;
    }
}

.progress {
    position: relative;

    > img {
        position: absolute;
    }
}

.circle-container {
    position: absolute;
    top: 19px;
    left: 19px;
    width: 95px;
    height: 85px;
    padding: 39px 0 0 19px;
    background: url('/static/image/tpl/customizeHome/48/bg_miao.png') 0 0 no-repeat;
}

.circle-num {
    display: inline-block;
    font-size: 34px;
    font-weight: 600;
    color: #FFF;
}

.circle-text {
    composes: circle-num;
    font-size: 18px;
}

.progress-content {
    padding-top: 105px;
    text-align: center;

    > h5 {
        margin: 5px 0;
        color: #C6A138;
        font-size: 12px;
    }

    > p {
        color: #666;
        font-size: 16px;
    }
}

.item {
    float: left;
    width: 50%;
    padding: 38px 65px 0 0;

    &:nth-child(2n) {
        padding: 38px 0 0 65px;
    }
}

.item-content {
    display: inline-block;
    width: 429px;
    margin-left: 22px;
    vertical-align: top;
}

.item-title {
    color: #BA8C4E;
    font-size: 18px;
    font-weight: 400;
}

.item-text {
    margin: 5px 0;
    font-size: 13px;
    line-height: 20px;
    color: #666;
}
</style>
