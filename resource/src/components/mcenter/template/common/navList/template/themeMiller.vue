<template>
    <div :class="$style['nav-list']">
        <div :class="$style['mem-info']">
            <div v-if="vipInfo && vipInfo.enable" :class="$style['btn-vip']">
                <img :src="$getCdnPath('/static/image/mcenter/theme/miller/vip_icon.png')" />
                <span>{{ vipInfo.now_level_seq }}</span>
            </div>
            <div :class="$style['profile']">
                <div :class="$style['profile-photo']" @click="headStatus = true">
                    <img :src="$getCdnPath(`/static/image/mcenter/theme/miller/profile_photo_${memInfo.user.image}.png`)" />
                    <div :class="$style.mask" />
                    <div :class="$style['btn-photo']">
                        <icon
                            name="camera"
                            width="20"
                            height="20"
                        />
                    </div>
                </div>
                <div :class="$style['profile-text']">
                    <div :class="$style.username">{{ memInfo.user.show_alias ? memInfo.user.alias : memInfo.user.username }}</div>
                </div>
            </div>
            <div :class="$style['mem-balance']">
                <i :class="$style['icon-wallet']">
                    <icon name="wallet" />
                </i>
                <span :class="$style.text">{{ $text('S_ACCOUNT_BALANCE', '帐户余额') }}:</span>
                <div :class="$style['balance-total']">
                    <span :class="$style.balance">{{ memBalance.total }}&nbsp;{{ memCurrency }}</span>
                    <span :class="$style['icon-sync']" @click="onUpdate">
                        <icon
                            :spin="updating"
                            name="sync"
                            width="14"
                            height="14"
                        />
                    </span>
                </div>
            </div>
            <div :class="[$style['btn-wrap'], 'clearfix']">
                <div @click="toDeposit">{{ $text('S_DEPOSIT', '充值') }}</div>
                <div @click="toWithdraw">{{ $text('S_WITHDRAWAL_TEXT', '提现') }}</div>
            </div>
        </div>
        <div :class="`mcenter-list ${listSwitch ? 'show' : ''}`">
            <template v-for="title in mcenterListFilter">
                <div
                    :key="title.key"
                    :title="$t(title.text)"
                    :class="[$style['mcenter-link'], title.key, { [$style['current']]: title.key === currentTitle }, $style['one-column']]"
                    @click="navExpand(title.key)"
                >
                    <div :class="$style['link-icon']">
                        <icon
                            :name="nalTitleIcon[title.key]"
                            width="30"
                            height="30"
                        />
                    </div>
                    <div :class="$style['link-text']">
                        {{ $t(title.text) }}
                    </div>
                    <div :class="$style['link-fold']">
                        <icon
                            v-show="isNavOpen[title.key]"
                            name="chevron-down"
                            width="20"
                            height="20"
                        />
                        <icon
                            v-show="!isNavOpen[title.key]"
                            name="chevron-right"
                            width="20"
                            height="20"
                        />
                    </div>
                </div>
                <div
                    v-for="item in title.item"
                    v-show="isNavOpen[title.key]"
                    :key="item.key"
                    :title="$t(item.text)"
                    :class="[$style['mcenter-detail'], item.key, { [$style['current']]: item.key == isCurrent }, $style['one-column']]"
                    @click="navChangePage(item.key)"
                >
                    <div :class="$style['v-line']" />
                    <div :class="$style['link-text']">
                        {{ $t(item.text) }}
                    </div>
                </div>
            </template>
        </div>
        <div :class="$style['message-info']">
            <div :class="$style.title">{{ $text('S_VERIFY_TITLE', '已验证信息') }}</div>
            <div :class="$style['info-wrap']">
                <div
                    v-for="info in messageList"
                    :key="info.key"
                    :class="$style['info-list']"
                    @click="onChangePage(info.url)"
                >
                    <div :class="$style['title-icon']">
                        <icon
                            :name="info.icon"
                            width="16"
                            height="16"
                        />
                    </div>
                    <div :class="$style.message">
                        <div :class="$style['info-text']">{{ info.text }}</div>
                        <div :class="$style['info-tips']">{{ info.tips }}</div>
                    </div>
                    <div :class="$style['verify-icon']">
                        <icon
                            v-if="info.enable"
                            :class="$style['enable-icon']"
                            name="check-circle"
                            width="16"
                            height="16"
                        />
                        <icon
                            v-else
                            name="times-circle"
                            width="16"
                            height="16"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="headStatus" :class="$style['head-img-wrap']">
            <div :class="$style['head-img']">
                <div :class="$style['close-btn']">
                    <div :class="$style['icon-wrap']" @click="headStatus = false">
                        <icon name="times" />
                    </div>
                </div>
                <div :class="$style['head-title']">
                    {{ $text('S_CHOOSE_AVATAR2', '选择头像') }}
                </div>
                <div :class="$style['img-wrap']">
                    <img
                        v-for="(num, index) in 16"
                        :key="num"
                        :class="{[$style['is-current']]: imageId === index}"
                        :src="`/static/image/mcenter/theme/miller/profile_photo_${index}.png`"
                        @click="imageId = index"
                    />
                </div>
                <div :class="$style['submit-btn']" @click="submit">
                    {{ $text('S_DETDRMINE', '确定') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters, mapActions } from 'vuex';
import icon from 'vue-awesome/components/Icon';
import ajax from '@/lib/ajax';
import mcenter from '@/api/mcenter';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';

export default {
    components: {
        icon
    },
    props: {
        navChangePage: {
            type: Function,
            default: () => {}
        },
        listSelect: {
            type: Function,
            default: () => {}
        },
        isCurrent: {
            type: String,
            default: ''
        },
        listSwitch: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            updating: false,
            isBindBank: false,
            imageId: 0,
            headStatus: false,
            isNavOpen: {},
            nalTitleIcon: {
                account: 'user',
                bank: 'dollar-sign',
                tcenter: 'users',
                bet: 'clipboard-list',
                info: 'comment-dots'
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            mcenterList: 'getMcenterList',
            memCurrency: 'getMemCurrency',
            memBalance: 'getMemBalance',
            vipInfo: 'getVip'
        }),
        hasVip() {
            // VIP啟用判斷
            return this.memInfo.user.display_vip;
        },
        mcenterListFilter() {
            const mcenterData = cloneDeep(this.mcenterList);
            const result = [];

            mcenterData.forEach((data) => {
                if (data.key === 'account') {
                    const item = [];

                    data.item.forEach((info) => {
                        if (info.key === 'accountVip' && !this.hasVip) {
                            return;
                        }

                        item.push(info);
                    });

                    result.push({ ...data, item });
                    return;
                }

                if (data.key === 'bank') {
                    const item = [];

                    data.item.forEach((info) => {
                        // 必博已有充值提款，因此左側選單排除存取款
                        if (info.key === 'deposit' || info.key === 'withdraw') {
                            return;
                        }

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
        messageList() {
            return [
                {
                    key: 'mobile',
                    enable: this.memInfo.phone.confirm,
                    icon: 'mobile-alt',
                    text: this.$text('S_MOBILE_VERIFICATION', '手机驗證'),
                    tips: this.memInfo.phone.confirm ? this.$text('S_BIND_ALREADY', '已绑定') : this.$text('S_NOT_BIND', '未绑定'),
                    url: 'accountData'
                },
                {
                    key: 'email',
                    enable: this.memInfo.email.confirm,
                    icon: 'envelope',
                    text: this.$text('S_EMAIL_VERIFICATION', '邮箱验证'),
                    tips: this.memInfo.email.confirm ? this.$text('S_BIND_ALREADY', '已绑定') : this.$text('S_NOT_BIND', '未绑定'),
                    url: 'accountData'
                },
                {
                    key: 'name',
                    enable: this.memInfo.user.name,
                    icon: 'user',
                    text: this.$text('S_REAL_NAME_CONFIRM', '实名认证'),
                    tips: this.memInfo.user.name ? this.$text('S_BIND_ALREADY', '已绑定') : this.$text('S_NOT_BIND', '未绑定'),
                    url: 'accountData'
                },
                {
                    key: 'bank',
                    enable: this.isBindBank,
                    icon: 'credit-card',
                    text: this.$text('S_BIND_BANK', '绑定银行卡'),
                    tips: this.isBindBank ? this.$text('S_BIND_ALREADY', '已绑定') : this.$text('S_NOT_BIND', '未绑定'),
                    url: 'accountBankCard'
                }
            ];
        },
        currentTitle() {
            const current = this.isCurrent;

            this.mcenterListFilter.forEach((data) => {
                data.item.forEach((info) => {
                    if (info.key === current) {
                        return data.key;
                    }
                });
            });
            return '';
        }
    },
    created() {
        ajax({
            method: 'get',
            url: '/api/payment/v1/c/user_bank/list',
            errorAlert: false,
            success: ({ result, ret }) => {
                if (result !== 'ok') {
                    return;
                }

                this.isBindBank = ret.some((info) => info.common);
            }
        });

        this.actionSetMcenterMsgCount();
        // 30秒更新一次未讀訊息
        window.setInterval(() => {
            this.actionSetMcenterMsgCount();
        }, 30000);

        if (this.currentTitle){
            this.$set(this.isNavOpen, this.currentTitle, true);
        }
    },
    methods: {
        ...mapActions([
            'actionSetUserdata',
            'actionSetUserBalance',
            'actionSetMcenterMsgCount'
        ]),
        /**
         * 更新餘額
         * @method onUpdate
         */
        onUpdate() {
            if (this.updating) {
                return;
            }

            this.isShow = false;
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
            window.scrollTo(0, 0);
            this.$depositLink(true);
        },
        /**
         * 前往線上取款頁
         * @method toWithdraw
         */
        toWithdraw() {
            window.scrollTo(0, 0);

            mcenterPageAuthControl('withdraw').then((response) => {
                if (!response || !response.status) {
                    return;
                }

                this.$router.push('/page/mcenter/withdraw');
            });
        },
        onChangePage(page) {
            window.scrollTo(0, 0);

            if (page === 'accountBankCard') {
                mcenterPageAuthControl(page).then((response) => {
                    if (!response || !response.status) {
                        return;
                    }
                    this.navChangePage(page);
                });
                return;
            }
            this.navChangePage(page);
        },
        submit() {
            if (this.memInfo.user.image === this.imageId) return;
            mcenter.accountDataSet({
                params: { image: this.imageId },
                success: () => {
                    this.actionSetUserdata();
                    this.headStatus = false;
                }
            });
        },
        navExpand(title) {
            this.$set(this.isNavOpen, title, !this.isNavOpen[title]);
        }
    }
};
</script>

<style lang="scss" module>
.nav-list {
    float: left;
    width: 300px;
    box-shadow: 0 0 10px rgba(94, 91, 91, 0.13);
    background: #FFF;
}

.mem-info {
    padding: 20px 20px 95px;
    background: #292929 url('/static/image/mcenter/theme/miller/side_menu_bg.png') center bottom no-repeat;
    margin: 0 0 -1px;
    position: relative;
}

.profile-photo {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    width: 50px;
    height: 50px;
    margin: 0 10px 0 0;
    border: 1px solid #FFF;
    border-radius: 50%;
    cursor: pointer;

    > img {
        display: block;
        width: 100%;
    }

    &:hover {
        .mask,
        .btn-photo {
            display: block;
        }
    }
}

.mask {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 50%;
    background-color: #000;
    opacity: 0.5;
}

.btn-photo {
    display: none;
    position: absolute;
    top: 13px;
    right: 14px;
    margin: auto;

    > svg {
        display: block;
        margin: auto;
        color: #FFF;
    }
}

.profile-text {
    display: inline-block;
    vertical-align: middle;
    color: #FFF;
    font-size: 12px;

    .username {
        font-size: 18px;
    }
}

.btn-vip {
    background: url('/static/image/mcenter/theme/miller/vip_bg.png') no-repeat;
    position: absolute;
    top: 0;
    right: 20px;
    width: 43px;
    height: 57px;

    img {
        position: absolute;
        top: 20px;
        left: 8px;
    }

    span {
        font-size: 14px;
        color: #FFF;
        position: absolute;
        bottom: 11px;
        right: 1px;
        width: 18px;
        text-align: left;
        display: block;
    }
}

.mem-balance {
    padding: 15px 0 0 0;
    border-top: 1px solid rgba(255,255,255,0.2);
    margin: 20px 0 0 0;

    > span {
        display: inline-block;
        line-height: initial;
        vertical-align: middle;
    }

    .icon-wallet {
        color: #CACACA;
        border: 1px solid #CACACA;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        font-size: 12px;
        display: inline-block;
        vertical-align: middle;
        margin: 0 5px 0 0;

        svg {
            transform: scale(.7);
            margin: 3px auto 0;
            display: block;
        }
    }
}

.balance-total {
    text-align: center;
    margin: 25px 0 30px 0;
}

.text {
    color: #DBDBDB;
    font-size: 12px;
}

.balance {
    font-size: 30px;
    color: #F7B500;
    display: inline-block;
    line-height: 1.1;
}

.icon-sync {
    color: #FFF;
    display: inline-block;
    vertical-align: middle;
    margin: 7px 0 18px 5px;
    cursor: pointer;

    > svg {
        display: block;
    }
}

.btn-wrap {
    > div {
        float: left;
        width: 122px;
        height: 32px;
        line-height: 30px;
        border: 1px solid #F7B500;
        border-radius: 2px;
        background: transparent;
        color: #FFF;
        font-size: 14px;
        text-align: center;
        transition: all 0.5s;
        cursor: pointer;

        &:last-child {
            float: right;
            background: #F7B500;
            color: #292929;
        }

        &:hover {
            background: #FFD152;
        }
    }
}

.mcenter-link {
    position: relative;
    cursor: pointer;
    background: #F7B500;
    padding: 15px 40px;

    &.current,
    &.active,
    &:hover {
        background: #FFD152;
    }

    &.one-column {
        .link-icon,
        .link-text {
            display: inline-block;
            vertical-align: middle;
        }
    }

    .link-fold {
        position: absolute;
        top: 50%;
        right: 27px;
        color: #FFF;
        transform: translateY(-50%);
    }
}

.mcenter-detail {
    position: relative;
    cursor: pointer;
    color: #7E7E7E;
    background: #292929;
    padding: 10px 0;
    height: 40px;
    font-size: 14px;

    &.current {
        .link-text {
            color: #FFF;
        }
    }

    .link-text {
        color: #7E7E7E;
        padding-left: 90px;
        width: 100%;

        &.active,
        &:hover {
            color: #FFF;
        }
    }

    &.one-column {
        .link-icon,
        .link-text {
            display: inline-block;
            vertical-align: middle;
        }
    }
}

.v-line {
    position: absolute;
    top: 0;
    left: 53px;
    border-left: 1px solid #7E7E7E;
    height: 40px;
}

.link-icon {
    color: #F7B500;
    background: #FFF;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    margin: 0 15px 0 0;

    > svg {
        display: block;
        margin: 0 auto;
        transform: scale(0.6);
    }
}

.badge {
    min-width: 28px;
    height: 20px;
    padding: 0 3px;
    border-radius: 20px;
    line-height: 20px;
    background-color: #D0111A;
    color: #FFF;
    text-align: center;
    display: inline-block;
    margin: 0 0 0 15px;
}

.link-text {
    color: #0C0C0C;
    font-size: 14px;
}

.message-info {
    background-color: #FFF;
}

.title {
    line-height: 23px;
    padding: 15px 15px 13px 15px;
    color: #000;
    font-size: 16px;
}

.info-wrap {
    border-top: 1px solid #F0EDED;
}

.info-list {
    position: relative;
    padding: 13px 15px;
    transition: all .2s;
    cursor: pointer;

    &:hover {
        background: #f2f2f2;
    }
}

.info-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    margin: auto;
    color: #C5CCD8;

    > svg {
        display: block;
        margin: 0 auto;
    }
}

.title-icon {
    composes: info-icon;
    left: 15px;
}

.verify-icon {
    composes: info-icon;
    right: 15px;
    color: #CF2A2A;

    .enable-icon {
        color: #357A38;
    }
}

.message {
    line-height: 17px;
    padding: 0 30px;
    font-size: 12px;
}

.info-text {
    color: #000;
}

.info-tips {
    color: #9298A2;
}

.head-img-wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.29);
}

.head-img {
    position: fixed;
    width: 395px;
    height: 536px;
    top: 97px;
    left: 42%;
    background-color: #FFF;
}

.close-btn {
    text-align: right;
}

.icon-wrap {
    display: inline-block;
    cursor: pointer;

    svg {
        color: #606266;
        width: 24px;
        height: 24px;
        margin: 10px 10px 0 0;
    }
}

.head-title {
    margin-bottom: 25px;
    font-size: 24px;
    text-align: center;
    margin-top: 15px;
}

.img-wrap {
    width: 364px;
    height: 320px;
    margin: 0 auto;
    overflow-y: auto;

    img {
        width: 54px;
        height: 54px;
        margin: 0 24px 22px 9px;
        cursor: pointer;
    }
}

.is-current {
    border: 3px solid #F7B500;
    border-radius: 50%;
}

.submit-btn {
    width: 328px;
    height: 38px;
    margin: 33px 32px;
    line-height: 38px;
    color: #FFF;
    background-color: #F7B500;
    text-align: center;
    line-height: 38px;
}

</style>
