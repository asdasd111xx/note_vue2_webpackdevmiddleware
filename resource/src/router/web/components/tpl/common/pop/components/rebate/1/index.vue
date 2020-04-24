<template>
    <transition name="fade">
        <div class="pop-rebate-wrap pop-class">
            <div class="title">{{ $t('S_REAL_TIME_REBATE') }}</div>
            <div class="content-wrap">
                <template>
                    <div class="content">
                        <h1>{{ computeState ? $t('S_DISTRIBUTION_COMPLETED') : $t('S_SYSTEM_COMPUTE_WAGER') }}</h1>
                        <div class="rebate-title">{{ $t('S_COMPUTE_WAGER_INTERVAL') }}</div>
                        <div class="rebate-value">{{ computeState ? receiveEntryData.start_at : data.start_at }} ~ {{ computeState ? receiveEntryData.end_at : data.end_at }}</div>
                        <template v-if="computeState">
                            <div class="rebate-title">{{ $t('S_COMPUTING_VALID_BET') }}</div>
                            <div class="rebate-value">{{ receiveEntryData.valid_bet }}</div>
                            <div class="rebate-title">{{ $t('S_COMPUTING_PREMIUM_AMOUNT') }}</div>
                            <div class="rebate-value">{{ receiveEntryData.amount }}</div>
                            <div class="rebate-entry-button-wrap">
                                <a
                                    id="button-entry-history"
                                    href="###"
                                    @click="close();actionSetMcenterBankRebate({ type: 'history', interval: 'today' });"
                                >
                                    {{ $t('S_REBATE_HISTORY') }}
                                </a>
                                <a
                                    id="button-entry-close"
                                    href="###"
                                    @click="close()"
                                >
                                    {{ $t('S_CLOSE') }}
                                </a>
                            </div>
                        </template>
                        <template v-else>
                            <ele-loading class="rebate-loding" />
                            <p>{{ $t('S_COMPUTE_WAGER_TIP') }}</p>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapActions } from 'vuex';
import EST from '@/lib/EST';
import mcenter from '@/api/mcenter';

export default {
    components: {
        eleLoading: () => import(/* webpackChunkName: 'eleLoading' */'../../../../../../tpl/common/element/loading/circle_text')
    },
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            computeState: false,
            receiveEntryData: {},
            receiveId: this.data.id
        };
    },
    created() {
        setTimeout(this.rebateEntry, 5000);
    },
    methods: {
        close() {
            this.actionSetPop();
        },
        rebateEntry() {
            mcenter.bankRebateReceiveEntry({
                success: (response) => {
                    this.receiveEntryData = response.ret;

                    // 結算時間，若為null表示此筆資料還在結算中
                    if (this.receiveEntryData.rebate_done_at === null) {
                        setTimeout(this.rebateEntry, 10000);
                        return;
                    }
                    this.computeState = true;
                    this.receiveEntryData.start_at = EST(this.receiveEntryData.start_at);
                    this.receiveEntryData.end_at = EST(this.receiveEntryData.end_at);
                },
                fail: () => {
                    this.close();
                }
            }, this.receiveId);
        },
        ...mapActions([
            'actionSetPop',
            'actionSetMcenterBankRebate'
        ])
    }
};
</script>

<style lang="scss" src="../../../css/rebate/1/index.scss" scoped></style>
