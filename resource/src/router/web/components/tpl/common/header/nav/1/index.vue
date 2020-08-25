<template>
    <div class="nav-wrap">
        <div v-if="navData.navArr" class="nav clearfix">
            <!-- 導覽列各項目 -->
            <div
                v-for="(item, index) in navData.navArr"
                :key="`nav-${item.pid}`"
                :class="['nav-' + item.pid, 'nav-item-wrap', index === navMax - 1 ? 'nav-last-item-wrap' : '']"
                @mouseover="hoverNow = index"
                @mouseleave="hoverNow = ''"
            >
                <div v-if="item.use_ico === 'Y' && item.use_ico_img !== ''" class="nav-item-icon">
                    <img :src="$getCdnPath(`${cdnDomain}${item.use_ico_img}`)" />
                </div>
                <!-- 導覽列-父層 -->
                <span
                    :title="item.name[$i18n.locale]"
                    :class="['nav-item', isCurrent(item) || hoverNow === index ? 'current' : '', item.navType]"
                    :style="{
                        color: item.flashing === 'Y' && flag ? item.flashing_color : item.content_color
                    }"
                    @click="changePage(item)"
                >
                    {{ item.name[$i18n.locale] }}
                </span>
                <!-- 導覽列-子層 -->
                <transition :name="animationType">
                    <div v-if="item.sub_page && hoverNow === index" class="nav-sub-wrap">
                        <div
                            v-for="subItem in item.sub_page"
                            :key="`nav-sub-${subItem.pid}`"
                            :title="subItem.name[$i18n.locale]"
                            :class="['nav-sub-item', isCurrent(subItem) ? 'current' : '', subItem.navType]"
                            :style="{
                                color: subItem.flashing === 'Y' && flag ? subItem.flashing_color : subItem.content_color
                            }"
                            @click="changePage(subItem)"
                        >
                            <span>{{ subItem.name[$i18n.locale] }}</span>
                            <div v-if="subItem.use_ico === 'Y' && subItem.use_ico_img !== ''" class="nav-sub-icon-wrap">
                                <img
                                    :src="$getCdnPath(`${cdnDomain}${subItem.use_ico_img}`)"
                                    class="nav-sub-item-icon"
                                />
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <!-- 導覽列 more -->
            <div
                v-if="navData.navMoreArr.length > 0"
                ref="nav-more-wrap"
                class="nav-more-wrap"
                @mouseover="moreSwitch = true"
                @mouseleave="moreSwitch = false"
            >
                <!-- more icon -->
                <span class="more-btn">
                    <icon
                        v-if="iconType"
                        :name="iconType"
                        :width="iconWidth"
                        :height="iconHeight"
                    />
                </span>
                <!-- more list -->
                <div
                    v-if="moreSwitch"
                    ref="more-list"
                    class="more-list"
                >
                    <div
                        v-for="(moreItem, index) in navData.navMoreArr"
                        :key="`nav-more-${moreItem.pid}`"
                        :title="moreItem.name[$i18n.locale]"
                        :class="['more-list-item', isCurrent(moreItem) ? 'current' : '']"
                        :style="{
                            color: moreItem.flashing === 'Y' && flag ? moreItem.flashing_color : moreItem.content_color
                        }"
                        @click="changePage(moreItem, 'switch')"
                        @mouseover="subHoverNow = index"
                        @mouseleave="subHoverNow = ''"
                    >
                        <span class="text">{{ moreItem.name[$i18n.locale] }}</span>
                        <icon
                            v-if="moreItem.sub_page"
                            :name="`caret-${moreDirection}`"
                            :style="{ [moreDirection]: '7px'}"
                            class="nav-more-caret"
                        />
                        <div v-if="moreItem.use_ico === 'Y' && moreItem.use_ico_img !== ''" class="nav-more-icon-wrap">
                            <img
                                :src="$getCdnPath(`${cdnDomain}${moreItem.use_ico_img}`)"
                                class="nav-more-item-icon"
                            />
                        </div>
                        <!-- 導覽列-子層 -->
                        <transition :name="animationType">
                            <div
                                v-if="moreItem.sub_page && subHoverNow === index"
                                :style="{ [moreDirection]: `-${moreListWidth}px` }"
                                class="nav-more-sub-wrap"
                            >
                                <div
                                    v-for="subItem in moreItem.sub_page"
                                    :key="`nav-more-sub-${subItem.pid}`"
                                    :title="subItem.name[$i18n.locale]"
                                    :class="['nav-more-sub-item', isCurrent(subItem) ? 'current' : '', subItem.navType]"
                                    :style="{
                                        color: subItem.flashing === 'Y' && flag ? subItem.flashing_color : subItem.content_color
                                    }"
                                    @click.stop="changePage(subItem, 'switch')"
                                >
                                    <span class="text">{{ subItem.name[$i18n.locale] }}</span>
                                    <div v-if="subItem.use_ico === 'Y' && subItem.use_ico_img !== ''" class="nav-more-sub-icon-wrap">
                                        <img
                                            :src="$getCdnPath(`${cdnDomain}${subItem.use_ico_img}`)"
                                            class="nav-more-sub-item-icon"
                                        />
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import keyBy from 'lodash/keyBy';
import categoryList from '@/config/gameCategory';
import navData from '@/lib/nav_data';

