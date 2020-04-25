import {
    API_MCENTER_WITHDRAW,
    API_TRADE_RELAY,
    API_WITHDRAW,
    API_WITHDRAW_BALANCE_BACK,
    API_WITHDRAW_CGPAY_BINDING,
    API_WITHDRAW_INFO,
    API_WITHDRAW_WRITE
} from '@/config/api';
import { mapActions, mapGetters } from 'vuex';

import ajax from '@/lib/ajax';
import isMobile from '@/lib/is_mobile';

export default {
    data() {
        return {
            withdrawData: {},
            withdrawUserData: {},
            withdrawValue: '',
            withdrawPwd: '',
            withdrawAccount: {},
            isAlertTip: false,
            isAjaxUse: false,
            alertData: {
                title: this.$text('S_WITHDRAW_APPLY', '取款申请'),
                closeBtnText: this.$text('S_ENTER01', '我知道了'),
                type: 'successTip',
                tipTitle: this.$text('S_ENTER_SUCCESS', '提交成功'),
                tipImgSrc: ''
            },
            isLoading: false,
            cgpayBindingAccount: {},
            thirdUrl: ''
        };
    },
    computed: {
        ...mapGetters({
            mobileCheck: 'getMobileCheck',
            memInfo: 'getMemInfo',
            noticeData: 'getNoticeData',
            webInfo: 'getWebInfo'
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
                ...this.withdrawUserData.account.map((info) => ({ ...info, withdrawType: 'account_id' })),
                ...this.withdrawUserData.wallet.map((info) => ({ ...info, withdrawType: 'wallet_id' }))
            ];

            if (this.withdrawUserData.isSupportCGPay && !isMobile()) {
                return resulAccount.concat({ id: 'cgpay', alias: this.$text('S_ADD_CGPAY', '新增CGPay') });
            }

            return resulAccount;
        },
        /**
         * 實際取款金額
         *
         * @return number or string
         */
        realWithdrawMoney() {
            if (!this.withdrawValue && !this.withdrawData.audit.total.exceed_free_count) {
                return '--';
            }

            return (+this.withdrawValue) - (+this.withdrawData.audit.total.total_deduction);
        },
        /**
         * 取款金額提示文字
         *
         * @return number or string
         */
        withdrawMoneyTip() {
            if (+this.withdrawData.payment_charge.ret.withdraw_min > 0 && +this.withdrawData.payment_charge.ret.withdraw_max === 0) {
                return {
                    type: 'min',
                    text: `${this.$text('S_MINIMUM_MONEY', { replace: [{ target: '%s', value: this.withdrawData.payment_charge.ret.withdraw_min }] })}`
                };
            }

            if (+this.withdrawData.payment_charge.ret.withdraw_min === 0 && +this.withdrawData.payment_charge.ret.withdraw_max > 0) {
                return {
                    type: 'max',
                    text: `${this.$text('S_MAX_MONEY', { replace: [{ target: '%s', value: this.withdrawData.payment_charge.ret.withdraw_max }] })}`
                };
            }

            return {
                type: 'mixing',
                text: `${this.$text('S_SINGLE_LIMIT', '單筆限額')} ${this.withdrawData.payment_charge.ret.withdraw_min} ~ ${this.withdrawData.payment_charge.ret.withdraw_max}`
            };
        },
        /**
         * 是否顯示頁面
         *
         * @return boolean
         */
        isShow() {
            if (Object.keys(this.withdrawData).length > 0) {
                return true;
            }

            return false;
        },
        /**
         * 流水提示文字
         *
         * @return string
         */
        serialTip() {
            if (this.withdrawData.audit.total.deduction > 0) {
                return this.$text('S_SERIAL_NUMBER_TIP01', { replace: [{ target: '%s', value: this.withdrawData.audit.total.deduction }] });
            }

            return this.$text('S_SERIAL_CHANGE', '流水检查');
        },
        /**
         * CGPay優惠文字
         *
         * @return string
         */
        cgpayPromotionText() {
            let resultPromotion = Math.round(this.withdrawValue * (this.resultWithdrawAccount.offer_percent / 100));

            if (+this.resultWithdrawAccount.offer_limit > 0 && resultPromotion > +this.resultWithdrawAccount.offer_limit) {
                resultPromotion = +this.resultWithdrawAccount.offer_limit;
            }

            return this.$text('S_WITHDRAW_TIP03', { replace: [{ target: '%s', value: resultPromotion }] });
        },
        /**
         * 設定當前取款銀行
         *
         * @return string
         */
        resultWithdrawAccount: {
            get() {
                return this.withdrawAccount;
            },
            set(value) {
                if (value.id === 'cgpay') {
                    this.isLoading = true;
                    this.actionSetIsLoading(true);

                    ajax({
                        method: 'get',
                        url: `${API_WITHDRAW_CGPAY_BINDING}?wallet_gateway_id=1`,
                        errorAlert: false
                    }).then((response) => {
                        if (response.result === 'ok') {
                            this.isLoading = false;
                            this.actionSetIsLoading(false);

                            this.alertData = {
                                title: this.$text('S_SCANNING_BINDING', '扫描绑定'),
                                closeBtnText: this.$text('S_CLOSE', '关闭'),
                                type: 'cgpay',
                                tipTitle: this.$text('S_CGPAY_TIP04', '30秒后连结无效，并关闭视窗'),
                                tipImgSrc: response.ret.url
                            };

                            this.isAlertTip = true;
                        }
                    });
                    return;
                }

                this.alertData = {
                    title: this.$text('S_WITHDRAW_APPLY', '取款申请'),
                    closeBtnText: this.$text('S_ENTER01', '我知道了'),
                    type: 'successTip',
                    tipTitle: this.$text('S_ENTER_SUCCESS', '提交成功'),
                    tipImgSrc: ''
                };

                this.withdrawAccount = value;
            }
        }
    },
    watch: {
        noticeData() {
            let resultNotice = {};

            if (this.noticeData.filter((info) => info.event === 'trade_bind_wallet').length > 0) {
                this.noticeData.forEach((element) => {
                    if (Object.keys(resultNotice).length === 0) {
                        resultNotice = element;
                        return;
                    }

                    if (new Date(element.id).getTime() > new Date(resultNotice.id).getTime()) {
                        resultNotice = element;
                    }
                });

                if (Object.keys(resultNotice).length > 0 && resultNotice.result === 'ok') {
                    this.cgpayBindingAccount = resultNotice;
                    this.getWithdrawAccount();
                    this.alertTipClose(false);
                }
            }
        }
    },
    created() {
        if (!this.mobileCheck && this.$route.path === '/mobile/mcenter/withdraw') {
            this.$router.push('/mobile/mcenter/accountData');
            return;
        }

        this.actionSetIsLoading(true);
        // 取得取款初始資料
        ajax({
            method: 'get',
            url: API_WITHDRAW_INFO,
            errorAlert: false
        }).then((response) => {
            this.withdrawData = response;
            this.actionSetIsLoading(false);
        });

        if (this.memInfo.config.withdraw === '迅付') {
            this.getWithdrawAccount();
        }
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading'
        ]),
        /**
         * 取得取款帳戶
         * @method getWithdrawAccount
         */
        getWithdrawAccount() {
            this.isLoading = true;
            this.actionSetIsLoading(true);

            ajax({
                method: 'get',
                url: API_MCENTER_WITHDRAW,
                errorAlert: false
            }).then((response) => {
                this.isLoading = false;
                this.actionSetIsLoading(false);

                if (response.result === 'ok') {
                    this.withdrawUserData = response.ret;

                    if (Object.keys(this.cgpayBindingAccount).length > 0) {
                        this.withdrawAccount = this.allWithdrawAccount.filter((info) => Number(info.id) === Number(this.cgpayBindingAccount.ret.external_wallet_id));
                        return;
                    }

                    [this.withdrawAccount] = this.allWithdrawAccount;
                }
            });
        },
        /**
         * 送出取款資訊
         * @method submitWithdraw
         */
        submitWithdraw() {
            if (this.realWithdrawMoney === '--' || this.realWithdrawMoney <= 0) {
                alert(this.$text('S_WITHDRAW_ERROR_TIP01', '实际出款金额需大于0，请重新输入'));
                return Promise.resolve({ status: 'error', errorCode: '' });
            }

            const hasAccountId = !this.withdrawAccount.withdrawType ? 'account_id' : this.withdrawAccount.withdrawType;

            this.isLoading = true;
            this.actionSetIsLoading(true);

            // 本站寫單
            return ajax({
                method: 'post',
                url: API_WITHDRAW_WRITE,
                errorAlert: true,
                params: {
                    amount: this.withdrawValue,
                    // withdraw_password: this.withdrawPwd,
                    withdraw_password: '0000',
                    forward: true,
                    confirm: true,
                    max_id: this.withdrawData.audit.total.max_id,
                    audit_amount: this.withdrawData.audit.total.audit_amount,
                    offer_deduction: this.withdrawData.audit.total.offer_deduction,
                    administrative_amount: this.withdrawData.audit.total.administrative_amount
                },
                success: (response) => {
                    if (response && response.result === 'ok') {
                        if (this.memInfo.config.withdraw === '迅付') {
                            // 迅付寫單
                            ajax({
                                method: 'post',
                                url: API_TRADE_RELAY,
                                errorAlert: true,
                                params: {
                                    api_uri: '/api/trade/v2/c/withdraw/entry',
                                    [`method[${hasAccountId}]`]: this.withdrawAccount.id,
                                    password: this.withdrawPwd,
                                    withdraw_id: response.ret.id
                                }
                            }).then((res) => {
                                this.isLoading = false;
                                this.actionSetIsLoading(false);

                                if (res && res.result === 'ok') {
                                    this.alertTipClose(true);
                                }
                            });

                            return;
                        }

                        // 第三方寫單
                        ajax({
                            method: 'get',
                            url: API_WITHDRAW,
                            errorAlert: true,
                            params: {
                                amount: response.ret.amount,
                                withdraw_id: response.ret.id,
                                stage: 'forward',
                                logo: this.webInfo.logo ? `${this.webInfo.cdn_domain}${this.webInfo.logo}` : '',
                                mlogo: this.webInfo.m_logo ? `${this.webInfo.cdn_domain}${this.webInfo.m_logo}` : '',
                                title: encodeURI(this.memInfo.config.domain_name[this.curLang]),
                                favicon: this.webInfo.fav_icon ? `${this.webInfo.cdn_domain}${this.webInfo.fav_icon}` : '',
                                check: true
                            }
                        }).then((res) => {
                            this.isLoading = false;
                            this.actionSetIsLoading(false);

                            if (res.result === 'ok') {
                                this.thirdUrl = res.ret.uri;
                            }
                        });

                        return;
                    }

                    if (response.code === 'M500001') {
                        window.location.reload();
                        return;
                    }

                    this.isLoading = false;
                    this.actionSetIsLoading(false);
                },
                fail: (error) => {
                    if (error.data.code === 'M500001') {
                        window.location.reload();
                        return;
                    }

                    this.isLoading = false;
                    this.actionSetIsLoading(false);
                }
            });
        },
        /**
         * 關閉彈跳取款訊息
         * @method alertTipClose
         */
        alertTipClose(showType = false) {
            if (showType) {
                this.isAlertTip = showType;
                return;
            }

            this.isAlertTip = !this.isAlertTip;
            window.location.reload();
        },
        /**
         * 資料重置
         * @method resetValue
         */
        resetValue() {
            this.withdrawValue = '';
            this.withdrawPwd = '';
            this.withdrawAccount = {};
            this.cgpayBindingAccount = {};
        },
        /**
         * 更新帳戶金額
         * @method updateAmount
         */
        updateAmount() {
            if (this.isAjaxUse) {
                return;
            }

            this.isAjaxUse = true;

            ajax({
                method: 'get',
                url: API_WITHDRAW_INFO,
                errorAlert: false
            }).then((response) => {
                this.withdrawData = response;
                this.isAjaxUse = false;
            });
        },
        /**
         * 一鍵歸戶
         * @method balanceBack
         */
        balanceBack() {
            if (this.isAjaxUse) {
                return;
            }

            this.isAjaxUse = true;

            ajax({
                method: 'put',
                url: API_WITHDRAW_BALANCE_BACK,
                errorAlert: false
            }).then((response) => {
                if (response.result === 'ok') {
                    this.isAjaxUse = false;
                    this.updateAmount();
                }
            });
        }
    }
};
