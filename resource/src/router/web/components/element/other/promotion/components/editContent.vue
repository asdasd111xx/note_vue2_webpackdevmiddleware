<template>
    <div :class="$style['edit-content']">
        <div
            ref="ckeditor"
            class="ckeditor"
            contenteditable="true"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ckeditor } from '@/lib/ckeditor';

export default {
    props: {
        value: {
            type: Object,
            required: true
        },
        disable: {
            type: Boolean,
            default: false
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
    watch: {
        disable() {
            this.ckeditor.setReadOnly(this.disable);
        }
    },
    mounted() {
        this.ckeditor = ckeditor({
            target: this.$refs.ckeditor,
            type: '',
            readOnly: this.disable,
            onChange: (e) => {
                this.$emit('input', { ...this.value, [this.curLang]: e.editor.getData() });
            }
        });
        this.ckeditor.setData(this.value[this.curLang]);
    },
    beforeDestroy() {
        this.ckeditor.destroy();
    }
};
</script>

<style lang="scss" module>
.edit-content {
    margin: 10px;
}
</style>
