<template>
  <div
    :style="{
      background: '#fefffe',
      'min-height': 'calc(100vh - 43px)'
    }"
  >
    <!-- 錯誤訊息 -->
    <div :class="$style['err-msg']">
      <div v-show="errorMsg">
        {{ errorMsg }}
      </div>
    </div>
    <div :class="$style['reset-content']">
      <form id="resetPwdForm">
        <div
          v-for="item in filterField()"
          :key="item"
          :class="$style['field-wrap']"
          :style="!pwdResetInfo[item].display ? { border: 'none' } : {}"
        >
          <div
            v-if="pwdResetInfo[item].display"
            :class="[$style.column, 'clearfix']"
          >
            <div :class="$style['title']">
              {{ $text(pwdResetInfo[item].text) }}
            </div>
            <template v-if="pwdResetInfo[item].key === 'username'">
              <input
                :id="item"
                v-model="pwdResetInfo[item].value"
                @input="verification(item, $event.target.value)"
                type="text"
                :placeholder="$text(pwdResetInfo[item].placeholder)"
                :maxlength="pwdResetInfo[item].maxlength"
                :minlength="pwdResetInfo[item].minlength"
              />
              <div :class="$style['field-tip']" v-html="allTip['username']" />
            </template>

            <template
              v-else-if="
                ['new_password', 'password', 'confirm_password'].includes(
                  pwdResetInfo[item].key
                )
              "
            >
              <input
                :id="item"
                v-model="pwdResetInfo[item].value"
                type="password"
                :placeholder="$text(pwdResetInfo[item].placeholder)"
                maxlength="12"
                @input="verification(item, $event.target.value)"
              />
              <div :class="$style['eye']">
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/common/login/btn_eye_${
                        isShowPwd ? 'n' : 'd'
                      }.png`
                    )
                  "
                  @click="toggleEye(item)"
                />
              </div>
              <div
                :class="$style['field-tip']"
                v-html="allTip[pwdResetInfo[item].key]"
              />
            </template>

            <template v-else>
              <input
                :id="item"
                v-model="pwdResetInfo[item].value"
                @input="verification(item, $event.target.value)"
                type="text"
                :placeholder="$text(pwdResetInfo[item].placeholder)"
                :maxlength="pwdResetInfo[item].maxlength"
                :minlength="pwdResetInfo[item].minlength"
              />
              <div
                v-if="pwdResetInfo[item].type === 'password'"
                :class="$style['eye']"
              >
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/common/login/btn_eye_${
                        isShowPwd ? 'n' : 'd'
                      }.png`
                    )
                  "
                  @click="toggleEye(item)"
                />
              </div>
              <div
                :class="$style['field-tip']"
                v-html="allTip[pwdResetInfo[item].key]"
              />
            </template>
          </div>
        </div>
        <div v-if="isResetPW" :class="$style.prompt">
          请避免使用与其他网站相同或易于被他人猜测到的密码
        </div>
        <div
          :class="[
            $style['submit'],
            $style[siteConfig.ROUTER_TPL],
            { [$style['active']]: submitActive }
          ]"
          @click="checkField(true)"
        >
          {{ $text("S_SUBMIT", "提交") }}
        </div>
      </form>
    </div>
    <page-loading :is-show="isLoading" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mcenter from "@/api/mcenter";
import agcenter from "@/api/agcenter";
import member from "@/api/member";
import agent from "@/api/agent";
import joinMemInfo from "@/config/joinMemInfo";

