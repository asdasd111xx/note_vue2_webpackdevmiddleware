<template>
    <div v-if="promoData.length !== 0" class="d-table">
        <div class="d-thead">
            <div class="d-tr">
                <div class="d-th number">{{ $t('S_NUMBER_NO') }}</div>
                <div class="d-th time">{{ $t('S_ACTIVITY_TIME') }}</div>
                <div class="d-th title">{{ $t('S_PROMOTION_NAME') }}</div>
                <div class="d-th status">{{ $t('S_STATUS') }}</div>
                <div class="d-th dispatch-status">{{ $t('S_DISTRIBUTION') }}</div>
            </div>
        </div>
        <div class="d-tbody">
            <div
                v-for="(list, index) in promoData"
                :key="index"
                :class="[
                    'd-tr',
                    'promotion-list',
                    {
                        even: ((index + 1) % 2) === 0
                    }
                ]"
            >
                <div class="d-td number">
                    <span class="td-head">{{ $t('S_NUMBER_NO') }}</span>
                    <span class="td-body">{{ index + 1 }}</span>
                </div>
                <div class="d-td time">
                    <span class="td-head">{{ $t('S_ACTIVITY_TIME') }}</span>
                    <span class="td-body">
                        {{ (list.end_at === '') ? `${list.start_at} ${$t('S_START')}` : `${list.start_at} ~ ${list.end_at}` }}
                    </span>
                </div>
                <div class="d-td title">
                    <span class="td-head">{{ $t('S_PROMOTION_NAME') }}</span>
                    <span
                        :class="[
                            'td-body',
                            {
                                'has-click': list.status !== 'finish'
                            }
                        ]"
                        @click="() => {
                            // 活動結束時，不開啟
                            if (list.status === 'finish') {
                                return;
                            }
                            togglePopup(true);
                            setPopup(list.id);
                        }"
                    >
                        {{ list.title }}
                    </span>
                </div>
                <div class="d-td status">
                    <span class="td-head">{{ $t('S_STATUS') }}</span>
                    <span class="td-body">{{ $t(stateI18n[list.status]) }}</span>
                </div>
                <div class="d-td dispatch-status">
                    <span class="td-head">{{ $t('S_DISTRIBUTION') }}</span>
                    <span
                        :class="[
                            'td-body',
                            {
                                'is-important': ['yet', 'unqualified'].includes(list.dispatch_status)
                            }
                        ]"
                    >
                        {{ $t(i18n[list.dispatch_status]) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

/**
 * 固定頁 - 優惠活動 (我的優惠表格)
 * @module promotion/components/selfPromotionTable
 */
export default {
    props: {
        i18n: {
            type: Object,
            required: true
        },
        state: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            required: true
        },
        togglePopup: {
            type: Function,
            required: true
        },
        setPopup: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            stateI18n: {
                finish: 'S_FINISHED',
                not_active_yet: 'S_NOT_OPEN',
                active: 'S_PROCESSING'
            }
        };
    },
    computed: {
        /**
         * 依派發狀態過濾我的優惠資料
         * @method promoData
         * @returns {array} - 我的優惠資料
         */
        promoData() {
            if (this.state.includes('all')) {
                return this.data;
            }

            return this.data.filter((item) => this.state.includes(item.dispatch_status));
        }
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ])
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.d-table {
    width: 100%;
    color: #333;
    font-size: 14px;
    border-collapse: collapse;
    border-spacing: 0;

    .d-thead {
        display: none;
    }

    .d-tbody {
        .d-tr {
            display: table;
            margin-top: 20px;
            width: 100%;
            background-color: #FFF;

            .d-td {
                display: table-row;

                .td-head {
                    display: table-cell;
                    padding: 5px;
                    width: 35%;
                    min-height: 36px;
                    line-height: 26px;
                    text-align: left;
                    border: 1px solid #EEE;
                    vertical-align: middle;
                }
                .td-body {
                    display: table-cell;
                    padding: 5px;
                    width: 65%;
                    min-height: 36px;
                    line-height: 26px;
                    text-align: left;
                    border: 1px solid #EEE;
                    vertical-align: middle;

                    &.is-important {
                        color: #B20000;
                    }
                    &.has-click {
                        text-decoration: underline;
                        cursor: pointer;

                        &:hover {
                            color: #56BAFF;
                        }
                    }
                }
                &.number {
                    color: #FFF;

                    .td-head,
                    .td-body {
                        border: 1px solid #C6C6C6;
                        background-color: #C6C6C6;
                    }
                }
                &.title,
                &.dispatch-status {
                    .td-head,
                    .td-body {
                        background-color: #FCFCFC;
                    }
                }
            }
        }
    }

    @media screen and (min-width: $pad) {
        .d-tbody {
            .d-tr {
                .d-td {
                    .td-head {
                        width: 30%;
                    }
                    .td-body {
                        width: 70%;
                    }
                }
            }
        }
    }

    @media screen and (min-width: $pc) {
        display: table;

        .d-thead {
            display: table-header-group;
            border: 1px solid #C6C6C6;
            background-color: #C6C6C6;

            .d-tr {
                display: table-row;

                .d-th {
                    display: table-cell;
                    padding: 5px;
                    height: 30px;
                    color: #FFF;
                    font-weight: normal;
                    text-align: center;

                    &.number {
                        width: 10%;
                    }
                    &.time {
                        width: 31%;
                    }
                    &.title {
                        width: 35%;
                    }
                    &.status {
                        width: 12%;
                    }
                    &.dispatch-status {
                        width: 12%;
                    }
                }
            }
        }

        .d-tbody {
            display: table-row-group;

            .d-tr {
                display: table-row;
                margin: 0;

                &.even {
                    background-color: #FCFCFC;
                }

                .d-td {
                    display: table-cell;
                    border: 1px solid #EEE;
                    background-color: transparent;
                    vertical-align: middle;

                    .td-head {
                        display: none;
                        border: 0;
                    }
                    .td-body {
                        display: block;
                        width: 100%;
                        text-align: center;
                        border: 0;
                    }
                    &.number {
                        color: #333;

                        .td-body {
                            border: 0;
                            background-color: transparent;
                        }
                    }
                    &.title {
                        .td-body {
                            text-align: left;
                            background-color: transparent;
                        }
                    }
                    &.dispatch-status {
                        .td-body {
                            background-color: transparent;
                        }
                    }
                }
            }
        }
    }
}
</style>
