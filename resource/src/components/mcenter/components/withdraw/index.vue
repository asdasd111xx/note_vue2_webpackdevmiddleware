<template>
    <div v-if="mobileCheck && isShow" :class="$style['bank-withdraw']">
        <template v-if="!thirdUrl">
            <span :class="$style['withdraw-title']">{{ $text('S_ACCOUNT_WITHDRAW', '取款') }}</span>
            <!-- 主帳戶餘額區塊 -->
            <div :class="[$style['withdraw-feature-wrap'], 'clearfix']">
                <div :class="$style['withdraw-info-table']">
                    <div :class="[$style['withdraw-info-thead'], $style['withdraw-info-tr']]">
                        <div :class="[$style['withdraw-info-td'], $style['withdraw-important']]">{{ $text('S_CAN_WITHDRAW_MONEY', '可取款金额') }}</div>
                        <div :class="[$style['withdraw-info-td'], $style['withdraw-important']]">
                            {{ withdrawData.cash.available_balance }}
                            <div
                                v-if="+withdrawData.cash.gift_card_balance > 0"
                                :class="[$style['tip-icon-wrap'], $style['withdraw-can-money']]"
                                @mouseenter="isShowTip = true"
                                @mouseleave="isShowTip = false"
                            >
                                <icon name="info-circle" />
                                <div v-if="isShowTip" :class="$style['tip-wrap']">
                                    <div :class="[$style['tip-text'], 'ui basic label']">
                                        <div>
                                            {{ $text('S_WITHDRAW_TIP02', '未满足流水的红利无法取款') }}
                                            <span :class="$style['bonus-btn']" @click="$router.push('/page/mcenter/bonusAccount')">{{ $text('S_WATCH_BOUNS', '查看红利') }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div :class="$style['withdraw-info-tr']">
                        <div :class="[$style['withdraw-info-td'], $style['withdraw-important']]">{{ $text('S_MAIN_BALANCE', '主帐户余额') }}</div>
                        <div :class="[$style['withdraw-info-td'], $style['withdraw-important']]">
                            {{ withdrawData.cash.balance }}
                            <div :class="$style['icon-wrap']" @click="updateAmount">
                                <icon
                                    width="13"
                                    height="13"
                                    name="sync"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    :class="$style['spang-btn']"
                    :title="$text('S_ONE_CLICK_TO_ACCOUNT', '一键归户')"
                    @click="balanceBack"
                >
                    {{ $text('S_ONE_CLICK_TO_ACCOUNT', '一键归户') }}
                </div>
            </div>
            <!-- 取款金額資訊 -->
            <div :class="[$style['withdraw-feature-wrap'], 'clearfix']">
                <div :class="$style['withdraw-info-table']">
                    <div :class="$style['withdraw-info-tr']">
                        <div :class="$style['withdraw-info-td']">{{ $text('S_WITHDRAW_MONEY', '取款金额') }}</div>
                        <div :class="$style['withdraw-info-td']">
                            <input
                                v-model="withdrawValue"
                                :class="$style['withdraw-input']"
                                :placeholder="withdrawMoneyTip.text"
                                autocomplete="off"
                                @input="withdrawValue = $event.target.value.replace(/[^\d]/g, '')"
                            />
                        </div>
                    </div>
                    <template v-if="!memInfo.config.internal_audit">
                        <div :class="$style['withdraw-info-tr']">
                            <div :class="$style['withdraw-info-td']">{{ $text('S_WITHDRAW_FEE', '出款手续费') }}</div>
                            <div :class="[$style['withdraw-info-td'], { [$style['is-deduction']]: +withdrawData.audit.total.fee }]">
                                {{ +withdrawData.audit.total.fee ? `-${withdrawData.audit.total.fee}` : '--' }}
                                <div
                                    v-if="withdrawData.audit.total.exceed_free_count"
                                    :class="$style['tip-icon-wrap']"
                                    :title="$text('S_WITHDRAW_DEDUCTION_TIP', { replace: [
                                        { target: '%s', value: withdrawData.payment_charge.ret.free_period },
                                        { target: '%s', value: withdrawData.payment_charge.ret.free_count }
                                    ]})"
                                >
                                    <icon name="info-circle" />
                                </div>
                            </div>
                        </div>
                        <div :class="$style['withdraw-info-tr']">
                            <div :class="$style['withdraw-info-td']">{{ $text('S_DEDUCTION_MONEY', '扣除金额') }}</div>
                            <div :class="[$style['withdraw-info-td'], { [$style['is-deduction']]: +withdrawData.audit.total.deduction }]">{{ +withdrawData.audit.total.deduction ? `-${withdrawData.audit.total.deduction}` : '--' }}</div>
                        </div>
                        <div :class="$style['withdraw-info-tr']">
                            <div :class="$style['withdraw-info-td']">{{ $text('S_REAL_WITHDRAW', '实际出款') }}</div>
                            <div :class="[$style['withdraw-info-td'], { [$style['is-deduction']]: realWithdrawMoney < 0 }]">{{ realWithdrawMoney }}</div>
                        </div>
                    </template>
                </div>
                <div v-if="!memInfo.config.internal_audit" :class="$style['water-wrap']">
                    <span>{{ serialTip }}</span>
                    <span :class="$style['details-btn']" @click="serialClose(true)">{{ $text('S_VIEW_DETAILS', '查看详情') }}</span>
                </div>
            </div>
            <!-- 取款帳號區塊 -->
            <div :class="[$style['withdraw-feature-wrap'], 'clearfix']">
                <div v-if="memInfo.config.withdraw === '迅付'" :class="$style['withdraw-info-table']">
                    <div :class="$style['withdraw-info-tr']">
                        <div :class="$style['withdraw-info-td']">{{ $text('S_WITHDRAW_ACCOUNT02', '取款帐号') }}</div>
                        <div :class="[$style['withdraw-info-td'], { [$style['multiple-item']]: allWithdrawAccount.length > 1 }]">
                            <span v-if="allWithdrawAccount.length <= 1">{{ allWithdrawAccount[0] ? allWithdrawAccount[0].alias : '' }}</span>
                            <Multiselect
                                v-else
                                v-model="resultWithdrawAccount"
                                :placeholder="$text('S_SELECTED', '请选择')"
                                :options="allWithdrawAccount"
                                :searchable="false"
                                :show-labels="false"
                                :class="$style['withdraw-select-wrap']"
                                track-by="id"
                                label="alias"
                            />
                        </div>
                    </div>
                    <div :class="$style['withdraw-info-tr']">
                        <div :class="$style['withdraw-info-td']">{{ $text('S_DAW_DRWAL_PASSWORD', '取款密码') }}</div>
                        <div :class="$style['withdraw-info-td']">
                            <input
                                v-model="withdrawPwd"
                                :class="$style['withdraw-input']"
                                :placeholder="$text('S_SUBMIT_WITHDRAW_PASSWORD', '请输入取款密码')"
                                type="password"
                                autocomplete="off"
                                @input="withdrawPwd = $event.target.value.replace(/[^\d]/g, '')"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div v-if="+resultWithdrawAccount.offer_percent && memInfo.config.withdraw === '迅付'" :class="$style['withdraw-tip']">{{ cgpayPromotionText }}</div>
                    <div v-if="!memInfo.config.internal_audit && (+withdrawData.audit.total.deduction || +withdrawData.audit.total.fee)" :class="$style['withdraw-checkbox-wrap']">
                        <input
                            v-model="isCheckWithdraw"
                            :class="$style['input-checkbox']"
                            type="checkbox"
                        />
                        <div :class="$style['input-tip']">{{ $text('S_WITHDRAW_TIP01', '我同意扣除上述费用，并经财务审核后才可出款') }} !</div>
                    </div>
                    <div
                        :class="$style['next-btn']"
                        :title="$text('S_NEXT', '下一步')"
                        @click="enterWithdrawOrder"
                    >
                        {{ $text('S_NEXT', '下一步') }}
                    </div>
                    <div
                        :class="$style['reset-btn']"
                        :title="$text('S_RESET', '重设')"
                        @click="resetValue"
                    >
                        {{ $text('S_RESET', '重设') }}
                    </div>
                </div>
            </div>
            <withdraw-record :third-url.sync="resultThirdUrl" :is-open-order.sync="isOpenOrder" />
            <serial-number v-if="isSerial" :close-fuc="serialClose" />
            <withdraw-alert
                v-if="isAlertTip"
                :close-fuc="alertTipClose"
                :title="alertData.title"
                :close-btn-text="alertData.closeBtnText"
                :type="alertData.type"
                :tip-title="alertData.tipTitle"
                :tip-img-src="alertData.tipImgSrc"
            />
        </template>
        <iframe
            v-else
            :src="thirdUrl"
            :class="$style['withdraw-third-iframe']"
            height="700"
            frameborder="0"
        />
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import mixin from '@/mixins/mcenter/withdraw';