export default {
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      )
  },
  data() {
    return {
      errorMsg: "",
      msg: "",
      allTip: {
        username: "",
        email: "",
        pwd: "",
        new_password: "",
        confirm_password: ""
      },
      pwdResetInfo: {
        username: {
          key: "username",
          text: "S_USER_NAME",
          type: "text",
          value: "",
          placeholder: "S_PLEASE_ENTER_USER_NAME",
          eyeShow: false,
          display: false
        },
        email: {
          key: "email",
          text: "S_E_MAIL",
          type: "text",
          value: "",
          placeholder: "S_PLS_ENTER_MAIL",
          maxlength: 100,
          minlength: 12,
          eyeShow: false,
          display: false
        },
        password: {
          key: "password",
          text: "S_ORIGIN_PASSWORD",
          type: "password",
          value: "",
          placeholder: "S_PLEASE_ENTER_ORIGIN_PASSWORD",
          eyeShow: false,
          display: false
        },
        new_password: {
          key: "new_password",
          text: "S_NEW_PWD",
          type: "password",
          value: "",
          placeholder: "S_NEW_PASSWORD_PLACEHOLDER",
          eyeShow: false,
          display: false
        },
        confirm_password: {
          key: "confirm_password",
          text: "S_CHK_PWD",
          type: "password",
          value: "",
          placeholder: "S_PLEASE_ENTER_PASSWORD_AGAIN",
          eyeShow: false,
          display: false
        }
      },
      isShowPwd: false,
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      webInfo: "getWebInfo",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    headerConfig() {
      return {
        prev: this.isResetPW ? false : !this.memInfo.user.password_reset,
        onClick: () => {
          this.$router.back();
        },
        title:
          this.isResetPW || this.memInfo.user.password_reset
            ? this.$text("S_PASSWORD_RESET", "重设密码")
            : this.$text("S_CHANGE_PASSWD", "修改密码")
      };
    },
    isResetPW() {
      // 信箱重設密碼
      return this.$route.query.page === "pwdreset";
    },
    submitActive() {
      return Object.keys(this.pwdResetInfo).every(
        key =>
          !this.pwdResetInfo[key].display ||
          (this.pwdResetInfo[key].display &&
            this.pwdResetInfo[key].value &&
            !this.errorMsg)
      );
    },
    hasFooter() {
      return this.isResetPW ? false : !this.memInfo.user.password_reset;
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionVerificationFormData"]),
    toggleEye(key) {
      let new_password = document.getElementById("new_password"),
        confirm_password = document.getElementById("confirm_password"),
        password = document.getElementById("password");

      if (this.isShowPwd) {
        if (new_password) {
          new_password.type = "password";
        }
        if (confirm_password) {
          confirm_password.type = "password";
        }
        if (password) {
          password.type = "password";
        }
      } else {
        if (new_password) {
          new_password.type = "text";
        }
        if (confirm_password) {
          confirm_password.type = "text";
        }
        if (password) {
          password.type = "text";
        }
      }
      this.isShowPwd = !this.isShowPwd;
    },
    verification(key, value) {
      let target = key;
      const regex = new RegExp(joinMemInfo[target].regExp);
      const errorMsg = joinMemInfo[target].errorMsg;

      if (["password"].includes(key)) {
        target = "login_password";
      }

      return this.actionVerificationFormData({
        target: target,
        value: value
      }).then(val => {
        this.pwdResetInfo[key].value = val;
        switch (target) {
          // case password 原密碼
          case "login_password":
            this.errorMsg = "";
            if (this.pwdResetInfo["password"].value.length < 6) {
              this.errorMsg = "请输入6-12位字母及数字";
            }
            break;

          case "new_password":
            this.errorMsg = "";
            if (
              this.pwdResetInfo["new_password"].value !==
              this.pwdResetInfo["confirm_password"].value
            ) {
              this.errorMsg = this.$text("S_NEW_PASSWD_NEW_CONFIRM_ERROR");
            }

            if (!val.match(regex)) {
              this.errorMsg = errorMsg;
            }
            break;

          case "confirm_password":
            this.errorMsg = "";

            if (
              this.pwdResetInfo["new_password"].value !==
              this.pwdResetInfo["confirm_password"].value
            ) {
              this.errorMsg = this.$text("S_NEW_PASSWD_NEW_CONFIRM_ERROR");
            }

            if (!val.match(regex)) {
              this.errorMsg = errorMsg;
            }
            break;

          default:
            this.errorMsg = "";
            if (!val.match(regex)) {
              this.errorMsg = errorMsg;
            }
            break;
        }

        this.checkField();
      });
    },
    checkField(submit) {
      if (!this.submitActive) return;

      // Object.keys(this.pwdResetInfo).forEach(key => {
      //   if (this.pwdResetInfo[key].display) {
      //     let value = this.pwdResetInfo[key].value;
      //     this.verification(key, value);
      //   }
      // });

      if (
        this.pwdResetInfo["new_password"].value &&
        this.pwdResetInfo["confirm_password"].value &&
        this.pwdResetInfo["new_password"].value !==
          this.pwdResetInfo["confirm_password"].value
      ) {
        this.errorMsg = this.$text("S_NEW_PASSWD_NEW_CONFIRM_ERROR");
        return;
      }

      const regex = new RegExp(joinMemInfo["password"].regExp);

      if (
        this.pwdResetInfo["password"].display &&
        this.pwdResetInfo["password"].value.length < 6
      ) {
        this.errorMsg = "请输入6-12位字母及数字";
        return;
      }

      if (!this.pwdResetInfo["new_password"].value.match(regex)) {
        this.errorMsg = joinMemInfo["new_password"].errorMsg;
        return;
      }

      if (!this.pwdResetInfo["confirm_password"].value.match(regex)) {
        this.errorMsg = joinMemInfo["confirm_password"].errorMsg;
        return;
      }

      if (submit && !this.errorMsg) {
        this.isResetPW ? this.pwdResetSubmit() : this.pwdModifySubmit();
      }
    },
    // 修改密碼
    pwdModifySubmit() {
      if (!this.submitActive || this.isLoading) return;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1200);

      const pwdInfo = {
        old_password: this.pwdResetInfo.password.value,
        new_password: this.pwdResetInfo.new_password.value,
        confirm_password: this.pwdResetInfo.confirm_password.value
      };
      if (this.$route.query.type === "agent") {
        agcenter.accountPassword({
          params: pwdInfo,
          success: () => {
            this.isLoading = true;
            this.actionSetGlobalMessage({
              msg: this.$t("S_EDIT_SUCCESS"),
              cb: () => {
                this.$router.back();
              }
            });
          },
          fail: res => {
            this.errorMsg = `${res.data.msg}`;
          }
        });
      } else {
        mcenter.accountPassword({
          params: pwdInfo,
          success: () => {
            this.isLoading = true;
            this.actionSetGlobalMessage({
              msg: this.$t("S_EDIT_SUCCESS"),
              cb: () => {
                // 強制修改密碼
                if (this.memInfo.user.password_reset) {
                  this.actionSetUserdata(true).then(() => {
                    this.$router.replace("/mobile");
                  });
                  return;
                }
                this.$router.back();
              }
            });
          },
          fail: res => {
            this.errorMsg = `${res.data.msg}`;
          }
        });
      }
    },
    // 重設密碼
    pwdResetSubmit() {
      if (!this.submitActive || this.isLoading) return;
      const pwdInfo = {
        username: this.pwdResetInfo.username.value,
        email: this.pwdResetInfo.email.value,
        new_password: this.pwdResetInfo.new_password.value,
        confirm_password: this.pwdResetInfo.confirm_password.value,
        keyring: this.$route.query.kr
      };
      if (this.$route.query.type === "agent") {
        agent.pwdReset({
          params: pwdInfo,
          success: () => {
            this.isLoading = true;
            this.actionSetGlobalMessage({
              msg: this.$t("S_EDIT_SUCCESS"),
              cb: () => {
                this.$router.push("/mobile/login");
              }
            });
          },
          fail: res => {
            this.errorMsg = `${res.data.msg}`;
          }
        });
      } else {
        member.pwdReset({
          params: pwdInfo,
          success: () => {
            this.isLoading = true;
            this.actionSetGlobalMessage({
              msg: this.$t("S_EDIT_SUCCESS"),
              cb: () => {
                if (this.isResetPW) {
                  window.close();
                } else {
                  this.$router.back();
                }
              }
            });
          },
          fail: res => {
            this.errorMsg = `${res.data.msg}`;
          }
        });
      }
    },
    ...mapActions(["actionChangePage", "actionSetUserdata"]),
    filterField() {
      let displayColumn = ["new_password", "confirm_password"];
      if (this.isResetPW) {
        displayColumn = ["username", "email", ...displayColumn];
      } else {
        displayColumn = ["password", ...displayColumn];
      }
      Object.keys(this.pwdResetInfo).forEach(key => {
        this.pwdResetInfo[key].display = displayColumn.includes(key);
      });

      return Object.keys(this.pwdResetInfo);
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.reset-container {
  min-height: 100%;
  background-color: $main_background_white1;
}

.reset-content {
  margin-top: 10px;
  padding: 0 17px;
}

input {
  width: 100%;
  background: none;
  border: none;
  outline: none;
  border-radius: 0;
  color: $main_text_color3;

  &::placeholder {
    color: #cbced8;
  }
}

.field-wrap {
  font-size: 14px;
  width: 100%;
  position: relative;

  .title {
    color: $main_text_color3;
    margin: 17px 0 6px;
  }

  input {
    font-size: 14px;
    height: 26px;

    &::placeholder {
      color: #cbced8;
    }
  }

  border-bottom: solid 1px $main_background_white1;
}

.submit {
  height: 45px;
  text-align: center;
  line-height: 45px;
  max-width: 375px;
  width: 100%;
  font-size: 14px;
  margin: 0 auto;
  margin-top: 21px;
  background: -webkit-linear-gradient(right, #e9dacb, #eee5db);
  background: -o-linear-gradient(left, #e9dacb, #eee5db);
  background: -moz-linear-gradient(left, #e9dacb, #eee5db);
  background: linear-gradient(to left, #e9dacb, #eee5db);
  color: #f3ede7;

  &.active {
    background: -webkit-linear-gradient(right, #bd9d7d, #f9ddbd);
    background: -o-linear-gradient(left, #bd9d7d, #f9ddbd);
    background: -moz-linear-gradient(left, #bd9d7d, #f9ddbd);
    background: $share_main_button_color2;
    color: white;
  }

  &.porn1 {
    background: $befa_member_main_color2;
    color: $befa_member_text_color1;

    &.active {
      background: $befa_member_main_color1;
      color: $befa_member_text_color1;
    }
  }

  &.sg1 {
    background: -webkit-linear-gradient(right, #fed3cb, #ffc5ce);
    background: -o-linear-gradient(left, #fed3cb, #ffc5ce);
    background: -moz-linear-gradient(left, #fed3cb, #ffc5ce);
    background: linear-gradient(to left, #fed3cb, #ffc5ce);
    color: #f3ede7;

    &.active {
      background: -webkit-linear-gradient(right, #fe593c, #e61938);
      background: -o-linear-gradient(left, #fe593c, #e61938);
      background: -moz-linear-gradient(left, #fe593c, #e61938);
      background: linear-gradient(to left, #fe593c, #e61938);
      color: white;
    }
  }

  &.ey1 {
    background: #fdcccc;
    color: #f3ede7;

    &.active {
      background: #e42a30;
      color: white;
    }
  }
}

.err-msg {
  background: $main_white_color1;
  padding: 0 14px;
  color: $main_error_color1;
  height: 33px;
  line-height: 40px;
}

.eye {
  display: flex;
  align-items: center;
  height: 25px;
  width: 18px;
  position: absolute;
  right: 16px;
  top: 42px;

  > img {
    width: 18px;
    height: 18px;
  }
}

.column {
  padding-bottom: 17px;
}

.prompt {
  padding-top: 15px;
  color: #a6a9b2;
  font-size: 12px;
}

// 尚未實作個欄位錯誤訊息
.field-tip {
  display: none;
  width: 100%;
  padding: 5px 25px 5px 0;
  text-align: right;
  color: #c24141;
}
</style>
