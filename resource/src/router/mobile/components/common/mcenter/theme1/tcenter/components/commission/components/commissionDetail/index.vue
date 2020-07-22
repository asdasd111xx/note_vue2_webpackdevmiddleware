<template>
  <div :class="$style['commission-detail-wrap']">
    <div :class="$style['tab-wrap']">
      <div
        v-for="(item, index) in tabItem"
        :key="`tab-${item.key}`"
        :class="[
          $style['tab-item'],
          { [$style['is-current']]: currentTab === index }
        ]"
        @click="setCurrentTab(index)"
      >
        {{ item.text }}
      </div>
      <div
        :class="$style['active-slider']"
        :style="{ left: `calc(25% + 50% * ${currentTab})` }"
      />
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
import assign from "./assign";
import record from "./record";

export default {
  components: {
    assign,
    record
  },
  data() {
    return {
      currentTab: 0,
      currentTemplate: "assign"
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    tabItem() {
      return [
        {
          key: "assign",
          text: this.$text("S_ASSIGIN_DETAIL", "派发详情")
        },
        {
          key: "record",
          text: this.$text("S_RECORD_DETAIL", "统计详情")
        }
      ];
    }
  },
  methods: {
    setCurrentTab(index) {
      this.currentTab = index;
      switch (index) {
        case 0:
          this.currentTemplate = "assign";
          break;

          return {
            "commission-detail-wrap": true,
            [this.$style[site]]: this.$style[site],
            [this.$style["preset-color"]]: !this.$style[site]
          };
      }
    }
  }}
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.tab-wrap {
  position: relative;
  display: flex;
  background: #fff;
  border-bottom: 2px solid #eee;
}

.tab-item {
  flex: 1;
  position: relative;
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: $main_text_color2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.is-current {
    color: $main_text_color4;
  }
}

.active-slider {
  position: absolute;
  width: 40px;
  height: 2px;
  bottom: 0;
  transform: translateX(-50%);
  background: #be9e7f;
  // left: calc(50% / 2 - 20px);
  transition: left 0.31s;
}
</style>
