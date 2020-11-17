<template>
  <swiper v-if="options" :options="options">
    <swiper-slide v-for="(info, key) in slider" :key="key">
      <div :class="$style['phone-image-wrap']">
        <img
          :class="$style['phone-image']"
          :src="
            info.image && info.image[curLang]
              ? $getCdnPath(info.image[curLang])
              : '/static/image/_new/default/bg_banner_d.png'
          "
          :data-info="key"
          :data-link="info.linkTo"
        />
      </div>
    </swiper-slide>
    <div slot="pagination" class="swiper-pagination" />
  </swiper>
</template>

<script>
import { mapGetters } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import mobileLinkOpen from '@/lib/mobile_link_open';

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  computed: {
    ...mapGetters({
      cdnDomain: 'getCdnDomain',
      curLang: 'getCurLang',
      lang: 'getLang',
      mobileInfo: 'getMobileInfo',
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo'
    }),
    slider() {
      // 若無資料則使用預設圖片
      if (!this.mobileInfo.mSlider || this.mobileInfo.mSlider.data.length === 0) {
        const imageData = this.generateDefaultImg();
        return [imageData];
      }
      const list = [];
      this.mobileInfo.mSlider.data.forEach((data) => {
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
      return list;
    },
    options() {
      const hasData = this.slider.length > 1;
      const originSlider = this.slider;
      const options = {
        loop: hasData,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: hasData ? { el: '.swiper-pagination', clickable: true } : { el: null }
      };

      return {
        ...options,
        on: {
          click(element) {
            mobileLinkOpen(originSlider[element.target.dataset.info]);
          }
        }
      };
    }
  },
  methods: {
    mobileLinkOpen,
    /**
     * 生成預設圖片物件
     * @method generateDefaultImg
     */
    generateDefaultImg() {
      return {
        linkType: 'nolink', linkTo: '', linkItem: '',
        image: { 'zh-cn': '/static/image/_new/default/bg_banner_d.png' }
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
