<template>
  <div slot="content" :class="$style['content-wrap']">
    <account-header :header-config="headerConfig" />
    <div :class="[$style.wrap, 'clearfix']">
      <!-- 錯誤訊息 -->
      <div :class="$style['top-tips']">
        <div v-show="tipMsg">
          {{ tipMsg }}
        </div>
      </div>

      <template v-if="oldEmail.isShow">
        <div :class="$style.block">
          <div :class="$style.title">{{ oldEmail.label }}</div>
          <div :class="$style['input-wrap']">
            <input
              v-model="oldValue"
              :placeholder="oldEmail.label"
              :class="$style.input"
              type="text"
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

      <template v-if="newEmail.isShow">
        <div :class="$style.block">
          <div :class="$style.title">
            {{ newEmail.label }}
          </div>
          <div :class="$style['input-wrap']">
            <input
              v-model="newValue"
              :placeholder="$text('S_PLS_ENTER_NEW_EMAIL', '请输入邮箱帐号')"
              :class="$style.input"
              type="text"
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

      <template v-if="checkCode.isShow">
        <div :class="$style.block">
          <div :class="$style.title">
            {{ $text("S_MAIL_CHECK_CODE", "邮箱验证码") }}
          </div>
          <div :class="$style['input-wrap']">
            <input
              v-model="codeValue"
              :placeholder="$text('S_PLS_ENTER_MAIL_CODE', '请输入邮箱验证码')"
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
                { [$style.active]: newValue && !timer }
              ]"
              @click="handleSend()"
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
    <service-tips />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { API_MCENTER_USER_CONFIG } from "@/config/api";
import ajax from "@/lib/ajax";
import member from "@/api/member";
import mcenter from "@/api/mcenter";
import serviceTips from "../../serviceTips";
import accountHeader from "../../accountHeader";
import axios from "axios";

export default {
  components: {
    accountHeader,
    serviceTips
  },
  data() {
    return {
      oldValue: "",
      newValue: "",
      codeValue: "",
      tipMsg: "",
      timer: "",
      countdownSec: 0,
      ttl: 60,
      isSendSMS: false,
      info: {
        key: "email",
        text: "SS_E_MAIL",
        status: "",
        value: "",
        verification: false,
        isShow: true
      },
      edit: false,
      hasVerified: false
    };
  },
  created() {
    // 取得欄位資訊
    ajax({
      method: "get",
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then(response => {
      if (response && response.result === "ok") {
        this.info.verification = response.ret.config[this.info.key].code;
        this.info.isShow = response.ret.config[this.info.key].display;
        this.edit = response.ret.config.email.editable;
        this.hasVerified = response.ret.user.email; //是否已驗證
        
      }
    });
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
    fieldValue() {
      return this.memInfo.email.email;
    },
    oldEmail() {
      return {
        label: this.$text("S_ORIGINAL_EMAIL"),
        // 目前億元/鴨博皆接開關判斷可不可修改信箱
        isShow:
          (this.fieldValue && this.info.status === "already") ||
          (this.hasVerified ? this.edit : this.hasVerified)
      };
    },
    newEmail() {

      const emailLabel=(this.fieldValue && this.info.status === "already") ||
          (this.hasVerified ? this.edit : this.hasVerified)
      return {
        label:
          emailLabel
            ? this.$text("S_NEW_EMAIL")
            : this.$text("SS_E_MAIL"),
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
        label: this.countdownSec
          ? this.$text("S_SEND_CHECK_CODE_ALREADY")
          : this.$text("S_GET_VERIFICATION_CODE"),
        isShow: this.info.verification,
        countdownSec: this.countdownSec
      };
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_E_MAIL", "电子邮箱"),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text("S_COMPLETE", "完成"),
        funcBtnActive:
          !!this.newValue && (this.info.verification ? !!this.codeValue : true)
      };
    }
  },
  beforeDestroy() {
    this.countdownSec = "";
    clearInterval(this.timer);
    this.timer = null;
  },
  mounted() {
    this.countdownSec = "";
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionVerificationFormData",
      "actionSetGlobalMessage"
    ]),
    locker() {
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
      }, 1000);
    },
    verification(value, target) {
      this.actionVerificationFormData({ target: target, value: value }).then(
        val => {
          if (target === "code") {
            this.codeValue = val;
          }
          // 尚未實作
          // if (target === 'newValue') {
          //   this.newValue = val;
          // }

          // if (target === 'oldValue') {
          //   this.oldValue = val;
          // }
        }
      );
    },
    handleSend(send) {
      if (!this.newValue || this.timer || this.isSendSMS) return;

      this.isSendSMS = true;
      const getOldEmail = () => {
        if (this.fieldValue) {
          return this.info.status === "ok" ? this.newValue : this.oldValue;
        }
        return "";
      };

      mcenter.accountMailSend({
        params: {
          old_email: getOldEmail(),
          email: this.newValue
        },
        success: () => {
          member.joinConfig({
            success: response => {
              if (response.ret.email.code) {
                mcenter.accountMailSec({
                  success: data => {
                    if (data.ret > 0) {
                      this.ttl = data.ret;
                    }
                    this.actionSetUserdata(true);
                    this.locker();
                    this.isSendSMS = false;
                    this.tipMsg = `${this.$text(
                      "S_SEND_CHECK_CODE_VALID_TIME"
                    ).replace("%s", "5")}${this.$text("S_FIND_TRASH")}`;
                  },
                  fail: res => {
                    this.isSendSMS = false;
                    if (res && res.data && res.data.msg) {
                      this.tipMsg = `${res.data.msg}`;
                    }
                  }
                });
              }
            }
          });
        },
        fail: res => {
          this.isSendSMS = false;
          if (res && res.data && res.data.msg) {
            this.tipMsg = `${res.data.msg}`;
          }
        }
      });
    },
    handleSubmit() {
      // 驗證信箱
      if (this.info.verification) {
        return mcenter.accountMailCheck({
          params: {
            email: this.newValue,
            keyring: this.codeValue
          },
          success: () => {
            localStorage.setItem("set-account-success", true);
            this.$router.push("/mobile/mcenter/accountData");
            this.$emit("success");
          },
          fail: res => {
            if (res && res.data && res.data.msg) {
              this.tipMsg = `${res.data.msg}`;
            }
          }
        });
      }

      // 不驗證直接設定信箱
      return mcenter.accountMailEdit({
        params: {
          email: this.newValue,
          old_email:this.oldValue?this.oldValue:this.newValue
        },
        success: () => {
          localStorage.setItem("set-account-success", true);
          this.$router.push("/mobile/mcenter/accountData");
          this.$emit("success");
        },
        fail: res => {
          if (res && res.data && res.data.msg) {
            this.tipMsg = `${res.data.msg}`;
          }
        }
      });
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
