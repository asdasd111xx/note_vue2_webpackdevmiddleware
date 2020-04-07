<template>
    <div :class="$style['site-copyright']">
        <slot name="side-control" />
        <slot name="field-z-index" />
        <slot name="field-vector" />
        <slot name="field-box" />
    </div>
</template>

<script>

export default {
    props: {
        selectedIndex: {
            type: Number,
            required: true
        },
        caseData: {
            type: Array,
            default: () => []
        },
        status: {
            type: Object,
            required: true
        },
        updateCase: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            element: null
        };
    }
};
</script>

<style module>
.site-copyright {}
</style>
