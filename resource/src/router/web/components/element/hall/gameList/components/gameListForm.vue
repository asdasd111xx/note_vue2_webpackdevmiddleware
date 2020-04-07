<template>
    <div :class="['add-case', { 'is-disable': disable, 'is-show': isShow }]">
        <div v-show="isShow" class="ui form column centered select-wrap">
            <div class="wide column">
                <model-select
                    v-model="kind"
                    :options="kindOption"
                    :placeholder="$t('S_PLEASE_SELECT')"
                    @input="handelChangeKind"
                />
            </div>
            <div class="wide column">
                <model-select
                    v-model="vendor"
                    :options="vendorOption"
                    :placeholder="$t('S_PLEASE_SELECT')"
                    @input="handelChangeVendor($event)"
                />
            </div>
            <div class="wide column">
                <model-select
                    v-model="type"
                    :options="typeOption || []"
                    :placeholder="$t('S_PLEASE_SELECT')"
                    @input="handelChangeType($event)"
                />
            </div>
            <div class="wide column">
                <model-select
                    v-model="game"
                    :options="gameOption"
                    :placeholder="$t('S_PLEASE_SELECT')"
                />
            </div>
            <div class="wide column">
                <div class="add-case-btn" @click="addCassEvent">{{ $t('S_ADD01', memInfo.config.lang || 'zh-cn') }}</div>
            </div>
        </div>
        <div class="expand-btn" @click="isShow = !isShow">
            <i class="plus icon" />
            <i class="close icon" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ModelSelect } from 'vue-search-select';
import find from 'lodash/find';

/**
 * 僅後台使用 - 新增遊戲表單
 * @module element/gameList/gameListForm
 * @param {object} selfStore - 模塊 rxjs 資料 store
 * @param {object} storeMethods - 更新模塊 rxjs 資料的方法
 * @param {boolean} disable - 遊戲列表是否已是最大值
 * @param {array} exclude - 需排除的遊戲列表
 * @param {function} onSubmit - 表單送出的方法
 */
export default {
    components: {
        ModelSelect
    },
    props: {
        selfStore: {
            type: Object,
            required: true
        },
        storeMethods: {
            type: Object,
            required: true
        },
        disable: {
            type: Boolean,
            default: true
        },
        exclude: {
            type: Array,
            default: () => []
        },
        onSubmit: {
            type: Function,
            required: true
        }
    },
    subscriptions() {
        return {
            typeList: this.selfStore.typeList$,
            gameList: this.selfStore.gameList$
        };
    },
    data() {
        return {
            isShow: false,
            vendor: '',
            type: 'none',
            game: '',
            kind: '',
            kindOption: [
                {
                    value: '3',
                    text: this.$t('S_GAME_KIND_CASINO')
                },
                {
                    value: '5',
                    text: this.$t('S_GAME_KIND_CARD')
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            gameData: 'getGameData',
            gameDetail: 'getGameDetail'
        }),
        /**
         * 遊戲提供廠商代號及名稱對照表
         * @method vendorOption
         * @returns {object} 代號及名稱對照表
         */
        vendorOption() {
            if (!this.kind) {
                return [];
            }
            const openVendor = [+this.kind];
            const result = [];
            const { gameData } = this;
            let key = 0;

            Object.keys(gameData).forEach((type) => {
                if (openVendor.includes(gameData[type].kind) && gameData[type].switch === 'Y') {
                    // 配合 rd5 api 參數，調整 type 名稱
                    const transList = {
                        bbcasino: 'bbin',
                        fg_card: 'fg'
                    };
                    const transTextList = {
                        rt: 'sbg',
                        lg_card: 'xbb',
                        lg_casino: 'xbb',
                        mg2: 'mg'
                    };
                    const resultType = transList[type] ? transList[type] : type;
                    const textType = transTextList[type] ? transTextList[type] : gameData[type].vendor;

                    result.push({
                        kind: gameData[type].kind,
                        vendor: resultType,
                        value: `${key}`,
                        text: textType.split('_')[0].toUpperCase()
                    });
                    key += 1;
                }
            });

            return result;
        },
        gameOption() {
            const result = [];

            if (this.type !== 'none') {
                this.gameList.forEach((item) => {
                    if (!find(this.exclude, { gameType: item.code, vendor: item.vendor })) {
                        result.push({ value: item.code, text: item.name });
                    }
                });
            }

            return result;
        },
        typeOption() {
            if (!this.vendor) {
                return [];
            }
            return this.typeList[this.vendorOption[this.vendor].vendor];
        }
    },
    methods: {
        handelChangeKind() {
            this.vendor = '';
            this.type = 'none';
            this.game = '';
        },
        /**
         * 取得遊戲平台分類
         * @method handelChangeVendor
         * @param {string} vendorIndex - 遊戲平台 ID
         */
        handelChangeVendor(vendorIndex) {
            this.type = 'none';
            this.game = '';
            this.storeMethods.getGameType({
                kind: this.vendorOption[vendorIndex].kind,
                vendor: this.vendorOption[vendorIndex].vendor
            });
        },
        /**
         * 取得遊戲平台分類下的遊戲列表
         * @method handelChangeType
         * @param {string} typeIndex - 遊戲分類代號
         */
        handelChangeType(typeIndex) {
            this.game = '';
            this.storeMethods.getGameList({
                kind: this.vendorOption[this.vendor].kind,
                vendor: this.vendorOption[this.vendor].vendor,
                type: typeIndex
            });
        },
        /**
         * 新增遊戲至模塊
         * @method addCassEvent
         */
        addCassEvent() {
            // 遊戲數量已為最大數量
            if (this.disable) {
                return;
            }

            if (this.game === '') {
                alert(this.$t('S_DATA_INCOMPLETE'));
                return;
            }

            this.onSubmit(this.vendorOption[this.vendor].vendor, this.game, this.vendorOption[this.vendor].kind).then(() => {
                this.game = '';
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.add-case {
    position: absolute;
    bottom: 0;
    z-index: 2;
    width: 100%;
    opacity: 0;
    transition: opacity .3s;

    .tpl-wrap:hover & {
        opacity: 1;
    }

    &.is-show {
        background-color: rgba(0, 0, 0, 0.2);

        .expand-btn {
            i {
                &.close {
                    display: inline-block;
                }

                display: none;
            }
        }
    }

    &.is-disable {
        .add-case-btn {
            cursor: not-allowed;
        }
    }

    .select-wrap {
        padding: 20px 0 0;
        margin: 0 auto;
        max-width: 80%;

        .column {
            padding: 4px;
        }
    }
    .add-case-btn {
        height: 35px;
        line-height: 35px;
        cursor: pointer;
        transition: opacity .5s;
        text-align: center;
        background: #AFAFAF;
    }

    .expand-btn {
        margin: 8px auto;
        width: 35px;
        height: 35px;
        color: #FFF;
        text-align: center;
        border-radius: 20px;
        background-color: #009C95;
        cursor: pointer;

        i {
            &.close {
                display: none;
            }

            margin: 0;
            line-height: 35px;
        }
    }

    @media screen and (min-width: $pad + $sidebar) {
        .select-wrap {
            max-width: 60%;
        }
    }

    @media screen and (min-width: $pc + $sidebar) {
        .select-wrap {
            max-width: 40%;
        }
    }
}
</style>
