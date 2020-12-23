<template>
  <div :class="[$style['field-editer'], 'clearfix']">
    <div :class="$style['field-title']">{{ $text("S_SKYPE") }}</div>
    <div :class="$style['input-wrap']">
      <div :class="$style['field-value']">
        <input
          ref="input"
          v-model="value"
          :placeholder="`请输入${$text('S_SKYPE')}`"
          :class="$style.input"
          maxlength="100"
          type="text"
        />
      </div>
      <div :class="$style['btn-wrap']">
        <span :class="$style['btn-cancel']" @click="$emit('cancel')">
          {{ $text("S_CANCEL", "取消") }}
        </span>
        <span :class="$style['btn-confirm']" @click="handleSubmit()">
          {{ $text("S_CONFIRM", "確認") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mcenter from "@/api/mcenter";

export default {
  data() {
    return {
      value: ""
    };
  },
  mounted() {
    this.$refs.input.focus();
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetGlobalMessage"]),
    handleSubmit() {
      mcenter.accountDataSet({
        params: {
          skype: this.value.substring(0, 50)
        },
        success: () => {
          localStorage.setItem("set-account-success", true);
          this.$emit("success");
        },
        fail: res => {
          if (res && res.data && res.data.msg) {
            this.actionSetGlobalMessage({ msg: `${res.data.msg}` });
          }
        }
      });
    }
  }
};
</script>
<style src="../../../css/index.module.scss" lang="scss" module />
