<template>
  <div slot="content" :class="$style['content-wrap']">
    <account-header :header-config="headerConfig" />
    <!-- 錯誤訊息 -->
    <div :class="$style['top-tips']">
      <div v-show="tipMsg">
        {{ tipMsg }}
      </div>
    </div>
    <div :class="[$style.wrap, 'clearfix']">
      <template v-if="oldPhone.isShow">
        <div :class="$style.block">
          <div :class="$style.title">
            {{ oldPhone.label }}
          </div>
          <div :class="$style['input-wrap']">
            <template v-if="themeTPL === 'ey1'">
              <select v-model="phoneHead" :class="$style['phone-selected']">
                <option
                  v-for="option in phoneHeadOption"
                  :key="option.option"
                  v-bind:value="option"
                >
                  {{ option }}
                </option>
              </select>
            </template>
            <input
              v-model="oldValue"
              :placeholder="oldPhone.label"
              :class="$style.input"
              @input="verification($event.target.value, 'oldValue')"
              type="tel"
            />
            <div :class="$style['clear-input']" v-if="oldValue">
              <img
                :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
                @click="oldValue = ''"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-if="newPhone.isShow">
        <div :class="$style.block">
          <div :class="$style.title">
            {{ newPhone.label }}
          </div>
          <div :class="$style['input-wrap']">
            <template v-if="themeTPL === 'ey1'">
              <select v-model="phoneHead" :class="$style['phone-selected']">
                <option
                  v-for="option in phoneHeadOption"
                  :key="option.option"
                  v-bind:value="option"
                >
                  {{ option }}
                </option>
              </select>
            </template>
            <input
              v-model="newValue"
              :placeholder="
                $text('S_PLEASE_ENTER_MOBILE_NUMBER', '请输入手机号码')
              "
              :class="$style.input"
              @input="verification($event.target.value, 'newValue')"
              type="tel"
            />
            <div :class="$style['clear-input']" v-if="newValue">
              <img
                :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
                @click="newValue = ''"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-if="checkCode.isShow || isfromWithdraw || isfromSWAG">
        <div :class="$style.block">
          <div :class="$style.title">
            手机验证码
          </div>
          <div :class="$style['input-wrap']">
            <input
              v-model="codeValue"
              id="phone-code"
              :placeholder="$text('S_MOBILE_CAPTCHA', '请输入手机验证码')"
              :class="$style.input"
              @input="verification($event.target.value, 'code')"
              type="tel"
            />
            <div :class="$style['clear-input']" v-if="codeValue">
              <img
                :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
                @click="codeValue = ''"
              />
            </div>
            <div
              v-if="sendBtn.isShow"
              :class="[
                $style['btn-send'],
                { [$style.active]: isVerifyPhone && !timer }
              ]"
              @click="showCaptchaPopup"
            >
              <template>
                <span v-if="sendBtn.countdownSec">{{
                  `${countdownSec}s`
                }}</span>
                <span v-else> {{ sendBtn.label }} </span>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>

    <popup-verification
      v-if="isShowCaptcha"
      @show-captcha="showCaptcha"
      @set-captcha="setCaptcha"
      :page-type="'default'"
    />
    <service-tips :type="'phone'"/>
  </div>
