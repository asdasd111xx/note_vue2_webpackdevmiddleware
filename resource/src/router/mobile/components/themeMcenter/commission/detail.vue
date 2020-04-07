<template>
    <div v-if="isReceive" :class="$style['commission-detail-wrap']">
        <div :class="$style['info-wrap']">
            <div :class="[$style['title'], 'clearfix']">
                <span :class="$style['title-period']">{{ $text('S_PERIOD', '期数') }}&nbsp;{{ period }}</span>
                <span :class="$style['title-state']">{{ $text(state) }}</span>
            </div>
            <div :class="[$style['level-info-wrap'], 'clearfix']">
                <div
                    v-for="item in levelList"
                    :key="`level-${item.depth}`"
                    :class="[$style['level-info-box'], $style[`level-num-${levelList.length}`]]"
                >
                    <div :class="[$style['info-title'], $style[`friend-${item.depth}`]]">{{ $text(levelTrans[item.depth]) }}</div>
                    <div :class="$style['info-subtitle']">{{ $text('S_COMMISSION_01' ,'佣金') }}</div>
                    <div>{{ item.amount | commaFormat }}</div>
                    <div :class="$style['info-subtitle']">{{ $text('S_VALID_BET' ,'有效投注') }}</div>
                    <div>{{ item.valid_bet | commaFormat }}</div>
                </div>
            </div>
            <div :class="$style['level-total-box']">
                <div :class="[$style['level-total-tr'], 'clearfix']">
                    <div :class="$style['info-title']">{{ $text('S_COMMISSION_TOTAL', '佣金总计') }}</div>
                    <div :class="$style['info-value']">{{ leveltotle.amount | commaFormat }}</div>
                </div>
                <div :class="[$style['level-total-tr'], 'clearfix']">
                    <div :class="$style['info-title']">{{ $text('S_VALID_BET_TOTAL_01', '有效投注总计') }}</div>
                    <div :class="$style['info-value']">{{ leveltotle.valid_bet | commaFormat }}</div>
                </div>
            </div>
        </div>
        <div v-if="firstLevelList.length">
            <table :class="$style['data-table']">
                <thead>
                    <tr>
                        <th :class="$style['index']">{{ $text('S_NUMBER_NO' ,'序') }}</th>
                        <th :class="$style['first-level']">{{ $text('S_FIRST_LEVEL_FRIEND' ,'一级好友') }}</th>
                        <th :class="[$style['valid-bet'], { [$style['active']]: sort === 'valid_bet' }]" @click="setDataSort('valid_bet')">
                            {{ $text('S_VALID_BET' ,'有效投注') }}
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
                        <th :class="$style['commission']">{{ $text('S_COMMISSION_01' ,'佣金') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(info, index) in firstLevelList"
                        :key="`list-${info.id}`"
                    >
                        <td>{{ index + 1 }}</td>
                        <td>{{ info.username }}</td>
                        <td :class="[$style['money-type'], $style['hi-light-type']]"><span>{{ info.valid_bet | commaFormat }}</span></td>
                        <td :class="$style['money-type']"><span>{{ info.wage_amount | commaFormat }}</span></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr :class="$style['foot-subtotal']">
                        <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_PAGE_TOTAL' ,'本页结果小计') }}</td>
                        <td :class="$style['money-type']"><span>{{ pageSubtotal.valid_bet | commaFormat }}</span></td>
                        <td :class="$style['money-type']"><span>{{ pageSubtotal.amount | commaFormat }}</span></td>
                    </tr>
                    <tr :class="$style['foot-total']">
                        <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_SEARCH_TOTAL' ,'搜寻结果总计') }}</td>
                        <td :class="$style['money-type']"><span>{{ allTotal.valid_bet | commaFormat }}</span></td>
                        <td :class="$style['money-type']"><span>{{ allTotal.amount | commaFormat }}</span></td>
                    </tr>
                </tfoot>
            </table>
            <pagination :current.sync="currentPage" :total.sync="totalPage" />
        </div>
    </div>
</template>

<script>
import mixin from '@/components/mcenter/components/commission/js/mixinDetail';
import pagination from '@/components/mcenter/template/common/pagination';

export default {
    components: {
        pagination
    },
    mixins: [mixin],
    props: {
        headerConfig: {
            type: Object,
            default: null
        }
    },
    created() {
        if (!this.headerConfig) {
            return;
        }

        this.$emit('update:headerConfig', {
            ...this.headerConfig,
            [this.$route.name]: {
                ...this.headerConfig[this.$route.name],
                i18n: 'S_MY_COMMISSION',
                hasRouter: false,
                back: 'back',
                backTo: ''
            }
        });
    },
    beforeDestroy() {
        if (!this.headerConfig) {
            return;
        }

        this.$emit('update:headerConfig', {
            ...this.headerConfig,
            [this.$route.name]: {
                ...this.headerConfig[this.$route.name],
                i18n: 'S_TEAM_CENTER',
                hasRouter: true,
                back: 'push',
                backTo: '/mobile/mcenter'
            }
        });
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.info-wrap {
    .title {
        height: 32px;
        line-height: 32px;
        background-color: #363C5D;

        .title-period {
            float: left;
            padding: 0 10px;
            width: 50%;
            color: #E2C8A0;
        }
        .title-state {
            float: left;
            padding: 0 10px;
            width: 50%;
            color: #9EA5C5;
            text-align: right;
        }
    }
}

.level-num-1 {
    width: 100%;
}
.level-num-2 {
    width: 50%;
}
.level-num-3 {
    width: 33.333%;
}
.level-num-4 {
    width: 25%;
}
.level-num-5 {
    width: 20%;
}

.level-info-box {
    float: left;
    font-size: 12px;
    text-align: center;
    border-right: 1px solid #BBB;
    border-bottom: 1px solid #BBB;

    &:last-child {
        border-right: 0;
    }

    .info-title {
        height: 25px;
        line-height: 25px;
        color: #FFF;

        &.friend-1 {
            background-color: #717BAC
        }
        &.friend-2 {
            background-color: #64AF77;
        }
        &.friend-3 {
            background-color: #B069A1;
        }
        &.friend-4 {
            background-color: #AAB167;
        }
        &.friend-5 {
            background-color: #6CB7B7;
        }
    }
    .info-subtitle {
        color: #666;
    }
}

.level-total-tr {
    font-size: 12px;
    border-bottom: 1px solid #BBB;

    .info-title {
        float: left;
        padding: 0 10px;
        width: 50%;
        color: #666;
    }
    .info-value {
        float: left;
        padding: 0 10px;
        width: 50%;
        text-align: right;
    }
}

.data-table {
    margin: 8px 0 10px;
    width: 100%;
    font-size: 12px;
    text-align: center;
    border-spacing: 0;
    border-collapse: collapse;

    tr {
        border-top: 1px solid #BBB;
        border-bottom: 1px solid #BBB;
    }

    td {
        &.money-type {
            span {
                display: block;
                margin: 0 auto;
                width: 70%;
                text-align: right;
            }
        }
    }

    thead {
        th {
            color: #666;
            font-weight: normal;

            &.index {
                width: 10%;
            }
            &.first-level {
                width: 28%;
                cursor: pointer;
            }
            &.valid-bet {
                width: 31%;
            }
            &.commission {
                width: 31%;
            }
        }
    }
    tbody {
        td {
            background-color: #FFF;
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
        }
    }
}

@media screen and (min-width: $phone) {
    .level-info-box {
        font-size: 15px;

        .info-title {
            height: 39px;
            line-height: 39px;
            font-size: 13px;
        }
    }

    .level-total-tr {
        font-size: 15px;
    }

    .data-table {
        font-size: 15px;

        thead {
            th {
                font-size: 17px;
            }
        }
    }
}
@media screen and (min-width: $pad) {
    .level-info-box {
        font-size: 24px;
        line-height: 30px;

        .info-title {
            height: 63px;
            line-height: 63px;
            font-size: 22px;
        }
    }

    .level-total-tr {
        font-size: 24px;
        line-height: 30px;
    }

    .data-table {
        font-size: 24px;
        line-height: 30px;

        thead {
            th {
                font-size: 27px;

                :global(.fa-icon) {
                    width: 10px;
                    height: 18px;
                }
            }
        }
    }
}
</style>
