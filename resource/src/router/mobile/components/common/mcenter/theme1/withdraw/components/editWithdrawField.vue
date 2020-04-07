<template>
    <transition :name="'fade'">
        <div :class="[$style['withdraw-alert-wrap'], colorClass]">
            <div :class="$style['alert-wrap']">
                <div :class="$style['alert-title']">
                    {{ $text('S_SUBMIT_WITHDRAW', '提交取款资料') }}
                    <div :class="$style['alert-close-wrap']" @click="closeFuc(false)">
                        <icon
                            :class="$style['alert-close-btn']"
                            name="times"
                            width="20"
                            height="20"/>
                    </div>
                </div>
                <div :class="$style['alert-body-wrap']">
                    <div :class="$style['withdraw-info-table']">
                        <div :class="[$style['withdraw-info-tr'], 'clearfix']">
                            <div :class="[$style['withdraw-info-td'], $style['withdraw-info-thead']]">{{ $text('S_DATE', '日期') }}</div>
                            <div :class="$style['withdraw-info-td']">{{ withdrawData.created_at }}</div>
                        </div>
                        <div :class="[$style['withdraw-info-tr'], 'clearfix']">
                            <div :class="[$style['withdraw-info-td'], $style['withdraw-info-thead']]">{{ $text('S_ORDER_NUMBER', '订单号') }}</div>
                            <div :class="$style['withdraw-info-td']">{{ withdrawData.id }}</div>
                        </div>
                        <div :class="[$style['withdraw-info-tr'], 'clearfix']">
                            <div :class="[$style['withdraw-info-td'], $style['withdraw-info-thead']]">{{ $text('S_WITHDRAW_MONEY', '取款金额') }}</div>
                            <div :class="$style['withdraw-info-td']">{{ withdrawData.amount }}</div>
                        </div>
                        <div :class="[$style['withdraw-info-tr'], 'clearfix']">
                            <div :class="[$style['withdraw-info-td'], $style['withdraw-info-thead']]">{{ $text('S_DEDUCTION_MONEY', '扣除金额') }}</div>
                            <div :class="$style['withdraw-info-td']">{{ withdrawData.deduction }}</div>
                        </div>
                        <div :class="[$style['withdraw-info-tr'], 'clearfix']">
                            <div :class="[$style['withdraw-info-td'], $style['withdraw-info-thead']]">{{ $text('S_REAL_WITHDRAW', '实际出款') }}</div>
                            <div :class="$style['withdraw-info-td']">{{ withdrawData.real_amount }}</div>
                        </div>
                        <template v-if="withdrawData.withdraw === '迅付'">
                            <div :class="[$style['withdraw-info-tr'], 'clearfix']">
                                <div :class="[$style['withdraw-info-td'], $style['withdraw-info-thead']]">{{ $text('S_WITHDRAW_ACCOUNT02', '取款帐号') }}</div>
                                <div :class="[$style['withdraw-info-td'], $style['withdraw-account']]">
                                    <select
                                        v-model="selectAccountValue"
                                        @change="setAccountValue(selectAccountValue)"
                                        :class="$style['withdraw-select']"
                                    >
                                        <option
                                            v-for="item in allWithdrawAccount"
                                            :key="item.value"
                                            :value="item.value"
                                        >
                                            {{ item.label }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div :class="[$style['withdraw-info-tr'], 'clearfix']">
                                <div :class="[$style['withdraw-info-td'], $style['withdraw-info-thead']]">{{ $text('S_DAW_DRWAL_PASSWORD', '取款密码') }}</div>
                                <div :class="[$style['withdraw-info-td'], $style['withdraw-pwd-wrap']]">
                                    <input
                                        v-model="withdrawPwd"
                                        :class="$style['withdraw-input']"
                                        type="password"
                                        autocomplete="off"
                                        @input="withdrawPwd = $event.target.value.replace(/[^\d]/g, '')"
                                    />
                                </div>
                            </div>
                        </template>
                    </div>
                    <div :class="$style['btn-wrap']">
                        <div :class="$style['cancel-btn']" @click="closeFuc(false)">{{ $text('S_CANCEL', '取消') }}</div>
                        <div :class="$style['confirm-btn']" @click="saveWithdrawData">{{ $text('S_ENTER_SHORT', '提交') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';
import { API_TRADE_RELAY, API_MCENTER_WITHDRAW, API_WITHDRAW } from '@/config/api';

export default {
    props: {
        closeFuc: {
            type: Function,
            default: () => {}
        },
        withdrawData: {
            type: Object,
            default: () => {}
        },
        changeThirdUrl: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            withdrawUserData: [],
            withdrawAccount: {},
            withdrawPwd: '',
            isAjax: false,
            selectAccountValue: ''
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        /**
         * 使用者所有取款帳戶
         *
         * @return Array
         */
        allWithdrawAccount() {
            if (!this.withdrawUserData.account && !this.withdrawUserData.wallet) {
                return [];
            }

            const resulAccount = [
                ...this.withdrawUserData.account.map(info => ({ ...info,
                    withdrawType: 'account_id',
                    label: info.alias,
                    value: info.id.toString() })),
                ...this.withdrawUserData.wallet.map(info => ({ ...info,
                    withdrawType: 'wallet_id',
                    label: info.alias,
                    value: info.id.toString() }))
            ];

            return resulAccount;
        },
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    watch: {
        withdrawAccount(info) {
            this.selectAccountValue = info.id.toString();
        }
    },
    created() {
        ajax({
            method: 'get',
            url: API_MCENTER_WITHDRAW,
            errorAlert: false
        }).then((response) => {
            if (response.result === 'ok') {
                this.withdrawUserData = response.ret;
                [this.withdrawAccount] = this.allWithdrawAccount;
            }
        });
    },
    methods: {
        openSelect(show) {
            if (show !== '') {
                this.isSelectShow = show;
                return;
            }

            this.isSelectShow = true;
        },
        saveWithdrawData() {
            if (this.isAjax) {
                return;
            }

            this.isAjax = true;

            // 第三方寫單
            ajax({
                method: 'get',
                url: API_WITHDRAW,
                errorAlert: true,
                params: {
                    amount: this.withdrawData.amount,
                    withdraw_id: this.withdrawData.id,
                    stage: 'forward',
                    logo: this.webInfo.logo ? `${this.webInfo.cdn_domain}${this.webInfo.logo}` : '',
                    mlogo: this.webInfo.m_logo ? `${this.webInfo.cdn_domain}${this.webInfo.m_logo}` : '',
                    title: encodeURI(this.memInfo.config.domain_name[this.curLang]),
                    favicon: this.webInfo.fav_icon ? `${this.webInfo.cdn_domain}${this.webInfo.fav_icon}` : '',
                    check: true
                }
            }).then((res) => {
                if (res.result === 'ok') {
                    if (this.withdrawData.withdraw === '迅付') {
                        // 迅付寫單
                        ajax({
                            method: 'post',
                            url: API_TRADE_RELAY,
                            errorAlert: true,
                            params: {
                                api_uri: '/api/trade/v2/c/withdraw/entry',
                                [`method[${this.withdrawAccount.withdrawType}]`]: this.withdrawAccount.id,
                                password: this.withdrawPwd,
                                withdraw_id: this.withdrawData.id
                            }
                        }).then((response) => {
                            if (response && response.result === 'ok') {
                                window.location.reload();
                                return;
                            }

                            this.isAjax = false;
                            this.closeFuc(false, {});
                        });

                        return;
                    }

                    this.isAjax = false;
                    this.closeFuc(false, {});
                    this.changeThirdUrl('withdrawMethod', res.ret.uri);
                }
            });
        },
        setAccountValue(val) {
            const index = $.map(this.allWithdrawAccount, item => item.value ).indexOf(val);
            this.withdrawAccount = this.allWithdrawAccount[index];
        }
    }
};
</script>

<style lang="scss" src="../css/indexEditWithdrawField.module.scss" module></style>
