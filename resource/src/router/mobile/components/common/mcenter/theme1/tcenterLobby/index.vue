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
        @click="$router.back()"
      />
      <div :class="$style['title-label']">我的推广</div>
      <div :class="$style['title-commission']">收益概况</div>
    </div>
    <div :class="$style['main']">
      <!-- <div :class="[$style['top-bg']]"></div> -->
      <div v-if="friendsStatistics" :class="$style['top-data']">
        <div
          v-if="isShowRebate"
          :class="$style['list-data']"
          @click="$router.push('/mobile/mcenter/tcenter/commission/rebate')"
        >
          <div :class="$style['list-name']">实时返利</div>
          <div :class="$style['list-value']">领取 ></div>
        </div>
        <div :class="$style['list-data']">
          <div :class="$style['list-name']">今日有效投注</div>
          <div :class="$style['list-value']">
            {{ friendsStatistics.valid_bet }}
          </div>
        </div>
        <div :class="$style['list-data']">
          <div :class="$style['list-name']">今日活跃会员</div>
          <div :class="$style['list-value']">
            {{ friendsStatistics.today_has_login }}
          </div>
        </div>
      </div>
      <div v-if="friendsStatistics" :class="$style['regist-data']">
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">今日注册</div>
          <div :class="$style['regist-value']">
            {{ friendsStatistics.today_register }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">本月注册</div>
          <div :class="$style['regist-value']">
            {{ friendsStatistics.month_register }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">注册总数</div>
          <div :class="$style['regist-value']">
            {{ friendsStatistics.user_count }}
          </div>
        </div>
        <div :class="$style['regist-content']">
          <div :class="$style['regist-title']">今日损益</div>
          <div :class="$style['regist-value']">
            {{ friendsStatistics.payoff }}
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
          @click="$router.push('/mobile/mcenter/tcenter/commission/record')"
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
            :key="data.name"
            :class="[
              $style['special-data'],
              { [$style['less']]: specialData.length < 3 },
              { [$style['first']]: index === 0 }
            ]"
            @click="$router.push(data.path)"
          >
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
import friendsStatistics from "@/mixins/mcenter/management/friendsStatistics";
import bbosRequest from "@/api/bbosRequest";
export default {
  components: {},
  mixins: [friendsStatistics],
  data() {
    return {
      isShowRebate: true,
      specialData: [
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
  },
  watch: {},
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
  mounted() {},
  methods: {
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
          this.isShowRebate = response.data.show_real_time;
          return;
        }
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
