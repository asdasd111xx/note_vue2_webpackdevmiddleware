<template>
  <div :class="[$style['first-friends-table'], $style[themeTPL]]">
    <breakcrumb
      v-if="['porn1', 'sg1'].includes(themeTPL) && isEnterNextLayers"
      :depth="firstFriends.depth"
      :list="currentSavedFreindList"
      @click="clickTargetFriend"
    />
    <template v-if="themeTPL === 'ey1'">
      <div :class="$style.thead">
        <div :class="[$style.row, 'clearfix']">
          <!-- 序 -->
          <div :class="[$style.column, $style.number]">
            {{ $text("S_NUMBER_NO") }}
          </div>
          <!-- 在線 -->
          <div :class="[$style.column, $style.online]">
            {{ $text("S_ONLINE") }}
          </div>
          <!-- 會員帳號 -->
          <div :class="[$style.column, $style.username]">
            {{ $text("S_NAME") }}
          </div>
          <!-- 狀態 -->
          <div :class="[$style.column, $style.status]">
            {{ $text("S_STATUS") }}
          </div>
          <!-- 主帳戶餘額 -->
          <div :class="[$style.column, $style.balance]">
            {{ $text("S_MAIN_BALANCE") }}
          </div>
        </div>
      </div>
    </template>

    <!-- 資料列表 -->
    <template
      v-if="firstFriends && firstFriends.list && firstFriends.list.length > 0"
    >
      <!-- 億元 -->
      <div v-if="themeTPL === 'ey1'" :class="$style.tbody">
        <template v-for="(info, index) in firstFriends.list">
          <div
            :key="index"
            :class="[$style.row, 'clearfix']"
            @click="pushing(index)"
          >
            <!-- 序 -->
            <div :class="[$style.column, $style.number]">
              <span>{{ index + 1 }}</span>
            </div>
            <!-- 在線 -->
            <div :class="[$style.column, $style.online]">
              <span
                :class="[
                  $style['icon-online'],
                  { [$style.active]: isOnline(info) }
                ]"
              />
            </div>
            <!-- 會員帳號 -->
            <div :class="[$style.column, $style.username]">
              <span>{{ info.username }}</span>
            </div>
            <!-- 狀態 -->
            <div :class="[$style.column, $style.status]">
              <!-- 啟用 -->
              <template v-if="info.enable">
                <!-- 凍結 -->
                <span
                  v-if="info.locked"
                  :class="{ [$style.locked]: info.locked }"
                  >{{ $text("S_LOCKED") }}</span
                >
                <!-- 停權 -->
                <span
                  v-else-if="info.bankrupt"
                  :class="{ [$style.bankrupt]: info.bankrupt }"
                  >{{ $text("S_BANKRUPT") }}</span
                >
                <!-- 啟用 -->
                <span v-else :class="{ [$style.enable]: info.enable }">{{
                  $text("S_ENABLE")
                }}</span>
              </template>

              <!-- 停用 -->
              <template v-if="!info.enable">
                <span :class="{ [$style.disable]: !info.enable }">{{
                  $text("S_DISABLE")
                }}</span>
              </template>
            </div>
            <!-- 主帳戶餘額 -->
            <div :class="[$style.column, $style.balance]">
              <span :class="$style.money">{{
                info.cash.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }}</span>
              <span
                :class="[
                  $style['icon-info'],
                  { [$style.expend]: isShow(index) }
                ]"
              />
            </div>
            <!-- 詳細資料 -->
            <div v-show="isShow(index)" :class="$style['info-wrap']">
              <!-- 註冊方式 -->
              <div :class="[$style['info-row'], 'clearfix']">
                <div :class="$style.title">{{ $text("S_REGISTER_WAY") }}</div>
                <div :class="$style.info">
                  {{ friendsTrans[info.created_by] }}
                </div>
              </div>
              <!-- 註冊時間 -->
              <div :class="[$style['info-row'], 'clearfix']">
                <div :class="$style.title">{{ $text("S_REGISTER_TIME") }}</div>
                <div :class="$style.info">
                  {{ dateFormat(info.created_at) }}
                </div>
              </div>
              <!-- 最後離線時間 -->
              <div :class="[$style['info-row'], 'clearfix']">
                <div :class="$style.title">
                  {{ $text("S_LAST_ONLINE_TIME") }}
                </div>
                <div :class="$style['info-online']">
                  <template v-if="!info.last_login"><span>--</span></template>
                  <template v-else-if="!info.last_online || isOnline(info)"
                    ><span :class="{ [$style.active]: isOnline(info) }">{{
                      $text("S_ONLINE")
                    }}</span></template
                  >
                  <template v-else
                    ><span>{{ dateFormat(info.last_online) }}</span></template
                  >
                </div>
              </div>
              <!-- 狀態 -->
              <div :class="[$style['info-row'], 'clearfix']">
                <div :class="$style.title">{{ $text("S_STATUS") }}</div>
                <div :class="$style['info-status']">
                  <!-- 啟用 -->
                  <template v-if="info.enable">
                    <span :class="{ [$style.enable]: info.enable }">{{
                      $text("S_ENABLE")
                    }}</span>
                  </template>
                  <!-- 停用 -->
                  <template v-else>
                    <span :class="{ [$style.disable]: !info.enable }">{{
                      $text("S_DISABLE")
                    }}</span>
                  </template>
                  <!-- 凍結 -->
                  <template v-if="info.locked">
                    <span>&nbsp;/&nbsp;</span>
                    <span :class="{ [$style.locked]: info.locked }">{{
                      $text("S_LOCKED")
                    }}</span>
                  </template>
                  <!-- 停權 -->
                  <template v-if="info.bankrupt">
                    <span>&nbsp;/&nbsp;</span>
                    <span :class="{ [$style.bankrupt]: info.bankrupt }">{{
                      $text("S_BANKRUPT")
                    }}</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div
        v-if="['porn1', 'sg1'].includes(themeTPL)"
        :class="[$style['card-wrap']]"
      >
        <!-- 鴨博 & 絲瓜 -->
        <card-total :data="allTotalList" />

        <card-item
          v-for="data in wrappedRenderList"
          :key="data.key"
          :list="data"
          :custom-style="'firstFriend'"
          @click="enterNextLayer"
        />
      </div>
    </template>

    <div
      v-if="firstFriends.list.length === 0 && !isEnterNextLayers"
      :class="$style['no-data']"
    >
      <img src="/static/image/common/mcenter/ic_nodata.png" />
      <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
    </div>

    <!-- <template v-if="themeTPL === 'ey1'">
      <infinite-loading
        v-if="showInfinite"
        ref="infiniteLoading"
        @infinite="infiniteHandler"
      >
        <span slot="no-more" />
        <span slot="no-results" />
      </infinite-loading>
    </template> -->

    <template v-if="themeTPL !== 'ey1'">
      <page-loading :is-show="!isReceive" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import firstLevelStatistics from "@/mixins/mcenter/management/firstLevelStatistics";
