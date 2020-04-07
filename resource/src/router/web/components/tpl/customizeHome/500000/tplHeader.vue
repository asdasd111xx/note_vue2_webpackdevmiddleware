<template>
    <div :class="$style['header-wrap']" :style="{ left: `${distance}px` }">
        <div :class="$style['header-top']">
            <div :class="[$style['header-top-wrap'], 'clearfix']">
                <div :class="$style['item-left']">
                    <span :class="$style.time">E.S.T</span>
                    <span :class="$style.time">{{ clock.day }}</span>
                    <span :class="$style.time">{{ clock.time }}</span>
                    <span :class="$style['link-wrap']">
                        <span :class="$style.link" @click="changePage(homeLink)">{{ $text('S_HOME_PAGE', '网站首页') }}</span>
                        <span>｜</span>
                        <span :class="$style.link" @click="changePage('service')">{{ $text('S_CUSTOMER_SERVICE_ONLINE', '在线客服') }}</span>
                    </span>
                </div>
                <mem-login v-if="!loginStatus" :class="$style['item-right']" />
                <mem-info v-else :class="$style['item-right']" />
            </div>
        </div>
        <div :class="$style['header-middle']">
            <div :class="$style['middle-wrap']">
                <div
                    v-for="(nav, index) in navList[0]"
                    :key="index"
                    :class="$style.nav"
                    @mouseenter="currentType = nav.objKey;"
                    @mouseleave="currentType = ''"
                    @click="changePage(nav.link, nav.type)"
                >
                    <span>{{ nav.text }}</span>
                    <span :class="$style.icon" />
                    <div :class="$style.baseline" />
                    <transition name="slide-down">
                        <nav-content
                            v-show="currentType === nav.objKey"
                            :current-type="currentType"
                            :distance="distance"
                        />
                    </transition>
                </div>
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/logo.png')" @click="changePage(homeLink)" />
                <div
                    v-for="(nav, index) in navList[1]"
                    :key="index"
                    :class="$style.nav"
                    @mouseenter="currentType = nav.objKey;"
                    @mouseleave="currentType = ''"
                    @click="changePage(nav.link, nav.type)"
                >
                    <span>{{ nav.text }}</span>
                    <span :class="$style.icon" />
                    <div :class="$style.baseline" />
                    <transition name="slide-down">
                        <nav-content
                            v-show="currentType === nav.objKey && currentType !== 'venture'"
                            :current-type="currentType"
                            :distance="distance"
                        />
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import updateQrcode from '@/lib/qrocodeUpdate';
import memLogin from './components/memLogin';
import memInfo from './components/memInfo';
import navContent from './components/navContent';

