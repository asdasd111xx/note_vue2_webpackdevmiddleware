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
import { mapGetters } from 'vuex';
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
            default: ''
        },
        data: {
            type: Array,
            required: true
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
                return this.data;
            },
            set(sort) {
                this.$emit('update:data', sort);
            }
        }
    }
};
</script>
