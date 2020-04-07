<template>
    <div class="popup-wrap">
        <div class="popup-tab">
            {{ $t('S_PROMOTION') }}
            <img
                :src="$getCdnPath('/static/image/mobile/footer/btn_close.png')"
                class="popup-close"
                @click="$emit('togglePopup')"
            />
        </div>
        <div class="popup-content">
            <div
                v-for="mOfferInfo in mOfferData"
                :key="`mobile-${mOfferInfo.id}`"
                class="item-wrap"
            >
                <div
                    class="item"
                    @click="onGoPage({ openType: mOfferInfo.openType, promoId: mOfferInfo.id })"
                >
                    <img :src="$getCdnPath(`/static/image/mobile/footer/${mOfferInfo.id}_icon_n.png`)" class="imgout" />
                    <img :src="$getCdnPath(`/static/image/mobile/footer/${mOfferInfo.id}_icon_h.png`)" class="imgin" />
                    {{ mOfferInfo.pageTitle || mOfferInfo.name }}
                </div>
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
            mobileInfo: 'getMobileInfo'
        }),
        mOfferData() {
            return this.mobileInfo.mOffer.data.filter((obj) => obj.isOpen === '1');
        }
    },
    methods: {
        /**
         * 跳轉頁面
         * @method onGoPage
         * @param {string} openType - 開啟方式
         * @param {string} path - 連結
         */
        onGoPage({ openType, promoId }) {
            // 優惠
            if (openType === 'static') {
                this.$router.push('/mobile/promotion');
                return;
            }

            // 優小秘
            if (openType === 'external') {
                window.open(`/popcontrol/promo/${JSON.stringify({ linkItem: promoId })}`, 'promotion');
            }
        }
    }
};
</script>

<style src="../../css/footer/popupMore.scss" lang="scss" scoped />
