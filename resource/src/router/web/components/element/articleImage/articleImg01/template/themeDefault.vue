<template>
    <div class="tpl-wrap">
        <element-draggable
            v-if="element.case.data.length"
            :element="element"
        >
            <element-wrap
                v-for="(caseData, index) in element.case.data"
                :key="`case-${index}`"
                :index="index"
                :element="element"
                :config="config"
                @click="changePage(caseData)"
            >
                <template slot="element">
                    <div class="image-box">
                        <img :src="$getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgout" />
                        <img :src="caseData.imageHover && caseData.imageHover[curLang] ? $getCdnPath(`${cdnDomain}${caseData.imageHover[curLang]}`) : $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgin" />
                    </div>
                    <article-inline
                        :info="{index}"
                        :value="caseData.title[curLang]"
                        :on-blur="onTitleBlur"
                        class="article-inline"
                    />
                </template>
            </element-wrap>
        </element-draggable>
        <div
            v-if="isBackEnd && !readOnly"
            :class="['add-case', { 'is-disable': element.case.data.length >= config.max }]"
            @click="addCase"
        >
            {{ $t('S_ADD01', memInfo.config.lang || 'zh-cn') }}
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';
import articleInline from '../../../common/articleInline';

export default {
    components: {
        elementWrap,
        elementDraggable,
        articleInline
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain',
            lang: 'getLang',
            curLang: 'getCurLang',
            readOnly: 'getReadOnly'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionCaseSave'
        ]),
        changePage(caseData) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({
                page: caseData.linkTo[this.$i18n.locale],
                type: caseData.linkType[this.$i18n.locale],
                config: {
                    linkItem: (caseData.linkItem ? caseData.linkItem[this.$i18n.locale] : '')
                }
            });
        },
        // 新增項目
        addCase() {
            if (!this.isBackEnd) {
                return;
            }

            // 防止超過預設數量
            if (this.element.case.data.length >= this.config.max) {
                return;
            }

            const eleData = '';
            const fields = {};

            this.config.fields.common.forEach((fieldName) => {
                if (!fields[fieldName]) {
                    fields[fieldName] = {};
                }
                Object.keys(this.lang).forEach((lang) => {
                    fields[fieldName][lang] = eleData.data[0][fieldName] || '';
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
                }
            });
        },
        // 離焦時更新 title
        onTitleBlur(e, content, info) {
            this.actionCaseSave({
                case_id: this.element.i,
                content: [{}],
                // field: [...this.element.case.data],
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.tpl-wrap {
    box-sizing: border-box;
    padding-top: 60px;
    text-align: center;

    .theme-B & {
        box-sizing: border-box;
        padding-top: 60px;
        text-align: center;
        max-width: 680px;
        margin: 0 auto;

        .element {
            width: 42%;
        }
    }

    &:hover {
        .add-case {
            opacity: 1;
        }
    }

    .element {
        position: relative;
        margin: 0 auto;
        padding-bottom: 60px;
        width: 20%;
        vertical-align: top;

        &.is-front {
            cursor: pointer;
        }

        img {
            width: 100%;
            cursor: pointer;

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

        .article-inline {
            margin-top: 24px;
        }
    }

    .add-case {
        line-height: 35px;
        position: absolute;
        bottom: 20px;
        left: 50%;
        width: 132px;
        height: 35px;
        margin-left: -66px;
        cursor: pointer;
        transition: opacity .5s;
        text-align: center;
        opacity: 0;
        background: #AFAFAF;

        &.is-disable {
            cursor: not-allowed;
        }
    }
}

@media screen and (min-width: $sidebar + $phone) {
    .tpl-wrap {
        .element {
            display: inline-block;
            margin: 0 20px;
        }
    }
}
</style>
