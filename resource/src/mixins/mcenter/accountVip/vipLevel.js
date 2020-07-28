import { Swiper, SwiperSlide } from "vue-awesome-swiper";

export default {
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
      this.selectedIndex = this.userVipInfo.now_level_seq;
      swiperLevel.slideTo(this.selectedIndex, 0, false);
      swiperCard.slideTo(this.selectedIndex, 0, false);
      this.$emit(
        "update:currentLevelData",
        this.vipLevelList[this.selectedIndex]
      );
    }
  },
  watch: {
    vipLevelList() {
      this.$nextTick(() => {
        this.initSwiper();
      });
    }
  }
}
