<template>
    <div class="promotion-btn">
        <span
            v-if="mOfferData.length > 0"
            :class="{ 'is-active': mOfferData.length >= 2 && popup === 'promotion' }"
            @click="onOpenView"
        >
            <img v-show="popup === 'promotion'" :src="$getCdnPath(`/static/image/mobile/footer/${(mOfferData.length === 1) ? mOfferData[0].id : 'promotion'}_icon_h.png`)" />
            <img v-show="popup !== 'promotion'" :src="$getCdnPath(`/static/image/mobile/footer/${(mOfferData.length === 1) ? mOfferData[0].id : 'promotion'}_icon_n.png`)" />
            {{ pageTitle }}
        </span>
        <span
            v-else-if="isException"
            class="item-btn"
            @click="onPromotionsClick"
        >
            <img :src="$getCdnPath('/static/image/mobile/footer/0_icon_n.png')" />
            {{ $t('S_PROMOTIONS_3') }}
        </span>
        <span
            v-else-if="onlineService.url"
            class="item-btn"
            @click="onServiceClick"
        >
            <img :src="$getCdnPath('/static/image/mobile/footer/service_icon_n.png')" />
            {{ $t('S_CUSTOMER_SERVICE_ONLINE') }}
        </span>
        <span
            v-else-if="!loginStatus"
            class="item-btn"
            @click="onMobileBet"
        >
            <img :src="$getCdnPath('/static/image/mobile/footer/download_icon_n.png')" />
            {{ $t('S_APP_DOWNLOAD') }}
        </span>
        <span
            v-else-if="!loginStatus && !app_unsafe_download"
            class="item-btn"
            @click="onLocatePc"
        >
            <img :src="$getCdnPath('/static/image/mobile/footer/pc_icon_n.png')" />
            {{ $t('S_PC') }}
        </span>
        <span
            v-else-if="loginStatus"
            class="item-btn"
            @click="onMcenterRebate"
        >
            <img :src="$getCdnPath('/static/image/mobile/footer/return_icon_n.png')" />
            {{ $t('S_MYREBATE') }}
        </span>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import * as apiUrl from '@/config/api';
import ajax from '@/lib/ajax';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import mobileOpenLink from '@/lib/mobile_link_open';

export default {
    props: {
        popup: {
            type: String,
            default: ''
        },
        togglePopup: {
            type: Function,
            default: () => {}
        },
        isException: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            app_unsafe_download: false
        };
    },
    computed: {
        ...mapGetters({
            onlineService: 'getOnlineService',
            webInfo: 'getWebInfo',
            mobileInfo: 'getMobileInfo',
            loginStatus: 'getLoginStatus'
        }),
        mOfferData() {
            if (!this.mobileInfo.mOffer) {
                return [];
            }

            return this.mobileInfo.mOffer.data.filter((obj) => obj.isOpen === '1');
        },
        pageTitle() {
            if (this.mOfferData.length === 1) {
                return this.mOfferData[0].pageTitle || this.mOfferData[0].name;
            }

            return this.$i18n.t('S_PROMOTION');
        }
    },
    created() {
        // 抓取平台APP資訊
        ajax({
            method: 'get',
            url: apiUrl.API_GETAPPINFO,
            errorAlert: false,
            success: (response) => {
                this.app_unsafe_download = response.ret.unsafe_download;
            }
        });
    },
    methods: {
        ...mapActions([
            'actionEnterMCenterThirdPartyLink',
            'actionSetCollectionStatus'
        ]),
        mobileOpenLink,
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
        },
        /**
         * 開啟在線客服
         * @method onServiceClick
         */
        onServiceClick() {
            this.mobileOpenLink({ linkType: 'static', linkTo: 'service' });
        },
        onOpenView() {
            if (this.mOfferData.length >= 2) {
                this.togglePopup('promotion');
                return;
            }
            this.onGoPage({ openType: this.mOfferData[0].openType, promoId: this.mOfferData[0].id });
        },
        onPromotionsClick() {
            window.open('https://wonder-official-blog.com/category/promotion/', 'mobile promotions');
        },
        onMobileBet() {
            if (this.loginStatus || this.app_unsafe_download) {
                const win = window.open('');
                ajax({
                    method: 'post',
                    url: apiUrl.API_QRCODE,
                    params: {
                        path: 'mobileBet'
                    },
                    errorAlert: false,
                    success: (response) => {
                        win.location = response.ret.url;
                    }
                });
                return;
            }
            this.$router.push('/mobile/login');
        },
        onLocatePc() {
            this.$cookie.set('pc', 1);
            this.actionSetCollectionStatus(false);
            window.location = '/';
        },
        onMcenterRebate() {
            this.actionEnterMCenterThirdPartyLink({ type: 'member', page: 'bankRebate' }).then((pageName) => {
                if (pageName) {
                    mcenterPageAuthControl(pageName).then((response) => {
                        if (response && response.status) {
                            this.$router.push(`/mobile/mcenter/${pageName}`);
                            return;
                        }
                        this.$router.push('/mobile/mcenter');
                    });
                }
            });
        }
    }
};
</script>

<style src="../../css/footer/mFooter.scss" lang="scss" scoped></style>
