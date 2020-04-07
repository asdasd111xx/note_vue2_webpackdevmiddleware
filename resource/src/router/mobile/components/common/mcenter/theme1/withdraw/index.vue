<template>
    <div v-if="mobileCheck" :class="[$style['bank-withdraw'], colorClass]">
        <mcenter-header :header-setting="headerSetting" />
        <div v-if="!isSerial && isShow">
            <div :class="[$style['withdraw-title-wrap'], 'clearfix']">
                <span
                    :class="[$style['withdraw-title'], { [$style['is-current']]: curTitleTab === 'withdrawMethod'}]"
                    :title="$text('S_WITHDRAW_METHOD', '取款方式')"
                    @click="changeTab('withdrawMethod')"
                >
                    {{ $text('S_WITHDRAW_METHOD', '取款方式') }}
                </span>
                <span
                    :class="[$style['withdraw-title'], { [$style['is-current']]: curTitleTab === 'withdrawRecord'}]"
                    :title="$text('S_WITHDRAW_RECORD_SHORT', '取款纪录')"
                    @click="changeTab('withdrawRecord')"
                >
                    {{ $text('S_WITHDRAW_RECORD_SHORT', '取款纪录') }}
                </span>
            </div>
            <!-- 主帳戶餘額區塊 -->
            <div :class="[$style['main-money-wrap'], 'clearfix']">
                <div :class="$style['main-money']">
                    <div :class="$style['main-title']">{{ $text('S_MAIN_BALANCE', '主帐户余额') }}</div>
                    <div :class="$style['money-text']">{{ memCurrency }} {{ withdrawData.cash.balance }}</div>
                </div>
                <div
                    :class="$style['spang-btn']"
                    :title="$text('S_ONE_CLICK_TO_ACCOUNT', '一键归户')"
                    @click="balanceBack"
                >
                    {{ $text('S_ONE_CLICK_TO_ACCOUNT', '一键归户') }}
                </div>
                <div :class="$style['icon-wrap']" @click="updateAmount">
                    <icon
                        name="sync-alt"
                        width="15"
                        height="15"/>
                </div>
            </div>
            <template v-if="curTitleTab === 'withdrawMethod'">
                <div :class="[$style['withdraw-money-info'], 'clearfix']">
                    <div :class="$style['withdraw-money-title']">
                        <span :class="$style['withdraw-can-text']">{{ $text('S_CAN_WITHDRAW_MONEY', '可取款金额') }}</span>
                        <div
                            v-if="+withdrawData.cash.gift_card_balance > 0"
                            :class="$style['tip-icon-wrap']"
                            @click.stop="alertMsg($text('S_WITHDRAW_TIP02', '未满足流水的红利无法取款'))"
                        >
                            <img src="/static/image/mobile/mcenter/btn_description_white.png" />
                        </div>
                    </div>
                    <div :class="$style['withdraw-money-text']">{{ withdrawData.cash.available_balance }}</div>
                </div>
                <template v-if="!thirdUrl">
                    <!-- 取款金額資訊 -->
                    <div :class="[$style['withdraw-feature-wrap'], 'clearfix']">
                        <div :class="$style['withdraw-input-wrap']">
                            <div :class="$style['withdraw-input-title']">{{ withdrawMoneyTip.text }}</div>
                            <div :class="$style['input-wrap']">
                                <input
                                    v-model="withdrawValue"
                                    :class="[$style['withdraw-input'], $style['withdraw-money']]"
                                    :placeholder="$text('S_SUMBIT_WITHDRAW_MONEY', '请输入取款金额')"
                                    @input="withdrawValue = $event.target.value.replace(/[^\d]/g, '')"
                                />
                            </div>
                        </div>
                        <template v-if="!memInfo.config.internal_audit">
                            <div :class="[$style['withdraw-info'], 'clearfix']">
                                <div :class="$style['withdraw-info-title']">
                                    <span :class="$style['withdraw-fee-text']">{{ $text('S_WITHDRAW_FEE', '出款手续费') }}</span>
                                    <div
                                        v-if="withdrawData.audit.total.exceed_free_count"
                                        :class="$style['tip-icon-wrap']"
                                        @click.stop="alertMsg($text('S_WITHDRAW_DEDUCTION_TIP', { replace: [
                                            { target: '%s', value: withdrawData.payment_charge.ret.free_period },
                                            { target: '%s', value: withdrawData.payment_charge.ret.free_count }
                                        ]}))"
                                    >
                                        <img src="/static/image/mobile/mcenter/btn_description_n.png" />
                                    </div>
                                </div>
                                <div :class="$style['withdraw-info-money']">
                                    {{ +withdrawData.audit.total.fee ? `-${withdrawData.audit.total.fee}` : '--' }}
                                </div>
                            </div>
                            <div :class="[$style['withdraw-info'], 'clearfix']">
                                <div :class="$style['withdraw-info-title']">{{ $text('S_DEDUCTION_MONEY', '扣除金额') }}</div>
                                <div :class="$style['withdraw-info-money']">{{ +withdrawData.audit.total.deduction ? `-${withdrawData.audit.total.deduction}` : '--' }}</div>
                            </div>
                            <div :class="[$style['withdraw-info'], 'clearfix']">
                                <div :class="$style['withdraw-info-title']">{{ $text('S_REAL_WITHDRAW', '实际出款') }}</div>
                                <div :class="$style['withdraw-info-money']">{{ realWithdrawMoney }}</div>
                            </div>
                        </template>
                    </div>
                    <div v-if="!memInfo.config.internal_audit" :class="[$style['water-wrap'], 'clearfix']">
                        <span :class="$style['details-tip']">{{ serialTip }}</span>
                        <span :class="$style['details-btn']" @click="serialClose(true)">{{ $text('S_VIEW_DETAILS', '查看详情') }}</span>
                    </div>
                    <!-- 取款帳號區塊 -->
                    <div v-if="memInfo.config.withdraw === '迅付'" :class="[$style['withdraw-feature-wrap'], 'clearfix']">
                        <div :class="[$style['withdraw-info'], $style['info-account'], 'clearfix']">
                            <div :class="$style['withdraw-input-title']">{{ $text('S_WITHDRAW_ACCOUNT02', '取款帐号') }}</div>
                                <select
                                    v-model="selectAccountValue"
                                    @change="changeSelectAccountValue(selectAccountValue)"
                                    :class="$style['withdraw-account-text']"
                                >
                                    <option
                                        v-for="item in resultSelectWithdraw"
                                        :key="item.value"
                                        :value="item.value"
                                        :class="$style['select-items']"
                                    >
                                        {{ item.label }}
                                    </option>
                                </select>
                            </div>
                        <div :class="[$style['withdraw-info'], 'clearfix']">
                            <div :class="$style['withdraw-input-title']">{{ $text('S_DAW_DRWAL_PASSWORD', '取款密码') }}</div>
                            <div :class="$style['input-wrap']">
                                <input
                                    v-model="withdrawPwd"
                                    :class="[$style['withdraw-input'], $style['deposit-pwd']]"
                                    :placeholder="$text('S_SUBMIT_WITHDRAW_PASSWORD', '请输入取款密码')"
                                    type="password"
                                    @input="withdrawPwd = $event.target.value.replace(/[^\d]/g, '')"
                                />
                            </div>
                        </div>
                    </div>
                    <div v-if="+resultWithdrawAccount.offer_percent && memInfo.config.withdraw === '迅付'" :class="$style['withdraw-tip']">{{ cgpayPromotionText }}</div>
                    <div v-if="!memInfo.config.internal_audit && (+withdrawData.audit.total.deduction || +withdrawData.audit.total.fee)" :class="$style['withdraw-checkbox-wrap']">
                        <input
                            v-model="isCheckWithdraw"
                            :class="$style['input-checkbox']"
                            type="checkbox"
                        />
                        <div :class="$style['input-tip']">{{ $text('S_WITHDRAW_TIP01', '我同意扣除上述费用，并经财务审核后才可出款') }} !</div>
                    </div>
                    <div :class="$style['withdraw-btn-wrap']">
                        <div
                            :class="$style['reset-btn']"
                            :title="$text('S_RESET', '重设')"
                            @click="resetValue"
                        >
                            {{ $text('S_RESET', '重设') }}
                        </div>
                        <div
                            :class="$style['next-btn']"
                            :title="$text('S_ENTER_SHORT', '提交')"
                            @click="enterWithdrawOrder"
                        >
                            {{ $text('S_ENTER_SHORT', '提交') }}
                        </div>
                    </div>
                </template>
                <iframe
                    v-else
                    :src="thirdUrl"
                    :class="$style['withdraw-third-iframe']"
                    height="700"
                    frameborder="0"
                />
            </template>
            <withdraw-record
                v-if="curTitleTab === 'withdrawRecord'"
                :change-third-url="changeTab"
                :is-open-order.sync="isOpenOrder"
            />
            <withdraw-alert
                v-if="isAlertTip"
                :close-fuc="alertTipClose"
                :title="alertData.title"
                :close-btn-text="alertData.closeBtnText"
                :type="alertData.type"
                :tip-title="alertData.tipTitle"
                :tip-img-src="alertData.tipImgSrc"
            />
        </div>
        <serial-number v-if="isSerial" :close-fuc="serialClose" />
        <div v-if="isLoading" :class="$style['loading-wrap']">
            <div :class="$style['loading-item']">
                <ele-loading />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import mixin from '@/mixins/mcenter/withdraw';

