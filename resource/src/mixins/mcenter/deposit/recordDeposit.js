import { API_MCENTER_DEPOSIT_INPAY, API_MCENTER_DEPOSIT_RECORD, API_MCENTER_DEPOSIT_SINGLE } from '@/config/api';

import Vue from 'vue';
import ajax from '@/lib/ajax';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            recordHeader: [
                {
                    className: this.$style['record-date'],
                    value: this.$text('S_DATE', '日期'),
                    objKey: 'created_at'
                },
                {
                    className: this.$style['record-order'],
                    value: this.$text('S_ORDER_NUMBER', '订单号'),
                    objKey: 'order_number'
                },
                {
                    className: this.$style['record-application'],
                    value: this.$text('S_APPLICATION_AMOUNT', '申请金额'),
                    objKey: 'amount'
                },
                {
                    className: this.$style['record-actual'],
                    value: this.$text('S_REAL_ENTER', '实际到账'),
                    objKey: 'actual_deposit'
                },
                // {
                //     className: this.$style['record-status'],
                //     value: this.$text('S_STATUS', '状态'),
                //     objKey: 'status'
                // }
            ],
            recordData: [],
            paramsData: {
                first_result: 0,
                max_results: 8
            },
            totalRecord: 0,
            isShow: true,
            singleDeposit: {},
            paymentGroups: []
        };
    },
    computed: {
        /**
         * 所有銀行
         *
         * @return array
         */
        resultRecord() {
            return this.recordData.map((info) => ({
                ...info,
                created_at: Vue.moment(info.created_at).format('YYYY-MM-DD HH:mm:ss')
            }));
        },
        currentPage: {
            get() {
                return String((this.paramsData.first_result / 10) + 1);
            },
            set(value) {
                this.paramsData.first_result = 10 * (value - 1);
                this.getRecordData();
            }
        },
        totalPage() {
            return Math.ceil(this.totalRecord / 10);
        },
        recordText() {
            return this.$text('S_RECORD_TEXT', {
                replace: [
                    { target: '%s', value: `<span>${this.paramsData.first_result + 1}</span>` },
                    { target: '%s', value: `<span>${this.paramsData.first_result + 10}</span>` },
                    { target: '%s', value: `<span>${this.totalRecord}</span>` }
                ]
            });
        },
        requiredFields() {
            let ret = [];
            this.paymentGroups.find((payGroup) => payGroup.payment_group_content.find((content) => {
                if (content.payment_type_id === this.singleDeposit.type_id && content.payment_method_id === this.singleDeposit.method_id) {
                    ret = content.field;
                    return true;
                }
                return false;
            }));

            return ret;
        }
    },
    created() {
        this.isShow = true;
        this.actionSetIsLoading(true);
        const params = [this.getRecordData(), this.getPayGroup()];
        Promise.all(params).then(() => {
            this.isShow = false;
            this.actionSetIsLoading(false);
        });
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading'
        ]),
        /**
         * 取得8日內存款紀錄
         * @method getRecordData
         */
        getRecordData() {
            return ajax({
                method: 'get',
                url: API_MCENTER_DEPOSIT_RECORD,
                errorAlert: false,
                params: this.paramsData
            }).then((response) => {
                if (response.result === 'ok') {
                    this.recordData = response.ret;
                    this.totalRecord = response.pagination.total;
                }
            });
        },
        /**
         * 取得支付群組
         * @method getPayGroup
         */
        getPayGroup() {
            // 取得銀行群組
            return ajax({
                method: 'get',
                url: `${API_MCENTER_DEPOSIT_INPAY}?username=${this.username}`,
                errorAlert: false
            }).then((response) => {
                if (response.result === 'ok') {
                    this.paymentGroups = response.ret.payment_group;
                }
                if (response && response.result !== 'ok') {
                    this.msg = response.msg;
                }
            });
        },
        getSerialValue(info, objKey) {
            if (objKey === 'status') {
                if (info[objKey] === 'submit_data') {
                    return this.$text('S_SUBMIT_DEPOSIT', '提交存款资料');
                }

                if (info[objKey] === 'cancel') {
                    return this.$text('S_CANCEL_TEXT', '拒绝');
                }

                if (info[objKey] === 'complete') {
                    return this.$text('S_CR_SUCCESS', '成功');
                }

                return this.$text('S_PROCESSING_TEXT', '处理中');
            }

            return info[objKey];
        },
        getSingleInfo(entryId) {
            this.isShow = true;
            this.actionSetIsLoading(true);
            this.singleDeposit = {};

            ajax({
                method: 'get',
                url: `${API_MCENTER_DEPOSIT_SINGLE}/${entryId}`,
                errorAlert: false
            }).then((response) => {
                if (response.result === 'ok') {
                    this.singleDeposit = response.ret;
                }

                this.isShow = false;
                this.actionSetIsLoading(false);
            });
        }
    }
};
