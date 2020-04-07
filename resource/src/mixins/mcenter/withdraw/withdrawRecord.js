import Vue from 'vue';
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';
import { API_WITHDRAW_RECORD } from '@/config/api';

export default {
    data() {
        return {
            recordData: [],
            paramsData: {
                first_result: 0,
                max_results: 10
            },
            totalRecord: 0,
            isShow: true,
            currentBookmark: 'apply',
            editOpen: false,
            withdrawData: {}
        };
    },
    computed: {
        ...mapGetters({
            mobileCheck: 'getMobileCheck',
            memInfo: 'getMemInfo',
            noticeData: 'getNoticeData'
        }),
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
        recordText() {
            return this.$text('S_RECORD_TEXT', {
                replace: [
                    { target: '%s', value: `<span>${this.paramsData.first_result + 1}</span>` },
                    { target: '%s', value: `<span>${this.paramsData.first_result + 10}</span>` },
                    { target: '%s', value: `<span>${this.totalRecord}</span>` }
                ]
            });
        },
        resultTypeRecord() {
            return {
                apply: this.resultRecord.filter((info) => info.status === 'finished' || info.locked),
                notFinish: this.resultRecord.filter((info) => info.process && !info.locked)
            };
        },
        recordHeader() {
            const initialData = [
                {
                    className: this.$style['record-date'],
                    value: this.$text('S_DATE', '日期'),
                    objKey: 'at',
                    showField: true
                },
                {
                    className: this.$style['record-order'],
                    value: this.$text('S_ORDER_NUMBER', '订单号'),
                    objKey: 'id',
                    showField: true
                },
                {
                    className: this.$style['record-withdraw'],
                    value: this.$text('S_WITHDRAW_MONEY', '取款金额'),
                    objKey: 'amount',
                    showField: true
                },
                {
                    className: this.$style['record-deduction'],
                    value: this.$text('S_DEDUCTION_MONEY', '扣除金额'),
                    objKey: 'deduction',
                    showField: !this.memInfo.config.internal_audit
                },
                {
                    className: this.$style['record-actual'],
                    value: this.$text('S_REAL_WITHDRAW', '实际出款'),
                    objKey: 'real_amount',
                    showField: !this.memInfo.config.internal_audit
                },
                {
                    className: this.$style['record-status'],
                    value: this.$text('S_STATUS', '状态'),
                    objKey: 'status',
                    showField: true
                }
            ];

            return initialData.filter((info) => info.showField);
        }
    },
    created() {
        this.getRecordData();
    },
    methods: {
        /**
         * 取得近10筆取款紀錄
         * @method getRecordData
         */
        getRecordData() {
            this.isShow = true;

            ajax({
                method: 'get',
                url: API_WITHDRAW_RECORD,
                errorAlert: false,
                params: this.paramsData
            }).then((response) => {
                if (response.result === 'ok') {
                    this.recordData = response.ret;
                    this.totalRecord = response.pagination.total;
                }

                this.isShow = false;
            });
        },
        getCurrentText(info, objKey) {
            if (objKey === 'status') {
                if (info[objKey] === 'processing') {
                    return this.$text('S_PROCESSING_TEXT', '处理中');
                }

                if (info[objKey] === 'cancel') {
                    return this.$text('S_CANCEL', '取消');
                }

                if (info[objKey] === 'reject') {
                    return this.$text('S_CANCEL_TEXT', '拒绝');
                }

                return this.$text('S_CR_SUCCESS', '成功');
            }

            return info[objKey];
        },
        changeType(type) {
            this.currentBookmark = type;
        },
        openEditWithdraw(showEdit, info) {
            this.editOpen = showEdit;
            this.withdrawData = info;
            this.getRecordData();
        }
    }
};
