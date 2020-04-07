import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';

export default {
    data() {
        return {
            verification: {
                email: true,
                phone: true
            },
            password: {
                key: 'password',
                text: 'SS_LOGIN_PW',
                status: '',
                value: '',
                btnText: '',
                btnShow: true,
                type: 'password',
                isShow: true
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
                isShow: true
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
                isShow: true
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    created() {
        member.joinConfig({
            success: (response) => {
                Object.keys(this.verification).forEach((key) => {
                    this.verification[key] = response.ret[key].code;
                    this[key].verification = this.verification[key];

                    if (key === 'phone' && !this.verification[key] && this.memInfo[key][key]) {
                        this.phone.btnShow = false;
                    }

                    if (this.verification[key] && this.memInfo[key].confirm) {
                        this[key].status = 'already';
                    }
                });
            }
        });
    },
    methods: {
        ...mapActions([
            'actionSetPop',
            'actionChangePage'
        ]),
        changePage(pageInfo, types, subPage) {
            if (!this.isBackEnd) {
                this.actionChangePage({
                    page: pageInfo,
                    type: types,
                    subPage
                });
            }
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
