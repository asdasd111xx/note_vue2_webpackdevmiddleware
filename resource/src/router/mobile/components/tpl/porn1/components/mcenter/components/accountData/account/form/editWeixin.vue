<template>
    <div>
        <slot :on-submit="onSubmit" />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
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
                    weixin: value
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
