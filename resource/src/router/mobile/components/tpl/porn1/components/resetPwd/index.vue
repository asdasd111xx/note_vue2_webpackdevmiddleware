<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" class="content-wrap">
      <message v-if="msg" @close="msg = ''"
        ><div slot="msg">{{ msg }}</div>
      </message>
      <!-- 錯誤訊息 -->
      <div :class="$style['top-tips']">
        <div v-show="tipMsg">
          {{ tipMsg }}
        </div>
      </div>
      <div :class="$style['reset-content']">
        <form id="resetPwdForm">
          <div :key="pwdResetInfo[0].key" :class="$style['field-wrap']">
            <div class="clearfix">
              <div :class="$style['title']">
                {{ $text(pwdResetInfo[0].text) }}
              </div>
              <input
                :id="pwdResetInfo[0].key"
                type="password"
                :name="pwdResetInfo[0].key"
                :placeholder="pwdResetInfo[0].placeholder"
                maxlength="12"
                minlength="6"
                v-model="pwd"
              />
              <div :class="$style['eye']">
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/_new/login/btn_eye_${
                        pwdResetInfo[0].show ? 'n' : 'd'
                      }.png`
                    )
                  "
                  @click="toggleEye(0)"
                />
              </div>
            </div>
          </div>
          <div :key="pwdResetInfo[1].key" :class="$style['field-wrap']">
            <div class="clearfix">
              <div :class="$style['title']">
                {{ $text(pwdResetInfo[1].text) }}
              </div>
              <input
                :id="pwdResetInfo[1].key"
                type="password"
                :name="pwdResetInfo[1].key"
                :placeholder="pwdResetInfo[1].placeholder"
                v-model="newPwd"
                maxlength="12"
                minlength="6"
                @input="verification($event.target.id, $event.target.value)"
              />
              <div :class="$style['eye']">
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/_new/login/btn_eye_${
                        pwdResetInfo[1].show ? 'n' : 'd'
                      }.png`
                    )
                  "
                  @click="toggleEye(1)"
                />
              </div>
            </div>
          </div>
          <div :key="pwdResetInfo[2].key" :class="$style['field-wrap']">
            <div class="clearfix">
              <div :class="$style['title']">
                {{ $text(pwdResetInfo[2].text) }}
              </div>
              <input
                :id="pwdResetInfo[2].key"
                type="password"
                :name="pwdResetInfo[2].key"
                :placeholder="pwdResetInfo[2].placeholder"
                v-model="confNewPwd"
                maxlength="12"
                minlength="6"
                @input="verification($event.target.id, $event.target.value)"
              />
              <div :class="$style['eye']">
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/_new/login/btn_eye_${
                        pwdResetInfo[2].show ? 'n' : 'd'
                      }.png`
                    )
                  "
                  @click="toggleEye(2)"
                />
              </div>
            </div>
          </div>
          <!-- <div :key="pwdResetInfo[3].key" :class="$style['field-wrap']">
            <div class="clearfix">
              <div :class="$style['title']">
                {{ $text(pwdResetInfo[3].text) }}
              </div>
              <input
                :id="pwdResetInfo[3].key"
                type="text"
                :name="pwdResetInfo[3].key"
                :placeholder="pwdResetInfo[3].placeholder"
                v-model="email"
                @input="verification($event.target.id, $event.target.value)"
              />
            </div>
          </div> -->

          <div
            :class="[
              $style['submit'],
              {
                [$style['active']]: pwd && newPwd && confNewPwd && !this.tipMsg
              }
            ]"
            @click="pwdResetSubmit()"
          >
            {{ $text("S_SUBMIT", "提交") }}
          </div>
        </form>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import resetPwd from '@/mixins/resetPwd';
import mobileContainer from '../common/new/mobileContainer'
import message from '../common/new/message'
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import agent from '@/api/agent';

export default {
  // 原公用驗證
  //   mixins: [resetPwd],
  data() {
    return {
      tipMsg: "",
      msg: "",
      pwd: "",
      newPwd: "",
      email: "",
      confNewPwd: "",
      pwdResetInfo: [{
        key: 'pwd',
        text: 'S_ORIGIN_PASSWORD',
        regExp: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
        errorMsg: 'S_PASSWORD_ERROR',
        placeholder: '请输入原密码',
        show: false
      },
      {
        key: 'newPwd',
        text: 'S_NEW_PWD',
        regExp: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
        errorMsg: 'S_PASSWORD_ERROR',
        placeholder: '(6~12码，字元限定a-z0-9._-!@#$&+=|*)',
        show: false
      },
      {
        key: 'confNewPwd',
        text: 'S_CHK_PWD',
        regExp: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
        errorMsg: 'S_PASSWORD_ERROR',
        placeholder: '请再次输入密码',
        show: false
      },
      {
        key: 'email',
        text: 'S_E_MAIL',
        type: 'text',
        // regExp: /^[A-Za-z0-9.\-_]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/,
        regExp: '',
        errorMsg: 'S_JM_EMAIL_FORMAT_UNAVAILABLE',
        placeholder: '电子邮箱'
      }]
    }
  },
  components: {
    mobileContainer,
    message,
  },
  watch: {
  },
  computed: {
    ...mapGetters({
      webInfo: 'getWebInfo',
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo'
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text("S_CHANGE_PASSWD", "修改密码"),
      };
    },
  },
  created() {
  },
  methods: {
    toggleEye(key) {
      let target = this.pwdResetInfo[key]
      if (target.show) {
        document.getElementById(target.key).type = 'password';
      } else {
        document.getElementById(target.key).type = 'text';
      }

      this.pwdResetInfo[key].show = !this.pwdResetInfo[key].show;
    },
    verification(id, value) {
      const data = this.pwdResetInfo.find((i) => i.key == id);
      const re = new RegExp(data.regExp);
      let msg = this.$t(data.errorMsg);

      if (!re.test(value) || value === '') {
        this.tipMsg = msg;
      } else {
        this.tipMsg = "";
      }
    },
    pwdResetSubmit() {
      if (this.tipMsg) return;

      const pwdInfo = {
        username: this.memInfo.user.username,
        password: this.pwd,
        new_password: this.newPwd,
        confirm_password: this.confNewPwd,
        // email: this.email || this.memInfo.user.email
      };
      if (this.$route.query.type === 'agent') {
        agent.pwdReset({
          params: pwdInfo,
          success: () => {
            this.tipMsg = this.$t('S_CR_SUCCESS')
            setTimeout(() => {
              this.$router.push('/mobile/mcenter/setting')
            }, 400)
          },
          fail: (res) => {
            this.tipMsg = res.data.msg;
          }
        });
      } else {
        member.pwdReset({
          params: pwdInfo,
          success: () => {
            this.tipMsg = this.$t('S_CR_SUCCESS')
            this.$router.push('/mobile/mcenter/setting')
          },
          fail: (res) => {
            this.tipMsg = res.data.msg;
          }
        });
      }
    },
    ...mapActions([
      'actionChangePage'
    ])
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
  padding: 0 14px;
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
  margin-bottom: 8px;
  height: 77px;
  position: relative;

  .title {
    color: $main_text_color3;
    margin-bottom: 6px;
  }

  input {
    font-size: 16px;
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
  &.active {
    background: -webkit-linear-gradient(right, #bd9d7d, #f9ddbd);
    background: -o-linear-gradient(left, #bd9d7d, #f9ddbd);
    background: -moz-linear-gradient(left, #bd9d7d, #f9ddbd);
    background: linear-gradient(to left, #bd9d7d, #f9ddbd);
    color: white;
  }
}

.top-tips {
  background: $main_white_color1;
  padding: 0 14px;
  color: $main_error_color1;
  height: 40px;
  line-height: 40px;
}

.eye {
  display: flex;
  align-items: center;
  height: 25px;
  width: 18px;
  position: absolute;
  right: 14px;
  top: 25px;

  > img {
    width: 18px;
    height: 18px;
  }
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
