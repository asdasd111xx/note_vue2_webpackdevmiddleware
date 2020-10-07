import { API_WITHDRAW_ASSIST } from '@/config/api';
import EST from '@/lib/EST';
import ajax from '@/lib/ajax';

export default {
    data() {
        return {
            serialNumberData: {},
            serialHeader: [
                {
                    value: this.$text('S_NUMBER_NO', '序'),
                    objKey: ''
                },
                {
                    value: this.$text('S_CREATED_TIME', '建立时间'),
                    objKey: 'confirm_at'
                },
                {
                    value: this.$text('S_TYPE', '类别'),
                    objKey: 'opcode'
                },
                {
                    value: this.$text('S_REMARK', '备注'),
                    objKey: 'memo'
                },
                {
                    value: this.$text('S_DEPOSIT_MONEY', '存款金额'),
                    objKey: 'amount'
                },
                {
                    value: this.$text('S_OFFER_MONEY', '优惠金额'),
                    objKey: 'offer'
                },
                {
                    value: this.$text('S_SERIAL_AUDIT', '稽核倍数'),
                    objKey: 'audit_multiple'
                },
                {
                    value: this.$text('S_SERIAL_NUMBER', '流水要求'),
                    objKey: 'total_audit_amount'
                },
                {
                    value: this.$text('S_VALID_BET', '有效投注'),
                    objKey: 'effective_betting'
                },
                {
                    value: this.$text('S_CHECKING', '检查'),
                    objKey: 'change_serial'
                },
                {
                    value: this.$text('S_DEDUCTION_MONEY', '扣除金额'),
                    objKey: 'deduction'
                }
            ],
            nowTime: EST(new Date()),
        };
    },
    methods: {
        getNowTime() {
          return EST(new Date());
        },
        // 轉換扣除金額
        getDeductionNumber(number) {
            return Number(number).toFixed(2);
            // return Number(_n) > 0 ? `-${_n}` : _n;
        },
        // 取得流水
        getSerialNumberData() {
            ajax({
                method: 'get',
                url: API_WITHDRAW_ASSIST,
                errorAlert: false
            }).then((response) => {
                if (response.result === 'ok') {
                    this.serialNumberData = response;
                }
            });
        },
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
