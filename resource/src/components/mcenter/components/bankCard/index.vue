<template>
    <div :class="`account-bank-card ${isMobileStyle}`">
        <iframe
            id="js-set-height"
            :src="!onlineService.url ? '/payment/user_bank' : `/payment/user_bank?url=${encodeURIComponent(onlineService.url)}`"
            height="500"
            frameborder="0"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import isMobile from '@/lib/is_mobile';

export default {
    computed: {
        ...mapGetters({
            onlineService: 'getOnlineService'
        }),
        isMobileStyle() {
            return isMobile() ? 'is-mobile' : '';
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
