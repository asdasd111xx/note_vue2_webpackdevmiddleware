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

            if (!/^[0-9]+$/.test(value)) {
                alert(this.$text('S_JM_AGENT_INPUT_NUMBER', '仅允许输入数字'));
                return Promise.resolve('error');
            }

            return mcenter.accountDataSet({
                params: {
                    qq_num: value
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
