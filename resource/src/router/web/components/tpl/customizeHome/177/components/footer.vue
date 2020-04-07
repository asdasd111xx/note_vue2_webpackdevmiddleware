<template>
    <div class="footer-wrap">
        <div class="footer">
            <div class="footer-introduction-wrap clearfix">
                <div class="footer-introduction footer-inside-station">
                    <p>{{ i18nList.stationLink[language] }}</p>
                    <div class="introduction-left-btn">
                        <span
                            @click="changePage({
                                page: 'promotion',
                                type: 'static',
                                config: { linkItem: 'cfd0891aaabe79773e75c753b754fc54f45bc8fe' }
                            })"
                        >
                            {{ i18nList.promotionHall[language] }}
                        </span>
                        <span @click="changePage({ page: 'deposit', type: 'static' })">{{ i18nList.fastDeposit[language] }}</span>
                        <span
                            href="###"
                            @click="changePage({ page: '/mobileBet', type: 'external' })"
                        >
                            {{ i18nList.appDownload[language] }}
                        </span>
                        <span @click="changePage({ page: 'ubb', type: 'static' })">{{ i18nList.ubb[language] }}</span>
                        <span
                            v-if="!loginStatus"
                            href="###"
                            @click="changePage({ page: 'join', type: '' })"
                        >
                            {{ i18nList.nowRegistered[language] }}
                        </span>
                        <span
                            v-if="memInfo.config.agent_register"
                            class="agent-join"
                            @click="changePage({ page: 'joinAgent', type: '' })"
                        >
                            {{ $text('S_AGENT_JOIN', '代理注册') }}
                        </span>
                        <span
                            v-if="memInfo.config.agent_login"
                            class="agent-login"
                            @click="$emit('setPop', { type: 'agLogin' })"
                        >
                            {{ $text('S_AGENT_LOGIN', '代理登入') }}
                        </span>
                    </div>
                    <div class="introduction-right-btn">
                        <span @click="changePage({ page: 468, type: 'custom' })">{{ i18nList.proxyJoin[language] }}</span>
                        <span @click="changePage({ page: 'http://1527dh.com', type: 'external' })">{{ i18nList.brilliantAmusement[language] }}</span>
                        <span @click="changePage({ page: 'http://00hh.bet', type: 'external' })">{{ i18nList.brilliantInternational[language] }}</span>
                        <span @click="changePage({ page: 'http://00hhjt.com', type: 'external' })">{{ i18nList.brilliantGroup[language] }}</span>
                        <span>{{ i18nList.brilliantVIP[language] }}</span>
                    </div>
                </div>
                <div class="footer-introduction footer-novice-help">
                    <p>{{ i18nList.noviceHelp[language] }}</p>
                    <article-links />
                </div>
                <div class="footer-introduction footer-contact-us">
                    <p>{{ i18nList.contactus[language] }}</p>
                    <div
                        class="contact-img-btn"
                        @click="changePage({
                            page: 'https://v60.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=80004305&configID=1594',
                            type: 'external'
                        })"
                    />
                    <span>{{ i18nList.hotline[language] }}：+639561666999</span>
                    <span>{{ i18nList.complaintMail[language] }}：ceo@1527.com</span>
                    <span>{{ i18nList.officialMail[language] }}：hh@1527.com</span>
                    <span>{{ i18nList.proxyMail[language] }}：ag@1527.com</span>
                </div>
                <div class="footer-introduction footer-qrcode-dowload">
                    <p>{{ i18nList.introductionApp[language] }}</p>
                    <div class="qrcode">
                        <qrcode
                            :value="mobilebetLink"
                            :options="{ width: 120, margin: 0 }"
                            tag="img"
                        />
                    </div>
                </div>
            </div>
            <div class="footer-introduction-img">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/177/bbin.png')" class="bbin" />
                <img
                    :src="$getCdnPath('/static/image/tpl/customizeHome/177/ublogo.png')"
                    class="ubb"
                    @click="changePage({ page: 'ubb', type: 'static' })"
                />
            </div>
            <div class="footer-copyright">Copyright © {{ memInfo.config.domain_name[$i18n.locale] }} Reserved.</div>
            <!-- eslint-disable vue/no-v-html -->
            <div class="footer-info" v-html="webInfo.footer[this.$i18n.locale]" />
            <!-- eslint-enable vue/no-v-html -->
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .qrcode[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/f_img02.jpg') }}) no-repeat center top;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import i18nList from '../config/lang';

export default {
    components: {
        articleLinks: () => import(/* webpackChunkName: 'articleLinks' */'./articleLinks')
    },
    data() {
        return {
            i18nList
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            loginStatus: 'getLoginStatus',
            curLang: 'getCurLang',
            memInfo: 'getMemInfo'
        }),
        mobilebetLink() {
            return `${window.location.origin}/mobilebet`;
        },
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        }
    },
    mounted() {
        if (this.isBackEnd) {
            return;
        }

        this.$on('setPop', this.actionSetPop);
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ]),
        changePage(data) {
            if (!this.isBackEnd) {
                this.actionChangePage(data);
            }
        }
    }
};
</script>

<style lang="scss" src="../css/footer.scss" scoped />
