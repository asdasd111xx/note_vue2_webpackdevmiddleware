<template>
    <div class="tpl-wrap clearfix">
        <custom-links :element="element" :config="config" />
        <custom-image :element="element" :config="config" />
    </div>
</template>

<script>
import customLinks from './customLinks';
import customImage from './customImage';

export default {
    components: {
        customLinks,
        customImage
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => {}
        }
    }
};
</script>

<style lang="scss" scoped>
.tpl-wrap {
    position: relative;
    padding: 36px 0 32px;
    text-align: center;
}
</style>
