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
              :src="
                $getCdnPath(
                  `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/vip/vipcard_bg.png`
                )
              "
              alt="vipcard_bg"
            />
            <div :class="$style['card-level-text']">
              {{ item.alias }}
            </div>

            <!-- 有達成時的icon -->
            <img
              v-if="item.seq <= userVipInfo.now_level_seq"
              :class="$style['card-level-image']"
              :src="
                $getCdnPath(
                  `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/vip/ic_vip${item.seq}.png`
                )
              "
              alt="vipLevel_bg"
            />
            <!-- 尚未達成的icon -->
            <img
              v-else
              :class="$style['card-level-image']"
              :src="
                $getCdnPath(
                  `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/vip/ic_s_vip${item.seq}.png`
                )
              "
              alt="vipLevel_bg"
            />
            <div :class="$style['card-desc-block']">
              <div>
                {{ commaFormat(item.deposit_total) }}
                <br />
                累计充值
              </div>
              <div>
                {{ commaFormat(item.valid_bet_limit) }}
                <br />
                流水要求
              </div>
              <div>
                {{ item.downgrade_valid_bet }} <br />
                保级投注
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
    }
  },
  data() {
    return {
      selectedIndex: 0,
      swiperWidth: null
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
    vipLevelOption() {
      return {
        slidesPerView: "auto"
        // allowTouchMove: false
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
        this.selectedIndex = this.userVipInfo.now_level_seq;
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
