<template>
    <div class="footer">
        <!-- 日本站特例 庫拉索徽章 -->
        <div
            v-if="isException && !isBackEnd"
            id="apg-9c6a14f9-57f6-4463-a828-4f083c8395a1"
            class="jp-apg"
            data-apg-seal-id="9c6a14f9-57f6-4463-a828-4f083c8395a1"
            data-apg-image-size="70"
            data-apg-image-type="basic-small"
        />
        <div class="copyright">
            Copyright © {{ memInfo.config.domain_name[$i18n.locale] }} Reserved
        </div>
        <div class="footer-info">
            {{ webInfo.footer[$i18n.locale] }}
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import exceptionList from '@/config/exceptionList';

export default {
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            isBackEnd: 'getIsBackEnd'
        }),
        // 日本站特例判斷
        isException() {
            const { wonderCasino } = exceptionList;
            return wonderCasino.includes(this.webInfo.alias);
        }
    },
    mounted() {
        if (this.isException && !this.isBackEnd) {
            window.apg_9c6a14f9_57f6_4463_a828_4f083c8395a1.init();
        }
    }
};
</script>

<style lang="scss" src="./css/footer.scss" scoped></style>
