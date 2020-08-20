import {
    API_MCENTER_WITHDRAW,
    API_TRADE_RELAY,
    API_WITHDRAW,
    API_WITHDRAW_BALANCE_BACK,
    API_WITHDRAW_CGPAY_BINDING,
    API_WITHDRAW_INFO,
    API_WITHDRAW_WRITE,
    API_AGCENTER_USER_LEVELS
} from '@/config/api';
import { mapActions, mapGetters } from 'vuex';

import ajax from '@/lib/ajax';
import axios from 'axios';
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
            // cgpayBindingAccount: {},
            thirdUrl: '',
            showAccount: false, // 帳戶資料檢查
            userLevelObj: {}, // 存放 Card type 開關 & 限綁一組開關
        };
    },
    computed: {
        ...mapGetters({
            mobileCheck: 'getMobileCheck',
            memInfo: 'getMemInfo',
            noticeData: 'getNoticeData',
            webInfo: 'getWebInfo',
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
        // noticeData() {
        //     let resultNotice = {};

        //     if (this.noticeData.filter((info) => info.event === 'trade_bind_wallet').length > 0) {
        //         this.noticeData.forEach((element) => {
        //             if (Object.keys(resultNotice).length === 0) {
        //                 resultNotice = element;
        //                 return;
        //             }

        //             if (new Date(element.id).getTime() > new Date(resultNotice.id).getTime()) {
        //                 resultNotice = element;
        //             }
        //         });

        //         if (Object.keys(resultNotice).length > 0 && resultNotice.result === 'ok') {
        //             this.cgpayBindingAccount = resultNotice;
        //             this.getWithdrawAccount();
        //             this.alertTipClose(false);
        //         }
        //     }
        // }
    },
    created() {
        this.actionSetIsLoading(true);
        this.getUserLevel();

        // 取得取款初始資料
        ajax({
            method: 'get',
            url: API_WITHDRAW_INFO,
            errorAlert: false,
            fail: (res) => {
                this.actionSetIsLoading(false);
                if (res.data && res.data.msg) {
                    this.actionSetGlobalMessage({ msg: res.data.msg })
                }
            }
        }).then((res) => {
            this.withdrawData = res;
            if (this.memInfo.config.withdraw === '迅付') {
                this.getWithdrawAccount();
            }
        });
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading',
            'actionSetUserdata',
            'actionSetGlobalMessage'
        ]),
        checkAccountData(target) {
            this.getAccountDataStatus().then((data) => {
                let check = true;
                Object.keys(data.ret).every(i => {
                    if (!data.ret[i] && i !== "bank") {
                        this.showAccount = true;
                        check = false;
                        return;
                    }
                })

                if (check && target === "bankCard") {
                    this.$router.push('/mobile/mcenter/bankcard?redirect=withdraw&type=bankCard')
                }

                if (check && target === "virtualBank") {
                    this.$router.push('/mobile/mcenter/bankcard?redirect=withdraw&type=virtualBank')
                }
            })
        },
        getAccountDataStatus() {
            return axios({
                method: 'get',
                url: '/api/v2/c/withdraw/check',
            }).then((res) => {
                if (res.data.result === "ok") {
                    return res.data;
                } else {
                    this.actionSetGlobalMessage({ msg: res.data.msg })
                }
            }).catch(res => {
                this.actionSetGlobalMessage({ msg: res.response.data.msg })
            });
        },
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
                    console.log(response.ret);
                    this.withdrawUserData = response.ret;

                    // if (Object.keys(this.cgpayBindingAccount).length > 0) {
                    //     this.withdrawAccount = this.allWithdrawAccount.filter((info) => Number(info.id) === Number(this.cgpayBindingAccount.ret.external_wallet_id));
                    //     return;
                    // }

                    [this.withdrawAccount] = this.allWithdrawAccount;
                } else {
                    this.msg = response && response.msg;
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
            // this.cgpayBindingAccount = {};
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
                    this.msg = '回收成功';
                }
            });
        },
        /**
         * 使用者層級並取得 card type & 電子錢包綁綁開關
         * @method getUserLevel
         */
        getUserLevel() {
            axios({
                method: "get",
                url: API_AGCENTER_USER_LEVELS
            }).then(response => {
                const { result, ret } = response.data;
                if (!response || result !== "ok") {
                    return;
                }

                this.userLevelObj = ret;
            });
        }
    }
};
