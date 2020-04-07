<template>
    <div :class="$style['custom-page']">
        <div :class="$style['custoom-container']">
            <menus />
            <div :class="$style['custoom-content']">
                <transition
                    :enter-class="$style['slide-fade-enter']"
                    :leave-to-class="$style['slide-fade-leave-to']"
                    :enter-active-class="$style['slide-fade-enter-active']"
                    :leave-active-class="$style['slide-fade-leave-active']"
                >
                    <component :is="templateName" />
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import menus from './menus';

export default {
    components: {
        menus,
        aboutUs: () => import(/* webpackChunkName: 'aboutUs' */ './aboutUs'),
        trust: () => import(/* webpackChunkName: 'trust' */ './trust'),
        terms: () => import(/* webpackChunkName: 'terms' */ './terms'),
        agreement: () => import(/* webpackChunkName: 'agreement' */ './agreement'),
        privacy: () => import(/* webpackChunkName: 'privacy' */ './privacy'),
        recharge: () => import(/* webpackChunkName: 'recharge' */ './recharge'),
        withdrawal: () => import(/* webpackChunkName: 'withdrawal' */ './withdrawal'),
        withdrawtip: () => import(/* webpackChunkName: 'withdrawtip' */ './withdrawtip'),
        register: () => import(/* webpackChunkName: 'register' */ './register'),
        problem: () => import(/* webpackChunkName: 'problem' */ './problem'),
        browser: () => import(/* webpackChunkName: 'browser' */ './browser'),
        tutorial: () => import(/* webpackChunkName: 'tutorial' */ './tutorial'),
        sportsRules: () => import(/* webpackChunkName: 'sportsRules' */ './sportsRules'),
        realRules: () => import(/* webpackChunkName: 'realRules' */ './realRules'),
        electronicRules: () => import(/* webpackChunkName: 'electronicRules' */ './electronicRules'),
        lotteryRules: () => import(/* webpackChunkName: 'lotteryRules' */ './lotteryRules'),
        contact: () => import(/* webpackChunkName: 'contact' */ './contact'),
        cgpay: () => import(/* webpackChunkName: 'cgpay' */'./cgpay')
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            nowpage: 'getNowpage'
        }),
        templateName() {
            const templateName = {
                500011: {
                    36319: 'aboutUs',
                    36323: 'trust',
                    36324: 'terms',
                    36325: 'agreement',
                    36326: 'privacy',
                    36327: 'cgpay',
                    36330: 'browser',
                    36328: 'problem',
                    36322: 'contact',
                    34298: 'promotion',
                    36299: 'sportBet'
                },
                53: {
                    12171: 'aboutUs',
                    12175: 'trust',
                    12176: 'terms',
                    12177: 'agreement',
                    12178: 'privacy',
                    12179: 'cgpay',
                    12180: 'problem',
                    12174: 'contact',
                    10733: 'promotion',
                    12170: 'sportBet'
                },
                52: {
                    12158: 'aboutUs',
                    12162: 'trust',
                    12163: 'terms',
                    12164: 'agreement',
                    12165: 'privacy',
                    12166: 'cgpay',
                    12167: 'problem',
                    12161: 'contact',
                    10684: 'promotion',
                    12157: 'sportBet'
                }
            };

            return templateName[this.memInfo.user.domain][this.nowpage];
        }
    }
};
</script>

<style lang="scss" module>
.custom-page {
    padding: 20px 0 40px;
    background-color: #E2E2E2;
}

.custoom-container {
    display: flex;
    width: 1242px;
    margin: 0 auto;
}

.custoom-content {
    display: flex;
    width: 922px;
    position: relative;
}
.slide-fade-enter-active{
    transition: all .3s ease;
    transition-delay: .3s;
}
 .slide-fade-leave-active {
    position: absolute;
    transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0
}
</style>
