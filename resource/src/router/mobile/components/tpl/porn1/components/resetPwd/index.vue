<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="hasFooter"
  >
    <div slot="content" :class="$style['content-wrap']">
      <message v-if="msg" @close="msg = ''">
        <div slot="msg">{{ msg }}</div>
      </message>

      <!-- 錯誤訊息 -->
      <div :class="$style['err-msg']">
        <div v-show="errMsg">
          {{ errMsg }}
        </div>
      </div>
      <div :class="$style['reset-content']">
        <form id="resetPwdForm">
          <div
            v-for="item in filterField()"
            :key="item"
            :class="$style['field-wrap']"
          >
            <div
              v-if="pwdResetInfo[item].display"
              :class="[$style.column, 'clearfix']"
            >
              <div :class="$style['title']">
                {{ $text(pwdResetInfo[item].text) }}
              </div>
              <input
                v-if="pwdResetInfo[item].type === 'text'"
                :id="item"
                v-model="pwdResetInfo[item].value"
                @blur="verification(item, pwdResetInfo[item].value)"
                type="text"
                :placeholder="pwdResetInfo[item].placeholder"
                :maxlength="pwdResetInfo[item].maxlength"
                :minlength="pwdResetInfo[item].minlength"
              />
              <input
                v-if="pwdResetInfo[item].type === 'password'"
                :id="item"
                v-model="pwdResetInfo[item].value"
                @blur="verification(item, pwdResetInfo[item].value)"
                type="password"
                :placeholder="pwdResetInfo[item].placeholder"
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
                      `/static/image/_new/login/btn_eye_${
                        pwdResetInfo[item].eyeShow ? 'n' : 'd'
                      }.png`
                    )
                  "
                  @click="toggleEye(item)"
                />
              </div>
            </div>
          </div>
          <div v-if="isResetPW" :class="$style.prompt">
            请避免使用与其他网站相同或易于被他人猜测到的密码
          </div>
          <div
            :class="[$style['submit'], { [$style['active']]: submitActive }]"
            @click="isResetPW ? pwdResetSubmit() : pwdModifySubmit()"
          >
            {{ $text("S_SUBMIT", "提交") }}
          </div>
        </form>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import resetPwd from '@/mixins/resetPwd';
import mobileContainer from '../common/new/mobileContainer';
import message from '../common/new/message';
import mcenter from '@/api/mcenter';
import agcenter from '@/api/agcenter';
import member from '@/api/member';
import agent from '@/api/agent';

