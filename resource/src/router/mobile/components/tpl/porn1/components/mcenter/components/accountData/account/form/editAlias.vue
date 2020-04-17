<template>
  <div :class="[$style['field-editer'], 'clearfix']">
    <div :class="$style['field-title']">{{ $text("S_USER_NAME") }}</div>

    <div :class="$style['input-wrap']">
      <div :class="$style['field-value']">
        <input
          ref="input"
          v-model="value"
          :placeholder="$text('S_USER_NAME')"
          :class="$style.input"
          maxlength="100"
          type="text"
        />
      </div>
      <!-- <div :class="$style['toggle-nickname']" @click="onToggle">
          <span>{{ $text("S_NICKNAME_SHOW", "显示昵称") }}</span>
          <div :class="['ui toggle checkbox']">
            <input
              :checked="showNickname"
              :disabled="isFetching"
              type="checkbox"
            />
            <label />
          </div>
        </div> -->
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
import ajax from '@/lib/ajax';
import mcenter from '@/api/mcenter';
import { API_MCENTER_ENABLE_ALIAS, API_MCENTER_DISABLE_ALIAS } from '@/config/api';

export default {
  components: {
  },
  data() {
    return {
      value: '',
      isFetching: false,
      showNickname: false
    };
  },
  mounted() {
    this.$refs.input.focus()
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    })
  },
  created() {
    this.showNickname = this.memInfo.user.show_alias;
    this.value = this.memInfo.user.alias;
  },
  methods: {
    ...mapActions(['actionSetUserdata']),
    onToggle() {
      this.showNickname = !this.showNickname;
    },
    handleSubmit() {
      // 空值驗證
      if (this.value === '') {
        this.$emit('msg', this.$text('S_CR_NUT_NULL'));
        return Promise.resolve(result);
      }

      // 驗證失敗
      if (!/^[^，:;！@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']*$/.test(this.value)) {
        this.$emit('msg', this.$text('S_NO_SYMBOL', '请勿输入特殊符号(允许空白)'));
        return Promise.resolve(result);
      }

      const setNickname = mcenter.accountDataSet({
        params: {
          alias: this.value
        }
      });

      const setShowNickname = ajax({
        method: 'put',
        url: this.showNickname ? API_MCENTER_ENABLE_ALIAS : API_MCENTER_DISABLE_ALIAS,
        errorAlert: false
      });

      return Promise.all([setNickname, setShowNickname]).then((response) => {
        if (response.every((res) => res.result === 'ok')) {
          this.$emit('msg', this.$text('S_CR_SUCCESS'));
          this.actionSetUserdata(true);
          this.$emit('cancel')
        }

        return result;
      });
    }
  }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
