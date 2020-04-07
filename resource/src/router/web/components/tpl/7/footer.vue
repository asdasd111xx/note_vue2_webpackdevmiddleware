<template>
    <div class="footer-wrap">
        <div class="footer clearfix">
            <div class="footer-left-text-wrap">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div class="footer-info" v-html="webInfo.footer[$i18n.locale]" />
                <div class="footer-copyright">Copyright © {{ memInfo.config.domain_name[$i18n.locale] }} Reserved.</div>
            </div>
            <div v-if="webInfo.footer_img" class="footer-img-wrap">
                <img :src="`${API_CDN}${webInfo.footer_img}`" />
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { API_CDN } from '@/config/api';

export default {
    data() {
        return {
            API_CDN
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo'
        })
    }
};
</script>

<style lang="scss" src="./css/footer.scss" scoped></style>
