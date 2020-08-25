<template>
    <div v-if="element.case.data.length" class="tpl-wrap clearfix">
        <div class="nav-game-list">
            <div class="nav-animate-wrap">
                <element-draggable
                    v-if="element.case.data.length"
                    :element="gameItemList"
                    :on-sort="onSort"
                >
                    <transition-group :name="animateName">
                        <template v-for="(caseData, index) in gameItemList.case.data">
                            <element-wrap
                                v-if="index !== 0"
                                :key="`case-${index}-${sortIndex}`"
                                :index="countNowIndex(index)"
                                :element="element"
                                :config="config"
                                :class="navCurrentIndex === index ? 'current' : ''"
                                @click="changeGameItem(index)"
                            >
                                <template slot="element">
                                    <img :src="$getCdnPath(`${cdnDomain}${caseData.navImage[curLang]}`)" class="imgout" />
                                    <img :src="caseData.navImageHover && caseData.navImageHover[curLang] ? $getCdnPath(`${cdnDomain}${caseData.navImageHover[curLang]}`) : $getCdnPath(`${cdnDomain}${caseData.navImage[curLang]}`)" class="imgin" />
                                </template>
                            </element-wrap>
                        </template>
                    </transition-group>
                </element-draggable>
            </div>
            <button
                v-if="gameItemList.case.data.length > 9"
                class="arrow-front"
                @click="arrowMove('front')"
            >
                <img :src="$getCdnPath(`${cdnDomain}/image/element/other/jackpot02/default/arrow_r.png`)" />
            </button>
            <button
                v-if="gameItemList.case.data.length > 9"
                class="arrow-prev"
                @click="arrowMove('prev')"
            >
                <img :src="$getCdnPath(`${cdnDomain}/image/element/other/jackpot02/default/arrow_l.png`)" />
            </button>
        </div>
        <div class="game-item-wrap">
            <div
                v-for="index in itemQuantity"
                :key="`item-${index}`"
                class="game-item"
            >
                <div class="game-btn" @click="changePage(gameItemList.case.data[navCurrentIndex], index)">
                    <img :src="$getCdnPath(`${cdnDomain}${gameItemList.case.data[navCurrentIndex][`itemImage0${index}`][curLang]}`)" class="imgout" />
                    <img :src="gameItemList.case.data[navCurrentIndex][`itemImage0${index}`] && gameItemList.case.data[navCurrentIndex][`itemImageHover0${index}`][curLang] ? $getCdnPath(`${cdnDomain}${gameItemList.case.data[navCurrentIndex][`itemImageHover0${index}`][curLang]}`) : $getCdnPath(`${cdnDomain}${gameItemList.case.data[navCurrentIndex][`itemImage0${index}`][curLang]}`)" class="imgin" />
                </div>
            </div>
        </div>
        <div class="jackpot-wrap">
            <img
                v-if="element.case.data[0].jackpotImage[curLang]"
                :src="$getCdnPath(`${cdnDomain}${element.case.data[0].jackpotImage[curLang]}`)"
                class="imgout"
            />
            <animated-number
                :value="grandAmount"
                :format-value="formatToPrice"
                :duration="duration"
                class="jackpot-text"
            />
        </div>
        <div
            v-if="isBackEnd && !readOnly"
            :class="['add-case', { 'is-disable': element.case.data.length >= config.max }]"
            @click="addCase"
        >
            {{ $t('S_ADD') }}
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import animatedNumber from 'animated-number-vue';
import cloneDeep from 'lodash/cloneDeep';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';

