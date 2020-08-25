<template>
    <div :class="['header-wrap', webInfo.style_color]">
        <div class="header clearfix">
            <div class="header-top clearfix">
                <!-- 登入後資訊 -->
                <div v-if="loginStatus" class="mem-wrap clearfix">
                    <mem-info />
                    <mem-menu />
                </div>
                <!-- 登入表單 -->
                <mem-login v-else />
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
                <!-- 語系 -->
                <lang-select />
            </div>
            <!-- logo -->
            <ele-logo :logo-width="280" :logo-height="100" />
            <eleFixed>
                <!-- 導覽列 -->
                <ele-nav
                    :theme="1"
                    :nav-max="8"
                    animation-type="slide-down"
                />
            </eleFixed>
            <!-- 最新消息 -->
            <div class="news-wrap">
                <div class="news-title">{{ $t('S_HOT_NEWS_2') }}:</div>
                <ele-news />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import eleFixed from '../../common/fixed';
import memLogin from '../../common/memLogin';
import memInfo from '../../common/memInfo';
import memMenu from '../../common/memMenu';
import langSelect from '../../common/langSelect';
import eleLogo from '../../common/logo';
import eleNews from '../../common/news';
import eleNav from '../common/header/nav';

export default {
    components: {
        eleFixed,
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
