<template>
    <div :style="{left: left}" class="header-wrap">
        <!-- 最新消息 -->
        <div class="news-wrap">
            <div class="news-content clearfix">
                <!-- 語系 -->
                <lang-select class="lang" />
                <div class="news-title">{{ $t('S_HOT_NEWS_2') }}</div>
                <ele-news class="news-marquee-content" />
            </div>
        </div>
        <div class="header-content clearfix">
            <div class="header-logo clearfix">
                <div class="header-logo-img">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/logo.png')" @click="actionChangePage({ page: webInfo.page[0].pid, type: 'custom'})" />
                </div>
            </div>
            <page-nav @openLoginModal="$emit('openLoginModal')" />
            <div :class="[{'header-login' : loginStatus}, 'header-nav-right', 'clearfix']">
                <div class="header-nav-right-bg" />
                <div
                    v-if="!loginStatus"
                    class="nav-left-item"
                    @click="$emit('openLoginModal')"
                >
                    <div class="nav-right-text">
                        <div class="nav-right-content">
                            <div class="nav-icon">
                                <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/login.png')" />
                            </div>
                            <span class="nav-right-title">{{ $text('S_LOG_IN_REGISTER', '登录/注册') }}</span>
                        </div>
                    </div>
                </div>
                <div class="nav-left-item" @click="goMcenterPage('accountData')">
                    <div class="nav-right-text">
                        <div class="nav-right-content">
                            <div class="nav-icon">
                                <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/vip.png')" />
                            </div>
                            <span class="nav-right-title vip">{{ this.$text('S_MEM_CENTER', '会员中心') }}</span>
                        </div>
                    </div>
                </div>
                <div class="nav-left-item">
                    <div class="nav-right-text" @click="actionChangePage({ page: 'mobileBet', type: 'static'})">
                        <div class="nav-right-content">
                            <div class="nav-icon">
                                <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/app.png')" />
                            </div>
                            <span class="nav-right-title">{{ $text('S_APP_DOWNLOAD', 'APP下载') }}</span>
                        </div>
                    </div>
                    <div class="content-wrap">
                        <div class="content-wrap-app">
                            <div class="content-app-down clearfix">
                                <div class="qrcode-wrap">
                                    <div v-if="!qrcodeStatus" class="qrcode-img-wrap">
                                        <img :src="$getCdnPath('/static/image/mobileBet/qr.png')" />
                                        <p class="no-login-text">{{ $text('S_LOGIN_DOWNLOAD') }}</p>
                                    </div>
                                    <qrcode
                                        v-else
                                        :value="mobileBetUrl"
                                        :options="{ width: 193 }"
                                    />
                                </div>
                                <div class="download-wrap">
                                    <div class="download-tip">{{ $text('S_DOWNLOAD_TIP', '立刻扫码 下载APP') }}</div>
                                    <div class="download-btn" @click="$router.push('/mobileBet')">{{ $text('S_APP_DOWNLOAD_MILLER', '移动版APP') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nav-left-item" @click="actionChangePage({ page: '10733', type: 'custom'})">
                    <div class="nav-right-text">
                        <div class="nav-right-content">
                            <div class="nav-icon">
                                <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/promotion.png')" />
                            </div>
                            <span class="nav-right-title">{{ $text('S_PROMOTIONS', '优惠活动') }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="loginStatus" class="nav-logined">
                    <div class="login-user-info clearfix">
                        <div class="profile-dropdown-view">
                            <div class="profile-photo">
                                <img :src="$getCdnPath(`/static/image/mcenter/theme/miller/profile_photo_${memInfo.user.image}.png`)" />
                            </div>
                            <div class="dropdown-menu">
                                <div class="dropdown-menu-title">{{ $text('S_PERSONAL_CENTER', '个人中心') }}</div>
                                <ul class="dropdown-list">
                                    <li
                                        v-for="(info, index) in finalMcenterList"
                                        :key="`mem-list-${index}`"
                                        @click="goMcenterPage(info.path)"
                                    >
                                        <span :class="`dropdown-list-icon ${info.icon}`">
                                            <icon
                                                :name="info.icon"
                                                width="16"
                                                height="16"
                                                class="dropdown-left-icon"
                                            />
                                        </span>
                                        <span class="dropdown-item-text">{{ $t(info.title) }}</span>
                                        <span class="dropdown-item-icon">
                                            <icon
                                                name="chevron-right"
                                                width="12"
                                                height="12"
                                            />
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="profile-info">
                            <div class="profile-info-top">
                                <span class="profile-name" @click="changePage('betRecord')">{{ memInfo.user.username }}</span>
                                <div v-if="vipInfo && vipInfo.enable" class="profile-level">
                                    <img :src="$getCdnPath('/static/image/mcenter/theme/miller/vip_icon.png')" />
                                    <span>{{ vipInfo.now_level_name | level }}</span>
                                </div>
                            </div>
                            <div class="profile-info-bottom">
                                <div class="profile-balance">
                                    <span class="profile-balance-icon" @click="onUpdate">￥</span>
                                    <span class="profile-balance-count" @click="onUpdate">{{ memBalance.total }}</span>
                                    <span class="profile-balance-sync" @click="onUpdate">
                                        <icon
                                            :spin="updating"
                                            name="sync-alt"
                                            width="14"
                                            height="20"
                                        />
                                    </span>
                                    <button class="profile-recharge" @click="toDeposit">{{ $text('S_DEPOSIT', '充值') }}</button>
                                    <div class="dropdown-menu dropdown-menu-recharge">
                                        <div class="dropdown-menu-title">{{ $text('S_RECHARGE_CENTER', '充提中心') }}</div>
                                        <ul class="dropdown-list">
                                            <li
                                                v-for="(info, index) in balanceList"
                                                :key="`balance-list-${index}`"
                                                @click="info.onClick(info.path)"
                                            >
                                                <span :class="`balance-list-icon ${info.icon}`">
                                                    <icon
                                                        :name="info.icon"
                                                        width="16"
                                                        height="16"
                                                        class="dropdown-left-icon"
                                                    />
                                                </span>
                                                <span class="dropdown-item-text">{{ info.title }}</span>
                                                <span class="dropdown-item-icon">
                                                    <icon
                                                        name="chevron-right"
                                                        width="12"
                                                        height="12"
                                                    />
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import pageNav from './navContent';
import eleNews from '../../../../common/news';
import langSelect from '../../../../common/langSelect';

export default {
    components: {
        pageNav,
        eleNews,
        langSelect
    },
    filters: {
        level(name) {
            if (/^VIP/.test(name)) {
                return name.replace('VIP ', '');
            }

            return '0';
        }
    },
    data() {
        return {
            updating: false,
            left: '0'
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            mcenterList: 'getMcenterList',
            memInfo: 'getMemInfo',
            memBalance: 'getMemBalance',
            vipInfo: 'getVip',
            loginStatus: 'getLoginStatus',
            webInfo: 'getWebInfo',
            appInfo: 'getAppInfo'
        }),
        mcenterListFilter() {
            const mcenterData = cloneDeep(this.mcenterList);
            const result = [];

            mcenterData.forEach((data) => {
                if (data.key === 'bank') {
                    const item = [];

                    data.item.forEach((info) => {
                        // 日本站特例移除紅利帳戶
                        if (info.key === 'bonusAccount' && this.isException) {
                            return;
                        }

                        item.push(info);
                    });

                    result.push({ ...data, item });
                    return;
                }

                // 無限層廳才顯示團隊中心
                if (data.key === 'tcenter') {
                    const item = [];

                    if (!this.memInfo.config.infinity) {
                        return;
                    }

                    data.item.forEach((info) => {
                        // 我的佣金為第三方佣金，但第三方佣金沒有提供連結
                        if (info.key === 'commission' && this.memInfo.config.wage && !this.haveThirdLink) {
                            return;
                        }

                        item.push(info);
                    });

                    result.push({ ...data, item });

                    return;
                }

                result.push(data);
            });
            return result;
        },
        finalMcenterList() {
            let allMcenterList = {};
            const memberList = [];
            const showList = [
                { key: 'bankMoneyDetail', name: 'coins' },
                { key: 'bankBalanceTran', name: 'share' },
                { key: 'betRecord', name: 'file-alt' },
                { key: 'bankRebate', name: 'donate' },
                { key: 'infoMessage', name: 'envelope' }
            ];

            // 取得會員中心左側選單所有的項目
            this.mcenterListFilter.forEach((info) => {
                info.item.forEach((itemList) => {
                    allMcenterList = {
                        ...allMcenterList,
                        [itemList.key]: {
                            ...itemList
                        }
                    };
                });
            });

            showList.forEach((info) => {
                memberList.push({
                    path: allMcenterList[info.key].key,
                    title: allMcenterList[info.key].text,
                    icon: info.name
                });
            });

            memberList.push({
                title: 'S_LOGOUT2',
                icon: 'sign-out-alt',
                path: ''
            });

            return memberList;
        },
        balanceList() {
            return [
                {
                    title: this.$text('S_DEPOSIT', '充值'),
                    icon: 'piggy-bank',
                    path: '',
                    onClick: this.toDeposit
                },
                {
                    title: this.$text('S_WITHDRAWAL_TEXT', '提现'),
                    icon: 'hand-holding-usd',
                    path: '',
                    onClick: this.toWithdraw
                },
                {
                    title: this.$text('S_TRAN_BALANCE', '额度转换'),
                    icon: 'share',
                    path: 'bankBalanceTran',
                    onClick: this.changePage
                }
            ];
        },
        mobileBetUrl() {
            if (this.isBackEnd) {
                return window.location.hostname;
            }

            return this.appInfo.qrcode.url;
        },
        qrcodeStatus() {
            return this.loginStatus || this.appInfo.downloadInfo.unsafe_download;
        }
    },
    mounted() {
        window.addEventListener('scroll', () => {
            const left = document.documentElement.scrollLeft || document.body.scrollLeft;
            this.left = `-${left}px`;
        });
    },
    methods: {
        ...mapActions([
            'actionSetUserBalance',
            'actionChangePage'
        ]),
        /**
         * 更新餘額
         * @method onUpdate
         */
        onUpdate() {
            if (this.updating) {
                return;
            }

            this.updating = true;

            this.actionSetUserBalance().then(() => {
                this.updating = false;
            });
        },
        /**
         * 前往線上存款頁
         * @method toDeposit
         */
        toDeposit() {
            this.$depositLink(true);
        },
        /**
         * 前往線上取款頁
         * @method toWithdraw
         */
        toWithdraw() {
            if (this.isBackEnd) {
                return;
            }

            mcenterPageAuthControl('withdraw').then((response) => {
                if (!response || !response.status) {
                    return;
                }

                this.$router.push('/mobile/mcenter/withdraw');
            });
        },
        changePage(path) {
            if (path === '') {
                member.logout({
                    success: () => {
                        window.location.reload();
                    }
                });

                return;
            }

            if (this.isBackEnd) {
                return;
            }

            if (path === 'accountBankCard') {
                mcenterPageAuthControl(path).then((response) => {
                    if (!response || !response.status) {
                        return;
                    }
                    this.actionChangePage({ page: 'mcenter', type: '', subPage: path });
                });
                return;
            }

            this.actionChangePage({ page: 'mcenter', type: '', subPage: path });
        },
        goMcenterPage(path) {
            if (path === '') {
                member.logout({
                    success: () => {
                        window.location.reload();
                    }
                });

                return;
            }

            if (this.isBackEnd) {
                return;
            }

            if (!this.loginStatus) {
                this.$emit('openLoginModal');
                return;
            }

            if (path === 'accountBankCard') {
                mcenterPageAuthControl(path).then((response) => {
                    if (!response || !response.status) {
                        return;
                    }
                    this.actionChangePage({ page: 'mcenter', type: '', subPage: path });
                });
                return;
            }

            this.actionChangePage({ page: 'mcenter', type: '', subPage: path });
        }
    }
};
</script>

<style lang="scss" src="../css/header.scss" scoped />
