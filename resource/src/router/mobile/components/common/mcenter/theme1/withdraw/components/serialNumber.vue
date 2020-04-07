<template>
    <transition :name="'fade'">
        <div v-if="!isShow" :class="[$style['serial-number-wrap'], colorClass]">
            <div :class="[$style['basic-info-wrap'], 'clearfix']">
                <span :class="$style['basic-title']">{{ $text('S_CHECK_TIME', '检查时间') }}：{{ nowTime }}</span>
                <div :class="[$style['serial-related-wrap'], 'clearfix']">
                    <div :class="[$style['serial-info-item'], 'clearfix']">
                        <span :class="$style['info-title']">{{ $text('S_SERIAL_CHANGE', '流水要求') }}</span>
                        <span :class="$style['info-text']">{{ serialNumberData.total.audit_amount }}</span>
                    </div>
                    <div :class="[$style['serial-info-item'], 'clearfix']">
                        <span :class="$style['info-title']">{{ $text('S_SERIAL_POOR', '流水不足') }}</span>
                        <span :class="$style['info-text']">{{ serialNumberData.total.audit_amount_lack }}</span>
                    </div>
                    <div :class="[$style['serial-info-item'], 'clearfix']">
                        <span :class="$style['info-title']">{{ $text('S_DEDUCTION_MONEY', '扣除金额') }}</span>
                        <span :class="$style['info-text']">{{ serialNumberData.total.deduction }}</span>
                    </div>
                    <div :class="[$style['serial-info-item'], 'clearfix']">
                        <span :class="$style['info-title']">{{ $text('S_FEE', '手续费') }}</span>
                        <span :class="$style['info-text']">{{ serialNumberData.total.fee }}</span>
                    </div>
                    <div :class="[$style['serial-info-item'], 'clearfix']">
                        <span :class="$style['info-title']">{{ $text('S_SERIAL_TOTAL', '合计') }}</span>
                        <span :class="$style['info-text']">{{ serialNumberData.total.total_deduction }}</span>
                    </div>
                </div>
            </div>
            <div :class="[$style['serial-btn-wrap'], 'clearfix']">
                <div
                    v-if="serialNumberData.ret.length > 0"
                    :class="$style['serial-open-btn']"
                    @click.stop="changeDataOpen(isInfoExpand.length === serialNumberData.ret.length ? 'close' : 'open')"
                >
                    {{ isInfoExpand.length === serialNumberData.ret.length ? $text('S_CLOSE02', '收合') : $text('S_SHOW', '展开') }}
                </div>
            </div>
            <div
                v-for="(serialInfo, serialIndex) in serialNumberData.ret"
                :key="`serial-data-${serialIndex}`"
                :class="$style['serial-basic-info']"
                @click.stop="openTable(serialIndex)"
            >
                <div :class="[$style['serial-basic-wrap'], 'clearfix']">
                    <div :class="$style['serial-basic-left']">
                        <div :class="$style['basic-info-creatat']">{{ serialInfo.confirm_at }}</div>
                        <div :class="$style['basic-info-opcode']">{{ serialInfo.opcode }}</div>
                    </div>
                    <div :class="$style['serial-basic-right']">
                        <div :class="$style['basic-info-change']">
                            <span>{{ $text('S_SERIAL_STATUS01', '存款稽核') }}： {{ getSerialValue(serialInfo, 'change_serial', serialIndex).depositAudit }}</span>
                            <span :class="$style['basic-info-promotion']">{{ $text('S_SERIAL_STATUS02', '优惠稽核') }}： {{ getSerialValue(serialInfo, 'change_serial', serialIndex).promotionAudit }}</span>
                        </div>
                        <div :class="$style['expand-img']">
                            <img :src="`/static/image/mobile/mcenter/${isInfoExpand.includes(serialIndex) ? 'minus' : 'plus'}.png`" />
                        </div>
                    </div>
                </div>
                <div v-if="isInfoExpand.includes(serialIndex)" :class="$style['serial-full-wrap']">
                    <div
                        v-for="(info, index) in serialHeader"
                        :key="`serial-thead-${index}`"
                        :class="[$style['serial-info-item'], 'clearfix']"
                    >
                        <span :class="$style['info-title']" :title="info.value">
                            <span>{{ info.value }}</span>
                            <div
                                v-if="info.objKey === 'deduction' || info.objKey === 'total_audit_amount'"
                                :class="$style['icon-wrap']"
                                @click.stop="alertMsg(info.objKey, serialInfo)"
                            >
                                <icon
                                    name="exclamation"
                                    width="8"
                                    height="10"
                                />
                            </div>
                        </span>
                        <div v-if="info.objKey === 'audit_multiple'" :class="$style['info-text']">
                            <span :class="$style['info-audit-text']">{{ $text('S_ACCOUNT_DEPOSITE', '存款') }}： {{ +serialInfo.audit_rate ? serialInfo.audit_rate : '-' }}</span>
                            <span :class="$style['info-audit-text']">{{ $text('S_PROMOTION', '优惠') }}： {{ +serialInfo.offer_audit_rate ? serialInfo.offer_audit_rate : '-' }}</span>
                        </div>
                        <span v-else :class="$style['info-text']">{{ getSerialValue(serialInfo, info.objKey, serialIndex) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import mixin from '@/mixins/mcenter/withdraw/serialNumber';

export default {
    mixins: [mixin],
    props: {
        closeFuc: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            isInfoExpand: [],
            serialHeader: [
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
                    className: this.$style['serial-table-deduction'],
                    value: this.$text('S_DEDUCTION_MONEY', '扣除金额'),
                    objKey: 'deduction'
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    methods: {
        openTable(index) {
            if (this.isInfoExpand.indexOf(index) < 0) {
                this.isInfoExpand.push(index);
                return;
            }

            this.isInfoExpand.splice(this.isInfoExpand.indexOf(index), 1);
        },
        changeDataOpen(type) {
            if (type === 'close') {
                this.isInfoExpand = [];
                return;
            }

            this.isInfoExpand = this.serialNumberData.ret.map((info, index) => index);
        },
        alertMsg(type, info) {
            let text = `${this.$text('S_SERIAL_TIP02', '行政费用')}：${this.serialNumberData.administrative_rate}%`;

            if (type === 'total_audit_amount') {
                text = `${this.$text('S_DSEPOSIT_SERIAL', '存款流水')}：${+info.audit_amount ? info.audit_amount : '-'}\n${this.$text('S_PROMOTION_SERIAL', '优惠流水')}：${+info.offer_audit_amount ? info.offer_audit_amount : '-'}
                    \n${this.$text('S_SERIAL_TIP', '系统流水稽核顺序为存款->优惠')}`;
            }

            alert(text);
        }
    }
};
</script>

<style lang="scss" src="../css/indexSerialNumber.module.scss" module></style>
