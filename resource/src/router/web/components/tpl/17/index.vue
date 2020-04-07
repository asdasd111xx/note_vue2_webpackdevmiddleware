<template>
    <div
        id="main-container"
        :class="mainClass"
        class="theme-theme3"
    >
        <components :is="`tplHeader${webInfo.alias}`" v-if="isShow" />
        <custom-copy-page v-if="isCustomCopyPage && copyPageName !== 'page'" :template-name="copyPageName" />
        <custom-page v-else-if="isCustomPage && customPageName !== 'page'" :template-name="customPageName" />
        <div v-else :class="customHallStyle ? $style['hall-wrap'] : ''">
            <!-- 電子棋牌大廳banner -->
            <div v-if="customHallStyle === 'casino'" :class="$style['game-wrap']">
                <div :class="$style['casino-wrap']">
                    <img :class="$style['casino-title']" :src="$getCdnPath('/static/image/tpl/17/casino/img_qianwan_text.png')" />
                    <img :class="$style['casino-people-left']" :src="$getCdnPath('/static/image/tpl/17/casino/img_people_left.png')" />
                    <img :class="$style['casino-people-right']" :src="$getCdnPath('/static/image/tpl/17/casino/img_people_right.png')" />
                    <img :class="$style['casino-crown-left']" :src="$getCdnPath('/static/image/tpl/17/casino/img_crown_left.png')" />
                    <img :class="$style['casino-qi-left']" :src="$getCdnPath('/static/image/tpl/17/casino/img_qi.png')" />
                    <img :class="$style['casino-book-right']" :src="$getCdnPath('/static/image/tpl/17/casino/img_book.png')" />
                    <img :class="$style['casino-green-right']" :src="$getCdnPath('/static/image/tpl/17/casino/img_green.png')" />
                </div>
            </div>
            <div v-if="customHallStyle === 'card'" :class="$style['game-wrap']">
                <div :class="$style['card-wrap']">
                    <img :class="$style['card-people-left']" :src="$getCdnPath('/static/image/tpl/17/card/img_people_left.png')" />
                    <img :class="$style['card-people-right']" :src="$getCdnPath('/static/image/tpl/17/card/img_people_right.png')" />
                    <img :class="$style['card-chip-left']" :src="$getCdnPath('/static/image/tpl/17/card/img_chip.png')" />
                    <img :class="$style['card-coin-right']" :src="$getCdnPath('/static/image/tpl/17/card/img_coin.png')" />
                </div>
            </div>
            <tpl-body :class="customHallStyle ? $style['body-wrap'] : ''" />
        </div>
        <components :is="`tplFooter${webInfo.alias}`" v-if="isShow" />
        <div v-if="popType === 'note'" class="note-content">
            <note :position="popData" />
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import tplBody from '../../page';
import customCopyPage from './customCopyPage';
import customPage from './customPage';
import note from '../../../../../components/mcenter/components/common/note';