export default {
    props: {
        iconType: {
            type: String,
            default: null // more icon 圖示
        },
        iconWidth: {
            type: Number,
            default: null // more icon 寬度
        },
        iconHeight: {
            type: Number,
            default: null // more icon 高度
        },
        navMax: {
            type: Number,
            default: null // 導覽列,最大可顯示數量
        },
        animationType: {
            type: String,
            default: null // 下拉選單動畫樣式
        }
    },
    data() {
        return {
            gameCategory: keyBy(categoryList, 'kind'),
            navData: {}, // 導覽列資料
            hoverNow: '', // 當前滑入的父層 (子層顯示用)
            subHoverNow: '', // 更多選單當前滑入的父層
            moreSwitch: true, // more list 顯示用
            flag: false, // 文字閃爍當前顏色判斷用
            flashingTimer: null, // 文字閃爍計時器
            moreDirection: 'right', // 更多選單第二層預設向右延伸
            moreListWidth: 0 // 更多選單寬度
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            page: 'getPage',
            isBackEnd: 'getIsBackEnd',
            nowPage: 'getNowpage',
            gameData: 'getGameData'
        })
    },
    watch: {
        page() {
            this.navData = navData(this.navMax);

            if (this.navData.navMoreArr.length > 0 && !this.moreListWidth) {
                this.moreSwitch = true;
                this.$nextTick(() => {
                    this.moreListWidth = this.$refs['more-list'].offsetWidth;
                    this.moreSwitch = false;
                });
            }
        }
    },
    created() {
        this.navData = navData(this.navMax);
    },
    mounted() {
        if (this.navData.navMoreArr.length > 0) {
            this.moreListWidth = this.$refs['more-list'].offsetWidth;
        }

        this.moreSwitch = false;
        this.flashingTimer = setInterval(() => {
            this.flag = !this.flag;
        }, 500);

        /* 縮放時關閉 more (若為開) */
        window.addEventListener('resize', this.onResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
        clearInterval(this.flashingTimer);
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(pageInfo, moreSwitch = '') {
            if (!this.isBackEnd) {
                this.actionChangePage({
                    page: pageInfo.navPage,
                    type: pageInfo.navType,
                    config: {
                        linkItem: pageInfo.linkItem
                    }
                });

                if (moreSwitch) {
                    this.moreSwitch = false;
                }
            }
        },
        /* 判斷頁面是否為當前頁 */
        isCurrent(item) {
            if (this.isBackEnd) {
                return false;
            }
            // 當有子連結時 (目前均為另開)
            if (item.linkItem !== '') {
                return false;
            }
            // 判斷首頁
            if (!this.$route.params.pid && item.navPage === this.navData.navArr[0].navPage) {
                return true;
            }
            // custom
            if (item.navType === 'custom' && this.$route.params.pid === String(item.navPage)) {
                return true;
            }
            // static，無subId時
            if (item.navType === 'static' && !this.$route.params.subId && String(item.navPage) === this.$route.params.pid) {
                return true;
            }
            // static，有subId時
            if (item.navType === 'static' && typeof (this.$route.params.subId) !== 'undefined' && String(item.navPage) === this.$route.params.subId) {
                return true;
            }
            // games
            if (item.navType === 'games' && (this.gameData[item.navPage] && this.gameCategory[this.gameData[item.navPage].kind].vendor === this.$route.params.pid && this.gameData[item.navPage].vendor === this.$route.params.subId)) {
                return true;
            }

            return false;
        },
        onResize() {
            const viewWidth = document.documentElement.clientWidth;
            const moreOffsetRight = this.$refs['nav-more-wrap'].getBoundingClientRect().right + this.moreListWidth;
            this.moreDirection = viewWidth > moreOffsetRight ? 'right' : 'left';
            this.moreSwitch = false;
        }
    }
};
</script>
