<template>
  <div :class="[$style.wrap, 'clearfix']">
    <div :class="$style.title">{{ $text("S_ZALO") }}</div>
    <div :class="$style['input-wrap']">
      <input
        v-model="value"
        ref="input"
        :placeholder="$text('S_ZALO')"
        :class="$style.input"
        type="text"
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    editZalo
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
    ...mapActions([
      'actionSetUserdata',
      'actionSetGlobalMessage'
    ]),
    handleSubmit() {
      mcenter.accountDataSet({
        params: {
          zalo: this.value.substring(0, 50)
        },
        success: () => {
          localStorage.setItem('set-account-success', true);
          this.$router.push('/mobile/mcenter/accountData?success=true');
          this.$emit('success');
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.actionSetGlobalMessage({ msg: `${res.data.msg}` })
          }
        }
      });
    }
  }
};
</script>
<style src="../../../css/index.module.scss" lang="scss" module>
