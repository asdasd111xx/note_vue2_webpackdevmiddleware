<template>
  <vip
    :class="[
      $style['vip-main-wrap'],
      $style[`theme-${siteConfig.MOBILE_WEB_TPL}`]
    ]"
  >
    <template
      scope="{ vipLevelList, vipConfig, userVipInfo, previewLevel, isNextLevel, nowTypeLevel, nowMobileIndex, badgeList, isDisplay, changeMobileIndex }"
    >
      <mcenter-header :header-setting="headerSetting" />
      <div :class="$style['vip-top-wrap']">
        <div :class="$style['vip-title']">
          {{ $text("S_VIP_STATUS_BROWSE", "VIP身份一览") }}
        </div>
        <div
          v-if="isGoUrl"
          :class="[$style['vip-title'], $style['honor-channel']]"
          @click="switchUrlList(true)"
        >
          {{ $text("S_USE_HONOR_CHANNEL", "使用尊荣通道") }} >
        </div>
      </div>
      <template v-if="isDisplay && userVipInfo[nowMobileIndex]">
        <div :class="$style['vip-card-wrap']">
          <!-- VIP卡片 -->
          <div
            :class="[
              $style['vip-card-content'],
              [
                $style[
                  `vip-card-${userVipInfo[nowMobileIndex].config_image_tag}`
                ]
              ]
            ]"
            :style="{
              'background-image': `url(${userVipInfo[nowMobileIndex].img_card_src})`
            }"
          >
            <div :class="$style['card-header']">
              <h1>
                {{
                  isNextLevel[userVipInfo[nowMobileIndex].config_id]
                    ? vipLevelList[userVipInfo[nowMobileIndex].config_id][
                        nowTypeLevel[userVipInfo[nowMobileIndex].config_id]
                      ].alias
                    : userVipInfo[nowMobileIndex].now_level_alias
                }}
              </h1>
              <div
                v-if="vipLevelList[nowMobileIndex].length > 1"
                :class="$style['arrow-btn-wrap']"
              >
                <div
                  v-if="isNextLevel[userVipInfo[nowMobileIndex].config_id]"
                  :class="[$style['arrow'], $style['prev']]"
                  @click="previewLevel(userVipInfo[nowMobileIndex], 'pre')"
                />
                <div
                  v-if="
                    !isNextLevel[userVipInfo[nowMobileIndex].config_id] ||
                      !vipLevelList[userVipInfo[nowMobileIndex].config_id][
                        nowTypeLevel[userVipInfo[nowMobileIndex].config_id]
                      ].is_max_level
                  "
                  :class="[$style['arrow'], $style['next']]"
                  @click="previewLevel(userVipInfo[nowMobileIndex], 'next')"
                />
              </div>
            </div>
            <div :class="$style['vip-info']">
              <template
                v-if="!isNextLevel[userVipInfo[nowMobileIndex].config_id]"
              >
                <div
                  :class="[
                    $style['info-list'],
                    {
                      [$style['not-show']]: notShowInfoList(
                        'claim_amount',
                        userVipInfo[nowMobileIndex]
                      )
                    }
                  ]"
                >
                  <span>{{ $text("S_CLAIM_AMOUNT", "可领礼金") }}</span>
                  <span :class="$style['amount']">{{
                    commaFormat(
                      +userVipInfo[nowMobileIndex].now_birth_amount +
                        +userVipInfo[nowMobileIndex].now_gift_amount
                    )
                  }}</span>
                </div>
                <div
                  :class="[
                    $style['line'],
                    {
                      [$style['not-show']]: notShowInfoList(
                        'line_up',
                        userVipInfo[nowMobileIndex]
                      )
                    }
                  ]"
                />
                <div
                  :class="[
                    $style['info-list'],
                    {
                      [$style['not-show']]: notShowInfoList(
                        'downgrade_valid_bet',
                        userVipInfo[nowMobileIndex]
                      )
                    }
                  ]"
                >
                  <span>{{ $text("S_DOWNGRADE_VALID_BET", "保级条件") }}</span>
                  <span
                    v-if="userVipInfo[nowMobileIndex].downgrade_achieve"
                    :class="$style['amount']"
                    >{{ $text("S_CONDITIONS_MET", "已达条件") }}</span
                  >
                  <span v-else :class="$style['amount']">{{
                    commaFormat(
                      +userVipInfo[nowMobileIndex].downgrade_valid_bet
                    )
                  }}</span>
                </div>
                <div
                  :class="[
                    $style['info-list'],
                    {
                      [$style['not-show']]: notShowInfoList(
                        'downgrade_valid_bet',
                        userVipInfo[nowMobileIndex]
                      )
                    }
                  ]"
                >
                  <span
                    v-if="!userVipInfo[nowMobileIndex].downgrade_achieve"
                    :class="$style['rebate']"
                    >{{
                      $text("S_SERIAL_DAY_REACH", {
                        replace: [
                          {
                            target: "%s",
                            value: userVipInfo[nowMobileIndex].downgrade_day
                          }
                        ]
                      })
                    }}</span
                  >
                </div>
              </template>
              <template v-else>
                <div
                  :class="[
                    $style['info-list'],
                    {
                      [$style['not-show']]: notShowInfoList(
                        'gift_amount',
                        vipLevelList[userVipInfo[nowMobileIndex].config_id][
                          nowTypeLevel[userVipInfo[nowMobileIndex].config_id]
                        ]
                      )
                    }
                  ]"
                >
                  <span>{{ $text("S_VIP_ADVANCE_GIFT", "晋级礼金") }}</span>
                  <span :class="$style['amount']">{{
                    commaFormat(
                      +vipLevelList[userVipInfo[nowMobileIndex].config_id][
                        nowTypeLevel[userVipInfo[nowMobileIndex].config_id]
                      ].gift_amount
                    )
                  }}</span>
                </div>
                <div
                  :class="[
                    $style['line'],
                    {
                      [$style['not-show']]: notShowInfoList(
                        'line_down',
                        vipLevelList[userVipInfo[nowMobileIndex].config_id][
                          nowTypeLevel[userVipInfo[nowMobileIndex].config_id]
                        ]
                      )
                    }
                  ]"
                />
                <div
                  :class="[
                    $style['info-list'],
                    {
                      [$style['not-show']]: notShowInfoList(
                        'birth_amount',
                        vipLevelList[userVipInfo[nowMobileIndex].config_id][
                          nowTypeLevel[userVipInfo[nowMobileIndex].config_id]
                        ]
                      )
                    }
                  ]"
                >
                  <span>{{ $text("S_VIP_BIRTH_GIFT", "生日礼金") }}</span>
                  <span :class="$style['amount']">{{
                    commaFormat(
                      +vipLevelList[userVipInfo[nowMobileIndex].config_id][
                        nowTypeLevel[userVipInfo[nowMobileIndex].config_id]
                      ].birth_amount
                    )
                  }}</span>
                </div>
              </template>
              <div :class="$style['vip-level-bar']">
                <span>{{ userVipInfo[nowMobileIndex].now_level_name }}</span>
                <div :class="$style['bar-wrap']">
                  <img
                    :src="$getCdnPath('/static/image/mcenter/vip/bar.png')"
                    :style="{
                      width: userVipInfo[nowMobileIndex].percent + '%'
                    }"
                    :class="$style['progress-bar']"
                  />
                  <img
                    :src="$getCdnPath('/static/image/mcenter/vip/bar_bg.png')"
                    :class="$style['progress-bar-bg']"
                  />
                </div>
                <span>{{ userVipInfo[nowMobileIndex].next_level_name }}</span>
              </div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div
                :class="$style['vip-level-content']"
                v-html="
                  showHtml(
                    userVipInfo[nowMobileIndex],
                    userVipInfo[nowMobileIndex].levelUpTip
                  )
                "
              />
              <div
                v-if="
                  vipLevelList[userVipInfo[nowMobileIndex].config_id][0].seq !==
                    0 &&
                    nowTypeLevel[userVipInfo[nowMobileIndex].config_id] === 0
                "
                :class="$style['vip-card-btn']"
              >
                <div
                  :class="[$style['receive-btn'], $style['record']]"
                  @click="$router.push('/mobile/mcenter/moneyDetail')"
                >
                  {{ $text("S_GO_RECEIVE_RECORD", "查看领取记录") }}
                </div>
                <!-- 前往領取優惠暫不執行 先隱藏 -->
                <!-- <div :class="$style['receive-btn']">{{ $text('S_GO_RECEIVE', '前往领取') }}</div> -->
              </div>
            </div>
          </div>
        </div>
        <div :class="$style['vip-bottom-wrap']">
          <swiper
            :options="{ slidesPerView: 'auto' }"
            :class="[$style['vip-bottom-slider'], 'clearfix']"
          >
            <swiper-slide
              v-for="(info, index) in userVipInfo"
              :key="`vip-type-${index}}`"
              :class="[
                $style['badge-item'],
                {
                  [$style['vip-active']]:
                    index === nowMobileIndex ? true : false
                }
              ]"
            >
              <div @click="changeMobileIndex(info.config_id)">
                <div :class="$style['vip-badge']">
                  <img
                    :src="
                      isNextLevel[info.config_id]
                        ? badgeList[info.config_id][
                            nowTypeLevel[info.config_id]
                          ].img_badge_src
                        : info.img_badge_src
                    "
                  />
                </div>
                <div
                  v-if="index === nowMobileIndex"
                  :class="[$style['vip-badge'], $style['title']]"
                >
                  {{
                    isNextLevel[info.config_id]
                      ? vipLevelList[info.config_id][
                          nowTypeLevel[info.config_id]
                        ].alias
                      : info.now_level_alias
                  }}
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </template>
      <url-list
        v-if="isShowUrl"
        :url-list="allUrlList"
        @close="switchUrlList"
      />
    </template>
  </vip>
