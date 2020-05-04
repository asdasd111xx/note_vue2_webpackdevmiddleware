<template>
    <div :class="$style['record-wrap']">
        <div :class="$style['total-block']">
            <span>笔数：{{ counts }}</span>
            <span>有效投注：{{ total.valid_bet }}</span>
            <span>派彩：{{ +total.payoff }}</span>
        </div>

        <div :class="$style['list-block']" v-for="(data, index) in list">
            <div :class="$style['date']">{{ data.day }}</div>
            <div :class="$style['card']" v-for="(info, index) in data.list">
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
