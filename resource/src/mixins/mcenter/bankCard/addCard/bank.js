import { mapActions, mapGetters } from "vuex";

import ajax from "@/lib/ajax";
import axios from "axios";

export default {
    data() {
        return {
            bankList: [],
            currentBank: "",
            isShowPop: false,
            isVerifyPhone: false,
            formData: {
                // account_name: "",
                bank_id: "",
                province: '',
                city: '',
                branch: "",
                account: "",
                phone: "",
                keyring: ""
            },
            NextStepStatus: false,
            errorMsg: "",
            lockStatus: false,
            time: 0,
            msg: "",
            smsTimer: null,
            toggleCaptcha: false,
            captcha: null
        }
    },
    computed: {
        ...mapGetters({
            memInfo: "getMemInfo",
            siteConfig: "getSiteConfig"
        }),
        isShowCaptcha: {
            get() {
                return this.toggleCaptcha;
            },
            set(value) {
                return (this.toggleCaptcha = value);
            }
        },
        captchaData: {
            get() {
                return this.captcha;
            },
            set(value) {
                return (this.captcha = value);
            }
        },
        username() {
            if (!this.memInfo.user.name) {
                return "";
            }

            return this.memInfo.user.name.slice(0, 1);

            // return this.memInfo.user.name
            //   .split("")
            //   .map((item, index) => {
            //     if (index === 0) {
            //       return item;
            //     }
            //     return "*";
            //   })
            //   .join("");
        }
    },
    watch: {
        addBankCardStep() {
            if (this.addBankCardStep === "one") {
                this.formData.phone = "";
                this.formData.keyring = "";
                this.errorMsg = "";
                this.checkData();
            } else if (this.addBankCardStep === "two") {
                this.errorMsg = "";
            }
        },
        captchaData() {
            this.getKeyring();
        },
        "formData.phone"() {
            if (this.formData.phone.length >= 11) {
                this.errorMsg = "";
                this.isVerifyPhone = true;
            } else {
                this.errorMsg = "手机格式不符合要求";
                this.isVerifyPhone = false;
            }
        }
    },
    methods: {
        ...mapActions(['actionSetUserdata', 'actionVerificationFormData', 'actionVerificationFormData']),
        sendData() {
            if (
                this.addBankCardStep === "one" &&
                this.memInfo.config.player_user_bank_mobile
            ) {
                this.NextStepStatus = false;
                this.$emit("update:addBankCardStep", "two");
                return;
            }

            if (this.lockStatus) {
                return;
            }

            this.lockStatus = true;

            const params = {
                ...this.formData,
                phone: `86-${this.formData.phone}`
            };

            ajax({
                method: "post",
                url: "/api/v1/c/player/user_bank",
                errorAlert: false,
                params,
                success: () => {
                    this.msg = "绑定成功";
                    this.lockStatus = false;
                    if (!this.memInfo.user.name) {
                        this.actionSetUserdata(true);
                    }
                },
                fail: error => {
                    this.lockStatus = false;
                    this.errorMsg = error.data.msg;

                    if (this.addBankCardStep === "one") {
                        this.msg = error.data.msg;
                    }
                }
            });
        },
        setBank(bank) {
            this.isShowPop = false;
            this.formData.bank_id = bank.id;
            this.currentBank = bank.name;
            this.checkData();
        },
        checkData(value, key) {
            // if (key === "account_name") {
            //     const re = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF.．·]/g;
            //     this.formData.account_name = value.replace(re, "");
            // }

            if (key === "branch") {
                const re = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF]/g;
                this.formData.branch = value.replace(re, "");
            }

            if (key === "account") {
                this.actionVerificationFormData({ target: 'bankCard', value: value }).then((val => {
                    this.formData.account = val;
                }));
            }

            this.NextStepStatus = Object.keys(this.formData).every(key => {
                if (this.addBankCardStep === "one") {
                    if (key === "account") {
                        return this.formData[key].length > 15;
                    }

                    if (this.siteConfig.MOBILE_WEB_TPL === 'ey1') {
                        if ((this.memInfo.config.player_user_bank && key === 'city') &&
                            (this.memInfo.config.player_user_bank && key === 'province')) {
                            return this.formData[key];
                        }
                    }

                    if (key !== "phone" && key !== "keyring") {
                        return this.formData[key];
                    }

                    return true;
                }

                if (this.addBankCardStep === "two") {
                    if (key === "phone" || key === "keyring") {
                        this.errorMsg = "";
                        return this.formData[key];
                    }
                    return true;
                }

                return true;
            });
        },
        getBankImage(swiftCode) {
            return {
                src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
                error: this.$getCdnPath(
                    "/static/image/_new/default/bank_default_2.png"
                ),
                loading: this.$getCdnPath(
                    "/static/image/_new/default/bank_default_2.png"
                )
            };
        },
        showCaptchaPopup() {
            // 無認證直接呼叫
            if (this.memInfo.config.default_captcha_type === 0) {
                this.getKeyring();
                return;
            }

            // 彈驗證窗並利用Watch captchaData來呼叫 getKeyring()
            this.toggleCaptcha = true;
        },
        getKeyring() {
            if (this.lockStatus || this.smsTimer) {
                return;
            }
            this.lockStatus = true;

            let captchaParams = {};
            captchaParams['captcha_text'] = this.captchaData || "";

            // if (this.memInfo.config.default_captcha_type === 1) {
            //     // captchaParams['aid'] = this.captchaData.aid;
            //     // captchaParams['captcha'] = this.captchaData.captcha;
            //     captchaParams['captcha_text'] = this.captchaData.captcha;
            // } else {
            //     captchaParams['captcha_text'] = this.captchaData || "";
            // }

            axios({
                method: "post",
                url: "/api/v1/c/player/verify/user_bank/sms",
                data: {
                    phone: `86-${this.formData.phone}`,
                    ...captchaParams
                }
            })
                .then(res => {
                    this.lockStatus = false;
                    if (res && res.data && res.data.result === "ok") {
                        this.time = 60;
                        this.errorMsg = this.$text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", 5);

                        this.smsTimer = setInterval(() => {
                            if (this.time <= 0) {
                                clearInterval(this.smsTimer);
                                this.smsTimer = null;
                                return;
                            }
                            this.time -= 1;
                        }, 1000);
                    } else {
                        this.errorMsg = res.data.msg;
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === "429") {
                        this.msg = "操作太频繁，请稍候在试";
                        return;
                    }

                    this.lockStatus = false;
                    this.errorMsg = error.response.data.msg;
                });
        }
    }
}
