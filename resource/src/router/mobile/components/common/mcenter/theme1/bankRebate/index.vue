<template>
  <bank-rebate :class="siteStyleClass">
    <template
      scope="{ rebateInitData, messageText, shortDay, pageAll, caculateData, list, pickDateList, rebateCaculate, btnLock, btnReceiveLock, formatTime, rebateState, popReceive, amountCache, rebateSubTotal, immediateData, realTimeRebateTotal, maintainsList, receiveAll, isReceiveAll, realTimePeriod, isShowPopup, closePopup, popupMsg }"
    >
      <div :class="[$style['total-sub-wrap'], 'clearfix']">
        <div
          :class="[
            $style['top-sub-title'],
            { [$style['active']]: mcenterBankRebateType === 'history' },
            { [$style['self']]: !rebateInitData.self_rebate }
          ]"
          @click="getItemType('history')"
        >
          {{ $text("S_REBATE_HISTORY", "返水历史") }}
        </div>
        <div
          v-if="rebateInitData.self_rebate"
          :class="[
            $style['top-sub-title'],
            { [$style['active']]: mcenterBankRebateType === 'realtime' }
          ]"
          @click="getItemType('realtime')"
        >
          {{ $text("S_REAL_TIME_REBATE", "实时返水") }}
        </div>
      </div>
      <template v-if="mcenterBankRebateType === 'history'">
        <div :class="$style['history-top-wrap']">
          <swiper :options="categoryOptions">
            <swiper-slide
              v-for="(item, key) in dateList"
              :key="`total-data-${key}`"
              :class="$style['total-item']"
            >
              <div @click="setMcenterBankRebate(item.type)">
                <div
                  v-if="item.type !== 'week'"
                  :class="$style['total-item-title']"
                >
                  <span>{{ pickDateList[item.type].startDate }}</span>
                </div>
                <div v-else :class="$style['total-item-title']">
                  <span>{{ pickDateList[item.type].startDate }}</span>
                  <span>-</span>
                  <span>{{ pickDateList[item.type].endDate }}</span>
                </div>
                <div
                  :class="[
                    $style['total-item-money'],
                    { [$style['is-current']]: item.type === currentType }
                  ]"
                >
                  {{ rebateSubTotal[item.type] }}
                </div>
                <div :class="$style['total-item-date']">{{ item.text }}</div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <div :class="$style['content-wrap']">
          <div v-if="pageAll > 0">
            <div
              v-for="(item, index) in list"
              :key="index"
              :class="$style['content-item']"
            >
              <div :class="$style['rebate-header']">
                {{ item.start_at }}~{{ item.end_at }}
              </div>
              <div :class="$style['rebate-body']">
                <div :class="$style['detail-content']">
                  <span :class="$style['content-left']">{{
                    $text("S_CYCLE_TIME", "週期")
                  }}</span>
                  <div :class="$style['content-right']">{{ item.name }}</div>
                </div>
                <div :class="$style['detail-content']">
                  <span :class="$style['content-left']">{{
                    $text("S_VALID_BET_TOTAL", "总有效投注")
                  }}</span>
                  <div :class="$style['content-right']">
                    {{ item.valid_bet }}
                  </div>
                </div>
                <div :class="$style['detail-content']">
                  <span :class="$style['content-left']">{{
                    $text("S_PREMIUM_AMOUNT", "返水金额")
                  }}</span>
                  <div :class="$style['content-right']">{{ item.amount }}</div>
                </div>
                <div :class="$style['detail-content']">
                  <span :class="$style['content-left']">{{
                    $text("S_STATUS", "状态")
                  }}</span>
                  <div :class="$style['content-right']">{{ item.text }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else :class="$style['content-item']">
            <div
              v-if="mcenterBankRebateInterval === 'week'"
              :class="$style['rebate-header']"
            >
              {{ pickDateList[mcenterBankRebateInterval].startFullDate }} ~
              {{ pickDateList[mcenterBankRebateInterval].endFullDate }}
            </div>
            <div v-else :class="$style['rebate-header']">
              {{ pickDateList[mcenterBankRebateInterval].startFullDate }} ~
              {{ pickDateList[mcenterBankRebateInterval].endFullDate }}
            </div>
            <div :class="$style['rebate-nodata']">
              <img
                :src="$getCdnPath('/static/image/_new/mcenter/ic_nodata.png')"
              />
              <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div :class="$style['real-top-wrap']">
          <div :class="$style['real-top-title']">
            <div>周期: {{ rebateInitData.event_name }}</div>
            <div :class="$style['calculate-title']">
              {{ $text("S_CALCULATION_STARTED", "本次起算(美东时间)") }}
            </div>
            <div>{{ realTimePeriod }}</div>
          </div>
          <div
            :class="[
              $style['real-top-btn'],
              { [$style['disable']]: btnLock && formatTime }
            ]"
          >
            <div :class="[
              $style['calculate-button'],
              { [$style['disable']]: btnLock && formatTime }
            ]"
            @click="rebateCaculate()">
              <div :class="$style['calculate-button-title']">
                {{ $text("S_TRIAL_CALCULATION", "试算") }}
                <div v-if="btnLock && formatTime">{{ `(${formatTime})` }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div
          v-if="rebateState !== 'initial' && rebateInitData.is_vip"
          :class="[$style['real-vip-wrap'], 'clearfix']"
        > -->
        <div
          v-if="rebateState !== 'initial'"
          :class="[$style['real-vip-wrap'], 'clearfix']"
        >
          <div :class="$style['real-vip-title']">
            {{ $text("S_RECEIVE_REBATE", "可领返水") }}：{{
              realTimeRebateTotal
            }}
          </div>
          <div
            :class="[
              $style['receive-vip-btn'],
              { [$style['is-disabled']]: !isReceiveAll }
            ]"
            @click="receiveAll"
          >
            {{ $text("S_ALL_GET", "一键全领") }}
          </div>
        </div>

        <div v-if="rebateState !== 'initial'" :class="$style['content-wrap']">
          <div
            v-for="(caculateList, listIndex) in immediateData"
            :key="`caculate-${listIndex}`"
            :class="$style['content-item']"
          >
            <div :class="$style['rebate-header']">
              <ele-loading v-if="rebateState === 'loading'" />
              <template v-else>
                <div :class="$style['name-lable']" v-if="rebateInitData.is_vip">{{ caculateList.vip_config_name ? caculateList.vip_config_name : "---" }}</div>
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
                  <ele-loading v-else-if="rebateState === 'loading'" />

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
              </template>
            </div>

            <div :class="$style['rebate-body']">
              <div :class="$style['detail-content']">
                <span :class="$style['content-left']">{{
                  $text("S_TIME_RANGE", "时间区间")
                }}</span>
                <div :class="$style['content-right']">
                  <ele-loading v-if="rebateState === 'loading'" />
                  <template v-else
                    >{{ caculateList.start_at }}~{{
                      caculateList.end_at
                    }}</template
                  >
                </div>
              </div>
              <div :class="$style['detail-content']">
                <span :class="$style['content-left']">{{
                  $text("S_VALID_BET", "有效投注")
                }}</span>
                <div :class="$style['content-right']">
                  <ele-loading v-if="rebateState === 'loading'" />
                  <template v-else>{{ caculateList.total }}</template>
                </div>
              </div>
              <div :class="$style['detail-content']">
                <span :class="$style['content-left']">{{
                  $text("S_PREMIUM_AMOUNT", "返水金额")
                }}</span>
                <div :class="$style['content-right']">
                  <template
                    v-if="
                      caculateList.daily_upper_limit && !caculateList.rebate
                    "
                    >{{ $t("S_UPPER_LIMIT") }}</template
                  >
                  <ele-loading v-if="rebateState === 'loading'" />
                  <template v-else>{{ caculateList.rebate }}</template>
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
              <span :class="$style['maintains-list']">{{ maintainsList }}</span>
            </div>
          </div>
        </div>

        <div v-if="isShowPopup" :class="$style['popup']">
          <div :class="$style['pop-mask']" @click="closePopup" />
          <div :class="$style['content-block']">
            <!-- <div :class="$style['msg']">{{ $text('S_TRY_AGAIN_LATER') }}</div> -->
            <div :class="$style['msg']">{{ popupMsg }}</div>
            <div :class="$style['close']" @click="closePopup">{{ $text('S_CONFIRM_2', '确定') }}</div>
          </div>
        </div>
      </template>
    </template>
  </bank-rebate>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { mapActions, mapGetters } from "vuex";
