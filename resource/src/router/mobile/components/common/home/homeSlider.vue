<template>
  <swiper
    id="home-slider"
    :class="$style['home-slider']"
    :options="opts"
    :key="updateKey"
  >
    <swiper-slide v-for="(info, key) in slider" :key="key">
      <div :class="$style['phone-image-wrap']">
        <img
          :src="info.image"
          :class="$style['phone-image']"
          :data-key="key"
          :data-link="info.linkTo"
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
      opts: {}
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
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    ...mapActions(["actionGetMobileInfo"]),
    mobileLinkOpen,
    getImg(src) {
      return {
        src: this.$getCdnPath(src),
        error: this.$getCdnPath(
          `/static/image/${this.themeTPL}/default/bg_banner_d.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/${this.themeTPL}/default/bg_banner_d.png`
        )
      };
    },
    initSlider() {
      this.actionGetMobileInfo();
      const defaultImage = this.generateDefaultImg();
      let info = this.mobileInfo;

      // 若無資料則使用預設圖片
      if (
        !info ||
        !info.mSlider ||
        !info.mSlider.data ||
        info.mSlider.data.length === 0
      ) {
        this.slider = [defaultImage];
        return;
      }

      let list = [];

      info.mSlider.data.map(item => {
        if (!Object.keys(this.lang)) {
          return;
        }

        // 舊版輪播無限制設定
        if (!item.condition) {
          list.push(defaultImage);
          return;
        }

        if (item.condition) {
          const isShow = this.show(this.getDefaultCondition(item.condition));
          if (isShow) {
            list.push({
              ...item,
              image: `${this.cdnDomain}${item.image[this.curLang]}`
            });
          }
        }
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
        pagination: { el: ".swiper-pagination", clickable: true },
        on: {
          click(element) {
            let info = list[element.target.dataset.key];
            mobileLinkOpen({
              ...info,
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
        image: this.$getCdnPath(
          `/static/image/${this.themeTPL}/default/bg_banner_d.png`
        )
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

.phone-image-wrap {
  padding: 0 17px;
}

.phone-image {
  border-radius: 7px;
  display: block;
  width: 100%;
}

.pad-image {
  border-radius: 7px;
  display: none;
  width: 100%;
}
</style>
