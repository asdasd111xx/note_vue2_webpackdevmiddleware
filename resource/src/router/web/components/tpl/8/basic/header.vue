<template>
    <div :class="['header-wrap', webInfo.style_color, isBackEnd ? 'back' : 'front']">
        <div class="header">
            <div class="header-top-wrap clearfix">
                <div class="header-top-feature">
                    <!-- 語系 -->
                    <lang-select shape="square" />
                    <!-- 最新消息 -->
                    <div class="news-wrap">
                        <ele-news :speed="200" direction="up" />
                    </div>
                </div>
                <!-- logo -->
                <ele-logo :logo-width="306" :logo-height="95" />
            </div>
            <div class="header-bottom-wrap clearfix">
                <div class="header-nav-wrap clearfix">
                    <!-- 導覽列 -->
                    <ele-nav
                        :theme="1"
                        :nav-max="11"
                        animation-type="slide-down"
                    />
                </div>
                <div :class="['header-login-wrap', loginStatus ? 'is-login' : '']">
                    <template v-if="!loginStatus">
                        <ele-login-form
                            :theme="1"
                            :is-show-pw-forget="true"
                            login-text=" "
                        />
                        <div class="header-register-wrap">
                            <!-- 加入會員 -->
                            <span
                                :title="$t('S_FREE_MEMBER_OPEN')"
                                class="links-join"
                                @click="$emit('changePage', { page: 'join', type: '' })"
                            />
                        </div>
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
                        logout-text=" "
                    />
                    <div class="header-agent-wrap">
                        <!-- 立即加盟 -->
                        <span
                            v-if="memInfo.config.agent_register"
                            :title="$text('S_CEP_JOINAGENT', '立即加盟')"
                            class="links-join-us"
                            @click="$emit('changePage', { page: 'joinAgent', type: '' })"
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
                background: url({{ $getCdnPath('/static/image/tpl/8/header_bg.png') }}) 50% 34px no-repeat;
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
            /* 最新消息 */
            .news-wrap[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/news_bg.png') }}) 50% 0 no-repeat;
            }
            /* 導覽列 */
            .nav-wrap[{{ this.$options._scopeId }}] .nav-item-wrap .nav-item.current,
            .nav-wrap[{{ this.$options._scopeId }}] .nav-item-wrap .nav-item:hover {
                background: url({{ $getCdnPath('/static/image/tpl/8/nav_over.png') }}) 50% 0 no-repeat;
            }
            .nav-wrap[{{ this.$options._scopeId }}] .nav-more-wrap .more-btn {
                background: url({{ $getCdnPath('/static/image/tpl/8/icon_down_light.png') }}) 50% 0 no-repeat;
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
                background: url({{ $getCdnPath('/static/image/tpl/8/btn_logout.png') }}) 50% 0 no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import eleLogo from '../../../common/logo';
import langSelect from '../../../common/langSelect';
import eleNews from '../../../common/news';
import eleNav from '../../common/header/nav';
import eleLoginForm from '../../common/header/login_form';
import eleLoginInfo from '../../common/header/login_info';

export default {
    components: {
        eleLogo,
        eleNews,
        eleNav,
        langSelect,
        eleLoginForm,
        eleLoginInfo
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            loginStatus: 'getLoginStatus'
        })
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
        changePage(data) {
            this.actionChangePage(data);
        }
    }
};
</script>

<style lang="scss" src="./css/header.scss" scoped></style>
