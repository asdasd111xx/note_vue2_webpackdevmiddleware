<template>
    <div :class="$style['record-wrap']">
        <div :class="$style['total-block']">
            <span>笔数：{{ counts }}</span>
            <span>有效投注：{{ total.valid_bet }}</span>
            <span>派彩：{{ +total.payoff }}</span>
        </div>

        <div :class="$style['list-block']">
            <div :class="$style['card']" v-for="(info, index) in list">
                <div :class="$style['date']">{{ info.day }}</div>
                <div :class="$style['card-title']">
                    <span :class="$style['header']">{{ info.vendor }}</span>
                    <span
                        :class="[
                            $style['payout'],
                            { [$style['is-negative']]: info.payoff < 0 }
                        ]"
                        >{{ +info.payoff }}</span
                    >
                </div>
                <div>
                    <span :class="$style['game-name']">{{
                        info.game_name
                    }}</span>
                </div>
                <div :class="$style['bet']">
                    <span>单量</span>
                    <span>{{ info.count }}</span>
                </div>
                <div :class="$style['bet']">
                    <span>投注金额</span>
                    <span>{{ info.bet }}</span>
                </div>
                <div :class="$style['bet']">
                    <span>有效投注</span>
                    <span>{{ info.valid_bet }}</span>
                </div>
            </div>
        </div>
    </div>
    <!-- <table :class="$style.table">
        <thead>
            <tr>
                <th>{{ $text('S_PLATFORM', '平台') }}</th>
                <th :class="[$style.sort, sort.by === 'bet' && $style['is-sorted']]" @click="onSort('bet')">
                    {{ $text('S_WAGER_AMOUNT', '投注金额') }}
                    <span :class="$style['icon-group']">
                        <icon :class="$style.icon" name="long-arrow-alt-up" />
                        <icon :class="$style.icon" name="long-arrow-alt-down" />
                    </span>
                </th>
                <th :class="[$style.sort, sort.by === 'valid_bet' && $style['is-sorted']]" @click="onSort('valid_bet')">
                    {{ $text('S_VALID_BET', '有效投注') }}
                    <span :class="$style['icon-group']">
                        <icon :class="$style.icon" name="long-arrow-alt-up" />
                        <icon :class="$style.icon" name="long-arrow-alt-down" />
                    </span>
                </th>
                <th :class="[$style.sort, sort.by === 'payoff' && $style['is-sorted']]" @click="onSort('payoff')">
                    {{ $text('S_PAY_OUT', '派彩') }}
                    <span :class="$style['icon-group']">
                        <icon :class="$style.icon" name="long-arrow-alt-up" />
                        <icon :class="$style.icon" name="long-arrow-alt-down" />
                    </span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="(info, index) in list"
                :key="index"
                @click="$emit('onInquire', info.vendor_name, info.kind)"
            >
                <td>{{ info.name }}</td>
                <td :class="info.bet < 0 ? $style['is-negative'] : $style['is-number']">{{ info.bet }}</td>
                <td :class="info.valid_bet < 0 ? $style['is-negative'] : $style['is-number']">{{ info.valid_bet }}</td>
                <td :class="[info.payoff < 0 ? $style['is-negative'] : $style['is-number'], $style['is-last']]">
                    {{ info.payoff }}<div :class="$style['icon-more']"><icon name="chevron-right" /></div>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr :class="$style['sub-total']">
                <td :class="$style.title">{{ $text('S_RESULT_SUM', '本页小计') }}</td>
                <td :class="subTotal.bet < 0 ? $style['is-negative'] : $style['is-number']">{{ subTotal.bet }}</td>
                <td :class="subTotal.valid_bet < 0 ? $style['is-negative'] : $style['is-number']">{{ subTotal.valid_bet }}</td>
                <td :class="[subTotal.payoff < 0 ? $style['is-negative'] : $style['is-number'], $style['is-last']]">{{ subTotal.payoff }}</td>
            </tr>
            <tr :class="$style['main-total']">
                <td :class="$style.title">{{ $text('S_TOTAL', '总计') }}</td>
                <td :class="total.bet < 0 ? $style['is-negative'] : $style['is-number']">{{ total.bet }}</td>
                <td :class="total.valid_bet < 0 ? $style['is-negative'] : $style['is-number']">{{ total.valid_bet }}</td>
                <td :class="[total.payoff < 0 ? $style['is-negative'] : $style['is-number'], $style['is-last']]">{{ total.payoff }}</td>
            </tr>
        </tfoot>
    </table> -->
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        total: {
            type: Object,
            default: () => ({})
        },
        counts: {
            type: Number,
            default: null
        },
        sort: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            test: [
                {
                    day: "2019-09-22",
                    kind: 3,
                    code: "5106",
                    bet: "189.0000",
                    valid_bet: "188.9244",
                    payoff: "-63.0000",
                    count: "21",
                    game_name: "THREE KINGDOMS",
                    vendor: "bbin"
                },
                {
                    day: "2019-09-22",
                    kind: 3,
                    code: "5902",
                    bet: "80.0000",
                    valid_bet: "79.9680",
                    payoff: "2.5000",
                    count: "16",
                    game_name: "Candy Party",
                    vendor: "bbin"
                }
            ]
        };
    },
    methods: {
        onSort(sortBy) {
            if (this.sort.by === sortBy) {
                this.$emit("update:sort", {
                    ...this.sort,
                    way: this.sort.way === "asc" ? "desc" : "asc"
                });
                return;
            }

            this.$emit("update:sort", {
                by: sortBy,
                way: "asc"
            });
        }
    }
};
</script>

<style src="./css/table.scss" lang="scss" module></style>
