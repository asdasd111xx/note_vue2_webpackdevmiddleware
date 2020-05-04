<template>
    <div :class="$style['record-wrap']">
        <div :class="$style['total-block']">
            <span>笔数：{{ counts }}</span>
            <span>有效投注：{{ total.valid_bet }}</span>
            <span>派彩：{{ +total.payoff }}</span>
        </div>

        <div :class="$style['list-block']">
            <div v-if="inqStart === inqEnd" :class="$style['date']">
                {{ inqStart }}
            </div>
            <div v-else :class="$style['date']">
                {{ inqStart }} ~ {{ inqEnd }}
            </div>

            <div
                :class="$style['card']"
                v-for="(info, index) in list"
                @click="$emit('onInquire', info.username)"
            >
                <div :class="$style['card-title']">
                    <span :class="$style['header']">{{ info.username }}</span>
                    <span
                        :class="[
                            $style['payout'],
                            { [$style['is-negative']]: info.payoff < 0 }
                        ]"
                        >{{ +info.payoff }}</span
                    >
                </div>
                <div>
                    <span>投注金额</span>
                    <span>{{ info.bet }}</span>
                </div>
                <div>
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
        },
        inqStart: {
            type: String,
            default: ""
        },
        inqEnd: {
            type: String,
            default: ""
        }
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
