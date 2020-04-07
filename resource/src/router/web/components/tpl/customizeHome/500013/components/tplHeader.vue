<template>
    <div :class="$style['header-wrap']">
        <div :class="$style['header-container']">
            <div :class="[$style['container-wrap'], 'clearfix']">
                <logo
                    :class="$style.logo"
                    :logo-width="351"
                    :logo-height="61"
                />
                <div :class="[$style['nav-wrap'], 'clearfix']">
                    <div
                        v-for="(nav, index) in navList"
                        :key="nav.img"
                        :class="$style['nav-item-wrap']"
                        @mouseover="hoverNow = index"
                        @mouseleave="hoverNow = ''"
                    >
                        <div :class="$style['title-wrap']" @click="changePage(nav)">
                            <div :class="[$style['img-item'], $style[`img-${nav.img}`]]" />
                            <span>{{ nav.name[curLang] }}</span>
                        </div>
                        <transition :name="'slide-down'">
                            <div v-if="nav.subPage && hoverNow === index" :class="$style['nav-sub-wrap']">
                                <div
                                    v-for="subItem in nav.subPage"
                                    :key="`nav-sub-${subItem.pid}`"
                                    :title="subItem.name[curLang]"
                                    :class="$style['nav-sub-item']"
                                    @click="changePage(subItem)"
                                >
                                    <span>{{ subItem.name[curLang] }}</span>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
                <div :class="$style['header-right']">
                    <div>
                        <span>{{ clock }}</span>
                        <span>(GMT+8)</span>
                    </div>
                    <lang-select :theme="'2'" />
                    <div :class="$style['btn-wrap']">
                        <span :class="$style.login" @click="isShow = !isShow" />
                        <span :class="$style.join" @click="changePage({ navPage: 'join', navType: 'static' })" />
                    </div>
                </div>
            </div>
        </div>
        <transition :name="'slide-down'">
            <div v-if="isShow" :class="$style['login-form-wrap']">
                <div :class="$style['field-wrap']">
                    <div v-if="loginStatus" :class="[$style['mem-wrap'], 'clearfix']">
                        <mem-info />
                        <mem-menu />
                    </div>
                    <!-- 登入表單 -->
                    <mem-login
                        v-else
                        :link="{ forgetPw: true }"
                        :text="{ line: '' }"
                        :sort="['username', 'password', 'captcha', 'submit', 'forgetPw', 'line', 'join']"
                    />
                    <template v-if="!memInfo.config.infinity">
                        <!-- 立即加盟 -->
                        <span
                            v-if="memInfo.config.agent_register"
                            :title="$text('S_CEP_JOINAGENT', '立即加盟')"
                            :class="$style['agent-join']"
                            @click="changePage({ navPage: 'joinAgent' })"
                        >
                            {{ $text('S_CEP_JOINAGENT', '立即加盟') }}
                        </span>
                        <!-- 代理登入 -->
                        <span
                            v-if="memInfo.config.agent_login"
                            :title="$text('S_AGENT_LOGIN', '代理登入')"
                            :class="$style['agent-login']"
                            @click="actionSetPop({ type: 'agLogin' })"
                        >
                            {{ $text('S_AGENT_LOGIN', '代理登入') }}
                        </span>
                    </template>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import navData from '@/lib/nav_data';
import logo from '../../../common/header/logo';
import langSelect from '../../../../common/langSelect';
import memLogin from '../../../../common/memLogin';
import memInfo from '../../../../common/memInfo';
import memMenu from '../../../../common/memMenu';

export default {
    components: {
        logo,
        langSelect,
        memLogin,
        memMenu,
        memInfo
    },
    data() {
        return {
            estTime: Vue.moment(this.systemTime),
            navData: {},
            hoverNow: '',
            isShow: false
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang',
            memInfo: 'getMemInfo',
            loginStatus: 'getLoginStatus',
            systemTime: 'getSystemTime'
        }),
        navList() {
            const navList = {};

            this.navData.navArr.forEach((nav) => {
                if (nav.pid === 37917 || nav.pid === 13682 || nav === 10299) { // 體育賽事
                    navList.sports = {
                        ...nav,
                        img: 'sports'
                    };
                }

                if (nav.pid === 37881 || nav.pid === 13665 || nav === 10280) { // 視訊
                    navList.live = nav;
                    navList.live = {
                        ...nav,
                        img: 'live'
                    };
                }

                if (nav.pid === 38484 || nav.pid === 13676 || nav === 10312) { // 電子
                    navList.casino = nav;
                    navList.casino = {
                        ...nav,
                        img: 'casino'
                    };
                }

                if (nav.pid === 37913 || nav.pid === 13680 || nav === 10297) { // 彩票
                    navList.lottery = nav;
                    navList.lottery = {
                        ...nav,
                        img: 'lottery'
                    };
                }

                if (nav.pid === 37922 || nav.pid === 13688 || nav === 10311) { // 棋牌
                    navList.card = nav;
                    navList.card = {
                        ...nav,
                        img: 'card'
                    };
                }

                if (nav.pid === 38485 || nav.pid === 13698 || nav === 10457) { // 優惠
                    navList.promotion = nav;
                    navList.promotion = {
                        ...nav,
                        img: 'promotion'
                    };
                }

                if (nav.pid === 38486 || nav.pid === 13707 || nav === 10371) { // 在線客服
                    navList.service = nav;
                    navList.service = {
                        ...nav,
                        img: 'service'
                    };
                }
            });

            return [
                navList.sports,
                navList.live,
                navList.casino,
                navList.lottery,
                navList.card,
                navList.promotion,
                navList.service
            ];
        },
        clock() {
            return this.estTime.format('HH:mm:ss');
        }
    },
    created() {
        this.navData = navData();
        this.estClock();
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ]),
        changePage(pageInfo) {
            if (!this.isBackEnd) {
                this.actionChangePage({
                    page: pageInfo.navPage,
                    type: pageInfo.navType,
                    config: {
                        linkItem: pageInfo.linkItem
                    }
                });
            }
        },
        estClock() {
            setInterval(() => {
                this.estTime = Vue.moment(this.estTime).add(1, 'seconds');
            }, 1000);
        }
    }
};
</script>

<style lang="scss" src="../css/tplHeader.module.scss" module></style>
