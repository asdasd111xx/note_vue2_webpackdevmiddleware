<template>
    <div :class="mainClass">
        <template v-if="$route.params.date">
            <div :class="[$style['date-wrap'], 'clearfix']">
                <div
                    :class="{ [$style.active]: $route.params.date === 'week' }"
                    @click="
                        $router.push(
                            '/mobile/mcenter/tcenter/management/member/week'
                        )
                    "
                >
                    <span>{{ $text("THIS_WEEK", "本周") }}</span>
                </div>
                <div
                    :class="{ [$style.active]: $route.params.date === 'last' }"
                    @click="
                        $router.push(
                            '/mobile/mcenter/tcenter/management/member/last'
                        )
                    "
                >
                    <span>{{ $text("S_LAST_WEEK", "上周") }}</span>
                </div>
                <div
                    :class="{
                        [$style.active]: $route.params.date === 'thirty'
                    }"
                    @click="
                        $router.push(
                            '/mobile/mcenter/tcenter/management/member/thirty'
                        )
                    "
                >
                    <span>{{ $text("S_NEARLY_THIRTY_DAYS", "近30天") }}</span>
                </div>
            </div>
            <all-friends :period="$route.params.date" />
        </template>

        <template v-else>
            <template v-if="friendsStatistics">
                <div :class="[$style['member-total'], 'clearfix']">
                    <div :class="$style['member-text']">
                        {{ $text("S_MEMBER_TOTAL", "会员总数") }}
                    </div>
                    <div :class="$style['member-count']">
                        {{ friendsStatistics.user_count }}
                    </div>
                </div>
                <div class="member-info clearfix">
                    <div :class="$style['info-wrap']">
                        <div :class="$style.text">
                            {{ $text("S_TODAY_REGISTER", "今日注册") }}
                        </div>
                        <div
                            :class="[
                                $style.count,
                                {
                                    [$style.deficit]:
                                        0 > +friendsStatistics.today_register
                                }
                            ]"
                        >
                            {{ friendsStatistics.today_register }}
                        </div>
                    </div>
                    <div :class="$style['info-wrap']">
                        <div :class="$style.text">
                            {{ $text("S_MONTH_REGISTER", "本月注册") }}
                        </div>
                        <div
                            :class="[
                                $style.count,
                                {
                                    [$style.deficit]:
                                        0 > +friendsStatistics.month_register
                                }
                            ]"
                        >
                            {{ friendsStatistics.month_register }}
                        </div>
                    </div>
                    <div :class="$style['info-wrap']">
                        <div :class="$style.text">
                            {{ $text("S_TODAY_HAS_LOGIN_2", "今日活跃") }}
                        </div>
                        <div
                            :class="[
                                $style.count,
                                {
                                    [$style.deficit]:
                                        0 > +friendsStatistics.today_has_login
                                }
                            ]"
                        >
                            {{ friendsStatistics.today_has_login }}
                        </div>
                    </div>
                    <div :class="$style['info-wrap']">
                        <div :class="$style.text">
                            {{ $text("S_WEEK_NO_LOGIN", "7日未登入") }}
                        </div>
                        <div
                            :class="[
                                $style.count,
                                {
                                    [$style.deficit]:
                                        0 > +friendsStatistics.week_no_login
                                }
                            ]"
                        >
                            {{ friendsStatistics.week_no_login }}
                        </div>
                    </div>
                    <div :class="$style['info-wrap']">
                        <div :class="$style.text">
                            {{ $text("S_TODAY_HAS_BET", "今日投注会员") }}
                        </div>
                        <div
                            :class="[
                                $style.count,
                                {
                                    [$style.deficit]:
                                        0 > +friendsStatistics.today_has_bet
                                }
                            ]"
                        >
                            {{ friendsStatistics.today_has_bet }}
                        </div>
                    </div>
                    <div :class="$style['info-wrap']">
                        <div :class="$style.text">
                            {{ $text("S_TODAY_HAS_DEPOSIT", "今日存款会员") }}
                        </div>
                        <div
                            :class="[
                                $style.count,
                                {
                                    [$style.deficit]:
                                        0 > +friendsStatistics.today_has_deposit
                                }
                            ]"
                        >
                            {{ friendsStatistics.today_has_deposit }}
                        </div>
                    </div>
                    <div :class="$style['info-wrap']">
                        <div :class="$style.text">
                            {{ $text("S_TODAY_VALID_BET", "今日有效投注") }}
                        </div>
                        <div
                            :class="[
                                $style.count,
                                {
                                    [$style.deficit]:
                                        0 > +friendsStatistics.valid_bet
                                }
                            ]"
                        >
                            {{ friendsStatistics.valid_bet }}
                        </div>
                    </div>
                    <div :class="$style['info-wrap']">
                        <div :class="$style.text">
                            {{ $text("S_TODAY_PAYOFF", "今日输赢") }}
                        </div>
                        <div
                            :class="[
                                $style.count,
                                {
                                    [$style.deficit]:
                                        0 > +friendsStatistics.payoff
                                }
                            ]"
                        >
                            {{ friendsStatistics.payoff }}
                        </div>
                    </div>
                    <div :class="$style['info-wrap']">
                        <div :class="$style.text">
                            {{
                                $text("S_TODAY_DEPOSIT_AMOUNT", "今日存款金额")
                            }}
                        </div>
                        <div
                            :class="[
                                $style.count,
                                {
                                    [$style.deficit]:
                                        0 > +friendsStatistics.deposit
                                }
                            ]"
                        >
                            {{ friendsStatistics.deposit }}
                        </div>
                    </div>
                    <div :class="$style['info-wrap']">
                        <div :class="$style.text">
                            {{
                                $text("S_TODAY_WITHDRAW_AMOUNT", "今日出款金额")
                            }}
                        </div>
                        <div
                            :class="[
                                $style.count,
                                {
                                    [$style.deficit]:
                                        0 > +friendsStatistics.withdraw
                                }
                            ]"
                        >
                            {{ friendsStatistics.withdraw }}
                        </div>
                    </div>
                </div>
            </template>
            <div :class="$style['btn-check']" @click="onCheck">
                {{ $text("S_CHECK_SUB_STATISTICS", "查看下级统计") }}
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import friendsStatistics from "@/mixins/mcenter/management/friendsStatistics";