import bankRebate from "@/components/common/mcenter/bankRebate";

export default {
  components: {
    eleLoading: () =>
      import(
        /* webpackChunkName: 'eleLoading' */ "@/router/web/components/tpl/common/element/loading/square"
      ),
    bankRebate,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      headerSetting: {
        title: this.$text("S_MYREBATE", "我的返水"),
        leftBtns: {
          icon: "arrow",
          onClick: () => this.$router.push("/mobile/mcenter")
        },
        balance: true
      },
      categoryOptions: {
        slidesPerView: "auto"
      },
      rebateType: true,
      dateList: [
        {
          type: "yesterday",
          text: this.$text("S_SENT_YESTERDAY_AMOUNT", "昨日已派金额")
        },
        {
          type: "today",
          text: this.$text("S_SENT_TODAY_AMOUNT", "今日已派金额")
        },
        {
          type: "week",
          text: this.$text("S_LATELY_WEEK", "最近一周")
        }
      ],
      isShowTip: true,
      currentType: "yesterday"
    };
  },
  computed: {
    ...mapGetters({
      mcenterBankRebateType: "getMcenterBankRebateType",
      mcenterBankRebateInterval: "getMcenterBankRebateInterval",
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
    }
  },
  methods: {
    ...mapActions([
      "actionSetSystemTime",
      "actionSetPop",
      "actionSetMcenterBankRebate"
    ]),
    getItemType(item) {
      // eslint-disable-next-line no-restricted-globals
      this.rebateType = status;

      if (item === this.mcenterBankRebateType) {
        return;
      }
      this.actionSetMcenterBankRebate({
        type: item,
        interval: this.mcenterBankRebateInterval
      });
    },
    setMcenterBankRebate(type) {
      this.currentType = type;
      this.actionSetMcenterBankRebate({ type: "history", interval: type });
    }
  }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
