<template>
    <component
        :is="tpl"
        :theme="theme"
        :check-item.sync="item"
        :on-login="onLogin"
    />
</template>

<script>
export default {
    components: {
        template1: () => import(/* webpackChunkName: 'template1' */'./components/template1'),
        template2: () => import(/* webpackChunkName: 'template2' */'./components/template2')
    },
    props: {
        tpl: {
            type: String,
            default: 'template1'
        },
        theme: {
            type: Object,
            default: null
        },
        checkItem: {
            type: String,
            required: true
        },
        onLogin: {
            type: Function,
            required: true
        }
    },
    computed: {
        item: {
            get() {
                return this.checkItem;
            },
            set(value) {
                this.$emit('update:checkItem', value);
            }
        }
    }
};
</script>
