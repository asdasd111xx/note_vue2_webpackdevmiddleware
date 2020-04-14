<template>
  <edit-gender>
    <template scope="{ options, onSubmit }">
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
            <span
              :class="$style['btn-confirm']"
              @click="handleSubmit(onSubmit)"
            >
              {{ $text("S_CONFIRM", "確認") }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </edit-gender>
</template>

<script>
import editGender from '@/components/common/editGender';

export default {
  components: {
    editGender
  },
  data() {
    return {
      value: '1' // default 1
    };
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    handleSubmit(submit) {
      submit(this.value).then((response) => {
        if (response === 'error') {
          return;
        }

        this.$emit('cancel');
      });
    }
  }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
