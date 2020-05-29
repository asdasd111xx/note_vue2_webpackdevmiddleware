<template>
    <div>
        <div v-if="immediateData.length > 0" :class="$style['content-wrap']">
            <div
                v-for="(caculateList, listIndex) in immediateData"
                :key="`caculate-${listIndex}`"
                :class="$style['content-item']"
            >
                <div :class="$style['rebate-header']">
                    <!-- <ele-loading v-if="rebateState === 'loading'" /> -->
                    <template>
                        <div>{{ caculateList.period }}期</div>
                        <div>
                            {{ caculateList.start_at | dateFormat }}~{{
                                caculateList.end_at | dateFormat
                            }}
                        </div>
                    </template>
                </div>

                <div :class="$style['rebate-body']">
                    <div :class="$style['detail-content']">
                        <span :class="$style['content-left']">
                            结算方式
                        </span>
                        <div :class="$style['content-right']">
                            <!-- <ele-loading v-if="rebateState === 'loading'" /> -->
                            <template>{{
                                caculateList.type === 1
                                    ? "投注返利"
                                    : "损益返利"
                            }}</template>
                        </div>
                    </div>

                    <div :class="$style['detail-content']">
                        <span :class="$style['content-left']">
                            {{ $text("S_VALID_BET", "有效投注") }}
                        </span>
                        <div :class="$style['content-right']">
                            <!-- <ele-loading v-if="rebateState === 'loading'" /> -->
                            <template>{{
                                caculateList.sub_valid_bet
                                    | roundTwoPoints
                                    | commaFormat
                            }}</template>
                        </div>
                    </div>

                    <div :class="$style['detail-content']">
                        <span :class="$style['content-left']">
                            損益
                        </span>
                        <div :class="$style['content-right']">
                            {{ caculateList.sub_profit }}
                        </div>
                    </div>

                    <div :class="$style['detail-content']">
                        <span :class="$style['content-left']">
                            返利
                        </span>
                        <div :class="$style['content-right']">
                            {{ caculateList.amount }}
                        </div>
                    </div>

                    <div :class="$style['detail-content']">
                        <span :class="$style['content-left']">
                            最低领取金额
                        </span>
                        <div :class="$style['content-right']">
                            {{ caculateList.self_min_limit }}
                        </div>
                    </div>

                    <div :class="$style['detail-content']">
                        <span :class="$style['content-left']">
                            可领取次数
                        </span>
                        <div :class="$style['content-right']">
                            {{ caculateList.self_times }}
                        </div>
                    </div>
                </div>

                <div :class="$style['rebate-btn']">
                    <!-- <ele-loading v-else-if="rebateState === 'loading'" /> -->
                    <template>
                        <button
                            v-if="caculateList.state === 1"
                            @click="handleRebateProcess(caculateList.type)"
                        >
                            {{ $t("S_RECEIVE") }}
                        </button>

                        <button
                            v-if="caculateList.state === 3"
                            :class="$style['unrebate-btn']"
                        >
                            {{ $t("S_UNABLE_PASS") }}
                        </button>
                    </template>
                </div>
            </div>
        </div>

        <div
            :class="$style['rebate-manual-title']"
            @click="isShowTip = !isShowTip"
        >
            <icon
                :class="$style['title-icon']"
                :name="isShowTip ? 'angle-up' : 'angle-down'"
            />
            <span :class="$style['manual-title']">{{
                $text("S_REAL_DIRECTIONS", "实返说明")
            }}</span>
        </div>

        <div v-if="isShowTip" :class="$style['rebate-manual-wrap']">
            <div :class="$style['manual-line']" />
            <div :class="$style['rebate-manual-tip']">
                <div>
                    (1){{
                        !rebateInitData.accumulative
                            ? $t("S_VALID_BETTING_AMOUNT")
                            : $t("S_VALID_BETTING_AMOUNT_NEW")
                    }}
                </div>
                <div>
                    (2){{
                        !rebateInitData.accumulative
                            ? $t("S_FUNCTION_ET")
                            : $t("S_FUNCTION_ET_NEW")
                    }}
                </div>
                <div>(3){{ $t("S_CALCULATION_SERVICE") }}</div>
                <div>(4){{ $t("S_ACTUAL_COLLECTION") }}</div>
                <div>(5){{ messageText }}</div>
                <div>(6){{ $t("S_CONSIDERATION_DATA") }}</div>
                <div v-show="maintainsList">
                    {{ $t("S_CURRENT_PLATFORM") }}：
                    <span :class="$style['maintains-list']">{{
                        maintainsList
                    }}</span>
                </div>
            </div>
        </div>

        <template v-if="isShowPopup">
            <popup />
        </template>
    </div>
</template>

<script>
import Vue from "vue";
import mcenter from "@/api/mcenter";
import { format } from "date-fns";
import bbosRequest from "@/api/bbosRequest";
import { mapActions, mapGetters } from "vuex";
import popup from "./components/popup";

export default {
    components: {
        popup,
        eleLoading: () =>
            import(
                /* webpackChunkName: 'eleLoading' */ "@/router/web/components/tpl/common/element/loading/square"
            )
    },
    data() {
        return {
            isShowPopup: false,
            isShowTip: true,
            immediateData: [],
            rebateInitData: {},
            maintainsList: "",
            rebateState: ""
        };
    },
    computed: {
        ...mapGetters({
            systemTime: "getSystemTime",
            siteConfig: "getSiteConfig",
            memInfo: "getMemInfo"
        }),
        messageText() {
            const messageText = this.$t("S_REMAINING_REBATE");
            return messageText.replace("%S", this.rebateInitData.hour);
        }
    },
    filters: {
        roundTwoPoints(value) {
            return Number(value).toFixed(2);
        },
        commaFormat(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        dateFormat(date) {
            const est = format(new Date(date), "yyyy/MM/dd HH:mm:ss+20:00");
            return format(new Date(est), "yyyy-MM-dd HH:mm:ss");
        }
    },
    created() {
        this.getImmediateData();
        this.bankRebateMaintains();
    },
    methods: {
        bankRebateMaintains() {
            mcenter.bankRebateMaintains({
                success: response => {
                    const maintainsList = [];
                    response.ret.forEach(maintain => {
                        maintainsList.push(maintain.alias);
                    });
                    this.maintainsList = maintainsList.join("、");
                }
            });
        },
        getImmediateData() {
            bbosRequest({
                methods: "get",
                url: this.siteConfig.BBOS_DOMIAN + "/Wage/SelfDispatchInfo",
                reqHeaders: {
                    Vendor: this.memInfo.user.domain
                },
                params: { lang: "zh-cn" }
            }).then(response => {
                if (response.status === "000") {
                    // this.immediateData = response.data.entries
                    this.immediateData = [
                        {
                            period: "20200421",
                            start_at: "2020-04-21T12:00:00+0800",
                            end_at: "2020-04-21T07:15:18+0800",
                            sub_valid_bet: "14875039.6179",
                            sub_profit: "0.00",
                            state: 1,
                            self_times: 10,
                            self_min_limit: "10",
                            type: 1,
                            amount: "200.00"
                        }
                    ];
                }
            });
        },
        handleRebateProcess(type) {
            bbosRequest({
                methods: "put",
                url: this.siteConfig.BBOS_DOMIAN + "/Wage/SelfDispatch",
                reqHeaders: {
                    Vendor: this.memInfo.user.domain
                },
                params: { lang: "zh-cn", type }
            }).then(response => {
                this.isShowPopup = true;
                if (response.status === "000") {
                }
            });
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
