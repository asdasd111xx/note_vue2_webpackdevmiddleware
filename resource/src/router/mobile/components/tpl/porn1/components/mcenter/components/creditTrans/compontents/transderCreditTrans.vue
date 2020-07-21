<template>
  <div slot="content" :class="['clearfix']">
    <!-- 一件回收 -->
    <balance-back />

    <div :class="$style['form']">
      <!-- 錯誤訊息 -->
      <div v-show="tipMsg" :class="$style['top-tips']">
        <div>
          {{ tipMsg }}
        </div>
      </div>

      <template v-for="item in inputInfo">
        <div
          key="item.key"
          :class="[
            $style['form-content'],
            { [$style['keyring']]: item.key === 'keyring' }
          ]"
        >
          <template v-if="item.key !== 'keyring'">
            <div :class="$style['form-title']">
              {{ item.title }}
            </div>
            <div :class="$style['form-input']">
              <input
                v-model="formData[item.key]"
                @input="verification(item)"
                :placeholder="item.placeholder"
                type="number"
              />
            </div>
          </template>
          <template v-else>
            <div :class="[$style['keyring-title']]">
              {{ item.title }}
            </div>
            <div :class="[$style['keyring-input']]">
              <input
                v-model="formData.keyring"
                :placeholder="item.placeholder"
                @input="verification(inputInfo[3])"
                type="number"
              />
              <div
                :class="[
                  $style['send-keyring'],
                  {
                    [$style.disabled]: isSendKeyring || !isVerifyPhone || tipMsg
                  }
                ]"
                @click="showCaptcha"
              >
                {{ times ? `${times}s` : "获取验证码" }}
              </div>
            </div>
          </template>
        </div>
      </template>

      <div
        :class="[
          $style['submit-wrap'],
          {
            [$style.disabled]: tipMsg || !isVerifyForm
          }
        ]"
      >
        <div>
          立即转让
        </div>
      </div>
    </div>

    <popup-verification
      v-if="isShowCaptcha"
      :is-show-captcha.sync="isShowCaptcha"
      :captcha.sync="captchaData"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceBack from "../../../../common/new/balanceBack";
import popupVerification from '@/components/popupVerification';
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        target_username: "", //接收使用者帳號
        amount: "", //轉點額度
        phone: "", //手機號碼
        keyring: "", //驗證碼
      },
      captcha: null,
      toggleCaptcha: false,
      isSendKeyring: false,
      isVerifyForm: false,
      isVerifyPhone: false,
      times: 0,
      tipMsg: ''
    };
  },
  components: {
    balanceBack,
    popupVerification
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    isShowCaptcha: {
      get() {
        return this.toggleCaptcha
      },
      set(value) {
        return this.toggleCaptcha = value
      }
    },
    captchaData: {
      get() {
        return this.captcha
      },
      set(value) {
        return this.captcha = value
      }
    },
    inputInfo() {
      return [
        { key: "target_username", title: "转入帐号", placeholder: "请输入下线帐号" },
        { key: "amount", title: "转让金额", placeholder: "单笔转让不得少于199元" },
        { key: "phone", title: "手机号码", placeholder: "请输入手机号码" },
        { key: "keyring", title: "获取验证码", placeholder: "请输入验证码" }
      ]
    }
  },
  created() {

  },
  watch: {
    captchaData(val) {
      this.getKeyring()
    },
  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      'actionSetGlobalMessage'
    ]),
    showCaptcha() {
      if (!this.formData.phone) {
        return;
      }
      this.toggleCaptcha = true;
    },
    getKeyring() {
      if (!this.formData.phone) {
        return;
      }

      this.tipMsg = "";

      axios({
        method: 'post',
        url: '/api/v1/c/player/valet/charge/sms',
        data: {
          phone: "+86" + this.formData.phone,
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
    verification(item) {
      if (item.key === "phone") {
        if (this.formData.phone.length < 11) {
          this.tipMsg = "手机格式不符合要求";
          this.isVerifyPhone = false;
        } else {
          this.tipMsg = "";
          this.isVerifyPhone = true;
        }
      }

      this.inputInfo.forEach((item) => {
        this.isVerifyForm = !!(this.formData[item.key]);
      })
    }
  }
};
</script>

<style lang="scss" module>
@import "../css/index.module.scss";

.form {
  background-color: #eeeeee;
}

.form-content {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 13px;
  color: #222222;
  background-color: #fefffe;
  margin-top: 1px;
  font-size: 14px;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-weight: 400;
  line-height: 20px;
  position: relative;
}

.keyring {
  height: auto;
  display: block;
  padding-top: 17px;
  padding-bottom: 8px;
}

.form-title {
  height: 20px;
  width: 120px;
}

.form-input {
  width: 100%;
  padding: 0 13px;

  input {
    width: 100%;
  }
}

.keyring-title {
  margin-bottom: 11px;
  height: 20px;
  width: 100%;
}

.keyring-input {
  height: 35px;
  width: 100%;
  position: relative;
  line-height: 35px;
  input {
    width: 60%;
  }
}

.send-keyring {
  -moz-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background-color: #d1b79c;
  border-radius: 3px;
  color: white;
  font-weight: 400;
  height: 30px;
  line-height: 30px;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  width: 100px;

  &.disabled {
    color: white;
    background-color: #e9dacc;
    pointer-events: none;
  }
}

input::placeholder {
  color: #aaaaaa;
}

.submit-wrap {
  height: 43px;
  margin: 15px auto;
  padding: 0 13px;
  max-width: $mobile_max_width;

  > div {
    border-radius: 3px;
    background: -webkit-linear-gradient(to right, #f9ddbd, #bd9d7d);
    background: -o-linear-gradient(to right, #f9ddbd, #bd9d7d);
    background: -moz-linear-gradient(to right, #f9ddbd, #bd9d7d);
    background: linear-gradient(to right, #f9ddbd, #bd9d7d);
    line-height: 43px;
    font-size: 14px;
    font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
    font-weight: 700;
    text-align: center;
    color: #f3ede7;
    width: 100%;
    height: 100%;
  }

  &.disabled {
    > div {
      background: -webkit-linear-gradient(to right, #eee5db, #e9dacb);
      background: -o-linear-gradient(to right, #eee5db, #e9dacb);
      background: -moz-linear-gradient(to right, #eee5db, #e9dacb);
      background: linear-gradient(to right, #eee5db, #e9dacb);
    }
  }
}
</style>
