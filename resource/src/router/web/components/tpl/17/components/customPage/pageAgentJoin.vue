<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['join-wrap']">
            <div :class="$style['img-wrap']">
                <img :src="$getCdnPath('/static/image/tpl/17/customPage/join/text.png')" />
            </div>
            <div :class="$style['img-wrap']">
                <img :src="$getCdnPath('/static/image/tpl/17/customPage/logo.png')" />
            </div>
            <div :class="$style['form-wrap']">
                <join-agent :has-title="false" :theme="$style" />
                <div :class="$style['join-text']">
                    已经有帐号? 请
                    <span @click="changePage({ page: webInfo.alias === '500000' ? '32423' : webInfo.alias === '48' ? '10490' : '10523' })">{{ $text('S_LOGON', '登录') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';
import appEvent from '@/lib/appEvent';
import common from '@/api/common';
import agent from '@/api/agent';
import joinAgentInfo from '@/config/joinAgentInfo';
import joinAgent from '../../../../page/join_agent';

export default {
    components: {
        joinAgent
    },
    props: {
        changePage: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            joinAgentInfo,
            captchaImg: '',
            allValue: {
                username: '',
                password: '',
                confirm_password: '',
                name: '',
                email: '',
                phone: '',
                gender: 0,
                qq_num: '',
                weixin: '',
                line: '',
                withdraw_password: '',
                // currency: '',
                captcha_text: ''
            },
            allTip: {
                username: '',
                password: '',
                confirm_password: '',
                name: '',
                email: '',
                phone: '',
                gender: '',
                qq_num: '',
                weixin: '',
                line: '',
                withdraw_password: '',
                // currency: '',
                captcha_text: ''
            },
            selectData: {
                gender: {
                    options: [
                        { label: this.$i18n.t('S_SELECTED'), value: '0' },
                        { label: this.$i18n.t('S_MALE'), value: '1' },
                        { label: this.$i18n.t('S_FEMALE'), value: '2' }
                    ],
                    selected: { label: this.$i18n.t('S_SELECTED'), value: '' }
                },
                withdraw_password: [
                    { options: [{ label: '-', value: '' }], selected: { label: '-', value: '' } },
                    { options: [{ label: '-', value: '' }], selected: { label: '-', value: '' } },
                    { options: [{ label: '-', value: '' }], selected: { label: '-', value: '' } },
                    { options: [{ label: '-', value: '' }], selected: { label: '-', value: '' } }
                ]
            },
            checkFail: false,
            registerData: [],
            withdraw_passwordStatus: false
        };
    },
    computed: {
        ...mapGetters({
            isWebview: 'getIsWebview',
            memInfo: 'getMemInfo',
            loginStatus: 'getLoginStatus',
            siteConfig: 'getSiteConfig',
            webInfo: 'getWebInfo'
        }),
        fieldsData() {
            return this.registerData.filter((field) => this.joinAgentInfo[field.key] && this.joinAgentInfo[field.key].show);
        }
    },
    created() {
        let joinConfig = [];
        let joinReminder = {};
        const username = {
            key: 'username',
            content: {
                note1: '',
                note2: ''
            }
        };
        const password = {
            key: 'password',
            content: {
                note1: '',
                note2: ''
            }
        };
        const confirmPassword = {
            key: 'confirm_password',
            content: {
                note1: '',
                note2: ''
            }
        };
        const currency = {
            key: 'currency',
            content: {
                note1: this.memInfo.cash.currency
            }
        };
        const captchaText = {
            key: 'captcha_text',
            content: {
                note1: '',
                note2: ''
            }
        };

        agent.joinConfig({
            success: (response) => {
                const apiData = response.ret;

                Object.keys(this.joinAgentInfo).forEach((item) => {
                    if (apiData[item]) {
                        this.joinAgentInfo[item].isRequired = apiData[item].required;
                        this.joinAgentInfo[item].show = !apiData[item].none;

                        joinConfig = [
                            ...joinConfig,
                            {
                                key: item,
                                content: {
                                    note1: '',
                                    note2: ''
                                }
                            }
                        ];
                    }
                });
            }
        }).then(() => {
            const preview = this.$route.name === 'preview' ? 'View' : '';
            const status = this.$cookie.get('newsite') ? 'New' : '';

            ajax({
                method: 'get',
                url: `/tpl/${this.memInfo.user.domain}/agentRegister${preview}${status}.json`,
                params: {
                    v: Date.parse(new Date())
                },
                success: (response) => {
                    response.data.forEach((item) => {
                        Object.keys(item).forEach((key) => {
                            const content = JSON.parse(item[key][this.$i18n.locale]);

                            joinReminder = {
                                ...joinReminder,
                                [key]: {
                                    note1: content.note1 || '',
                                    note2: content.note2 || ''
                                }
                            };

                            if (key === 'gender' && joinReminder[key].note1) {
                                this.selectData.gender.options[0].label = joinReminder[key].note1;
                                this.selectData.gender.selected.label = joinReminder[key].note1;
                            }
                        });
                    });

                    joinConfig.map((item) => {
                        const info = item;
                        info.content = {
                            ...item.content,
                            ...joinReminder[item.key]
                        };

                        return info;
                    });
                }
            }).then(() => {
                this.registerData = [username, password, confirmPassword, currency, ...joinConfig, captchaText];
            });
        });

        // 補取款密碼options
        for (let index = 0; index < 10; index += 1) {
            const tmp = { label: index.toString(), value: index };
            for (let i = 0; i < 4; i += 1) {
                this.selectData.withdraw_password[i].options.push(tmp);
            }
        }
    },
    methods: {
        getCaptcha() {
            common.captcha({
                success: (response) => {
                    this.captchaImg = response.ret;
                }
            });
        },
        changSelect(key) {
            if (this.selectData[key].selected && !this.selectData[key].selected.value) {
                this.allValue[key] = '0';
                return;
            }

            this.allValue[key] = this.selectData[key].selected ? this.selectData[key].selected.value : '0';
            this.verification(key);
        },
        changWithdrawPassword(key, num) {
            this.allValue[key] = '';
            Object.keys(this.selectData.withdraw_password).forEach((index) => {
                if (this.selectData.withdraw_password[index].selected) {
                    this.allValue[key] += this.selectData.withdraw_password[index].selected.value;
                }
            });

            if (!this.withdraw_passwordStatus) {
                if (num === 4) {
                    this.withdraw_passwordStatus = true;
                }
                return;
            }

            // 驗證輸入值
            this.verification(key);
        },
        verification(key) {
            const data = this.joinAgentInfo[key];

            if (key === 'name' && this.allValue[key].length > 30) {
                this.allValue[key] = this.allValue[key].substring(0, 30);
                return;
            }

            //  非必填欄位，空值不做驗證
            if (!data.isRequired && this.allValue[key] === '') {
                this.allTip[key] = '';
                return;
            }

            if (key === 'withdraw_password' && this.allValue.withdraw_password.length < 4 && data.isRequired) {
                this.allTip[key] = `✘ ${this.$t('S_JM_MSG_COMPLETE')}`;
                return;
            }

            if ((key === 'gender' && this.allValue.gender === '0' && data.isRequired)) {
                this.allTip[key] = `✘ ${this.$t('S_JM_FIELD_REQUIRE')}`;
                return;
            }

            if (data.isRequired && this.allValue[key] === '') {
                this.allTip[key] = `✘  ${this.$t('S_JM_FIELD_REQUIRE')}`;
                return;
            }

            if (key === 'password' || key === 'confirm_password') {
                if (this.allValue.confirm_password !== '' && this.allValue.password !== this.allValue.confirm_password) {
                    this.allTip.confirm_password = `✘  ${this.$text('S_PASSWD_CONFIRM_ERROR', '确认密码预设要跟密码一致')}`;
                } else {
                    this.allTip.confirm_password = '';
                }
            }

            const re = (data.regExp ? data.regExp : '');
            const msg = data.errorMsg;

            if ((re && !re.test(this.allValue[key]))
                || (key === 'confirm_password' && this.allValue.password !== this.allValue.confirm_password)
                || (data.minimum && this.allValue[key].length < data.minimum)
                || (data.maximum && this.allValue[key].length > data.maximum)
            ) {
                this.allTip[key] = `✘ ${msg}`;
                if (data.isRequired && this.allValue[key] === '') {
                    this.allTip[key] = `✘  ${this.$t('S_JM_FIELD_REQUIRE')}`;
                }
                return;
            }

            this.allTip[key] = '';
        },
        joinSubmit() {
            this.checkFail = false;

            Object.keys(this.allTip).forEach((index) => {
                // 提示訊息不為空
                // 或 取款密碼只填1~3碼
                // 或 欄位為必填（且input為空、input取代空白為空、姓名未選擇、取款密碼輸入不完整）
                if (this.allTip[index]
                || (this.allValue.withdraw_password.length < 0 && this.allValue.withdraw_password.length < 4)
                || (this.joinAgentInfo[index].isRequired
                    && (!this.allValue[index]
                    || ((this.joinAgentInfo[index].type !== 'select') && this.allValue[index].replace(/(^\s*)|(\s*$)/g, '') === '')
                    || (index === 'gender' && +this.allValue[index] === 0)
                    || (index === 'withdraw_password' && this.allValue.withdraw_password.length < 4)
                    )
                )
                ) {
                    this.checkFail = true;
                }
            });

            if (this.checkFail) {
                alert(this.$t('S_JM_MSG_COMPLETE'));
                return;
            }

            const joinInfo = this.allValue;
            joinInfo.withdraw_password = this.allValue.withdraw_password;

            agent.join({
                params: joinInfo,
                success: () => {
                    alert(this.$text('S_CR_SUCCESS_AND_LOGIN', '成功'));

                    // GA流量統計
                    window.dataLayer.push({
                        dep: 2,
                        event: 'ga_click',
                        eventCategory: 'sign_up',
                        eventAction: 'sign_up',
                        eventLabel: 'sign_up',
                        ga_hall_id: 3820325,
                        ga_domain_id: this.memInfo.user.domain
                    });

                    if (this.isWebview) {
                        appEvent.jsToAppMessage('AGENT_REGIST_SUCCESS');
                        return;
                    }
                    if (this.$route.path.split('/').filter((path) => path)[0] === 'mobile') {
                        this.$router.push('/mobile/agcenter');
                        return;
                    }
                    window.location.href = '/agent';
                },
                fail: (response) => {
                    this.allValue.captcha_text = '';

                    if (response.data.errors) {
                        Object.keys(response.data.errors).forEach((msg) => {
                            this.allTip[msg] = response.data.errors[msg];
                        });
                    }
                }
            });
        },
        triggerFocus(field) {
            if (this.$refs[`field-${field}`]) {
                this.$refs[`field-${field}`][0].focus();
            }
        }
    }
};
</script>

<style lang="scss" src="./css/pageAgentJoin.module.scss" module></style>
