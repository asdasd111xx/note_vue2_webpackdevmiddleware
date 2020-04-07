<template>
    <div class="header-wrap">
        <div class="header clearfix">
            <div class="header-top clearfix">
                <div class="header-top-center clearfix">
                    <!-- 登入後資訊 -->
                    <div v-if="loginStatus" class="mem-wrap clearfix">
                        <mem-info />
                        <mem-menu />
                    </div>
                    <!-- 登入表單 -->
                    <mem-login
                        v-else
                        :link="link"
                        :sort="sort"
                    />
                    <!-- 語系 -->
                    <lang-select />
                </div>
            </div>
            <div class="header-center clearfix">
                <!-- logo -->
                <ele-logo
                    :logo-width="194"
                    :logo-height="74"
                    :is-modify-style="true"
                    logo-align="leftCenter"
                />
                <!-- 導覽列 -->
                <ele-nav
                    :theme="1"
                    :nav-max="8"
                    animation-type="slide-down"
                />
            </div>
            <!-- 最新消息 -->
            <div class="news-wrap">
                <div class="news-wrap-center clearfix">
                    <template>
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
                    </template>
                    <div class="news-title">{{ $t('S_HOT_NEWS_2') }}</div>
                    <ele-news />
                </div>
            </div>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .header-wrap .header-center[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/9/header_bg.png') }}) 0 0 no-repeat;
            }

            .header-wrap .agent-join[{{ this.$options._scopeId }}],
            .header-wrap .agent-login[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/9/news_btn_bg.png') }}) 0 0 no-repeat;
            }

            .water-blue-purple .header-wrap .header-center[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/9/water_blue_purple/header_bg.png') }}) 0 0 no-repeat;
            }

            .water-blue-purple .header-wrap .news-wrap .news-wrap-center .agent-join[{{ this.$options._scopeId }}],
            .water-blue-purple .header-wrap .news-wrap .news-wrap-center .agent-login[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/9/water_blue_purple/news_btn_bg.png') }}) 0 0 no-repeat;
            }

            .black .header-wrap[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/9/black/header_bg.png') }}) #000 0 0 repeat-x;
            }

            /* 導覽列 */
            .water-blue-purple .header-wrap[{{ this.$options._scopeId }}] .nav-wrap .nav-more-wrap .more-btn {
                background: url({{ $getCdnPath('/static/image/tpl/9/water_blue_purple/nav_more_icon.png') }}) 50% 0 no-repeat;
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
    data() {
        return {
            link: {
                forgetPw: true,
                join: true
            },
            sort: ['username', 'password', 'captcha', 'submit', 'forgetPw', 'join']
        };
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
