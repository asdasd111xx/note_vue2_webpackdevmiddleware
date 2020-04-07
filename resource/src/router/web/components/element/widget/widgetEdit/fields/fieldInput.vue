<template>
    <div>
        <div v-if="title">{{ title }}</div>
        <div class="ui small input">
            <input
                ref="input"
                :value="value"
                type="text"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
            />
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
            type: [String, Number],
            required: true
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
    methods: {
        handleInput(e) {
            const { value } = e.target;

            if (this.onInput) {
                this.onInput(value);
                return;
            }

            this.$emit('update:value', value);
        },
        handleFocus(e) {
            if (this.onFocus) {
                this.onFocus(e);
            }
        },
        handleBlur(e) {
            if (this.onBlur) {
                this.onBlur(e);
            }
        }
    }
};
</script>