export default {
    components: {
        Multiselect,
        withdrawRecord: () => import(/* webpackChunkName: 'withdrawRecord' */ './components/withdrawRecord'),
        serialNumber: () => import(/* webpackChunkName: 'serialNumber' */ './components/serialNumber'),
        withdrawAlert: () => import(/* webpackChunkName: 'withdrawAlert' */ './components/withdrawAlert')
    },
    mixins: [mixin],
    data() {
        return {
            isSerial: false,
            isCheckWithdraw: false,
            isShowTip: false,
            isOpenOrder: false
        };
    },
    computed: {
        resultThirdUrl: {
            get() {
                return this.thirdUrl;
            },
            set(value) {
                this.thirdUrl = value;
            }
        }
    },
    methods: {
        /**
         * 關閉流水詳情
         * @method serialClose
         */
        serialClose(showType = false) {
            if (showType) {
                this.isSerial = showType;
                return;
            }

            this.isSerial = !this.isSerial;
        },
        enterWithdrawOrder() {
            if (!this.isCheckWithdraw && +this.withdrawData.audit.total.deduction && !this.memInfo.config.internal_audit) {
                alert(this.$text('S_WITHDRAW_AGREE_TIP', '请确认是否同意扣除'));
                return;
            }

            if (!this.withdrawPwd && this.memInfo.config.withdraw === '迅付') {
                alert(this.$text('S_SUBMIT_WITHDRAW_PASSWORD', '请输入取款密码'));
                return;
            }

            this.submitWithdraw().then((response) => {
                if (response.result === 'error' && response.code === 500110) {
                    this.isOpenOrder = true;
                }
            });
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
