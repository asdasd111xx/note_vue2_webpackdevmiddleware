<template>
    <div :class="$style['page-footer-wrap']">
        <div :class="[$style['footer-top-wrap'], 'clearfix']">
            <div :class="$style['footer-license']">
                <div :class="$style['footer-title']">{{ $text('S_OPERATING_LICENSE', '运营牌照') }}</div>
                <div :class="$style['footer-license-item']">
                    <p>{{ $text('S_UNITED_KINGDOM', '英国Gambling') }}</p>
                    <p>{{ $text('S_LICENSE', 'Commission牌照') }}</p>
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/52/footer-logo-01.png')" />
                </div>
                <div :class="[$style['footer-license-item'], $style['license-pagcor']]">
                    <p>{{ $text('S_PHILIPPINES', '菲律宾Pagcor') }}</p>
                    <p>{{ $text('S_GAMING_LICENSE', '博彩执照') }}</p>
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/52/footer-logo-02.png')" />
                </div>
            </div>
            <div :class="$style['footer-pay']">
                <div :class="$style['footer-title']">{{ $text('S_COOPERATIVE_PAYMENT', '合作支付') }}</div>
                <div :class="[$style['footer-pay-list'], 'clearfix']">
                    <div
                        v-for="(item, index) in payimg"
                        :key="`payimg-${index}`"
                        :class="$style['footer-pay-item']"
                    >
                        <img :src="$getCdnPath(item)" />
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style['footer-copyright']">Copyright © {{ agentInfo.config.domain_name[$i18n.locale] }} Reserved</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            payimg: [
                '/static/image/tpl/customizeHome/52/footer-pay-03.png',
                '/static/image/tpl/customizeHome/52/footer-pay-02.png',
                '/static/image/tpl/customizeHome/52/footer-pay-04.png',
                '/static/image/tpl/customizeHome/52/footer-pay-05.png',
                '/static/image/tpl/customizeHome/52/footer-pay-06.png',
                '/static/image/tpl/customizeHome/52/footer-pay-07.png'
            ]
        };
    },
    computed: {
        ...mapGetters({
            agentInfo: 'getAgentInfo'
        })
    }
};
</script>

<style lang="scss" module>
@import "~@/css/tpl/index.scss";

.page-footer-wrap {
    position: relative;
    color: #FFF;
    background: #000;
}

.footer-top-wrap {
    width: 1000px;
    margin: 0 auto;
    padding: 55px 0 50px;
}

.footer-license,
.footer-pay {
    float: left;
    width: 50%;

    img {
        max-width: 100%;
        height: 40px;
        vertical-align: top;
    }
}

.footer-pay {
    border-left: 1px solid #333;
}

.footer-title {
    margin-bottom: 30px;
    text-align: center;
    font-size: 14px;
    font-weight: bolder;
}

.footer-license-item {
    float: left;
    width: 50%;
    margin-bottom: 30px;
    font-size: 15px;
    transition: all 0.5s;

    p {
        line-height: 1.8;
        margin-bottom: 30px;
    }

    &.license-pagcor {
        padding-left: 50px;
        box-sizing: border-box;
    }

    &:hover {
        opacity: 0.5;
    }
}

.footer-pay-list {
    padding-left: 20px;
}

.footer-pay-item {
    float: left;
    width: 25%;
    margin: 10px 0 20px;
    text-align: right;
    transition: all 0.5s;
    cursor: pointer;

    &:nth-child(n + 5) {
        width: 33.33%;
        text-align: left;
    }

    &:nth-child(6) {
        text-align: center;
    }

    &:nth-child(7) {
        text-align: right;
    }

    &:hover {
        opacity: 0.5;
    }
}

.footer-menu {
    padding: 20px 0;
    margin: 0;
    text-align: center;
}

.footer-menu-item {
    display: inline-block;
    width: 130px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    border-right: 1px solid rgba(255, 255, 255, 0.5);
    transition: all 0.5s;
    cursor: pointer;

    span {
        display: block;
    }

    a {
        display: block;
        color: #FFF;
    }

    &:last-child {
        border-right: 0;
    }

    &:hover {
        opacity: 0.5;
    }
}

.footer-copyright {
    line-height: 60px;
    text-align: center;
    color: #000;
    background: #F7B500;
}
</style>
