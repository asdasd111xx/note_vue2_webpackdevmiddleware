<script>
//HTML
//fieldData寫死的陣列（放欄位）
//寫一個form v-for=fieldData 去包input
//特例type=password

//created
//確認是否開啟收幾驗證

//@input='fn(key)' 用key去switch不同的情況，把joinMeminfo裡的  正則，錯誤訊息放入data秀在上面
//手機號碼

//輸入手機號碼
//輸入時驗證，11碼，非數字用''取代，超過11碼用''取代 ，開頭不為0
//按下獲取驗證碼
//1.發出請求 post? payload為phone
//2.得到錯誤訊息（顯示於errMsg）驗證碼已送出｜手機重複
//3.getTTL 顯示倒數秒數，disable按鈕（重新載入也要）

//密碼
//輸入手機號碼
//輸入時驗證，11碼，非數字用''取代，超過11碼用''取代

//$style
//1.取得props theme
//2.給底下的scss module一個名字
//3.合併1.2

//未作
//取得placeholder
//取得推廣連結送出getlocalstorge('xcode')
</script>
<template>
  <div :class="$style['container']">
    <input type="password" style="height: 0;" />
    <div
      :class="$style['filed-wrap']"
      v-for="field in fieldData"
      :key="field.key"
    >
      <div :class="$style['div']">
        <!-- label -->
        <label :class="$style['label']" :for="field.key">{{
          field.name
        }}</label>

        <!-- phone -->
        <template v-if="field.key.includes('phone')"
          ><input
            :class="$style['input']"
            type="text"
            :id="field.key"
            v-model="allValue[field.key]"
            @input="verification(field.key)"
            :placeholder="field.placehodler"
          />
          <img
            :class="$style['clear']"
            :src="`/static/image/common/ic_clear.png?v=44892653.1`"
            alt=""
            @click="
              allValue['phone'] = '';
              allTip['phone'] = '';
            "
          />
        </template>

        <!-- captcha_text -->
        <template v-if="field.key.includes('captcha_text')"
          ><input
            :class="$style['input']"
            type="text"
            :id="field.key"
            v-model="allValue[field.key]"
            @input="verification(field.key)"
            :placeholder="field.placehodler"
            style="width: 45%"
          />
          <div :class="$style['getCaptcha']">
            {{ ttl > 0 ? ttl + "s" : "獲取驗證碼" }}
          </div>
        </template>

        <!-- password -->
        <template v-if="field.key.includes('password')"
          ><input
            :class="$style['input']"
            type="password"
            :id="field.key"
            v-model="allValue[field.key]"
            @input="verification(field.key)"
            :placeholder="field.placehodler"
          />
          <img
            :class="$style['eye']"
            :src="`/static/image/common/login/btn_eye_${toggleEye}.png`"
            alt=""
            @click="isShowPwd = !isShowPwd"
          />
        </template>
      </div>

      <!-- tip -->
      <div :class="$style['tip']">
        {{ allTip[field.key] }}
      </div>

      <!-- <template v-if="field.name === '验证码'">
        <span @click="getVertifyCode">getVertifyCode</span>
        <span @click="$router.push('/mobile')">獲取不到驗證碼?</span>
      </template> -->
    </div>

    <div :class="$style['join-btn']" @click="handleSend">注册</div>
    <div :class="$style['abc']">123</div>
  </div>
</template>

<script>
import joinMemInfo from "@/config/joinMemInfo.js";
export default {
  props: {
    theme: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      joinMemInfo,
      fieldData: [
        {
          key: "phone",
          name: "手机号",
          placehodler: "手机号"
        },
        {
          key: "captcha_text",
          name: "验证码",
          placehodler: "验证码"
        },
        {
          key: "password",
          name: "密码",
          placehodler: "密码"
        },
        {
          key: "confirm_password",
          name: "确认密码",
          placehodler: "确认密码"
        }
      ],
      isShowPwd: false,
      allValue: {
        phone: "",
        captcha_text: "",
        password: "",
        confirm_password: ""
      },

      allTip: {
        phone: "",
        captcha_text: "",
        password: "",
        confirm_password: ""
      },
      ttl: 0
    };
  },
  methods: {
    getVertifyCode() {
      console.log("獲取驗證碼");
    },
    verification(key) {
      const data = joinMemInfo[key];
      let reg;

      //input為''時，tip為''
      if (this.allValue[key] === "") {
        this.allTip[key] = "";
        return;
      }

      switch (key) {
        case "phone":
          reg = /[^1-9][^0-9]*/g;
          this.allValue.phone = this.allValue.phone
            .replace(reg, "")
            .substring(0, 11);
          this.allTip[key] = data.errorMsg;
          break;
        case "captcha_text":
          reg = /[^0-9]*/g;
          this.allValue.captcha_text = this.allValue.captcha_text
            .replace(reg, "")
            .substring(0, 6);
          this.allTip[key] = data.errorMsg;
          break;
        case "password":
          reg = /[^A-Za-z0-9._\-!@#$&+=|*]/g;
          this.allValue.password = this.allValue.password.replace(reg, "");
          this.allTip[key] = data.errorMsg;
          break;
        case "confirm_password":
          reg = /[^A-Za-z0-9._\-!@#$&+=|*]/g;
          this.allValue.confirm_password = this.allValue.confirm_password.replace(
            reg,
            ""
          );
          this.allTip[key] = data.errorMsg;
          break;

        default:
          break;
      }
    },

    getTTL() {
      console.log("getTTL");
    },
    handleSend() {
      console.log("handleSend");
    }
  },
  computed: {
    $style() {
      if (this.theme) {
        console.log();
        return { ...this.theme, ...this.$stylePhone };
      }
    },
    toggleEye() {
      if (this.isShowPwd) {
        if (document.getElementById("password")) {
          document.getElementById("password").type = "text";
          document.getElementById("confirm_password").type = "text";
        }
        return "n";
      } else {
        if (document.getElementById("password")) {
          document.getElementById("password").type = "password";
          document.getElementById("confirm_password").type = "password";
        }
        return "d";
      }
    }
  }
};
</script>

// //
<style lang="scss" module="$stylePhone">
// @import "~@/css/variable.scss";
.abc {
  background-color: black;
}
.container {
  width: 90%;
  margin: 0 auto;
}
.filed-wrap {
  margin: 10px 0;
  line-height: 40px;
}
.div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.label {
  width: 20%;
  display: inline-block;
  text-align: right;
  color: #5e626d;
}
.input {
  width: 75%;
  padding: 0 10px;
  line-height: 40px;
  border: 1px solid #d8d8d8;
  border-radius: 3px;
}
.clear {
  position: absolute;
  right: 10px;
  width: 12px;
}
.getCaptcha {
  width: 25%;
  border: 1px solid #d8d8d8;
  border-radius: 3px;
  line-height: 40px;
  text-align: center;
}
.eye {
  position: absolute;
  right: 10px;
  width: 18px;
}
.tip {
  text-align: right;
  color: #c24141;
  font-size: 14px;
}
.join-btn {
  margin: 20px auto;
  background: var(--main_button_color1);
  border-radius: 30px;
  line-height: 50px;
  width: 100%;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  color: var(--main_button_text_color1);

  &.disable {
    background: var(--main_button_color2);
    color: var(--main_button_text_color2);
    pointer-events: none;
  }
}
</style>
