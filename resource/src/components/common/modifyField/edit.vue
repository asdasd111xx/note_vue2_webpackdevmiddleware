<template>
    <div class="account-pop-field">
        <input
            v-model="selectValue"
            :placeholder="$t(select.text)"
            type="text"
            @input="verification(select.key)"
        />
        <div class="account-pop-btn" @click="edit(select.key)">{{ $t('S_JM_SURE_SEND') }}</div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import datepickerLang from '@/lib/datepicker_lang';
import mcenter from '@/api/mcenter';
import agcenter from '@/api/agcenter';
import exceptionList from '@/config/exceptionList';

export default {
    props: {
        select: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            ageLimit: new Date(Vue.moment(new Date()).add(-18, 'year')),
            dateLang: datepickerLang(this.$i18n.locale),
            selectValue: ''
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        }),
        // 日本站特例判斷
        isException() {
            const { wonderCasino, knightCasino } = exceptionList;
            return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
        }
    },
    methods: {
        verification(key) {
            // 個人姓名限制輸入上限30字元
            if (key === 'name' && this.selectValue.length > 30) {
                this.selectValue = this.selectValue.substring(0, 30);
            }
            // 合營連結限制輸入上限36字元
            if (key === 'outLink' && this.selectValue.length > 36) {
                this.selectValue = this.selectValue.substring(0, 36);
            }
        },
        edit(key) {
            // 空值驗證
            if (this.selectValue === '') {
                alert(this.$t('S_CR_NUT_NULL'));
                return;
            }

            if (key === 'memUsername') {
                agcenter.accountMemUsernameSet({
                    params: {
                        username: this.selectValue
                    },
                    success: () => {
                        alert(this.$t('S_CR_SUCCESS'));
                        this.actionSetPop();
                        this.actionSetAgcenterMemUsername();
                    }
                });
                return;
            }

            if (key === 'outLink') {
                agcenter.accountLinkSet({
                    params: {
                        url: this.selectValue
                    },
                    success: () => {
                        alert(this.$t('S_CR_SUCCESS'));
                        this.actionSetPop();
                        this.actionSetAgcenterLinks();
                    }
                });
                return;
            }

            let re = '';
            let msg = '';

            // 姓名規則驗證
            if (key === 'name') {
                re = /^[^0-9，:;！@#$%^&*?<>()+=`|[\]{}\\"/.\s~\-_']*$/;
                msg = this.$text('S_NO_SYMBOL_DIGIT_CHEN', '请勿输入数字、空白及特殊符号');
                if (this.isException && this.select.position === 'member') {
                    re = /^[a-zA-Z\- ]*$/;
                    msg = this.$text('S_ONLY_TYPE_ENGLISH_DASH_SPACE', {
                        text: '只能输入英文大小写、"-"、空白键',
                        replace: [{
                            target: '%s', value: '<br/>'
                        }]
                    });
                }
            }
            // qq規則驗證
            if (key === 'qq_num') {
                re = /^[0-9]+$/;
                msg = this.$text('S_JM_AGENT_INPUT_NUMBER', '仅允许输入数字');
            }

            // 驗證失敗
            if ((re && !re.test(this.selectValue))) {
                alert(msg);
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
                    [key]: this.select.key === 'birthday' ? Vue.moment(this.selectValue).format() : this.selectValue
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
        },
        ...mapActions([
            'actionSetPop',
            'actionSetUserdata',
            'actionSetAgentdata',
            'actionSetAgcenterMemUsername',
            'actionSetAgcenterLinks'
        ])
    }
};
</script>
