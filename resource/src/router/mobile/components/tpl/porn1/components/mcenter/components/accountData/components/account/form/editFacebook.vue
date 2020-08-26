<template>
  <div :class="[$style['field-editer'], 'clearfix']">
    <div :class="$style['field-title']">{{ $text("S_FACEBOOK") }}</div>
    <div :class="$style['input-wrap']">
      <div :class="$style['field-value']">
        <input
          v-model="value"
          ref="input"
          :placeholder="$text('S_FACEBOOK')"
          :class="$style.input"
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
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';
export default {
  data() {
    return {
      value: ''
    };
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    ...mapActions(['actionSetUserdata', 'actionSetGlobalMessage']),
    handleSubmit() {
      if (this.tipMsg) {
        return;
      }

      mcenter.accountDataSet({
        params: {
          facebook: this.value
        },
        success: () => {
          localStorage.setItem('set-account-success', true);
          this.$emit('success');
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.tipMsg = `${res.data.msg}`;
          }
        }
      });
    },
  }
};
</script>
<style src="../../../css/index.module.scss" lang="scss" module>
