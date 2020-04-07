<template>
    <div :class="$style['commission-wrap']">
        <template v-if="isReceive && !((detailId !== '') && (detailPeriod !== ''))">
            <table :class="$style['info-table']">
                <thead>
                    <tr>
                        <th>{{ $text('S_COMMISSION_01' ,'佣金') }}</th>
                        <th>{{ $text('S_VALID_BET_TOTAL', '总有效投注') }}</th>
                        <th>{{ $text('S_ACH_VALID_MEMBERS', '有效会员') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ commissionLast.wage_amount | commaFormat }}</td>
                        <td>{{ commissionLast.valid_bet | commaFormat }}</td>
                        <td>{{ commissionLast.user_count }}</td>
                    </tr>
                </tbody>
            </table>
            <div :class="[$style['search-wrap'], 'clearfix']">
                <div :class="$style['select-wrap']">
                    <model-select
                        v-model="stateValue"
                        :options="options"
                        :placeholder="options[0].text"
                    />
                </div>
                <div :class="$style['calendar-wrap']">
                    <flatPickrRange
                        :min-date="limitDays"
                        :max-date="estToday"
                        :date.sync="dateRangeValue"
                    />
                </div>
            </div>
            <div :class="$style['data-wrap']">
                <template v-if="commissionList.length">
                    <table :class="$style['data-table']">
                        <thead>
                            <tr>
                                <th :class="$style['index']">{{ $text('S_NUMBER_NO' ,'序') }}</th>
                                <th :class="[$style['period'], { [$style['active']]: sort === 'period' }]" @click="setDataSort('period')">
                                    {{ $text('S_PERIOD_NAME' ,'期数名称') }}
                                    <icon
                                        v-if="sort === 'period'"
                                        :name="`${order === 'desc' ? 'long-arrow-alt-down' : 'long-arrow-alt-up'}`"
                                        width="5"
                                        height="10"
                                    />
                                    <span v-else>
                                        <icon
                                            name="long-arrow-alt-up"
                                            width="5"
                                            height="10"
                                        />
                                        <icon
                                            name="long-arrow-alt-down"
                                            width="5"
                                            height="10"
                                        />
                                    </span>
                                </th>
                                <th :class="$style['datetime']">{{ $text('S_COMPUTE_WAGER_INTERVAL' ,'结算区间') }}</th>
                                <th :class="$style['state']">{{ $text('S_STATUS' ,'状态') }}</th>
                                <th :class="$style['next']" />
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(info, index) in commissionList">
                                <tr
                                    :key="`list-${info.id}`"
                                    @click="showCommissionDetail(info)"
                                >
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ info.period }}</td>
                                    <td :class="$style['datetime-type']">
                                        <div>{{ info.start_at | dataFormat }}</div>
                                        <div>{{ info.end_at | dataFormat }}</div>
                                    </td>
                                    <td :class="$style[`state-${commissionState[info.state].key}`]">{{ $t(commissionState[info.state].text) }}</td>
                                    <td>
                                        <icon
                                            name="chevron-right"
                                            width="13"
                                            height="13"
                                        />
                                    </td>
                                </tr>
                                <tr
                                    v-show="info.id === subInfoId"
                                    :key="`sub-info-${info.id}`"
                                >
                                    <td :class="$style['sub-info']" colspan="5">
                                        <div :class="[$style['info-wrap'], 'clearfix']">
                                            <div :class="$style['title']">{{ $text('S_VALID_BET' ,'有效投注') }}</div>
                                            <div :class="$style['number']">{{ info.sub_valid_bet }}</div>
                                        </div>
                                        <div :class="[$style['info-wrap'], 'clearfix']">
                                            <div :class="$style['title']">{{ $text('S_ACH_VALID_MEMBERS', '有效会员') }}</div>
                                            <div :class="$style['number']">{{ info.sub_user_count }}</div>
                                        </div>
                                        <div :class="[$style['info-wrap'], 'clearfix']">
                                            <div :class="$style['title']">{{ $text('S_COMMISSION_01' ,'佣金') }}</div>
                                            <div :class="$style['number']">{{ info.amount }}</div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                        <tfoot>
                            <tr :class="$style['foot-subtotal']">
                                <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_PAGE_TOTAL' ,'本页结果小计') }}</td>
                                <td :class="$style['text']">
                                    <div>{{ $text('S_VALID_BET' ,'有效投注') }}</div>
                                    <div>{{ $text('S_COMMISSION_01' ,'佣金') }}</div>
                                </td>
                                <td :class="$style['money-type']" colspan="2">
                                    <span>{{ pageSubtotal.valid_bet | commaFormat }}</span>
                                    <span>{{ pageSubtotal.amount | commaFormat }}</span>
                                </td>
                            </tr>
                            <tr :class="$style['foot-total']">
                                <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_SEARCH_TOTAL' ,'搜寻结果总计') }}</td>
                                <td :class="$style['text']">
                                    <div>{{ $text('S_VALID_BET' ,'有效投注') }}</div>
                                    <div>{{ $text('S_COMMISSION_01' ,'佣金') }}</div>
                                </td>
                                <td :class="$style['money-type']" colspan="2">
                                    <span>{{ allTotal.valid_bet | commaFormat }}</span>
                                    <span>{{ allTotal.amount | commaFormat }}</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    <pagination :current.sync="currentPage" :total.sync="totalPage" />
                </template>
                <template v-else>
                    <div :class="$style['no-data']">
                        <img :class="$style['icon-nodate']" src="/static/image/mcenter/icon_noinformation.png" />
                        {{ $text('S_NO_COMMISSION_INFO', '无佣金资料') }}
                    </div>
                </template>
            </div>
        </template>
        <template v-if="detailId !== '' && detailPeriod !== ''">
            <detail
                :id="detailId"
                :header-config.sync="headerConfigValue"
                :period="detailPeriod"
                :state="detailState"
                :on-close="closeCommissionDetail"
            />
        </template>
    </div>
