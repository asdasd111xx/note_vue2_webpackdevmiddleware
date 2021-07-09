<template>
  <div>
    <div :class="$style['title']">
      <img
        :class="$style['title-icon']"
        :src="
          $getCdnPath(
            `/static/image/${themeTPL}/mcenter/tcenter/icon_home_n.png`
          )
        "
        @click="$router.replace('/mobile/mcenter')"
      />
      <div :class="$style['title-label']">我的推广</div>
      <div
        :class="$style['title-commission']"
        @click="$router.push('/mobile/mcenter/tcenter/commission/summary')"
      >
        收益概况
      </div>
    </div>
    <div :class="$style['main']">
      <!-- <div :class="[$style['top-bg']]"></div> -->
      <div v-if="friendsStatistics" :class="$style['top-data']">
        <div
          :class="$style['list-data']"
          v-for="(item, index) in titleContent"
          :key="index"
        >
          <div :class="$style['list-name']">
            {{ item.title }}
            <span
              v-if="item.button"
              :class="$style['list-button']"
              @click="
                $router.replace({
                  path: `${item.path}`
                })
              "
              >{{ item.button }}</span
            >
          </div>

          <div :class="$style['list-value']">
            {{ item.item }}
          </div>
        </div>
      </div>
      <div v-if="friendsStatistics" :class="$style['regist-data']">
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">今日注册</div>
          <div :class="$style['regist-value']">
            {{ formatToPrice(friendsStatistics.today_register) }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">本月注册</div>
          <div :class="$style['regist-value']">
            {{ formatToPrice(friendsStatistics.month_register) }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">注册总数</div>
          <div :class="$style['regist-value']">
            {{ formatToPrice(friendsStatistics.user_count) }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">今日损益</div>
          <div :class="$style['regist-value']">
            {{ getNoRoundText(friendsStatistics.payoff) }}
          </div>
        </div>
      </div>
      <div :class="$style['rebate-content']">
        <img
          :class="$style['img-icon']"
          :src="
            $getCdnPath(
              `/static/image/${themeTPL}/mcenter/tcenter/btn_team.png`
            )
          "
          @click="$router.push('/mobile/mcenter/tcenter/management/member')"
        />
        <img
          :class="$style['img-icon']"
          :src="
            $getCdnPath(
              `/static/image/${themeTPL}/mcenter/tcenter/btn_rebata.png`
            )
          "
          @click="$router.push('/mobile/mcenter/tcenterManageRebate/record')"
        />
      </div>
      <div
        :class="[
          $style['special'],
          { [$style['less']]: specialData.length < 3 }
        ]"
      >
        <div :class="$style['special-title']">特色功能</div>
        <div
          :class="[
            $style['special-content'],
            { [$style['less']]: specialData.length < 3 }
          ]"
        >
          <div
            v-for="(data, index) in specialData"
            :style="
              specialData.length > 2
                ? { width: `${100 / specialData.length}%` }
                : {}
            "
            :key="data.name"
            :class="[
              $style['special-data'],
              { [$style['less']]: specialData.length < 3 },
              { [$style['first']]: index === 0 }
            ]"
            @click="$router.push(data.path)"
          >
            <div :class="[$style['special-data-img']]">
              <img
                :class="[
                  $style['img-icon'],
                  { [$style['less']]: specialData.length < 3 }
                ]"
                :src="
                  $getCdnPath(
                    `/static/image/${themeTPL}/mcenter/tcenter/${data.image}.png`
                  )
                "
              />
            </div>
            <div>{{ data.name }}</div>
          </div>
        </div>
      </div>
      <img
        :class="$style['promote-content']"
        :src="
          $getCdnPath(
            `/static/image/${themeTPL}/mcenter/tcenter/five_level.png`
          )
        "
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import commissionOverview from "@/mixins/mcenter/commission/commissionOverview";
import friendsStatistics from "@/mixins/mcenter/management/friendsStatistics";
import bbosRequest from "@/api/bbosRequest";
export default {
  components: {},
  mixins: [friendsStatistics, commissionOverview],
  data() {
    return {
      isShowRebate: true,
      titleContent: [],
      specialList: [
        {
          showType: true,
          name: "推广信息",
          image: "ic_information",
          path: "/mobile/mcenter/tcenter/management/promote"
        },
        {
          showType: true,
          name: "下级好友",
          image: "ic_friend",
          path: "/mobile/mcenter/tcenter/management/friends"
        },
        {
          showType: true,
          name: "游戏记录",
          image: "ic_gamerecord",
          path: "/mobile/mcenter/tcenter/gameRecord/main"
        },
        {
          showType: true,
          name: "推荐礼金",
          image: "ic_giftmoney",
          path: "/mobile/mcenter/tcenter/recommendGift"
        }
      ]
    };
  },
  created() {
    this.getRebateSwitch();

    this.specialData.forEach(element => {
      if (element.name === "推荐礼金") {
        element.showType = this.memInfo.config.festival;
      }
    });
  },
  watch: {},
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    specialData() {
      return this.specialList.filter(i => i.showType);
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  mounted() {},
  methods: {
    formatToPrice(value) {
      //千分位
      return `${Number(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    getNoRoundText(value) {
      //千分位＋小數點後兩位
      return `${Number(value)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    getRebateSwitch() {
      this.isReceive = false;

      // 因開關在此 api 的回傳，所以在入口點先呼叫此 api
      bbosRequest({
        method: "get",
        url: this.siteConfig.BBOS_DOMIAN + "/Wage/SelfDispatchInfo",
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: { lang: "zh-cn" }
      }).then(response => {
        this.isReceive = true;

        if (response.status === "000") {
          this.isShowRebate = response.data.ret.show_real_time;
          let total = response.data.total ?? "";
          let entries = response.data.entries ?? "";

          //沒開實返標題內容
          this.titleContent = [
            {
              title: "今日已领返利",
              item: this.todayAmout ?? "0.00"
            },
            {
              title: "今日有效投注",
              item: friendsStatistics.valid_bet ?? "0.00"
            },
            {
              title: "今日活跃会员",
              item: friendsStatistics.today_has_bet ?? "0.00"
            }
          ];

          //開實返標題內容
          if (this.isShowRebate) {
            let available =
              total.accounting ||
              (entries?.state === 3 && entries?.self_times === 0)
                ? "--"
                : entries
                ? this.getNoRoundText(entries[0]?.amount)
                : "0.00";

            let subValidBet = total.valid_bet.sub_valid_bet
              ? this.getNoRoundText(total.valid_bet.sub_valid_bet)
              : "--";

            let subUserCount = total.valid_bet.sub_user_count
              ? this.formatToPrice(total.valid_bet.sub_user_count)
              : "--";

            this.titleContent = [
              {
                title: "最新可领实返",
                button: total.accounting
                  ? "计算中"
                  : entries?.self_times > 0
                  ? "领取"
                  : "查看",
                item: available,
                path: "tcenterManageRebate/real/receive"
              },
              {
                title: "今日有效投注",
                button: total.accounting ? "计算中" : "详情",
                item: subValidBet,
                path: "tcenterManageRebate/real/detail"
              },
              { title: "今日有效会员", item: subUserCount }
            ];
          }
          return;
        }
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
