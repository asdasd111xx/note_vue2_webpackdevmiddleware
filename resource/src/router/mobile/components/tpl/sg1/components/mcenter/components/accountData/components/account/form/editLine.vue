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
        <div :class="$style.title">{{ $text("S_LINE") }}</div>
        <div :class="$style['input-wrap']">
          <input
            ref="input"
            :value="value"
            :placeholder="`请输入${$text('S_LINE')}`"
            :class="$style.input"
            :maxlength="30"
            type="text"
            @input="onInput"
          />
        </div>
      </div>
    </div>
    <service-tips />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mcenter from "@/api/mcenter";
import serviceTips from "../../serviceTips";
import accountHeader from "../../accountHeader";

export default {
  components: {
    accountHeader,
    serviceTips
  },
  data() {
    return {
      value: "",
      tipMsg: ""
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
        title: this.$text("S_LINE"),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text("S_COMPLETE", "完成"),
        funcBtnActive: !!this.value && !this.tipMsg
      };
    }
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetＭcenterBindMessage"]),
    onInput(e) {
      this.tipMsg = "";
      this.value = e.target.value;
    },
    handleSubmit() {
      if (this.tipMsg) {
        return;
      }

      mcenter.accountDataSet({
        params: {
          line: this.value
        },
        success: () => {
          localStorage.setItem("set-account-success", true);
          this.$router.push("/mobile/mcenter/accountData?success=true");
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
<style src="../../../css/index.module.scss" lang="scss" module />
