<template>
    <div :class="siteStyleClass">
        <div :class="$style['content-wrap']">
            <div
                v-for="(caculateList, listIndex) in immediateData"
                :key="`caculate-${listIndex}`"
                :class="$style['content-item']"
            >
                <div :class="$style['rebate-header']">
                    <!-- <ele-loading v-if="rebateState === 'loading'" /> -->
                    <template>
                        <div v-if="rebateInitData.is_vip">
                            {{ caculateList.vip_config_name }}
                        </div>
                        <div>
                            {{ caculateList.start_at }}~{{
                                caculateList.end_at
                            }}
                        </div>
                    </template>
                </div>

                <div :class="$style['rebate-body']">
                    <div :class="$style['detail-content']">
                        <span :class="$style['content-left']">{{
                            $text("S_VALID_BET", "有效投注")
                        }}</span>
                        <div :class="$style['content-right']">
                            <!-- <ele-loading v-if="rebateState === 'loading'" /> -->
                            <template>{{ caculateList.total }}</template>
                        </div>
                    </div>
                    <div :class="$style['detail-content']">
                        <span :class="$style['content-left']">{{
                            $text("S_PREMIUM_AMOUNT", "返水金额")
                        }}</span>
                        <div :class="$style['content-right']">
                            <template
                                v-if="
                                    caculateList.daily_upper_limit &&
                                        !caculateList.rebate
                                "
                                >{{ $t("S_UPPER_LIMIT") }}</template
                            >
                            <!-- <ele-loading v-if="rebateState === 'loading'" /> -->
                            <template>{{
                                caculateList.rebate
                            }}</template>
                        </div>
                    </div>
                    <div :class="$style['detail-content']">
                        <span :class="$style['content-left']">{{
                            $text("S_MINIMUM_PREMIUM_AMOUNT", "最低返水金额")
                        }}</span>
                        <div :class="$style['content-right']">
                            {{ caculateList.min_rebate }}
                        </div>
                    </div>
                    <div :class="$style['detail-content']">
                        <span :class="$style['content-left']">{{
                            $text("S_RECEIVE_NUMBER_TIMES", "可领取次数")
                        }}</span>
                        <div :class="$style['content-right']">
                            {{
                                caculateList.remaining_times
                                    ? caculateList.remaining_times
                                    : $t("S_UPPER_LIMIT")
                            }}
                        </div>
                    </div>
                </div>

                <div :class="$style['rebate-btn']">
                    <template
                        v-if="
                            !caculateList.remaining_times ||
                                caculateList.daily_upper_limit
                        "
                    >
                        <button :class="$style['unrebate-btn']">
                            {{ $t("S_UNABLE_PASS") }}
                        </button>
                    </template>
                    <!-- <ele-loading v-else-if="rebateState === 'loading'" /> -->
                    <template v-else>
                        <!-- 當返水金額符合最低返水金額才可領取 rebate 和 min_rebate -->
                        <a
                            v-if="caculateList.operateStatus"
                            id="receive-button"
                            :class="{
                                [$style['disable']]: btnReceiveLock[listIndex]
                            }"
                            href="###"
                            @click="popReceive(listIndex)"
                        >
                            {{ $t("S_RECEIVE") }}
                        </a>
                        <button v-else :class="$style['unrebate-btn']">
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
    </div>
</template>

<script>
import bbosRequest from "@/api/bbosRequest";
import { mapActions, mapGetters } from "vuex";

export default {
    components: {
        eleLoading: () =>
            import(
                /* webpackChunkName: 'eleLoading' */ "@/router/web/components/tpl/common/element/loading/square"
            )
    },
    data() {
        return {
            isShowTip: true,
            btnReceiveLock: false,
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
        siteStyleClass() {
            return {
                [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[
                    `site-${this.memInfo.user.domain}`
                ],
                [this.$style["preset-color"]]: !this.$style[
                    `site-${this.memInfo.user.domain}`
                ]
            };
        },
        messageText() {
            const messageText = this.$t("S_REMAINING_REBATE");
            return messageText.replace("%S", this.rebateInitData.hour);
        }
    },
    created() {
        this.getImmediateData();
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
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
