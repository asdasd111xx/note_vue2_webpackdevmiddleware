<template>
    <swiper
        v-if="options"
        :options="options"
        :class="{ [$style['tab-fixed']]: hallTab !== 'home' }"
    >
        <swiper-slide v-for="(info, key) in slider" :key="key">
            <img
                :class="$style['phone-image']"
                :src="$getCdnPath(info.image[curLang])"
                :data-info="key"
            />
            <img
                :class="$style['pad-image']"
                :src="$getCdnPath(info.padImg[curLang])"
                :data-info="key"
            />
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination" />
    </swiper>
</template>

<script>
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import mobileLinkOpen from '@/lib/mobile_link_open';

export default {
    components: {
        swiper,
        swiperSlide
    },
    props: {
        hallTab: {
            type: String,
            required: true
        }
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
                autoplay: hasData ? { delay: 6000, disableOnInteraction: false } : false,
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

<style lang="scss" module>
.tab-fixed {
    margin-top: 44px;
}

:global {
    .swiper-pagination-bullet {
        width: 5px;
        height: 5px;
        background-color: #C0C4CC;
        opacity: 1;
    }

    .swiper-pagination-bullet-active {
        background-color: #FFF;
    }
}

.phone-image {
    display: block;
    width: 100%;
}

.pad-image {
    display: none;
    width: 100%;
}

@media screen and (min-width: 640px) {
    .phone-image {
        display: none;
    }

    .pad-image {
        display: block;
    }
}
</style>
