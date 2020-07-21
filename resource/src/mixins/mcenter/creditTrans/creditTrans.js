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
            memInfo: "getMemInfo"
        }),
        inputInfo() {
            return [
                { key: "target_username", title: "转入帐号", error: "", placeholder: "请输入下线帐号", },
                { key: "amount", title: "转让金额", error: "", placeholder: `单笔转让不得少于${this.rechargeConfig.recharge_limit}元` },
                { key: "phone", title: "手机号码", error: "", placeholder: "请输入手机号码" },
                { key: "keyring", title: "获取验证码", error: "", placeholder: "请输入验证码" }
            ]
        },

    },
    methods: {
        ...mapActions([
            "actionSetUserBalance",
            "actionSetUserdata",
            'actionSetGlobalMessage'
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

            this.errorMessage[item.key] = errorMessage;

            let verify = true;
            // 檢查無錯誤訊息
            // Object.keys(this.errorMessage).every((key) => {
            //     console.log(key)
            //     if (!this.errorMessage[key]) {
            //         verify = false;
            //         return;
            //     }
            // })
            this.isVerifyForm = verify;
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
                }
            }).catch(error => {
                console.log(error)
            })
        },
        // 獲取驗證碼
        getKeyring() {
            if (!this.formData.phone) {
                return;
            }

            this.tipMsg = "";
            axios({
                method: 'post',
                url: '/api/v1/c/player/valet/recharge/sms',
                data: {
                    phone: "86-" + this.formData.phone,
                    captcha_text: this.captchaData ? this.captchaData : ''
                }
            }).then(res => {
                this.actionSetUserdata(true);
                this.times = 60;
                this.timer = setInterval(() => {
                    if (this.times === 0) {
                        clearInterval(this.timer);
                        this.timer = null;
                        return;
                    }
                    this.times -= 1;
                }, 1000);
                this.tipMsg = this.$text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", 5);
                this.isSendKeyring = false;
            }).catch(error => {
                this.times = '';
                this.tipMsg = `${error.response.data.msg}`;
                this.isSendKeyring = false;
            })
        },
    }
};
