<template>
    <div class="tpl-wrap">
        <article-tab
            v-show="hasTab"
            :element="element"
            :tab-index="tabIndex"
            :config="config"
            @handleTabClick="handleTabClick"
        />
        <element-wrap
            v-for="(caseContent, index) in element.case.content"
            :key="`case-${index}`"
            :index="index"
            :element="element"
            :config="config"
        >
            <template slot="element">
                <!-- eslint-disable vue/no-v-html -->
                <div v-if="index === tabIndex" v-html="isBackEnd ? caseContent[curLang] : content[index]" />
                <!-- eslint-enable vue/no-v-html -->
                <div
                    v-if="isBackEnd && !hasTab && !readOnly"
                    class="btn-edit"
                    @click="isEditing = index"
                >
                    {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
                </div>
            </template>
        </element-wrap>
        <div
            v-if="isBackEnd && !readOnly"
            :class="['add-case', { 'is-disable': element.case.content.length >= config.max }]"
            @click="addCase"
        >
            {{ $t('S_ADD01', memInfo.config.lang || 'zh-cn') }}
        </div>
        <caseEdit
            v-if="isBackEnd && isEditing !== '' && !readOnly"
            :element="element"
            :config="config"
            :edit-index="isEditing"
            @close="isEditing = ''"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import elementWrap from '../../../common/new/elementWrap';
import caseEdit from '../../../common/new/caseEdit';
import articleTab from './articleTab';

export default {
    components: {
        elementWrap,
        articleTab,
        caseEdit
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            content: [],
            tabIndex: -1,
            firstArticleIndex: -1,
            isEditing: ''
        };
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
        }),
        /**
         * 頁籤是否呈現
         */
        hasTab() {
            const caseContent = this.element.case.content;
            const caseData = this.element.case.data;

            return (
                caseContent.length > 1
                || (caseContent.length === 1 && caseData[0].editContentState[this.curLang] === 'link')
            );
        }
    },
    watch: {
        /* eslint-disable object-shorthand */
        /**
         * 新增或刪除時，重新設定 tabIndex
         */
        'element.case.data.length'() {
            if (this.tabIndex >= this.element.case.data.length || this.tabIndex === -1) {
                this.tabIndex = this.firstArticleIndex;
            }
        },
        /**
         * case 異動時，更新 tabIndex 及 firstArticleIndex
         */
        'element.case.data'() {
            this.firstArticleIndex = this.getFirstArticleIndex();

            try {
                if (this.element.case.data[this.tabIndex].editContentState[this.curLang] !== 'ckeditor') {
                    this.tabIndex = this.firstArticleIndex;
                }
            } catch (err) {
                this.tabIndex = this.firstArticleIndex;
            }
        }
        /* eslint-enable object-shorthand */
    },
    created() {
        if (!this.isBackEnd) {
            this.element.case.content.forEach((contentInfo, index) => {
                if (!contentInfo[this.curLang]) {
                    return;
                }
                const url = `/tpl/${this.memInfo.user.domain}${contentInfo[this.curLang]}`;

                axios.get(url)
                    .then((res) => {
                        this.content[index] = res.data;

                        // vue 無法監聽 content 內容的變動，在此階段強制更新組件
                        this.$forceUpdate();
                    })
                    .catch(() => {
                        this.content[index] = '';
                    });
            });
        }
    },
    mounted() {
        const firstArticleIndex = this.getFirstArticleIndex();

        this.firstArticleIndex = firstArticleIndex;
        this.tabIndex = firstArticleIndex;
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        /**
         * 點擊頁籤
         * @param { number } index - case 索引值
         */
        handleTabClick(index) {
            this.tabIndex = index;
        },
        /**
         * 取得第一個為文案內容的索引值
         */
        getFirstArticleIndex() {
            let firstArticleIndex = -1;
            this.element.case.data.some((data, index) => {
                if (data.editContentState[this.curLang] === 'ckeditor') {
                    firstArticleIndex = index;
                    return true;
                }
                return false;
            });
            return firstArticleIndex;
        },
        /**
         * 新增 case
         */
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
            const content = {};

            this.config.fields.common.forEach((fieldName) => {
                // 處理圖文編輯器
                if (fieldName.type === 'ckeditor') {
                    Object.keys(this.lang).forEach((lang) => {
                        content[lang] = eleData.data[0][fieldName.name] || '';
                    });
                    return;
                }

                if (!fields[fieldName]) {
                    fields[fieldName] = {};
                }

                Object.keys(this.lang).forEach((lang) => {
                    fields[fieldName][lang] = eleData.data[0][fieldName] || '';
                });
            });

            this.actionCaseSave({
                case_id: this.element.i,
                content: [
                    ...this.element.case.content,
                    { ...content }
                ],
                setting: { ...this.element.case.setting },
                field: [
                    ...this.element.case.data,
                    { ...fields }
                ]
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.tpl-wrap {
    position: relative;
    padding: 50px;

    .theme-B & {
        margin: 0 auto;
        width: 960px;
    }

    &:hover {
        .add-case,
        .btn-edit {
            opacity: 1;
        }
    }

    .btn-edit {
        background: #2F2F2F;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -17px 0 0 -60px;
        width: 120px;
        height: 35px;
        line-height: 35px;
        color: #FFF;
        cursor: pointer;
        transition: opacity .5s;
        text-align: center;
        opacity: 0;
        border: 1px solid #FDFDFD;
        border-radius: 3px;
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
</style>
