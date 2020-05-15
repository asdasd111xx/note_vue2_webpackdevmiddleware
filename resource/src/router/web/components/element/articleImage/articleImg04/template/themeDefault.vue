<template>
    <div :class="[$style['article-img-wrap'], { [$style['is-backend']]: isBackEnd }]">
        <element-draggable v-if="elementData.case.data.length" :element="elementData">
            <element-wrap
                v-for="(info, index) in elementData.case.data"
                :key="`case-${index}`"
                :index="index"
                :element="elementData"
                :config="config"
            >
                <template slot="element">
                    <promotion-wrap
                        :theme="elementData.theme"
                        :info="info"
                        :content="elementData.case.content[index]"
                    />
                </template>
            </element-wrap>
        </element-draggable>
        <template v-if="isBackEnd && !readOnly">
            <div :class="$style['add-case']" @click="addCase">{{ $t('S_ADD01') }}</div>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import isMobile from '@/lib/is_mobile';
import promotionWrap from '../components/promotionWrap';
import elementDraggable from '../../../common/new/elementDraggable';
import elementWrap from '../../../common/new/elementWrap';

/**
 * 營銷圖文板塊
 * @module element/articleImg/articleImg04/template/themeDefault
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 */
export default {
    components: {
        elementDraggable,
        elementWrap,
        promotionWrap
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isMobile: isMobile(),
            category: 'all'
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            lang: 'getLang',
            readOnly: 'getReadOnly'
        }),
        tabs() {
            return [
                {
                    key: 'all',
                    text: '所有优惠'
                },
                {
                    key: 'new',
                    text: '新会员优惠'
                },
                {
                    key: 'casino',
                    text: '电子游艺'
                },
                {
                    key: 'card',
                    text: '棋牌游戏'
                },
                {
                    key: 'fisharea',
                    text: '捕鱼达人'
                },
                {
                    key: 'other',
                    text: '其他优惠'
                }
            ];
        },
        elementData() {
            if (this.category === 'all') {
                return this.element;
            }

            if (this.category === 'casino') {
                return {
                    ...this.element,
                    case: {
                        ...this.element.case,
                        content: [...this.element.case.content.filter((info, index) => [0, 1, 2].includes(index))],
                        data: [...this.element.case.data.filter((info, index) => [0, 1, 2].includes(index))]
                    }
                };
            }

            if (this.category === 'other') {
                return {
                    ...this.element,
                    case: {
                        ...this.element.case,
                        content: [...this.element.case.content.filter((info, index) => [3, 4].includes(index))],
                        data: [...this.element.case.data.filter((info, index) => [3, 4].includes(index))]
                    }
                };
            }

            return {
                ...this.element,
                case: {
                    ...this.element.case,
                    content: [],
                    data: []
                }
            };
        }
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        /**
         * 新增項目
         * @method addCase
         */
        addCase() {
            if (!this.isBackEnd) {
                return;
            }

            const eleData = '';
            const fields = {};
            const contents = {};

            this.config.fields.common.forEach((fieldName) => {
                const name = typeof fieldName === 'object' ? fieldName.name : fieldName;

                if (name !== 'text' && !fields[name]) {
                    fields[name] = {};
                }

                Object.keys(this.lang).forEach((lang) => {
                    if (name === 'text') {
                        contents[lang] = eleData.data[0][name] || '';
                        return;
                    }

                    if (fieldName === 'slider') {
                        fields[name][lang] = JSON.stringify(eleData.data[0][name]) || '';
                        return;
                    }

                    fields[name][lang] = eleData.data[0][name] || '';
                });
            });

            this.actionCaseSave({
                case_id: this.element.i,
                content: [...this.element.case.content, contents],
                field: [...this.element.case.data, fields],
                setting: { ...this.element.case.setting }
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE'),
                        type: 'error'
                    });
                }
            });
        },
        /**
         * 設定分類
         * @method setCategory
         * @param {string} value - 值
         */
        setCategory(value) {
            if (this.category === value) {
                return;
            }

            this.category = value;
        }
    }
};
</script>

<style lang="scss" module>
:global {
    .element {
        position: relative;
    }
}

.article-img-wrap {
    position: relative;
    margin: 0 auto;

    &:hover {
        .add-case {
            opacity: 1;
        }
    }
}

.is-backend {
    min-height: 135px;
}

.tabs {
    margin: 15px 0;

    > div {
        float: left;
        margin-right: 5px;
        padding: 9px;
        border-radius: 5px 5px 0 0;
        background-color: #3B2B2C;
        color: #FFF;
        font-size: 12px;
        cursor: pointer;
    }

    .active {
        background-color: #C27E01;
    }
}

.add-case {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 132px;
    height: 35px;
    line-height: 35px;
    margin: -17.5px 0 0 -66px;
    background-color: #AFAFAF;
    text-align: center;
    opacity: 0;
    transition: opacity .5s;
    cursor: pointer;
}
</style>
