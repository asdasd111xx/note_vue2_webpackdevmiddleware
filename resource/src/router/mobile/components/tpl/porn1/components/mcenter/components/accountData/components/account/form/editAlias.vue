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
      <div :class="$style.block">
        <div :class="$style.title">{{ $text("S_NICKNAME") }}</div>
        <div :class="$style['input-wrap']">
          <input
            ref="input"
            v-model="value"
            :placeholder="`请输入${$text('S_NICKNAME')}`"
            :class="$style.input"
            @input="onInput"
            :maxlength="20"
            type="text"
          />
          <div :class="$style['clear-input']" v-if="value">
            <img
              :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
              @click="value = ''"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  API_MCENTER_ENABLE_ALIAS,
  API_MCENTER_DISABLE_ALIAS
} from "@/config/api";
import { mapGetters, mapActions } from "vuex";
import accountHeader from "../../accountHeader";
import ajax from "@/lib/ajax";
import mcenter from "@/api/mcenter";

export default {
  components: {
    accountHeader
  },
  data() {
    return {
      value: "",
      tipMsg: "",
      showNickname: false
    };
  },
  mounted() {
    this.$refs.input.focus();
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_NICKNAME", "真实姓名"),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text("S_COMPLETE", "完成"),
        funcBtnActive: !!this.value && !this.tipMsg
      };
    }
  },
  created() {
    //  是否顯示暱稱 尚未實作
    this.showNickname = this.memInfo.user.show_alias;
    this.value = this.memInfo.user.alias;
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionVerificationFormData"
    ]),
    onInput(e) {
      this.actionVerificationFormData({
        target: "alias",
        value: e.target.value
      }).then(val => {
        this.value = val;
      });
    },
    handleSubmit() {
      // 驗證失敗
      //   if (!/^[^，:;！@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']*$/.test(this.value)) {
      //     this.$emit('msg', this.$text('S_NO_SYMBOL', '请勿输入特殊符号(允许空白)'));
      //     return Promise.resolve(result);
      //   }

      const setNickname = mcenter.accountDataSet({
        params: {
          alias: this.value.substring(0, 20)
        }
      });

      const setShowNickname = ajax({
        method: "put",
        url: this.showNickname
          ? API_MCENTER_ENABLE_ALIAS
          : API_MCENTER_DISABLE_ALIAS,
        errorAlert: false
      });

      return Promise.all([setNickname, setShowNickname]).then(response => {
        if (response.every(res => res.result === "ok")) {
          localStorage.setItem("set-account-success", true);
          this.$router.push("/mobile/mcenter/accountData");
        }
      });
    }
  }
};
</script>

<style src="../../../css/index.module.scss" lang="scss" module />
