import { mapActions, mapGetters } from 'vuex';

import { ModelSelect } from 'vue-search-select';
import mcenter from '@/api/mcenter';

export default {
    components: {
        ModelSelect
    },
    data() {
        return {
            isAutotransfer: false,
            timer: null,
            btnLock: false,
            balanceBackLock: false,
            recentlyData: {},
            tranOut: '',
            tranIn: '',
            money: ''
        };
    },
    created() {
        this.getBalanceAll();
        this.getRecentlyOpened();
        this.isAutotransfer = this.memInfo.auto_transfer.enable;
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            membalance: 'getMemBalance'
        }),
        /**
         * 組轉出列表
         *
         * @return array
         */
        transOut() {
            const list = [{ value: '', text: this.$t('S_SELECT_ACCOUNT') }];
            // 轉出列表只塞有額度的平台（額度需>=1，只有小數位不允許轉）
            // 維護時不可轉出
            Object.keys(this.membalance.vendor).forEach((index) => {
                if (this.membalance.vendor[index].amount !== '--'
                    && +this.membalance.vendor[index].amount >= 1
                    && !this.membalance.vendor[index].maintain
                ) {
                    list.push({ value: index, text: this.membalance.vendor[index].text });
                }
            });
            return list;
        },
        /**
         * 組轉入列表
         *
         * @return array
         */
        transIn() {
            const list = [{ value: '', text: this.$t('S_SELECT_ACCOUNT') }];
            // 維護時不可轉入
            Object.keys(this.membalance.vendor).forEach((index) => {
                if (!this.membalance.vendor[index].maintain) {
                    list.push({ value: index, text: this.membalance.vendor[index].text });
                }
            });
            return list;
        },
        balanceInfo() {
            const data = {};

            Object.keys(this.membalance.vendor).forEach((key) => {
                if (key === 'default') {
                    return;
                }

                data[key] = this.membalance.vendor[key];
            });

            return data;
        },
        tipText() {
            return this.$text('S_AUTO_SWITCH', {
                text: '切换为【自动转换】模式重新开启游戏平台，系统会自动将主帐户余额转入正在进行中的游戏 (包含新入款成功)。',
                replace: [
                    { target: '%s', value: '<br/>' },
                    { target: '%s', value: '<br/>' }
                ]
            });
        }
    },
    methods: {
        ...mapActions([
            'actionSetUserBalance',
            'actionSetUserdata'
        ]),
        enableAutotransfer() {
            if (this.isAutotransfer || this.AutotransferLock) {
                return;
            }
            this.AutotransferLock = true;
            mcenter.balanceTranAutoEnable({
                success: () => {
                    alert(this.$t('S_SWITCH_AUTO_TRANSFER'));
                    this.isAutotransfer = true;
                    this.backAccount();
                    this.actionSetUserdata(true);

                    this.AutotransferLock = false;
                },
                fail: () => {
                    this.AutotransferLock = false;
                }
            });

            this.getRecentlyOpened();
        },
        balanceBack() {
            // 阻擋連續點擊
            if (this.balanceBackLock) {
                return;
            }
            if (window.confirm(this.$t('S_INTEGER_BACK_ACCOUNT_CONFIRM'))) {
                this.balanceBackLock = true;
                this.backAccount();
            }
        },
        closeAutotransfer() {
            if (!this.isAutotransfer || this.AutotransferLock) {
                return;
            }
            this.AutotransferLock = true;
            mcenter.balanceTranAutoClose({
                success: () => {
                    alert(this.$t('S_SWITCH_SUCCESS'));
                    this.isAutotransfer = false;
                    this.actionSetUserdata(true);

                    this.AutotransferLock = false;
                },
                fail: () => {
                    this.AutotransferLock = false;
                }
            });
        },
        backAccount() {
            mcenter.balanceTranBack({
                success: () => {
                    this.lockSec = 0;
                    this.actionSetUserBalance();
                    this.balanceBackLock = false;
                },
                fail: () => {
                    this.balanceBackLock = false;
                }
            });
        },
        getBalanceAll(status) {
            if (status === 'lockStatus' && this.balanceLock) {
                return;
            }

            this.balanceLock = true;
            this.actionSetUserBalance().then(() => {
                this.timer = setInterval(() => {
                    if (this.lockSec >= 15) {
                        clearInterval(this.timer);
                        this.lockSec = 0;
                        this.balanceLock = false;
                        return;
                    }
                    this.lockSec += 1;
                }, 1000);
            });
        },
        getRecentlyOpened() {
            mcenter.lastVendor({
                success: (response) => {
                    this.recentlyData = response.ret;
                }
            });
        },
        balanceTran() {
            // 阻擋連續點擊
            if (this.btnLock) {
                return;
            }

            const re = /^[1-9]*[1-9][0-9]*$/;
            const source = this.tranOut;
            const target = this.tranIn;
            const { money } = this;

            if (+source === 0 || +target === 0) {
                alert(this.$t('S_SELECT_ACCOUNT'));
                return;
            }
            if (money === '') {
                alert(this.$t('S_AMOUNT_NULL_VALUE'));
                return;
            }
            if (!re.test(money)) {
                alert(this.$t('S_DAW_ONLY_INT'));
                return;
            }

            this.btnLock = true;

            mcenter.balanceTran({
                params: {
                    amount: money
                },
                success: () => {
                    alert(this.$t('S_CR_SUCCESS'));

                    this.lockSec = 0;
                    this.balanceBackLock = false;
                    this.actionSetUserBalance();

                    this.tranIn = 0;
                    this.tranOut = 0;
                    this.money = '';
                }
            }, source, target).then(() => {
                this.btnLock = false;
            });
        }
    }
};
