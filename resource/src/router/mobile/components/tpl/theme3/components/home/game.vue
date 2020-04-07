<template>
    <div :ref="$style.game" :class="[$style.game, 'clearfix']">
        <div :class="$style['hall-list-btn']">
            <div :class="[$style.menus, 'clearfix']">
                <!-- 遊戲分類頁籤 -->
                <div
                    key="esports"
                    :class="[{ [$style.normal]: 'wsports' !== currentType, [$style.active]: 'wsports' === currentType }, 'clearfix']"
                    @click="()=>{
                        setCookie({ key: 'type', value: 'wsports' });
                        cookie = 'wsports';
                        isNext = false;
                        scrolled = false;
                    }"
                >
                    <img v-if="'wsports' !== currentType" :src="$getCdnPath(`/static/image/mobile/tpl/theme3/home/menu_esports.png`)" />
                    <img v-else :src="$getCdnPath(`/static/image/mobile/tpl/theme3/home/menu_esports_active.png`)" />
                    <span :class="{ [$style.wsports]: sportBtnWidth < 114 }">{{ $text('S_ESPORTS_THEME3', '威尼斯人体育') }}</span>
                </div>
                <div
                    v-for="menu in menus"
                    :key="menu.vendor"
                    :class="[{ [$style.normal]: menu.vendor !== currentType, [$style.active]: menu.vendor === currentType }, 'clearfix']"
                    @click="changeMenu(menu)"
                >
                    <img v-if="menu.vendor !== currentType" :src="$getCdnPath(`/static/image/mobile/tpl/theme3/home/menu_${menu.vendor}.png`)" />
                    <img v-else :src="$getCdnPath(`/static/image/mobile/tpl/theme3/home/menu_${menu.vendor}_active.png`)" />
                    <span>{{ $text(menu.name, menu.initName) }}</span>
                </div>
            </div>
        </div>
        <transition
            :enter-class="isNext ? $style['next-enter'] : $style['last-enter']"
            :enter-active-class="isNext ? $style['next-enter-active'] : $style['last-enter-active']"
            :leave-class="isNext ? $style['next-leave'] : $style['last-leave']"
            :name="isNext ? 'next': 'last'"
        >
            <div
                :key="`page-${$cookie.get('HOME_GAME_TYPE')}`"
                :class="$style['hall-list']"
                @touchstart="(event) => touchstart(event)"
                @touchend="(event) => touchend(event)"
                @scroll="(event) => scroll(event)"
            >
                <div id="gameList" :class="[$style[model], 'clearfix']">
                    <!-- 遊戲 -->
                    <vendor
                        v-for="(info, index) in vendors"
                        :key="info.vendor"
                        :type="currentType"
                        :model="model"
                        :info="info"
                        :index="index"
                        :length="vendors.length"
                    />
                </div>
                <div v-if="$cookie.get('HOME_GAME_TYPE') === 'esports' || $cookie.get('HOME_GAME_TYPE') === 'wsports'" :class="$style['coming-soon-wrap']">
                    <img
                        v-if="$cookie.get('HOME_GAME_TYPE') === 'wsports'"
                        :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/card/wsports/sportsball.png')"
                        @click="onClick"
                    />
                    <div v-if="gameData.csc.switch !== 'Y'" :class="$style['coming-soon']">
                        <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/coming_soon.png')" />
                    </div>
                </div>
            </div>
        </transition>
        <div v-if="isShow" :class="$style['pop-wrap']">
            <div :class="$style['pop-bg']" />
            <div :class="$style['pop-container']">
                <div :class="$style['pop-top']">
                    <h3>温馨提示</h3>
                    <p>请选择打开方式</p>
                </div>
                <div :class="[$style['pop-bottom'], 'clearfix']">
                    <button
                        :class="$style['pop-btn']"
                        @click="onClick('wap')"
                    >
                        WAP
                    </button>
                    <button
                        :class="$style['pop-btn']"
                        @click="onClick('app')"
                    >
                        APP
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import toUpper from 'lodash/toUpper';
import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import { API_GET_VENDOR, API_QRCODE } from '@/config/api';
import ajax from '@/lib/ajax';
import vendor from './vendor';

