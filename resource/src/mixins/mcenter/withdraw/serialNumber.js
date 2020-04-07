import ajax from '@/lib/ajax';
import { API_WITHDRAW_ASSIST } from '@/config/api';
import EST from '@/lib/EST';

export default {
    data() {
        return {
            serialNumberData: {},
            serialHeader: [
                {
                    className: this.$style['serial-table-number'],
                    value: this.$text('S_NUMBER_NO', '序'),
                    objKey: ''
                },
                {
                    className: this.$style['serial-table-created-at'],
                    value: this.$text('S_CREATED_TIME', '建立时间'),
                    objKey: 'confirm_at'
                },
                {
                    className: this.$style['serial-table-type'],
                    value: this.$text('S_TYPE', '类别'),
                    objKey: 'opcode'
                },
                {
                    className: this.$style['serial-table-memo'],
                    value: this.$text('S_REMARK', '备注'),
                    objKey: 'memo'
                },
                {
                    className: this.$style['serial-table-deposit'],
                    value: this.$text('S_DEPOSIT_MONEY', '存款金额'),
                    objKey: 'amount'
                },
                {
                    className: this.$style['serial-table-offer'],
                    value: this.$text('S_OFFER_MONEY', '优惠金额'),
                    objKey: 'offer'
                },
                {
                    className: this.$style['serial-table-audit'],
                    value: this.$text('S_SERIAL_AUDIT', '稽核倍数'),
                    objKey: 'audit_multiple'
                },
                {
                    className: this.$style['serial-table-claim'],
                    value: this.$text('S_SERIAL_NUMBER', '流水要求'),
                    objKey: 'total_audit_amount'
                },
                {
                    className: this.$style['serial-table-approve'],
                    value: this.$text('S_VALID_BET', '有效投注'),
                    objKey: 'effective_betting'
                },
                {
                    className: this.$style['serial-table-change'],
                    value: this.$text('S_CHECKING', '检查'),
                    objKey: 'change_serial'
                },
                {
                    className: this.$style['serial-table-deduction'],
                    value: this.$text('S_DEDUCTION_MONEY', '扣除金额'),
                    objKey: 'deduction'
                }
            ],
            nowTime: EST(new Date()),
            isShow: false
        };
    },
    created() {
        this.isShow = true;

        // 取得流水
        ajax({
            method: 'get',
            url: API_WITHDRAW_ASSIST,
            errorAlert: false
        }).then((response) => {
            if (response.result === 'ok') {
                this.serialNumberData = response;
                this.isShow = false;
            }
        });
    },
    methods: {
        /**
         * 取得流水值
         * @method getRecordData
         * @param {Object} info - 當前流水單資料
         * @param {String} objKey - key值
         * @param {Number} index - 當前索引值
         * @return string
         */
        getSerialValue(info, objKey, index) {
            if (!objKey) {
                return index + 1;
            }

            if (objKey === 'total') {
                return this.serialNumberData.total.deduction;
            }

            if (objKey === 'change_serial') {
                let depositAudit = '-';
                let promotionAudit = '-';

                if (+info.amount > 0) {
                    depositAudit = info.administrative_checked ? this.$text('S_COMPLETE', '完成') : this.$text('S_NOT_FINISH', '未完成');
                }

                if (+info.offer > 0) {
                    promotionAudit = info.offer_checked ? this.$text('S_COMPLETE', '完成') : this.$text('S_NOT_FINISH', '未完成');
                }

                return {
                    depositAudit,
                    promotionAudit
                };
            }

            return +info[objKey] === 0 ? '-' : info[objKey];
        }
    }
};
