<template>
  <div>
    <slot :options="options" :on-submit="onSubmit" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
  data() {
    return {
      options: [
        // 預設 男
        // { value: '', label: this.$text('S_GENDER') },
        { value: '1', label: this.$text('S_MALE') },
        { value: '2', label: this.$text('S_FEMALE') }
      ]
    };
  },
  methods: {
    ...mapActions(['actionSetUserdata']),
    onSubmit(value) {
      // 空值驗證
      if (value === '') {
        alert(this.$t('S_CR_NUT_NULL'));
        return Promise.resolve('error');
      }

      return mcenter.accountDataSet({
        params: {
          gender: value
        },
        success: () => {
          alert(this.$t('S_CR_SUCCESS'));
          this.actionSetUserdata(true);
        }
      });
    }
  }
};
</script>
