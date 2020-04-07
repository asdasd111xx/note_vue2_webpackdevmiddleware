<template>
    <div
        ref="ckeditor"
        :class="$style.ckeditor"
        contenteditable="true"
    />
</template>

<script>
import { mapGetters } from 'vuex';
import { ckeditor } from '@/lib/ckeditor';

export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        onChange: {
            type: Function,
            default: () => ({})
        }
    },
    data() {
        return {
            element: null
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        })
    },
    mounted() {
        this.element = ckeditor({
            target: this.$refs.ckeditor,
            type: 'widget',
            onChange: (e) => {
                this.onChange(e, e.editor.getData());
            }
        });
        this.element.setData(this.value);
    },
    beforeDestroy() {
        this.element.destroy();
    }
};
</script>

<style lang="scss" module>
.ckeditor {
    float: left;
    width: 214px;
    height: 170px;
    line-height: normal;
    border: 1px solid #D5D5D5;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
    overflow: auto;

    p {
        line-height: inherit;
    }
}
</style>