export default {
  components: {
    mobileContainer,
    message
  },
  // 原公用驗證
  //   mixins: [resetPwd],
  data() {
    return {
      errMsg: '',
      msg: '',
      pwdResetInfo: {
        userName: {
          key: 'userName',
          text: 'S_USER_NAME',
          type: 'text',
          value: '',
          regExp: /^[a-z][a-z0-9]{3,19}$/,
          errorMsg: 'S_USERNAME_ERROR',
          placeholder: '请输入用户名',
          eyeShow: false,
          display: false
        },
        email: {
          key: 'email',
          text: 'S_E_MAIL',
          type: 'text',
          value: '',
          regExp: /^[A-Za-z0-9.\-_]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/,
          errorMsg: 'S_JM_EMAIL_FORMAT_UNAVAILABLE',
          placeholder: '请输入电子邮箱',
          maxlength: 100,
          minlength: 12,
          eyeShow: false,
          display: false
        },
        pwd: {
          key: 'pwd',
          text: 'S_ORIGIN_PASSWORD',
          type: 'password',
          value: '',
          regExp: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
          errorMsg: 'S_PASSWORD_ERROR',
          placeholder: '请输入原密码',
          maxlength: 12,
          minlength: 6,
          eyeShow: false,
          display: false
        },
        newPwd: {
          key: 'newPwd',
          text: 'S_NEW_PWD',
          type: 'password',
          value: '',
          regExp: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
          errorMsg: 'S_PASSWORD_ERROR',
          placeholder: '請設置新密碼(6-12位字母或數字)',
          maxlength: 12,
          minlength: 6,
          eyeShow: false,
          display: false
        },
        confNewPwd: {
          key: 'confNewPwd',
          text: 'S_CHK_PWD',
          type: 'password',
          value: '',
          regExp: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
          errorMsg: 'S_PASSWORD_ERROR',
          placeholder: '请再次输入密码',
          maxlength: 12,
          minlength: 6,
          eyeShow: false,
          display: false
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      webInfo: 'getWebInfo',
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo'
    }),
    headerConfig() {
      return {
        prev: !this.memInfo.user.password_reset,
        onClick: () => { this.$router.back(); },
        title: this.isResetPW ? this.$text('S_PASSWORD_RESET', '重设密码') : this.$text('S_CHANGE_PASSWD', '修改密码')
      };
    },
    isResetPW() {
      return this.$route.query.page === 'pwdreset';
    },
    submitActive() {
      return Object.keys(this.pwdResetInfo).every((key) => !this.pwdResetInfo[key].display || (this.pwdResetInfo[key].display && this.pwdResetInfo[key].value));
    },
    hasFooter() {
      return !this.memInfo.user.password_reset;
    }
  },
  methods: {
    toggleEye(key) {
      const target = this.pwdResetInfo[key];
      if (target.eyeShow) {
        document.getElementById(key).type = 'password';
      } else {
        document.getElementById(key).type = 'text';
      }

      this.pwdResetInfo[key].eyeShow = !this.pwdResetInfo[key].eyeShow;
    },
    verification(id, value) {
      const data = this.pwdResetInfo[id];
      const re = new RegExp(data.regExp);
      const msg = this.$t(data.errorMsg);

      if (!re.test(value)) {
        this.errMsg = msg
      } else {
        this.errMsg = '';
      }

      if (this.pwdResetInfo['confNewPwd'].value !== this.pwdResetInfo['newPwd'].value) {
        this.errMsg = '确认密码要与新密码一致';
      }

      if (!value) {
        this.errMsg = '该栏位不得为空';
      }
    },
    pwdModifySubmit() {
      if (!this.submitActive) return;

      const pwdInfo = {
        old_password: this.pwdResetInfo.pwd.value,
        new_password: this.pwdResetInfo.newPwd.value,
        confirm_password: this.pwdResetInfo.confNewPwd.value
      };
      if (this.$route.query.type === 'agent') {
        agcenter.accountPassword({
          params: pwdInfo,
          success: () => {
            this.msg = this.$t('S_EDIT_SUCCESS');
            setTimeout(() => {
              this.$router.push('/mobile/mcenter/setting');
            }, 2000);
          },
          fail: (res) => {
            this.errMsg = `${res.data.msg}(${res.data.code})`;
          }
        });
      } else {
        mcenter.accountPassword({
          params: pwdInfo,
          success: () => {
            this.msg = this.$t('S_EDIT_SUCCESS');
            setTimeout(() => {
              if (this.memInfo.user.password_reset) {
                this.actionSetUserdata(true).then(() => {
                  this.$router.push('/mobile');
                });
                return;
              }
              this.$router.push('/mobile/mcenter/setting');
            }, 2000);
          },
          fail: (res) => {
            this.errMsg = `${res.data.msg}(${res.data.code})`;
          }
        });
      }
    },
    pwdResetSubmit() {
      if (!this.submitActive) return;

      const pwdInfo = {
        username: this.pwdResetInfo.userName.value,
        email: this.pwdResetInfo.email.value,
        new_password: this.pwdResetInfo.newPwd.value,
        confirm_password: this.pwdResetInfo.confNewPwd.value,
        keyring: this.$route.query.kr
      };
      if (this.$route.query.type === 'agent') {
        agent.pwdReset({
          params: pwdInfo,
          success: () => {
            this.msg = this.$t('S_EDIT_SUCCESS');
            setTimeout(() => {
              this.$router.push('/mobile/mcenter/setting');
            }, 2000);
          },
          fail: (res) => {
            this.errMsg = `${res.data.msg}(${res.data.code})`;
          }
        });
      } else {
        member.pwdReset({
          params: pwdInfo,
          success: () => {
            this.msg = this.$t('S_EDIT_SUCCESS');
            setTimeout(() => {
              this.$router.push('/mobile/mcenter/setting');
            }, 2000);
          },
          fail: (res) => {
            this.errMsg = res.data.msg;
          }
        });
      }
    },
    ...mapActions([
      'actionChangePage',
      'actionSetUserdata'
    ]),
    filterField() {
      let displayColumn = ['newPwd', 'confNewPwd'];
      if (this.isResetPW) {
        displayColumn = ['userName', 'email', ...displayColumn];
      } else {
        displayColumn = ['pwd', ...displayColumn];
      }
      Object.keys(this.pwdResetInfo).forEach((key) => {
        this.pwdResetInfo[key].display = displayColumn.includes(key);
      });
      return Object.keys(this.pwdResetInfo);
    }
  }
};

</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.content-wrap {
  background: #fefffe;
  min-height: 100vh;
}

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
  background: -webkit-linear-gradient(right, #e9dacb, #eee5db);
  background: -o-linear-gradient(left, #e9dacb, #eee5db);
  background: -moz-linear-gradient(left, #e9dacb, #eee5db);
  background: linear-gradient(to left, #e9dacb, #eee5db);
  color: #f3ede7;
  margin: 0 auto;
  margin-top: 21px;
  &.active {
    background: -webkit-linear-gradient(right, #bd9d7d, #f9ddbd);
    background: -o-linear-gradient(left, #bd9d7d, #f9ddbd);
    background: -moz-linear-gradient(left, #bd9d7d, #f9ddbd);
    background: linear-gradient(to left, #bd9d7d, #f9ddbd);
    color: white;
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

@media screen and (min-width: $pad) {
  .submit {
    font-size: 17px;
  }

  .field-wrap {
    input {
      font-size: 20px;
      height: 40px;
    }
  }

  .eye {
    height: 40px;
    width: 24px;
    top: 25px;

    > img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