export default {
    components: {
        tplHeader48: () => import(/* webpackChunkName: 'wsTplHeader48' */'../customizeHome/48/tplHeader'),
        tplFooter48: () => import(/* webpackChunkName: 'wsTplFooter48' */'../customizeHome/48/tplFooter'),
        tplHeader50: () => import(/* webpackChunkName: 'wsTplHeader50' */'../customizeHome/50/tplHeader'),
        tplFooter50: () => import(/* webpackChunkName: 'wsTplFooter50' */'../customizeHome/50/tplFooter'),
        tplHeader500000: () => import(/* webpackChunkName: 'wsTplHeader500000' */'../customizeHome/500000/tplHeader'),
        tplFooter500000: () => import(/* webpackChunkName: 'wsTplFooter500000' */'../customizeHome/500000/tplFooter'),
        tplBody,
        customCopyPage,
        customPage,
        note
    },
    data() {
        return {
            customPageList: {
                // 測試站
                500000: {
                    copyPage: {
                        30780: 'accountOpen',
                        30781: 'deposite',
                        30782: 'withdarwal',
                        30783: 'transfer',
                        30784: 'preferential',
                        30785: 'browser',
                        30786: 'betting',
                        30787: 'hijacking',
                        30788: 'lottery',
                        30789: 'esports',
                        30790: 'sports',
                        30791: 'live',
                        30792: 'other',
                        30793: 'responsibility',
                        30794: 'about',
                        30795: 'terms',
                        30796: 'plan',
                        30797: 'privacy',
                        30798: 'contact',
                        35207: 'cgPay'
                    },
                    customPage: {
                        30735: 'live',
                        30764: 'lottery',
                        31310: 'app',
                        31311: 'memLogin',
                        31312: 'join',
                        31313: 'forgetPw',
                        32110: 'sports',
                        32257: 'esports',
                        32371: 'promotions',
                        32422: 'agent',
                        32423: 'agentLogin',
                        32424: 'agentJoin',
                        32425: 'vip',
                        37762: 'resetPw'
                    }
                },
                // 正式站正式環境
                48: {
                    copyPage: {
                        10461: 'accountOpen', // 開戶
                        10462: 'deposite', // 存款
                        10464: 'withdarwal', // 提款
                        10465: 'transfer', // 轉帳
                        10466: 'preferential', // 優惠規則
                        10467: 'browser', // 瀏覽器格式
                        10468: 'betting', // 體育投注教程
                        10469: 'hijacking', // 防劫持教程
                        10470: 'lottery', // 彩票問題
                        10471: 'esports', // 電子競技
                        10472: 'sports', // 體育問題
                        10473: 'live', // 真人問題
                        10474: 'other', // 其他問題
                        10475: 'responsibility', // 博彩責任
                        10476: 'about', // 關於我們
                        10477: 'terms', // 規則與條款
                        10478: 'plan', // 合營計畫
                        10480: 'privacy', // 隱私保護規則
                        10479: 'contact', // 在線客服
                        10940: 'cgPay' // CG Pay錢包
                    },
                    customPage: {
                        10145: 'live', // 視訊
                        10173: 'lottery', // 彩票
                        10481: 'app', // 手機app
                        10482: 'memLogin', // 會員登入
                        10483: 'join', // 加入會員
                        10484: 'forgetPw', // 忘記密碼
                        10485: 'sports', // 盈豐體育
                        10487: 'esports', // 電子競技
                        10488: 'promotions', // 優惠活動
                        10489: 'agent', // 合營計畫
                        10490: 'agentLogin', // 代理登入
                        10491: 'agentJoin', // 代理註冊
                        10492: 'vip',
                        12340: 'resetPw'
                    }
                },
                50: {
                    copyPage: {
                        10494: 'accountOpen',
                        10495: 'deposite',
                        10496: 'withdarwal',
                        10497: 'transfer',
                        10498: 'preferential',
                        10499: 'browser',
                        10500: 'betting',
                        10501: 'hijacking',
                        10502: 'lottery',
                        10503: 'esports',
                        10504: 'sports',
                        10505: 'live',
                        10506: 'other',
                        10507: 'responsibility',
                        10508: 'about',
                        10509: 'terms',
                        10510: 'plan',
                        10511: 'privacy',
                        10512: 'contact',
                        10939: 'cgPay'
                    },
                    customPage: {
                        10325: 'live',
                        10353: 'lottery',
                        10513: 'app',
                        10514: 'memLogin',
                        10515: 'join',
                        10516: 'forgetPw',
                        10517: 'sports',
                        10520: 'esports',
                        10521: 'promotions',
                        10522: 'agent',
                        10523: 'agentLogin',
                        10524: 'agentJoin',
                        10525: 'vip',
                        12339: 'resetPw'
                    }
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            isWebview: 'getIsWebview',
            sidebarWidth: 'getSidebarWidth',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            nowpage: 'getNowpage',
            popData: 'getPopData',
            popType: 'getPopType',
            loginStatus: 'getLoginStatus'
        }),
        mainClass() {
            return [
                'main-container',
                `tpl-${this.webInfo.model}`,
                `page-${this.nowpage.toString()}`,
                { 'is-login': this.loginStatus }
            ];
        },
        isCustomCopyPage() {
            if (this.nowpage === 'mcenter' || this.nowpage === 'promotion') {
                return false;
            }

            if (Object.keys(this.customPageList[this.webInfo.alias].copyPage).includes(this.nowpage.toString())) {
                return true;
            }

            return Number.isNaN(+this.nowpage);
        },
        isCustomPage() {
            if (this.nowpage === 'mcenter' || this.nowpage === 'promotion') {
                return false;
            }

            if (Object.keys(this.customPageList[this.webInfo.alias].customPage).includes(this.nowpage.toString())) {
                return true;
            }

            return Number.isNaN(+this.nowpage);
        },
        copyPageName() {
            return this.customPageList[this.webInfo.alias].copyPage[this.nowpage] || 'page';
        },
        customPageName() {
            return this.customPageList[this.webInfo.alias].customPage[this.nowpage] || 'page';
        },
        isShow() {
            if ((this.nowpage === 31311 || this.nowpage === 31312 || this.nowpage === 32422 || this.nowpage === 32423 || this.nowpage === 32424)
                || (this.nowpage === 10482 || this.nowpage === 10483 || this.nowpage === 10489 || this.nowpage === 10490 || this.nowpage === 10491)
                || (this.nowpage === 10514 || this.nowpage === 10515 || this.nowpage === 10522 || this.nowpage === 10523 || this.nowpage === 10524)
            ) {
                return false;
            }

            return true;
        },
        customHallStyle() {
            if (this.webInfo.alias === '500000' || this.webInfo.alias === '48') {
                if (this.nowpage === 'casino') {
                    return 'casino';
                }

                if (this.nowpage === 'card') {
                    return 'card';
                }
            }

            return false;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss"></style>
<style lang="scss" module>
@keyframes moveUp {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-30px);
    }

    100% {
        transform: translateY(0);
    }
}

@keyframes moveDown {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(30px);
    }

    100% {
        transform: translateY(0);
    }
}

@keyframes slideRight {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(0);
    }
}

