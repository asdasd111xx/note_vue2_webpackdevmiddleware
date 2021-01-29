<template>
  <div>
    <template v-if="$route.params.date">
      <div :class="[$style['date-wrap'], 'clearfix']">
        <template v-if="['ey1'].includes(themeTPL)">
          <div
            :class="{ [$style.active]: $route.params.date === 'week' }"
            @click="
              $router.replace('/mobile/mcenter/tcenter/management/member/week')
            "
          >
            <span>{{ $text("THIS_WEEK", "本周") }}</span>
          </div>
          <div
            :class="{ [$style.active]: $route.params.date === 'last' }"
            @click="
              $router.replace('/mobile/mcenter/tcenter/management/member/last')
            "
          >
            <span>{{ $text("S_LAST_WEEK", "上周") }}</span>
          </div>
          <div
            :class="{
              [$style.active]: $route.params.date === 'thirty'
            }"
            @click="
              $router.replace(
                '/mobile/mcenter/tcenter/management/member/thirty'
              )
            "
          >
            <span>{{ $text("S_NEARLY_THIRTY_DAYS", "近30天") }}</span>
          </div>
        </template>

        <template v-if="['porn1', 'sg1'].includes(themeTPL)">
          <div
            :class="{ [$style.active]: $route.params.date === 'today' }"
            @click="
              $router.replace('/mobile/mcenter/tcenter/management/member/today')
            "
          >
            <span>今日</span>
          </div>
          <div
            :class="{ [$style.active]: $route.params.date === 'yesterday' }"
            @click="
              $router.replace(
                '/mobile/mcenter/tcenter/management/member/yesterday'
              )
            "
          >
            <span>昨日</span>
          </div>
          <div
            :class="{
              [$style.active]: $route.params.date === 'thirty'
            }"
            @click="
              $router.replace(
                '/mobile/mcenter/tcenter/management/member/thirty'
              )
            "
          >
            <span>{{ $text("S_NEARLY_THIRTY_DAYS", "近30天") }}</span>
          </div>
        </template>
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
                  [$style.deficit]: 0 > +friendsStatistics.today_register
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
                  [$style.deficit]: 0 > +friendsStatistics.month_register
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
                  [$style.deficit]: 0 > +friendsStatistics.today_has_login
                }
              ]"
            >
              {{ friendsStatistics.today_has_login }}
            </div>
          </div>
          <div :class="$style['info-wrap']">
            <div :class="$style.text">
              {{ $text("S_WEEK_NO_LOGIN", "七日未登入") }}
            </div>
            <div
              :class="[
                $style.count,
                {
                  [$style.deficit]: 0 > +friendsStatistics.week_no_login
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
                  [$style.deficit]: 0 > +friendsStatistics.today_has_bet
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
                  [$style.deficit]: 0 > +friendsStatistics.today_has_deposit
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
                  [$style.deficit]: 0 > +friendsStatistics.valid_bet
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
                  [$style.deficit]: 0 > +friendsStatistics.payoff
                }
              ]"
            >
              {{ friendsStatistics.payoff }}
            </div>
          </div>
          <div :class="$style['info-wrap']">
            <div :class="$style.text">
              {{ $text("S_TODAY_DEPOSIT_AMOUNT", "今日存款金额") }}
            </div>
            <div
              :class="[
                $style.count,
                {
                  [$style.deficit]: 0 > +friendsStatistics.deposit
                }
              ]"
            >
              {{ friendsStatistics.deposit }}
            </div>
          </div>
          <div :class="$style['info-wrap']">
            <div :class="$style.text">
              {{ $text("S_TODAY_WITHDRAW_AMOUNT", "今日出款金额") }}
            </div>
            <div
              :class="[
                $style.count,
                {
                  [$style.deficit]: 0 > +friendsStatistics.withdraw
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
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
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
      if (this.themeTPL === "ey1") {
        this.$router.replace({
          name: "mcenter-tcenter-management",
          params: { page: "member", date: "week" }
        });
      } else {
        this.$router.replace({
          name: "mcenter-tcenter-management",
          params: { page: "member", date: "today" }
        });
      }
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
