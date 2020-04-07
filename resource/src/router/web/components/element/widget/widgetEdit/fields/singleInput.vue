<template>
    <div :class="$style['field-input']">
        <div :class="$style.title">{{ title }}</div>
        <div :class="[$style.input, isFocus === 0 ? $style['is-focus'] : '']">
            <input
                ref="input"
                :value="value"
                type="text"
                maxlength="4"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
            />
            <div :class="$style.placeholder">{{ placeholder[0] }}</div>
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
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            default: ''
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
            isFocus: false
        };
    },
    methods: {
        handleInput(e) {
            const value = +e.target.value;

            if (this.onInput) {
                this.onInput(e);
                return;
            }

            this.$emit('update:value', value);
        },
        handleFocus(e) {
            this.isFocus = true;

            if (this.onFocus) {
                this.onFocus(e);
            }
        },
        handleBlur(e) {
            this.isFocus = false;

            if (this.onBlur) {
                this.onBlur(e);
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
