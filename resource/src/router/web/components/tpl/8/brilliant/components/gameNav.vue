<template>
    <div class="game-nav">
        <div class="sidebar-top">
            <img :src="$getCdnPath(`/static/image/tpl/8/sidebar_top.png`)" />
        </div>
        <div class="sidebar-middle">
            <div class="game-wrap">
                <div
                    v-for="(item, index) in gameList"
                    :key="`game-${index}`"
                    class="game-item"
                    @click="changePage(item)"
                >
                    {{ $text(item.text) }}
                </div>
            </div>
        </div>
        <div class="sidebar-bottom">
            <img :src="$getCdnPath(`/static/image/tpl/8/sidebar_bottom.png`)" />
            <img :src="$getCdnPath(`/static/image/tpl/8/sidebar_img.png`)" />
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .game-item[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/sidebar.png') }}) no-repeat 50% 0;
            }

            .sidebar-middle[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/sidebar_bg_y.png') }}) repeat-y 50% 0;
            }

            .game-wrap[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/sidebar_bg.png') }}) no-repeat 50% 0;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import gameCategory from '@/config/gameCategory';

export default {
    data() {
        return {
            fishareaPage: {
                30: {
                    page: 5235,
                    type: 'custom',
                    text: this.$text('S_GAME_GROUP_BY_888FISH', '捕鱼机')
                },
                32: {
                    page: 5618,
                    type: 'custom',
                    text: this.$text('S_GAME_GROUP_BY_888FISH', '捕鱼机')
                },
                177: {
                    page: 17691,
                    type: 'custom',
                    text: this.$text('S_GAME_GROUP_BY_888FISH', '捕鱼机')
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            gameData: 'getGameData',
            webInfo: 'getWebInfo',
            pageData: 'getPageData'
        }),
        gameList() {
            const fishPage = this.fishareaPage[this.webInfo.alias];
            const allGameList = [];

            if (this.pageData[fishPage.page]) {
                allGameList.push(fishPage);
            }

            gameCategory.forEach((info) => {
                Object.keys(this.gameData)
                    .filter((item) => this.gameData[item].switch === 'Y' && info.kind === this.gameData[item].kind)
                    .map((key) => allGameList.push({ key, ...this.gameData[key] }));
            });

            return allGameList;
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(game) {
            if (!game.key) {
                this.actionChangePage({
                    page: game.page,
                    type: game.type
                });
                return;
            }

            this.actionChangePage({
                page: game.key,
                type: 'games'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.game-nav {
    display: inline-block;
    vertical-align: top;
    width: 216px;

    .sidebar-top {
        height: 111px;

        img {
            height: inherit;
        }
    }
}

.game-item {
    color: #D4CCB5;
    cursor: pointer;
    font-size: 12px;
    margin: 0 auto;
    width: 178px;
    height: 40px;
    line-height: 40px;
    text-align: center;

    &:hover {
        font-weight: bold;
        background-position: 50% 100%;
        text-shadow: 1px 1px 1px #C8986A;
    }
}
</style>