</template>

<script>
import { mapGetters } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import vip from "@/components/common/mcenter/vip";
import ajax from "@/lib/ajax";

export default {
  components: {
    mcenterHeader: () =>
      import(
        /* webpackChunkName: 'mcenterHeader' */ "@/router/mobile/components/common/mcenter/theme1/header"
      ),
    urlList: () => import(/* webpackChunkName: 'urlList' */ "./urlList"),
    vip,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      headerSetting: {
        title: "VIP",
        leftBtns: {
          icon: "arrow",
          onClick: () => this.$router.push("/mobile/mcenter")
        },
        balance: true
      },
      isShowUrl: false,
      isGoUrl: false,
      allUrlList: []
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    })
  },
  created() {
    ajax({
      method: "get",
      url: "/api/v1/c/vip/hostnames",
      errorAlert: false,
      success: ({ result, ret }) => {
        if (result === "ok" && ret.length > 0) {
          this.isGoUrl = true;
          this.allUrlList = ret;
        }
      }
    });
  },
  methods: {
    switchUrlList(isDisplay) {
      this.isShowUrl = isDisplay;
    },
    showHtml(info, levelUpTip) {
      if (info.is_max_level) {
        return this.$text(
          "S_YOU_ALREADY_HIGHEST_LEVEL",
          "您的等级已是当前最高等级"
        );
      }

      if (info.is_achieve) {
        return this.$text("S_YOU_MET_PROMOTION_REQUIREMENTS", {
          text: "您已满足%s晋级条件",
          replace: [
            {
              target: "%s",
              value: info.next_level_alias
            }
          ]
        });
      }

      return levelUpTip;
    },
    notShowInfoList(dir, thisInfo) {
      if (!thisInfo) {
        return true;
      }
      if (dir === "line_up") {
        if (!thisInfo.downgrade) {
          return true;
        }
        if (
          parseFloat(+thisInfo.now_birth_amount + +thisInfo.now_gift_amount) <=
            0 ||
          parseFloat(thisInfo.downgrade_valid_bet) <= 0
        ) {
          return true;
        }
      }
      if (dir === "line_down") {
        if (
          parseFloat(thisInfo.gift_amount) <= 0 ||
          parseFloat(thisInfo.birth_amount) <= 0
        ) {
          return true;
        }
      }
      if (
        dir === "downgrade_valid_bet" &&
        !thisInfo.downgrade &&
        thisInfo.downgrade_achieve
      ) {
        return true;
      }
      if (dir !== "claim_amount" && parseFloat(thisInfo[`${dir}`]) <= 0) {
        return true;
      }
      if (
        parseFloat(+thisInfo.now_birth_amount + +thisInfo.now_gift_amount) <= 0
      ) {
        return true;
      }
      return false;
    },
    commaFormat(value) {
      // 加上千分位符號
      return value
        .toString()
        .replace(
          /^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/,
          (all, pre, groupOf3Digital) =>
            pre + groupOf3Digital.replace(/\d{3}/g, ",$&")
        );
    }
  }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