export default {
    components: {
        animatedNumber,
        elementWrap,
        elementDraggable
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            navCurrentIndex: 1,
            sortIndex: 0,
            itemQuantity: 8,
            animateName: 'slide-right',
            duration: 0,
            grandAmount: 0
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain',
            jackpot: 'getJackpot',
            readOnly: 'getReadOnly'
        }),
        /**
         * 抓取遊戲列表排序資料
         * @method gameItemList
         * @returns {object} 遊戲列表排序
         */
        gameItemList() {
            const elementData = cloneDeep(this.element);
            const itemData = elementData.case.data.slice(1, elementData.case.data.length);
            const resultData = [elementData.case.data[0]];

            // 當數量少於8個，全顯示
            if (itemData.length < this.itemQuantity) {
                itemData.forEach((element) => {
                    resultData.push({
                        ...element
                    });
                });
                return {
                    ...elementData,
                    case: {
                        ...elementData.case,
                        data: resultData
                    }
                };
            }

            for (let index = 0; index < itemData.length; index += 1) {
                resultData.push({
                    ...itemData[(this.sortIndex + index) % itemData.length]
                });
            }

            return {
                ...elementData,
                case: {
                    ...elementData.case,
                    data: resultData
                }
            };
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
        },
        element(next, prev) {
            // 資料被刪除
            if (next.case.data.length < prev.case.data.length) {
                if (next.case.data.length <= 9) {
                    this.sortIndex = 0;
                }
                this.navCurrentIndex = 1;
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
            'actionChangePage',
            'actionCaseSave',
            'actionSetJackpot'
        ]),
        /**
         * 抓取當前索引值
         * @method countNowIndex
         * @param {number} nowIndex - 遊戲表單索引值
         * @returns {object} 回傳當前索引值
         */
        countNowIndex(nowIndex) {
            let count = 0;

            if ((nowIndex + this.sortIndex + count) % this.element.case.data.length === 0 || (nowIndex + this.sortIndex + count) > this.element.case.data.length) {
                count += 1;
            }

            return (nowIndex + this.sortIndex + count) % this.element.case.data.length;
        },
        /**
         * 顯示小遊戲項目
         * @method changeGameItem
         * @param {number} nowIndex - 遊戲表單索引值
         */
        changeGameItem(nowIndex) {
            this.navCurrentIndex = nowIndex;
        },
        /**
         * 開啟對應遊戲
         * @method changePage
         * @param {number} caseData - 當前遊戲項目資料
         * @param {number} index - 當前遊戲項目索引值
         */
        changePage(caseData, index) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({
                page: caseData[`linkTo0${index}`][this.$i18n.locale],
                type: caseData[`linkType0${index}`][this.$i18n.locale],
                config: {
                    linkItem: (caseData[`linkItem0${index}`] ? caseData[`linkItem0${index}`][this.$i18n.locale] : '')
                }
            });
        },
        /**
         * 新增一筆遊戲資料
         * @method addCase
         */
        addCase() {
            // 防止超過預設數量及判斷是否後台
            if (!this.isBackEnd || this.element.case.data.length >= this.config.max) {
                return;
            }

            const eleData = '';
            const fields = {};
            this.config.fields.common.forEach((fieldName) => {
                if (!fields[fieldName]) {
                    fields[fieldName] = {};
                }
                Object.keys(this.lang).forEach((lang) => {
                    fields[fieldName][lang] = eleData.data[1][fieldName] || '';
                });
            });

            this.actionCaseSave({
                case_id: this.element.i,
                content: [{}],
                setting: { ...this.element.case.setting },
                field: [
                    ...this.element.case.data,
                    { ...fields }
                ]
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE'),
                        type: 'error'
                    });
                }
            });
        },
        /**
         * 左右箭頭滑動
         * @method arrowMove
         * @param {number} type - 點擊類型
         */
        arrowMove(type) {
            if (type === 'front') {
                this.sortIndex = (this.sortIndex / (this.element.case.data.length - 2)) === 1 ? 0 : this.sortIndex += 1;
                this.navCurrentIndex = this.navCurrentIndex - 1 <= 0 ? this.element.case.data.length - 1 : this.navCurrentIndex - 1;
                this.animateName = 'slide-right';
                return;
            }

            this.sortIndex = this.sortIndex > 0 ? this.sortIndex -= 1 : this.element.case.data.length - 2;
            this.animateName = 'slide-left';
            this.navCurrentIndex = this.navCurrentIndex + 1 > this.element.case.data.length - 1 ? 1 : this.navCurrentIndex + 1;
        },
        /**
         * 遊戲清單拖曳功能
         * @method onSort
         * @param {array} sort - 拖曳資料
         */
        onSort(sort) {
            const caseData = [];
            let countIndex = 1;
            let lastIndex = 0;

            sort.forEach((info, index) => {
                if (index === 0) {
                    caseData.push(this.gameItemList.case.data[sort[index].sortIndex]);
                    return;
                }

                if (this.sortIndex >= index) {
                    caseData.push(this.gameItemList.case.data[sort[sort.length - (this.sortIndex - lastIndex)].sortIndex]);
                    lastIndex += 1;
                    return;
                }

                caseData.push(this.gameItemList.case.data[sort[countIndex].sortIndex]);
                countIndex += 1;
            });

            this.actionCaseSave({
                case_id: this.element.i,
                content: this.element.case.content,
                field: this.element.case.data.length ? caseData : [],
                setting: { ...this.element.case.setting }
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE'),
                        type: 'error'
                    });
                }
            });
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
@import "~@/css/variable.scss";

