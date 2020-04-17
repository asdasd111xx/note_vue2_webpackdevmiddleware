<template>
  <div :class="[$style['field-editer'], 'clearfix']">
    <div :class="$style['field-title']">{{ $text("S_BIRTHDAY_DATE") }}</div>
    <div :class="$style['input-wrap']">
      <div :class="$style['field-value']">
        <datepicker
          v-model="value"
          :wrapper-class="$style.datepicker"
          :input-class="$style['datepicker-input']"
          :language="dateLang"
          :disabled="{ from: limit }"
          :open-date="limit"
          :monday-first="true"
          :placeholder="$t('S_BIRTHDAY_DATE')"
          format="yyyy/MM/dd"
          initial-view="year"
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
import Vue from 'vue';
import datepicker from 'vuejs-datepicker';
import { mapActions } from 'vuex';
import datepickerLang from '@/lib/datepicker_lang';
import mcenter from '@/api/mcenter';

export default {
  components: {
    datepicker
  },
  data() {
    return {
      value: new Date(),
      limit: new Date(Vue.moment(new Date()).add(-18, 'year')),
      dateLang: datepickerLang(this.$i18n.locale)
    };
  },
  methods: {
    ...mapActions(['actionSetUserdata']),
    handleSubmit(value) {
      // 空值驗證
      if (value === '') {
        alert(this.$text('S_CR_NUT_NULL'));
        return Promise.resolve('error');
      }

      return mcenter.accountDataSet({
        params: {
          birthday: Vue.moment(value).format()
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
