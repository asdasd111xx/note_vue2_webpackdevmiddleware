<template>
    <div>
        <div :class="$style['login-info-wrap']">
            <!-- header -->
            <div :class="[$style['login-info-header'], 'clearfix']">
                <span v-if="loginStatus" :class="$style['login-title']">{{ setLoginTitle() }}，{{ memInfo.user.show_alias ? memInfo.user.alias : memInfo.user.username }}</span>
                <span v-else :class="$style['login-title']">{{ setLoginTitle() }}，{{ $text('S_LOGIN_TIP', '请登录') }}</span>
                <div
                    :class="$style['login-info']"
                    @click="goAccountData()"
                >
                    {{ $text('S_PERSON_INFO', '个人资料') }}
                </div>
            </div>
            <!-- bottom -->
            <div class="clearfix">
                <!-- bottom-left -->
                <div :class="$style['login-view']">
                    <div v-if="loginStatus">
                        <span :class="$style.money">¥{{ memBalanceFormat }}</span>
                        <span>{{ $text('S_LOGIN_WALLET', '中心钱包') }}</span>
                    </div>
                    <div v-else @click="goLogin()">
                        <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/login_icon.png')" />
                        <span>{{ $text('S_LOGIN_VIEW_BTN', '登录查看') }}</span>
                    </div>
                </div>
                <!-- bottom-right -->
                <div :class="$style['info-btn-wrap']">
                    <div :class="$style['info-btn01']" @click="onListClick(0)">
                        <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/online_deposit_icon.png')" />
                        <span>{{ $text('S_DEPOSIT_BTN', '存款') }}</span>
                    </div>
                    <div :class="$style['info-btn02']" @click="onListClick(1)">
                        <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/wallet_icon.png')" />
                        <span>{{ $text('S_TRANSFER_BTN', '转账') }}</span>
                    </div>
                    <div :class="$style['info-btn03']" @click="onListClick(2)">
                        <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/online_withdrawals_icon.png')" />
                        <span>{{ $text('S_WITHFRAW_BTN', '取款') }}</span>
                    </div>
                    <!-- <div :class="$style['info-btn04']" @click="$router.push('/mobile/vip')">
                        <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/vip_icon.png')"/>
                        <span>{{ $text('S_VIP_DETAILS_BTN', 'VIP详情') }}</span>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';

export default {
    components: {

    },
    data() {
        return {
            list: [
                { path: '', pageName: 'deposit' }, // 存款
                { path: '/mobile/mcenter/balanceTrans', pageName: 'bankBalanceTran' }, // 額度轉換
                { path: '/mobile/mcenter/withdraw', pageName: 'withdraw' } // 取款
            ]
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            memInfo: 'getMemInfo',
            memCurrency: 'getMemCurrency',
            memBalance: 'getMemBalance'
        }),
        memBalanceFormat() {
            const money = this.memBalance.total ? this.memBalance.total : '--';
            if (this.memBalance.total) {
                return parseFloat(money).toLocaleString();
            }
            return '--';
        }
    },
    methods: {
        setLoginTitle() {
            const now = new Date();
            const hour = now.getHours();
            if (hour < 12) {
                return this.$text('S_LOGIN_TITLE_MORNING', '早上好');
            }
            if (hour < 20) {
                return this.$text('S_LOGIN_TITLE_AFTERNOON', '下午好');
            }
            return this.$text('S_LOGIN_TITLE_NIGHT', '晚上好');
        },
        onListClick(listIndex) {
            const item = this.list[listIndex];

            if (!this.loginStatus) {
                this.goLogin();
                return;
            }
            if (item.pageName === 'deposit') {
                this.$depositLink(true);
                return;
            }

            mcenterPageAuthControl(item.pageName).then((response) => {
                if (response && response.status) {
                    this.$router.push(item.path);
                }
            });
        },
        goLogin() {
            this.$router.push('/mobile/login');
        },
        goAccountData() {
            if (!this.loginStatus) {
                this.goLogin();
                return;
            }
            this.$router.push('/mobile/mcenter/accountData');
        }
    }
};
</script>

<style lang="scss" module>
    .login-info-wrap {
        margin: 0 auto;
        border-radius: 9px;
        background: #F8F1EB;
        width: 94%;
        height: 80px;
        font-size: 12px;
        .login-info-header {
            background: url('/static/image/mobile/tpl/theme3/home/login_info_header_bg.png') 0 0 no-repeat;
            background-size: 100%;
            .login-title {
                float: left;
                margin-left: 10px;
                line-height: 22px;
                color: #5C4030;
            }
            .login-info {
                float: right;
                padding: 0 5px;
                margin: 0 10px;
                background: url('/static/image/mobile/tpl/theme3/home/person_info_btn.png') 0 0 no-repeat;
                width: 63px;
                height: 22px;
                line-height: 22px;
                color: #F8F1EB;
                text-align: center;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .login-info:hover {
                color: #FFF;
            }
        }
    }
    .login-view {
        float: left;
        padding: 0 3px;
        margin: 8px 0 0 1%;
        width: 30%;
        line-height: 18px;
        color: #77674D;
        img,
        span {
            display: block;
        }
        img {
            margin: 0 auto;
            width: 28px;
            height: 28px;
        }
        span {
            text-align: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .money {
            line-height: 28px;
        }
    }
    .info-btn-wrap {
        position: relative;
        float: left;
        margin: 8px 0 0 2%;
        width: 67%;
        min-height: 42px;
        div {
            float: left;
            height: 43px;
            width: 33%;
            padding: 0 7px;
            color: #77674D;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            img {
                margin: 0 auto;
                width: 28px;
                height: 28px;
                display: block;
            }
            span {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                text-align: center;
                color: #2D477E;
                display: block;
            }
        }
        .info-btn04 {
            width: 28%;
        }
    }
    .info-btn-wrap::before {
        content: "";
        position: absolute;
        top: -8px;
        left: -1px;
        background: #EFDFD1;
        width: 1px;
        height: 58px;
    }
</style>
