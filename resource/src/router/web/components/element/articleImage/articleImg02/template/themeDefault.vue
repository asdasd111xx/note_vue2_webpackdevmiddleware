<template>
    <!-- 模塊主要外框 -->
    <div :class="['element-box-wrap', 'clearfix', `theme-${element.theme}`]">
        <div class="element-text-wrap">
            <!-- 文字區塊 title -->
            <article-inline
                :info="{ type: 'title' }"
                :value="element.case.data[0] ? element.case.data[0].title[curLang] : ''"
                :on-blur="onTitleBlur"
                class="article-inline"
            />
            <!-- 文字區塊 內容 -->
            <article-inline
                :info="{ type: 'text' }"
                :value="element.case.data[0] ? element.case.data[0].text[curLang] : ''"
                :on-blur="onTitleBlur"
                class="article-inline"
            />
        </div>
        <!-- 圖片區塊 title -->
        <img-wrap
            :element="element"
            :config="config"
            :on-blur="onTitleBlur"
            :class="'element-img-wrap'"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import articleInline from '../../../common/articleInline';
import imgWrap from './imgWrap';

/**
 * 純文本與多圖版塊預設
 * @module element/articleImage/template/themeDefault
 * @param {object} config -模塊設定檔
 * @param {object} element -模塊資料
 */
export default {
    components: {
        articleInline,
        imgWrap
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
            // 設定編輯功能是否開啟
            isEditing: ''
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        })
    },
    methods: {
        ...mapActions(['actionCaseSave']),
        /**
         * 離焦時更新 text
         * @method onTitleBlur
         */
        onTitleBlur(e, content, info) {
            const fieldData = this.element.case.data;
            fieldData[0] = {
                ...this.element.case.data[0],
                [info.type]: {
                    ...this.element.case.data[0][info.type],
                    [this.curLang]: content
                }
            };
            this.updateField({
                field: [...fieldData]
            });
        },
        /**
         * 更新後端資料
         * @method updateField
         */
        updateField(data) {
            this.actionCaseSave({
                case_id: this.element.i,
                content: [{}],
                field: [...this.element.case.data],
                setting: { ...this.element.case.setting },
                ...data
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

.element-box-wrap {
    box-sizing: border-box;
    padding: 60px 0;

    .element-text-wrap {
        width: 200px;
        margin: 0 auto;
    }

    @media screen and (min-width: $sidebar + $phone) {
        width: 440px;
        margin: 0 auto;
        .element-text-wrap {
            float: left;
        }
        &.theme-B {
            .element-text-wrap {
                float: right;
            }
        }
    }
}
</style>
