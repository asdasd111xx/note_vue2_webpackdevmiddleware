import {
    API_MCENTER_DEPOSIT_CHANNEL,
    API_MCENTER_DEPOSIT_INPAY,
    API_MCENTER_DEPOSIT_THIRD,
    API_TRADE_RELAY
} from '@/config/api';
import { mapActions, mapGetters } from 'vuex';

import BigNumber from 'bignumber.js/bignumber';
import ajax from '@/lib/ajax';
import { getCookie } from '@/lib/cookie';

export default {
    data() {
        return {
            username: '',
            depositData: [],
            orderData: {},
            passRoad: [],
            isDepositAi: false,
            curPaymentGroupIndex: 0,
            getPassRoadOrAi: {},
            curModeGroup: {},
            curPayInfo: {},
            curPassRoad: {},
            moneyValue: '',
            isShow: true,
            isErrorMoney: false,
            selectedBank: {},
            speedField: {
                depositMethod: '',
                depositTime: '',
                depositAccount: '',
                depositName: '',
                bankBranch: '',
                serialNumber: ''
            },
            isShowPop: false,
            isShowBlockTips: false,
            checkSuccess: false,
            yourBankData: [],
            webviewOpenUrl: ''
        };
    },
    watch: {
        webviewOpenUrl(val) {
            setTimeout(() => { document.location.href = this.webviewOpenUrl }, 200);
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            isLoading: 'getIsLoading'
        }),

        /**
         * 所有銀行
         *
         * @return array
         */
        allBanks() {
            // 銀行匯款一律吃 your_Bank 裡面所有的資料
            if (this.yourBankData.length > 0 && this.curPayInfo.payment_type_id === 5) {
                return this.yourBankData.map((bankInfo) => ({
                    label: bankInfo.name,
                    value: bankInfo.id,
                    swift_code: bankInfo.swift_code
                }));
            }

            if (!this.curPayInfo || !this.curPayInfo.banks) {
                return [];
            }

            return this.curPayInfo.banks.map((bankInfo) => ({
                label: bankInfo.name,
                value: bankInfo.id,
                swift_code: bankInfo.swift_code
            }));
        },
        /**
         * 實際金額
         *
         * @return number or string
         */
        realSaveMoney() {
            let promotionValue = this.curPayInfo.offer_enable ? new BigNumber(this.moneyValue).multipliedBy(new BigNumber(this.curPayInfo.offer_percent).dividedBy(100)).toNumber() : 0;
            const deductionValue = +this.getPassRoadOrAi.fee_percent ? new BigNumber(this.moneyValue).multipliedBy(new BigNumber(this.getPassRoadOrAi.fee_percent).dividedBy(100)).toNumber() : Number(this.getPassRoadOrAi.fee_amount);
            let total = '0.00';

            // 尚未輸入金額
            if (!this.moneyValue) {
                return '0.00';
            }

            if ((this.depositInterval.minMoney && this.depositInterval.minMoney > this.moneyValue) || (this.depositInterval.maxMoney && this.depositInterval.maxMoney < this.moneyValue)) {
                return '0.00';
            }

            // 未達到單筆存款金額，無優惠
            if (+this.moneyValue < +this.curPayInfo.offer_amount) {
                total = deductionValue ? new BigNumber(this.moneyValue).minus(new BigNumber(deductionValue)).toNumber(2) : Number(this.moneyValue);

                // 取小數點後二位，若為整數則補小數點
                total = total.toString().replace(/^([-]?(\d*))$/, '$1.');
                // 只取小數點後二位
                total = `${total}00`.replace(/(\d*\.\d{2})\d*/, '$1');
                return total;
            }

            // 超過優惠金額以單筆上限為主
            if (+this.curPayInfo.per_offer_limit > 0 && promotionValue > +this.curPayInfo.per_offer_limit) {
                promotionValue = +this.curPayInfo.per_offer_limit;
            }

            // 總額計算
            total = deductionValue ? new BigNumber(this.moneyValue).plus(promotionValue).minus(new BigNumber(deductionValue)).toNumber(2) : new BigNumber(this.moneyValue).plus(promotionValue);
            // 取小數點後二位，若為整數則補小數點
            total = total.toString().replace(/^([-]?(\d*))$/, '$1.');
            // 只取小數點後二位
            total = `${total}00`.replace(/(\d*\.\d{2})\d*/, '$1');
            return total;
        },
        /**
         * 設定銀行
         *
         * @return object
         */
        bankSelectValue: {
            get() {
                if (Object.keys(this.selectedBank).length === 0) {
                    return '';
                }

                return this.selectedBank;
            },
            set(value) {
                this.selectedBank = value;

                if (!this.isDepositAi && this.curModeGroup.channel_display) {
                    this.getPayPass();
                }
            }
        },
        /**
         * 當前存款廠商
         *
         * @return string
         */
        mixingDeposit() {
            // 只有迅付
            if (this.memInfo.config.deposit.includes('迅付') && this.memInfo.config.deposit.length === 1) {
                return 'onlyFastPay';
            }

            // 只有第三方
            if (!this.memInfo.config.deposit.includes('迅付') && this.memInfo.config.deposit.length > 0) {
                return 'onlyThird';
            }

            return 'mixing';
        },
        /**
         * 優惠金額提示訊息
         *
         * @return string
         */
        promitionText() {
            if (+this.curPayInfo.offer_limit && +this.curPayInfo.per_offer_limit) {
                return this.$text('S_DEPOSIT_PROMOTION_TEXT', {
                    replace: [
                        { target: '%s', value: `<span>${this.curPayInfo.offer_amount}</span>` },
                        { target: '%s', value: `<span>${this.curPayInfo.offer_percent}</span>` },
                        { target: '%s', value: `<span>${this.curPayInfo.per_offer_limit}</span>` },
                        { target: '%s', value: `<span>${this.curPayInfo.offer_limit}</span>` }
                    ]
                });
            }

            if (+this.curPayInfo.per_offer_limit) {
                return this.$text('S_DEPOSIT_PROMOTION_TEXT02', {
                    replace: [
                        { target: '%s', value: `<span>${this.curPayInfo.offer_amount}</span>` },
                        { target: '%s', value: `<span>${this.curPayInfo.offer_percent}</span>` },
                        { target: '%s', value: `<span>${this.curPayInfo.per_offer_limit}</span>` }
                    ]
                });
            }

            return this.$text('S_DEPOSIT_PROMOTION_TEXT03', {
                replace: [
                    { target: '%s', value: `<span>${this.curPayInfo.offer_amount}</span>` },
                    { target: '%s', value: `<span>${this.curPayInfo.offer_percent}</span>` }
                ]
            });
        },
        /**
         * 手續費提示訊息
         *
         * @return string
         */
        feeText() {
            // 百分比手續費
            if (+this.getPassRoadOrAi.fee_percent) {
                return this.$text('S_DEPOSIT_TIP06', { replace: [{ target: '%s', value: this.getPassRoadOrAi.fee_percent }] });
            }

            return this.$text('S_DEPOSIT_TIP07', { replace: [{ target: '%s', value: this.getPassRoadOrAi.fee_amount }] });
        },
        /**
         * 存款金額最小至最大值
         *
         * @return string
         */
        depositInterval() {
            const minMoney = +this.curPassRoad.per_trade_min || +this.curPayInfo.per_trade_min;
            const maxMoney = +this.curPassRoad.per_trade_max || +this.curPayInfo.per_trade_max;

            return {
                minMoney,
                maxMoney
            };
        },
        /**
         * 收款帳號
         *
         * @return string
         */
        receiptInfo() {
            if (this.curPassRoad.safe_account === false) {
                if ((this.curPayInfo.payment_method_id !== 3 && this.curPayInfo.payment_method_id !== 6) && (this.curPassRoad.qrcode || this.curPassRoad.photo)) {
                    return [
                        {
                            objKey: 'withdrawAccount',
                            title: this.$text('S_WITHDRAW_ACCOUNT', '收款帐号'),
                            value: this.curPassRoad.bank_account,
                            isFontBold: false,
                            copyShow: true
                        },
                        {
                            objKey: 'withdrawNickname',
                            title: this.$text('S_WITHDRAW_NICKNAME', '收款昵称'),
                            value: this.curPassRoad.bank_account_name,
                            isFontBold: false,
                            copyShow: false
                        },
                        {
                            objKey: 'withdrawDeliver',
                            title: this.$text('S_DELIVER_INFO', '收款资讯'),
                            isFontBold: true,
                            copyShow: false,
                            qrcode: [
                                {
                                    title: this.curPassRoad.photo_name,
                                    value: this.curPassRoad.photo
                                },
                                {
                                    title: this.curPassRoad.qrcode_name,
                                    value: this.curPassRoad.qrcode
                                }
                            ]
                        },
                        {
                            objKey: 'memo',
                            title: this.$text('S_DEPOSIT_TIP05', '提醒事项'),
                            value: this.curPassRoad.reminder.replace(/\n/ig, '<br/>'),
                            isFontBold: false,
                            copyShow: false,
                            htmlShow: true
                        }
                    ];
                }

                return [
                    {
                        objKey: 'withdrawBank',
                        title: this.$text('S_WITHDRAW_BANK', '收款银行'),
                        value: this.curPassRoad.bank_name,
                        isFontBold: false,
                        copyShow: true
                    },
                    {
                        objKey: 'withdrawBranch',
                        title: this.$text('S_WITHDRAW_BRANCH', '收款支行'),
                        value: this.curPassRoad.bank_branch,
                        isFontBold: false,
                        copyShow: true
                    },
                    {
                        objKey: 'a',
                        title: this.$text('S_WITHDRAW_ACCOUNT', '收款帐号'),
                        value: this.curPassRoad.bank_account,
                        isFontBold: true,
                        copyShow: true
                    },
                    {
                        objKey: 'withdrawName',
                        title: this.$text('S_WITHDRAW_NAME', '收款人姓名'),
                        value: this.curPassRoad.bank_account_name,
                        isFontBold: false,
                        copyShow: true
                    },
                    {
                        objKey: 'memo',
                        title: this.$text('S_DEPOSIT_TIP05', '提醒事项'),
                        value: this.curPassRoad.reminder.replace(/\n/ig, '<br/>'),
                        isFontBold: false,
                        copyShow: false,
                        htmlShow: true
                    }
                ];
            }

            return false;
        },
        singleLimit() {
            return `单笔充值金额： ${Number(this.depositInterval.maxMoney) === 0 ? this.$text('S_UNLIMITED', '无限制') : this.$text('S_MONEY_RANGE_SHORT', { replace: [{ target: '%s', value: this.depositInterval.minMoney }, { target: '%s', value: this.depositInterval.maxMoney }] })}`;
        }
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading'
        ]),
        /**
         * 取得支付群組
         * @method getPayGroup
         */
        getPayGroup() {
            this.isShow = true;
            this.actionSetIsLoading(true);

            if (this.mixingDeposit === 'onlyThird') {
                this.getPayThird().then(() => { [this.curModeGroup] = this.depositData; });
                return Promise.resolve({ status: 'third' });
            }

            // 取得銀行群組
            return ajax({
                method: 'get',
                url: `${API_MCENTER_DEPOSIT_INPAY}?username=${this.username}`,
                errorAlert: false,
                fail: (res) => {
                    if (res && res.data && res.data.msg && res.data.code) {
                        if (res.data.code === 'C150099') {
                            this.msg = `${res.data.msg}`
                            setTimeout(() => {
                                this.$router.push('/mobile/mcenter/bankCard?redirect=deposit')
                            }, 2000)
                        } else if (res.data.code === 'TM020067') {
                            this.isShowBlockTips = true;
                        } else {
                            this.msg = `${res.data.msg}`
                        }
                    }
                }
            }).then((response) => {
                this.isShow = false;
                this.actionSetIsLoading(false);

                if (response && response.result === 'ok') {
                    const filterData = response.ret.payment_group.filter((info) => !info.is_link)[0];

                    this.curModeGroup = filterData || {};
                    this.curPayInfo = filterData ? filterData.payment_group_content[0] : {};
                    this.depositData = response.ret.payment_group;
                    this.isDepositAi = response.ret.deposit_ai;

                    if (response.ret.your_bank) {
                        this.yourBankData = response.ret.your_bank;
                    }

                    if (this.isDepositAi) {
                        this.PassRoadOrAi();
                    }
                    if (this.mixingDeposit !== 'onlyFastPay') {
                        this.getPayThird();
                    }

                    if (!this.isDepositAi && this.curModeGroup.channel_display && (this.curPayInfo.bank_id || this.selectedBank.value)) {
                        this.getPayPass();
                        return { result: response.result };
                    }

                    return { result: response.result };
                }

                return response;
            });
        },
        /**
         * 智能 or 一般
         *
         * @return object
         */
        PassRoadOrAi() {
            let getDataInfo = this.curPassRoad ? this.curPassRoad : {};

            if (this.isDepositAi) {
                getDataInfo = this.curModeGroup ? this.curModeGroup.payment_group_content[this.curPaymentGroupIndex] : {};
            }
            this.getPassRoadOrAi = {
                fee_percent: getDataInfo.fee_percent,
                fee_amount: getDataInfo.fee_amount,
                amounts: getDataInfo.amounts
            };
        },
        /**
         * 取得第三方支付群組
         * @method getPayThird
         */
        getPayThird() {
            this.isShow = true;
            this.actionSetIsLoading(true);

            // 取得存款第三方
            return ajax({
                method: 'get',
                url: API_MCENTER_DEPOSIT_THIRD,
                errorAlert: false
            }).then((response) => {
                this.isShow = false;
                this.actionSetIsLoading(false);
                if (response && response.result === 'ok') {
                    this.depositData.push(...response.ret.deposit.filter((info) => info.name !== '迅付'));

                    if (this.mixingDeposit !== 'onlyFastPay' && Object.keys(this.curModeGroup).length === 0) {
                        [this.curModeGroup] = response.ret.deposit.filter((info) => info.name !== '迅付');
                    }
                }
            });
        },
        /**
         * 取得支付通道
         * @method getPayPass
         */
        getPayPass() {
            if (this.isShow) {
                return;
            }

            this.isShow = true;
            this.actionSetIsLoading(true);
            // 判斷是否為其他銀行，極速到帳(payment_method_id = 6)、銀行轉帳(payment_method_id = 3)皆有其他銀行選項
            const isOtherBank = (this.curPayInfo.payment_method_id === 3 && this.curPayInfo.bank_id === 0) || (this.curPayInfo.payment_method_id === 6 && this.curPayInfo.bank_id === 0);
            const nowBankId = !this.curPayInfo.bank_id ? this.selectedBank.value : this.curPayInfo.bank_id;

            // 取得銀行群組
            ajax({
                method: 'get',
                url: API_MCENTER_DEPOSIT_CHANNEL,
                errorAlert: false,
                params: {
                    payment_method_id: this.curPayInfo.payment_method_id,
                    bank_id: !isOtherBank ? nowBankId : '',
                    username: this.username
                },
                fail: (res) => {
                    if (res && res.data && res.data.msg && res.data.code) {
                        if (res.data.code === 'C150099') {
                            this.msg = `${res.data.msg}`
                            setTimeout(() => {
                                this.$router.push('/mobile/mcenter/bankCard?redirect=deposit')
                            }, 2000)
                        } else {
                            this.msg = `${res.data.msg}`
                        }
                    }
                }
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.passRoad = response.ret.map((info, index) => ({
                        ...info,
                        mainTitle: this.$text('S_PASS_TEXT', { replace: [{ target: '%s', value: index + 1 }] })
                    }));
                    this.curPassRoad = { ...this.passRoad[0] };
                }

                this.isShow = false;
                this.actionSetIsLoading(false);
                this.PassRoadOrAi();
            });
        },
        /**
         * 切換支付群組
         * @method changeMode
         * @param {Object} mode - 支付群組資訊
         */
        changeMode(mode) {
            if (mode.is_link && mode.link) {
                window.open(mode.link, 'third');
                return;
            }

            this.resetStatus();
            this.curModeGroup = mode;

            if (this.isDepositAi && this.curModeGroup.payment_group_content) {
                this.changePayMode(this.curModeGroup.payment_group_content[0], 0);
            }

            if (mode.uri) {
                return;
            }

            [this.curPayInfo] = this.curModeGroup.payment_group_content;
            // 判斷是否為其他銀行，極速到帳(payment_method_id = 6)、銀行轉帳(payment_method_id = 3)皆有其他銀行選項
            const isOtherBank = (this.curPayInfo.payment_method_id === 3 && this.curPayInfo.bank_id === 0) || (this.curPayInfo.payment_method_id === 6 && this.curPayInfo.bank_id === 0);

            if (!this.isDepositAi && this.curModeGroup.channel_display && (this.curPayInfo.bank_id || this.selectedBank.value || isOtherBank)) {
                this.getPayPass();
            }

            this.checkDepositInput();
        },
        /**
         * 切換支付方式
         * @method changePayMode
         * @param {Object} info - 支付方式資訊
         */
        changePayMode(info, index = null) {
            if (info.payment_method_id === this.curPayInfo.payment_method_id &&
                info.bank_id === this.curPayInfo.bank_id) {
                return;
            }

            this.resetStatus();
            this.curPayInfo = info;

            if (info.payment_method_id === 20) {
                this.checkSuccess = true;
            } else {
                this.checkSuccess = false;
            }

            // 判斷是否為其他銀行，極速到帳(payment_method_id = 6)、銀行轉帳(payment_method_id = 3)皆有其他銀行選項
            const isOtherBank = (this.curPayInfo.payment_method_id === 3 && this.curPayInfo.bank_id === 0) || (this.curPayInfo.payment_method_id === 6 && this.curPayInfo.bank_id === 0);

            if (this.isDepositAi) {
                this.curPaymentGroupIndex = index;
                this.PassRoadOrAi();
            }

            if (!this.isDepositAi && this.curModeGroup.channel_display && ((!this.curPayInfo.bank_id && isOtherBank) || (this.curPayInfo.bank_id || this.selectedBank.value))) {
                this.getPayPass();
            }

            // 銀行轉帳(payment_type_id === 5)，將您的銀行，預設成當前選擇的支付銀行
            if (this.yourBankData.length > 0 && this.curPayInfo.payment_type_id === 5) {
                this.defaultCurPayBank()
            }

            this.checkDepositInput();
        },
        /**
         * 切換通道
         * @method changePassRoad
         * @param {Object} info - 支付方式資訊
         */
        changePassRoad(info) {
            this.curPassRoad = info;
            this.PassRoadOrAi();
        },
        /**
         * 選擇通道金額
         * @method changeMoney
         * @param {String} money - 金額
         */
        changeMoney(money, isCustonmAmount) {
            this.isCustonmAmount = isCustonmAmount;

            this.moneyValue = money;
            this.isErrorMoney = false;
            this.checkOrderData();
        },
        /**
         * 驗證存款金額
         * @method verificationMoney
         * @param {String} money - 金額
         */
        verificationMoney(money) {
            if (this.depositInterval.maxMoney) {
                this.isErrorMoney = money > Number(this.depositInterval.maxMoney) || money < Number(this.depositInterval.minMoney);
                return;
            }

            this.isErrorMoney = !money;
        },
        /**
         * 金額輸入
         * @method submitInput
         * @param {String} moneyValue - 輸入金額
         */
        submitInput(value) {
            this.moneyValue = value.replace(/[^\d]/g, '');

            if (value.replace(/[^\d]/g, '')) {
                this.isErrorMoney = false;
            }

            this.checkOrderData();
        },
        submitDataInput(data, objKey) {
            if (objKey === 'depositName') {
                const re = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF.．·]/g;
                this.speedField.depositName = this.speedField.depositName.replace(re, '')
            }

            this.$emit('update:speedField', { data, objKey });
            this.checkOrderData();
        },
        /**
         * 資料重置
         * @method resetStatus
         */
        resetStatus() {
            this.curPayInfo = {};
            this.selectedBank = {};
            this.passRoad = [];
            this.curPassRoad = {};
            this.moneyValue = '';
            this.isErrorMoney = false;
            this.isSelectValue = '';
            this.nameCheckFail = false;

            Object.keys(this.speedField).forEach((info) => {
                if (info === 'depositMethod') {
                    this.speedField[info] = '';
                    return;
                }

                this.speedField[info] = '';
            });
        },
        /**
         * 送出存款表單
         * @method submitList
         * @param {String} inputValue - 輸入金額
         */
        submitList() {
            const reg = /^[^，:;！@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']*$/;

            if (!reg.test(this.speedField.depositName)) {
                return Promise.resolve({ status: 'NameFail' });
            }

            this.nameCheckFail = false;
            let isPWA = getCookie('platform') === "G" || window.location.host === "yaboxxxapp01.com";
            let isWebView = getCookie('platform') === "H" || window.location.host === "yaboxxxapp02.com";
            let newWindow;
            if (isPWA) {
                newWindow = window.open('', '', '_blank', true);
            }

            console.log("newWindow:", newWindow);
            console.log("isPWA:", isPWA, ",isWebView:", isWebView);

            const newWindowHref = (uri) => {
                setTimeout(() => {
                    newWindow.location.href = uri;
                }, 200)
            }

            // 第三方存款
            if (this.curModeGroup.uri) {
                return ajax({
                    method: 'get',
                    url: this.curModeGroup.uri,
                    errorAlert: false
                }).then((response) => {
                    this.isShow = false;
                    this.actionSetIsLoading(false);
                    let _isWebview = getCookie('platform') === "H" || window.location.host === "yaboxxxapp02.com";
                    let _isPWA = getCookie('platform') === "G" || window.location.host === "yaboxxxapp01.com";

                    if (response && response.result === 'ok') {
                        console.log(response.ret.uri);

                        // 流量分析事件 - 成功
                        window.dataLayer.push({
                            event: 'ga_click',
                            eventCategory: 'deposit',
                            eventAction: 'pay',
                            eventLabel: 'success'
                        });

                        if (_isWebview) {
                            this.webviewOpenUrl = response.ret.uri;
                            // setTimeout(function () { document.location.href = response.ret.uri; }, 250);
                            return { status: 'third' };
                        }
                        else if (_isPWA) {
                            newWindowHref(response.ret.uri);
                            return { status: 'third' };
                        }
                        window.open(response.ret.uri, 'third');
                        return { status: 'third' };
                    }

                    // 流量分析事件 - 失敗
                    window.dataLayer.push({
                        event: 'ga_click',
                        eventCategory: 'deposit',
                        eventAction: 'pay',
                        eventLabel: 'failure'
                    });

                    if (response && response.result !== 'ok') {
                        this.msg = response.msg;
                    }

                    if (_isPWA) {
                        newWindow.close();
                    }

                    return { status: 'error' };
                });
            }

            // 代客充值
            if (this.curPayInfo.external_url) {
                // 流量分析事件 - 成功
                window.dataLayer.push({
                    event: 'ga_click',
                    eventCategory: 'deposit',
                    eventAction: 'pay',
                    eventLabel: 'success'
                });

                if (isWebView) {
                    this.webviewOpenUrl = this.curPayInfo.external_url;
                    return Promise.resolve({ status: 'credit' });
                }
                else if (isPWA) {
                    newWindowHref(this.curPayInfo.external_url);
                    return Promise.resolve({ status: 'credit' });
                }

                window.open(this.curPayInfo.external_url, 'credit');
                return Promise.resolve({ status: 'credit' });
            }

            this.isShow = true;
            this.actionSetIsLoading(true);

            let paramsData = {
                api_uri: '/api/trade/v2/c/entry',
                username: this.username,
                method_id: this.curPayInfo.payment_method_id,
                bank_id: this.selectedBank.value || this.curPayInfo.bank_id,
                amount: this.moneyValue
            };

            if (!this.isDepositAi && this.curPassRoad.id) {
                paramsData = {
                    ...paramsData,
                    channel_id: this.curPassRoad.id
                };
            }
            // 銀行匯款、支付轉帳的極速到帳表單
            if ([5, 6].includes(this.curPayInfo.payment_type_id)) {
                paramsData = {
                    ...paramsData,
                    pay_account: this.speedField.depositAccount,
                    pay_username: this.speedField.depositName,
                    method: this.speedField.depositMethod,
                    branch: this.speedField.bankBranch,
                    deposit_at: this.speedField.depositTime,
                    sn: this.speedField.serialNumber
                };
            }

            return ajax({
                method: 'post',
                url: API_TRADE_RELAY,
                errorAlert: false,
                params: paramsData,
                fail: (res) => {
                    if (res && res.data && res.data.msg && res.data.code) {
                        if (res.data.code === 'C150099') {
                            this.msg = `${res.data.msg}`
                            setTimeout(() => {
                                this.$router.push('/mobile/mcenter/bankCard?redirect=deposit')
                            }, 2000)
                        } else {
                            this.msg = `${res.data.msg}`
                        }
                    }
                }
            }).then((response) => {

                this.isShow = false;
                this.actionSetIsLoading(false);
                let _isWebview = getCookie('platform') === "H" || window.location.host === "yaboxxxapp02.com";
                let _isPWA = getCookie('platform') === "G" || window.location.host === "yaboxxxapp01.com";

                if (response && response.result === 'ok') {
                    // 流量分析事件 - 成功
                    window.dataLayer.push({
                        event: 'ga_click',
                        eventCategory: 'deposit',
                        eventAction: 'pay',
                        eventLabel: 'success'
                    });

                    console.log(response.ret, _isWebview)

                    if (response.ret.deposit.url) {
                        if (_isWebview) {
                            this.webviewOpenUrl = response.ret.deposit.url;
                            // setTimeout(function () { document.location.href = response.ret.deposit.url; }, 250);
                            return { status: 'third' };
                        }
                        else if (_isPWA) {
                            newWindowHref(response.ret.deposit.url);
                            return { status: 'third' };
                        }

                        window.open(response.ret.deposit.url, 'third');
                        return { status: 'third' };
                    }

                    if (response.ret.wallet.url) {
                        if (_isWebview) {
                            this.webviewOpenUrl = response.ret.wallet.url;
                            // setTimeout(function () { document.location.href = response.ret.wallet.url; }, 250);
                            return { status: 'third' };
                        }
                        else if (_isPWA) {
                            newWindowHref(response.ret.wallet.url);
                            return { status: 'third' };
                        }

                        window.open(response.ret.wallet.url, 'third');
                        return { status: 'third' };
                    }

                    Object.keys(response.ret).forEach((info) => {
                        if (info === 'deposit' || info === 'wallet' || info === 'remit') {
                            return;
                        }

                        if (response.ret[info] && (info === 'is_deposit' || info === 'is_wallet' || info === 'is_remit')) {
                            const typeKey = info.split('_')[1];

                            this.orderData.orderInfo = response.ret[typeKey];
                            this.orderData.methodType = typeKey;
                            return;
                        }

                        this.orderData[info] = response.ret[info];
                    });

                    if (_isPWA) {
                        newWindow.close();
                    }

                    return { status: 'local' };
                }

                // 流量分析事件 - 失敗
                window.dataLayer.push({
                    event: 'ga_click',
                    eventCategory: 'deposit',
                    eventAction: 'pay',
                    eventLabel: 'failure'
                });

                if (response && response.result !== 'ok') {
                    this.msg = response.msg;
                }

                if (_isPWA) {
                    newWindow.close();
                }

                if (response.code === 'TM020058' || response.code === 'TM020059' || response.code === 'TM020060') {
                    window.location.reload();
                    return { status: 'error' };
                }

                return { status: 'error' };
            });
        },
        /**
         * 複製
         * @method copyInfo
         * @param {String} text - 需複製資訊
         */
        copyInfo(text) {
            this.$copyText(text);
            this.msg = "已复制到剪贴板";
        },
        checkOrderData() {

            // 針對在銀行匯款、網銀有出現Deposit-input
            if (this.isDisableDepositInput) {
                this.checkSuccess = false;
                return
            }

            // 金額輸入錯誤
            if (((this.isErrorMoney || !this.moneyValue) && !this.curModeGroup.uri) || (this.depositInterval.minMoney && this.depositInterval.minMoney > this.moneyValue) || (this.depositInterval.maxMoney && this.depositInterval.maxMoney < this.moneyValue)) {
                this.checkSuccess = false;
                return;
            }

            // 檢查銀行匯款、支付轉帳的極速到帳表單必填欄位
            if ([5, 6].includes(this.curPayInfo.payment_type_id)) {
                const checkItemMap = {
                    method: {
                        key: 'bankBranch',
                        alertMessage: this.$text('S_ENTER_DEPOSIT_BRANCH', '请输入银行支行')
                    },
                    deposit_at: {
                        key: 'depositTime',
                        alertMessage: this.$text('S_ENTER_DEPOSIT_TIME', '请输入存款时间')
                    },
                    pay_account: {
                        key: 'depositAccount',
                        alertMessage: this.$text('S_ENTER_DEPOSIT_ACCOUNT', '请输入存款帐号')
                    },
                    pay_username: {
                        key: 'depositName',
                        alertMessage: this.curPayInfo.payment_type_id === 6 ? this.$text('S_ENTER_DEPOSIT_NICKNAME', '请输入存款昵称') : this.$text('S_ENTER_DEPOSIT_NAME', '请输入存款人姓名')
                    },
                    sn: {
                        key: 'serialNumber',
                        alertMessage: this.$text('S_PLZ_ENTER_SERIAL_NUMBER', '请输入流水号')
                    }
                };
                const missingRequiredField = this.curPayInfo.field.find((item) => {
                    const check = checkItemMap[item.name];

                    // 存款方式不是存款方式不是ATM或銀行櫃台 則不需檢查銀行支行的必填
                    if (item.name === 'method' && !['2', '4'].includes(this.speedField.depositMethod)) {
                        return false;
                    }

                    if (check && item.required && !this.speedField[check.key]) {
                        return true;
                    }
                    return false;
                });
                if (missingRequiredField) {
                    this.checkSuccess = false;
                    return;
                }
            }

            this.checkSuccess = true;
        },
        checkDepositInput() {
            // 銀行匯款 or 網銀
            if (this.curPayInfo.payment_type_id === 5 || (this.curPayInfo.payment_type_id === 1 && this.curPayInfo.payment_type_id === 1)) {
                if (!this.isSelectValue) {
                    this.isDisableDepositInput = true;
                    this.checkSuccess = false;
                }
            }
        },
        defaultCurPayBank() {
            let target = this.allBanks.find(item => {
                return item.value === this.curPayInfo.bank_id;
            })

            if (target) {
                this.isSelectValue = target.label;
                this.bankSelectValue = target;
            }
        }
    }
};
