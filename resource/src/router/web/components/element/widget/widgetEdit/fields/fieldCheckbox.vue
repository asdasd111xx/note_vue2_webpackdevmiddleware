<template>
    <div :class="mainClass">
        <input v-model="v" type="checkbox" />
        <label>{{ title }}</label>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        value: {
            type: [String, Boolean],
            required: true
        }
    },
    computed: {
        mainClass() {
            return [
                'ui',
                'checkbox',
                { checked: this.title }
            ];
        },
        v: {
            get() {
                if (typeof this.value === 'string') {
                    return this.value === 'Y';
                }

                return this.value;
            },
            set(val) {
                if (typeof this.value === 'string') {
                    this.$emit('update:value', val ? 'Y' : 'N');
                    return;
                }

                this.$emit('update:value', val);
            }
        }
    }
};
</script>
