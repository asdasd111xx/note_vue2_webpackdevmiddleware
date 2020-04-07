<template>
    <div ref="semantic-dropdown" :class="dropdownClass">
        <div class="text" />
        <i class="dropdown icon" />
    </div>
</template>

<script>
/* global $ */

export default {
    props: {
        // options: [{ name: [option name], value: [option value], selected: [true|false] ... }]
        options: {
            type: Array,
            default: () => []
        },
        display: {
            type: String,
            default: 'inline' // block || inline
        },
        placeholder: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        onChange: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        dropdownClass() {
            return {
                ui: true,
                fluid: this.display === 'block',
                selection: true,
                dropdown: true,
                disabled: this.disabled
            };
        }
    },
    mounted() {
        // 下拉選單設定
        $(this.$refs['semantic-dropdown']).dropdown({
            values: this.options,
            onChange: this.onChange,
            placeholder: this.placeholder
        });
    },
    beforeDestroy() {
        // 卸載下拉選單
        $(this.$refs['semantic-dropdown']).dropdown('destroy');
    }
};
</script>
