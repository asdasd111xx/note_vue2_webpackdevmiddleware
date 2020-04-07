<template>
    <div>
        <div class="account-pop-field main-input">
            <input
                v-model="selectValue"
                :placeholder="$t(select.text)"
                type="text"
                maxlength="30"
            />
        </div>
        <div class="show-field-wrap">
            <span class="field-text">{{ $text('S_NICKNAME_SHOW', '显示昵称') }}</span>
            <div class="ui fitted toggle checkbox field-checkbox">
                <input
                    v-model="currentShow"
                    :disabled="isAjax"
                    type="checkbox"
                />
                <label />
            </div>
        </div>
        <div class="account-pop-btn" @click="edit(select.key)">{{ $t('S_JM_SURE_SEND') }}</div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';
import agcenter from '@/api/agcenter';
import {
    API_MCENTER_ENABLE_ALIAS, API_MCENTER_DISABLE_ALIAS, API_AGENT_ENABLE_ALIAS, API_AGENT_DISABLE_ALIAS
} from '@/config/api';
import ajax from '@/lib/ajax';

export default {
    props: {
        select: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            selectValue: '',
            nicknameShow: false,
            isAjax: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            agentInfo: 'getAgentInfo'
        }),
        currentShow: {
            get() {
                return this.nicknameShow;
            },
            set(value) {
                this.nicknameShow = value;
                this.isShowNickname();
            }
        }
    },
    created() {
        this.nicknameShow = this.select.position === 'member' ? this.memInfo.user.show_alias : this.agentInfo.user.show_alias;
        this.selectValue = this.select.position === 'member' ? this.memInfo.user.alias : this.agentInfo.user.alias;
    },
    methods: {
        ...mapActions([
            'actionSetPop',
            'actionSetUserdata',
            'actionSetAgentdata'
        ]),
        isShowNickname() {
            this.isAjax = true;

            const apiUrl = {
                mcenter: {
                    enable: API_MCENTER_ENABLE_ALIAS,
                    disable: API_MCENTER_DISABLE_ALIAS
                },
                agcenter: {
                    enable: API_AGENT_ENABLE_ALIAS,
                    disable: API_AGENT_DISABLE_ALIAS
                }
            };

            const apiSelect = this.select.position === 'member' ? 'mcenter' : 'agcenter';
            const nicknameStatus = this.nicknameShow ? 'enable' : 'disable';

            ajax({
                method: 'put',
                url: apiUrl[apiSelect][nicknameStatus],
                errorAlert: false
            }).then(() => {
                this.isAjax = false;

                if (apiSelect === 'mcenter') {
                    this.actionSetUserdata(true);
                    return;
                }

                this.actionSetAgentdata(true);
            });
        },
        edit(key) {
            // 空值驗證
            if (this.selectValue === '') {
                alert(this.$t('S_CR_NUT_NULL'));
                return;
            }

            // 驗證失敗
            if (!/^[^，:;！@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']*$/.test(this.selectValue)) {
                alert(this.$text('S_NO_SYMBOL', '请勿输入特殊符号(允许空白)'));
                return;
            }

            let apiSelect;

            if (this.select.position === 'member') {
                apiSelect = mcenter;
            } else {
                apiSelect = agcenter;
            }

            apiSelect.accountDataSet({
                params: {
                    [key]: this.selectValue
                },
                success: () => {
                    alert(this.$t('S_CR_SUCCESS'));

                    this.actionSetPop();

                    if (this.select.position === 'member') {
                        this.actionSetUserdata(true);
                    } else {
                        this.actionSetAgentdata(true);
                    }
                }
            });
        }
    }
};
</script>
