<template>
    <div class="slider-wrap">
        <!-- 彩金 -->
        <jackpot
            v-if="element.case.data.length !== 0 && element.case.data[0].jackpot"
            :element="element"
        />
        <!-- 輪播 -->
        <slider
            v-if="element.case.data.length !== 0 && element.case.data[1].slider"
            :element="element"
            :slick-options="slickOptions"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        jackpot: () => import(/* webpackChunkName: 'jackpot' */'../components/jackpot'),
        slider: () => import(/* webpackChunkName: 'lider' */'../components/slider')
    },
    props: {
        element: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            // slick預設值 (依照英文首字母排序)
            slickOptions: {
                accessibility: false, // 導航功能 (false時邊框會消失 比較正常)
                arrows: true, // 左右箭頭
                autoplay: false, // 自動播放
                autoplaySpeed: 3000, // 自動播放時間
                centerMode: false, // 居中模式
                centerPadding: '50px', // 居中模式時的 slide padding
                dots: true, // 頁籤
                draggable: true, // PC可否拖曳
                fade: false, // 是否使用fade效果
                infinite: true, // 無限循環模式
                initialSlide: 0, // 起始圖片編號
                pauseOnHover: true, // hover時是否暫停自動播放
                prevArrow: '<div class="slick-arrow slick-prev"></div>', // 上一張按鈕
                nextArrow: '<div class="slick-arrow slick-next"></div>', // 下一張按鈕
                slidesToShow: 1, // 輪播顯示數量
                slidesToScroll: 1, // 每次滾動數量
                speed: 1000, // 滾動速度
                rtl: false, // 改變滾動方向
                waitForAnimate: true, // 點擊時是否等待動畫結束
                variableWidth: false, // 禁用幻燈片寬度自動計算
                responsive: [ // 響應式設計
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: true,
                            dots: false
                        }
                    }
                ],
                zIndex: 2
            }
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        }),
        elementDnd() {
            return [...this.element.case.data];
        }
    },
    created() {
        if (this.elementDnd.length !== 0) {
            const { slickOptions } = this;
            const { setting } = this.element.case;
            const option = {
                fade: setting.effect === 'fade' || false,
                dots: setting.mode === 'dots' || false
            };
            this.slickOptions = Object.assign(slickOptions, option);
        }
        this.slickOptions.autoplay = true;
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        updateField(data) {
            this.actionCaseSave({
                case_id: this.element.i,
                content: [],
                field: [...this.element.case.data],
                setting: { ...this.element.case.setting },
                ...data
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE'),
                        type: 'error'
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.slider-wrap {
    position: relative;
    min-height: 198px;
    padding-left: 214px;

    .theme-B & {
        padding: 0 214px 0 0;
    }
}
</style>
