<template>
  <div :class="$style.wrap">
    <template v-if="['CODE', 'LINK'].indexOf(type) >= 0">
      <div :class="$style.mask" />
      <div :class="$style.content">
        <div :class="$style.icon">
          <img
            :src="$getCdnPath('/static/image/_new/mcenter/tcenter/ic_ok.png')"
          />
        </div>
        <div :class="$style.text">{{ $text(`S_${type}_COPIED`) }}</div>
      </div>
    </template>
    <template v-else>
      <share v-if="themeTPL === 'porn1'" :is-show-share.sync="isShowShare" />
      <ey1-share
        v-else-if="themeTPL === 'ey1'"
        :is-show-share.sync="isShowShare"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import html2canvas from 'html2canvas';
import share from '@/router/mobile/components/tpl/porn1/components/mcenter/components/home/components/share';
import ey1Share from '@/router/mobile/components/tpl/ey1/components/mcenter/components/home/components/share';

/**
 * @param {String} type - 彈窗類型
 * @param {String} link - 推廣連結
 */
export default {
  components: {
    Swiper,
    SwiperSlide,
    share,
    ey1Share
  },
  props: {
    type: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  },
  data() {
    return {

      toggleShare: false,
      canvasLink: [],
      categoryOptions: {
        effect: 'fade',
        simulateTouch: false,
        allowTouchMove: false,
        navigation: {
          nextEl: `.${this.$style['btn-next']}`,
          prevEl: `.${this.$style['btn-prev']}`,
          disabledClass: `${this.$style['navi-disabled']}`
        },
        on: {
          init: () => {
            if (this.isCombineFinish.length === this.qrCodeBackground.length) {
              this.htmlToCanvas(0);
            }
            this.isSwiperInit = true;
          },
          slideChangeTransitionEnd: () => {
            if (this.isCombineFinish.length === this.qrCodeBackground.length && this.swiperIndex >= 0) {
              this.htmlToCanvas(this.swiperIndex);
            }
          }
        }
      },
      qrCodeEdition: {
        qrcode_a: 'qrcode-img-a',
        qrcode_b: 'qrcode-img-b'
      },
      isCombineFinish: [],
      isMounted: false,
      isSwiperInit: false
    };
  },
  computed: {
    ...mapGetters({
      curLang: 'getCurLang',
      isPwa: 'getIsPwa',
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    qrCodeBackground() {
      return Object.keys(this.qrCodeEdition);
    },
    swiperIndex() {
      return this.isMounted ? this.$refs.qrSwiper.$swiper.activeIndex : -1;
    },
    isShowShare: {
      get() {
        return this.toggleShare;
      },
      set(value) {
        this.toggleShare = value;
        if (!value) {
          this.$emit('close');
        }
      }
    }
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    aferLoad(index) {
      this.isCombineFinish.push(index);
      if (this.isCombineFinish.length === this.qrCodeBackground.length && this.isSwiperInit) {
        this.htmlToCanvas(0);
      }
    },
    htmlToCanvas(index) {
      if (this.canvasLink[index]) {
        return;
      }
      this.$nextTick(() => {
        // html2canvas會依據當前畫面擷取，則須將scroll = 0
        window.scrollTo(0, 0);
        const el = this.$refs[`printMe${index}`][0];
        const options = {
          useCORS: true,
          windowWidth: document.body.scrollWidth,
          windowHeight: document.body.scrollHeight
        };
        html2canvas(el, options).then((canvas) => {
          this.$set(this.canvasLink, index, canvas.toDataURL());
        });
      });
    },
    openImg(index) {
      window.open(this.canvasLink[index]);
    }
  }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
