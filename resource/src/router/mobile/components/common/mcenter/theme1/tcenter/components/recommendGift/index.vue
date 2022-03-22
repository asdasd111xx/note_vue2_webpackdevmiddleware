<template>
  <div>
    <template v-if="path">
      <!-- 返利管理 日期 -->
      <tcenter-label :child-item="allTotalData" :change-tab="getTimeRecord" />
      <!-- 搜尋日期 -->
      <custom-date
        v-if="isShowDatePicker"
        :options="options"
        :date-range="dateRange"
        @search-date="receiveSearchCustomDate"
        @select-type="receiveSelectType"
      />
    </template>
    <template v-else>
      <!-- 我的推廣 日期 發派功能列 -->
      <div :class="$style['menu-wrap']">
        <div
          :class="[
            $style['menu-select-game'],
            { [$style.active]: selectMenu === 'game' }
          ]"
          @click="selectMenu = selectMenu === 'game' ? '' : 'game'"
        >
          <span>{{ selectType.name }}</span>
        </div>

        <div
          :class="[
            $style['menu-select-time'],
            { [$style.custom]: isCustomTime },
            { [$style.active]: selectMenu === 'time' }
          ]"
          @click="selectMenu = selectMenu === 'time' ? '' : 'time'"
        >
          <div v-if="isCustomTime" :class="$style['select-custom']">
            <p>{{ selectTime.split(" ")[0] }}</p>
            <p>{{ selectTime.split(" ")[1] }}</p>
          </div>
          <span v-else>{{ selectTime }}</span>
        </div>
        <ul
          v-if="selectMenu === 'game'"
          :class="[$style['dropdown-wrap'], 'clearfix']"
        >
          <li
            v-for="(item, index) in options"
            :key="`options-${index}`"
            :class="{ [$style.active]: item.key === selectType.key }"
            @click="getLabel(item)"
          >
            {{ item.name }}
          </li>
        </ul>
        <div v-if="selectMenu === 'time'" :class="$style['search-tips']">
          *当前系统支持查询最近30日的记录
        </div>
        <div
          v-if="selectMenu === 'time'"
          :class="[
            $style['dropdown-wrap'],
            $style['dropdown-wrap-time'],
            'clearfix'
          ]"
        >
          <ul
            :class="[
              { [$style['default-active']]: !isShowDatePicker },
              'clearfix'
            ]"
          >
            <li
              v-for="(time, key) in allTotalData"
              :key="`date-${key}`"
              :class="{ [$style.active]: currentSelectTime === time.text }"
              @click="getTimeRecord(time)"
            >
              {{ time.text }}
            </li>
          </ul>
          <template v-if="isShowDatePicker">
            <div :class="$style['custom-wrap']">
              <div
                :class="[$style['custom-date'], 'clearfix']"
                @click="
                  currentCustomDate =
                    currentCustomDate === 'start' ? '' : 'start'
                "
              >
                <p :class="$style['custom-title']">
                  {{ $text("S_START_DATE", "开始日期") }}
                </p>
                <p :class="$style['custom-time']">{{ startTime }}</p>
              </div>
              <date-picker
                v-if="currentCustomDate === 'start'"
                :key="`date${currentCustomDate}`"
                :min-limit.sync="limitDate"
                :max-limit.sync="estToday"
                :date.sync="setStartTime"
              />
              <div
                :class="[$style['custom-date'], 'clearfix']"
                @click="
                  currentCustomDate = currentCustomDate === 'end' ? '' : 'end'
                "
              >
                <p :class="$style['custom-title']">
                  {{ $text("S_END_DATE", "结束日期") }}
                </p>
                <p :class="$style['custom-time']">{{ endTime }}</p>
              </div>
              <date-picker
                v-if="currentCustomDate === 'end'"
                :key="`date${currentCustomDate}`"
                :min-limit.sync="limitDate"
                :max-limit.sync="estToday"
                :date.sync="setEndTime"
              />
            </div>
            <div :class="[$style['time-button-group'], 'clearfix']">
              <div :class="$style['time-cancel']" @click="cancelCustomTime">
                {{ $text("S_CANCEL", "取消") }}
              </div>
              <div :class="$style['time-confirm']" @click="setCustomTime">
                {{ $text("S_CONFIRM_2", "确定") }}
              </div>
            </div>
          </template>
          <div
            v-if="setStartTime.valueOf() > setEndTime.valueOf()"
            :class="[$style['date-tip']]"
          >
            开始日期不能大于结束日期
          </div>
        </div>
        <div
          v-if="selectMenu !== ''"
          :class="$style['dropdown-mask']"
          @click="selectMenu = ''"
        />
      </div>
    </template>
    <template v-if="!isLoading">
      <template v-if="mainListData.length > 0">
        <!-- 返利管理內容 -->
        <template v-if="path">
          <div v-if="!isShowDatePicker" :class="$style['card-wrap']">
            <card-total :data="allTotalList" />
            <div :class="[$style['date']]">{{ timeTitle }}</div>
            <card-item :card-item-list="cardItemList" />
          </div>
        </template>
        <template v-else>
          <!-- 我的推廣內容 -->
          <div>
            <div :class="$style['total-wrap']">
              <div>首存金额: {{ mainTotal.amount | commaFormat }}</div>
              <div>礼金: {{ mainTotal.total_invite_gift | commaFormat }}</div>
            </div>
            <!-- 卡片 -->
            <div :class="$style['info-list']">
              <div
                v-for="info in mainListData"
                :key="info.upper_id"
                :class="$style['info-item']"
              >
                <div :class="$style['item-header']">
                  <div :class="$style['friend-name']">
                    {{ info.username }}
                  </div>
                  <div>礼金: {{ info.total_invite_gift | commaFormat }}</div>
                </div>
                <div :class="$style['item-content']">
                  <div :class="$style['item-detail']">
                    <div :class="$style['item-detail-title']">
                      注册时间
                    </div>
                    <div :class="$style['item-detail-result']">
                      {{ info.user_created_at }}
                    </div>
                  </div>
                  <div :class="$style['item-detail']">
                    <div :class="$style['item-detail-title']">
                      首存金额
                    </div>
                    <div :class="$style['item-detail-result']">
                      {{ info.amount | commaFormat }}
                    </div>
                  </div>
                  <div :class="$style['item-detail']">
                    <div :class="$style['item-detail-title']">
                      推荐礼金
                    </div>
                    <div :class="$style['item-detail-result']">
                      {{ info.deposit_gift | commaFormat }}
                    </div>
                  </div>
                  <div
                    v-if="parseFloat(info.invite_gift) > 0"
                    :class="$style['item-detail']"
                  >
                    <div :class="$style['item-detail-title']">
                      推荐人奖励
                    </div>
                    <div :class="$style['item-detail-result']">
                      {{ info.invite_gift | commaFormat }}
                    </div>
                  </div>
                  <div :class="$style['item-detail']">
                    <div :class="$style['item-detail-title']">
                      {{ "审核状态" }}
                    </div>
                    <div :class="[$style['item-detail-result']]">
                      {{ getStatus(info) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <div v-else :class="[$style['no-data-wrap'], { [$style.newpath]: path }]">
        <template v-if="!isShowDatePicker">
          <div :class="$style['no-data-image']">
            <img
              :src="
                $getCdnPath(`/static/image/${themeTPL}/mcenter/no_data.png`)
              "
            />
          </div>

          <div :class="$style.tips">
            {{ path ? "暂无资料" : "还没有任何记录" }}
          </div>
          <div
            :class="[$style['btn-money']]"
            @click="$router.replace('/mobile/mcenter/makeMoney?giftDetail=1')"
          >
            {{ giftTitle }}
          </div>
        </template>
      </div>
    </template>
    <infinite-loading
      v-if="showInfinite"
      ref="infiniteLoading"
      @infinite="infiniteHandler"
    >
      <span slot="no-more" />
      <span slot="no-results" />
    </infinite-loading>
  </div>
</template>

<script>
import Vue from "vue";
import InfiniteLoading from "vue-infinite-loading";
import EST from "@/lib/EST";
import ajax from "@/lib/ajax";
import datePicker from "@/router/mobile/components/common/datePicker";
import { mapGetters, mapActions } from "vuex";
import tcenterLabel from "../../../tcenterSame/tcenterLabel";
import cardTotal from "../../../tcenterSame/cardAllTotal";
import cardItem from "../../../tcenterSame/cardItem";
import customDate from "../../../tcenterSame/customDate";
export default {
  components: {
    datePicker,
    InfiniteLoading,
    tcenterLabel,
    cardItem,
    cardTotal,
    customDate
  },
  props: {
    setHeaderTitle: {
      type: Function,
      required: true
    },
    setTabState: {
      type: Function,
      default: () => {}
    },
    tabState: {
      type: Boolean,
      default: false
    },
    setBackFunc: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      hasFooter: false,
      options: [
        {
          name: "全部",
          key: "all",
          status: 0
        },
        {
          name: "已派发",
          key: "dispatch",
          status: 1
        },
        {
          name: "已撤销",
          key: "revoked",
          status: 2
        },
        {
          name: "资格不符",
          key: "allow",
          status: 3
        }
      ],
      selectMenu: "",
      selectType: { name: "已派发", key: "dispatch", status: 1 },
      isCustomTime: false,
      currentSelectTime: this.$t("S_TODDAY"),
      selectTime: this.$t("S_TODDAY"),
      estToday: EST(new Date(), "", true),
      limitDate: "",
      startTime: "",
      endTime: "",
      mainListData: [],
      mainTotal: {},
      mainNoData: true,
      currentCustomDate: "",
      isShowDatePicker: false,
      pagination: {},
      isLoading: false,
      isReceive: false,
      showInfinite: false,
      maxResults: 10, // 一頁顯示幾筆
      showPage: 0, // 顯示幾頁
      pathDay: this.$route.params.item ?? "", //返利管理日期,
      path: this.$route.params.title ?? "", //是否從返利管理來,
      title: "recommendGift",
      timeTitle: ""
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    //傳進預設選擇自訂日期區間
    dateRange: {
      get() {
        return { startTime: this.startTime, endTime: this.endTime };
      },
      set(val) {
        return val;
      }
    },
    allTotalData() {
      return [
        {
          text: this.$text("S_TODDAY", "今日"),
          name: "today",
          value: 0,
          show: true
        },
        {
          text: this.$text("S_YESTERDAY", "昨日"),
          name: "yesterday",
          value: 1,
          show: true
        },
        {
          text: this.$text("S_SEVEN_DAY", "近7日"),
          name: "week",
          value: 7,
          show: this.path ? false : true
        },
        {
          text: this.$text("S_THIRTY_DAY", "近30日"),
          name: "month",
          value: 29,
          show: true
        },
        {
          text: this.path
            ? this.$text("S_SEARCH_DAY", "搜寻")
            : this.$text("S_CUSTOM_DATE", "自定义"),
          name: "custom",
          value: 29,
          show: true
        }
      ].filter(item => item.show);
    },
    allTotalList() {
      let strArr = [
        {
          name: "总首存金额：",
          item: this.amountFormat(this.mainTotal.amount)
        },
        {
          name: "总礼金：",
          item: this.amountFormat(this.mainTotal.total_invite_gift)
        },
        { name: "笔数：", item: this.pagination.total }
      ];
      return strArr;
    },
    customDateParams() {
      [{ min: this.limitDate }];
    },
    setStartTime: {
      get() {
        return new Date(this.startTime);
      },
      set(value) {
        this.startTime = Vue.moment(value).format("YYYY-MM-DD");
      }
    },
    setEndTime: {
      get() {
        return new Date(this.endTime);
      },
      set(value) {
        this.endTime = Vue.moment(value).format("YYYY-MM-DD");
      }
    },
    showData() {
      if (this.mainData.length === 0) {
        return false;
      }
      return this.mainData.some(item =>
        this.controlData.some(data => item.day === data.day)
      );
    },
    giftTitle() {
      return "推广赚钱";
    },
    cardItemList() {
      let data = this.mainListData?.map(info => {
        return {
          title: info.username,
          fontCss: "title-font-style",
          childTitle: `礼金 : ${this.amountFormat(info.total_invite_gift)}`,
          list: [
            {
              name: "注册时间",
              item: this.filterDate(info.user_created_at),
              isShow: true
            },
            {
              name: "首存金额",
              item: this.amountFormat(info.amount),
              isShow: true
            },
            {
              name: "推荐礼金",
              item: this.amountFormat(info.deposit_gift),
              isShow: info.deposit_gift > 0
            },
            {
              name: "推荐人奖励",
              item: this.amountFormat(info.invite_gift),
              isShow: info.invite_gift > 0
            },
            {
              name: "状态",
              item: this.getStatus(info),
              color: this.getStatus(info, "y"),
              isShow: true
            }
          ].filter(item => item.isShow)
        };
      });
      return data;
    }
  },
  watch: {
    selectMenu() {
      document.querySelector("#mobile-wrap").style = this.selectMenu
        ? "overflow: hidden"
        : "";
    }
  },
  created() {
    this.startTime = Vue.moment(this.estToday).format("YYYY-MM-DD");
    this.endTime = Vue.moment(this.estToday).format("YYYY-MM-DD");
    this.limitDate = new Date(
      Vue.moment(this.estToday)
        .add(-29, "days")
        .format("YYYY-MM-DD")
    );

    if (this.path) {
      //返利管理頁面刷新 預設今日
      this.getTimeRecord(this.allTotalData[0]);
    }
    this.isLoading = true;
    this.updateGame();
  },
  methods: {
    getStatus(info, color) {
      if (!info.allow) {
        return color ? "red" : "资格不符";
      }

      if (info.revoked) {
        return color ? "red" : "已撤销";
      }

      return color ? "blue" : "已派发";
    },
    getLabel(data) {
      this.selectMenu = "";
      this.selectType = data;
      this.showPage = 0;
      this.mainTotal = {};
      this.pagination = {};
      this.mainListData = [];
      this.isLoading = true;
      this.updateGame();
    },
    getTimeRecord(data) {
      this.selectType.status = 0;

      if (data.name != "custom") {
        this.startTime = Vue.moment(this.estToday)
          .add(-data.value, "days")
          .format("YYYY-MM-DD");
        this.endTime = Vue.moment(this.estToday).format("YYYY-MM-DD");

        if (data.name === "yesterday") {
          this.endTime = Vue.moment(this.estToday)
            .add(-data.value, "days")
            .format("YYYY-MM-DD");
        }
      }

      if (this.path && this.pathDay != data.name) {
        this.$router.replace({
          params: {
            title: this.title,
            item: `${data.name}`
          }
        });
        this.pathDay = data.name;
      }

      if (data.name === "custom") {
        this.isShowDatePicker = true;
        return;
      }

      this.selectTime = data.text;
      this.isShowDatePicker = false;
      this.isCustomTime = false;
      this.selectMenu = "";
      this.showPage = 0;
      this.pagination = {};
      this.mainTotal = {};
      this.mainListData = [];
      this.isLoading = true;
      this.updateGame();
    },
    getGiftList() {
      const params = {
        dispatch_start_at: Vue.moment(this.startTime).format(
          "YYYY-MM-DD 00:00:00-04:00"
        ),
        dispatch_end_at: Vue.moment(this.endTime).format(
          "YYYY-MM-DD 23:59:59-04:00"
        ),
        max_results: this.maxResults,
        first_result: this.maxResults * this.showPage
      };

      if (this.selectType.status != 0) {
        params.status = this.selectType.status;
      }

      this.startTime = Vue.moment(this.startTime).format("YYYY-MM-DD");
      this.endTime = Vue.moment(this.endTime).format("YYYY-MM-DD");

      if (this.path) {
        if (this.startTime !== this.endTime) {
          this.timeTitle = `${this.startTime} ~ ${this.endTime}`;
        } else {
          this.timeTitle = this.startTime;
        }
      }

      return ajax({
        method: "get",
        url: "/api/v1/c/festival/entry/list",
        params,
        success: response => {
          this.isLoading = false;
          if (response.ret.length === 0) {
            return;
          }

          this.mainListData.push(...response.ret);
          this.mainTotal = response.total;
          this.pagination = response.pagination;
          this.mainNoData = false;
        }
      });
    },
    receiveSelectType(value) {
      this.selectType = value;
    },
    updateGame() {
      this.showInfinite = false;

      this.mainNoData = true;

      this.$nextTick(() => {
        this.showInfinite = true;
      });
    },
    cancelCustomTime() {
      if (this.allTotalData.some(item => item.text === this.selectTime)) {
        this.currentSelectTime = this.selectTime;
        this.isShowDatePicker = false;
      }

      this.selectMenu = "";
    },
    setCustomTime() {
      if (this.setStartTime > this.setEndTime) {
        return;
      }
      this.isShowDatePicker = false;
      this.startTime = Vue.moment(this.setStartTime).format("YYYY-MM-DD");
      this.endTime = Vue.moment(this.setEndTime).format("YYYY-MM-DD");
      this.selectTime = `${this.startTime} ${this.endTime}`;
      this.isCustomTime = true;
      this.currentCustomDate = "";
      this.selectMenu = "";
      this.pagination = {};
      this.mainTotal = {};
      this.mainListData = [];
      this.isLoading = true;
      this.updateGame();
    },
    receiveSearchCustomDate(value) {
      this.setStartTime = value.inqStart;
      this.setEndTime = value.inqEnd;
      this.setCustomTime();
    },
    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state) {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;
      this.getGiftList().then(({ result }) => {
        this.isReceive = false;
        if (result !== "ok") {
          return;
        }

        if (
          !this.pagination.total ||
          this.mainListData.length === +this.pagination.total
        ) {
          $state.complete();
          return;
        }

        this.showPage += 1;

        $state.loaded();
      });
    },
    filterDate(date) {
      return Vue.moment(EST(date)).format("YYYY-MM-DD HH:mm:ss");
    },
    amountFormat(amount) {
      return `${Number(amount)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
  },
  filters: {
    commaFormat(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
