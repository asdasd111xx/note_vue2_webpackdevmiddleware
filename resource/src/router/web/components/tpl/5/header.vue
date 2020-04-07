<template>
    <div :class="['header-wrap', webInfo.style_color, { 'is-infinity': memInfo.config.infinity }]">
        <div class="header clearfix">
            <div class="header-top-wrap">
                <div class="header-top">
                    <div class="header-top-link clearfix">
                        <!-- 立即加盟 -->
                        <span
                            v-if="memInfo.config.agent_register"
                            :title="$t('S_CEP_JOINAGENT')"
                            class="links"
                            @click="$emit('changePage', { page: 'joinAgent', type: '' })"
                        >
                            {{ $t('S_CEP_JOINAGENT') }}
                        </span>
                        <span v-if="memInfo.config.agent_register && memInfo.config.agent_login" class="link-line">|</span>
                        <!-- 代理登入 -->
                        <span
                            v-if="memInfo.config.agent_login"
                            :title="$t('S_AGENT_LOGIN')"
                            class="links"
                            @click="$emit('setPop', { type: 'agLogin' })"
                        >
                            {{ $t('S_AGENT_LOGIN') }}
                        </span>
                    </div>
                    <div class="clearfix">
                        <template v-if="!loginStatus">
                            <ele-login-form :theme="1" />
                            <div class="header-login-link clearfix">
                                <!-- 忘記密碼 -->
                                <span
                                    :title="$t('S_PASSWORD_FORGET')"
                                    class="links"
                                    @click="$emit('setPop', { type: 'memPwdForget' })"
                                >
                                    {{ $t('S_PASSWORD_FORGET') }}
                                </span>
                                <span class="link-line">|</span>
                                <!-- 加入會員 -->
                                <span
                                    :title="$t('S_JOIN_NOW')"
                                    class="links"
                                    @click="$emit('changePage', { page: 'join', type: '' })"
                                >
                                    {{ $t('S_JOIN_NOW') }}
                                </span>
                            </div>
                        </template>
                        <template v-else>
                            <ele-login-info :theme="1" />
                        </template>
                        <lang-select :mode="'a'" />
                    </div>
                </div>
            </div>
            <div class="header-middle-wrap">
                <div class="header-middle clearfix">
                    <ele-logo :logo-width="142" :logo-height="38" />
                    <ele-nav :theme="1" :nav-max="5" />
                </div>
            </div>
            <div class="header-bottom-wrap">
                <div class="header-bottom">
                    <div class="news-title">{{ $t('S_HOT_NEWS_2') }}：</div>
                    <ele-news />
                </div>
            </div>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            /* 導覽列 */
            .header-wrap[{{ this.$options._scopeId }}] .nav-wrap .nav .nav-more-wrap .more-btn {
                background: url({{ $getCdnPath('/static/image/tpl/5/nav_more_icon.png') }}) 0 0 no-repeat;
            }

            .header-wrap.prussian-blue[{{ this.$options._scopeId }}] .nav-wrap .nav .nav-more-wrap .more-btn {
                background: url({{ $getCdnPath('/static/image/tpl/5/prussian_blue/nav_more_icon.png') }}) 0 0 no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import langSelect from '../../common/langSelect';
import eleNews from '../../common/news';
import eleLogo from '../../common/logo';
import eleLoginForm from '../common/header/login_form';
import eleLoginInfo from '../common/header/login_info';
import eleNav from '../common/header/nav';

export default {
    components: {
        langSelect,
        eleLoginForm,
        eleLoginInfo,
        eleLogo,
        eleNav,
        eleNews
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
