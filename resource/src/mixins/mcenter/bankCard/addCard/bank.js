import { getCookie, setCookie } from "@/lib/cookie";
import { mapActions, mapGetters } from "vuex";

import { API_MCENTER_USER_CONFIG } from "@/config/api";
import ajax from "@/lib/ajax";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  data() {
    return {
      // 國碼
      phoneHead: "+86",
      phoneHeadOption: [],
      bankList: [],
      currentBank: "",
      isShowPopBankList: false,
      isVerifyPhone: false,
      formData: {
        accountName: "",
        bankId: "",
        province: "",
        city: "",
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
      thirdyCaptchaObj: null,
      isShowCaptcha: false,
      isClickedCaptcha: false,
      chooseName: [
        {
          key: 0,
          title: "本人",
          name: "",
          placehoder: "",
          disabled: true
        },
        {
          key: 1,
          title: "非本人",
          name: "",
          placeholder: "请输入持卡人姓名",
          disabled: false
        }
      ],
      chooseNameResult: {}
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      domainConfig: "getDomainConfig",
      notMyBank: "getNotMyBank"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
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
    },
    checkPhoneVerification() {
      // player_user_bank_phone (會員綁定銀行卡前需手機驗證，0否，1每次，2首次)
      // phone.corfirm (已認證，0未認證/1已認證/2人工驗證)
      let result = null;
      let verifyNum = this.memInfo.config.player_user_bank_phone;
      let isPhoneVerify =
        this.memInfo.phone.phone && this.memInfo.phone.confirm !== 0;

      if (verifyNum === 0 || (verifyNum === 2 && isPhoneVerify)) {
        result = false;
      }

      if (verifyNum === 1 || (verifyNum === 2 && !isPhoneVerify)) {
        result = true;
      }

      return result;
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
    thirdyCaptchaObj() {
      this.getKeyring();
    },
    "formData.phone"() {
      if (this.formData.phone.length < 11 && this.addBankCardStep === "two") {
        this.errorMsg = "手机格式不符合要求";
        this.isVerifyPhone = false;
      } else {
        this.errorMsg = "";
        this.isVerifyPhone = true;
      }
    },
    // 預防從提現資料進到綁定銀行卡，會有無法立即更新 name 的問題
    "memInfo.user.name"() {
      delete this.formData["accountName"];
    }
  },
  created() {
    // 已經有真實姓名時不送該欄位
    if (this.memInfo.user.name) {
      delete this.formData["accountName"];
    }

    if (["porn1", "sg1"].includes(this.themeTPL)) {
      delete this.formData["city"];
      delete this.formData["province"];
    }

    // 推播返回 補齊資料
    if (
      localStorage.getItem("click-notification") &&
      localStorage.getItem("add-bank-form")
    ) {
      const data = JSON.parse(localStorage.getItem("add-bank-form"));
      console.log(data);

      this.NextStepStatus = false;
      this.$emit("update:addBankCardStep", "two");
      this.$nextTick(() => {
        this.formData = { ...data };
        localStorage.removeItem("add-bank-form");
        localStorage.removeItem("click-notification");
      });
    }

    // 國碼
    ajax({
      method: "get",
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then(response => {
      if (response && response.result === "ok") {
        this.phoneHeadOption = response.ret.config.phone.country_codes;
      }
    });

    if (this.notMyBank.switch) {
      this.chooseName[0].name = this.username + "**";
      this.chooseNameResult = this.chooseName[0];
      delete this.formData["accountName"];
      delete this.formData["otherUserBank"];
    }
  },
  beforeDestroy() {
    if (localStorage.getItem("click-notification")) {
      localStorage.setItem("add-bank-form", JSON.stringify(this.formData));
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionVerificationFormData",
      "actionSetGlobalMessage",
      "actionGetToManyRequestMsg",
      "actionSetDomainConfigV2"
    ]),
    setCaptcha(obj) {
      this.thirdyCaptchaObj = obj;
    },
    showCaptcha() {
      this.isShowCaptcha = !this.isShowCaptcha;
    },
    sendData() {
      if (this.addBankCardStep === "one" && this.checkPhoneVerification) {
        this.NextStepStatus = false;
        this.$emit("update:addBankCardStep", "two");
        return;
      }

      if (this.lockStatus) {
        return;
      }

      this.lockStatus = true;

      // 已經有真實姓名且是本人銀行卡時不送該欄位
      if (this.memInfo.user.name && !this.formData.otherUserBank) {
        delete this.formData["accountName"];
      }

      const params = {
        ...this.formData,
        lang: "zh-cn",
        phone: `${this.phoneHead.replace("+", "")}-${this.formData.phone}`
      };

      //新增會員出款帳號資料(有驗證功能)C02.223
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/Bank`,
        headers: {
          kind: "pwa"
        },
        params
      })
        .then(response => {
          const { status, errorCode, msg } = response;

          if (errorCode !== "00" || status !== "000") {
            this.lockStatus = false;
            this.errorMsg = msg;

            // if (this.addBankCardStep === "one") {
            //   this.msg = msg;
            // }
            return;
          }

          this.msg = "绑定成功";
          this.lockStatus = false;
          this.addBankCardStep === "one";

          if (!this.memInfo.user.name) {
            this.actionSetUserdata(true);
          }
        })
        .catch(error => {
          const { msg } = error.response.data;

          this.lockStatus = false;
          this.errorMsg = msg;

          // if (this.addBankCardStep === "one") {
          //   this.msg = msg;
          // }
        });

      // ajax({
      //   method: "post",
      //   url: "/api/v1/c/player/user_bank",
      //   errorAlert: false,
      //   params,
      //   success: () => {
      //     this.msg = "绑定成功";
      //     this.lockStatus = false;
      //     this.addBankCardStep === "one";

      //     if (!this.memInfo.user.name) {
      //       this.actionSetUserdata(true);
      //     }
      //   },
      //   fail: error => {
      //     this.lockStatus = false;
      //     this.errorMsg = error.data.msg;

      //     if (this.addBankCardStep === "one") {
      //       this.msg = error.data.msg;
      //     }
      //   }
      // });
    },
    setBank(bank) {
      this.isShowPopBankList = false;
      this.formData.bankId = bank.id;
      this.currentBank = bank.name;
      this.checkData();
    },
    checkData(value, key) {
      if (key === "accountName" && !this.memInfo.user.name) {
        this.actionVerificationFormData({ target: "name", value: value }).then(
          val => {
            this.formData.accountName = val;
          }
        );
      }

      if (key === "notMyBankName") {
        const regex = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF.．·]/g;
        value = value.replace(regex, "").substring(0, 20);

        //accountName開戶姓名 (非本人銀行卡時必填)
        this.formData.accountName = this.chooseNameResult.name = value;

        //otherUserBank是否為非本人銀行卡
        this.formData.otherUserBank = this.formData.accountName ? true : false;
      }

      if (key === "province" || key === "city") {
        this.actionVerificationFormData({ target: "name", value: value }).then(
          val => {
            this.formData[key] = val;
          }
        );
      }

      if (key === "branch") {
        const re = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF]/g;
        this.formData.branch = value.replace(re, "");
      }

      if (key === "account") {
        this.actionVerificationFormData({
          target: "bankCard",
          value: value
        }).then(val => {
          this.formData.account = val;
        });
      }

      if (key === "keyring") {
        this.actionVerificationFormData({ target: "code", value: value }).then(
          val => {
            this.formData.keyring = val;
          }
        );
      }

      this.NextStepStatus = Object.keys(this.formData).every(key => {
        if (this.addBankCardStep === "one") {
          if (key === "account") {
            return this.formData[key].length > 15;
          }

          // 需要填入時才檢查
          if (key === "accountName" && this.memInfo.user.name === "") {
            return this.formData["accountName"];
          }

          if (
            key !== "phone" &&
            key !== "keyring" &&
            key !== "city" &&
            key !== "province"
          ) {
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
    getBankImage(image_url) {
      return {
        src: image_url,
        error: this.$getCdnPath(
          "/static/image/common/default/bank_card_default.png"
        ),
        loading: this.$getCdnPath(
          "/static/image/common/default/bank_card_default.png"
        )
      };
    },
    showCaptchaPopup() {
      if (this.isClickedCaptcha || this.smsTimer) {
        return;
      }
      this.isClickedCaptcha = true;
      setTimeout(() => {
        this.isClickedCaptcha = false;
      }, 2000);

      const params = [
        this.actionSetUserdata(true),
        this.actionSetDomainConfigV2()
      ];

      Promise.all(params).then(() => {
        // 無認證直接呼叫
        if (this.memInfo.config.default_captcha_type === 0) {
          this.getKeyring();
          return;
        }

        // 彈驗證窗並利用Watch thirdyCaptchaObj 來呼叫 getKeyring()
        this.showCaptcha();
      });
    },
    getKeyring() {
      if (this.lockStatus || this.smsTimer) {
        return;
      }
      this.lockStatus = true;

      let captchaParams = {};
      captchaParams["captcha_text"] = this.thirdyCaptchaObj || "";

      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Verify/UserBank/Sms`,
        params: {
          lang: "zh-cn",
          phone: `${this.phoneHead.replace("+", "")}-${this.formData.phone}`,
          ...captchaParams,
          aid: getCookie("aid") || localStorage.getItem("aid") || ""
        }
      })
        .then(res => {
          this.lockStatus = false;
          if (res && res.status === "000" && res.data === "operate success") {
            if (this.domainConfig && this.domainConfig.auto_keyring) {
            } else {
              this.actionSetGlobalMessage({
                msg: this.$text("S_SEND_CHECK_CODE_VALID_TIME_10")
              });
            }

            goLangApiRequest({
              method: "get",
              url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Phone/TTL`,
              params: {
                lang: "zh-cn"
              }
            })
              .then(res => {
                if (res && res.status === "000") {
                  this.time = res.data;
                  this.smsTimer = setInterval(() => {
                    if (this.time <= 0) {
                      clearInterval(this.smsTimer);
                      this.smsTimer = null;
                      return;
                    }
                    this.time -= 1;
                  }, 1500);
                } else {
                  if (res && res.status === "506") {
                    this.actionGetToManyRequestMsg(res.msg).then(res => {
                      this.errorMsg = res;
                    });
                  } else if (res.msg) {
                    this.errorMsg = res.msg;
                  }
                }
              })
              .catch(error => {
                if (error.status) {
                  this.errorMsg = `${error.msg}`;
                  return;
                }
              });
          } else {
            if (res && res.status === "506") {
              this.actionGetToManyRequestMsg(res.msg).then(res => {
                this.errorMsg = res;
              });
            } else if (res.msg) {
              this.errorMsg = res.msg;
            }
          }
        })
        .catch(error => {
          this.lockStatus = false;

          if (error.response.data && error.response.data.msg) {
            this.errorMsg = error.response.data.msg;
          } else {
            this.errorMsg = error.response.data;
          }
        });
    }
  }
};
