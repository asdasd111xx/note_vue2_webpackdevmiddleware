<template>
    <div class="tpl-wrap">
        <element-wrap
            v-for="(caseData, index) in element.case.data"
            :key="`case-${index}`"
            :index="index"
            :element="element"
            :config="config"
        >
            <template slot="element">
                <div class="image-box">
                    <img :src="caseData.image[curLang] ? $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`) : ''" />
                    <div
                        v-if="isBackEnd && !readOnly"
                        class="btn-edit"
                        @click.stop="isEditing = index"
                    >
                        {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
                    </div>
                </div>
                <article-inline
                    :info="{index}"
                    :value="caseData.text[curLang]"
                    :on-blur="onTitleBlur"
                    class="article-inline"
                />
            </template>
        </element-wrap>
        <!-- 版塊編輯 -->
        <case-edit
            v-if="isBackEnd && isEditing !== '' && !readOnly"
            :edit-index="isEditing"
            :config="config"
            :element="element"
            @close="isEditing = ''"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import elementWrap from '../../../common/new/elementWrap';
import articleInline from '../../../common/articleInline';
import caseEdit from '../../../common/new/caseEdit';

export default {
    components: {
        elementWrap,
        articleInline,
        caseEdit
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
            isEditing: ''
        };
    },
    computed: {
        ...mapGetters({
            page: 'getPage',
            curLang: 'getCurLang',
            memInfo: 'getMemInfo',
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            readOnly: 'getReadOnly'
        })
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        // 離焦時更新 text
        onTitleBlur(e, content, info) {
            this.actionCaseSave({
                case_id: this.element.i,
                content: [{}],
                setting: { ...this.element.case.setting },
                field: [...this.element.case.data.map((item, i) => {
                    if (info.index === i) {
                        return {
                            ...item,
                            text: {
                                ...item.text,
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

.element {
    width: 100%;
    margin: 0 auto;
    padding: 40px 0 70px;

    &:hover {
        .image-box {
            .btn-edit {
                opacity: 1;
            }
        }
    }

    .image-box {
        position: relative;
        margin: 0 auto;

        img {
            width: 100%;
        }
        .btn-edit {
            position: absolute;
            top: 50%;
            left: 50%;
            opacity: 0;
            background: #2F2F2F;
            margin: -17px 0 0 -60px;
            width: 120px;
            height: 35px;
            line-height: 35px;
            border: 1px solid #FDFDFD;
            font-size: 14px;
            color: #FFF;
            text-align: center;
            border-radius: 3px;
            transition: opacity .5s;
            cursor: pointer;
        }
    }
    .article-inline {
        width: 90%;
        margin: 10px auto 0;
    }
}


@media screen and (min-width: $sidebar + $pad) {
    .element {
        .image-box {
            width: 450px;
        }
        .article-inline {
            width: 370px;
        }
    }
}

@media screen and (min-width: $sidebar + 910px) {
    .element {
        width: 910px;

        .image-box {
            float: left;
            margin: 0 90px 0 0;
        }
        .article-inline {
            float: right;
        }
    }

    .theme-B {
        .element {
            .image-box {
                float: right;
                margin: 0 0 0 90px;
            }
            .article-inline {
                float: left;
            }
        }
    }
}
</style>