export default {
    components: {
        withdrawRecord: () => import(/* webpackChunkName: 'withdrawRecord' */ './components/withdrawRecord'),
        serialNumber: () => import(/* webpackChunkName: 'serialNumber' */ './components/serialNumber'),
        withdrawAlert: () => import(/* webpackChunkName: 'withdrawAlert' */ './components/withdrawAlert'),
        mcenterHeader: () => import(/* webpackChunkName: 'mcenterHeader' */ '@/router/mobile/components/common/mcenter/theme1/header'),
        eleLoading: () => import(/* webpackChunkName: 'eleLoading' */ '@/router/web/components/tpl/common/element/loading/circle'),
    },
    mixins: [mixin],
    data() {
        return {
            curTitleTab: 'withdrawMethod',
            isSerial: false,
            headerSetting: {
                title: this.$text('S_ACCOUNT_WITHDRAW', '取款'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.$router.push('/mobile/mcenter')
                }
            },
            isCheckWithdraw: false,
            isOpenOrder: false,
            selectAccountValue: ''
        };
    },
    computed: {
        ...mapGetters({
            memCurrency: 'getMemCurrency',
            siteConfig: 'getSiteConfig',
            memInfo: 'getMemInfo'
        }),
        resultSelectWithdraw() {
            const newAllWithdrawAccount = this.allWithdrawAccount.map(info => ({
                ...info,
                label: info.alias,
                value: info.id.toString()
            }));
            return newAllWithdrawAccount;
        },
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    watch: {
        resultWithdrawAccount(info) {
            this.selectAccountValue = info.id.toString();
        }
    },
    methods: {
        openSelect(show) {
            if (show !== '') {
                this.isSelectShow = show;
                return;
            }

            this.isSelectShow = true;
        },
        /**
         * 是否開啟流水詳情
         * @method serialClose
         */
        serialClose(showType = false) {
            let initHeaderSetting = {
                title: this.$text('S_ACCOUNT_WITHDRAW', '取款'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.$router.push('/mobile/mcenter')
                }
            };

            if (showType) {
                initHeaderSetting = {
                    title: this.$text('S_SERIAL_CHANGE', '流水检查'),
                    leftBtns: {
                        icon: 'close',
                        onClick: () => this.serialClose(false)
                    }
                };
            }

            this.headerSetting = initHeaderSetting;
            this.isSerial = showType;
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
                    this.curTitleTab = 'withdrawRecord';
                }
            });
        },
        alertMsg(text) {
            alert(text);
        },
        changeTab(tabName, url) {
            this.curTitleTab = tabName;
            this.thirdUrl = url || '';
        },
        changeSelectAccountValue(val) {
            const index = this.resultSelectWithdraw.map(item => item.value ).indexOf(val);
            this.resultWithdrawAccount = this.allWithdrawAccount[index];
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module></style>
