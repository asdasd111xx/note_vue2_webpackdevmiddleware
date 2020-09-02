<template>
    <div class="finance-reward">
        <div class="main-title clearfix">
            <span>{{ $t('S_COMMISSION_DETAILS') }}</span>
            <span v-if="detailOpen" class="detial"><span class="arrow">></span>{{ $t('S_COMMISSION') }}</span>
            <div
                v-if="detailOpen"
                class="main-btn"
                @click="detailOpen = false"
            >
                {{ $t('S_BACK_PAGE') }}
            </div>
        </div>
        <template v-if="!detailOpen">
            <table class="main-table">
                <thead class="agcenter-pc">
                    <tr>
                        <th class="number">{{ $t('S_NUMBER_NO') }}</th>
                        <th class="period">{{ $t('S_SESSION_RESULT') }}</th>
                        <th class="date">{{ $t('S_AG_REGION') }}</th>
                        <th class="status">{{ $t('S_COMMISSION_STATUS') }}</th>
                        <th class="result">{{ $t('S_COMMISSION') }}</th>
                        <th class="detail">{{ $t('S_OPERATE') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <template
                        v-for="(item, index) in mainData"
                    >
                        <tr
                            :key="index"
                            :class="[
                                'reward-list',
                                'agcenter-pc',
                                {
                                    clickable: item.is_extension
                                }
                            ]"
                            @click="getRewardDetial(item)"
                        >
                            <td class="number">{{ index + 1 }}</td>
                            <td class="period">{{ item.period }}</td>
                            <td class="date">
                                {{ item.period_at.start_at }} ~ {{ item.period_at.end_at }}
                            </td><td :class="`status ${item.verifying ? 'verifying' : ''}`">{{ item.statusText }}</td>
                            <td class="result">{{ item.value }}</td>
                            <td class="detail">
                                <div
                                    v-if="showWithdraw(item)"
                                    class="detail-link"
                                    @click.stop="operate(item.id)"
                                >
                                    <span>{{ $t('S_ACCOUNT_WITHDRAW') }}</span>
                                    <div class="withdraw-icon-wrap">
                                        <icon class="withdraw-icon" name="hand-holding-usd" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <table
                            :key="index"
                            class="pad"
                            @click="getRewardDetial(item)"
                        >
                            <tr class="number">
                                <td colspan="2">{{ index + 1 }}</td>
                            </tr>
                            <tr>
                                <td class="period caption">{{ $t('S_SESSION_RESULT') }}</td>
                                <td class="period content">{{ item.period }}</td>
                            </tr>
                            <tr>
                                <td class="date caption">{{ $t('S_AG_REGION') }}</td>
                                <td class="date content">
                                    {{ item.period_at.start_at }} ~ {{ item.period_at.end_at }}
                                </td>
                            </tr>
                            <tr>
                                <td class="status caption">{{ $t('S_COMMISSION_STATUS') }}</td>
                                <td :class="`status ${item.verifying ? 'verifying' : ''} content`">{{ item.statusText }}</td>
                            </tr>
                            <tr>
                                <td class="result caption">{{ $t('S_COMMISSION') }}</td>
                                <td class="result content">{{ item.value }}</td>
                            </tr>
                            <tr>
                                <td class="detail caption">{{ $t('S_OPERATE') }}</td>
                                <td class="detail content">
                                    <div
                                        v-if="showWithdraw(item)"
                                        class="detail-link"
                                        @click.stop="operate(item.id)"
                                    >
                                        <span>{{ $t('S_ACCOUNT_WITHDRAW') }}</span>
                                        <div class="withdraw-icon-wrap">
                                            <icon class="withdraw-icon" name="hand-holding-usd" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </template>
                </tbody>
            </table>
            <div v-if="mainData.length !== 0" class="page-wrap">
                <span :class="`page-first${pageNow === 1 ? ' disable' : ''}`" @click="pageNow === 1 ? '' : pageChange(1)" />
                <span :class="`page-pre${pageNow === 1 ? ' disable' : ''}`" @click="pageNow === 1 ? '' : pageChange(pageNow - 1)" />
                <div class="page-select-wrap">
                    <select
                        v-model="pageNow"
                        class="page-select"
                        @change="pageChange(pageNow)"
                    >
                        <option
                            v-for="(num, i) in pageAll"
                            :key="i"
                            :value="num"
                        >
                            {{ num }}
                        </option>
                    </select>
                    <span class="page-total">/&nbsp;{{ pageAll }}</span>
                </div>
                <span :class="`page-next${pageNow === pageAll ? ' disable' : ''}`" @click="pageNow === pageAll ? '' : pageChange(pageNow + 1)" />
                <span :class="`page-last${pageNow === pageAll ? ' disable' : ''}`" @click="pageNow === pageAll ? '' : pageChange(pageAll)" />
            </div>
        </template>
        <template v-else>
            <div class="clearfix">
                <!-- 有效會員 -->
                <table class="detail-table valid-member">
                    <thead>
                        <tr>
                            <th colspan="3">{{ $t('S_ACH_VALID_MEMBERS') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="light-style">
                            <td class="member-number">{{ $t('S_NUMBER_OF_DEMAND') }}</td>
                            <td class="member-total">{{ $t('S_REPORT_TOTAL_MEMBERS') }}</td>
                            <td class="member-valid">{{ $t('S_CH_VALID_MEM_NUM') }}</td>
                        </tr>
                        <tr>
                            <td class="member-number light-bg">{{ detailData.target_valid_user }}</td>
                            <td class="member-total">{{ detailData.all_valid_user }}</td>
                            <td class="member-valid">{{ detailData.valid_user }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 01 退水 (有效投注) -->
            <table class="detail-table full">
                <thead>
                    <tr>
                        <th colspan="6">01 {{ $t('S_VALID_BET') }}</th>
                    </tr>
                </thead>
                <tbody v-if="detailData.detail.refund" class="agcenter-pc">
                    <tr class="light-style full">
                        <td>{{ $t('S_GAMING_PLATFORM') }}</td>
                        <td>{{ $t('S_ACH_ACCUMU') }}</td>
                        <td>{{ $t('S_ACH_CALCULAT_PERIOD') }}</td>
                        <td>{{ $t('S_VALID_BET_TOTAL') }}</td>
                    </tr>
                    <tr
                        v-for="(item, index) in detailData.detail.refund"
                        :key="index"
                    >
                        <td>{{ getGameName(item.vendor, item.kind) }}</td>
                        <td>{{ item.last }}</td>
                        <td>{{ item.current }}</td>
                        <td>{{ item.total }}</td>
                    </tr>
                </tbody>
                <tbody v-if="detailData.detail.refund" class="pad">
                    <tr class="light-style">
                        <td colspan="2">{{ $t('S_GAMING_PLATFORM') }}</td>
                    </tr>
                    <template v-for="(item, index) in detailData.detail.refund">
                        <tr
                            :key="index"
                            class="light-bg pad-item-list"
                            @click="padCurrent.refund === index ? `${padCurrent.refund = -1}` : `${padCurrent.refund = index}`"
                        >
                            <td :class="`${index === padCurrent.refund ? 'current' : ''}`" colspan="2">
                                {{ getGameName(item.vendor, item.kind) }}
                                <icon
                                    :name="`${index === padCurrent.refund ? 'chevron-up' : 'chevron-down'}`"
                                    width="24"
                                    height="24"
                                />
                            </td>
                        </tr>
                        <tr
                            v-if="index === padCurrent.refund"
                            :key="index"
                            class="pad-item-content"
                        >
                            <td colspan="2">
                                <table>
                                    <tr class="light-style">
                                        <td>{{ $t('S_ACH_ACCUMU') }}</td>
                                        <td>{{ $t('S_ACH_CALCULAT_PERIOD') }}</td>
                                        <td>{{ $t('S_VALID_BET_TOTAL') }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ item.last }}</td>
                                        <td>{{ item.current }}</td>
                                        <td>{{ item.total }}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <!-- 02 費用承擔 -->
            <table class="detail-table full">
                <thead>
                    <tr>
                        <th colspan="6">02 {{ $t('S_EXPENCES') }}</th>
                    </tr>
                </thead>
                <tbody
                    v-if="detailData.detail.charge"
                    class="agcenter-pc"
                >
                    <tr class="light-style full">
                        <td>{{ $t('S_COST_NAME') }}</td>
                        <td>{{ $t('S_ACH_ACCUMU') }}</td>
                        <td>{{ $t('S_ACH_CALCULAT_PERIOD') }}</td>
                        <td>{{ $t('S_SHARE') }}%</td>
                        <td>{{ $t('S_MAXCREDIT') }}</td>
                        <td>{{ $t('S_CH_CHARGE') }}</td>
                    </tr>
                    <tr
                        v-for="(item, index) in detailData.detail.charge"
                        :key="index"
                    >
                        <td>{{ $t(chargeText[item.type]) }}</td>
                        <td>{{ item.last }}</td>
                        <td>{{ item.current }}</td>
                        <td>{{ item.rate }}%</td>
                        <td>{{ +(item.max) === 0 ? '-' : item.max }}</td>
                        <td>{{ item.amount }}</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="total-style">{{ $t('S_TOTAL_COST') }}</td>
                        <td colspan="3" class="total-color">{{ detailData.total_charge }}</td>
                    </tr>
                </tbody>
                <tbody
                    v-if="detailData.detail.charge"
                    class="pad"
                >
                    <tr class="light-style">
                        <td colspan="2">{{ $t('S_COST_NAME') }}</td>
                    </tr>
                    <template
                        v-for="(item, index) in detailData.detail.charge"
                    >
                        <tr
                            :key="index"
                            class="light-bg pad-item-list"
                            @click="padCurrent.charge === index ? `${padCurrent.charge = -1}` : `${padCurrent.charge = index}`"
                        >
                            <td :class="`${index === padCurrent.charge ? 'current' : ''}`" colspan="2">
                                {{ $t(chargeText[item.type]) }}
                                <icon
                                    :name="`${index === padCurrent.charge ? 'chevron-up' : 'chevron-down'}`"
                                    width="24"
                                    height="24"
                                />
                            </td>
                        </tr>
                        <tr
                            v-if="index === padCurrent.charge"
                            :key="index"
                            class="pad-item-content"
                        >
                            <td colspan="2">
                                <table>
                                    <tr class="light-style">
                                        <td>{{ $t('S_ACH_ACCUMU') }}</td>
                                        <td>{{ $t('S_ACH_CALCULAT_PERIOD') }}</td>
                                        <td>{{ $t('S_SHARE') }}%</td>
                                    </tr>
                                    <tr>
                                        <td>{{ item.last }}</td>
                                        <td>{{ item.current }}</td>
                                        <td>{{ item.rate }}%</td>
                                    </tr>
                                    <tr class="light-style">
                                        <td>{{ $t('S_MAXCREDIT') }}</td>
                                        <td colspan="2">{{ $t('S_CH_CHARGE') }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ +(item.max) === 0 ? '-' : item.max }}</td>
                                        <td colspan="2">{{ item.amount }}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </template>
                    <tr>
                        <td class="total-style">{{ $t('S_TOTAL_COST') }}</td>
                        <td class="total-color">{{ detailData.total_charge }}</td>
                    </tr>
                </tbody>
            </table>
            <!-- 03 退佣 (公司輸贏派彩) -->
            <table class="detail-table full">
                <thead>
                    <tr>
                        <th colspan="6">03 {{ $t('S_COMPANY_PAYOUT') }}</th>
                    </tr>
                </thead>
                <tbody
                    v-if="detailData.detail.reward"
                    class="agcenter-pc"
                >
                    <tr class="light-style full">
                        <td>{{ $t('S_GAMING_PLATFORM') }}</td>
                        <td>{{ $t('S_ACH_ACCUMU') }}</td>
                        <td>{{ $t('S_ACH_CALCULAT_PERIOD') }}</td>
                        <td>{{ $t('S_TOTAL_PAYOFF') }}</td>
                    </tr>
                    <tr
                        v-for="(item, index) in detailData.detail.reward"
                        :key="index"
                    >
                        <td>{{ getGameName(item.vendor, item.kind) }}</td>
                        <td>{{ item.last }}</td>
                        <td>{{ item.current }}</td>
                        <td>{{ item.total }}</td>
                    </tr>
                </tbody>
                <tbody
                    v-if="detailData.detail.reward"
                    class="pad"
                >
                    <tr class="light-style">
                        <td colspan="2">{{ $t('S_GAMING_PLATFORM') }}</td>
                    </tr>
                    <template
                        v-for="(item, index) in detailData.detail.reward"
                    >
                        <tr
                            :key="index"
                            class="light-bg pad-item-list"
                            @click="padCurrent.reward === index ? `${padCurrent.reward = -1}` : `${padCurrent.reward = index}`"
                        >
                            <td :class="`${index === padCurrent.reward ? 'current' : ''}`" colspan="2">
                                {{ getGameName(item.vendor, item.kind) }}
                                <icon
                                    :name="`${index === padCurrent.reward ? 'chevron-up' : 'chevron-down'}`"
                                    width="24"
                                    height="24"
                                />
                            </td>
                        </tr>
                        <tr
                            v-if="index === padCurrent.reward"
                            :key="index"
                            class="pad-item-content"
                        >
                            <td colspan="2">
                                <table>
                                    <tr class="light-style">
                                        <td>{{ $t('S_ACH_ACCUMU') }}</td>
                                        <td>{{ $t('S_ACH_CALCULAT_PERIOD') }}</td>
                                        <td>{{ $t('S_TOTAL_PAYOFF') }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ item.last }}</td>
                                        <td>{{ item.current }}</td>
                                        <td>{{ item.total }}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </template>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import EST from '@/lib/EST';
import agcenter from '@/api/agcenter';
import gameName from '@/lib/game_name';
import ajax from '@/lib/ajax';
import * as apiUrl from '@/config/api';

export default {
    data() {
        return {
            detailOpen: false,
            numMax: 10, // 每頁顯示幾筆
            pageAll: 1, // 外層總頁數
            pageNow: 1, // 外層當前頁
            selectId: '',
            mainData: [],
            detailData: {},
            chargeText: {
                remit_amount: 'S_DEPOSIT_COMPANY_TOTAL',
                remit_offer: 'S_DEPOSIT_COMPANY_OFFER_FIRST',
                remit_discount: 'S_DEPOSIT_COMPANY_FEE_OFFER',
                deposit_amount: 'S_DEPOSIT_OTHER_TOTAL',
                deposit_offer: 'S_DEPOSIT_OTHER_OFFER',
                withdraw: 'S_DAW_WITHDRAWAL_CHARGE',
                activity: 'S_MANUAL_DEPOSIT_ACTIVITY',
                rebate: 'S_PM_RAKEBACK_SP'
            },
            padCurrent: {
                refund: 0,
                charge: 0,
                reward: 0
            }
        };
    },
    computed: {
        ...mapGetters({
            agentUserLevels: 'getAgentUserLevels'
        })
    },
    created() {
        this.getRewardData(0);
    },
    beforeDestroy() {
        this.actionSetAgcenterWdPeriod('');
    },
    methods: {
        getGameName(vendor, kind) {
            return gameName(vendor, kind);
        },
        getRewardData(firstResult) {
            agcenter.reward({
                params: {
                    first_result: firstResult,
                    max_results: this.numMax
                },
                success: (response) => {
                    this.mainData = response.ret.map((item) => {
                        const message = {
                            ...item,
                            statusText: '',
                            verifying: false,
                            period_at: {
                                start_at: EST(item.period_at.start_at, 'YYYY-MM-DD'),
                                end_at: EST(item.period_at.end_at, 'YYYY-MM-DD')
                            }
                        };

                        // 審核中
                        if (message.reviewing) {
                            message.statusText = this.$text('S_VERIFYING');
                            message.verifying = true;
                            return message;
                        }

                        // 審核完成
                        if (message.reviewed) {
                            message.statusText = this.$text('S_VERIFIED_COMPLETE');
                            return message;
                        }

                        // 可領取
                        if (message.available) {
                            message.statusText = this.$text('S_RECEIVABLE');

                            // 審核完成(已撤銷)
                            if (message.revoked) {
                                message.statusText = this.$text('S_VERIFIED_COMPLETE');
                            }
                            return message;
                        }

                        // 結轉下期
                        if (message.shift) {
                            message.statusText = this.$text('S_CARRY_OVER');
                            message.verifying = false;
                            return message;
                        }

                        // 審核中(可取款)
                        if (!message.verified) {
                            message.statusText = this.$text('S_VERIFYING');
                            message.verifying = true;
                            return message;
                        }

                        // 本期取消 (未達門檻)
                        if (message.cancel) {
                            message.statusText = this.$text('S_PERIOD_CANCEL');
                            return message;
                        }

                        // 已審核
                        if (message.pass) {
                            message.statusText = this.$text('S_VERIFIED');
                        }

                        return message;
                    });
                    if (response.pagination.total === 0) {
                        this.pageAll = 1;
                        return;
                    }

                    this.pageAll = Math.ceil(response.pagination.total / this.numMax);
                }
            });
        },
        getRewardDetial(reward) {
            // agcenter.rewardDetail({
            //     success: (response) => {
            //         this.detailData = response.ret;
            //         this.detailOpen = true;
            //     }
            // }, reward.id);
            if (reward.is_extension) {
                const newWin = window.open();
                ajax({
                    method: 'get',
                    url: `${apiUrl.API_AGCENTER_REWARD_THIRD_PARTY_LINK}?period=${reward.period}`,
                    success: (response) => {
                        if (response.result === 'ok') {
                            newWin.location = response.ret.uri;
                            return;
                        }

                        newWin.close();
                    },
                    fail: () => {
                        newWin.close();
                    }
                });
            }
        },
        pageChange(page) {
            this.pageNow = page;
            this.getRewardData((page - 1) * this.numMax);
        },
        operate(id) {
            if (!this.agentUserLevels.bank
                    && !this.agentUserLevels.virtual_bank
                    && !this.agentUserLevels.bind_user
            ) {
                alert(this.$t('S_MISTAKE_CONTACT_CUSTOM_SERVICE'));
                return;
            }

            // 判斷是否為手機網頁版
            if (this.$route && /^\/mobile\//.test(this.$route.path)) {
                this.$router.push({ path: '/mobile/agcenter/financeWithdraw' });
                return;
            }
            this.$router.push({ path: '/agent/financeWithdraw' });
            this.actionSetAgcenterWdPeriod(id);
        },
        ...mapActions([
            'actionSetAgcenterWdPeriod'
        ]),
        showWithdraw(reward) {
            return !reward.withdraw && (reward.pass || reward.available) && +(reward.value) !== 0;
        }
    }
};
</script>

<style src="../css/index.scss" lang="scss" scoped />
