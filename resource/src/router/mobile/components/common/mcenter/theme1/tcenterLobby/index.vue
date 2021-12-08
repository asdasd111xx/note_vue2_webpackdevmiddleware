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
        @click="$router.push('/mobile/mcenter/home')"
      />
      <div :class="$style['title-label']">我的推广</div>
      <div
        v-if="!rewardOnlyLocal"
        :class="$style['title-commission']"
        @click="
          $router.push('/mobile/mcenter/tcenterManageRebate/profit/profit')
        "
      >
        盈亏返利
      </div>
    </div>
    <div :class="$style['main']">
      <!-- <div :class="[$style['top-bg']]"></div> -->
      <div v-if="friendsStatistics" :class="$style['top-data']">
        <div :class="$style['list-data']">
          <div :class="$style['list-name']">
            {{ isShowRebate ? "最新可领实返" : "今日已领返利" }}
            <div
              v-if="isShowRebate"
              :class="$style['list-btn']"
              @click="
                $router.push('/mobile/mcenter/tcenterManageRebate/real/receive')
              "
            >
              {{ getRebateText }}
            </div>
          </div>
          <div :class="$style['list-value']">
            {{ isShowRebate ? rebateCount : summary.today.amount || "--" }}
          </div>
        </div>
        <div :class="$style['list-data']">
          <div :class="$style['list-name']">
            今日有效投注
            <div
              v-if="isShowRebate"
              :class="$style['list-btn']"
              @click="
                $router.push(
                  '/mobile/mcenter/tcenterManageRebate/real/detail?toDetail=Y&total=total'
                )
              "
            >
              详情
            </div>
          </div>
          <div :class="$style['list-value']">
            {{
              isShowRebate
                ? subValidBet
                : Number(friendsStatistics.valid_bet) > 0
                ? friendsStatistics.valid_bet
                : "--"
            }}
          </div>
        </div>
        <div :class="$style['list-data']">
          <div :class="$style['list-name']">
            {{ isShowRebate ? "今日有效会员" : "今日活跃会员" }}
          </div>
          <div :class="$style['list-value']">
            {{
              isShowRebate
                ? subUserCount
                : Number(friendsStatistics.today_has_login) > 0
                ? friendsStatistics.today_has_login
                : "--"
            }}
          </div>
        </div>
      </div>
      <div v-if="friendsStatistics" :class="$style['regist-data']">
        <div :class="$style['all-regist-title']">
          <div :class="$style['regist-title-bar']"></div>
          <div :class="$style['regist-title-text']">全部下级概况</div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">今日注册人数</div>
          <div :class="$style['regist-value']">
            {{ formatToPrice(friendsStatistics.today_register) }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">今日充值人数</div>
          <div :class="$style['regist-value']">
            {{ formatToPrice(friendsStatistics.today_has_deposit) }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">一级好友人数</div>
          <div :class="$style['regist-value']">
            {{ formatToPrice(levelList[0].total) }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">全部下级人数</div>
          <div :class="$style['regist-value']">
            {{ formatToPrice(friendsStatistics.user_count) }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">今日投注会员</div>
          <div :class="$style['regist-value']">
            {{ formatToPrice(friendsStatistics.today_has_bet) }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">今日损益金额</div>
          <div
            :class="[
              $style['regist-value'],
              { [$style['game-lose']]: Number(friendsStatistics.payoff) < 0 }
            ]"
          >
            {{ getNoRoundText(friendsStatistics.payoff) }}
          </div>
        </div>
        <div :class="$style['today-pay-content']">
          <div :class="$style['today-title']">
            <div :class="$style['topday-content']">
              <div :class="[$style['title-point'], $style['deposit']]"></div>
              <div :class="$style['title-text']">今日充值金额</div>
            </div>
            <div :class="[$style['topday-content'], $style['left']]">
              <div :class="$style['title-text']">今日提现金额</div>
              <div :class="[$style['title-point'], $style['withdraw']]"></div>
            </div>
          </div>
          <div :class="$style['today-bar']">
            <div :class="$style['background-bar']">
              <div
                :class="[$style['person-bar'], { [$style['isZero']]: isZero }]"
                :style="{ width: `${moneyPerson}%` }"
              />
            </div>
          </div>
          <div :class="$style['today-count']">
            <div :class="$style['count-text']">
              {{ getNoRoundText(friendsStatistics.deposit) }}
            </div>
            <div :class="$style['count-text']">
              {{ getNoRoundText(friendsStatistics.withdraw) }}
            </div>
          </div>
        </div>
      </div>
      <div :class="[$style['special']]">
        <div :class="[$style['special-content']]">
          <div
            :class="[$style['special-data'], [$style['first']]]"
            :style="
              transPointType ? { width: `${100 / 3}%` } : { width: `48%` }
            "
            @click="
              $router.push(
                '/mobile/mcenter/tcenterManageTeam/newCommission/today'
              )
            "
          >
            <div :class="[$style['special-data-img']]">
              <img
                :class="[$style['img-icon']]"
                :src="
                  $getCdnPath(
                    `/static/image/${themeTPL}/mcenter/tcenter/btn_group.png`
                  )
                "
              />
            </div>
            <div>团队管理</div>
          </div>
          <div
            :class="[$style['special-data']]"
            :style="
              transPointType ? { width: `${100 / 3}%` } : { width: `48%` }
            "
            @click="
              $router.push('/mobile/mcenter/tcenterManageRebate/record/today')
            "
          >
            <div :class="[$style['special-data-img']]">
              <img
                :class="[$style['img-icon']]"
                :src="
                  $getCdnPath(
                    `/static/image/${themeTPL}/mcenter/tcenter/btn_reward.png`
                  )
                "
              />
            </div>
            <div>返利管理</div>
          </div>
          <div
            v-if="transPointType"
            :class="[$style['special-data']]"
            :style="
              transPointType ? { width: `${100 / 3}%` } : { width: `48%` }
            "
            @click="$router.push(data.path)"
          >
            <div :class="[$style['special-data-img']]">
              <img
                :class="[$style['img-icon']]"
                :src="
                  $getCdnPath(
                    `/static/image/${themeTPL}/mcenter/tcenter/btn_transfer.png`
                  )
                "
              />
            </div>
            <div>转点管理</div>
          </div>
        </div>
      </div>
      <!-- <div :class="$style['rebate-content']">
        <img
          :class="$style['img-icon']"
          :src="
            $getCdnPath(
              `/static/image/${themeTPL}/mcenter/tcenter/btn_team.png`
            )
          "
          @click="
            $router.push('/mobile/mcenter/tcenterManageTeam/firstFriends')
          "
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
      </div> -->
      <div
        :class="[
          $style['special'],
          { [$style['less']]: specialData.length < 3 }
        ]"
      >
        <!-- <div :class="$style['special-title']">特色功能</div> -->
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
      <template v-if="cardList">
        <div v-for="(item, index) in cardList" :key="`key-${index}`">
          <img
            :class="$style['promote-content']"
            :src="item.image"
            @click="openApiLink(item)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import friendsStatistics from "@/mixins/mcenter/management/friendsStatistics";
import goLangApiRequest from "@/api/goLangApiRequest";
import { API_COMMISSION_SUMMARY } from "@/config/api";
import ajax from "@/lib/ajax";
export default {
  components: {},
  mixins: [friendsStatistics],
  data() {
    return {
      subValidBet: 0,
      subUserCount: 0,
      isShowRebate: true,
      getRebateText: "",
      rebateCount: "",
      levelList: [[{ total: 0 }]],
      allTotal: [],
      transPointType: false,
      summary: { today: { amount: 0 } },
      immediateData: [],
      specialList: [
        {
          showType: true,
          name: "推广信息",
          image: "ic_information",
          path: "/mobile/mcenter/newRecommend?makeFriend=true"
        },
        {
          showType: true,
          name: "团队报表",
          image: "ic_groupreport",
          path: "/mobile/mcenter/tcenterManageTeam/firstFriends/today"
        },
        {
          showType: true,
          name: "下级统计",
          image: "ic_lowerlevel",
          path:
            "/mobile/mcenter/tcenterManageTeam/nextLevelCount/today-register"
        },
        {
          showType: true,
          name: "推荐礼金",
          image: "ic_giftmoney",
          path: "/mobile/mcenter/tcenterManageRebate/recommendGift/today"
        }
      ],
      cardList: []
    };
  },
  created() {
    this.getRebateSwitch();
    this.getLevelList();

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
      const style = this[`$style_${this.siteConfig.ROUTER_TPL}`];
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    routerTPL() {
      //先用ROUTER_TPL判斷aobo
      return this.siteConfig.ROUTER_TPL;
    },
    /**
     * 返利是否有開啟第三方返利時
     */
    rewardOnlyLocal() {
      return this.memInfo.config.wage.indexOf("commission") === -1;
    }
  },
  mounted() {
    this.promotionImageLink();
  },
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
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/SelfDispatchInfo`,
        params: { lang: "zh-cn" }
      }).then(response => {
        this.isReceive = true;

        if (response.status === "000") {
          let dataArray = [];

          dataArray = response.data.ret.entries;
          this.isShowRebate = !(response.data.ret.show_real_time === false);
          if (this.isShowRebate) {
            this.subValidBet = response.data.total.valid_bet.sub_valid_bet
              ? this.getNoRoundText(response.data.total.valid_bet.sub_valid_bet)
              : "--";

            this.subUserCount = response.data.total.valid_bet.sub_user_count
              ? this.formatToPrice(response.data.total.valid_bet.sub_user_count)
              : "--";

            this.immediateData = dataArray.length > 0 ? dataArray[0] : null;

            if (response.data.total.valid_bet.accounting) {
              this.getRebateText = "计算中";
              this.rebateCount = "--";
            } else if (this.immediateData && this.immediateData.state === 1) {
              // 可領
              this.getRebateText = "领取";
              this.rebateCount = this.getNoRoundText(this.immediateData.amount);
            } else {
              // 已达上限
              this.getRebateText = "查看";
              this.rebateCount = "0.00";
            }
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
          } else {
            this.getSummary();
          }
          return;
        }
      });
    },
    /**
     * 取得各級好友的資訊
     * @method getLevelList
     */
    getLevelList() {
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Stats/Player/Friends/TransReport`,
        params: {
          lang: "zh-cn",
          startAt: new Date(),
          endAt: new Date()
        }
      })
        .then(res => {
          const { data, status, errorCode } = res;
          if (status !== "000" || errorCode !== "00") {
            return;
          }

          this.allTotal = {
            total: 0,
            register: 0,
            deposit: 0,
            withdraw: 0
          };

          this.levelList = [];
          this.levelList = data.map(info => {
            this.allTotal.total += +info.total;
            this.allTotal.register += +info.register;
            this.allTotal.deposit += +info.deposit;
            this.allTotal.withdraw += +info.withdraw;
            return info;
          });
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          this.actionSetGlobalMessage({
            msg
          });
        });
    },
    /**
     * 取得收益概況
     */
    getSummary() {
      ajax({
        method: "get",
        url: API_COMMISSION_SUMMARY,
        success: ({ result, ret }) => {
          if (result !== "ok") {
            return;
          }

          this.summary = ret;
        }
      });
    },
    openPromotion(position) {
      let newWindow = "";
      newWindow = window.open();
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
        params: {
          urlName: position,
          lang: "zh-cn",
          needToken: "false"
        }
      }).then(res => {
        if (res && res.data && res.data.uri) {
          newWindow.location = res.data.uri;
        } else {
          newWindow.close();
        }
      });
    },
    /**
     * 取得外部網址連結-我的推廣專用(有按順序) C02.325
     * @method promotionImageLink
     */
    promotionImageLink() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/For/My/Promote`
      }).then(res => {
        if (res.data && res.status === "000") {
          this.cardList = res.data ?? [];
        }
      });

      //     {
      //       "id": 128,
      //       "domain": "500015",
      //       "url_name": "myPromote",
      //       "url": "https://rlt.yaboxxxcs.net/chat/text/chat_0cUEpU.html?skill=8ae482a07b065f30017b0ed952e513c4",
      //       "name": "測試",
      //       "sequence": 1,
      //       "image": "https://images.bbin-asia.com/externalLink/500015/128_long.png?v=1631772922"
      //     }
    },
    openApiLink(item) {
      const { name, url } = item;
      // console.log(url);
      localStorage.setItem("iframe-third-url-title", name) || "";
      let thirdUrl = "";
      if (!url.includes("http")) {
        thirdUrl = `https://${url}`;
      } else {
        thirdUrl = url;
      }
      localStorage.setItem("iframe-third-url", thirdUrl) || "";

      this.$router.push(`/mobile/iframe/tcenterLobby?func=false&title=${name}`);
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/aobo1.module.scss" module="$style_aobo1"></style>
<style lang="scss" src="./css/sp1.module.scss" module="$style_sp1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
