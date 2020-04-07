<template>
    <div :class="['header-wrap', webInfo.style_color]">
        <div class="header clearfix">
            <!-- logo -->
            <ele-logo :logo-width="200" :logo-height="90" />
            <div class="header-right-wrap">
                <div class="header-top clearfix">
                    <!-- 最新消息 -->
                    <div class="news-wrap">
                        <ele-news :speed="200" />
                    </div>
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
                    <!-- 語系 -->
                    <lang-select />
                </div>
                <!-- 登入後資訊 -->
                <div v-if="loginStatus" class="mem-wrap clearfix">
                    <mem-menu />
                    <div class="mem-bg-wrap">
                        <mem-info :list-style="memInfoStyle" />
                    </div>
                </div>
                <!-- 登入表單 -->
                <mem-login
                    v-else
                    :text="memLoginText"
                    :sort="memLoginSort"
                    :link="memLoginLink"
                />
            </div>
            <!-- 導覽列 -->
            <ele-nav
                :theme="1"
                :nav-max="8"
                animation-type="slide-down"
            />
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .header-wrap .mem-bg-wrap[{{ this.$options._scopeId }}]:before {
                background: url({{ $getCdnPath('/static/image/tpl/10/mem_info_bg.png') }}) 50% 0 no-repeat;
            }

            .header-wrap .mem-bg-wrap[{{ this.$options._scopeId }}]:after {
                background: url({{ $getCdnPath('/static/image/tpl/10/mem_info_bg.png') }}) 50% -50px no-repeat;
            }

            .header-wrap .news-wrap[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/10/news_bg.png') }}) 0 0 no-repeat;
            }

            .deep-purple .header-wrap .mem-bg-wrap[{{ this.$options._scopeId }}]:before {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/mem_info_bg.png') }}) 50% 0 no-repeat;
            }

            .deep-purple .header-wrap .mem-bg-wrap[{{ this.$options._scopeId }}]:after {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/mem_info_bg.png') }}) 50% -50px no-repeat;
            }

            .deep-purple .header-wrap .news-wrap[{{ this.$options._scopeId }}]:after {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/news_bg.png') }}) 0 0 no-repeat;
            }

            /* 登入區 */
            .header-wrap[{{ this.$options._scopeId }}] .login-form .login-input__input {
                background: url({{ $getCdnPath('/static/image/tpl/10/input_bg.png') }}) 50% 0 no-repeat;
            }

            .header-wrap[{{ this.$options._scopeId }}] .login-form .login-btn.login-btn--submit {
                background: url({{ $getCdnPath('/static/image/tpl/10/btn_login.png') }}) 50% 0 no-repeat;
            }

            .deep-purple .header-wrap[{{ this.$options._scopeId }}] .login-form .login-input__input {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/input_bg.png') }}) 50% 0 no-repeat;
            }

            .header-wrap[{{ this.$options._scopeId }}] .login-form .login-btn.login-btn--submit {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/btn_login.png') }}) 50% 0 no-repeat;
            }

            .header-wrap[{{ this.$options._scopeId }}] .login-form .login-btn.login-btn--submit.lang-zh-tw {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/btn_login_tw.png') }}) 50% 0 no-repeat;
            }

            .header-wrap[{{ this.$options._scopeId }}] .login-form .login-btn.login-btn--submit.lang-en {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/btn_login_en.png') }}) 50% 0 no-repeat;
            }

            .header-wrap[{{ this.$options._scopeId }}] .login-form .login-btn.login-btn--submit.lang-ja {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/btn_login_ja.png') }}) 50% 0 no-repeat;
            }

            .header-wrap[{{ this.$options._scopeId }}] .login-form .login-btn.login-btn--submit.lang-vi {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/btn_login_vi.png') }}) 50% 0 no-repeat;
            }

            /* 會員選單 */
            .header-wrap[{{ this.$options._scopeId }}] .mem-info-wrap {
                background: url({{ $getCdnPath('/static/image/tpl/10/mem_info_bg.png') }}) 50% -25px repeat-x;
            }

            .deep-purple .header-wrap[{{ this.$options._scopeId }}] .mem-info-wrap {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/mem_info_bg.png') }}) 50% -25px repeat-x;
            }

            /* 導覽列 */
            .header-wrap[{{ this.$options._scopeId }}] .nav-more-wrap .more-btn {
                background: url({{ $getCdnPath('/static/image/tpl/10/icon_down_light.png') }}) 50% 0 no-repeat;
            }

            .deep-purple .header-wrap[{{ this.$options._scopeId }}] .nav-more-wrap .more-btn {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/icon_down_light.png') }}) 50% 0 no-repeat;
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
            memLoginLink: {
                forgetPw: true,
                join: true
            },
            memLoginSort: ['username', 'captcha', 'submit', 'password', 'join', 'forgetPw'],
            memLoginText: {
                login: '',
                forgetPw: this.$t('S_PASSWORD_FORGET'),
                join: this.$t('S_JOIN_MEMBER')
            },
            memInfoStyle: {
                balanceList: {
                    background: '',
                    color: '',
                    'border-color': ''
                },
                balanceBottom: {
                    background: '',
                    'border-color': ''
                },
                button: {
                    background: ''
                }
            }
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
