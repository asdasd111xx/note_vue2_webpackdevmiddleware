<template>
    <div :class="$style['field-input']">
        <div :class="$style.title">{{ title }}</div>
        <div :class="[$style['input-wrap'], 'clearfix']">
            <div
                :class="$style['color-brick']"
                :style="{ 'background-color': getColorFormat(borderColor) }"
                @click="displayPicker = !displayPicker"
            />
            <div :class="[$style.input, isFocus ? $style['is-focus'] : '']">
                <input
                    ref="input"
                    :value="borderWidth"
                    :class="isFocus && $style['is-focus']"
                    type="text"
                    maxlength="2"
                    @focus="handleFocus"
                    @input="handleChange"
                    @blur="handleBlur"
                />
                <div :class="$style.placeholder">{{ placeholder }}</div>
            </div>
            <template v-if="displayPicker">
                <chrome-picker
                    :value="borderColor"
                    @input="updateColor"
                />
                <div :class="$style['btn-close']" @click="displayPicker = false">
                    <icon
                        name="times-circle"
                        width="22px"
                        height="22px"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { Chrome } from 'vue-color';

export default {
    components: {
        'chrome-picker': Chrome
    },
    props: {
        borderColor: {
            type: Object,
            required: true
        },
        borderWidth: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        onPicker: {
            type: Function,
            default: () => ({})
        },
        onBorderChange: {
            type: Function,
            default: () => ({})
        },
        onBorderBlur: {
            type: Function,
            default: () => ({})
        }
    },
    data() {
        return {
            displayPicker: false,
            isFocus: false
        };
    },
    computed: {
        color() {
            return this.borderColor;
        }
    },
    methods: {
        updateColor(color) {
            this.onPicker(color.rgba);
        },
        getColorFormat(color) {
            return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        },
        handleChange(e) {
            this.isFocus = false;
            this.onBorderChange(e.target.value);
        },
        handleFocus() {
            this.isFocus = true;
        },
        handleBlur(e) {
            this.isFocus = false;
            this.onBorderBlur(e.target.value);
        }
    }
};
</script>

<style lang="scss" module>
.field-input {
    position: relative;
    margin-bottom: 8px;
}

.title {
    line-height: normal;
    font-size: 13px;
}

.input-wrap {
    position: relative;

    :global(.vc-chrome) {
        position: absolute;
        top: 36px;
        left: 0;
        z-index: 10;
    }
}

.color-brick {
    float: left;
    margin-right: 18px;
    width: 66px;
    height: 29px;
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.input {
    position: relative;
    float: left;
    width: 66px;
    height: 30px;
    border: 1px solid #D5D5D5;
    border-radius: 2px;

    &:first-child {
        margin-right: 18px;
    }

    &.is-focus {
        border-color: #00B5AD;
    }

    input {
        background: none;
        padding-left: 10px;
        height: inherit;
        width: 100%;
        outline: none;
        border: none;

    }

    .placeholder {
        position: absolute;
        top: 5px;
        right: 8px;
        color: #8492A6;
    }
}

.btn-close {
    position: absolute;
    left: 204px;
    top: 6px;
    z-index: 1;
    cursor: pointer;
}
</style>
