import { getCookie, setCookie } from "@/lib/cookie";
import { mapActions, mapGetters } from "vuex";

import { API_MCENTER_USER_CONFIG } from "@/config/api";
import ajax from "@/lib/ajax";
import axios from "axios";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  data() {
    return {
      //       vBankList: [],
      //       currentVBank: "",
      //       isShowPop: false,
      //       formData: {
      //         walletAddress: "",
      //         bank_id: "",
      //         cgpPwd: ""
      //       },
      //       walletAddressTips: "",
      //       errorMsg: "",
      time: 0,
      lockStatus: false,
      isVerifyPhone: false,
      smsTimer: null,
      NextStepStatus: false
      //       msg: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      domainConfig: "getDomainConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    checkWalletPhoneVerification() {
      // player_user_virtual_bank_phone (會員綁定電子錢包前需手機驗證，0否，1每次，2首次)
      // phone.corfirm (已認證，0未認證/1已認證/2人工驗證)

      let result = null;
      let walletVerifyNum = this.memInfo.config.player_user_virtual_bank_phone;
      let isPhoneVerify =
        this.memInfo.phone.phone && this.memInfo.phone.confirm !== 0;

      if (walletVerifyNum === 0 || (walletVerifyNum === 2 && isPhoneVerify)) {
        result = false;
      }

      if (walletVerifyNum === 1 || (walletVerifyNum === 2 && !isPhoneVerify)) {
        result = true;
      }

      return result;
    }
  },
  //   created() {
  //     ajax({
  //       method: "get",
  //       url: "/api/payment/v1/c/withdraw/bank/list",
  //       errorAlert: false
  //     }).then(response => {
  //       if (!response || response.result !== "ok") {
  //         return;
  //       }

  //       this.vBankList = response.ret;
  //     });
  //   },
  methods: {
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
                msg: this.$text("S_SEND_CHECK_CODE_VALID_TIME_5")
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
    },
    checkData(value, key) {
      if (key === "keyring") {
        this.actionVerificationFormData({ target: "code", value: value }).then(
          val => {
            this.formData.keyring = val;
          }
        );
      }

      this.NextStepStatus = Object.keys(this.formData).every(key => {
        if (this.addBankCardStep === "two") {
          if (key === "phone" || key === "keyring") {
            this.errorMsg = "";
            return this.formData[key];
          }
          return true;
        }

        return true;
      });
    }

    //     ...mapActions(["actionSetUserdata"]),
    //     sendData() {
    //       if (this.lockStatus) {
    //         return;
    //       }

    //       this.lockStatus = true;

    //       const params = {
    //         ...this.formData
    //       };

    //       ajax({
    //         method: "post",
    //         url: "/api/v1/c/player/user_bank",
    //         errorAlert: false,
    //         params,
    //         success: () => {
    //           this.msg = "绑定成功";
    //           this.lockStatus = false;
    //           if (!this.memInfo.user.name) {
    //             this.actionSetUserdata(true);
    //           }
    //         },
    //         fail: error => {
    //           this.lockStatus = false;
    //           this.errorMsg = error.data.msg;
    //         }
    //       });
    //     },
    //     clearMsg() {
    //       const { query } = this.$route;
    //       if (!this.msg.includes("绑定成功")) {
    //         this.msg = "";
    //         return;
    //       }

    //       // 綁定成功後添加成功後回到遊戲 影片
    //       this.msg = "";
    //       let redirect = query.redirect;
    //       if (!redirect) {
    //         this.changePage("virtualBankCardInfo");
    //         return;
    //       }

    //       let split = redirect.split("-");
    //       if (split.length === 2) {
    //         this.$router.push(`/mobile/${split[0]}/${split[1]}`);
    //         return;
    //       }

    //       // 有分類的遊戲大廳 card casino
    //       if (split.length === 3) {
    //         this.$router.push(`/mobile/${split[0]}/${split[1]}?label=${split[2]}`);
    //         return;
    //       }

    //       switch (redirect) {
    //         case "deposit":
    //           this.$router.push(`/mobile/mcenter/deposit`);
    //           return;
    //         case "wallet":
    //           this.$router.push(`/mobile/mcenter/wallet`);
    //           return;
    //         case "withdraw":
    //         case "balanceTrans":
    //           this.$router.push(`/mobile/mcenter/${redirect}`);
    //           return;
    //         case "liveStream":
    //         case "home":
    //           this.$router.push(`/mobile/${redirect}`);
    //           return;
    //         default:
    //           this.changePage("virtualBankCardInfo");
    //           return;
    //       }
    //     },
    //     setBank(bank) {
    //       this.isShowPop = false;
    //       this.formData.bank_id = bank.id;
    //       this.currentVBank = bank.name;
    //     },
    //     verifyNumber(e) {
    //       const regex = /^[0-9]+$/;
    //       if (!regex.test(e.key)) {
    //         e.preventDefault();
    //       }
    //     },
    //     getBankImage(swiftCode) {
    //       return {
    //         src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
    //         error: this.$getCdnPath(
    //           "/static/common/porn1/default/bank_card_default.png"
    //         ),
    //         loading: this.$getCdnPath(
    //           "/static/common/porn1/default/bank_card_default.png"
    //         )
    //       };
  }
};
