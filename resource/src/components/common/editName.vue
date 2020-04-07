<template>
    <div>
        <slot :on-submit="onSubmit" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';
import exceptionList from '@/config/exceptionList';

export default {
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo'
        }),
        // 日本站特例判斷
        isException() {
            const { wonderCasino, knightCasino } = exceptionList;
            return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
        },
        // 越南盾特例
        isVND() {
            return this.memInfo.cash.currency.includes('VND');
        }
    },
    methods: {
        ...mapActions(['actionSetUserdata']),
        onSubmit(value) {
            // 空值驗證
            if (value === '') {
                alert(this.$t('S_CR_NUT_NULL'));
                return Promise.resolve('error');
            }

            let re = /^[^0-9，:;！@#$%^&*?<>()+=`|[\]{}\\"/.\s~\-_']*$/;
            let msg = this.$text('S_NO_SYMBOL_DIGIT_CHEN', '请勿输入数字、空白及特殊符号');

            if (this.isException) {
                re = /^[a-zA-Z\- ]*$/;
                msg = this.$text('S_ONLY_TYPE_ENGLISH_DASH_SPACE', {
                    text: '只能输入英文大小写、"-"、空白键',
                    replace: [{
                        target: '%s', value: '<br/>'
                    }]
                });
            }

            if (this.isVND) {
                re = /^[^,:;!@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']+$/;
                msg = this.$text('S_NO_SYMBOL', '请勿输入特殊符号(允许空白)');
            }

            if (!re.test(value)) {
                alert(msg);
                return Promise.resolve('error');
            }

            return mcenter.accountDataSet({
                params: {
                    name: value
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
