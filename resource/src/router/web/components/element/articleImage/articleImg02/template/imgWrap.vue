<template>
    <!-- 多圖版塊 -->
    <div>
        <!-- 多圖版塊標題 -->
        <article-inline
            :info="{ type: 'imgTitle' }"
            :value="element.case.data[0] ? element.case.data[0].imgTitle[curLang] : ''"
            :on-blur="onBlur"
            class="article-inline"
        />
        <!-- 多圖版塊圖片 -->
        <element-draggable
            v-if="element.case.data.length > 1"
            :element="element"
            class="clearfix"
        >
            <template v-for="(caseData, index) in element.case.data">
                <element-wrap
                    v-if="index !== 0"
                    :key="`case-${index}`"
                    :index="index"
                    :config="config"
                    :element="element"
                    :class="['element', isBackEnd ? 'back' : 'front']"
                    @click="changePage(caseData)"
                >
                    <template slot="element">
                        <img :src="caseData.image[curLang] ? $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`) : ''" />
                    </template>
                </element-wrap>
            </template>
        </element-draggable>
        <!-- 新增按鈕 -->
        <div
            v-if="isBackEnd && !readOnly"
            :class="{'is-disable': element.case.data.length > config.max, 'add-case': true }"
            @click="addCase"
        >
            {{ $t('S_ADD01', memInfo.config.lang || 'zh-cn') }}
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getElementInfo } from '@/lib/element_default';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';
import articleInline from '../../../common/articleInline';

/**
 * 多圖版塊主要外框
 * @module element/articleImage/template/imgWrap
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 * @param {function} onBlur - 離焦時更新文字框
 */
export default {
    components: {
        elementDraggable,
        elementWrap,
        articleInline
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        },
        config: {
            type: Object,
            required: true
        },
        onBlur: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            // 設定編輯功能是否有開啟
            isEditing: ''
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
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

        /**
         * 設定客端當前頁
         * @method changePage
         */
        changePage(caseData) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({
                page: caseData.linkTo[this.$i18n.locale],
                type: caseData.linkType[this.$i18n.locale],
                config: {
                    linkItem: caseData.linkItem ? caseData.linkItem[this.$i18n.locale] : ''
                }
            });
        },
        /**
         * 新增項目
         * @method addCase
         */
        addCase() {
            // 判斷是否為後台 或者 防止超過預設數量
            if (!this.isBackEnd || this.element.case.data.length > this.config.max) {
                return;
            }

            const eleData = getElementInfo(this.config.name, this.webInfo.model, this.webInfo.style_color);
            const fields = {};

            this.config.fields.common.forEach((fieldName) => {
                if (!fields[fieldName]) {
                    fields[fieldName] = {};
                }

                Object.keys(this.lang).forEach((lang) => {
                    fields[fieldName][lang] = eleData.data[1][fieldName] || '';
                });
            });

            // 新增預設組件
            this.actionCaseSave({
                case_id: this.element.i,
                content: [{}],
                setting: { ...this.element.case.setting },
                field: [...this.element.case.data, { ...fields }]
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
.element-img-wrap {
    position: relative;
    width: 200px;
    margin: 0 auto;
    &:hover {
        .add-case {
            opacity: 1;
        }
    }
    .element {
        position: relative;
        float: left;
        box-sizing: border-box;
        width: 90px;
        height: 90px;
        margin: 6px 6px 0 0;

        img {
            display: block;
            width: 100%;
        }
        &.front {
            cursor: pointer;
        }
        &.back {
            &:hover {
                border: 1px solid #FFF;
                .image-box {
                    .btn-edit {
                        opacity: 1;
                    }
                }
            }
        }
    }
    .add-case {
        line-height: 35px;
        position: absolute;
        bottom: -50px;
        left: 50%;
        width: 132px;
        height: 35px;
        margin-left: -66px;
        cursor: pointer;
        transition: opacity 0.5s;
        text-align: center;
        opacity: 0;
        background: #AFAFAF;
        &.is-disable {
            cursor: not-allowed;
        }
    }
}

@media screen and (min-width: $sidebar + $phone) {
    .element-img-wrap {
        float: right;
    }
    &.theme-B {
        .element-img-wrap {
            float: left;
        }
    }
}
</style>
