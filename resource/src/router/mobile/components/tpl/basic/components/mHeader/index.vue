<template>
    <div
        v-if="config[$route.name] || false"
        :style="{ top: `${distance}px` }"
        class="header-wrap"
    >
        <div :class="['header-container', config[$route.name].titleAlign]">
            <!-- 上一頁 -->
            <template v-if="config[$route.name].hasBack">
                <div class="back-btn-wrap" @click="onBack"><icon name="chevron-left" scale="0.6" /></div>
            </template>
            <!-- Logo -->
            <template v-if="config[$route.name].hasLogo && webInfo.m_logo">
                <div class="logo-wrap">
                    <img :src="$getCdnPath(`${cdnDomain}${webInfo.m_logo}`)" />
                </div>
            </template>
            <!-- 標題 -->
            <template v-if="config[$route.name].hasTitle || config[$route.name].hasI18n">
                <div class="title-wrap">
                    <template v-if="config[$route.name].hasTitle">{{ config[$route.name].name }}</template>
                    <template v-else>{{ $text(config[$route.name].i18n) }}</template>
                </div>
            </template>
            <!-- Login Info -->
            <template v-if="config[$route.name].hasLoginInfo && loginStatus">
                <div class="login-info-wrap">
                    <p>{{ memInfo.user.show_alias ? memInfo.user.alias : memInfo.user.username }}</p>
                    <p @click="$router.push('/mobile/mcenter/balanceTrans')">
                        {{ memBalance.total ? memBalance.total : '--' }} {{ memCurrency }}
                    </p>
                </div>
            </template>
            <!-- Login Form -->
            <template v-if="config[$route.name].hasLoginForm && !loginStatus">
                <div class="login-form-wrap">
                    <router-link to="/mobile/joinMember" class="register-btn">{{ $text('S_JOIN_NOW') }}</router-link>
                    <router-link to="/mobile/login" class="login-btn clearfix">
                        <img :src="$getCdnPath('/static/image/mobile/triangle.gif')" />
                        <span>{{ $text('S_LOGIN') }}</span>
                    </router-link>
                </div>
            </template>
            <!-- Logout -->
            <template v-if="config[$route.name].hasLogout && (loginStatus || agentIsLogin)">
                <div class="logout-btn" @click="onLogout">{{ $text('S_LOGOUT') }}</div>
            </template>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import agent from '@/api/agent';
import member from '@/api/member';

/**
 * 手機版 header
 * @module element/common/mainWrap
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 */
export default {
    props: {
        config: {
            type: Object,
            required: true
        },
        hasAppDownload: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            currentMenu: '',
            top: this.hasAppDownload ? 50 : 0
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            loginStatus: 'getLoginStatus',
            agentIsLogin: 'getAgentIsLogin',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            memCurrency: 'getMemCurrency',
            memBalance: 'getMemBalance'
        }),
        distance: {
            get() {
                if (this.hasAppDownload) {
                    if (this.top === 50) {
                        $(window).scroll(this.onScroll);
                    }

                    return this.top;
                }

                $(window).off('scroll', this.onScroll);
                return 0;
            },
            set(value) {
                this.top = value;
            }
        }
    },
    mounted() {
        if (!this.hasAppDownload) {
            return;
        }

        $(window).scroll(this.onScroll);
    },
    beforeDestroy() {
        if (!this.hasAppDownload) {
            return;
        }

        $(window).off('scroll', this.onScroll);
    },
    methods: {
        /**
         * 上一頁
         * @method onBack
         */
        onBack() {
            if (!this.config[this.$route.name].back) {
                return;
            }

            if (typeof this.config[this.$route.name].back === 'function') {
                this.config[this.$route.name].back();
                return;
            }

            this.$router[this.config[this.$route.name].back](this.config[this.$route.name].backTo);
        },
        /**
         * 登出
         * @method onLogout
         */
        onLogout() {
            const reload = () => { window.location.reload(); };

            // 代理會員
            if (this.$route.name === 'agcenter') {
                agent.logout().then(reload);
                return;
            }

            // 會員
            member.logout().then(reload);
        },
        onScroll() {
            this.distance = 50 - $(window).scrollTop() > 0 ? 50 - $(window).scrollTop() : 0;
        }
    }
};
</script>

<style src="../../css/mHeader.scss" lang="scss" scoped></style>
