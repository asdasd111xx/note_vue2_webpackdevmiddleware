<template>
    <div :class="mainClass">
        <div v-if="!detailInfo.oauth2" :class="$style['level-info']">
            <div
                :class="$style['card']"
                v-for="item in summaryList"
                :key="`level-${item.depth}`"
            >
                <div :class="$style['card-title']">
                    {{ levelTrans[item.depth] }}
                </div>
                <div>
                    <span>返利</span>
                    <span>{{ item.amount }}</span>
                </div>
                <div>
                    <span>{{ $text("S_VALID_BET", "有效投注") }}</span>
                    <span>{{ item.valid_bet }}</span>
                </div>
            </div>
        </div>
        <div v-if="!detailInfo.oauth2" class="main-wrap">
            <template v-if="friendsList.length">
                <table :class="$style['main-table']">
                    <thead>
                        <tr>
                            <th :class="$style.index">
                                {{ $text("S_NUMBER_NO", "序") }}
                            </th>
                            <th :class="$style['first-level']">
                                {{ $text("S_FIRST_LEVEL_FRIEND", "一级好友") }}
                            </th>
                            <th
                                :class="[
                                    $style['valid-bet'],
                                    { [$style.active]: sort === 'valid_bet' }
                                ]"
                                @click="onSort('valid_bet')"
                            >
                                <span>{{
                                    $text("S_VALID_BET", "有效投注")
                                }}</span>
                                <span v-if="sort === 'period'">
                                    <icon
                                        :name="
                                            `${
                                                order === 'desc'
                                                    ? 'long-arrow-alt-down'
                                                    : 'long-arrow-alt-up'
                                            }`
                                        "
                                        width="5"
                                        height="10"
                                    />
                                </span>
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
                            <th :class="$style.commission">
                                {{ $text("S_COMMISSION_01", "返利") }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(info, index) in controlData"
                            :key="`list-${info.id}`"
                        >
                            <td>{{ index + 1 }}</td>
                            <td>{{ info.username }}</td>
                            <td>
                                <div>{{ info.valid_bet | commaFormat }}</div>
                            </td>
                            <td>
                                <div>{{ info.wage_amount | commaFormat }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                    {{ $text("S_NO_DATA_TPL") }}
                </div>
            </template>
        </div>

        <div v-else class="main-wrap">
            <div :class="$style['detail-wrap']">
                <div :class="$style['rebate-wrap']">
                    <div :class="[$style.detail, 'clearfix']">
                        <span :class="[$style.text, $style.main]">
                            {{
                                $text("S_EXPECTED_LOSS_REBATE", "盈亏返利预估")
                            }}
                        </span>
                        <span
                            :class="[
                                $style.amount,
                                { [$style.deficit]: +detailList.amount < 0 }
                            ]"
                        >
                            {{ detailList.amount }}
                        </span>
                    </div>
                    <div :class="[$style.detail, 'clearfix']">
                        <span :class="[$style.text, $style.main]">
                            {{ $text("S_REBATE_LEVEL", "返利级别") }}
                        </span>
                        <span :class="[$style.amount]">
                            {{ detailList.rate }} %
                        </span>
                    </div>
                </div>

                <div :class="$style.date">
                    ({{ detailList.start_at | dateFormat }}-{{
                        detailList.end_at | dateFormat
                    }})
                </div>

                <div :class="$style['list-wrap']">
                    <div :class="[$style.detail, 'clearfix']">
                        <div :class="$style.text">
                            {{ $text("S_ACH_VALID_MEMBERS", "有效会员") }}
                        </div>
                        <div :class="$style.amount">
                            {{ detailList.valid_user }}
                            {{ $text("S_PERSON", "人") }}
                        </div>
                    </div>
                    <div :class="[$style.detail, 'clearfix']">
                        <div :class="$style.text">
                            {{ $text("S_VALID_BET", "有效投注") }}
                        </div>
                        <div :class="$style.amount">
                            {{ detailList.valid_bet }}
                        </div>
                    </div>
                    <div :class="[$style.detail, 'clearfix']">
                        <div :class="$style.text">
                            {{ $text("S_GAME_LOSS", "游戏盈亏") }}
                        </div>
                        <div
                            :class="[
                                $style.amount,
                                { [$style.deficit]: +detailList.profit < 0 }
                            ]"
                        >
                            {{ detailList.profit }}
                        </div>
                    </div>
                    <div :class="[$style.detail, 'clearfix']">
                        <div :class="$style.text">
                            {{ $text("S_SENT_RAKEBACK", "已派返水") }}
                        </div>
                        <div :class="$style.amount">
                            {{ detailList.dispatched_rebate }}
                        </div>
                    </div>
                    <div :class="[$style.detail, 'clearfix']">
                        <div :class="$style.text">
                            {{ $text("S_SENT_PROMOTIONS", "已派优惠") }}
                        </div>
                        <div :class="$style.amount">
                            {{ detailList.dispatched_offer }}
                        </div>
                    </div>
                    <div :class="[$style.detail, 'clearfix']">
                        <div :class="$style.text">
                            {{ $text("S_MEM_DEPOSIT", "会员入款") }}
                        </div>
                        <div :class="$style.amount">
                            {{ detailList.deposit }}
                        </div>
                    </div>
                    <div :class="[$style.detail, 'clearfix']">
                        <div :class="$style.text">
                            {{ $text("S_MEM_WITHDRAW", "会员出款") }}
                        </div>
                        <div :class="$style.amount">
                            {{ detailList.withdraw }}
                        </div>
                    </div>
                    <div :class="[$style.detail, 'clearfix']">
                        <div :class="$style.text">
                            {{ $text("S_PLATFORM_COST", "平台费") }}
                        </div>
                        <div :class="$style.amount">
                            {{ detailList.vendor_fee }}
                        </div>
                    </div>
                    <div
                        v-if="detailList.shift_amount"
                        :class="[$style.detail, 'clearfix']"
                    >
                        <div :class="$style.text">
                            {{ $text("S_SHIFT_AMOUNT", "上期結轉") }}
                        </div>
                        <div :class="$style.amount">
                            {{ $text("S_HAVE", "有") }}
                        </div>
                    </div>
                    <div :class="$style.tips">
                        如需帮助，请<span
                            :class="$style['service-btn']"
                            @click="$router.push('/mobile/service')"
                            >联系客服</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import InfiniteLoading from 'vue-infinite-loading';
import commissionDetail from "@/mixins/mcenter/commission/commissionDetail";

export default {
    components: {
        InfiniteLoading
    },
    mixins: [commissionDetail],
    computed: {
        ...mapGetters({
            memInfo: "getMemInfo"
        }),
        mainClass() {
            const site = `site-${this.memInfo.user.domain}`;

            return {
                "commission-detail-wrap": true,
                [this.$style[site]]: this.$style[site],
                [this.$style["preset-color"]]: !this.$style[site]
            };
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
