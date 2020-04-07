<template>
    <div>
        <div
            v-if="data.user['has_withdraw_password']"
            class="account-pop-withdrawPwd"
        >
            <span>{{ $t('S_OLD_PWD') }}</span>
            <select
                v-for="num in 4"
                :key="`select-${num}`"
                v-model="withdrawOld[num - 1]"
                class="page-select"
            >
                <option value="">─</option>
                <option value="0">0</option>
                <option
                    v-for="number in 9"
                    :key="`option-${number}`"
                    :value="number"
                >
                    {{ number }}
                </option>
            </select>
        </div>
        <div class="account-pop-withdrawPwd">
            <span>{{ $t('S_NEW_PWD') }}</span>
            <select
                v-for="num in 4"
                :key="`select-${num}`"
                v-model="withdrawNew[num - 1]"
                class="page-select"
            >
                <option value="">─</option>
                <option value="0">0</option>
                <option
                    v-for="number in 9"
                    :key="`option-${number}`"
                    :value="number"
                >
                    {{ number }}
                </option>
            </select>
        </div>
        <div class="account-pop-btn" @click="withdrawEdit()">{{ $t('S_JM_SURE_SEND') }}</div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import mcenter from '@/api/mcenter';
import agcenter from '@/api/agcenter';

export default {
    props: {
        select: {
            type: Object,
            default: () => {}
        },
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            withdrawOld: ['', '', '', ''],
            withdrawNew: ['', '', '', '']
        };
    },
    methods: {
        withdrawEdit() {
            const pwdInfo = {
                old_password: this.withdrawOld.toString().replace(/,/g, ''),
                new_password: this.withdrawNew.toString().replace(/,/g, '')
            };
            if (pwdInfo.old_password.length > 0 && pwdInfo.old_password.length < 4) {
                alert(this.$t('S_OLD_PW_NOT_COMPLETE'));
                return;
            }
            if (pwdInfo.new_password.length < 4) {
                alert(this.$t('S_NEW_PW_NOT_COMPLETE'));
                return;
            }

            let apiSelect;
            if (this.select.position === 'member') {
                apiSelect = mcenter;
            } else {
                apiSelect = agcenter;
            }

            apiSelect.accountWdPassword({
                params: pwdInfo,
                success: () => {
                    alert(this.$t('S_EDIT_SUCCESS'));
                    this.actionSetPop();
                    if (this.select.position === 'member') {
                        this.actionSetUserdata(true);
                    } else {
                        this.actionSetAgentdata(true);
                    }
                }
            });
        },
        ...mapActions([
            'actionSetPop',
            'actionSetUserdata',
            'actionSetAgentdata'
        ])
    }
};
</script>
