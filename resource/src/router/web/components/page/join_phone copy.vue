<script>
//寫一個form 去包input
//div v-for filedData(後端給要填入的欄位有哪些)（這是join_member的情況）（手機註冊固定4個欄位，直接寫死）
//確認是否開啟收幾驗證

//是
//預設手機註冊tab

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

//取得推廣連結送出getlocalstorge('xcode')
</script>
<template>
  <div class="joinphone">
    <div v-show="errMsg">
      {{ errMsg }}
    </div>
    <input
      type="text"
      placeholder="phone"
      v-model="phone"
      @input="checkPhone"
    />
    <div></div>
    <input
      type="text"
      placeholder="vertify"
      v-model="vertify"
      @input="checkVertify"
    />

    <div>
      <template v-if="ttl === 0" @click="getVertifyCode"
        >getVertifyCode</template
      >
      <template v-else>{{ ttl }}</template>
      <span @click="$router.push('/mobile')">獲取不到驗證碼?</span>
    </div>
    <input
      type="text"
      placeholder="請設置密碼"
      v-model="password"
      @input="checkPhone"
    />
    <input
      type="text"
      placeholder="請再次輸入設置密碼"
      v-model="confirm_password"
      @input="checkPhone"
    />
    <div @click="handleSend">註冊</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phone: "",
      vertify: "",
      allTip: {
        phone: "",
        vertify_code: "",
        password: "",
        confirm_password: ""
      },
      ttl: 0,
      password: "",
      confirm_password: ""
    };
  },
  methods: {
    getVertifyCode() {
      console.log("獲取驗證碼");
    },
    checkPhone(e) {
      const val = e.target.value;
      console.log(val);
      console.log("checkPhone");
      // 正則：非數字用''取代，
      const maxlength = 11;
    },
    checkVertify(e) {
      const val = e.target.value;
      console.log(val);
      console.log("checkVertify");
    },

    getTTL() {
      console.log("getTTL");
    },
    handleSend() {
      console.log("handleSend");
    },
    checkVertifyCode() {
      console.log("checkVertifyCode");
    }
  }
};
</script>

<style>
.joinphone > div,
.joinphone > input {
  margin: 10px;
}
</style>
