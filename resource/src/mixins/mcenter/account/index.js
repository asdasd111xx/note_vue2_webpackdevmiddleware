import { mapGetters, mapActions } from 'vuex';
import exceptionList from '@/config/exceptionList';
import ajax from '@/lib/ajax';
import { API_MCENTER_USER_CONFIG } from '@/config/api';

export default {
    data() {
        return {
            mcenterUserField: {},
            isReady: false,
            lang: this.$i18n.locale,
            verification: {
                email: true,
                phone: true
            },
            dataList: [
                {
                    text: 'S_REAL_NAME_CONFIRM',
                    field: {
                        name: {
                            key: 'name',
                            text: 'S_PERSONAL_NAME',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'edit',
                            isShow: true,
                            popTitle: ''
                        },
                        alias: {
                            key: 'alias',
                            text: 'S_ALIAS',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'alias',
                            isShow: true,
                            popTitle: 'S_ALIAS'
                        },
                        email: {
                            key: 'email',
                            text: 'SS_E_MAIL',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'bind',
                            verification: true,
                            isShow: true,
                            popTitle: ''
                        },
                        phone: {
                            key: 'phone',
                            text: 'S_TEL',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'bind',
                            verification: true,
                            isShow: true,
                            popTitle: ''
                        },
                        password: {
                            key: 'password',
                            text: 'SS_LOGIN_PW',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'password',
                            isShow: true,
                            popTitle: ''
                        },
                        withdrawPwd: {
                            key: 'withdrawPwd',
                            text: 'S_DAW_DRWAL_PASSWORD',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'withdrawPwd',
                            isShow: false,
                            popTitle: ''
                        }
                    }
                },
                {
                    text: 'S_PERSONAL_DATA',
                    field: {
                        birthday: {
                            key: 'birthday',
                            text: 'S_BIRTHDAY_DATE',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'edit',
                            isShow: true,
                            popTitle: ''
                        },
                        gender: {
                            key: 'gender',
                            text: 'S_GENDER',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'edit',
                            isShow: true,
                            popTitle: ''
                        },
                        qq_num: {
                            key: 'qq_num',
                            text: 'S_QQ',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'edit',
                            isShow: false,
                            popTitle: ''
                        },
                        weixin: {
                            key: 'weixin',
                            text: 'WECHAT',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'edit',
                            isShow: false,
                            popTitle: ''
                        },
                        line: {
                            key: 'line',
                            text: 'S_LINE',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'edit',
                            isShow: false,
                            popTitle: ''
                        },
                        facebook: {
                            key: 'facebook',
                            text: 'S_FACEBOOK',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'edit',
                            isShow: false,
                            popTitle: ''
                        },
                        skype: {
                            key: 'skype',
                            text: 'S_SKYPE',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'edit',
                            isShow: false,
                            popTitle: ''
                        },
                        zalo: {
                            key: 'zalo',
                            text: 'S_ZALO',
                            status: '',
                            value: '',
                            btnText: '',
                            btnShow: true,
                            type: 'edit',
                            isShow: false,
                            popTitle: ''
                        }
                        // currency: {
                        //  key: '// currency',
                        //  text: 'S_CURRENCY',
                        //  status: '',
                        //  value: '',
                        //  btnText: '',
                        //  btnShow: true,
                        //  type: '',
                        //  isShow: true
                        // },
                    }
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo'
        }),
        // 過濾特例的資料
        filteredDataList() {
            return this.dataList.map((item) => ({
                ...item,
                field: Object.keys(item.field)
                    .filter((subItem) => item.field[subItem].isShow)
                    .reduce((obj, key) => ({
                        ...obj,
                        [key]: item.field[key]
                    }), {})
            }));
        },
        // 特例判斷
        isException() {
            const { wonderCasino, knightCasino } = exceptionList;
            return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
        }
    },
    watch: {
        memInfo() {
            ajax({
                method: 'get',
                url: API_MCENTER_USER_CONFIG,
                errorAlert: false
            }).then((response) => {
                if (!response || response.result !== 'ok') {
                    this.setData(this.mcenterUserField);
                    return;
                }

                this.mcenterUserField = response.ret;
                this.setData(response.ret);
            });
        },
        lang() {
            this.setData(this.mcenterUserField);
        }
    },
    created() {
        ajax({
            method: 'get',
            url: API_MCENTER_USER_CONFIG,
            errorAlert: false
        }).then((response) => {
            if (response && response.result === 'ok') {
                Object.keys(this.verification).forEach((key) => {
                    this.verification[key] = response.ret.config[key].code;
                });

                this.mcenterUserField = response.ret;
                this.setData(response.ret);
            }

            this.isReady = true;
        });
    },
    beforeUpdate() {
        this.lang = this.$i18n.locale;
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ]),
        setData(userConfig = {}) {
            if (Object.keys(userConfig).length === 0) {
                return;
            }

            Object.keys(this.dataList).forEach((item) => {
                Object.keys(this.dataList[item].field).forEach((key) => {
                    let itemNow = this.dataList[item].field[key];

                    if (key === 'password') {
                        itemNow = {
                            ...itemNow,
                            status: 'already',
                            value: this.$t('S_SET_CL_ALREADY'),
                            btnText: this.$t('S_CS_EDIT')
                        };
                    } else if (key === 'withdrawPwd') {
                        const wdStatus = this.memInfo.user.has_withdraw_password;
                        itemNow = {
                            ...itemNow,
                            status: wdStatus ? 'already' : 'yet',
                            value: wdStatus ? this.$t('S_SET_CL_ALREADY') : this.$t('S_YET_SET'),
                            btnText: wdStatus ? this.$t('S_CS_EDIT') : this.$t('S_SET_CL'),
                            isShow: userConfig.config.withdraw_password.display
                        };
                    } else if (key === 'email' || key === 'phone') {
                        const keyValue = this.memInfo[key][key];

                        let val = this.$t('S_YET_SET');
                        let text = this.$t('S_SET_CL');
                        let confirmSt = 'yet';

                        if (keyValue) {
                            val = `${this.$t('S_YET_VERIFIED')}(${keyValue})`;
                            text = this.$t('S_VERIFY');
                            confirmSt = 'ok';
                            if (!this.verification[key] || userConfig.user[key]) {
                                val = keyValue;
                                text = this.$t('S_CS_EDIT');
                                confirmSt = 'already';
                            }
                        }
                        itemNow = {
                            ...itemNow,
                            status: confirmSt,
                            value: val,
                            btnText: text,
                            btnShow: !(!this.verification[key] && keyValue),
                            verification: this.verification[key],
                            isShow: userConfig.config[key].display
                        };
                    } else if (key === 'alias' && userConfig.config[key]) {
                        itemNow = {
                            ...itemNow,
                            status: this.memInfo.user[key] ? 'already' : 'yet',
                            value: this.memInfo.user[key] || this.$t('S_YET_SET'),
                            btnText: this.$t('S_CS_EDIT'),
                            btnShow: true,
                            isShow: userConfig.config[key].display
                        };
                    } else {
                        const keyValue = this.memInfo.user[key];
                        let checkValue = keyValue;
                        if (keyValue) {
                            if (key === 'name') {
                                checkValue = this.$t('S_SET_CL_ALREADY');
                            }
                            if (key === 'gender') {
                                checkValue = this.$t('S_MALE');
                                if (+keyValue === 2) {
                                    checkValue = this.$t('S_FEMALE');
                                }
                            }
                        }
                        itemNow = {
                            ...itemNow,
                            status: keyValue ? 'already' : 'yet',
                            btnText: keyValue ? this.$t('S_CS_EDIT') : this.$t('S_SET_CL'),
                            value: keyValue ? checkValue : this.$t('S_YET_SET'),
                            btnShow: !keyValue,
                            isShow: userConfig.config[key] ? userConfig.config[key].display : false
                        };
                    }
                    this.dataList[item].field[key] = itemNow;
                });
            });
        },
        popWindow(selectData) {
            window.scrollTo(0, 0);
            const data = {
                ...selectData,
                position: 'member'
            };
            this.actionSetPop({ type: 'account', data });
        }
    }
};
