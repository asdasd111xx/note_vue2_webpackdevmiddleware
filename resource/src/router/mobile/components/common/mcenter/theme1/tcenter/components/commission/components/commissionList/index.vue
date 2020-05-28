<template>
    <div :class="$style['commission-list-wrap']">
        <template v-if="!mainNoData">
            <div :class="$style['total-block']">
                <span>笔数：{{ commissionList.length }}</span>
                <span>返利总计：{{ allTotal.amount | amountFormat }}</span>
            </div>

            <div :class="$style['list-block']">
                <div
                    :class="$style['card']"
                    v-for="(info, index) in controlData"
                    :key="'item-' + index"
                    @click="onClick(info)"
                >
                    <div :class="$style['card-title']">
                        <span :class="$style['card-name']">{{
                            info.period
                        }}</span>
                        <span :class="[$style['card-getNumber']]">{{
                            info.amount | amountFormat
                        }}</span>
                    </div>
                    <div>
                        <span>{{
                            $text("S_COMPUTE_WAGER_INTERVAL", "结算区间")
                        }}</span>
                        <span
                            >{{ info.start_at | dateFormat }} ~
                            {{ info.end_at | dateFormat }}</span
                        >
                    </div>

                    <div>
                        <span>{{ $text("S_VALID_BET", "有效投注") }}</span>
                        <span>{{ info.sub_valid_bet | amountFormat }}</span>
                    </div>
                    <div>
                        <span>{{ $text("S_STATUS", "状态") }}</span>
                        <span
                            :class="
                                $style[
                                    `state-${commissionState[info.state].key}`
                                ]
                            "
                            >{{ commissionState[info.state].text }}</span
                        >
                    </div>
                </div>
            </div>

            <infinite-loading
                v-if="showInfinite"
                ref="infiniteLoading"
                @infinite="infiniteHandler"
            >
                <span slot="no-more" />
                <span slot="no-results" />
            </infinite-loading>
        </template>

        <template v-else>
            <div :class="$style['no-data']">
                <img src="/static/image/_new/mcenter/no_data.png" />
                <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
            </div>
        </template>
    </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import commissionList from "@/mixins/mcenter/commission/commissionList";

export default {
    components: {
        InfiniteLoading
    },
    mixins: [commissionList],
    props: {
        setTabState: {
            type: Function,
            required: true
        },
        setHeaderTitle: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            displayDetail: []
        };
    },
    methods: {
        onClick(info) {
            if (info.state === 1) {
                this.setDetailData(info);
                this.setTabState(false);
                this.setHeaderTitle(info.period);
                this.$router.push("/mobile/mcenter/tcenter/commission/detail");
                return;
            }

            if (this.displayDetail.includes(info.id)) {
                this.displayDetail = [
                    ...this.displayDetail.filter(value => value !== info.id)
                ];
                return;
            }

            this.displayDetail = [...this.displayDetail, info.id];
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
