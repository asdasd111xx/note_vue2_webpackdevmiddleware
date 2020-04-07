<template>
    <div class="custom-image-wrap">
        <template v-if="element.case.data.length">
            <element-draggable :element="element" class="clearfix">
                <template v-for="(caseData, index) in element.case.data">
                    <element-wrap
                        v-if="index > 5"
                        :key="`custom-image-${index}`"
                        :index="index"
                        :config="shadowConfig"
                        :element="element"
                        class="custom-image"
                    >
                        <template slot="element">
                            <img
                                :src="$getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)"
                                :style="mainStyle(caseData.linkType[curLang])"
                                @click="changePage(caseData)"
                            />
                        </template>
                    </element-wrap>
                </template>
            </element-draggable>
        </template>
        <template v-if="isBackEnd && !readOnly">
            <div class="btn-add-case" @click="addCase">{{ $t('S_ADD01', memInfo.config.lang || 'zh-cn') }}</div>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getElementInfo } from '@/lib/element_default';
import elementDraggable from '../../../common/new/elementDraggable';
import elementWrap from '../../../common/new/elementWrap';

export default {
    components: {
        elementDraggable,
        elementWrap
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
    data() {
        return {
            shadowConfig: {
                ...this.config,
                casePanel: {
                    remove: true, // 刪除功能
                    sort: true, // 排序功能
                    edit: true // 編輯功能
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
            lang: 'getLang',
            curLang: 'getCurLang',
            readOnly: 'getReadOnly'
        })
    },
    methods: {
        ...mapActions([
            'actionCaseSave',
            'actionChangePage'
        ]),
        mainStyle(type) {
            if (type === 'nolink') {
                return {};
            }

            return { cursor: 'pointer' };
        },
        /**
         * 新增項目
         * @method addCase
         */
        addCase() {
            // 判斷是否為後台
            if (!this.isBackEnd) {
                return;
            }

            const eleData = getElementInfo(this.config.name, this.webInfo.model, this.webInfo.style_color);
            const fields = {};

            this.config.fields.common.forEach((fieldName) => {
                if (!fields[fieldName]) {
                    fields[fieldName] = {};
                }

                Object.keys(this.lang).forEach((lang) => {
                    fields[fieldName][lang] = eleData.data[6][fieldName] || '';
                });
            });

            // 新增組件
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
        },
        changePage({ linkTo, linkType, linkItem }) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({
                page: linkTo[this.curLang],
                type: linkType[this.curLang],
                config: {
                    linkItem: linkItem ? linkItem[this.curLang] : ''
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.custom-image-wrap {
    position: relative;
    float: left;
    width: 70%;

    &:hover {
        .btn-add-case {
            opacity: 1;
        }
    }

    .btn-add-case {
        opacity: 0;
        position: absolute;
        bottom: 20px;
        left: 50%;
        background: #AFAFAF;
        margin: -18px 0 0 -66px;
        width: 132px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        cursor: pointer;
        transition: opacity .5s;
    }
}

.custom-image {
    position: relative;
    float: left;

    img {
        display: block;
        width: 100%;
    }
}
</style>
