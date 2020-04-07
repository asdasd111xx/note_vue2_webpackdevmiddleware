<template>
    <div :class="$style['mcenter-info-wrap']">
        <!-- avatar dialog -->
        <div
            v-if="isShow"
            :class="$style['dialog-mask']"
            @click="selectAvatar()"
        />
        <div v-if="isShow" :class="[$style['dialog-wrap'], 'clearfix']">
            <div
                v-for="(avatarList, index) in avatar"
                :key="`avatar-${avatarList}`"
                :class="$style['avatar-wrap']"
            >
                <img :src="$getCdnPath(avatarList.url)" @click="selectImg(index)" />
                <div v-if="imgID === index+1" :class="$style.check" />
            </div>
        </div>
        <!-- header -->
        <div :class="[$style['mcenter-info-header'], 'clearfix']">
            <div :class="$style['avatar']" @click="dialogShow()">
                <img :src="$getCdnPath(`/static/image/mobile/tpl/theme3/home/avatar_${imgIndex}.png`)" />
            </div>
            <div :class="$style['mcenter-info-tips']">
                <div class="clearfix">
                    <div :class="$style['member-name']">{{ memInfo.user.show_alias ? memInfo.user.alias : memInfo.user.username }}</div>
                    <div v-if="vipData" :class="$style['vip-level']">{{ vipData.now_level_name }}</div>
                </div>
                <div :class="$style['join-days']">{{ $text('S_COUNT_JOIN_DAYS', '加入威尼斯人的第%s天').replace('%s', createdTime) }}</div>
            </div>
        </div>
        <!-- bottom -->
        <div class="clearfix">
            <!-- bottom-left -->
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
                <div
                    v-if="memInfo.user.display_vip"
                    :class="$style['info-btn04']"
                    @click="$router.push('/mobile/vip')"
                >
                    <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/vip_icon.png')" />
                    <span>{{ $text('S_VIP_DETAILS_BTN', 'VIP详情') }}</span>
                </div>
            </div>
            <!-- bottom-right -->
            <div :class="$style['login-view']">
                <span :class="$style.money">¥{{ memBalanceFormat }}</span>
                <span>{{ $text('S_LOGIN_WALLET', '中心钱包') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import mcenter from '@/api/mcenter';
import member from '@/api/member';

export default {
    data() {
        return {
            list: [
                { path: '', pageName: 'deposit' }, // 存款
                { path: '/mobile/mcenter/balanceTrans', pageName: 'bankBalanceTran' }, // 額度轉換
                { path: '/mobile/mcenter/withdraw', pageName: 'withdraw' } // 取款
            ],
            vipData: {},
            createdTime: '',
            isShow: false,
            avatar: [
                { image: 'avatar_1', url: '/static/image/mobile/tpl/theme3/home/avatar_1.png' },
                { image: 'avatar_2', url: '/static/image/mobile/tpl/theme3/home/avatar_2.png' },
                { image: 'avatar_3', url: '/static/image/mobile/tpl/theme3/home/avatar_3.png' },
                { image: 'avatar_4', url: '/static/image/mobile/tpl/theme3/home/avatar_4.png' },
                { image: 'avatar_5', url: '/static/image/mobile/tpl/theme3/home/avatar_5.png' },
                { image: 'avatar_6', url: '/static/image/mobile/tpl/theme3/home/avatar_6.png' }
            ],
            imgID: 0,
            imgIndex: 0
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
    created() {
        mcenter.accountVIP({
            success: (res) => {
                this.vipData = {
                    ...res.ret
                };
            }
        });
        member.data({
            success: (res) => {
                this.countDays(res.ret.user.created_at);
            }
        });

        if (this.memInfo.user.image === 0) {
            this.imgIndex = 1;
            this.imgID = 1;
            return;
        }

        this.imgIndex = this.memInfo.user.image;
        this.imgID = this.memInfo.user.image;
    },
    methods: {
        ...mapActions([
            'actionSetUserdata'
        ]),
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
        },
        countDays(ceatedTime) {
            const startTime = moment(ceatedTime);
            const now = moment(new Date());

            this.createdTime = now.diff(startTime, 'days');
        },
        dialogShow() {
            this.isShow = !this.isShow;
        },
        selectAvatar() {
            if (this.memInfo.user.image === this.imgID) {
                this.dialogShow();
                return;
            }

            mcenter.accountDataSet({
                params: { image: this.imgID },
                success: () => {
                    this.actionSetUserdata();
                    this.dialogShow();
                    this.imgIndex = this.imgID;
                }
            });
        },
        selectImg(index) {
            this.imgID = index + 1;
        }
    }
};
</script>

<style lang="scss" module>
    .mcenter-info-wrap {
        margin: 0 auto;
        border-radius: 9px;
        background: #F8F1EB;
        width: 94%;
        height: 103px;
        font-size: 12px;
        .mcenter-info-header {
            padding: 5px 0;
            background: url('/static/image/mobile/tpl/theme3/home/vip_header_bg.png') 0 0 no-repeat;
            background-size: 100%;
            .avatar {
                float: left;
                margin: 3px 0 0 2%;
                width: 28px;
                img {
                    border-radius: 50%;
                    width: 100%;
                }
            }
        }
        .mcenter-info-tips {
            float: left;
            margin: 1px 0 0 2%;
            line-height: 16px;
            .member-name,
            .vip-level {
                float: left;
            }
            .vip-level {
                padding: 0 5px;
                margin-left: 4px;
                background: url('/static/image/mobile/tpl/theme3/home/vip_level_bg.png') 0 0 no-repeat;
                background-size: 100%;
                color: #F8F1EB;
            }
            .join-days {
                margin-top: 2px;
            }
        }
    }
    .login-view {
        position: relative;
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
    .login-view::before {
        content: "";
        position: absolute;
        top: -10px;
        left: -1px;
        background: #EFDFD1;
        width: 1px;
        height: 58px;
    }
    .info-btn-wrap {
        float: left;
        margin-top: 8px;
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

    // avatar dialog
    .dialog-mask,
    .dialog-wrap {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0;
        background: #000;
        z-index: 999;
    }
    .dialog-mask {
        width: 100%;
        height: 100%;
        opacity: 0.5;
    }
    .dialog-wrap {
        top: 40%;
        left: 50%;
        border-radius: 10px;
        padding: 10px;
        background: #F8F1EB;
        width: 90%;
        color: #999;
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        .avatar-wrap {
            position: relative;
            float: left;
            margin: 6px 1%;
            background: url('/static/image/mobile/tpl/theme3/home/avatar_bg.png') 0 0 no-repeat;
            background-size: 100%;
            width: 31%;
            text-align: center;
            img {
                border-radius: 50%;
                margin-top: 5%;
                width: 90%;
            }
            .check {
                position: absolute;
                bottom: -6%;
                left: 50%;
                background: url('/static/image/mobile/tpl/theme3/home/check_icon.png') 0 0 no-repeat;
                background-size: 100%;
                width: 30%;
                height: 29%;
                -webkit-transform: translate(-50%,0);
                transform: translate(-50%,0);
            }
        }
    }
</style>
