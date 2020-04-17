<template>
  <div :class="[$style['field-editer'], 'clearfix']">
    <div :class="$style['field-title']">{{ $text("WECHAT") }}</div>
    <div :class="$style['input-wrap']">
      <div :class="$style['field-value']">
        <input
          v-model="value"
          ref="input"
          :placeholder="$text('WECHAT')"
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
import { mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
  components: {
  },
  data() {
    return {
      value: ''
    };
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    ...mapActions(['actionSetUserdata']),
    ...mapActions(['actionSetUserdata']),
    handleSubmit() {
      // 空值驗證
      if (this.value === '') {
        this.$emit('msg', this.$text('S_CR_NUT_NULL'));
        return Promise.resolve('error');
      }

      return mcenter.accountDataSet({
        params: {
          weixin: this.value
        },
        success: () => {
          this.$emit('msg', this.$text('S_CR_SUCCESS'));
          this.$emit('cancel');
          this.actionSetUserdata(true);
        },
        fail: (res) => {
          this.$emit('msg', res.msg);
          this.$emit('cancel');
        }
      });
    }
  }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
