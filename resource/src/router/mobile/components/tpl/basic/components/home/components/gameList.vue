<template>
    <div id="game-list-wrap" class="game-list-wrap clearfix">
        <template v-if="games.length">
            <div
                v-for="game in games"
                :key="`game-list-${game.kind}-${game.vendor}-${game.code || ''}`"
                class="game-list"
                @click="play(game.vendor, game.kind, game.code)"
            >
                <div :class="getItemClass(game.kind)">
                    <!-- 分類icon -->
                    <img
                        v-if="getImage"
                        :src="getImage(game.vendor, game.kind, game.code, false)"
                        class="icon-pic"
                    />
                    <img
                        v-if="getImage"
                        :src="getImage(game.vendor, game.kind, game.code, true)"
                        class="icon-pic-active"
                    />
                    <!-- Hot -->
                    <img v-if="game.hot" :src="$getCdnPath('/static/image/mobile/icon_hot.png')" />
                    <!-- New -->
                    <img v-if="game.new" :src="$getCdnPath('/static/image/mobile/icon_new.png')" />
                </div>
                <p>{{ ['recent', 'favorite'].includes(curType) ? game.name : game.alias }}</p>
            </div>
        </template>
        <div v-else class="empty-box">
            <div class="empty-msg">{{ $t('S_NO_GAME') }}</div>
        </div>
        <!-- 敬請期待 -->
        <template v-if="curType !== 'recent' && curType !== 'favorite'">
            <div
                v-for="index in stayTunedNum"
                :key="`continues-list-${index}`"
                class="game-list continue"
            >
                <div
                    :style="{ 'background-image': `url(${$getCdnPath('/static/image/mobile/icon_none.png')})` }"
                    class="image-icon is-single"
                />
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import keyBy from 'lodash/keyBy';
import categoryList from '@/config/gameCategory';
import openGame from '@/lib/open_game';

export default {
    props: {
        games: {
            type: Array,
            required: true
        },
        curType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            windowWidth: 0
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            loginStatus: 'getLoginStatus'
        }),
        stayTunedNum() {
            let columnNum;
            switch (true) {
                case this.windowWidth < 480:
                    columnNum = 4;
                    break;
                case this.windowWidth < 768:
                    columnNum = 6;
                    break;
                default:
                    columnNum = 7;
            }

            if (this.games.length % columnNum === 0) {
                return 0;
            }
            return columnNum - (this.games.length % columnNum);
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.setWidth);
            this.setWidth();
        });
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.setWidth);
    },
    methods: {
        /**
         * 設定 width
         * @method setWidth
         */
        setWidth() {
            this.windowWidth = window.innerWidth;
        },
        /**
         * 取得圖片路徑
         * @method getImage
         * @param {string} vendor - 遊戲供應商名稱
         * @param {number} kind - 遊戲分類代號
         * @param {string} code - 遊戲代號
         */
        getImage(vendor, kind, code, isActive = false) {
            let image = this.$getCdnPath(`/static/image/mobile/platform/icon/blue/${this.curType}/${vendor}${isActive ? '_active' : ''}.png`);
            if (this.curType === 'recent' || this.curType === 'favorite') {
                switch (kind) {
                    case 3:
                        image = this.$getCdnPath(`${this.cdnDomain}/image/casino/${vendor}/Game_${code}.png`);
                        break;
                    case 5:
                        image = this.$getCdnPath(`${this.cdnDomain}/image/card/${vendor}/Game_${code}.png`);
                        break;
                    case 6:
                        image = this.$getCdnPath(`${this.cdnDomain}/image/mahjong/${vendor}/Game_${code}.png`);
                        break;
                    default:
                        image = this.$getCdnPath(`/static/image/mobile/platform/icon/blue/${keyBy(categoryList, 'kind')[kind].vendor}/${vendor}${isActive ? '_active' : ''}.png`);
                }
            }
            return image;
        },
        /**
         * 取得項目 class 名稱
         * @method getItemClass
         * @param { number } gameKind - 遊戲分類代號
         */
        getItemClass(gameKind) {
            return {
                'image-icon': true,
                'is-single': ['recent', 'favorite'].includes(this.curType) && [3, 5].includes(gameKind)
            };
        },
        /**
         * 開啟遊戲
         * @method play
         * @param {string} vendor - 遊戲供應商名稱
         * @param {number} kind - 遊戲分類代號
         * @param {string} code - 遊戲代號
         */
        play(vendor, kind, code) {
            const hasHall = [3, 5, 6];

            // 有遊戲大廳的遊戲
            if (hasHall.includes(kind) && (code === '' || typeof code === 'undefined')) {
                const path = vendor === 'activity' ? 'all/activity' : vendor;

                switch (kind) {
                    case 3:
                        this.$router.push(`/mobile/casino/${path}`);
                        break;
                    case 5:
                        this.$router.push(`/mobile/card/${path}`);
                        break;
                    case 6:
                        this.$router.push(`/mobile/mahjong/${path}`);
                        break;
                    default:
                }
                return;
            }

            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            openGame({ vendor, kind, code });
        }
    }
};
</script>

<style src="../css/gameList.scss" lang="scss" scoped />