.tpl-wrap {
    position: relative;
    box-sizing: border-box;
    width: 992px;
    min-height: 586px;
    margin: 0 auto;
    padding-top: 104px;
    text-align: center;

    &:hover {
        .add-case {
            opacity: 1;
        }
    }

    .nav-game-list {
        position: relative;
        box-sizing: border-box;
        padding: 0 96px;

        .nav-animate-wrap {
            overflow: hidden;
            min-height: 90px;
            white-space: nowrap;
        }

        button {
            position: absolute;
            overflow: hidden;
            z-index: 1;
            width: 60px;
            height: 60px;
            top: 50%;
            margin-top: -30px;
            outline: 0;
            cursor: pointer;
            background: transparent;

            &.arrow-prev {
                left: 34px;
            }

            &.arrow-front {
                right: 34px;
            }

            img {
                position: absolute;
                max-width: 100%;
                top: 0;
                left: 0;
                cursor: pointer;
            }

            &:hover {
                img {
                    top: auto;
                    bottom: 0;
                }
            }
        }
    }

    .element {
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 12.5%;
        padding: 0 5px;

        img {
            max-width: 100%;
            margin: 0 auto;
            cursor: pointer;

            &.imgout {
                display: block;
            }
            &.imgin {
                display: none;
            }
        }

        &:hover,
        &.current {
            .imgout {
                display: none;
            }
            .imgin {
                display: block;
            }
        }
    }

    .game-item-wrap {
        float: left;
        width: 72%;
        margin-left: 31px;
        padding-top: 34px;

        .game-item {
            display: inline-block;
            vertical-align: top;
            width: 25%;
            padding: 0 6px 9px;
        }

        .game-btn {
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;

            img {
                max-width: 100%;
                margin: 0 auto;
                cursor: pointer;

                &.imgout {
                    display: block;
                }
                &.imgin {
                    display: none;
                }
            }

            &:hover {
                .imgout {
                    display: none;
                }
                .imgin {
                    display: block;
                }
            }
        }
    }

    .jackpot-wrap {
        position: relative;
        float: right;
        width: 20%;
        min-height: 307px;
        margin: 12px 34px 0 0;

        img {
            position: absolute;
            top: 0;
            left: 0;
        }

        .jackpot-text {
            position: absolute;
            width: 100%;
            line-height: 38px;
            bottom: 0;
            left: 0;
            font-size: 16px;
            color: #FFF;
        }
    }

    .add-case {
        position: absolute;
        opacity: 0;
        transition: opacity .5s;
        width: 132px;
        height: 35px;
        line-height: 35px;
        margin-left: -66px;
        bottom: 20px;
        left: 50%;
        text-align: center;
        cursor: pointer;
        background: #AFAFAF;

        &.is-disable {
            cursor: not-allowed;
        }
    }
}
</style>
