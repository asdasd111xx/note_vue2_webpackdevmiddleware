<template>
    <div :class="['header-wrap', webInfo.style_color]">
        <eleFixed>
            <div class="header">
                <div class="header-top-wrap clearfix">
                    <!-- logo -->
                    <ele-logo :logo-width="200" :logo-height="120" />
                    <div class="header-right clearfix">
                        <div class="header-right-top">
                            <!-- 最新消息 -->
                            <div class="news-wrap">
                                <ele-news />
                            </div>
                            <div class="agent-link-wrap clearfix">
                                <!-- 代理登入 -->
                                <span
                                    v-if="memInfo.config.agent_login"
                                    :title="$t('S_AGENT_LOGIN')"
                                    class="agent-login"
                                    @click="$emit('setPop', { type: 'agLogin' })"
                                >
                                    {{ $t('S_AGENT_LOGIN') }}
                                </span>
                                <!-- 立即加盟 -->
                                <span
                                    v-if="memInfo.config.agent_register"
                                    :title="$t('S_CEP_JOINAGENT')"
                                    class="agent-join"
                                    @click="$emit('changePage', { page: 'joinAgent', type: '' })"
                                >
                                    {{ $t('S_CEP_JOINAGENT') }}
                                </span>
                            </div>
                        </div>
                        <div class="header-middle">
                            <!-- 導覽列 -->
                            <ele-nav
                                :theme="1"
                                :nav-max="9"
                                :icon-width="14"
                                :icon-height="14"
                                icon-type="plus"
                            />
                            <!-- 語系 -->
                            <ele-lang :theme="2" :class="[popType === 'lang' ? 'active' : '', 'btn-icon']" />
                        </div>
                    </div>
                </div>
                <div :class="['header-bottom-wrap', 'clearfix', loginStatus ? 'is-login' : '']">
                    <template v-if="!loginStatus">
                        <div class="header-bottom-links">
                            <!-- 加入會員 -->
                            <span
                                :title="$t('S_JOIN_MEMBER')"
                                class="links-join"
                                @click="$emit('changePage', { page: 'join', type: '' })"
                            >
                                {{ $t('S_JOIN_MEMBER') }}
                            </span>
                            <!-- 忘記密碼 -->
                            <span
                                :title="$t('S_PASSWORD_FORGET')"
                                class="links-forget"
                                @click="$emit('setPop', { type: 'memPwdForget' })"
                            >
                                {{ $t('S_PASSWORD_FORGET') }}
                            </span>
                        </div>
                        <ele-login-form :theme="1" />
                    </template>
                    <ele-login-info
                        v-else
                        :theme="1"
                        :mcenter-item-list="{
                            accountData: {
                                text: 'S_MEM_CENTER',
                                hasLine: false
                            },
                            deposit: {
                                text: 'S_ONLINE_DEPOSIT',
                                hasLine: false
                            },
                            withdraw: {
                                text: 'S_ONLINE_WITHDRAW',
                                hasLine: false
                            },
                            bankBalanceTran: {
                                text: 'S_TRAN_BALANCE',
                                hasLine: false
                            }
                        }"
                    />
                </div>
            </div>
        </eleFixed>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .header-wrap .agent-link-wrap .agent-join[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/tpl/7/btn_affiliation.png') }});
            }

            .header-wrap .agent-link-wrap .agent-login[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/tpl/7/btn_agent.png') }});
            }

            /* 跑馬燈 */
            .header-wrap .news-wrap[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/7/first_news_title.png') }}) 56px 50% no-repeat;
            }

            /* 語系 */
            .header-wrap[{{ this.$options._scopeId }}] .lang .lang-select.zh-tw,
            .header-wrap[{{ this.$options._scopeId }}] .lang .lang-icon.zh-tw {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/zh-tw.png') }});
            }

            .header-wrap[{{ this.$options._scopeId }}] .lang .lang-select.zh-cn,
            .header-wrap[{{ this.$options._scopeId }}] .lang .lang-icon.zh-cn {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/zh-cn.png') }});
            }

            .header-wrap[{{ this.$options._scopeId }}] .lang .lang-select.en,
            .header-wrap[{{ this.$options._scopeId }}] .lang .lang-icon.en {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/en.png') }});
            }

            .header-wrap[{{ this.$options._scopeId }}] .lang .lang-select.ja,
            .header-wrap[{{ this.$options._scopeId }}] .lang .lang-icon.ja {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/ja.png') }});
            }

            .header-wrap[{{ this.$options._scopeId }}] .lang .lang-select.vi,
            .header-wrap[{{ this.$options._scopeId }}] .lang .lang-icon.vi {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/vi.png') }});
            }

            /* 登入區 */
            .header-wrap[{{ this.$options._scopeId }}] .login-form-wrap .login-unit {
                background: url({{ $getCdnPath('/static/image/tpl/7/loginInput_icon01.png') }}) #FFF 10px 50% no-repeat;
            }

            .header-wrap[{{ this.$options._scopeId }}] .login-form-wrap .login-unit-password {
                background: url({{ $getCdnPath('/static/image/tpl/7/loginInput_icon02.png') }}) #FFF 10px 50% no-repeat;
            }

            .header-wrap[{{ this.$options._scopeId }}] .login-form-wrap .login-unit-captcha {
                background: url({{ $getCdnPath('/static/image/tpl/7/loginInput_icon03.png') }}) #FFF 10px 50% no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import eleFixed from '../../common/fixed';
import eleLogo from '../../common/logo';
import eleNews from '../../common/news';
import eleNav from '../common/header/nav';
import eleLang from '../common/header/lang';
import eleLoginForm from '../common/header/login_form';
import eleLoginInfo from '../common/header/login_info';

export default {
    components: {
        eleFixed,
        eleLogo,
        eleNews,
        eleNav,
        eleLang,
        eleLoginForm,
        eleLoginInfo
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            loginStatus: 'getLoginStatus',
            popType: 'getPopType'
        })
    },
    mounted() {
        // 前台才動作
        if (!this.isBackEnd) {
            this.$on('setPop', this.setPop);
            this.$on('changePage', this.changePage);
        }
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ]),
        /* 監聽裝置-版7特例 */
        handleResize() {
            if (!this.isBackEnd && $('.header-wrap') && $('.header-fixed')) {
                $('.header-wrap').css('height', `${$('.header-fixed').height()}px`);
            }
        },
        setPop(data) {
            this.actionSetPop(data);
        },
        changePage(data) {
            this.actionChangePage(data);
        }
    }
};
</script>

<style lang="scss" src="./css/header.scss" scoped></style>