</template>

<script>
import Vue from 'vue';
import { ModelSelect } from 'vue-search-select';
import EST from '@/lib/EST';
import flatPickrRange from '@/components/flatPickrRange';
import mixin from '@/components/mcenter/components/commission/js/mixinIndex';
import pagination from '@/components/mcenter/template/common/pagination';
import detail from './detail';

export default {
    components: {
        ModelSelect,
        flatPickrRange,
        pagination,
        detail
    },
    mixins: [mixin],
    props: {
        headerConfig: {
            type: Object,
            default: null
        }
    },
    data() {
        const now = EST(new Date(), '', true);
        const limit = new Date(Vue.moment(now).add(-29, 'days'));

        return {
            estToday: now,
            startTime: limit,
            endTime: now,
            limitDays: limit,
            detailState: '',
            subInfoId: ''
        };
    },
    computed: {
        headerConfigValue: {
            get() {
                return this.headerConfig;
            },
            set(value) {
                this.$emit('update:headerConfig', value);
            }
        },
        stateValue: {
            get() {
                return this.state;
            },
            set(value) {
                this.state = value;
                this.getListCommission();
            }
        },
        dateRangeValue: {
            get() {
                return [this.startTime, this.endTime];
            },
            set(value) {
                [this.startTime, this.endTime] = value;
                this.getListCommission();
            }
        },
        detailId() {
            return this.$route.params.id || '';
        },
        detailPeriod() {
            return this.$route.params.period || '';
        },
        options() {
            return Object.keys(this.commissionState).map((index) => ({
                value: index,
                text: this.$i18n.t(this.commissionState[index].text)
            }));
        }
    },
    methods: {
        closeCommissionDetail() {
            this.$router.push('/mobile/mcenter/tcenter/commission');
        },
        showCommissionDetail({ id, period, state }) {
            if (state !== 1) {
                if (this.subInfoId === id) {
                    this.subInfoId = '';
                    return;
                }

                this.subInfoId = id;
                return;
            }

            this.detailState = 'S_ASSIGN_ALREADY';
            this.$router.push(`/mobile/mcenter/tcenter/commission/${id}/${period}`);
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.commission-wrap {
    height: 100%;
    min-height: calc(100vh - 100px);
    background-color: #ECECEC;
}

.info-table {
    width: 100%;
    font-size: 12px;
    text-align: center;
    border: 1px solid #BBB;
    border-spacing: 0;
    border-collapse: collapse;
    background-color: #ECECEC;

    th,
    td {
        width: 33.333%;
        font-weight: normal;
        border-right: 1px solid #BBB;
    }

    thead {
        tr {
            color: #666;
            font-weight: normal;
        }
    }
}

.select-wrap {
    float: left;
    width: 50%;
    border-bottom: 1px solid #BBB;

    :global(.ui.selection.dropdown) {
        border: 0;
        border-right: 1px solid #BBB;
        border-radius: 0;
        outline: none;
    }
}

.calendar-wrap {
    float: left;
    width: 50%;
    height: 39px;
    text-align: center;
    border-bottom: 1px solid #BBB;

    :global(.flatpickr-input) {
        padding: 0 5px;
        width: 100%;
        height: 100%;
        border: 0;
        outline: none;
    }
}

.data-wrap {
    padding-top: 9px;
    height: 100%;

    .no-data {
        margin-top: 122px;
        color: #DDD;
        text-align: center;
    }
    .icon-nodate {
        display: block;
        margin: 0 auto 8px;
        width: 16%;
    }
}

.data-table {
    margin-bottom: 25px;
    width: 100%;
    font-size: 12px;
    text-align: center;
    border-spacing: 0;
    border-collapse: collapse;

    tr {
        border-top: 1px solid #BBB;
        border-bottom: 1px solid #BBB;
    }

    thead {
        th {
            color: #666;
            font-weight: normal;

            &.index {
                width: 15%;
            }
            &.period {
                width: 28%;
                cursor: pointer;
            }
            &.datetime {
                width: 20%;
            }
            &.state {
                width: 28%;
            }
            &.next {
                width: 9%;
            }
        }
    }
    tbody {
        .datetime-type {
            div {
                display: inline-block;
                width: 65px;
                text-align: left;
            }
        }
        .sub-info {
            padding: 3% 0;
            background-color: #EEE;
        }
        .info-wrap {
            line-height: 12px;
            padding-bottom: 3%;
            font-size: 12px;

            .title {
                width: 35%;
                padding: 0 3%;
                color: #353B5D;
            }
            .number {
                width: 65%;
                color: #353B5D;
            }

            div {
                overflow: hidden;
                float: left;
                text-align: left;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        td {
            background-color: #FFF;

            &.state-assigned {
                color: #009787;
            }
            &.state-yet {
                color: #52B8FF;
            }
            &.state-unqualified {
                color: #000;
            }
        }
    }

    tfoot {
        text-align: left;

        .foot-subtotal {
            background-color: #FFF2F2;
        }
        .foot-total {
            background-color: #E8EAF2;
        }

        td {
            &.foot-title {
                padding: 0 4% 0 7%;
            }
            &.money-type {
                span {
                    display: block;
                    padding: 0 4%;
                    margin: 0 auto;
                    text-align: right;
                }
            }
            &.text {
                text-align: center;

                div {
                    width: 65px;
                    margin: 0 auto;
                    text-align: left;
                }
            }
        }
    }
}

@media screen and (min-width: $phone) {
    .info-table {
        th {
            line-height: 30px;
            font-size: 14px;
        }
        td {
            line-height: 30px;
            font-size: 16px;
        }
    }

    .data-table {
        th {
            font-size: 17px;
        }
        td {
            font-size: 15px;
        }
        tbody {
            .info-wrap {
                line-height: 15px;
                font-size: 15px;
            }
            .datetime-type {
                div {
                    width: 81px;
                }
            }
        }
        tfoot {
            td {
                &.text {
                    div {
                        width: 81px;
                    }
                }
            }
        }
    }
}

@media screen and (min-width: $pad) {
    .info-table {
        th {
            line-height: 50px;
            font-size: 23px;
        }
        td {
            line-height: 50px;
            font-size: 24px;
        }
    }

    .data-table {
        th {
            line-height: 34px;
            font-size: 27px;

            :global(.fa-icon) {
                width: 10px;
                height: 18px;
            }
        }
        td {
            line-height: 28px;
            font-size: 24px;

            :global(.fa-icon) {
                width: 16px;
                height: 29px;
            }
        }
        tbody {
            .info-wrap {
                line-height: 24px;
                font-size: 24px;
            }
            .datetime-type {
                div {
                    width: 129px;
                }
            }
        }
        tfoot {
            td {
                &.text {
                    div {
                        width: 129px;
                    }
                }
            }
        }
    }
}
</style>
