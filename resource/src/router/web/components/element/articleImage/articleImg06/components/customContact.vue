<template>
    <div class="custom-contact-wrap">
        <!-- 文字區塊 title -->
        <article-inline
            :info="{ type: 'title', index: 8 }"
            :value="element.case.data[8].title[curLang]"
            :on-blur="onTitleBlur"
            class="article-inline"
        />
        <element-draggable :element="element">
            <template v-for="(item, index) in element.case.data">
                <element-wrap
                    v-if="index > 8 && index <= 10"
                    :key="`custom-contact-${index}`"
                    :index="index"
                    :config="shadowConfig"
                    :element="element"
                    class="custom-contact"
                >
                    <template slot="element">
                        <div class="image-wrap" @click="changePage(item)">
                            <img :src="$getCdnPath(`${cdnDomain}${item.image[curLang]}`)" class="imgout" />
                            <img :src="getHoverImage(item)" class="imgin" />
                        </div>
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
                    type: 'v',
                    offset: {
                        top: 5,
                        right: 10
                    }
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
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
            if (!this.isBackEnd) {
                this.actionChangePage({
                    page: linkTo[this.curLang],
                    type: linkType[this.curLang],
                    config: {
                        linkItem: linkItem[this.curLang]
                    }
                });
            }
        },
        /**
         * 取得 Hover 圖片
         * @method getHoverImage
         * @param {string} image - normal 圖片路徑
         * @param {string} imageHover - hover 圖片路徑
         * @return {string} 圖片路徑
         */
        getHoverImage({ image, imageHover }) {
            const src = imageHover[this.curLang] || image[this.curLang];
            return this.$getCdnPath(`${this.cdnDomain}${src}`);
        }
    }
};
</script>

<style lang="scss" scoped>
.custom-contact-wrap {
    float: left;
    width: 42%;
    padding-left: 6%;

    .custom-contact {
        position: relative;
        margin-right: 12%;

        .image-wrap {
            cursor: pointer;
        }

        img {
            width: 100%;

            &.imgout {
                display: block;
            }

            &.imgin {
                display: none;
            }
        }

        &:hover {
            img {
                &.imgout {
                    display: none;
                }

                &.imgin {
                    display: block;
                }
            }
        }
    }
}
</style>
