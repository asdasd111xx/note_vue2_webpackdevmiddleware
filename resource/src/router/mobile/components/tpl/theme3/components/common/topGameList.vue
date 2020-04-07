<template>
    <div :class="$style['game-list']">
        <div
            v-for="info in allGames"
            :key="`category-list-${info.vendor}`"
            :ref="info.vendor"
            :class="$style['category-list']"
        >
            <div :class="$style['title-wrap']">
                <div :class="$style['title-line']" />
                <div :class="$style.title">{{ $text(info.name) }}</div>
            </div>
            <div class="item-wrap clearfix">
                <div
                    v-for="(item, index) in info.subVendor"
                    :key="`list-item-${item.vendor}-${item.kind}`"
                    :class="[$style.link, { [$style['is-first']]: index % 5 === 0 }]"
                    @touchstart="active = `${info.vendor}_${item.vendor}`"
                    @touchend="active = ''"
                    @click="onGameClick(item.path, item.kind)"
                >
                    <div :class="$style.icon">
                        <!-- 平台圖 -->
                        <img v-if="active === `${info.vendor}_${item.vendor}`" :src="$getCdnPath(`/static/image/mobile/platform/icon/yellow/${info.vendor}/${item.vendor}_active.png`)" />
                        <!-- 台平 Active 圖 -->
                        <img v-else :src="$getCdnPath(`/static/image/mobile/platform/icon/yellow/${info.vendor}/${item.vendor}.png`)" />
                    </div>
                    <div>{{ item.alias }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import keyBy from 'lodash/keyBy';
import cloneDeep from 'lodash/cloneDeep';
import categoryList from '@/config/gameCategory';
import openGame from '@/lib/open_game';

export default {
    props: {
        isListVisible: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            categoryList,
            active: ''
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            gameData: 'getGameData'
        }),
        gameCategory() {
            return keyBy(categoryList, 'kind');
        },
        allGames() {
            if (!this.gameData) {
                return {};
            }

            const category = cloneDeep(this.gameCategory);

            Object.keys(this.gameData).forEach((item) => {
                const { kind } = this.gameData[item];

                if (!category[kind].subVendor) {
                    let defaultValue = [];

                    // 電子遊戲及棋牌遊戲 加上預設項目(全部,捕魚)
                    if (kind === 3) {
                        defaultValue = [
                            // 活動先註解不開放，後續開放只要搜 activity_open
                            // {
                            //     alias: this.$t('S_HOT_ACTIVITY'),
                            //     kind,
                            //     vendor: 'activity',
                            //     path: 'all/activity'
                            // },
                            {
                                alias: this.$t('S_ALL'),
                                kind,
                                vendor: 'all',
                                path: ''
                            },
                            {
                                alias: this.$t('S_GAME_GROUP_BY_888FISH'),
                                kind: 'fisharea',
                                vendor: 'fisharea',
                                path: 'fisharea'
                            }
                        ];
                    }
                    if (kind === 5) {
                        defaultValue = [
                            {
                                alias: this.$t('S_ALL'),
                                kind,
                                vendor: 'all',
                                path: ''
                            }
                        ];
                    }

                    category[kind].subVendor = defaultValue;
                }
                if (this.gameData[item].switch === 'Y') {
                    category[kind].subVendor.push({
                        ...this.gameData[item],
                        path: this.gameData[item].vendor
                    });
                }
            });

            return category;
        }
    },
    watch: {
        isListVisible() {
            if (this.isListVisible !== 'gameList') {
                return;
            }

            // 將捕魚定位至電子casino
            const refName = this.$route.name === 'fisharea' ? 'casino' : this.$route.name;

            setTimeout(() => {
                $(this.$parent.$refs['game-list-wrap']).animate({ scrollTop: this.$refs[refName][0].offsetTop }, 500);
            }, 100);
        }
    },
    methods: {
        /**
         * 開啟遊戲
         * @method onGameClick
         * @param {string} path - 遊戲路徑
         * @param {number} kind - 遊戲分類代號
         * @param {string} code - 遊戲代號
         */
        onGameClick(path, kind, code) {
            const hasHall = [3, 5, 'fisharea'];

            // 有遊戲大廳的遊戲
            if (hasHall.includes(kind) && (code === '' || typeof code === 'undefined')) {
                switch (kind) {
                    case 3:
                        this.$router.push(`/mobile/casino/${path}`);
                        break;
                    case 5:
                        this.$router.push(`/mobile/card/${path}`);
                        break;
                    case 'fisharea':
                        this.$router.push('/mobile/fisharea');
                        break;
                    default:
                }
                this.$emit('update:isListVisible', '');
                return;
            }

            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            openGame({ path, kind, code });
            this.$emit('update:isListVisible', '');
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.category-list {
    margin: 0 auto;
    width: 88%;
    min-width: 320px;
    max-width: 768px;
    font-size: 12px;
}

.title-wrap {
    position: relative;
    background: #000;
    margin: 0 auto 10px;
    height: 18px;
    line-height: 18px;
    text-align: left;
}

.title-line {
    position: absolute;
    top: 10px;
    background: #8B8B8B;
    width: 100%;
    height: 1px;
}

.title {
    position: relative;
    background: inherit;
    display: inline-block;
    padding: 0 8px;
    color: #F8F1EB;
}

.link {
    float: left;
    margin-bottom: 6px;
    padding-top: 5px;
    width: 20%;
    line-height: 30px;
    box-sizing: border-box;
    text-align: center;
    color: #F8F1EB;

    &.is-first {
        clear: left;
    }
}

.icon {
    img {
        margin: 0 auto;
        display: block;
        width: 51px;
    }
}

@media screen and (min-width: $phone) {
    .category-list {
        font-size: 16px;
    }

    .link {
        background-size: 48px 44px;
        margin-bottom: 10px;
    }
}

@media screen and (min-width: $pad) {
    .category-list {
        font-size: 20px;
    }

    .link {
        background-size: 78px 71px;
        margin-bottom: 18px;
    }
}
</style>
