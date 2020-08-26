<template>
  <div :class="['clearfix']">
    <!-- 一件回收 -->
    <balance-back />
    <div :class="$style['promotion-tips']" v-html="promotionTips" />
    <div :class="$style['form']">
      <!-- 錯誤訊息 -->
      <div v-show="tipMsg" :class="$style['top-tips']">
        <div>
          {{ tipMsg }}
        </div>
      </div>

      <template v-for="item in inputInfo">
        <!-- 各欄位錯誤訊息 -->
        <div
          v-if="errorMessage[item.key] && item.key !== 'keyring'"
          :class="[$style['form-tips']]"
        >
          <div>
            {{ errorMessage[item.key] }}
          </div>
        </div>

        <div
          :key="item.key"
          :class="[
            $style['form-content'],
            { [$style['keyring-content']]: item.key === 'keyring' }
          ]"
        >
          <template v-if="item.key === 'target_username'">
            <div :class="$style['form-title']">
              {{ item.title }}
            </div>
            <div :class="$style['form-input']">
              <input
                v-model="formData[item.key]"
                @blur="verification(item)"
                @input="verification(item)"
                :placeholder="item.placeholder"
                type="text"
              />
            </div>
          </template>
          <template v-else-if="item.key === 'keyring'">
            <div :class="[$style['keyring-title']]">
              {{ item.title }}

              &nbsp; &nbsp;
              <span
                v-if="errorMessage['keyring']"
                :class="[$style['keyring-tips']]"
              >
                {{ errorMessage["keyring"] }}
              </span>
            </div>
            <div :class="[$style['keyring-input']]">
              <input
                v-model="formData.keyring"
                :placeholder="item.placeholder"
                @blur="verification(inputInfo[3])"
                @input="verification(inputInfo[3])"
                :maxlength="item.maxlength"
                type="number"
              />
              <div
                :class="[
                  $style['send-keyring'],
                  {
                    [$style.disabled]: isSendKeyring || !isVerifyPhone
                  }
                ]"
                @click="showCaptcha"
              >
                {{ times ? `${times}s` : "获取验证码" }}
              </div>
            </div>
          </template>
          <template v-else>
            <div :class="$style['form-title']">
              {{ item.title }}
            </div>
            <div :class="$style['form-input']">
              <input
                v-model="formData[item.key]"
                @blur="verification(item)"
                @input="verification(item)"
                :placeholder="item.placeholder"
                type="number"
              />
            </div>
          </template>
        </div>
      </template>

      <div
        :class="[
          $style['submit-wrap'],
          {
            [$style.disabled]: !isVerifyForm || isSendRecharge
          }
        ]"
        @click="sendRecharge"
      >
        <div>
          立即转让
        </div>
      </div>
    </div>

    <tips-credit-trans />
    <popup-verification
      v-if="isShowCaptcha"
      :is-show-captcha.sync="isShowCaptcha"
      :captcha.sync="captchaData"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceBack from "../../../../mcenter/components/common/balanceBack";
import popupVerification from '@/components/popupVerification';
import axios from 'axios';
import tipsCreditTrans from './tipsCreditTrans';
import mixin from '@/mixins/mcenter/recharge/recharge';
export default {
  mixins: [mixin],
  data() {
    return {
      captcha: null,
      toggleCaptcha: false,
    };
  },
  components: {
    balanceBack,
    popupVerification,
    tipsCreditTrans
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
  },
  created() {
    this.getRechargeBalance();
  },
  watch: {
    captchaData(val) {
      this.getKeyring();
    },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    showCaptcha() {
      if (!this.formData.phone) {
        return;
      }

      this.rechargeCheck().then((res) => {
        if (res) {
          this.toggleCaptcha = true;
        }
      });
    },
  }
};
</script>

<style lang="scss" module>
@import "../css/index.module.scss";

.form {
  background-color: #eeeeee;
  font-size: 14px;
}

.form-content {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 13px;
  color: #222222;
  background-color: #fefffe;
  margin-top: 1px;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-weight: 400;
  line-height: 20px;
  position: relative;
}

.keyring-tips {
  color: $main_error_color1;
}

.form-tips {
  padding: 0 13px;
  background-color: #fefffe;
  margin-top: 1px;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-weight: 400;
  line-height: 20px;
  position: relative;
  color: $main_error_color1;
  display: block;
  word-break: break-all;
  //   height: 30px;
  //   line-height: 30px;
  padding-top: 5px;
}

.form-tips {
  + .form-content {
    margin-top: unset;
  }
}

.keyring-content {
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
      pointer-events: none;
    }
  }
}
</style>
