<template>
    <div
        ref="ckeditor"
        class="ckeditor"
        contenteditable="true"
    />
</template>
<script>
import { mapGetters } from 'vuex';
import { ckeditor } from '@/lib/ckeditor';

/**
 * 圖文編輯器
 * @module element/field/inputCkeditor
 * @param {string|number} editIndex - 當前編輯項目索引值
 * @param {object} fieldConfig - 模塊當前欄位設定值
 * @param {object} element - 模塊資料
 * @param {object} value - 表單的值，雙向綁定
 */
export default {
    props: {
        editIndex: {
            type: [String, Number],
            required: true
        },
        fieldConfig: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            ckeditor: null
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        })
    },
    mounted() {
        const caseContent = this.element.case.content;
        let contentVal;

        try {
            contentVal = caseContent[this.editIndex][this.curLang];
        } catch (err) {
            contentVal = '';
        }

        this.ckeditor = ckeditor({
            target: this.$refs.ckeditor,
            type: '',
            onChange: (e) => {
                this.$emit('input', e.editor.getData());
            }
        });
        this.ckeditor.setData(contentVal);
        this.$emit('input', contentVal);
    },
    beforeDestroy() {
        this.ckeditor.destroy();
    }
};
</script>
<style lang="scss" scoped>
</style>
