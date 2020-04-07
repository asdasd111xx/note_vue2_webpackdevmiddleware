<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <div
            :class="$style['container']"
            :style="getContainerStyle()"
        >
            <!-- eslint-disable vue/no-v-html -->
            <div :class="$style['text']">
                <span
                    :style="getPreTextStyle"
                    v-html="preText"
                />
                <animated-number
                    :value="grandAmount"
                    :format-value="formatToPrice"
                    :duration="duration"
                    :class="$style['animated-number']"
                    :style="getJPStyle"
                />
                <span
                    :style="getEndTextStyle"
                    v-html="endText"
                />
            </div>
            <!-- eslint-enable vue/no-v-html -->
        </div>
    </widget-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import 'vue-awesome/icons/exclamation-circle';
import animatedNumber from 'animated-number-vue';
import widgetContainer from './common/widgetContainer';

export default {
    components: {
        widgetContainer,
        animatedNumber
    },
    props: {
        currentIndex: {
            type: Number,
            required: true
        },
        widgetsInfo: {
            type: Array,
            default: () => []
        },
        updateInfo: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            duration: 0,
            grandAmount: 0,
            promptSwitch: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang',
            jackpot: 'getJackpot'
        }),
        vendor() {
            return this.widgetsInfo[this.currentIndex].vendor[this.curLang];
        },
        preText() {
            return this.widgetsInfo[this.currentIndex].preText[this.curLang];
        },
        endText() {
            return this.widgetsInfo[this.currentIndex].endText[this.curLang];
        },
        getPreTextStyle() {
            const widgetsInfo = this.widgetsInfo[this.currentIndex];
            const color = widgetsInfo.preFontColor[this.curLang];
            return {
                'font-size': `${widgetsInfo.preFontSize[this.curLang]}px`,
                color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
            };
        },
        getEndTextStyle() {
            const widgetsInfo = this.widgetsInfo[this.currentIndex];
            const color = widgetsInfo.endFontColor[this.curLang];
            return {
                'font-size': `${widgetsInfo.endFontSize[this.curLang]}px`,
                color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
            };
        },
        getJPStyle() {
            const widgetsInfo = this.widgetsInfo[this.currentIndex];
            const color = widgetsInfo.jpFontColor[this.curLang];
            return {
                'font-size': `${widgetsInfo.jpFontSize[this.curLang]}px`,
                color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
            };
        }
    },
    watch: {
        jackpot(next, prev) {
            if (this.isBackEnd) {
                return;
            }

            if (this.jackpot[this.vendor].jpGrand && prev[this.vendor].jpGrand !== next[this.vendor].jpGrand) {
                this.cumulationAnimate();
            }
        }
    },
    mounted() {
        if (this.isBackEnd) {
            return;
        }

        if (this.jackpot[this.vendor].jpGrand) {
            this.cumulationAnimate();
        }

        const allJackpotOpen = {};

        Object.keys(this.jackpot).forEach((obj) => {
            if (obj === 'bbin' || obj === 'jdb') {
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
            'actionSetJackpot'
        ]),
        getContainerStyle() {
            const { borderWidth, borderColor, rotate } = this.widgetsInfo[this.currentIndex];

            return {
                border: `${borderWidth}px solid rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`,
                transform: `rotate(${rotate}deg)`
            };
        },
        formatToPrice(value) {
            return `${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        },
        cumulationAnimate() {
            this.duration = 0;

            if (!this.grandAmount) {
                this.grandAmount = this.jackpot[this.vendor].jpGrand - 2;
            }

            if (this.grandAmount > this.jackpot[this.vendor].jpGrand) {
                this.$nextTick(() => {
                    this.grandAmount = this.jackpot[this.vendor].jpGrand;
                });
                return;
            }

            this.$nextTick(() => {
                this.duration = 60000;
                this.grandAmount = this.jackpot[this.vendor].jpGrand;
            });
        }
    }
};
</script>

<style lang="scss" module>
.container {
    height: 100%;

    &::before {
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
        content: '';
    }
}

.text {
    display: inline-block;
}

.animated-number {
    margin: 0 15px;
}

</style>
