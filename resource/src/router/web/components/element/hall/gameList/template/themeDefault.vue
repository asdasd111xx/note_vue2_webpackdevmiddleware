<template>
    <div v-if="isReady" class="tpl-wrap">
        <game-list-form
            v-if="isBackEnd && !readOnly"
            :disable="element.case.data.length >= config.max"
            :exclude="element.case.data"
            :on-submit="addCase"
            :self-store="selfStore"
            :store-methods="storeMethods"
        />
        <div :class="['game-list-wrap', 'cur-type-all', 'cur-vendor-all', 'clearfix', { 'is-login': loginStatus }]">
            <element-draggable
                v-if="caseGame.length"
                :element="element"
            >
                <element-wrap
                    v-for="(caseData, index) in caseGame"
                    :key="`case-${caseData.vendor}-${caseData.code}`"
                    :index="index"
                    :element="element"
                    :config="config"
                >
                    <game-item
                        slot="element"
                        :theme="element.theme"
                        :hall-type="element.type"
                        :game-info="caseData"
                    />
                </element-wrap>
            </element-draggable>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import store from '@/store';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';
import gameListForm from '../components/gameListForm';
import gameItem from '../components/gameItem';

/**
 * 自訂遊戲列表模塊
 * @module element/hall/gameList
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 * @param {object} selfStore - 模塊 rxjs 資料 store
 * @param {object} storeMethods - 更新模塊 rxjs 資料的方法
 */
export default {
    components: {
        elementWrap,
        elementDraggable,
        gameListForm,
        gameItem
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => {}
        },
        selfStore: {
            type: Object,
            required: true
        },
        storeMethods: {
            type: Object,
            required: true
        }
    },
    subscriptions() {
        return {
            typeList: this.selfStore.typeList$,
            gameInfo: this.selfStore.gameInfo$
        };
    },
    data() {
        return {
            isReady: false,
            categoryList: []
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus',
            gameData: 'getGameData',
            lang: 'getLang',
            curLang: 'getCurLang',
            readOnly: 'getReadOnly'
        }),
        /**
         * 自訂的遊戲列表
         * @method caseGame
         * @returns 遊戲列表
         */
        caseGame() {
            const result = [];

            // 將 api 回傳的遊戲列表，排序調整與 case 一致
            this.element.case.data.forEach((item) => {
                const filterGame = this.gameInfo.filter((data) => data.vendor === item.vendor && data.code === item.gameType);

                if (filterGame.length !== 0) {
                    result.push(filterGame[0]);
                }
            });

            return result;
        }
    },
    created() {
        if (this.isBackEnd) {
            const fields = [];

            // 配合 RD5 進行調整
            const transList = {
                bbin_3: 'bbcasino',
                fg_3: 'fg',
                fg_5: 'fg_card'
            };

            this.element.case.data.forEach((info) => {
                const vendor = transList[`${info.vendor}_${info.kind}`] || info.vendor;

                // 判斷是否有遊戲被關閉
                if (store.state.gameDetail[vendor].some((game) => game.code === info.gameType)) {
                    fields.push(info);
                }
            });

            if (this.element.case.data.length !== fields.length) {
                // 若原有遊戲被關閉則將有啟用的遊戲重組後存到 case data
                this.onCaseReset(fields);
                return;
            }
        }

        this.isReady = true;
        this.storeMethods.getGameInfo(this.isBackEnd, this.element.case.data);
        if (!this.isBackEnd) {
            this.actionSetFavoriteGame();
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionCaseSave',
            'actionSetFavoriteGame'
        ]),
        /**
         * 新增項目
         * @method addCase
         * @param {string} vendor - 遊戲平台代號
         * @param {string} game - 遊戲代號
         */
        addCase(vendor, game, kind) {
            return new Promise((resolve, reject) => {
                if (!this.isBackEnd) {
                    reject();
                    return;
                }
                // 防止超過預設數量
                if (this.element.case.data.length >= this.config.max) {
                    reject();
                    return;
                }

                const caseData = { vendor, gameType: game, kind };
                const fields = {};

                this.config.fields.common.forEach((fieldName) => {
                    Object.keys(this.lang).forEach(() => {
                        fields[fieldName] = caseData[fieldName] || '';
                    });
                });

                this.actionCaseSave({
                    case_id: this.element.i,
                    content: [{}],
                    setting: { ...this.element.case.setting },
                    field: [
                        ...this.element.case.data,
                        { ...fields }
                    ]
                }).then((response) => {
                    if (response.status !== 'Y') {
                        this.$swal({
                            title: response.message || this.$t('S_CONTACT_SERVICE'),
                            type: 'error'
                        });

                        reject();
                        return;
                    }

                    this.storeMethods.getGameInfo(this.isBackEnd, this.element.case.data);
                    resolve();
                });
            });
        },
        /**
         * Reset Case Data
         * @method onCaseReset
         * @param {array} fields - 重組後的遊戲資料
         */
        onCaseReset(fields) {
            if (!this.isBackEnd) {
                return;
            }

            this.actionCaseSave({
                case_id: this.element.i,
                content: [{}],
                setting: { ...this.element.case.setting },
                field: [...fields]
            }).then((response) => {
                this.isReady = true;

                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE'),
                        type: 'error'
                    });

                    return;
                }

                this.storeMethods.getGameInfo(this.isBackEnd, this.element.case.data);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.tpl-wrap {
    position: relative;
    box-sizing: border-box;

    .game-list-wrap {
        padding: 50px 0;
        margin: 0 auto;

        .element {
            position: relative;
            float: left;
        }
    }
}

.theme-A {
    .tpl-wrap {
        .game-list-wrap {
            width: 306px;

            @media screen and (min-width: $phone + $sidebar) {
                width: 408px;
            }

            @media screen and (min-width: $pad + $sidebar) {
                width: 744px;
            }

            @media screen and (min-width: $pc + $sidebar) {
                width: 936px;
            }
        }
    }
}

.theme-B {
    .tpl-wrap {
        .game-list-wrap {
            width: 348px;

            @media screen and (min-width: $phone + $sidebar) {
                width: 464px;
            }

            @media screen and (min-width: $pad + $sidebar) {
                width: 740px;
            }

            @media screen and (min-width: $pc + $sidebar) {
                width: 960px;
            }
        }
    }
}
</style>
