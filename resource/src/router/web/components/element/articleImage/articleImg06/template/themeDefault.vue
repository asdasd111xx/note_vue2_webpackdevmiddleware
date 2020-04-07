<template>
    <div class="tpl-wrap clearfix">
        <custom-text :element="element" :config="config" />
        <custom-links :element="element" :config="config" />
        <custom-contact :element="element" :config="config" />
        <custom-recommand-browsers :element="element" :config="config" />
    </div>
</template>

<script>
import customText from '../components/customText';
import customLinks from '../components/customLinks';
import customContact from '../components/customContact';
import customRecommandBrowsers from '../components/customRecommandBrowsers';

export default {
    components: {
        customText,
        customLinks,
        customContact,
        customRecommandBrowsers
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        }
    }
};
</script>
