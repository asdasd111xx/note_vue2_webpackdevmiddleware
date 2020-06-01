<template>
    <div>
        <div v-if="immediateData.length > 0" :class="$style['content-wrap']">
            <div
                v-for="(caculateList, listIndex) in immediateData"
                :key="`caculate-${listIndex}`"
                :class="$style['content-item']"
            >
                <div :class="$style['rebate-header']">
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
                    1.结算周期自美东时日0点整为计算始点。
                </div>
                <div>
                    2.每日01:30:00候可进行试算，领取后请至派发记录查看记录。
                </div>
                <div>3.每30分钟可使用一次试算及领取服务。</div>
                <div>
                    4.实际领取金额与有效投注、损益时间时间以按下<领取>的时日为主,
                    若未达最低返利金额当次不提供领取。
                </div>
                <div>
                    5.周期结算时仍有剩余的返利金额，在结算后系统于上午3点主动派发。
                </div>
                <div>
                    6.另考虑到资眼刷新同步或平台维护时，可能造成试算、领取存在误差，如有遗漏或偏差敬请见谅
                </div>
                <div v-show="maintainsList">
                    {{ $t("S_CURRENT_PLATFORM") }}：
                    <span :class="$style['maintains-list']">{{
                        maintainsList
                    }}</span>
                </div>
            </div>
        </div>

        <template v-if="isShowPopup">
            <popup :is-show-popup.sync="isShowPopup" :amount="amountResult" />
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
            togglePopup: false,
            isShowTip: true,
            immediateData: [],
            rebateInitData: {},
            maintainsList: "",
            rebateState: "",
            amountResult: 0,
            dispatch_hour: 0
        };
    },
    computed: {
        ...mapGetters({
            systemTime: "getSystemTime",
            siteConfig: "getSiteConfig",
            memInfo: "getMemInfo"
        }),
        isShowPopup: {
            get() {
                return this.togglePopup;
            },
            set(value) {
                this.togglePopup = value;
            }
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
            this.rebateState = "loading";
            bbosRequest({
                method: "get",
                url: this.siteConfig.BBOS_DOMIAN + "/Wage/SelfDispatchInfo",
                reqHeaders: {
                    Vendor: this.memInfo.user.domain
                },
                params: { lang: "zh-cn" }
            }).then(response => {
                this.rebateState = "initial";
                if (response.status === "000") {
                    this.immediateData = response.data.entries

                    // 測試資料
                    // this.immediateData = [
                    //     {
                    //         period: "20200421",
                    //         start_at: "2020-04-21T12:00:00+0800",
                    //         end_at: "2020-04-21T07:15:18+0800",
                    //         sub_valid_bet: "14875039.6179",
                    //         sub_profit: "0.00",
                    //         state: 1,
                    //         self_times: 10,
                    //         self_min_limit: "10",
                    //         type: 1,
                    //         amount: "200.00"
                    //     }
                    // ];
                    return;
                }
            });
        },
        handleRebateProcess(type) {
            bbosRequest({
                method: "put",
                url: this.siteConfig.BBOS_DOMIAN + "/Wage/SelfDispatch",
                reqHeaders: {
                    Vendor: this.memInfo.user.domain
                },
                params: { lang: "zh-cn", type }
            }).then(response => {
                this.isShowPopup = true;
                if (response.status === "000") {
                    this.amountResult = response.data.dispatched_amount;
                }
            });
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
