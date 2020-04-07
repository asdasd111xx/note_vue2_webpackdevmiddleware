<template>
    <div class="jackpot-wrap">
        <img :src="$getCdnPath(`${cdnDomain}${jackpotData.jackpotImg}`)" />
        <animated-number
            :style="jackpotTextStyle"
            :value="grandAmount"
            :format-value="formatToPrice"
            :duration="duration"
            class="jackpot-text"
        />
        <div
            v-if="isBackEnd && !readOnly"
            class="btn-edit"
            @click="$emit('edit')"
        >
            {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
        </div>
        <jackpot-edit
            v-if="isBackEnd && isEdit && !readOnly"
            :element="element"
            :on-edit="onEdit"
            :close-edit="closeEdit"
            :update-field="updateField"
            :config="config"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import animatedNumber from 'animated-number-vue';
import config from '../../config';

export default {
    components: {
        jackpotEdit: () => import(/* webpackChunkName: 'jackpotEdit' */'./jackpotEdit'),
        animatedNumber
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            config,
            isEdit: false,
            duration: 0,
            grandAmount: 0
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain',
            jackpot: 'getJackpot',
            readOnly: 'getReadOnly'
        }),
        jackpotTextStyle() {
            return {
                'padding-top': `${this.jackpotData.paddingTop}px`,
                'font-size': `${this.jackpotData.fontSize}px`,
                color: this.jackpotData.fontColor
            };
        },
        jackpotData() {
            return JSON.parse(this.element.case.data[0].jackpot[this.curLang])[0];
        }
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
            this.$on('edit', this.onEdit);
            return;
        }

        if (this.jackpot.bbin.jpGrand) {
            this.cumulationAnimate();
            return;
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
                    return;
                }
                this.closeEdit();
            });
        },
        onEdit() {
            this.isEdit = true;
        },
        closeEdit() {
            this.isEdit = false;
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
        /**
         * 套件金額格式化
         * @method formatToPrice
        */
        formatToPrice(value) {
            return `${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
    }
};
</script>
<style lang="scss" scoped>
.jackpot-wrap {
    position: absolute;
    width: 214px;
    height: 198px;
    top: 0;
    left: 0;

    .theme-B & {
        right: 0;
        left: auto;
    }

    img {
        position: absolute;
        width: 100%;
    }

    .jackpot-text {
        position: relative;
        display: block;
        text-align: center;
        color: #FFF;
    }

    .btn-edit {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 120px;
        height: 35px;
        line-height: 35px;
        margin: -17px 0 0 -60px;
        border: 1px solid #FDFDFD;
        border-radius: 3px;
        background: #2F2F2F;
        color: #FFF;
        font-size: 14px;
        text-align: center;
        opacity: 0;
        transition: opacity .5s;
        cursor: pointer;
    }

    &:hover {
        .btn-edit {
            z-index: 3;
            opacity: 1;
        }
    }
}
</style>
