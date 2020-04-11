<template>
    <div>
        <slot
            :is-fetching="isFetching"
            :show-nickname="showNickname"
            :on-toggle="onToggle"
            :on-submit="onSubmit"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import mcenter from '@/api/mcenter';
import { API_MCENTER_ENABLE_ALIAS, API_MCENTER_DISABLE_ALIAS } from '@/config/api';

export default {
    props: {
        value: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isFetching: false,
            showNickname: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    created() {
        this.showNickname = this.memInfo.user.show_alias;
        this.$emit('update:value', this.memInfo.user.alias);
    },
    methods: {
        ...mapActions(['actionSetUserdata']),
        onToggle() {
            this.showNickname = !this.showNickname;
        },
        onSubmit() {
            const result = {
                status: false,
                msg: ''
            };

            // 空值驗證
            if (this.value === '') {
                result.msg = this.$text('S_CR_NUT_NULL');
                return Promise.resolve(result);
            }

            // 驗證失敗
            if (!/^[^，:;！@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']*$/.test(this.value)) {
                result.msg = this.$text('S_NO_SYMBOL', '请勿输入特殊符号(允许空白)');
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
                    result.status = true;
                    result.msg = this.$t('S_CR_SUCCESS');
                    this.actionSetUserdata(true);
                }

                return result;
            });
        }
    }
};
</script>
