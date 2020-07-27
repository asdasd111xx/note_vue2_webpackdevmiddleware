<template>
  <div :class="[$style.wrap, 'clearfix']">
    <template v-if="hasOld">
      <div :class="$style.title">{{ $text("S_OLD_PWD") }}</div>
      <div :class="$style['input-wrap']">
        <input
          v-for="num in 4"
          :key="`old-${num}`"
          :value="oldValue[num - 1]"
          :class="$style['withdraw-input']"
          type="text"
          maxlength="1"
          @input="onInput($event, 'oldValue', num - 1)"
        />
      </div>
    </template>
    <div :class="$style.title">{{ $text("S_NEW_PWD") }}</div>
    <div :class="$style['input-wrap']">
      <input
        v-for="num in 4"
        :key="`new-${num}`"
        :value="newValue[num - 1]"
        :class="$style['withdraw-input']"
        type="text"
        maxlength="1"
        @input="onInput($event, 'newValue', num - 1)"
      />
    </div>
    <div :class="$style['btn-wrap']">
      <div :class="$style['btn-cancel']" @click="$emit('cancel')">
        {{ $text("S_CANCEL", "取消") }}
      </div>
      <div :class="$style['btn-confirm']" @click="handleSubmit(onSubmit)">
        {{ $text("S_CONFIRM", "確認") }}
      </div>
    </div>
    <div :class="$style['bottom-tip']">
      <div>{{ $text("S_LIMIT_0_TO_9") }}</div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    editWithdrawPwd
  },
  data() {
    return {
      oldValue: ['', '', '', ''],
      newValue: ['', '', '', '']
    };
  },
  methods: {
    onInput(e, field, index) {
      this.$set(this[field], index, e.target.value);

      if (!/^[0-9]$/.test(this[field][index])) {
        this.$set(this[field], index, '');
      }
    },
    handleSubmit(submit) {
      submit(this.value).then((response) => {
        if (response.msg) {
          alert(response.msg);
        }

        if (response.status) {
          this.$emit('cancel');
        }
      });
    }
  }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
