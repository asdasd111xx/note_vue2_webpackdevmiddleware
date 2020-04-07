<template>
    <div class="first-game-wrap">
        <a
            v-for="(gameInfo, gameName, index) in gameData"
            :key="`first-game-${gameName}`"
            :class="`first-game first-game-${index}`"
            @click="changePage(gameInfo)"
        />
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .first-game-wrap .first-game.first-game-0[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/customizeHome/177/link01.png') }}) 50% 0 no-repeat;
            }

            .first-game-wrap .first-game.first-game-0[{{ this.$options._scopeId }}]:hover {
                background: url({{ $getCdnPath('/static/image/tpl/customizeHome/177/link01_over.png') }}) 50% 0 no-repeat;
            }

            .first-game-wrap .first-game.first-game-1[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/customizeHome/177/link02.png') }}) 50% 0 no-repeat;
            }

            .first-game-wrap .first-game.first-game-1[{{ this.$options._scopeId }}]:hover {
                background: url({{ $getCdnPath('/static/image/tpl/customizeHome/177/link02_over.png') }}) 50% 0 no-repeat;
            }

            .first-game-wrap .first-game.first-game-2[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/customizeHome/177/link03.png') }}) 50% 0 no-repeat;
            }

            .first-game-wrap .first-game.first-game-2[{{ this.$options._scopeId }}]:hover {
                background: url({{ $getCdnPath('/static/image/tpl/customizeHome/177/link03_over.png') }}) 50% 0 no-repeat;
            }

            .first-game-wrap .first-game.first-game-3[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/customizeHome/177/link04.png') }}) 50% 0 no-repeat;
            }

            .first-game-wrap .first-game.first-game-3[{{ this.$options._scopeId }}]:hover {
                background: url({{ $getCdnPath('/static/image/tpl/customizeHome/177/link04_over.png') }}) 50% 0 no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            gameData: {
                casino: {
                    page: 'casino',
                    type: 'static'
                },
                card: {
                    page: 17715,
                    type: 'custom'
                },
                livetop: {
                    page: 17685,
                    type: 'custom'
                },
                lottery: {
                    page: 19533,
                    type: 'custom'
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(caseData) {
            if (this.isBackEnd) {
                return;
            }
            this.actionChangePage(caseData);
        }
    }
};
</script>

<style lang="scss" src="../css/firstGame.scss" scoped />
