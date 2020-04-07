<template>
    <div>
        <slot
            :date-lang="dateLang"
            :limit="ageLimit"
            :on-submit="onSubmit"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import datepickerLang from '@/lib/datepicker_lang';
import mcenter from '@/api/mcenter';

export default {
    data() {
        return {
            ageLimit: new Date(Vue.moment(new Date()).add(-18, 'year')),
            dateLang: datepickerLang(this.$i18n.locale)
        };
    },
    methods: {
        ...mapActions(['actionSetUserdata']),
        onSubmit(value) {
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
                    alert(this.$t('S_CR_SUCCESS'));
                    this.actionSetUserdata(true);
                }
            });
        }
    }
};
</script>