export default {
    components: {
        vendor
    },
    props: {
        toReset: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            winWidth: window.innerWidth,
            type: this.$cookie.get('HOME_GAME_TYPE'),
            model: this.$cookie.get('HOME_GAME_MODEL') || 'card',
            games: {
                fishArea: []
            },
            categoryList: [
                // 棋牌
                {
                    kind: 5,
                    vendor: 'card',
                    name: 'S_THEME3_CARD',
                    initName: '棋牌游戏'
                },
                // 視訊
                {
                    kind: 2,
                    vendor: 'live',
                    name: 'S_THEME3_LIVE',
                    initName: '真人娱乐'
                },
                // 彩票
                {
                    kind: 4,
                    vendor: 'lottery',
                    name: 'S_THEME3_LOTTERY',
                    initName: '彩票投注'
                },
                // IM電競
                {
                    kind: 1,
                    vendor: 'tgp',
                    name: 'S_TGP',
                    initName: 'IM电竞'
                },
                // 電子
                {
                    kind: 3,
                    vendor: 'casino',
                    name: 'S_CASINO_2',
                    initName: '电子类游戏'
                },
                // 麻將
                {
                    kind: 6,
                    vendor: 'mahjong',
                    name: 'S_MAHJONG_GAMIMG',
                    initName: '麻将馆'
                }
            ],
            // 上下滑動是否開放
            isTop: true,
            isBottom: true,
            pointPosition: {
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0
            },
            gameListHeight: 0,
            noScroll: false,
            isNext: true,
            scrolled: false,
            cookie: this.$cookie.get('HOME_GAME_TYPE'),
            order: [],
            gameTouching: false,
            isShow: false,
            sportBtnWidth: 0
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            curLang: 'getCurLang',
            gameData: 'getGameData',
            loginStatus: 'getLoginStatus'

        }),
        currentType() {
            return this.type || this.menus[0].vendor;
        },
        /**
         * 取得遊戲分類資訊
         * @method menus
         * @returns {array} 遊戲分類資訊
         */
        menus() {
            return ['card', 'live', 'lottery', 'tgp', 'casino', 'mahjong']
                .map((value) => find(this.categoryList, (items) => items.vendor === value))
                .filter((items) => this.games[items.vendor] && this.games[items.vendor].length > 0);
        },
        /**
         * 取得當前遊戲分類裡的平台資訊
         * @method vendors
         * @returns {array} 平台資訊
         */
        vendors() {
            if (this.currentType === 'casino') {
                return [...this.games[this.currentType], this.games.fishArea[0]];
            }

            return this.games[this.currentType] || [];
        },
        /**
         * 取得 Continue
         * @method continues
         * @returns {number} Continue
         */
        continues() {
            if (this.model === 'card') {
                return 0;
            }

            const { length } = this.vendors;

            if (this.winWidth < 480) {
                return 4 - (length % 4);
            }

            if (this.winWidth < 768) {
                return 6 - (length % 6);
            }

            return 7 - (length % 7);
        }
    },
    watch: {
        toReset() {
            this.setHeight();
        },
        cookie() {
            this.isTop = true;
            this.isBottom = false;
            setTimeout(() => {
                this.setHeight();

                // 判斷遊戲區塊是否有捲軸
                this.setScrollStatus();
            }, 100);
        }
    },
    created() {
        const categoryChart = keyBy(this.categoryList, 'kind');

        // 取得各遊戲分類裡的平台資訊
        Object.keys(this.gameData).forEach((key) => {
            const gameItem = this.gameData[key];
            const gameVendor = categoryChart[gameItem.kind].vendor;

            // 因應MG2電子上線, 先將MG電子隱藏
            if (gameItem.kind === 3 && gameItem.vendor === 'mg') {
                return;
            }

            // 隱藏客製體育
            if (gameItem.kind === 1 && gameItem.vendor === 'csc') {
                return;
            }

            if (!this.games[gameVendor]) {
                this.games[gameVendor] = [];
            }
            if (gameItem.switch === 'Y') {
                // IM電競特例
                if (key === 'tgp') {
                    this.games.tgp = [{
                        ...gameItem,
                        path: `/mobile/sports/${gameItem.vendor}`,
                        activity: false,
                        hot: false,
                        new: false
                    }];
                    return;
                }

                this.games[gameVendor].push({
                    ...gameItem,
                    path: `/mobile/${gameVendor}/${gameItem.vendor}`,
                    activity: false,
                    hot: false,
                    new: false
                });
            }
        });
        this.games.fishArea.push({
            vendor: 'fisharea',
            kind: 3,
            alias: this.$text('S_FISHAREA_THEME3', '捕鱼电玩'),
            path: '/mobile/fisharea',
            activity: false,
            hot: false,
            new: false
        });
    },
    mounted() {
        // 組成遊戲區塊列表順序
        const initArray = ['wsports'];
        const menulList = this.menus.map((val) => val.vendor);
        const order = initArray.concat(menulList);

        this.order = order; // 供 touchend 切換使用
        this.setCookie({ key: 'type', value: order[0] });

        $(window).resize(() => {
            this.setHeight();

            // 設定威尼斯人按鈕文字排列
            this.sportBtnWidth = $(`.${this.$style.menu}`).width();
        });
        setTimeout(() => {
            this.setHeight();
        }, 200);
        document.body.addEventListener('touchmove', (e) => {
            this.pullControl(e);
        }, { passive: false });
    },
    beforeDestroy() {
        $(window).off('resize', this.setHeight);
        document.body.removeEventListener('touchmove', this.pullControl);
    },
    methods: {
        /**
         * 設定 Cookie
         * @method setCookie
         * @param {string} key - 設定的目標
         * @param {string} value - 值
         */
        setCookie({ key, value }) {
            this[key] = value;
            this.$cookie.set(`HOME_GAME_${toUpper(key)}`, value, 30);
        },
        setHeight() {
            const screenHeight = document.documentElement.clientHeight;
            const sliderHeight = $('.swiper-wrapper').height() || 0;
            const appDownload = this.$cookie.get('APP_DOWNLOAD_STATUS') === 'N' ? 0 : 57;
            const gameListHeight = screenHeight - appDownload - sliderHeight - 31 - 80 - 9 - 45; // 扣掉 => 輪播＋最新消息＋登入資訊＋遊戲列表margin-top＋footer
            const btnListHeight = $(`.${this.$style['hall-list-btn']}`).height();
            const setHeight = btnListHeight > gameListHeight ? btnListHeight : gameListHeight;

            $(`.${this.$style['hall-list']}`).css({ height: setHeight, 'overflow-y': 'scroll' });
            this.gameListHeight = setHeight;
        },
        changeMenu(menuItem) {
            this.setCookie({ key: 'type', value: menuItem.vendor });
            this.cookie = menuItem.vendor;
            this.isNext = false;
            this.scrolled = false;
        },
        touchstart(e) {
            // 設定滑鼠按下座標
            this.$set(this.pointPosition, 'startX', e.touches[0].clientX);
            this.$set(this.pointPosition, 'startY', e.touches[0].clientY);

            // 初始化是否捲動
            this.scrolled = false;

            // 正在觸發遊戲區塊 touch event，鎖定ios瀏覽器拖拉參數，防止還沒觸發遊戲區塊就鎖定事件
            this.gameTouching = true;
        },
        touchend(e) {
            // 設定滑鼠放開座標
            this.$set(this.pointPosition, 'endX', e.changedTouches[0].clientX);
            this.$set(this.pointPosition, 'endY', e.changedTouches[0].clientY);

            //  解除 ios  瀏覽器預設拖拉鎖定
            this.gameTouching = false;

            // 防止捲動時切換
            if (this.scrolled) {
                return;
            }

            // 宣告變數
            const page = this.$cookie.get('HOME_GAME_TYPE');
            const { order } = this;
            const index = order.indexOf(page);
            const last = (index <= 0) ? order[order.length - 1] : order[index - 1];
            const next = (index >= order.length - 1) ? order[0] : order[index + 1];
            const moveY = this.pointPosition.endY - this.pointPosition.startY;

            // 切換上一個頁籤
            if ((this.noScroll || this.isTop) && moveY >= 80) {
                this.setCookie({ key: 'type', value: last });
                // 監聽切換頁面參數
                this.cookie = last;
                // 設定初始化
                this.isTop = true;
                this.isBottom = false;
                this.noScroll = false;
                // 動畫參數
                this.isNext = false;
            }

            // 切換下一個頁籤
            if ((this.noScroll || this.isBottom) && moveY <= -80) {
                this.setCookie({ key: 'type', value: next });
                // 監聽切換頁面參數
                this.cookie = next;
                // 設定初始化
                this.isTop = true;
                this.isBottom = false;
                this.noScroll = false;
                // 動畫參數
                this.isNext = true;
            }
        },
        scroll(e) {
            const event = e.target;
            const { scrollTop } = event;
            const { clientHeight } = event;
            const { scrollHeight } = event;

            // 判斷置頂
            if (scrollTop > 0) {
                this.isTop = false;
            } else {
                this.isTop = true;
            }

            // 判斷置底，scrollHeight - 1 為解決橫屏 scrollTop 誤差
            if (scrollTop + clientHeight < scrollHeight - 1) {
                this.isBottom = false;
            } else {
                this.isBottom = true;
            }

            // 判斷捲軸已經到底或是置頂後，再拉一次進行切換
            if ((scrollTop > scrollHeight - clientHeight) || scrollTop < 0) {
                return;
            }

            // 捲動過參數
            this.scrolled = true;
        },
        onClick(method) {
            let newWindow = '';
            // 辨別裝置是否為ios寰宇瀏覽器
            const isUBMobile = navigator.userAgent.match(/UBiOS/) !== null && navigator.userAgent.match(/iPhone/) !== null;

            if (!this.loginStatus) {
                if (this.gameData.csc.switch === 'Y') {
                    this.$router.push('/mobile/login');
                }
                return;
            }

            if (!this.isShow) {
                this.isShow = true;
                return;
            }

            if (!isUBMobile) {
                newWindow = window.open('');
            }


            if (method === 'wap') {
                ajax({
                    method: 'get',
                    url: `${API_GET_VENDOR}/csc/game/launch`,
                    params: { kind: 1 },
                    errorAlert: isUBMobile,
                    success: ({ result, ret }) => {
                        this.isShow = false;
                        if (result !== 'ok') {
                            if (!isUBMobile) {
                                newWindow.close();
                            }
                            return;
                        }

                        if (!isUBMobile) {
                            newWindow.location.href = ret.url;
                            return;
                        }

                        window.open(ret.url);
                    },
                    fail: (error) => {
                        this.isShow = false;
                        if (!isUBMobile) {
                            newWindow.alert(`${error.data.msg} ${error.data.code ? `(${error.data.code})` : ''}`);
                            newWindow.close();
                        }
                    }
                });
                return;
            }


            if (method === 'app') {
                ajax({
                    method: 'post',
                    url: API_QRCODE,
                    params: { path: 'mobileBet' },
                    errorAlert: isUBMobile,
                    success: ({ result, ret }) => {
                        this.isShow = false;
                        if (result !== 'ok') {
                            if (!isUBMobile) {
                                newWindow.close();
                            }
                            return;
                        }

                        if (!isUBMobile) {
                            newWindow.location.href = ret.url;
                            return;
                        }

                        window.open(ret.url);
                    },
                    fail: (error) => {
                        this.isShow = false;
                        if (!isUBMobile) {
                            newWindow.alert(`${error.data.msg} ${error.data.code ? `(${error.data.code})` : ''}`);
                            newWindow.close();
                        }
                    }
                });
            }
        },
        setScrollStatus() {
            // 宣告變數
            const contentHeight = $('#gameList').height() || $(`.${this.$style['coming-soon-wrap']}`).height();

            // 判斷是否有捲軸 (外層 > 內層)
            if (this.gameListHeight > contentHeight) {
                this.noScroll = true;
                return;
            }

            this.noScroll = false;
        },
        pullControl(e) {
            const moveY = e.touches[0].clientY - this.pointPosition.startY;

            if (
                (this.noScroll
                || (!this.noScroll && this.isTop && moveY > 0)
                || (!this.noScroll && this.isBottom && moveY < 0)
                ) && e.cancelable && this.gameTouching
            ) {
                e.preventDefault();
            }
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.game {
    margin: 9px auto 0;
    width: 94%;
    .hall-list-btn,
    .hall-list {
        float: left;
    }
    .hall-list-btn {
        width: 32%;
        .menus {
            position: relative;
            font-size: 14px;
            img,
            span {
                float: left;
            }
            img {
                margin: 8px 0 0 9px;
            }
            span {
                margin-left: 5px;
                width: calc(100% - 9px - 27px - 5px);
                height: 44px;
                line-height: 44px;
                font-size: 12px;
                text-align: left;
                overflow: hidden;
            }

            .wsports {
                margin-top: 9px;
                height: 28px;
                line-height: 14px;
            }
        }
    }
    .hall-list {
        margin-left: 3px;
        width: 67%;
        -webkit-overflow-scrolling: touch;

        .coming-soon-wrap {
            position: relative;
            width: 100%;

            img {
                width: 100%;
            }
        }

        .coming-soon {
            position: absolute;
            top: 0;
            height: 100%;
            width: 100%;
            text-align: center;
            background: rgba(0, 0, 0, 0.60);

            >img {
                width: 137px;
                margin-top: 57px;
            }
        }
    }
}
.menu {
    height: 44px;
    margin-bottom: 4px;
    border-radius: 8px;
    text-align: center;

    > img {
        margin: 0 auto;
        width: 27px;
        height: 27px;
        display: block;
    }
}

.normal {
    composes: menu;
    background: url('/static/image/mobile/tpl/theme3/home/list_btn.png') 0 0 no-repeat;
    background-size: 100% 100%;
    color: #9C6E54;
}

.active {
    composes: menu;
    background: url('/static/image/mobile/tpl/theme3/home/list_btn_hover.png') 0 0 no-repeat;
    background-size: 100% 100%;
    color: #F8F1EB;
}

.button {
    position: absolute;
    top: 0;
    right: 0;
    width: 36px;
    height: 36px;
    background-color: #313131;

    > img {
        display: block;
        width: 18px;
        height: 18px;
        margin: 9px auto 0;
    }
}
.continue {
    float: left;
    width: 25%;
    margin-bottom: 20px;

    > img {
        display: block;
        width: 49px;
        margin: 0 auto;
    }
}

.pop-bg {
    width: 100%;
    min-height: 850px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.3);
}

.pop-container {
    width: 300px;
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 1000;
    background: #FFF;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    overflow: hidden;
}

.pop-top {
    padding: 20px 0;
    border-bottom: 1px solid #CCC;

    h3,
    p {
        text-align: center;
    }

    p {
        color: #444;
    }
}

.pop-btn {
    float: left;
    width: 50%;
    padding: 20px 0;
    text-align: center;
    font-size: 18px;
    background: #FFF;
    border: none;
    outline: 0;

    &:first-child {
        border-right: 1px solid #CCC;
    }

    &:hover {
        color: #E5D5C5;
    }
}

@media screen and (min-width: $phone) {
    .icon {
        margin: 20px 15px 0;
        padding: 0 1.1%;
    }

    .continue {
        width: 16.3%;
    }
}

@media screen and (min-width: $pad) {
    .icon {
        margin: 20px 20px 0;
        padding: 0 1%;
    }

    .continue {
        width: 14%;
    }
}

// 遊戲區塊動畫
.last-enter-active {
    animation: last 0.15s;
}

.next-enter-active {
    animation: next 0.15s;
}
.last-enter, .last-leave,
.next-enter, .next-leave {
    opacity: 0;
}

@keyframes next {
    0% {
        transform: translateY(3%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes last {
    0% {
        transform: translateY(-3%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
