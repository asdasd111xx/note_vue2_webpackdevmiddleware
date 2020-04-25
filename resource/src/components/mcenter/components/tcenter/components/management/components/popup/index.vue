<template>
    <div :class="$style.wrap">
        <template v-if="['CODE', 'LINK'].indexOf(type) >= 0">
            <div :class="$style.mask" />
            <div :class="$style.content">
                <div :class="$style.icon"><img :src="$getCdnPath('/static/image/_new/mcenter/tcenter/ic_ok.png')" /></div>
                <div :class="$style.text">{{ $text(`S_${type}_COPIED`) }}</div>
            </div>
        </template>
        <template v-else>
            <div :class="$style['qr-mask']" />
            <div :class="$style['qr-wrap']">
                <div :class="[$style['qr-content'],'clearfix']">
                    <swiper
                        ref="qrSwiper"
                        :options="categoryOptions"
                        :class="$style['edition']"
                        class="cleafix"
                    >
                        <swiper-slide v-for="(item, index) in qrCodeBackground" :key="item">
                            <div :class="$style.close" @click="$emit('close')">
                                <icon :class="$style['close-icon']" name="times" />
                            </div>
                            <div v-if="isCombine && !isPwa" :class="$style['qrcode']">
                                <!-- 顯示已組合後的img -->
                                <img :src="canvasLink[index]" :class="$style['qr-img']" />
                            </div>
                            <div v-else :class="$style['print-area']">
                                <!-- 未組合的圖片，等html2canvas完成後隱藏 -->
                                <div ref="printMe">
                                    <img
                                        :src="`/static/image/_new/lang/qrcode/${curLang}/${item}.jpg`"
                                        :class="$style['qr-bgimg']"
                                        @load="aferLoad(index)"
                                    />
                                    <qrcode
                                        :value="link"
                                        :class="$style[qrCodeEdition[item]]"
                                        tag="img"
                                    />
                                </div>
                            </div>
                            <template v-if="isPwa">
                                <a
                                    :class="$style['qr-save']"
                                    :href="hrefLink(index)"
                                    download="QRCode.png"
                                >
                                    {{ $text('S_SCREENSHOT_SAVE','点击截屏保存') }}
                                </a>
                            </template>
                            <template v-else>
                                <div :class="$style['qr-save']">
                                    {{ $text('S_PRESS_DOWNLOAD','长按下载图片') }}
                                </div>
                            </template>
                        </swiper-slide>
                        <div :class="[$style.navi, $style['btn-prev']]">
                            <icon :class="$style['navi-icon']" name="chevron-left" />
                        </div>
                        <div :class="[$style.navi, $style['btn-next']]">
                            <icon :class="$style['navi-icon']" name="chevron-right" />
                        </div>
                    </swiper>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import html2canvas from 'html2canvas';

/**
 * @param {String} type - 彈窗類型
 * @param {String} link - 推廣連結
 */
export default {
    components: {
        Swiper,
        SwiperSlide
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
            canvasLink: [],
            isCombine: false,
            categoryOptions: {
                effect: 'fade',
                simulateTouch: false,
                allowTouchMove: false,
                navigation: {
                    nextEl: `.${this.$style['btn-next']}`,
                    prevEl: `.${this.$style['btn-prev']}`,
                    disabledClass: `${this.$style['navi-disabled']}`
                }
            },
            qrCodeEdition: {
                qrcode_a: 'qrcode-img-a',
                qrcode_b: 'qrcode-img-b'
            },
            isCombineFinish: []
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang',
            isPwa: 'getIsPwa'
        }),
        qrCodeBackground() {
            return Object.keys(this.qrCodeEdition);
        }
    },
    methods: {
        aferLoad(index) {
            this.$nextTick(() => {
                // html2canvas會依據當前畫面擷取，則須將scroll = 0
                window.scrollTo(0, 0);
                const el = this.$refs.printMe[index];
                const options = {
                    useCORS: true,
                    windowWidth: document.body.scrollWidth,
                    windowHeight: document.body.scrollHeight
                };
                html2canvas(el, options).then((canvas) => {
                    this.$set(this.canvasLink, index, canvas.toDataURL());
                    this.isCombineFinish.push(index);
                    if (this.isCombineFinish.length === Object.keys(this.qrCodeEdition).length) {
                        this.isCombine = true;
                    }
                });
            });
        },
        hrefLink(index) {
            return `javascript: window.open('${this.canvasLink[index]}');`;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
