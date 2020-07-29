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
    };
  },
  filters: {
    roundTwoPoints(value) {
      return Number(value).toFixed(2);
    }
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
