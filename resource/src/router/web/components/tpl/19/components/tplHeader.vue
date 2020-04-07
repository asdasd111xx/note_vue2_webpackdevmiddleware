<template>
    <div :class="$style['header-wrap']">
        <div :class="$style['login-form-wrap']">
            <div :class="$style['field-wrap']">
                <div v-if="!memInfo.config.infinity" :class="$style['top-link']">
                    <!-- 立即加盟 -->
                    <template v-if="memInfo.config.agent_register">
                        <span
                            :title="$text('S_CEP_JOINAGENT', '立即加盟')"
                            :class="$style['agent-join']"
                            @click="changePage('joinAgent')"
                        >
                            {{ $text('S_CEP_JOINAGENT', '立即加盟') }}
                        </span>
                        <span :class="$style.line">|</span>
                    </template>
                    <!-- 代理登入 -->
                    <span
                        v-if="memInfo.config.agent_login"
                        :title="$text('S_AGENT_LOGIN', '代理登入')"
                        :class="$style['agent-login']"
                        @click="actionSetPop({ type: 'agLogin' })"
                    >
                        {{ $text('S_AGENT_LOGIN', '代理登入') }}
                    </span>
                </div>
                <div v-if="loginStatus" :class="[$style['mem-wrap'], 'clearfix']">
                    <mem-info />
                    <mem-menu />
                </div>
                <!-- 登入表單 -->
                <mem-login
                    v-else
                    :link="{ forgetPw: true, join: true }"
                    :sort="['username', 'password', 'captcha', 'submit', 'forgetPw', 'line', 'join']"
                />
                <lang-select :mode="'a'" />
            </div>
        </div>
        <div :class="$style['header-container']">
            <div :class="[$style['container-wrap'], 'clearfix']">
                <logo
                    :class="$style.logo"
                    :logo-width="351"
                    :logo-height="61"
                />
                <ele-nav
                    :theme="1"
                    :nav-max="5"
                    animation-type="slide-down"
                />
            </div>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            /* 導覽列 */
            .header-wrap[{{ this.$options._scopeId }}] .nav-wrap .nav .nav-more-wrap .more-btn {
                background: url({{ $getCdnPath('/static/image/tpl/customizeHome/500013/nav_more_icon.png') }}) 0 0 no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import logo from '../../common/header/logo';
import langSelect from '../../../common/langSelect';
import memLogin from '../../../common/memLogin';
import memInfo from '../../../common/memInfo';
import memMenu from '../../../common/memMenu';
import eleNav from '../../common/header/nav';

export default {
    components: {
        logo,
        langSelect,
        memLogin,
        memMenu,
        memInfo,
        eleNav
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            loginStatus: 'getLoginStatus'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ]),
        changePage(page, type = '') {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({ page, type });
        }
    }
};
</script>

<style lang="scss" src="../css/tplHeader.module.scss" module></style>
