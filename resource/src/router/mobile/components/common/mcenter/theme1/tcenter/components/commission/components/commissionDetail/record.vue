<template>
  <div :class="$style['record-wrap']">
    <template v-if="!currentInfo.oauth2">
      <div :class="$style['level-info']">
        <div
          :class="$style['card']"
          v-for="item in summaryList"
          :key="`level-${item.depth}`"
        >
          <div :class="$style['card-title']">
            {{ levelTrans[item.depth] }}
          </div>
          <div style="display: none;">
            <span>{{ $text("S_COMMISSION_01", "返利") }}</span>
            <span>{{ item.amount }}</span>
          </div>
          <div>
            <span>{{ $text("S_VALID_BET", "有效投注") }}</span>
            <span>{{ item.valid_bet }}</span>
          </div>
          <div>
            <span>{{ $text("profit", "损益") }}</span>
            <span>{{ item.valid_bet }}</span>
          </div>
        </div>
      </div>

      <div class="main-wrap">
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
                  <span>{{ $text("S_VALID_BET", "有效投注") }}</span>
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
                    <icon name="long-arrow-alt-up" width="5" height="10" />
                    <icon name="long-arrow-alt-down" width="5" height="10" />
                  </span>
                </th>

                <th
                  :class="[
                    $style['profit'],
                    { [$style.active]: sort === 'profit' }
                  ]"
                  @click="onSort('profit')"
                >
                  <span>
                    {{ $text("profit", "损益") }}
                  </span>
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
                    <icon name="long-arrow-alt-up" width="5" height="10" />
                    <icon name="long-arrow-alt-down" width="5" height="10" />
                  </span>
                </th>

                <th :class="$style.commission" style="display: none;">
                  {{ $text("S_COMMISSION_01", "返利") }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(info, index) in controlData" :key="`list-${info.id}`">
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
    </template>

    <template v-else>
      <div class="main-wrap">
        <div :class="$style['detail-wrap']">
          <div :class="$style['rebate-wrap']">
            <div :class="[$style.detail, 'clearfix']">
              <span :class="[$style.text, $style.main]">
                {{ $text("S_EXPECTED_LOSS_REBATE", "盈亏返利预估") }}
              </span>
              <span
                :class="[
                  $style.amount,
                  { [$style.deficit]: +currentInfo.amount < 0 }
                ]"
              >
                {{ currentInfo.amount }}
              </span>
            </div>
            <div :class="[$style.detail, 'clearfix']">
              <span :class="[$style.text, $style.main]">
                {{ $text("S_REBATE_LEVEL", "返利级别") }}
              </span>
              <span :class="[$style.amount]"> {{ currentInfo.rate }} % </span>
            </div>
          </div>

          <div :class="$style.date">
            ({{ currentInfo.start_at | dateFormat }}-{{
              currentInfo.end_at | dateFormat
            }})
          </div>

          <div :class="$style['list-wrap']">
            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_ACH_VALID_MEMBERS", "有效会员") }}
              </div>
              <div :class="$style.amount">
                {{ currentInfo.valid_user }}
                {{ $text("S_PERSON", "人") }}
              </div>
            </div>

            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_VALID_BET", "有效投注") }}
              </div>
              <div :class="$style.amount">
                {{ currentInfo.valid_bet }}
              </div>
            </div>

            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_GAME_LOSS", "游戏盈亏") }}
              </div>
              <div
                :class="[
                  $style.amount,
                  { [$style.deficit]: +currentInfo.profit < 0 }
                ]"
              >
                {{ currentInfo.profit }}
              </div>
            </div>

            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_SENT_RAKEBACK", "已派返水") }}
              </div>
              <div :class="$style.amount">
                {{ currentInfo.dispatched_rebate }}
              </div>
            </div>

            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_SENT_PROMOTIONS", "已派优惠") }}
              </div>
              <div :class="$style.amount">
                {{ currentInfo.dispatched_offer }}
              </div>
            </div>

            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_MEM_DEPOSIT", "会员入款") }}
              </div>
              <div :class="$style.amount">
                {{ currentInfo.deposit }}
              </div>
            </div>

            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_MEM_WITHDRAW", "会员出款") }}
              </div>
              <div :class="$style.amount">
                {{ currentInfo.withdraw }}
              </div>
            </div>

            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_PLATFORM_COST", "平台费") }}
              </div>
              <div :class="$style.amount">
                {{ currentInfo.vendor_fee }}
              </div>
            </div>

            <div
              v-if="currentInfo.shift_amount"
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
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import commissionDetail from "@/mixins/mcenter/commission/commissionDetail";

export default {
  components: {
    InfiniteLoading
  },
  mixins: [commissionDetail],
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    })
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.level-info {
  position: relative;
  display: inline-block;
  width: 100%;
  padding: 0 9px 0 12px;
  margin-top: 10px;
  overflow: scroll;
  white-space: nowrap;

  // 針對 Chrome 與 Safari 隱藏滾動條
  &::-webkit-scrollbar {
    display: none !important;
  }
}

.card {
  display: inline-block;
  width: 230px;
  background: $main_white_color1;
  color: $main_text_color3;
  border-radius: 8px;
  margin: 0px 10px 10px 0;
  padding: 0 9px 0 12px;

  div {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding-top: 9px;

    &:last-of-type {
      padding: 9px 0 9px 0;
    }
  }

  .card-title {
    justify-content: center;
    padding: 6px 9px 6px 12px;
    line-height: 21px;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    font-weight: 700;
  }
}

.main-table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;

  thead {
    th {
      background-color: #eee;
      color: #676767;
      font-weight: normal;
      font-size: 12px;
      height: 32px;
      line-height: 32px;
    }

    .index {
      width: 15%;
    }

    .first-level {
      width: 23%;
      cursor: pointer;
    }

    .valid-bet {
      width: 31%;
    }

    // commission 目前先隱藏，到時如果顯示，還需要再調Width
    .commission,
    .profit {
      width: 31%;
    }
  }

  tbody {
    tr {
      background: #fff;

      &:nth-child(even) {
        background: #f6f6f6;
      }
    }

    td {
      color: #2d2d2d;
      font-size: 12px;
      text-align: center;
      height: 39px;
      line-height: 39px;

      > div {
        display: block;
        width: 70%;
        margin: 0 auto;
        text-align: right;
      }

      &:nth-child(3),
      &:nth-child(4) {
        color: #676767;
      }
    }
  }
}

.detail-wrap {
  width: 100%;
  margin-top: 13px;

  // 共用
  .detail {
    display: flex;
    justify-content: space-between;
    line-height: 40px;

    .text {
      flex: 1;
    }
  }

  .rebate-wrap,
  .date,
  .list-wrap {
    padding: 0 15px;
    background: #fff;
  }

  // 細部調整
  .rebate-wrap {
    .detail {
      line-height: 23px;

      &:first-of-type {
        padding-top: 10px;
      }

      &:last-of-type {
        padding-bottom: 10px;
      }
    }
    .text {
      color: #6aaaf5;
    }
  }

  .date {
    background: none;
    color: $main_text_color3;
    font-weight: 700;
    font-size: 16px;
    padding: 0 15px;
    height: 32px;
    line-height: 32px;
  }

  .list-wrap {
    min-height: 300px;

    .text {
      color: $main_text_color2;
    }
  }

  .tips {
    padding: 40px 0;
    color: $main_text_color2;
    font-size: 12px;
    text-align: center;

    .service-btn {
      margin-left: 5px;
      color: #6aaaf5;
    }
  }
}
</style>
