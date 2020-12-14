<template>
  <swiper :options="options">
    <swiper-slide v-for="(info, key) in slider" :key="key">
      <div :class="$style['phone-image-wrap']">
        <img
          @click="
            mobileLinkOpen({
              ...info,
              site: themeTPL
            })
          "
          :src="
            info.image && info.image[curLang]
              ? $getCdnPath(info.image[curLang])
              : `/static/image/${themeTPL}/default/bg_banner_d.png`
          "
          :class="$style['phone-image']"
          :data-link="info.linkTo"
          :alt="info.image"
        />
      </div>
    </swiper-slide>
    <div slot="pagination" class="swiper-pagination" />
  </swiper>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import mobileLinkOpen from '@/lib/mobile_link_open';

export default {
  data() {
    return {
      slider: [],
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  beforeDestroy() {
    clearInterval(this.getSliderTimer);
    this.getSliderTimer = null;
    localStorage.removeItem('mobile-slider');
  },
  mounted() {
    this.initSlider();
  },
  computed: {
    ...mapGetters({
      cdnDomain: 'getCdnDomain',
      curLang: 'getCurLang',
      lang: 'getLang',
      mobileInfo: 'getMobileInfo',
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
      siteConfig: 'getSiteConfig',
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    options() {
      return {
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true }
      };
    }
  },
  methods: {
    ...mapActions([
      'actionGetMobileInfo'
    ]),
    mobileLinkOpen,
    getImg(src) {
      return {
        src: this.$getCdnPath(src),
        error: this.$getCdnPath(`/static/image/${this.themeTPL}/default/bg_banner_d.png`),
        loading: this.$getCdnPath(`/static/image/${this.themeTPL}/default/bg_banner_d.png`)
      };
    },
    initSlider() {
      this.actionGetMobileInfo();
      let mobileSlider = JSON.parse(localStorage.getItem('mobile-slider')) || this.mobileInfo;

      // 若無資料則使用預設圖片
      if (!mobileSlider ||
        !mobileSlider.mSlider ||
        !mobileSlider.mSlider.data ||
        mobileSlider.mSlider.data.length === 0) {
        const imageData = this.generateDefaultImg();
        this.slider = [imageData];
        return;
      }

      let list = [];
      console.log(mobileSlider)
      mobileSlider.mSlider.data.forEach((data) => {
        if (!Object.keys(this.lang)) {
          return;
        }

        const imageData = Object.keys(this.lang).reduce((init, key) => ({
          ...init,
          image: { ...init.image, [key]: `${this.cdnDomain}${data.image[key]}` },
          padImg: { ...init.padImg, [key]: `${this.cdnDomain}${data.padImg[key]}` },
          linkItem: data.linkItem,
          linkTo: data.linkTo,
          linkType: data.linkType
        }), {});

        // 舊版輪播無限制設定
        if (!data.condition) {
          list.push(imageData);
        }

        if (data.condition) {
          const isShow = this.show(this.getDefaultCondition(data.condition));
          if (isShow) list.push(imageData);
        }
      });
      // 若限制條件都不符合使用預設圖片
      if (list.length === 0) {
        const imageData = this.generateDefaultImg();
        list.push(imageData);
      }
      this.slider = list;
    },
    /**
     * 生成預設圖片物件
     * @method generateDefaultImg
     */
    generateDefaultImg() {
      return {
        linkType: 'nolink', linkTo: '', linkItem: '',
        image: { 'zh-cn': `/static/image/${this.themeTPL}/default/bg_banner_d.png` }
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

      keys.forEach((key) => {
        if (data[key] !== '') {
          condition = JSON.parse(data[key]);
        }
      });
      return condition;
    }
  }
};
</script>

<style lang="scss" module>
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
