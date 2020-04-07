<template>
    <div class="popup-wrap">
        <div class="popup-tab">
            {{ $t('S_MORE') }}
            <img
                :src="$getCdnPath('/static/image/mobile/footer/btn_close.png')"
                class="popup-close"
                @click="$emit('togglePopup')"
            />
        </div>
        <div class="popup-content">
            <template v-for="(link, index) in curSiteInfo">
                <div
                    v-if="link.condition"
                    :key="`link-${index}`"
                    class="item-wrap"
                >
                    <div
                        class="item"
                        @click="link.click"
                    >
                        <div :class="link.className" />
                        {{ link.text }}
                    </div>
                </div>
            </template>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .popup-wrap .popup-content .item div.mcenter-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item img.mcenter-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/member_icon_n.png') }});
            }

            .popup-wrap .popup-content .item div.service-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item img.service-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/service_icon_n.png') }});
            }

            .popup-wrap .popup-content .item div.agent-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item img.agent-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/proxy_icon_n.png') }});
            }

            .popup-wrap .popup-content .item div.app-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item img.app-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/download_icon_n.png') }});
            }

            .popup-wrap .popup-content .item div.lang-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item img.lang-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/language_icon_n.png') }});
            }

            .popup-wrap .popup-content .item div.pc-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item img.pc-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/pc_icon_n.png') }});
            }

            .popup-wrap .popup-content .item div.rebate-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item img.rebate-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/return_icon_n.png') }});
            }

            .popup-wrap .popup-content .item div.logout-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item img.logout-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/signout_icon_n.png') }});
            }

            /* active */
            .popup-wrap .popup-content .item:active .mcenter-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item:active .mcenter-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/member_icon_h.png') }});
            }

            .popup-wrap .popup-content .item:active .service-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item:active .service-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/service_icon_h.png') }});
            }

            .popup-wrap .popup-content .item:active .agent-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item:active .agent-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/proxy_icon_h.png') }});
            }

            .popup-wrap .popup-content .item:active .app-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item:active .app-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/download_icon_h.png') }});
            }

            .popup-wrap .popup-content .item:active .lang-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item:active .lang-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/language_icon_h.png') }});
            }

            .popup-wrap .popup-content .item:active .pc-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item:active .pc-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/pc_icon_h.png') }});
            }

            .popup-wrap .popup-content .item:active .rebate-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item:active .rebate-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/return_icon_h.png') }});
            }

            .popup-wrap .popup-content .item:active .logout-img[{{ this.$options._scopeId }}],
            .popup-wrap .popup-content .item:active .logout-img[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/signout_icon_h.png') }});
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import member from '@/api/member';
import * as apiUrl from '@/config/api';
import exceptionList from '@/config/exceptionList';
import ajax from '@/lib/ajax';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import mobileOpenLink from '@/lib/mobile_link_open';

export default {
    props: {
        popup: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            memInfo: 'getMemInfo',
            onlineService: 'getOnlineService',
            mobileInfo: 'getMobileInfo',
            webInfo: 'getWebInfo',
            appInfo: 'getAppInfo'
        }),
        mOfferData() {
            if (!this.mobileInfo.mOffer) {
                return [];
            }
            return this.mobileInfo.mOffer.data.filter((obj) => obj.isOpen === '1');
        },
        // 特例判斷
        isException() {
            const { wonderCasino, knightCasino } = exceptionList;
            return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
        },
        curSiteInfo() {
            const siteInfo = {
                mcenter: {
                    condition: this.loginStatus,
                    className: 'mcenter-img',
                    text: this.$t('S_MEM_CENTER'),
                    click: this.onMCenter
                },
                service: {
                    condition: this.mOfferData.length > 0 && this.onlineService.url,
                    className: 'service-img',
                    text: this.$t('S_CUSTOMER_SERVICE_ONLINE'),
                    click: this.onServiceClick
                },
                agLogin: {
                    condition: this.memInfo.config.agent_login,
                    className: 'agent-img',
                    text: this.$t('S_AGENT_LOGIN'),
                    click: this.onAgentLogin
                },
                appDownload: {
                    condition: true,
                    className: 'app-img',
                    text: this.$t('S_APP_DOWNLOAD'),
                    click: this.onMobileBet
                },
                changeLang: {
                    condition: true,
                    className: 'lang-img',
                    text: this.$t('S_CHANGE_LANG'),
                    click: this.onChangeLang
                },
                pc: {
                    condition: true,
                    className: 'pc-img',
                    text: this.$t('S_PC'),
                    click: this.onLocatePc
                },
                rebate: {
                    condition: this.loginStatus,
                    className: 'rebate-img',
                    text: this.$t('S_MYREBATE'),
                    click: this.onRebate
                },
                logout: {
                    condition: this.loginStatus,
                    className: 'logout-img',
                    text: this.$t('S_LOGOUT'),
                    click: this.onLogout
                }
            };
            const basic = ['mcenter', 'service', 'agLogin', 'appDownload', 'changeLang', 'pc', 'rebate', 'logout'];
            const japanException = ['mcenter', 'changeLang', 'pc', 'agLogin', 'logout'];
            const curSite = this.isException ? japanException : basic;

            return curSite.map((info) => siteInfo[info]);
        }
    },
    methods: {
        ...mapActions([
            'actionSetPop',
            'actionSetUserdata',
            'actionEnterMCenterThirdPartyLink',
            'actionSetCollectionStatus'
        ]),
        mobileOpenLink,
        onServiceClick() {
            this.mobileOpenLink({ linkType: 'static', linkTo: 'service' });
        },
        onAgentLogin() {
            if (this.loginStatus) {
                if (window.confirm(this.$t('S_LOGOUT_AGENT_CONFIRM'))) {
                    member.logout({
                        success: () => {
                            this.actionSetUserdata(true);
                            this.$router.push('/mobile/agLogin');
                        }
                    });
                }
                return;
            }
            this.$router.push('/mobile/agLogin');
        },
        onMobileBet() {
            if (this.loginStatus || this.appInfo.downloadInfo.unsafe_download) {
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
        onChangeLang() {
            this.$router.push('/mobile/changeLang');
        },
        onLocatePc() {
            this.$cookie.set('pc', 1);
            this.actionSetCollectionStatus(false);
            // this.$router.push('/');
            window.location = '/';
        },
        onRebate() {
            this.actionEnterMCenterThirdPartyLink({ type: 'member', page: 'bankRebate' }).then((pageName) => {
                if (pageName) {
                    mcenterPageAuthControl(pageName).then((response) => {
                        if (response && response.status) {
                            this.$router.push(`/mobile/mcenter/${pageName}`);
                        }
                    });
                }
            });
        },
        onLogout() {
            member.logout().then(() => { window.location.reload(); });
        },
        onMCenter() {
            this.$router.push('/mobile/mcenter');
        }
    }
};
</script>

<style src="../../css/footer/popupMore.scss" lang="scss" scoped></style>
