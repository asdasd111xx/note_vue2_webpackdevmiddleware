<template>
    <div :class="$style['field-input']">
        <div :class="$style.title">{{ title }}</div>
        <div :class="[$style['input-wrap'], 'clearfix']">
            <div :class="[$style.input, nowFocus === 0 ? $style['is-focus'] : '']">
                <input
                    ref="input"
                    :value="value[0]"
                    :disabled="disabled"
                    type="text"
                    maxlength="4"
                    @input="handleInput($event, 0)"
                    @focus="handleFocus($event, 0)"
                    @blur="handleBlur($event, 0)"
                />
                <div :class="$style.placeholder">{{ placeholder[0] }}</div>
            </div>
            <slot name="icon" />
            <div :class="[$style.input, nowFocus === 1 ? $style['is-focus'] : '']">
                <input
                    ref="input"
                    :value="value[1]"
                    :class="nowFocus === 1 ? $style['is-focus'] : ''"
                    :disabled="disabled"
                    type="text"
                    maxlength="4"
                    @input="handleInput($event, 1)"
                    @focus="handleFocus($event, 1)"
                    @blur="handleBlur($event, 1)"
                />
                <div :class="$style.placeholder">{{ placeholder[1] }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        value: {
            type: Array,
            required: true
        },
        placeholder: {
            type: Array,
            default: () => ['', '']
        },
        disabled: {
            type: Boolean,
            default: false
        },
        onInput: {
            type: Function,
            default: null
        },
        onFocus: {
            type: Function,
            default: null
        },
        onBlur: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            nowFocus: null
        };
    },
    methods: {
        handleInput(e, index) {
            const value = +e.target.value;

            if (this.onInput) {
                this.onInput(e, index);
                return;
            }

            this.$emit('update:value', this.value.map((v, i) => {
                if (i === index) {
                    return value;
                }
                return v;
            }));
        },
        handleFocus(e, index) {
            this.nowFocus = index;

            if (this.onFocus) {
                this.onFocus(e, index);
            }
        },
        handleBlur(e, index) {
            this.nowFocus = null;

            if (this.onBlur) {
                this.onBlur(e, index);
            }
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
</style>