export default {
    components: {
        memLogin,
        memInfo,
        navContent
    },
    data() {
        return {
            estTime: Vue.moment(this.systemTime).utcOffset(-4),
            currentType: '',
            distance: 0
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            gameData: 'getGameData',
            loginStatus: 'getLoginStatus',
            systemTime: 'getSystemTime'
        }),
        homeLink() {
            const domain = this.webInfo.alias;
            const links = {
                500000: '30734',
                48: '10144',
                50: '10324'
            };

            return links[domain];
        },
        navList() {
            const domain = this.webInfo.alias;
            const links = {
                500000: {
                    sports: '32110',
                    esports: '32257',
                    live: '30735',
                    lottery: '30764',
                    casino: 'casino',
                    card: 'card',
                    app: '31310',
                    venture: '32422',
                    promotions: '32371'
                },
                48: {
                    sports: '10485',
                    esports: '10487',
                    live: '10145',
                    lottery: '10173',
                    casino: 'casino',
                    card: 'card',
                    app: '10481',
                    venture: '10489',
                    promotions: '10488'
                },
                50: {
                    sports: '10517',
                    esports: '10520',
                    live: '10325',
                    lottery: '10353',
                    casino: 'casino',
                    card: 'card',
                    app: '10513',
                    venture: '10522',
                    promotions: '10521'
                }
            };

            return [
                [
                    {
                        text: this.$text('S_WS_SPORT', '威尼斯人体育'), objKey: 'sports', link: links[domain].sports, type: ''
                    },
                    {
                        text: this.$text('S_ESPORTS', '电子竞技'), objKey: 'esports', link: links[domain].esports, type: ''
                    },
                    {
                        text: this.$text('S_LIVE', '真人娱乐'), objKey: 'live', link: links[domain].live, type: ''
                    },
                    {
                        text: this.$text('S_LOTTERY_BETTING', '彩票投注'), objKey: 'lottery', link: links[domain].lottery, type: ''
                    },
                    {
                        text: this.$text('S_CASINO', '电子游艺'), objKey: 'casino', link: links[domain].casino, type: ''
                    }
                ],
                [
                    {
                        text: this.$text('S_CARD', '棋牌游戏'), objKey: 'card', link: links[domain].card, type: ''
                    },
                    {
                        text: this.$text('S_MOBILE_APP', '手机APP'), objKey: 'app', link: links[domain].app, type: ''
                    },
                    // { text: this.$text('S_VENTURE_PLAN', '合营计划'), objKey: 'venture', link: links[domain].venture, type: 'external' },
                    {
                        text: this.$text('S_PROMOTIONS', '优惠活动'), objKey: 'promotions', link: links[domain].promotions, type: ''
                    }
                ]
            ];
        },
        clock() {
            return {
                day: this.estTime.format('YYYY-MM-DD'),
                time: this.estTime.format('HH:mm:ss')
            };
        }
    },
    created() {
        this.estClock();
        if (this.isBackEnd) {
            return;
        }

        updateQrcode.update();
    },
    mounted() {
        $(window).scroll(this.onScroll);
    },
    beforeDestroy() {
        if (this.isBackEnd) {
            return;
        }

        clearTimeout(updateQrcode.timer);
        $(window).off('scroll', this.onScroll);
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ]),
        estClock() {
            setInterval(() => {
                this.estTime = Vue.moment(this.estTime).utcOffset(-4).add(1, 'seconds');
            }, 1000);
        },
        changePage(path, type) {
            if (this.isBackEnd || !path) {
                return;
            }

            if (['32110', '10517', '10485'].includes(path) && this.gameData.csc.switch === 'Y' && !this.loginStatus) {
                alert(this.$text('S_LOGIN_TIPS', '请先登入'));
                return;
            }

            if (type === 'external') {
                this.actionChangePage({ page: `/page/${path}`, type });
                return;
            }

            this.actionChangePage({ page: path });
        },
        onScroll() {
            this.distance = -window.scrollX;
        }
    }
};
</script>

<style lang="scss" module>
.header-wrap {
    position: fixed;
    width: 100%;
    min-width: 1340px;
    color: #BFBFBF;
    z-index: 999;
}

.header-top {
    background: #222;
}

.header-top-wrap {
    width: 1200px;
    height: 34px;
    margin: 0 auto;
    line-height: 34px;
}

.item-left {
    float: left;
    line-height: 34px;
}

.time {
    margin-right: 10px;
}

.link-wrap {
    margin-left: 40px;
}

.link {
    cursor: pointer;

    &:hover {
        color: #FFF;
    }
}

.item-right {
    float: right;
    height: 34px;
}

.header-middle {
    background-color: #FFF;
}

.middle-wrap {
    width: 1200px;
    margin: 0 auto;

    > img {
        margin-right: 22px;
        vertical-align: middle;
        cursor: pointer;
    }
}

.nav {
    display: inline-block;
    position: relative;
    max-width: 90px;
    height: 86px;
    margin-right: 22px;
    color: #666;
    font-size: 16px;
    line-height: 86px;
    vertical-align: middle;
    white-space: nowrap;
    cursor: pointer;

    &:first-child {
        margin-right: 44px;
    }

    &:last-child {
        margin-right: 0;
    }

    &:hover {
        color: #BA8C4E;

        .icon {
            height: 12px;
            transform: rotate(180deg);
            background: url('/static/image/tpl/customizeHome/500000/ico_arrow_up.png') 0 50% no-repeat;
        }

        .baseline {
            transform: scaleX(1);
        }
    }
}

.icon {
    display: inline-block;
    width: 12px;
    height: 8px;
    background: url('/static/image/tpl/customizeHome/500000/ico_arrow_down.png') 0 0 no-repeat;
    transition: all .3s ease;
}

.baseline {
    position: absolute;
    width: 25px;
    height: 2px;
    left: 20px;
    bottom: 25px;
    border-radius: 30px;
    transition: all .3s ease;
    background-color: #BA8C4E;
    transform: scaleX(0);
    content: "";
}
</style>
