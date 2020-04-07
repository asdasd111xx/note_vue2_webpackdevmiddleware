<template>
    <div
        :ref="`cloud9-${element.i}`"
        :style="wrapStyle"
        :class="['cloud9-wrap', { 'is-show': isShow }]"
    >
        <div
            v-for="(info, index) in sliderData"
            :key="index"
            :style="itemStyle"
            class="cloud9-item"
            @mouseenter="isItemHover = true"
            @mouseleave="isItemHover = false"
        >
            <div class="cloud9-box">
                <img :src="$getCdnPath(`${cdnDomain}${info.image}`)" />
                <img
                    :src="$getCdnPath(getPlayImg)"
                    class="play"
                    @click="changePage(info)"
                />
            </div>
        </div>
        <div v-if="sliderData.length > 1" class="cloud9-btn-wrap clearfix">
            <div
                :class="['prev', `prev-${element.i}`]"
                @mouseenter="isPrevHover = true"
                @mouseleave="isPrevHover = false"
            >
                <img :src="$getCdnPath(getPrevImg)" />
            </div>
            <div
                :class="['next', `next-${element.i}`]"
                @mouseenter="isNextHover = true"
                @mouseleave="isNextHover = false"
            >
                <img :src="$getCdnPath(getNextImg)" />
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';

/**
 * 輪播元件 cloud9Carousel
 * @module element/common/new/slider/cloud9Carousel
 * @param {Object} element - 模塊資料
 * @param {Array} sliderData - 輪播資料
 */
export default {
    props: {
        element: {
            type: Object,
            default: null
        },
        sliderData: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            self: null,
            isShow: false,
            isPrevHover: false,
            isNextHover: false,
            isItemHover: false
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd'
        }),
        /**
         * 取得輪播圖外層高度
         * @method wrapStyle
         * @returns {object} - css object
         */
        wrapStyle() {
            const { height } = this.element.case.setting;

            return { height: `${height * 1.8}px` };
        },
        /**
         * 取得輪播圖寬度
         * @method itemStyle
         * @returns {object} - css object
         */
        itemStyle() {
            const { width } = this.element.case.setting;

            return { width: `${width}px` };
        },
        /**
         * 取得 Prev 圖片
         * @method getPrevImg
         * @returns {string} - 圖片路徑
         */
        getPrevImg() {
            if (this.isPrevHover) {
                return `${this.cdnDomain}${this.element.case.setting.leftBtnImgHover}`;
            }

            return `${this.cdnDomain}${this.element.case.setting.leftBtnImg}`;
        },
        /**
         * 取得 Next 圖片
         * @method getNextImg
         * @returns {string} - 圖片路徑
         */
        getNextImg() {
            if (this.isNextHover) {
                return `${this.cdnDomain}${this.element.case.setting.rightBtnImgHover}`;
            }

            return `${this.cdnDomain}${this.element.case.setting.rightBtnImg}`;
        },
        /**
         * 取得 Play 圖片
         * @method getPlayImg
         * @returns {string} - 圖片路徑
         */
        getPlayImg() {
            if (this.isItemHover) {
                return `${this.cdnDomain}${this.element.case.setting.playBtnImgHover}`;
            }

            return `${this.cdnDomain}${this.element.case.setting.playBtnImg}`;
        }
    },
    beforeDestroy() {
        // 移除所有被Cloud9Carousel綁定的事件
        this.self.data('cloud9').deactivate();
    },
    mounted() {
        // 使用nextTick待DOM更新後才執行Cloud9Carousel
        // 防止在新增此輪播圖時會無法順利將輪播效果套用上去
        this.$nextTick(() => {
            this.self = $(this.$refs[`cloud9-${this.element.i}`]).Cloud9Carousel({
                xRadius: this.element.case.setting.width * 0.84,
                yRadius: this.element.case.setting.height / 3.8,
                farScale: 0.5,
                speed: 5,
                autoPlayDelay: 5000,
                bringToFront: true,
                itemClass: 'cloud9-item',
                frontItemClass: 'active',
                handle: 'cloud9',
                autoPlay: this.sliderData.length > 1 ? 1 : 0,
                buttonLeft: this.sliderData.length > 1 ? $(`.prev-${this.element.i}`) : '',
                buttonRight: this.sliderData.length > 1 ? $(`.next-${this.element.i}`) : ''
            });

            // 使用setTimeout防止編輯並點選確定後在重新Render時
            // 圖片會短暫吃不到Cloud9Carousel造成跑版
            // 因此使用此方法待時間過去在顯示輪播圖
            setTimeout(() => {
                this.isShow = true;
            }, 200);
        });
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        /**
         * 切換頁面
         * @method changePage
         * @param {string} linkTo - 連結位置
         * @param {string} linkType - 連結類型
         * @param {string} linkItem - 連結子項目
         */
        changePage({ linkTo, linkType, linkItem }) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({
                page: linkTo,
                type: linkType,
                config: { linkItem }
            });
        },
        /**
         * 切換輪播圖
         * @method go
         * @param {number} index - 索引
         */
        go(index) {
            this.self.data('cloud9').go(index);
        }
    }
};
</script>

<style lang="scss" scoped>
.cloud9-wrap {
    visibility: hidden;

    &.is-show {
        visibility: visible;
    }
}

.cloud9-item {
    &.active {
        .cloud9-box {
            .play {
                display: block;
            }

            .mask {
                display: none;
            }
        }
    }

    .cloud9-box {
        position: relative;

        img {
            display: block;
            max-width: 100%;
            margin: 0 auto;
            cursor: pointer;
        }

        .play {
            display: none;
        }
    }
}

.cloud9-btn-wrap {
    position: absolute;
    top: 50%;
    z-index: 100;
    width: 100%;

    img {
        display: block;
        max-width: 100%;
        margin: 0 auto;
        cursor: pointer;
    }

    .prev {
        float: left;
    }

    .next {
        float: right;
    }
}
</style>