export default {
    components: {
        allFriends: () =>
            import(/* webpackChunkName: 'allFriends' */ "../allFriends")
    },
    mixins: [friendsStatistics],
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
    computed: {
        ...mapGetters({
            memInfo: "getMemInfo"
        }),
        mainClass() {
            const site = `site-${this.memInfo.user.domain}`;

            return {
                "member-info-wrap": true,
                [this.$style[site]]: this.$style[site],
                [this.$style["preset-color"]]: !this.$style[site]
            };
        }
    },
    watch: {
        // eslint-disable-next-line
        "$route.params.date"() {
            if (this.$route.params.date) {
                this.setTabState(false);
                this.setHeaderTitle(this.$text("S_SUB_STATISTICS", "下级统计"));
                return;
            } else {
                this.setTabState(true);
                this.setHeaderTitle(this.$text("S_TEAM_CENTER", "我的推广"));
            }
        }
    },
    created() {
        if (!this.$route.params.date) {
            return;
        }

        // 當 route.params 含有 date，且重新整理時
        this.setTabState(false);
        this.setHeaderTitle(this.$text("S_SUB_STATISTICS", "下级统计"));
    },
    methods: {
        onCheck() {
            this.$router.push({
                name: "mcenter-tcenter-management",
                params: { page: "member", date: "week" }
            });
        }
    }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.date-wrap {
    margin-bottom: 10px;
    background-color: #fff;

    > div {
        position: relative;
        float: left;
        width: 33.333%;
        height: 42px;
        line-height: 42px;
        border-bottom: 2px solid transparent;
        color: $main_text_color2;
        font-size: 14px;
        text-align: center;

        &.active {
            color: #5e525d;

            &::after {
                content: "";
                position: absolute;
                width: 43px;
                height: 2px;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                background: #be9e7f;
            }
        }
    }
}

.member-total {
    padding: 0 23px;
    background-color: #e9dacc;

    > div {
        height: 37px;
        line-height: 37px;
        font-size: 14px;
    }
}

.member-text {
    float: left;
    color: $main_discover_color1;
}

.member-count {
    float: right;
    color: $main_title_color1;
}

.info-wrap {
    float: left;
    width: 50%;
    padding: 11px 0;
    border-bottom: 1px solid #f6f6f6;
    background-color: #fff;
    text-align: center;

    &:nth-child(2n + 1) {
        border-right: 1px solid #f6f6f6;
    }
}

.text {
    overflow: hidden;
    line-height: 14px;
    padding: 0 3px;
    color: #aaa;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.count {
    overflow: hidden;
    line-height: 20px;
    margin-top: 15px;
    padding: 0 3px;
    color: #000;
    font-size: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.deficit {
        color: #f00;
    }
}

.btn-check {
    width: 90%;
    height: 47px;
    line-height: 47px;
    margin: 45px auto;
    border-radius: 4px;
    background: linear-gradient(to left, #bd9d7d, #f9ddbd);
    color: #fff;
    font-size: 15px;
    text-align: center;
}
</style>
