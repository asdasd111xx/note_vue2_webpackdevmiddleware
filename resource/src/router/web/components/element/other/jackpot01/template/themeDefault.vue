<template>
    <div class="tpl-wrap">
        <article-inline
            :info="{ index: 0 }"
            :value="element.case.data[0] ? element.case.data[0].title[curLang] : ''"
            :on-blur="onTitleBlur"
            class="article-inline"
        />
        <element-wrap
            v-for="(caseData, index) in element.case.data"
            :key="`case-${index}`"
            :index="index"
            :element="element"
            :config="config"
            :style="{ background: `${caseData.bgColor[curLang]} url(${$getCdnPath(cdnDomain + caseData.image[curLang])}) 0 0 no-repeat`}"
        >
            <template slot="element">
                <animated-number
                    :value="grandAmount"
                    :format-value="formatToPrice"
                    :duration="duration"
                    :style="{ color: caseData.colorFont[curLang] }"
                    class="jackpot-text"
                />
            </template>
        </element-wrap>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import animatedNumber from 'animated-number-vue';
import elementWrap from '../../../common/new/elementWrap';
import articleInline from '../../../common/articleInline';

export default {
    components: {
        animatedNumber,
        elementWrap,
        articleInline
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            duration: 0, // 動畫時間
            grandAmount: 0
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            lang: 'getLang',
            curLang: 'getCurLang',
            cdnDomain: 'getCdnDomain',
            jackpot: 'getJackpot'
        })
    },
    watch: {
        jackpot(next, prev) {
            if (this.isBackEnd) {
                return;
            }

            if (this.jackpot.bbin.jpGrand && prev.bbin.jpGrand !== next.bbin.jpGrand) {
                this.cumulationAnimate();
            }
        }
    },
    mounted() {
        if (this.isBackEnd) {
            return;
        }

        if (this.jackpot.bbin.jpGrand) {
            this.cumulationAnimate();
        }

        const allJackpotOpen = {};

        Object.keys(this.jackpot).forEach((obj) => {
            if (obj === 'bbin') {
                allJackpotOpen[obj] = {
                    ...this.jackpot[obj],
                    isShow: true
                };
                return;
            }
            allJackpotOpen[obj] = this.jackpot[obj];
        });

        this.actionSetJackpot({
            ...this.jackpot,
            ...allJackpotOpen
        });
    },
    methods: {
        ...mapActions([
            'actionCaseSave',
            'actionSetJackpot'
        ]),
        /**
         * 套件金額格式化
         * @method formatToPrice
        */
        formatToPrice(value) {
            return `${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        },
        /**
         * 累積彩金套件動畫
         * @method cumulationAnimate
        */
        cumulationAnimate() {
            // 套件動畫以 duration 控制動畫速度，因此設定初始值為0，讓金額直接到開始值後在開始跑動畫
            this.duration = 0;

            if (!this.grandAmount) {
                this.grandAmount = this.jackpot.bbin.jpGrand - 2;
            }

            if (this.grandAmount > this.jackpot.bbin.jpGrand) {
                this.$nextTick(() => {
                    this.grandAmount = this.jackpot.bbin.jpGrand;
                });
                return;
            }

            // 套件動畫速度及結束值設定
            this.$nextTick(() => {
                this.duration = 60000;
                this.grandAmount = this.jackpot.bbin.jpGrand;
            });
        },
        // 離焦時更新 title
        onTitleBlur(e, content, info) {
            this.actionCaseSave({
                case_id: this.element.i,
                content: [{}],
                setting: { ...this.element.case.setting },
                field: [...this.element.case.data.map((item, i) => {
                    if (info.index === i) {
                        return {
                            ...item,
                            title: {
                                ...item.title,
                                [this.curLang]: content
                            }
                        };
                    }
                    return item;
                })]
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
.tpl-wrap {
    width: 702px;
    margin: 0 auto;
    position: relative;
    font-weight: bolder;
    padding: 50px 0 100px;

    .element {
        position: relative;
        height: 92px;
    }

    .article-inline {
        min-height: 33px;
        margin-bottom: 25px;
    }

    .jackpot-text {
        display: block;
        line-height: 90px;
        font-size: 45px;
        text-align: center;
    }

    .theme-B & {
        padding-top: 108px;

        .article-inline {
            position: absolute;
            text-align: left;
            left: 13px;
            bottom: 123px;
            z-index: 1;
        }

        .jackpot-text {
            text-align: left;
            position: absolute;
            color: rgb(254, 89, 65);
            top: 19px;
            left: 13px;
        }
    }
}
</style>
