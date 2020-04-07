<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['qrcode-wrap']">
            <div :class="$style['qrcode-container']">
                <div :class="$style['qrcode-img']">
                    <img :class="$style.qrcode" :src="mobileBetImage" />
                    <div v-if="!qrcodeStatus" :class="$style['qrcode-tips']">{{ $text('S_LOGIN_DOWNLOAD', '请登入下载') }}</div>
                    <div @click="openMobileBet">
                        <img src="/static/image/tpl/customizeHome/71/body/qrcode_text.png" />
                    </div>
                </div>
                <div :class="$style['qrcode-img']">
                    <img :class="$style.qrcode" :src="mobileBetImage" />
                    <div v-if="!qrcodeStatus" :class="$style['qrcode-tips']">{{ $text('S_LOGIN_DOWNLOAD', '请登入下载') }}</div>
                    <div @click="openMobileBet">
                        <img src="/static/image/tpl/customizeHome/71/body/qrcode_text.png" />
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style['links-wrap']">
            <div :class="$style['links-container']">
                <div
                    v-for="(link, index) in linkArr"
                    :key="index"
                    :class="$style['img-wrap']"
                    @click="changePage(link)"
                >
                    {{ link.text }}
                </div>
            </div>
        </div>
        <div :class="$style['copy-wrap']">
            <div :class="$style['copy-container']">
                <div :class="$style['copy-text']">
                    <img src="/static/image/tpl/customizeHome/71/body/footer_info.png" />
                </div>
                <div :class="$style['copy-info']">
                    <img :class="$style['copy-info-title']" src="/static/image/tpl/customizeHome/71/body/footer_info_title01.png" />
                    <img :class="$style['img-bbin']" src="/static/image/tpl/customizeHome/71/body/bbin.png" />
                    <img :class="$style['img-gli']" src="/static/image/tpl/customizeHome/71/body/gli.png" />
                </div>
                <div :class="$style['copy-info']">
                    <img :class="$style['copy-info-title']" src="/static/image/tpl/customizeHome/71/body/footer_info_title02.png" />
                    <img :class="$style['img-payment']" src="/static/image/tpl/customizeHome/71/body/footer_info_payment.png" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import updateQrcode from '@/lib/qrocodeUpdate';

export default {
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            appInfo: 'getAppInfo',
            pageData: 'getPageData'
        }),
        qrcodeStatus() {
            return this.loginStatus || this.appInfo.downloadInfo.unsafe_download;
        },
        mobileBetImage() {
            if (this.qrcodeStatus) {
                return this.appInfo.qrcode.qrcode;
            }

            return this.$getCdnPath('/static/image/mobileBet/qr.png');
        },
        linkArr() {
            const linkList = {};
            Object.keys(this.pageData).forEach((page) => {
                if (page === '13779') { // 公司簡介
                    linkList.company = {
                        ...this.pageData[page],
                        text: this.$text('S_COMPANY_PROFILE_1', '公司介绍')
                    };
                }

                if (page === '13781') { // 聯絡我們
                    linkList.contact = {
                        ...this.pageData[page],
                        text: this.$text('S_CONTACT_US', '联系我们')
                    };
                }

                if (page === '13783') { // 合作夥伴
                    linkList.partner = {
                        ...this.pageData[page],
                        text: this.$text('S_COOPERATION_PARTNER', '合作夥伴')
                    };
                }

                if (page === '13784') { // 存款幫助
                    linkList.deposit = {
                        ...this.pageData[page],
                        text: this.$text('S_DEPOSIT_HELP', '存款帮助')
                    };
                }

                if (page === '13785') { // 取款幫助
                    linkList.withdraw = {
                        ...this.pageData[page],
                        text: this.$text('S_WITHDRAW_HELP', '取款帮助')
                    };
                }

                if (page === '13786') { // 常見問題
                    linkList.question = {
                        ...this.pageData[page],
                        text: this.$text('S_COMMON_QUESTION', '常见问题')
                    };
                }

                if (page === '13787') { // 條款與細則
                    linkList.terms = {
                        ...this.pageData[page],
                        text: this.$text('S_TERMS_CONDITIONS', '条款与细则')
                    };
                }
            });

            return [
                linkList.company,
                linkList.contact,
                linkList.partner,
                linkList.deposit,
                linkList.withdraw,
                linkList.question,
                linkList.terms
            ];
        }
    },
    created() {
        if (this.isBackEnd) {
            return;
        }

        if (!this.loginStatus) {
            this.actionSetAppQrcode();
            return;
        }

        updateQrcode.update();
    },
    beforeDestroy() {
        if (this.isBackEnd || !this.loginStatus) {
            return;
        }

        clearTimeout(updateQrcode.timer);
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetAppQrcode'
        ]),
        changePage(pageInfo) {
            if (!this.isBackEnd) {
                this.actionChangePage({
                    page: pageInfo.pid,
                    type: pageInfo.page_type,
                    config: {
                        linkItem: pageInfo.linkItem
                    }
                });
            }
        },
        openMobileBet() {
            window.open('/mobileBet', 'mobileBet');
        }
    }
};
</script>

<style lang="scss" src="../css/bottom.module.scss" module></style>
