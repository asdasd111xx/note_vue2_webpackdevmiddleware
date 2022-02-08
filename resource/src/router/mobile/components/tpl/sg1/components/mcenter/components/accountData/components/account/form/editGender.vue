<template>
  <div :class="[$style['field-editer'], 'clearfix']">
    <div :class="$style['field-title']">{{ $text("S_GENDER") }}</div>
    <div :class="$style['input-wrap']">
      <div :class="$style['field-value']">
        <select v-model="value" :class="$style.select" ref="input">
          <option
            v-for="option in options"
            :key="`option-${option.value}`"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
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
      value: '1',
      options: [
        // 預設 男
        // { value: '', label: this.$text('S_GENDER') },
        { value: '1', label: this.$text('S_MALE') },
        { value: '2', label: this.$text('S_FEMALE') }
      ]
    };
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    ...mapActions(['actionSetUserdata', 'actionSetGlobalMessage']),
    handleSubmit() {
      // 空值驗證
      if (this.value === '') {
        this.$emit('msg', this.$text('S_CR_NUT_NULL'));
        return Promise.resolve('error');
      }

      return mcenter.accountDataSet({
        params: {
          gender: this.value
        },
        success: () => {
          this.$emit('success');
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.actionSetGlobalMessage({ msg: `${res.data.msg}` })
          }

          this.$emit('cancel');
        }
      });
    }
  }
};
</script>
<style src="../../../css/index.module.scss" lang="scss" module>
