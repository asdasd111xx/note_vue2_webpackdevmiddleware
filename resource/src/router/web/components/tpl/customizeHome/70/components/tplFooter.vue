<template>
    <div :class="$style['footer-wrap']">
        <div :class="[$style['footer'], 'clearfix']">
            <div :class="$style['footer-info-wrap']">
                <div :class="$style['footer-copyright']">Copyright © {{ memInfo.config.domain_name[$i18n.locale] }} Reserved.</div>
                <div :class="$style['footer-info']" v-html="webInfo.footer[$i18n.locale]" />
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo'
        })
    }
};
</script>

<style lang="scss" src="../css/tplFooter.module.scss" module></style>
