import { mapActions, mapGetters } from 'vuex';

import axios from 'axios';

export default {
    props: {

    },
    data() {
        return {
            formData: {
                target_username: "", //接收使用者帳號
                amount: "", //轉點額度
                phone: "", //手機號碼
                keyring: "", //驗證碼
            },
            errorMessage: {
                target_username: "",
                amount: "",
                phone: "",
                keyring: "",
            },
            tipMsg: '', // api message
            isSendKeyring: false,
            isSendRecharge: false,
            isVerifyForm: false,
            isVerifyPhone: false,
            times: 0,
            //轉讓額度設定
            rechargeConfig: {
                recharge_limit: 0 // 最低限額
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: "getMemInfo",
            pwdResetInfo: 'getPwdResetInfo',
        }),
        inputInfo() {
            return [
                { key: "target_username", title: "转入帐号", error: "", placeholder: "请输入下线帐号", },
                { key: "amount", title: "转让金额", error: "", placeholder: `单笔转让不得少于${this.rechargeConfig.recharge_limit}元` },
                { key: "phone", title: "手机号码", error: "", placeholder: "请输入手机号码", maxlength: 11 },
                { key: "keyring", title: "获取验证码", error: "", placeholder: "请输入验证码", maxlength: 4 }
            ]
        },

    },
    methods: {
        ...mapActions([
            "actionSetUserBalance",
            "actionSetUserdata",
            'actionSetGlobalMessage',
        ]),
        verification(item) {
            let errorMessage = '';
            if (item.key === "phone") {
                if (this.formData.phone.length < 11) {
                    errorMessage = "手机格式不符合要求";
                    this.isVerifyPhone = false;
                } else {
                    errorMessage = "";
                    this.isVerifyPhone = true;
                }
            }

            if (item.key === "amount") {
                const limit = Number(this.rechargeConfig.recharge_limit) || 0;
                if (limit &&
                    Number(this.formData.amount) < limit) {
                    errorMessage = "转帐金额低于最低限额";
                } else {
                    errorMessage = "";
                }
            }

            if (item.key == "target_username") {
                const data = this.pwdResetInfo["username"];
                const re = new RegExp(data.regExp);
                const msg = this.$t(data.errorMsg);

                this.formData.target_username = this.formData.target_username
                    .replace(' ', '')
                    .trim()
                    .replace(/[\W]/g, '');

                console.log(re.test(this.formData.target_username))
                if (!re.test(this.formData.target_username)) {
                    errorMessage = msg;
                }

            }

            this.errorMessage[item.key] = errorMessage;

            // 檢查無錯誤訊息
            const noError = this.inputInfo.every((item) => {
                if (this.errorMessage[item.key]) {
                    return false;
                } else {
                    return true;
                }
            })
            const hasValue = this.inputInfo.every((item) => {
                if (!this.formData[item.key]) {
                    return false;
                } else {
                    return true;
                }
            })
            this.isVerifyForm = noError && hasValue;
        },
        // 是否進行轉讓額度
        getRechargeBalance() {
            axios({
                method: 'get',
                url: '/api/v1/c/recharge/balance'
            }).then(res => {
            }).catch(error => {
                console.log(error)
            })
        },
        // 轉讓額度設定
        getRechargeConfig() {
            axios({
                method: 'get',
                url: '/api/v1/c/recharge/config'
            }).then(res => {
                if (res && res.data && res.data.result === "ok") {
                    this.rechargeConfig = res.data.ret;
                } else {
                    this.actionSetGlobalMessage(res.data.msg);
                }
            }).catch(error => {
                console.log(error)
            })
        },
        // 獲取驗證碼
        getKeyring() {
            if (!this.formData.phone && this.isSendKeyring) {
                return;
            }

            this.tipMsg = "";
            this.isSendKeyring = true;
            axios({
                method: 'post',
                url: '/api/v1/c/player/valet/recharge/sms',
                data: {
                    phone: "86-" + this.formData.phone,
                    captcha_text: this.captchaData ? this.captchaData : ''
                }
            }).then(res => {
                if (res && res.data && res.data.result === "ok") {
                    this.times = 60;
                    this.timer = setInterval(() => {
                        if (this.times === 0) {
                            this.isSendKeyring = false;
                            clearInterval(this.timer);
                            this.timer = null;
                            return;
                        }
                        this.times -= 1;
                    }, 1000);
                    this.tipMsg = this.$text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", 5);
                } else {
                    setTimeout(() => {
                        this.isSendKeyring = false;
                    }, 1500)
                    this.tipMsg = `${res.data.msg}`;
                }
            }).catch(error => {
                this.times = '';
                this.tipMsg = `${error.response.data.msg}`;
                setTimeout(() => {
                    this.isSendKeyring = false;
                }, 1500)
            })
        },
        sendRecharge() {
            if (!isVerifyForm || !isSendRecharge) {
                return;
            }
            this.isSendRecharge = true;

            axios({
                method: 'post',
                url: '/api/v1/c/recharge',
                data: {
                    ...this.formData,
                    amount: Number(this.formData.amount),
                    phone: "86-" + this.formData.phone,
                }
            }).then(res => {
                if (res && res.data && res.data.result === "ok") {
                    this.actionSetGlobalMessage("转让成功");
                } else {
                    this.tipMsg = `${res.data.msg}`;
                }

                this.actionSetUserdata(true);
                setTimeout(() => {
                    this.isSendRecharge = false;
                }, 1500)
            }).catch(error => {
                this.tipMsg = `${error.response.data.msg}`;
                setTimeout(() => {
                    this.isSendRecharge = false;
                }, 1500)
            })
        }
    }
};
