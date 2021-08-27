<template>
  <div :class="$style['vip-card-wrap']">
    <!-- vip-level thumbs -->
    <div :class="$style['card-level-container']">
      <swiper
        :class="$style['vipSwiperContainer']"
        ref="swiperLevel"
        :options="vipLevelOption"
      >
        <swiper-slide
          :class="$style['level-slide']"
          v-for="(item, index) in vipLevelList"
          :key="`vip-${index}`"
        >
          <div
            :class="[
              $style['level-thumb-cell'],
              { [$style['active']]: selectedIndex === index }
            ]"
            @click="onClickLevel(index)"
          >
            <!-- VIP{{ item.seq }} -->
            {{ item.alias }}
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- vip-card thumbs -->
    <div :class="$style['card-desc-container']">
      <swiper
        :class="$style['vipSwiperContainer']"
        ref="swiperCard"
        :options="vipCardOption"
      >
        <swiper-slide
          v-for="(item, index) in vipLevelList"
          :key="`vipcard-${index}`"
        >
          <div :class="$style['card-thumb-cell']">
            <img
              :src="$getCdnPath(`/static/image/common/vip/vipcard_bg.png`)"
              alt="vipcard_bg"
            />
            <div :class="$style['card-level-text']">
              {{ item.alias }}
            </div>
            <div
              v-if="
                item.seq === userVipInfo.now_level_seq && userVipInfo.downgrade
              "
              :class="$style['card-level-downgrade']"
              @click="onClickDowngrade(true)"
            >
              如何保级？
            </div>

            <!-- 有達成時的icon -->
            <img
              v-if="item.seq <= userVipInfo.now_level_seq"
              :class="$style['card-level-image']"
              :src="
                $getCdnPath(`/static/image/common/vip/ic_vip${item.seq}.png`)
              "
              alt="vipLevel_bg"
            />
            <!-- 尚未達成的icon -->
            <img
              v-else
              :class="$style['card-level-image']"
              :src="
                $getCdnPath(`/static/image/common/vip/ic_s_vip${item.seq}.png`)
              "
              alt="vipLevel_bg"
            />
            <div :class="$style['card-desc-block']">
              <div v-if="vipConfig.base_type != 3">
                {{ commaFormat(item.deposit_total) }}
                <br />
                累计充值(元)
              </div>
              <div v-else>
                {{ commaFormat(item.deposit_limit) }}
                <br />
                当前充值(元)
              </div>
              <div>
                {{
                  vipConfig.base_type != 3
                    ? commaFormat(item.valid_bet_limit)
                    : commaFormat(item.valid_bet_range)
                }}
                <br />
                当前流水(元)
              </div>
              <div v-if="vipConfig.base_type != 3">
                {{ commaFormat(item.deposit_limit) }}
                <br />
                当前充值(元)
              </div>
              <div>
                {{ commaFormat(item.deposit_time) }}
                <br />
                充值次数
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- page -->
    <div :class="[$style['card-page']]">
      <span>{{ selectedIndex + 1 }}</span
      >/<span>{{ vipLevelList.length }}</span>
    </div>

    <div v-if="showDowngradeData" :class="[$style['downgrade-data']]">
      <div :class="[$style['downgrade-mask']]" />
      <div :class="[$style['downgrade-wrap']]">
        <div :class="[$style['downgrade-value-wrap']]">
          <div :class="[$style['downgrade-value']]">
            保级条件(<span :class="[$style['downgrade-limit-day']]">{{
              userVipInfo.downgrade_day
            }}</span
            >天内完成)
          </div>
          <div :class="[$style['downgrade-value']]">
            • 保级充值(元)：
            <span
              :class="[
                $style['downgrade-limit-count'],
                { [$style['done']]: userVipInfo.downgrade_deposit_achieve }
              ]"
              >{{
                userVipInfo.downgrade_deposit_achieve
                  ? "已达条件"
                  : `${userVipInfo.downgrade_own_deposit}(${userVipInfo.downgrade_own_deposit}/${userVipInfo.downgrade_deposit_range})`
              }}</span
            >
          </div>
          <div :class="[$style['downgrade-value']]">
            • 保级流水(元)：
            <span
              :class="[
                $style['downgrade-limit-count'],
                { [$style['done']]: userVipInfo.downgrade_valid_bet_achieve }
              ]"
              >{{
                userVipInfo.downgrade_valid_bet_achieve
                  ? "已达条件"
                  : `${userVipInfo.downgrade_own_valid_bet}(${userVipInfo.downgrade_own_valid_bet}/${userVipInfo.downgrade_valid_bet})`
              }}</span
            >
          </div>
          <div :class="[$style['downgrade-value']]">
            • 保级推广(位)：
            <span
              :class="[
                $style['downgrade-limit-count'],
                { [$style['done']]: userVipInfo.downgrade_members_achieve }
              ]"
              >{{
                userVipInfo.downgrade_members_achieve
                  ? "已达条件"
                  : `${userVipInfo.downgrade_own_members}(${userVipInfo.downgrade_own_members}/${userVipInfo.downgrade_members})`
              }}</span
            >
          </div>
          <div
            v-if="!userVipInfo.downgrade_members_achieve"
            :class="[$style['downgrade-value']]"
          >
            {{ `(每位充值达${userVipInfo.downgrade_members_deposit}元)` }}
          </div>
        </div>
        <div
          :class="[$style['downgrade-button']]"
          @click="onClickDowngrade(false)"
        >
          关闭
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { mapGetters } from "vuex";

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    currentLevelData: {
      type: Object | null,
      required: true
    },
    vipLevelList: {
      type: Array | null,
      required: true
    },
    userVipInfo: {
      type: Object,
      required: true
    },
    vipConfig: {
      type: Array | null,
      required: true
    }
  },
  data() {
    return {
      selectedIndex: 0,
      swiperWidth: null,
      showDowngradeData: false
    };
  },
  filters: {
    roundTwoPoints(value) {
      return Number(value).toFixed(2);
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    vipLevelOption() {
      return {
        freeMode: true,
        freeModeSticky: true,
        slidesPerView: "auto",
        centeredSlides: true,
        centeredSlidesBounds: true // 設置居中後，使第一个和最后一个 Slide 始终贴合边缘
      };
    },
    vipCardOption() {
      return {
        slidesOffsetBefore: 15,
        width: this.swiperWidth,
        spaceBetween: 10
      };
    }
  },
  created() {
    this.swiperWidth = document.body.offsetWidth - 65;
  },
  mounted() {
    const swiperLevel = this.$refs.swiperLevel.$swiper;
    const swiperCard = this.$refs.swiperCard.$swiper;

    // 根據當前VIP等級進行初始化
    // this.initSwiper();
    this.$nextTick(() => {
      swiperCard.on("slideChange", () => {
        this.selectedIndex = swiperCard.realIndex;
        swiperLevel.slideTo(this.selectedIndex, 500, false);
        this.$emit(
          "update:currentLevelData",
          this.vipLevelList[this.selectedIndex]
        );
      });
    });
  },
  methods: {
    onClickLevel(index) {
      const swiperCard = this.$refs.swiperCard.$swiper;

      swiperCard.slideTo(index, 500, false);
      this.$emit("update:currentLevelData", this.vipLevelList[index]);
    },
    initSwiper() {
      const swiperLevel = this.$refs.swiperLevel.$swiper;
      const swiperCard = this.$refs.swiperCard.$swiper;

      if (this.userVipInfo.now_level_seq >= 2) {
        this.selectedIndex = this.userVipInfo.now_level_seq - 1;
      } else {
        this.selectedIndex = 0;
      }

      swiperLevel.slideTo(this.selectedIndex, 0, false);
      swiperCard.slideTo(this.selectedIndex, 0, false);
      this.$emit(
        "update:currentLevelData",
        this.vipLevelList[this.selectedIndex]
      );
    },
    commaFormat(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    onClickDowngrade(type) {
      this.showDowngradeData = type;
    }
  },
  watch: {
    vipLevelList() {
      this.$nextTick(() => {
        this.initSwiper();
      });
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/vip/porn1.vipLevelCard.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="@/css/page/vip/ey1.vipLevelCard.scss"
  module="$style_ey1"
></style>
<style
  lang="scss"
  src="@/css/page/vip/sg1.vipLevelCard.scss"
  module="$style_sg1"
></style>
