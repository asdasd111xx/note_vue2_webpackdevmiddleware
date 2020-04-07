<template>
    <div :class="[`style-${theme}`, 'game-item']" @click="onEnter(gameInfo)">
        <!-- vendor 標示 -->
        <div class="vendor-name">{{ getVendorName }}</div>
        <!-- 遊戲圖片區塊 -->
        <div class="game-box-wrap">
            <!-- 行動裝置點擊圖片開啟遊戲 -->
            <div class="game-box clearfix">
                <img v-lazy="getImg(gameInfo)" />
            </div>
            <div class="mask" />
        </div>
        <!-- 遊戲標題 -->
        <div :title="gameInfo.name" class="game-title">{{ gameInfo.name }}</div>
        <!-- 最愛 -->
        <div
            v-if="loginStatus"
            :class="['icon-star', { 'is-favorite': checkFavorite(gameInfo) }]"
            @click.stop="toggleFavorite(gameInfo)"
        />
        <!-- PC 版點擊按鈕開啟遊戲 -->
        <div class="btn-enter">{{ getBtnName(gameInfo) }}</div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import game from '@/api/game';
import openGame from '@/lib/open_game';
import isMobile from '@/lib/is_mobile';

/**
 * 遊戲列表區塊
 * @module element/gameList/gameItem
 * @param {string} theme - 佈局
 * @param {object} gameInfo - 遊戲資料
 */
export default {
    props: {
        theme: {
            type: String,
            required: true
        },
        gameInfo: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            favoriteGame: 'getFavoriteGame',
            loginStatus: 'getLoginStatus'
        }),
        /**
         * 重組最愛列表 List
         * @method favoriteList
         * @returns {object} 最愛列表
         */
        favoriteList() {
            const result = {};

            this.favoriteGame.forEach((info) => {
                if (!result[info.vendor]) {
                    result[info.vendor] = {};
                }
                result[info.vendor][info.code] = info;
            });

            return result;
        },
        getVendorName() {
            const vendor = this.gameInfo.vendor.split('_')[0];
            const transTextList = {
                rt: 'sbg',
                lg: 'xbb',
                mg2: 'mg'
            };

            const resultText = transTextList[vendor] ? transTextList[vendor] : vendor;
            return resultText.toUpperCase();
        }
    },
    methods: {
        ...mapActions([
            'actionSetFavoriteGame'
        ]),
        /**
         * 取得圖片路徑
         * @param {object} gameInfo - 遊戲資訊
         * @method getImg
        */
        getImg(gameInfo) {
            // 遊戲圖片資料夾對應表
            const info = {
                3: 'casino',
                5: 'card'
            };

            return {
                src: this.$getCdnPath(`${this.cdnDomain}/image/${info[gameInfo.kind]}/${gameInfo.vendor}/Game_${gameInfo.code}.png`),
                error: this.$getCdnPath('/static/image/game_loading_s.gif'),
                loading: this.$getCdnPath('/static/image/game_loading_s.gif')
            };
        },
        /**
         * 取得遊戲按鈕文字
         * @param {object} gameInfo - 遊戲資訊
         * @method getBtnName
        */
        getBtnName(gameInfo) {
            let name = 'S_PLAY_NOW';
            const trialKey = isMobile() ? 'mobile_trial' : 'trial';

            if (this.loginStatus) {
                return this.$i18n.t(name);
            }

            if (gameInfo[trialKey]) {
                name = 'S_FREE_GAME';
            }

            return this.$i18n.t(name);
        },
        /**
         * 點擊立即遊戲
         * @param {object} gameInfo - 遊戲資訊
         * @param {string} gameInfo.vendor - 遊戲供應商名稱
         * @param {number} gameInfo.kind - 遊戲分類代號
         * @param {string} gameInfo.code - 遊戲代號
         * @param {boolean} gameInfo.trial - 是否有遊戲試玩
         * @param {boolean} gameInfo.mobile_trial - 是否有手機遊戲試玩
         * @method onEnter
        */
        /* eslint-disable camelcase */
        onEnter({
            vendor, kind, code, trial = false, mobile_trial = false
        }) {
            if (this.isBackEnd) {
                return;
            }
            if (!this.loginStatus && !(isMobile() ? mobile_trial : trial)) {
                alert(this.$i18n.t('S_LOGIN_TIPS'));
                return;
            }
            openGame({
                vendor,
                kind,
                code
            });
        },
        /* eslint-enable camelcase */
        /**
         * 檢查是否為最愛
         * @param {object} gameInfo - 遊戲資訊
         * @param {string} gameInfo.vendor - 遊戲供應商名稱
         * @param {string} gameInfo.code - 遊戲代號
         * @method checkFavorite
         */
        checkFavorite({ vendor, code }) {
            try {
                return !!this.favoriteList[vendor][code];
            } catch (err) {
                return false;
            }
        },
        /**
         * 切換最愛遊戲
         * @param {object} gameInfo - 遊戲資訊
         * @method toggleFavorite
         */
        toggleFavorite(gameInfo) {
            if (this.isBackEnd) {
                return;
            }
            const actionType = this.checkFavorite(gameInfo) ? 'deleteFavoriteGame' : 'setFavoriteGame';

            game[actionType]({
                params: {
                    vendor: gameInfo.vendor,
                    kind: gameInfo.kind,
                    code: gameInfo.code
                }
            }).then(() => {
                this.actionSetFavoriteGame();
            });
        }
    }
};
</script>

<style lang="scss" src="../css/gameItem/index.scss" scoped></style>
