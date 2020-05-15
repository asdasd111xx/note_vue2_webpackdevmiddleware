<template>
    <div class="tpl-wrap">
        <element-draggable
            v-if="element.case.data.length"
            :element="element"
            class="clearfix"
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
                    <img :src="$getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgout" />
                    <img :src="caseData.imageHover && caseData.imageHover[curLang] ? $getCdnPath(`${cdnDomain}${caseData.imageHover[curLang]}`) : $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgin" />
                </template>
            </element-wrap>
        </element-draggable>
        <div
            v-if="isBackEnd && !readOnly"
            :class="['add-case', { 'is-disable': element.case.data.length >= config.max }]"
            @click="addCase"
        >
            {{ $t('S_ADD') }}
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';

export default {
    components: {
        elementWrap,
        elementDraggable
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
            lang: 'getLang',
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain',
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
            // 防止超過預設數量及判斷是否後台
            if (!this.isBackEnd || this.element.case.data.length >= this.config.max) {
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.tpl-wrap {
    position: relative;
    box-sizing: border-box;
    text-align: center;

    &:hover {
        .add-case {
            opacity: 1;
        }
    }

    .element {
        position: relative;
        vertical-align: top;
        width: 240px;
        margin: 0 auto;

        .theme-B & {
            display: inline-block;
            width: 25%;
        }

        .theme-C & {
            display: inline-block;
            width: 20%;
        }

        .theme-D & {
            float: left;
            width: auto;
        }

        .theme-E & {
            float: left;
            width: 20%;
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
            .imgout {
                display: none;
            }
            .imgin {
                display: block;
            }
        }
    }

    .add-case {
        position: absolute;
        opacity: 0;
        transition: opacity .5s;
        width: 132px;
        height: 35px;
        line-height: 35px;
        margin-left: -66px;
        bottom: 20px;
        left: 50%;
        text-align: center;
        cursor: pointer;
        background: #AFAFAF;

        &.is-disable {
            cursor: not-allowed;
        }
    }
}

@media screen and (min-width: $sidebar + $phone) {
    .tpl-wrap {
        .element {
            .theme-A & {
                display: inline-block;
                margin: 0 7px;
            }
        }
    }
}
</style>
