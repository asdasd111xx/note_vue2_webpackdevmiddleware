<template>
    <div :class="$style['cg-play-wrap']">
        <div :class="$style['nav-wrap']">
            <div :class="[$style['nav-container'], 'clearfix']">
                <div :class="$style.logo" />
                <ul :class="[$style.menu, 'clearfix']">
                    <li>
                        <a
                            :class="{[$style.active] : currentTag === 'deposit' }"
                            href="#"
                            @click.prevent="scrollTo('deposit')"
                        >
                            {{ $text('S_CG_DEPOSIT_TUTORIAL', 'CG Pay存款教学') }}
                        </a>
                    </li>
                    <li>
                        <a
                            :class="{[$style.active] : currentTag === 'withdraw' }"
                            href="#"
                            @click.prevent="scrollTo('withdraw')"
                        >
                            {{ $text('S_CG_WITHDRAW_TUTORIAL', 'CG Pay取款教学') }}
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://dcgpmobile.azurewebsites.net/webview/index.aspx"
                            target="_blank"
                        >
                            {{ $text('S_CG_DESCRIPTION', 'CG Pay功能说明') }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div :class="$style['main']">
            <div ref="deposit" :class="$style['deposit']">
                <div :class="$style['step-one']">
                    <div :class="[$style['container'], $style.animated, $style.slideInRight, 'clearfix']">
                        <div :class="[$style['step'], $style['deposit-step1']]">
                            <P>{{ $text('S_CG_MEMBER', '会员中心') }}→</P>
                            <P>{{ $text('S_CG_DEPOSIT', '存款') }}→</P>
                            <P>{{ $text('S_CG_WALLET', '选择CG钱包') }}→</P>
                            <P>{{ $text('S_CG_GO_PAY', '输入金额，前往支付') }}</P>
                        </div>
                        <div :class="[$style['deposit-step-img'], $style['deposit-step1-img']]" />
                    </div>
                </div>
                <div :class="$style['step-two']">
                    <div :class="[$style['container'], $style.animated, $style.slideInLeft, 'clearfix']">
                        <div :class="[$style['step'], $style['deposit-step2']]">
                            <P>{{ $text('S_CG_APP', '打开CG Pay APP') }}</P>
                            <P>{{ $text('S_CG_SCAN', '进行扫码即刻完成打币') }}</P>
                        </div>
                        <div :class="[$style['deposit-step-img'], $style['deposit-step2-img']]" />
                    </div>
                </div>
            </div>
            <div ref="withdraw" :class="$style['withdraw']">
                <div :class="$style['step-one']">
                    <div :class="[$style['container'], $style.animated, $style.slideInRight, 'clearfix']">
                        <div :class="[$style['step'], $style['withdraw-step1']]">
                            <P>{{ $text('S_CG_WITHDRAW', '取款') }}→</P>
                            <P>{{ $text('S_CG_WALLET', '选择CG钱包') }}</P>
                        </div>
                        <div :class="[$style['withdraw-step1-img'], $style.blink]" />
                    </div>
                </div>
                <div :class="$style['step-two']">
                    <div :class="[$style['container'], $style.animated, $style.slideInLeft, 'clearfix']">
                        <div :class="[$style['step'], $style['withdraw-step2']]">
                            <P>{{ $text('S_CG_SEND', '申请成功送出！') }}</P>
                            <p :class="$style['step-two-prompt']">{{ $text('S_CG_PROMPT', 'CG Pay取款完成时会跳出推播提示，可于CG Pay APP中确认取款') }}</p>
                        </div>
                        <div :class="$style['withdraw-step2-img']" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */

export default {
    data() {
        return {
            currentTag: 'deposit'
        };
    },
    methods: {
        scrollTo(tag) {
            this.currentTag = tag;
            $('html, body').animate({ scrollTop: this.$refs[tag].offsetTop }, 1000);
        }
    }
};
</script>

<style lang="scss" src="@/css/tpl/index.scss"></style>
<style lang="scss" module>
.cg-play-wrap {
    min-width: 1200px;
    min-height: 100%;
    background: #EEE;
}

.nav-wrap {
    width: 100%;
    height: 61px;
    position: fixed;
    z-index: 10;
    background: #EBF7F3;
}

.nav-container {
    width: 1200px;
    padding: 0 80px 0 50px;
    margin: 0 auto;
}

.logo {
    float: left;
    width: 255px;
    height: 61px;
    background: url('/static/image/cgPay/logo.png') no-repeat left center;
}

.menu {
    float: right;
    line-height: 61px;
    margin: 0;
    padding-left: 0;
    list-style: none;

    li {
        float: left;
        font-size: 16px;
        padding: 0 38px;

        a {
            display: block;
            position: relative;
            color: #999;
            text-decoration: none;

            &:hover,
            &.active {
                color: #212121;
                &:after {
                    content: '';
                    position: absolute;
                    display: block;
                    width: 20px;
                    height: 8px;
                    margin-left: -10px;
                    left: 50%;
                    bottom: 5px;
                    background: url('/static/image/cgPay/nav.png') no-repeat left top;
                }
            }
        }
    }
}

.deposit {
    .step-one {
        .container {
            height: 590px;
        }
    }
}

.step-one {
    background: url('/static/image/cgPay/deposit_step1_bg.png') no-repeat;
    background-position: center;
    background-size: cover;
}

.container {
    width: 1200px;
    margin: 0 auto;
}

.step {
    float: left;
    line-height: 30px;
    margin: 0 0 0 70px;
    min-width: 220px;
    padding: 70px 0 0 0;
    font-size: 18px;
    color: #777;

    p {
        line-height: 30px;
        margin-bottom: 0;
    }
}

.deposit-step1 {
    width: 220px;
    padding-top: 210px;
    margin-top: 133px;
    color: #FFF;
    background: url('/static/image/cgPay/deposit_step1.png') no-repeat;
    background-position: right top;
}

.deposit-step-img {
    float: right;
    width: 908px;
}

.deposit-step1-img {
    height: 519px;
    margin-top: 71px;
    background: url('/static/image/cgPay/deposit_step1_pic.png') no-repeat left top;
}

.deposit-step2 {
    padding-top: 240px;
    background: url('/static/image/cgPay/deposit_step2.png') no-repeat;
    background-position: left 180px;
}

.deposit-step2-img {
    height: 407px;
    margin-top: 71px;
    background: url('/static/image/cgPay/deposit_step2_pic.png') no-repeat left top;
}

.withdraw {
    width: 100%;
    .container {
        position: relative;
    }

    .step-one {
        background: url('/static/image/cgPay/withdraw_step1_bg.png') no-repeat;
        background-position: center;
        background-size: cover;

        .container {
            height: 448px;
            padding-top: 80px;
        }
    }

    .step-two {
        .container {
            height: 484px;
            padding-top: 40px;
        }
    }

    .step-two-prompt {
        width: 295px;
    }
}

.withdraw-step1 {
    width: 220px;
    padding-top: 203px;
    color: #FFF;
    background: url('/static/image/cgPay/withdraw_step1.png') no-repeat;
    background-position: right top;
}

.withdraw-step1-img {
    width: 1044px;
    height: 438px;
    position: absolute;
    background: url('/static/image/cgPay/withdraw_step1_pic.png') no-repeat left top;
    right: -20px;
    bottom: 0;
}

.withdraw-step2 {
    padding-top: 210px;
    background: url('/static/image/cgPay/withdraw_step2.png') no-repeat;
    background-position: left 150px;
}

.withdraw-step2-img {
    width: 838px;
    height: 454px;
    position: absolute;
    left: 320px;
    bottom: 0;
    background: url('/static/image/cgPay/withdraw_step2_pic.png') no-repeat left top;
}

.blink {
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-name: blink;
    animation-duration: .5s;
}

.animated {
    animation-duration: 2s;
    animation-fill-mode: both;
}

@keyframes blink {
    from {
        background-image: url('/static/image/cgPay/withdraw_step1_pic.png');
    }
    to {
        background-image: url('/static/image/cgPay/withdraw_step1_pic2.png');
    }
}

@keyframes slideInRight {
    0% {
        opacity: 0;
        transform: translateX(50px);
    }
    100% {
        transform: translateX(0);
    }
}

.slideInRight {
    animation-name: slideInRight;
}

@keyframes slideInLeft {
    25% {
        opacity: 0;
        transform: translateX(-50px);
    }
    100% {
        transform: translateX(0);
    }
    0% {
        opacity: 0;
        transform: translateX(-50px);
    }
}

.slideInLeft {
    animation-name: slideInLeft;
}
</style>
