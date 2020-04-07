<template>
    <div class="tab-wrap clearfix">
        <draggable
            v-model="elementDnd"
            :options="optionsDnd"
        >
            <div
                v-for="(caseData, index) in element.case.data"
                :key="`tab-${index}`"
                :style="getTabStyle(index)"
                class="tab-title other-wrap"
                @click="handleTabClick(index, caseData)"
            >
                {{ caseData.title[curLang] }}
                <case-panel
                    v-if="isBackEnd && !readOnly"
                    :index="index"
                    :config="shadowConfig"
                    :element="element"
                />
            </div>
        </draggable>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import draggable from 'vuedraggable';
import casePanel from '../../../common/new/casePanel';

export default {
    components: {
        draggable,
        casePanel
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => {}
        },
        tabIndex: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isEditing: '',
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
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang',
            readOnly: 'getReadOnly'
        }),
        elementDnd: {
            get() {
                return this.element.case.data.map((info, index) => ({ ...info, sortIndex: index }));
            },
            set(sort) {
                const caseData = sort.map((info) => this.element.case.data[info.sortIndex]);
                const caseContent = sort.map((info) => this.element.case.content[info.sortIndex]);

                this.actionCaseSave({
                    case_id: this.element.i,
                    content: caseContent,
                    field: caseData,
                    setting: { ...this.element.case.setting }
                }).then((response) => {
                    if (response.status !== 'Y') {
                        this.$swal({
                            title: response.message || this.$t('S_CONTACT_SERVICE'),
                            type: 'error'
                        });
                    }
                });
            }
        },
        optionsDnd() {
            return {
                disabled: !this.isBackEnd,
                handle: '.sort-icon'
            };
        }
    },
    methods: {
        ...mapActions([
            'actionCaseSave',
            'actionChangePage'
        ]),
        /**
         * 取得 tab 樣式
         * @param { number } index - tab 索引值
         */
        getTabStyle(index) {
            const caseData = this.element.case.data[index];
            const tabBg = (index === this.tabIndex) ? caseData.colorHover[this.curLang] : caseData.color[this.curLang];

            return {
                'background-color': tabBg,
                color: caseData.colorFont[this.curLang]
            };
        },
        /**
         * 點擊頁籤
         * @param { number } index - tab 索引值
         */
        handleTabClick(index) {
            const caseData = this.element.case.data[index];

            // 類型為文案
            if (caseData.editContentState[this.curLang] === 'ckeditor') {
                this.$emit('handleTabClick', index);
                return;
            }

            // 類型為連結
            if (!this.isBackEnd && caseData.editContentState[this.curLang] === 'link') {
                this.actionChangePage({
                    page: caseData.linkTo[this.curLang],
                    type: caseData.linkType[this.curLang],
                    config: {
                        linkItem: caseData.linkItem[this.curLang]
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.tab-wrap {
    margin-bottom: 6px;

    .tab-title {
        position: relative;
        float: left;
        margin: 5px;
        padding: 14px 16px;
        min-width: 150px;
        min-height: 50px;
        text-align: center;
        text-decoration: none;
        font-size: 17px;
        transition: .5s;
        border-radius: 5px;
        box-shadow: 3px 3px 3px #ccc;
        cursor: pointer;
    }
}
</style>
