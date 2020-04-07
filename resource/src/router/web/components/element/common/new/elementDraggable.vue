<template>
    <draggable
        v-model="elementDnd"
        :options="optionsDnd"
        class="draggable-wrap"
    >
        <slot />
    </draggable>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import draggable from 'vuedraggable';

/**
 * 模塊項目排序功能外框，拖曳時自動發 action 請求設定排序資料
 * @module element/common/elementDraggable
 * @param {string} [handleClass='.sort-icon'] - 可觸發拖曳的 class 名稱
 * @param {object} element -模塊資料
 * @param {string} type - 模塊排序時，排序資料為 data 或 content
 */
export default {
    components: {
        draggable
    },
    props: {
        handleClass: {
            type: String,
            default: '.sort-icon'
        },
        element: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            default: ''
        },
        onSort: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            optionsDnd: {
                handle: this.handleClass
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        elementDnd: {
            get() {
                // 為了在 set 可以同步更新 data 和 content 的資料，額外記了 sortIndex
                if (this.type === 'content') {
                    return this.element.case.content.map((info, index) => ({ ...info, sortIndex: index }));
                }
                return this.element.case.data.map((info, index) => ({ ...info, sortIndex: index }));
            },
            set(sort) {
                // 為了可以帶特殊版型需要的排序功能而添加參數
                if (this.onSort) {
                    this.onSort(sort);
                    return;
                }
                const caseData = [];
                const caseContent = [];

                sort.forEach((info) => {
                    caseData.push(this.element.case.data[info.sortIndex]);

                    if (this.element.case.content[info.sortIndex]) {
                        caseContent.push(this.element.case.content[info.sortIndex]);
                    }
                });

                this.actionCaseSave({
                    case_id: this.element.i,
                    content: this.element.case.content.length ? caseContent : [],
                    field: this.element.case.data.length ? caseData : [],
                    setting: { ...this.element.case.setting }
                }).then((response) => {
                    if (response.status !== 'Y') {
                        this.$swal({
                            title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                            type: 'error'
                        });
                    }
                });
            }
        }
    },
    methods: {
        ...mapActions([
            'actionElementSave',
            'actionCaseSave'
        ])
    }
};
</script>
