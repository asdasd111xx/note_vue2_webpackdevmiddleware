<template>
    <div class="custom-lnks-wrap">
        <!-- 文字區塊 title -->
        <article-inline
            :info="{ type: 'title', index: 1 }"
            :value="element.case.data[1].title[curLang]"
            :on-blur="onTitleBlur"
            class="article-inline"
        />
        <element-draggable :element="element">
            <template v-for="(item, index) in element.case.data">
                <element-wrap
                    v-if="index > 1 && index <= 7"
                    :key="`custom-link-${index}`"
                    :index="index"
                    :config="shadowConfig"
                    :element="element"
                    :style="{ cursor: isBackEnd ? 'auto' : 'pointer'}"
                    class="custom-links"
                >
                    <template slot="element">
                        <p class="link-item" @click="changePage(item)">
                            {{ item.title[curLang] }}
                        </p>
                    </template>
                </element-wrap>
            </template>
        </element-draggable>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import elementDraggable from '../../../common/new/elementDraggable';
import elementWrap from '../../../common/new/elementWrap';
import articleInline from '../../../common/articleInline';

export default {
    components: {
        elementDraggable,
        elementWrap,
        articleInline
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            shadowConfig: {
                ...this.config,
                casePanel: {
                    ...this.config.casePanel,
                    remove: false
                },
                casePanelStyle: {
                    ...this.config.casePanelStyle,
                    type: 'h',
                    offset: {
                        top: -2,
                        right: 10
                    }
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionCaseSave'
        ]),
        /**
         * 離焦時更新 text
         * @method onTitleBlur
         */
        onTitleBlur(e, content, info) {
            this.actionCaseSave({
                case_id: this.element.i,
                content: this.element.case.content,
                setting: { ...this.element.case.setting },
                field: [...this.element.case.data.map((item, i) => {
                    if (info.index === i) {
                        return {
                            ...item,
                            title: {
                                ...item.title,
                                [this.curLang]: content
                            }
                        };
                    }

                    return item;
                })]
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
         * 切換頁面
         * @method changePage
         * @param {string} linkTo - 連結位置
         * @param {string} linkType - 連結類型
         * @param {string} linkItem - 連結子項目
         */
        changePage({ linkTo, linkType, linkItem }) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({
                page: linkTo[this.curLang],
                type: linkType[this.curLang],
                config: {
                    linkItem: linkItem[this.curLang]
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.custom-lnks-wrap {
    width: 15%;
    padding-left: 5%;
    float: left;

    .article-inline {
        text-align: left;
        font-size: 14px;
        font-weight: bold;
        color: #707072;
        margin-bottom: 8px;
    }

    .custom-links {
        position: relative;
        margin-top: 6px;
        font-size: 13px;
        color: #969696;

        .link-item {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            height: 20px;
            width: 120px;
            margin: 0;
        }
    }
}
</style>
