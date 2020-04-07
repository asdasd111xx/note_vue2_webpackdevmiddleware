<template>
    <div
        ref="ad-wrap"
        class="ad-wrap"
    >
        <swiper :options="sliderOptions">
            <swiper-slide v-for="(data, index) in sliderData" :key="`ad-${index}`">
                <img
                    ref="slider-image"
                    :src="$getCdnPath(data[picSize][curLang])"
                    :data-info="index"
                />
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import mobileLinkOpen from '@/lib/mobile_link_open';

export default {
    components: {
        swiper,
        swiperSlide
    },
    data() {
        const winWidth = $(window).width();
        return {
            picSize: winWidth > 640 ? 'padImg' : 'image'
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            lang: 'getLang',
            curLang: 'getCurLang',
            mobileInfo: 'getMobileInfo',
            memInfo: 'getMemInfo'
        }),
        /**
         * 組輪播圖資料
         * @method sliderData
         * @returns {array} 輪播圖資料
         */
        sliderData() {
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
        sliderOptions() {
            const originSlider = this.sliderData;
            const options = {
                autoplay: {
                    delay: 3000,
                    stopOnLastSlide: false,
                    disableOnInteraction: false
                },
                // autoHeight: true,
                speed: 1000,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                }
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
    mounted() {
        $(window).resize(this.calcHeight);

        // 延遲計算輪播圖高度，避免後面的圖片吃不到高度
        setTimeout(() => {
            this.$nextTick(() => {
                this.calcHeight();
            });
        }, 25);
    },
    beforeDestroy() {
        $(window).off('resize', this.calcHeight);
    },
    methods: {
        /**
         * 開啟連結
         * @method mobileLinkOpen
         * @param {string} linkType - 連結類型
         * @param {string} linkTo - 連結目的地
         * @param {string} linkItem - 連結子項目
         */
        mobileLinkOpen,
        /**
         * 計算高度
         * @method calcHeight
         */
        calcHeight() {
            const winWidth = $(window).width();

            // 防止圖片上傳尺寸過大造成跑版
            $(this.$refs['ad-wrap'])
                .add(this.$refs['slider-image'])
                .css('max-height', winWidth > 640 ? 200 : 225);

            this.picSize = winWidth > 640 ? 'padImg' : 'image';
        },
        /**
         * 生成預設圖片物件
         * @method generateDefaultImg
         */
        generateDefaultImg() {
            const imageData = Object.keys(this.lang).reduce((init, key) => ({
                ...init,
                image: {
                    ...init.image,
                    [key]: `/static/image/mobile/lang/${key}/os_banner_phone.jpg`
                },
                padImg: {
                    ...init.padImg,
                    [key]: `/static/image/mobile/lang/${key}/os_banner_pad.jpg`
                }
            }), {});

            return {
                linkType: 'nolink', linkTo: '', linkItem: '', ...imageData
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

<style lang="scss" scoped>
.ad-wrap {
    img {
        display: block;
        width: 100%;
    }
}
</style>