</template>
<script>
import { API_MCENTER_USER_CONFIG } from "@/config/api";
import { getCookie, setCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import accountHeader from "../../accountHeader";
import ajax from "@/lib/ajax";
import axios from "axios";
import mcenter from "@/api/mcenter";
import member from "@/api/member";
import popupVerification from "@/components/popupVerification";
import serviceTips from "../../serviceTips";

export default {
  components: {
    serviceTips,
    popupVerification,
    accountHeader
  },
  data() {
    return {
      // 國碼
      phoneHead: "+86",
      phoneHeadOption: [],
      oldValue: "",
      newValue: "",
      codeValue: "",
      tipMsg: "",
      countdownSec: 0,
      options: {},
      isLock: false,
      timer: null,
      ttl: 60,
      isSendSMS: false,
      isVerifyPhone: false,
      hasVerified: false, // 手機號碼是否已經驗證
      info: {
        key: "phone",
        text: "S_TEL",
        status: "",
        value: "",
        verification: false,
        isShow: true
      },
      thirdyCaptchaObj: null,
      isShowCaptcha: false,
      edit: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      webInfo: "getWebInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    isfromSWAG() {
      return this.$route.query.redirect
        ? this.$route.query.redirect.toUpperCase() === "SWAG"
        : false;
    },
    isfromWithdraw() {
      const { query } = this.$route;
      let redirect = query.redirect;
      if (redirect) {
        switch (redirect) {
          case "withdraw":
            return true;
          default:
            return false;
        }
      }
    },
    headerConfig() {
      let _funcBtnActive = true;
      let checkActiveArray = [this.newValue, !this.tipMsg];
      //  提現前驗證不需要舊手機欄位
      if (this.checkCode.isShow || this.isfromWithdraw || this.isfromSWAG) {
        checkActiveArray.push(!!this.codeValue);
      }

      if (
        this.memInfo.phone.phone &&
        this.oldPhone.isShow &&
        !this.isfromWithdraw &&
        !this.isfromSWAG
      ) {
        checkActiveArray.push(!!this.oldValue);
      }

      checkActiveArray.forEach(status => {
        if (!status) _funcBtnActive = false;
      });

      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_TEL", "手机号码"),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text("S_COMPLETE", "完成"),
        funcBtnActive: _funcBtnActive
      };
    },
    countryCodes() {
      return {
        label: this.$text("S_COUNTRY_CODE", "国码"),
        isShow: true,
        options: this.options
      };
    },
    oldPhone() {
      let hasVerified = this.hasVerified ? this.edit : this.hasVerified;
      //let isShow = this.isfromWithdraw ? false : hasVerified;

      const phoneShow=false;
      if(this.memInfo.phone.phone){
        if(!this.isfromWithdraw){
          if(this.edit){
            this.phoneShow=true
          }else if(this.hasVerified){
            this.phoneShow=this.edit
          }
        } 
      }
      
      return {
        label: this.$text("S_ORIGINAL_PHONE"),
        isShow: this.phoneShow
      };
    },
    newPhone() {

      const phoneShow=false;
      if(this.memInfo.phone.phone){
        if(!this.isfromWithdraw){
          if(this.edit){
            this.phoneShow=true
          }else if(this.hasVerified){
            this.phoneShow=this.edit
          }
        } 
      }     

      let hasVerified = this.phoneShow
        ? this.$text("S_NEW_PHONE")
        : this.$text("S_TEL");
      let phoneLabel = this.isfromWithdraw
        ? this.$text("S_TEL", "手机号码")
        : hasVerified;
      return {
        // label: this.memInfo.phone.phone && !this.isfromWithdraw
        //   ? this.$text('S_NEW_PHONE')
        //   : this.$text('S_TEL'),
        // label: this.$text("S_TEL", "手机号码"),
        label: phoneLabel,
        isShow: true
      };
    },
    checkCode() {
      return {
        label: this.$text("S_CHECK_CODE"),
        isShow: this.info.verification
      };
    },
    sendBtn() {
      return {
        label: this.$text("S_GET_VERIFICATION_CODE", "获取验证码"),
        isShow:
          this.info.verification || this.isfromWithdraw || this.isfromSWAG,
        countdownSec: this.countdownSec
      };
    }
  },
  watch: {
    thirdyCaptchaObj() {
      this.handleSend();
    }
  },
  mounted() {
    this.countdownSec = "";
    clearInterval(this.timer);
    this.timer = null;
  },
  created() {
    ajax({
      method: "get",
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then(response => {
      if (response && response.result === "ok") {
        this.info.verification = response.ret.config[this.info.key].code;
        this.hasVerified = response.ret.user.phone; //是否已驗證
        this.phoneHeadOption = response.ret.config.phone.country_codes;
        this.edit = response.ret.config.phone.editable;
      }
    });
  },
  beforeDestroy() {
    this.countdownSec = "";
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetWithdrawCheck",
      "actionVerificationFormData",
      "actionSetGlobalMessage"
    ]),
    setCaptcha(obj) {
      this.thirdyCaptchaObj = obj;
    },
    showCaptcha(toggle) {
      if (toggle !== undefined) {
        this.isShowCaptcha = toggle;
      } else {
        this.isShowCaptcha = !this.isShowCaptcha;
      }
    },
    verification(value, target) {
      this.tipMsg = "";

      if (target === "newValue" || target === "oldValue") {
        this.actionVerificationFormData({ target: "phone", value: value }).then(
          val => {
            if (target === "newValue") {
              this.newValue = val;
            }

            if (target === "oldValue") {
              this.oldValue = val;
            }

            if (value === "") {
              this.isVerifyPhone = false;
            }
          }
        );

        // 億元 不客端判斷手機號碼位數
        if (this.siteConfig.MOBILE_WEB_TPL === "ey1" || value.length >= 11) {
          this.tipMsg = "";
        
          if (this.isfromWithdraw || this.isfromSWAG) {
            this.isVerifyPhone = true;
            return;
          }

          // 廳主端設置手機 未驗證
          // if (!this.hasVerified) {
          //   this.isVerifyPhone = true;
          // }
          // 廳主端設置手機 修改開關
          if (this.edit) {
            this.isVerifyPhone = true;
          }
        } else {
          //   this.tipMsg = '手机格式不符合要求';
          // if (!this.hasVerified)
          if (this.edit) {
            this.isVerifyPhone = true;
          }
        }
      }

      if (target === "code") {
        this.actionVerificationFormData({ target: "code", value: value }).then(
          val => {
            this.codeValue = val;
          }
        );
      }
    },
    locker() {
      if (this.timer) return;
      this.countdownSec = this.ttl;
      this.actionSetGlobalMessage({
        msg: this.$text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", "5")
      });
      this.timer = setInterval(() => {
        if (this.countdownSec === 0) {
          clearInterval(this.timer);
          this.timer = null;
          return;
        }
        this.countdownSec -= 1;
      }, 1500);
    },
    showCaptchaPopup() {
      this.actionSetUserdata(true).then(() => {
        // 無認證直接呼叫
        if (this.memInfo.config.default_captcha_type === 0) {
          this.handleSend();
          return;
        }

        // 彈驗證窗並利用Watch thirdyCaptchaObj 來呼叫 getKeyring()
        this.showCaptcha();
      });
    },
    // 回傳會員手機驗證簡訊剩餘秒數可以重送
    getPhoneTTL() {
      return axios({
        method: "get",
        url: "/api/v1/c/player/phone/ttl"
      })
        .then(res => {
          if (res && res.data && res.data.result === "ok") {
            this.ttl = res.data.ret;
          }
        })
        .catch(error => {
          this.tipMsg = `${error.response.data.msg}`;
        });
    },
    handleSend() {
      if (this.timer || this.isSendSMS) return;

      this.isSendSMS = true;
      let captchaParams = {};
      captchaParams["captcha_text"] = this.thirdyCaptchaObj || "";

      let params = {
        phone: `${this.phoneHead.replace("+", "")}-${this.newValue}`,
        ...captchaParams
      };

      let smsUrl = "";
      if (this.isfromSWAG) {
        smsUrl = "/api/v1/c/player/outer/sms";
        params["vendor"] = "swag";
      } else if (this.isfromWithdraw) {
        smsUrl = "/api/v1/c/player/withdraw/verify/sms";
      } else {
        smsUrl = "/api/v1/c/player/verify/phone";
      }

      if (this.isfromWithdraw || this.isfromSWAG) {
        axios({
          method: "post",
          url: smsUrl,
          data: params
        })
          .then(res => {
            if (res && res.data && res.data.result === "ok") {
              this.getPhoneTTL().then(() => {
                this.locker();
                this.isSendSMS = false;
              });
            } else {
              if (res.data && res.data.msg) {
                this.tipMsg = res.data.msg;
              } else {
                console.log(res.data);
                this.tipMsg = res.data;
              }
            }
            this.isSendSMS = false;
            this.showCaptcha(false);
          })
          .catch(error => {
            this.showCaptcha(false);
            this.countdownSec = "";
            this.isSendSMS = false;
            console.log(error.response);

            if (error.response.data && error.response.data.msg) {
              // SWAG需求特利暫時調整
              if (this.isfromSWAG && error.response.data.code == "C20190") {
                this.tipMsg = "尚未绑定电话，请先至会员资料设定";
                return;
              }
              this.tipMsg = error.response.data.msg;
            } else {
              this.tipMsg = error.response.data;
            }

            if (error.response && error.response.status === 429) {
              this.tipMsg = "操作太频繁，请稍候再试";
              return;
            }
          });
      } else {
        let params = {
          old_phone:
            this.memInfo.phone.phone && !this.hasVerified
              ? `${this.phoneHead.replace("+", "")}-${this.newValue}`
              : this.oldPhone.isShow
              ? `${this.phoneHead.replace("+", "")}-${this.oldValue}`
              : "",
          phone: `${this.phoneHead.replace("+", "")}-${this.newValue}`,
          ...captchaParams
        };

        axios({
          method: "post",
          url: smsUrl,
          // /api/v1/c/player/verify/phone
          data: params
        })
          .then(res => {
            if (res && res.data && res.data.result === "ok") {
              this.getPhoneTTL().then(() => {
                this.locker();
                this.isSendSMS = false;
              });
            } else {
              if (res.data && res.data.msg) {
                this.tipMsg = res.data.msg;
              } else {
                console.log(res.data);
                this.tipMsg = res.data;
              }
            }
            this.isSendSMS = false;
            this.showCaptcha(false);
          })
          .catch(error => {
            this.showCaptcha(false);
            this.countdownSec = "";
            this.isSendSMS = false;

            if (error.response.data && error.response.data.msg) {
              this.tipMsg = error.response.data.msg;
            } else {
              this.tipMsg = error.response.data;
            }

            if (error.response && error.response.status === 429) {
              this.tipMsg = "操作太频繁，请稍候再试";
              return;
            }
          });
      }
    },
    handleSubmit() {
      // 提款,SWAG手機驗證
      let smsUrl = "";
      let params = {
        keyring: this.codeValue
      };

      if (this.isfromSWAG) {
        smsUrl = "/api/v1/c/outer/sms/verify";
        params["phone"] = `${this.phoneHead.replace("+", "")}-${this.newValue}`;
      } else if (this.isfromWithdraw) {
        smsUrl = "/api/v1/c/player/withdraw/sms/verify";
      }

      if (this.isfromWithdraw || this.isfromSWAG) {
        ajax({
          method: "put",
          url: smsUrl,
          errorAlert: false,
          params: params,
          fail: res => {
            this.tipMsg = `${res.data.msg}`;
          },
          success: res => {
            if (res && res.result === "ok") {
              // 完成後回到上一頁
              if (this.isfromSWAG) {
                localStorage.setItem("tmp_d_1", res.ret);
                this.$router.back();
                // this.$router.push('/mobile/mcenter/swag');
              } else if (this.isfromWithdraw) {
                localStorage.setItem("tmp_w_1", res.ret);
                this.$router.push("/mobile/mcenter/withdraw");
              }
            }
          }
        });
      } else {
        // 驗證手機
        if (this.info.verification) {
          return mcenter.accountPhoneCheck({
            params: {
              old_phone: this.memInfo.phone.phone
                ? `${this.phoneHead.replace("+", "")}-${this.oldValue}`
                : "",
              phone: `${this.phoneHead.replace("+", "")}-${this.newValue}`,
              keyring: this.codeValue
            },
            success: res => {
              this.actionSetWithdrawCheck();
              setTimeout(() => {
                localStorage.setItem("set-account-success", true);
                this.$router.push("/mobile/mcenter/accountData?success=true");
              }, 200);
            },
            fail: res => {
              this.tipMsg = `${res.data.msg}`;
            }
          });
        }

        // 不驗證直接設定手機
        return mcenter.accountPhoneEdit({
          params: {
            phone: `${this.phoneHead.replace("+", "")}-${this.newValue}`,
            old_phone: this.oldValue
              ? `${this.phoneHead.replace("+", "")}-${this.oldValue}`
              : `${this.phoneHead.replace("+", "")}-${this.newValue}`
          },
          success: () => {
            setTimeout(() => {
              localStorage.setItem("set-account-success", true);
              this.$router.push("/mobile/mcenter/accountData");
            }, 200);
          },
          fail: res => {
            this.tipMsg = `${res.data.msg}`;
          }
        });
      }
    }
  }
};
</script>

<style
  lang="scss"
  src="../../../css/index.module.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="../../../css/ey1.module.scss"
  module="$style_ey1"
></style>
<style
  lang="scss"
  src="../../../css/sg1.module.scss"
  module="$style_sg1"
></style>
