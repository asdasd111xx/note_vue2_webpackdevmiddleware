<template>
  <swiper
    id="home-slider"
    :class="[$style['home-slider'], $style[siteConfig.MOBILE_WEB_TPL]]"
    :options="opts"
    :key="updateKey"
  >
    <swiper-slide v-for="(info, key) in slider" :key="key">
      <div :class="$style['phone-image-wrap']">
        <!-- 輪播預設圖 -->
        <div
          v-if="`${info.image}` === ''"
          :class="[$style['phone-image'], $style[themeTPL]]"
          :data-key="key"
        />
        <!-- 輪播圖 -->
        <img
          v-else
          :src="`${info.image}`"
          :class="[$style['phone-image'], $style[themeTPL]]"
          :data-key="key"
        />
      </div>
    </swiper-slide>
    <div slot="pagination" class="swiper-pagination" />
  </swiper>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import mobileLinkOpen from "@/lib/mobile_link_open";

export default {
  data() {
    return {
      slider: [],
      updateKey: 0,
      opts: {},
      isClicked: false
    };
  },
  components: {
    Swiper,
    SwiperSlide
  },
  beforeDestroy() {
    clearInterval(this.getSliderTimer);
    this.getSliderTimer = null;
  },
  mounted() {
    const defaultImage = this.generateDefaultImg();
    this.slider = [defaultImage];
    this.initSlider();
  },
  computed: {
    ...mapGetters({
      cdnDomain: "getCdnDomain",
      curLang: "getCurLang",
      lang: "getLang",
      mobileInfo: "getMobileInfo",
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      slideCDNDomain: "getSlideCDNDomain"
    }),
    themeTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  watch: {
    mobileInfo() {
      this.initSlider();
    }
  },
  methods: {
    ...mapActions(["actionGetMobileInfo"]),
    mobileLinkOpen,
    initSlider() {
      const info = this.mobileInfo;
      const mobile_slide =
        info && info.case_data && info.case_data.MOBILE_SLIDE;
      const defaultImage = this.generateDefaultImg();

      // 若無資料則使用預設圖片
      if (
        !mobile_slide ||
        !mobile_slide.data ||
        mobile_slide.data.length === 0
      ) {
        this.slider = [defaultImage];
        setTimeout(() => {
          this.initSlider();
        }, 2000);
        return;
      }

      let list = [];

      mobile_slide.data.map(item => {
        // if (!Object.keys(this.lang)) {
        //   return;
        // }

        // const isShow = this.show(this.getDefaultCondition(item.condition));
        let cdn = this.slideCDNDomain
          ? `${this.slideCDNDomain}/upload-image`
          : "/cdn";
        list.push({
          ...item,
          image: `${cdn}${item.image0["zh-cn"]}`
        });
      });

      // 若限制條件都不符合使用預設圖片
      if (list.length === 0) {
        list.push(defaultImage);
      }
      this.slider = list;
      let hasLoop = list && list.length > 1;
      this.opts = {
        loop: hasLoop,
        autoplay: hasLoop ? { delay: 5000, disableOnInteraction: false } : {},
        pagination: hasLoop
          ? { el: ".swiper-pagination", clickable: true }
          : {},
        on: {
          click(element) {
            if (this.isClicked) {
              return;
            }

            this.isClicked = true;
            setTimeout(() => {
              this.isClicked = false;
            }, 1500);

            let target = list[element.target.dataset.key];
            mobileLinkOpen({
              ...target,
              site: this.themeTPL
            });
          }
        }
      };
      this.updateKey = 1;
    },
    /**
     * 生成預設圖片物件
     * @method generateDefaultImg
     */
    generateDefaultImg() {
      return {
        linkType: "nolink",
        linkTo: "",
        linkItem: "",
        image: ""
        // image: this.$getCdnPath(
        //   `/static/image/${this.themeTPL}/default/bg_banner_d.png`
        // )
        // image: {
        //   "zh-cn": `/static/image/${this.themeTPL}/default/bg_banner_d.png`
        // }
      };
    },
    /**
     * 顯示輪播圖
     * @method play
     * @param {object}} conditions - 顯示條件
     */
    show(conditions) {
      const { isBeforeLoginShow, isAfterLoginShow, amount } = conditions;

      // 使用者登入，但登入後不顯示
      if (this.loginStatus && !isAfterLoginShow) {
        return false;
      }

      // 使用者未登入，但登入前不顯示
      if (!this.loginStatus && !isBeforeLoginShow) {
        return false;
      }

      // 判斷額度門檻，若取不到餘額則忽略此條件
      const balance = parseInt(this.memInfo.balance.total, 10);
      if (amount && balance >= 0 && balance < amount) {
        return false;
      }

      return true;
    },
    /**
     * 取得預設的限制設定
     * @returns {object} condition
     */
    getDefaultCondition(data) {
      const keys = Object.keys(data);
      let condition = {};

      keys.forEach(key => {
        if (data[key] !== "") {
          condition = JSON.parse(data[key]);
        }
      });
      return condition;
    }
  }
};
</script>

<style lang="scss" module>
.home-slider {
  z-index: 4;
  position: relative;

  .phone-image-wrap {
    padding: 0 17px;
  }

  .phone-image {
    border-radius: 7px;
    display: block;
    width: 100%;
    height: 120px;
    background: linear-gradient(180deg, #fdfeff, #e2e8fe);
    z-index: 0;

    &::after {
      content: "";
      position: absolute;
      z-index: 1;
      width: 75px;
      height: 75px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-image: url("/static/image/porn1/default/default_logo.png");
    }
    &.aobo1 {
      background: linear-gradient(180deg, #fdfeff, #fdf2f2);
      &::after {
        content: "";
        background-image: url("/static/image/aobo1/default/default_logo.png");
      }
    }
    &.sp1 {
      background: linear-gradient(180deg, #fdfeff, #e2e8fe);
      &::after {
        content: "";
        background-image: url("/static/image/sp1/default/default_logo.png");
        background-size: cover;
      }
    }
  }

  .pad-image {
    border-radius: 7px;
    display: none;
    width: 100%;
  }

  &.ey1 {
    // height: 200px;

    .phone-image-wrap {
      padding: 0;
    }

    .phone-image,
    .pad-image {
      border-radius: unset;
      // position: absolute;
      // top: 0;
      // bottom: 0;
      // margin: auto;
    }
  }
}

:global {
  .swiper-pagination-bullet {
    width: 5px;
    height: 5px;
    background-color: #c0c4cc;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: #fff;
  }
}
</style>