@keyframes slideLeft {
    0% {
        transform: translateX(200%);
    }

    100% {
        transform: translateX(0);
    }
}

@keyframes slideTop {
    0% {
        transform: translateY(-100%);
    }

    100% {
        transform: translateX(0);
    }
}

.hall-wrap {
    padding-top: 120px;
    background-color: #FFF;
    overflow: hidden;
}

.body-wrap {
    position: relative;
    padding: 0 !important;
    top: -126px;
    z-index: 2;
}

.game-wrap {
    position: relative;
    height: 553px;
}

.casino-wrap {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 1;
    width: 1650px;
    height: 553px;
    margin-left: -825px;
    background: url('/static/image/tpl/17/casino/img_turntable.png') 65% 50% no-repeat;
}

.casino-title {
    position: absolute;
    top: 134px;
    left: 34%;
    animation: slideTop 1s .8s both;

}

.casino-people-left {
    position: absolute;
    bottom: 74px;
    animation: slideRight 1s;
}

.casino-people-right {
    position: absolute;
    right: 0;
    bottom: 10px;
    animation: slideLeft 1s;
}

.casino-crown-left {
    position: absolute;
    top: 55px;
    left: 143px;
    animation: moveUp 4s .3s infinite both;
}

.casino-qi-left {
    position: absolute;
    top: 265px;
    left: 440px;
    animation: moveDown 4s .3s infinite both;
}

.casino-book-right {
    position: absolute;
    top: 259px;
    right: 368px;
    animation: moveUp 4s .3s infinite both;
}

.casino-green-right {
    position: absolute;
    top: 13px;
    right: 121px;
    animation: moveDown 4s .3s infinite both;
}

.card-wrap {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 1;
    width: 1335px;
    height: 553px;
    margin-left: -667.5px;
    background: url('/static/image/tpl/17/card/img_turntable.png') 50% 50% no-repeat;
}

.card-people-left {
    position: absolute;
    left: 26px;
    bottom: 16px;
    animation: slideRight 1s;
}

.card-people-right {
    position: absolute;
    right: 46px;
    animation: slideLeft 1s;
}

.card-chip-left {
    position: absolute;
    top: 37%;
    animation: moveUp 4s .3s infinite both;
}

.card-coin-right{
    position: absolute;
    right: 36px;
    animation: moveDown 4s .3s infinite both;
}
</style>
