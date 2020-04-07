<template>
    <div :class="['header-wrap', webInfo.style_color, isBackEnd ? 'back' : 'front']">
        <div class="header">
            <div class="header-top-wrap clearfix">
                <div class="header-top-link">
                    <div
                        v-for="(linksInfo, index) in linksData"
                        :key="`links-${index}`"
                        class="header-link"
                    >
                        <span :class="['custom_link', linksInfo.linkName]" @click="changePage(linksInfo)">{{ linksInfo.title[language] }}</span>
                        <span v-if="linksData.length - 1 !== index">|</span>
                    </div>
                </div>
                <div class="header-top-feature">
                    <!-- 語系 -->
                    <lang-select :theme="'2'" />
                    <span class="spare-url">{{ i18nList.spareUrl[language] }}</span>
                    <!-- 最新消息 -->
                    <div class="news-wrap">
                        <ele-news :speed="200" direction="up" />
                    </div>
                </div>
                <!-- logo -->
                <ele-logo :logo-width="284" :logo-height="100" />
                <div class="title-img" />
            </div>
            <div class="header-bottom-wrap clearfix">
                <div class="header-nav-wrap clearfix">
                    <!-- 導覽列 -->
                    <custom-nav />
                </div>
                <div :class="['header-login-wrap', loginStatus ? 'is-login' : '']">
                    <template v-if="!loginStatus">
                        <ele-login-form
                            :theme="1"
                            :is-show-pw-forget="true"
                            :prompt-status="promptStatus"
                            login-text=" "
                        />
                        <div class="header-register-wrap">
                            <!-- 加入會員 -->
                            <span
                                :title="$t('S_FREE_MEMBER_OPEN')"
                                class="links-join"
                                @click="$emit('changePage', { pageType: { page: 'join', type: '' } })"
                            />
                        </div>
                    </template>
                    <ele-login-info
                        v-else
                        :theme="1"
                        :mcenter-item-list="mcenterItemList"
                        :logout-text="$text('S_LOGOUT')"
                    />
                    <div class="header-agent-wrap">
                        <!-- 立即加盟 -->
                        <span
                            v-if="memInfo.config.agent_register"
                            :title="$text('S_CEP_JOINAGENT', '立即加盟')"
                            class="links-join-us"
                            @click="$emit('changePage', { pageType: { page: 'joinAgent', type: '' } })"
                        />
                        <!-- 代理登入 -->
                        <span
                            v-if="memInfo.config.agent_login"
                            :title="$text('S_AGENT_LOGIN', '代理登入')"
                            class="links-agent-login"
                            @click="$emit('setPop', { type: 'agLogin' })"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .header-bottom-wrap[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/header_bg.png') }}) 0 0 no-repeat;
            }

            .header-register-wrap .links-join[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/btn_regist.png') }}) 50% 0 no-repeat;
            }

            .header-agent-wrap .links-join-us[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/btn_joinus.png') }}) 50% 0 no-repeat;
            }

            .header-agent-wrap .links-agent-login[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/btn_agentlogin.png') }}) 50% 0 no-repeat;
            }

            /* 語系 */
            .lang-wrap[{{ this.$options._scopeId }}] .lang-item {
                background: url({{ $getCdnPath('/static/image/lang/flag/square/square1.png') }}) 0 0/contain no-repeat;
            }

            /* 最新消息 */
            .news-wrap[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/news_bg.png') }}) 50% 0 no-repeat;
            }

            /* title圖片 */
            .title-img[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath(`/static/image/tpl/8/lang/${curLang}/title_${titleImgData}.png`) }}) 50% 0 no-repeat;
            }

            /* 導覽列 */
            .nav-wrap[{{ this.$options._scopeId }}] .nav-item-wrap .nav-item.current,
            .nav-wrap[{{ this.$options._scopeId }}] .nav-item-wrap .nav-item:hover {
                background: url({{ $getCdnPath('/static/image/tpl/8/nav_over.png') }}) 50% 0 no-repeat;
            }

            /* 登入前 */
            .login-form-wrap[{{ this.$options._scopeId }}] .login-unit {
                background: url({{ $getCdnPath('/static/image/tpl/8/input_bg01.png') }}) 50% 0 no-repeat;
            }

            .login-form-wrap[{{ this.$options._scopeId }}] .login-unit-captcha {
                background: url({{ $getCdnPath('/static/image/tpl/8/input_bg02.png') }}) 50% 0 no-repeat;
            }

            .login-form-wrap[{{ this.$options._scopeId }}] .login-submit {
                background: url({{ $getCdnPath('/static/image/tpl/8/btn_login.png') }}) 50% 0 no-repeat;
            }

            /* 登入後 */
            .login-info-wrap[{{ this.$options._scopeId }}] .login-info-links span.logout {
                background: url({{ $getCdnPath('/static/image/tpl/8/btn05.png') }}) 50% 100% no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import i18nList from './config/lang';
import eleLogo from '../../../common/logo';
import langSelect from '../../../common/langSelect';
import eleNews from '../../../common/news';
import eleLoginForm from '../../common/header/login_form';
import eleLoginInfo from '../../common/header/login_info';
import customNav from './nav';

export default {
    components: {
        eleLogo,
        eleNews,
        langSelect,
        eleLoginForm,
        eleLoginInfo,
        customNav
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
            memInfo: 'getMemInfo',
            loginStatus: 'getLoginStatus',
            nowpage: 'getNowpage',
            curLang: 'getCurLang'
        }),
        titleImgData() {
            if (this.nowpage === 6474 || this.nowpage === 6470 || this.nowpage === 19930
                || this.nowpage === 6073 || this.nowpage === 6088 || this.nowpage === 17723
                || this.nowpage === 5235 || this.nowpage === 5618 || this.nowpage === 17691
                || this.nowpage === 'casino') {
                return 'game';
            }

            if (this.nowpage === 5263 || this.nowpage === 5646 || this.nowpage === 17715) {
                return 'card';
            }

            if (this.nowpage === 5227 || this.nowpage === 5610 || this.nowpage === 17685) {
                return 'live';
            }

            if (this.nowpage === 6476 || this.nowpage === 6370 || this.nowpage === 19533) {
                return 'lottery';
            }

            if (this.nowpage === 'mcenter') {
                return 'member';
            }

            if (this.nowpage === 'promotion') {
                return 'promotions';
            }

            if (this.nowpage === 5256 || this.nowpage === 5639 || this.nowpage === 17711) {
                return 'sports';
            }

            return 'welcome';
        },
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        },
        mcenterItemList() {
            return {
                accountData: {
                    text: 'S_MEM_CENTER',
                    hasLine: true
                },
                deposit: {
                    text: 'S_ONLINE_DEPOSIT',
                    hasLine: true
                },
                withdraw: {
                    text: 'S_ONLINE_WITHDRAW',
                    hasLine: true
                },
                bankBalanceTran: {
                    text: 'S_CREDIT_CONVERSION',
                    hasLine: false
                }
            };
        },
        linksData() {
            let cardPid;
            if (this.webInfo.alias === '30') {
                cardPid = 5263;
            }

            if (this.webInfo.alias === '32') {
                cardPid = 5646;
            }

            if (this.webInfo.alias === '177') {
                cardPid = 17715;
            }

            return [
                {
                    title: i18nList.customizeLink01,
                    linkName: 'vip',
                    pageType: {
                        page: '',
                        type: 'custom'
                    }
                },
                {
                    title: i18nList.customizeLink02,
                    linkName: 'rebate',
                    pageType: {
                        page: 'mcenter',
                        type: ''
                    },
                    mcenterPage: 'bankRebate'
                },
                {
                    title: i18nList.customizeLink03,
                    linkName: 'card',
                    pageType: {
                        page: cardPid,
                        type: 'custom'
                    }
                },
                {
                    title: i18nList.customizeLink04,
                    linkName: 'candy',
                    pageType: {
                        page: 'bbcasino',
                        type: 'games',
                        config: {
                            linkItem: '5902'
                        }
                    }
                }
            ];
        },
        promptStatus() {
            let pid;
            if (this.webInfo.alias === '30') {
                pid = 6050;
            }

            if (this.webInfo.alias === '32') {
                pid = 6058;
            }

            if (this.webInfo.alias === '177') {
                pid = 17732;
            }

            return {
                isShow: true,
                pid
            };
        }
    },
    mounted() {
        // 前台才動作
        if (!this.isBackEnd) {
            this.$on('setPop', this.setPop);
            this.$on('changePage', this.changePage);
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ]),
        setPop(data) {
            this.actionSetPop(data);
        },
        changePage(pageInfo) {
            if (this.isBackEnd) {
                return;
            }

            if (pageInfo.pageType.page === 'mcenter') {
                if (!this.loginStatus) {
                    alert(this.$i18n.t('S_LOGIN_TIPS'));
                    return;
                }
                this.actionChangePage({ page: 'mcenter', type: '', subPage: pageInfo.mcenterPage });
                return;
            }
            this.actionChangePage(pageInfo.pageType);
        }
    }
};
</script>

<style lang="scss" src="./css/header.scss" scoped></style>
