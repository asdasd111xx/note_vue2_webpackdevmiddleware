<template>
    <div>
        <div
            v-if="isBackEnd && !readOnly"
            ref="ckeditor"
            class="ckeditor"
            contenteditable="true"
        />
        <!-- eslint-disable vue/no-v-html -->
        <div v-else v-html="value" />
        <!-- eslint-enable vue/no-v-html -->
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { ckeditor } from '@/lib/ckeditor';

export default {
    props: {
        info: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'inline'
        },
        onFocus: {
            type: Function,
            default: () => {}
        },
        onBlur: {
            type: Function,
            default: () => {}
        },
        onChange: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            element: null
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang',
            readOnly: 'getReadOnly'
        })
    },
    watch: {
        value(val) {
            if (!this.readOnly) {
                this.element.setData(val);
            }
        }
    },
    mounted() {
        if (!this.isBackEnd || this.readOnly) {
            return;
        }

        const { info } = this;
        this.element = ckeditor({
            target: this.$refs.ckeditor,
            type: this.type,
            onFocus: () => {
                this.onFocus();
            },
            onBlur: (e) => {
                this.onBlur(e, e.editor.getData(), info);
            },
            onChange: (e) => {
                this.onChange(e, e.editor.getData(), info);
            }
        });
        this.element.setData(this.value);
    },
    beforeDestroy() {
        if (!this.isBackEnd || this.readOnly) {
            return;
        }

        this.element.destroy();
    },
    methods: {
        ...mapActions([
            'actionEditCaseData'
        ])
    }
};
</script>
<style lang="scss" scoped>
.ckeditor {
    margin-bottom: 8px;
    min-height: 28px;
    border: 1px solid transparent;
    &:hover {
        border: 1px solid #C0C0C0;
        cursor: text;
    }
}
</style>
