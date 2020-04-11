<template>
    <div>
        <slot :on-submit="onSubmit" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        })
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
                    skype: value
                },
                success: () => {
                    alert(this.$t('S_CR_SUCCESS'));
                    this.$emit('cancel');
                    this.actionSetUserdata(true);
                }
            });
        }
    }
};
</script>
