<template>
    <div class="footer-wrap">
        <div class="footer clearfix">
            <div class="footer-info-wrap">
                <div class="footer-copyright">Copyright © {{ memInfo.config.domain_name[$i18n.locale] }} Reserved.</div>
                <!-- eslint-disable vue/no-v-html -->
                <div class="footer-info" v-html="webInfo.footer[$i18n.locale]" />
                <!-- eslint-enable vue/no-v-html -->
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

<style lang="scss" src="./css/footer.scss" scoped></style>
