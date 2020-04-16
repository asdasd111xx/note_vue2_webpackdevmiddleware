<template>
  <edit-facebook>
    <template scope="{ onSubmit }">
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
  </edit-facebook>
</template>

<script>
import editFacebook from '@/components/common/editFacebook';

export default {
  components: {
    editFacebook
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
