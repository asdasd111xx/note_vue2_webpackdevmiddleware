<template>
    <div :class="['header-wrap', webInfo.style_color]">
        <div class="header clearfix">
            <div class="header-top-wrap">
                <div class="header-top clearfix">
                    <!-- logo -->
                    <ele-logo :logo-width="200" :logo-height="90" />
                    <!-- 登入後資訊 -->
                    <div v-if="loginStatus" class="mem-wrap clearfix">
                        <mem-info />
                        <mem-menu />
                    </div>
                    <!-- 登入表單 -->
                    <mem-login
                        v-else
                        :link="{forgetPw: true, join: true}"
                        :text="{ line: '/' }"
                        :sort="['username', 'password', 'captcha', 'submit', 'forgetPw', 'line', 'join']"
                    />
                    <!-- 語系 -->
                    <lang-select mode="b" />
                </div>
            </div>
            <div class="header-middle clearfix">
                <!-- 導覽列 -->
                <ele-nav
                    :theme="1"
                    :nav-max="8"
                    icon-type="plus"
                    animation-type="slide-down"
                />
            </div>
            <div class="header-bottom-wrap">
                <div class="header-bottom clearfix">
                    <div class="header-bottom-links">
                        <!-- 立即加盟 -->
                        <span
                            v-if="memInfo.config.agent_register"
                            :title="$t('S_CEP_JOINAGENT')"
                            class="agent-join"
                            @click="$emit('changePage', { page: 'joinAgent', type: '' })"
                        >
                            {{ $t('S_CEP_JOINAGENT') }}
                        </span>
                        <!-- 代理登入 -->
                        <span
                            v-if="memInfo.config.agent_login"
                            :title="$t('S_AGENT_LOGIN')"
                            class="agent-login"
                            @click="$emit('setPop', { type: 'agLogin' })"
                        >
                            {{ $t('S_AGENT_LOGIN') }}
                        </span>
                    </div>
                    <!-- 最新消息 -->
                    <div class="news-wrap">
                        <div class="news-title">{{ $t('S_HOT_NEWS_2') }}</div>
                        <ele-news :speed="200" />
                    </div>
                </div>
            </div>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .header-wrap .header[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/13/header_bg.jpg') }}) 50% 0 no-repeat;
            }

            .header-wrap[{{ this.$options._scopeId }}] .header-top-wrap .header-top .header-logo-wrap {
                background: url({{ $getCdnPath('/static/image/tpl/13/logo_bg.png') }}) 50% 0 no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import memLogin from '../../common/memLogin';
import memInfo from '../../common/memInfo';
import memMenu from '../../common/memMenu';
import langSelect from '../../common/langSelect';
import eleNews from '../../common/news';
import eleLogo from '../../common/logo';
import eleNav from '../common/header/nav';

export default {
    components: {
        eleLogo,
        eleNews,
        eleNav,
        langSelect,
        memLogin,
        memInfo,
        memMenu
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
        if (this.isBackEnd) {
            return;
        }

        this.$on('setPop', this.actionSetPop);
        this.$on('changePage', this.actionChangePage);
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ])
    }
};
</script>

<style lang="scss" src="./css/header.scss" scoped></style>
