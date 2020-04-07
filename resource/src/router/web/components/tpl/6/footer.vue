<template>
    <div :class="['footer-wrap', webInfo.style_color]">
        <div class="footer">
            <div class="copyright">
                Copyright © {{ memInfo.config.domain_name[$i18n.locale] }} Reserved
            </div>
            <div class="footer-info">
                {{ webInfo.footer[$i18n.locale] }}
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