import breakcrumb from "./components/breakcrumb";
import CardTotal from "./components/cardAllTotal";
import CardItem from "./components/cardItem";

export default {
  props: {
    setTabState: {
      type: Function,
      default: () => {}
    },
    setSubTabState: {
      type: Function,
      default: () => {}
    },
    setHeaderTitle: {
      type: Function,
      default: () => {}
    },
    setBackFunc: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    InfiniteLoading,
    breakcrumb,
    CardTotal,
    CardItem,
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      )
  },
  mixins: [firstLevelStatistics],
  data() {
    return {
      isEnterNextLayers: false,
      currentSavedFreindList: []
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    allTotalList() {
      let strArr = [];
      strArr.push(`笔数：${this.firstFriends.total}`);

      return strArr;
    },
    // 目前 For 鴨博 & 絲瓜: 將資料包裝成陣列來做組件的render
    wrappedRenderList() {
      let data = [];

      const getLastOnline = info => {
        if (!info.last_login) {
          return "--";
        } else if (!info.last_login || this.isOnline(info)) {
          return "在线";
        } else {
          return this.dateFormat(info.last_online, "YYYY-MM-DD HH:mm:ss");
        }
      };

      const getStatus = info => {
        let str = [];

        info.enable ? str.push("启用") : str.push("停用");
        info.locked ? str.push(" | ", "冻结") : null;
        info.bankrupt ? str.push(" | ", "停权") : null;

        return str;
      };

      // 取决於 this.firstFriends
      data = this.firstFriends?.list?.map(item => {
        return [
          {
            // 識別用
            key: "username",
            // 顯示用(左)
            alias: item.username,
            // 顯示用(右)
            value:
              item.friend_counts > 0 ? `查看下级(${item.friend_counts}) >` : "",
            // 傳遞給子元件點擊專用
            paramsValue: { id: item.id, alias: item.username },
            isClick: true
          },
          {
            key: "cash_balance",
            alias: "主帐户余额",
            value: this.commaFormat(item.cash.balance)
          },
          {
            key: "status",
            alias: "状态",
            value: getStatus(item)
          },
          {
            key: "last_online",
            alias: "最后离线时间",
            value: getLastOnline(item)
          },
          {
            key: "register_time",
            alias: "注册时间",
            value: this.dateFormat(item.created_at, "YYYY-MM-DD HH:mm:ss")
          },
          {
            key: "register_method",
            alias: "注册方式",
            value: this.friendsTrans[item.created_by]
          }
        ];
      });

      return data;
    }
  },
  created() {
    this.getFirstFriends().then(response => {
      if (response.status !== "ok") return;

      this.initSavedFriendList();
    });
  },
  watch: {
    "firstFriends.depth"(value) {
      if (value >= 2) {
        this.setHeaderTitle(this.depthMapping[value]);

        this.setTabState(false);
        this.setSubTabState(false);

        this.setBackFunc(() => {
          // 選擇的 index 為目前所選的上一個，因需等 API 成功後再執行 remove 的動作，因此減掉2
          const previousIndex = this.currentSavedFreindList.length - 2;

          this.getFirstFriends({
            friend_id: this.currentSavedFreindList[previousIndex].id
          }).then(response => {
            if (response.status !== "ok") return;

            this.removeLastIndexTargets();
          });
        });
        return;
      } else {
        // 若返回到1級的頁面 or 停留在1級的情況
        this.isEnterNextLayers = false;

        // 標題設定
        this.setHeaderTitle(this.$text("S_TEAM_CENTER", "我的推广"));

        // 上方選項列顯示狀態
        this.setTabState(true);
        this.setSubTabState(true);

        // 返回鍵事件(同最外層預設一致)
        this.setBackFunc(() => {
          if (this.$route.params.date) {
            this.$router.replace("/mobile/mcenter/tcenter/management/member");
          } else {
            this.$router.back();
          }
        });
      }
    }
  },
  methods: {
    /*
     * 點擊下一層級使用
     */
    enterNextLayer(friend) {
      this.getFirstFriends({
        friend_id: friend.id
      }).then(response => {
        if (response.status !== "ok") return;

        this.isEnterNextLayers = true;
        this.addToSavedFreindList(friend.alias, friend.id);
      });
    },
    /*
     * 點擊 Breakcrumb 的特定好友
     */
    clickTargetFriend({ id, index }) {
      this.getFirstFriends({
        friend_id: id
      }).then(response => {
        if (response.status !== "ok") return;

        const removeCount = this.currentSavedFreindList.length - 1 - index;
        this.removeLastIndexTargets(removeCount);
      });
    },
    /*
     * 初始化遍歷過的好友資料
     */
    initSavedFriendList() {
      this.currentSavedFreindList = [];
      this.currentSavedFreindList.push({
        id: this.memInfo.user.id,
        alias: this.memInfo.user.username
      });
    },
    /*
     * 添加好友資料到儲存的好友列表中
     */
    addToSavedFreindList(alias, id) {
      this.currentSavedFreindList.push({
        id,
        alias
      });
    },
    /*
     * 移除好友列表中 n 個好友資料
     */
    removeLastIndexTargets(removeCount = 1) {
      const totalLength = this.currentSavedFreindList.length - removeCount;

      this.currentSavedFreindList.splice(totalLength);
    }
  }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
