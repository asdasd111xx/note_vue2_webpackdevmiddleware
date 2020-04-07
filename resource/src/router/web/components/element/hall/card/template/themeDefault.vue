<template>
    <div v-if="vendorList.length !== 0" :class="cssClass(['card-wrap'])">
        <!-- 導覽列區塊 -->
        <div :class="cssClass(['game-nav-wrap'])">
            <div :class="cssClass(['current-nav-wrap'])">
                <div :class="cssClass(['current-nav-bg'])">
                    <div :class="cssClass(['title'])" @click="onCategoryClick">
                        {{ curNavName.text }}
                        &nbsp;<div :class="cssClass(['collapse-icon', `${isTopListShow ? 'is-show' : ''}`])" />
                    </div>
                    <div :class="cssClass(['search-btn-wrap', 'border-bg'])">
                        <div :class="['search-btn', cssClass(['border-bg-repeat'])]">
                            <input
                                v-model="searchText"
                                :class="cssClass(['search', `${isSearchShow ? 'is-show' : ''}`, 'is-empty'])"
                                :placeholder="$t('S_PLEASE_ENTER_GAME_NAME')"
                                type="text"
                            />
                            <div :class="cssClass(['search-icon'])" @click="onSearchClick" />
                        </div>
                    </div>
                </div>
            </div>
            <div :class="[cssClass(['nav-btn-wrap', `${isTopListShow ? 'is-show' : ''}`]), 'clearfix']">
                <div
                    v-for="nav in vendorList"
                    :key="`nav-${nav.vendor}`"
                    :class="cssClass(['nav-btn', `${curNavName.vendor === nav.vendor ? 'current' : ''}`])"
                >
                    <div :class="cssClass(['nav-text'])" @click="changeCurrent(nav)">{{ nav.text }}</div>
                </div>
            </div>
            <swiper
                ref="typeSwiper"
                :options="swiperOption"
                :class="[cssClass(['category-content']), 'game-type-list', 'clearfix']"
            >
                <swiper-slide
                    v-for="info in typeList"
                    :key="`type-${info.label}`"
                    :class="cssClass(['category-item'])"
                >
                    <span
                        :class="cssClass(['type', `${curType === info.label ? 'is-current' : ''}`])"
                        @click="onTypeClick(info.label)"
                    >
                        {{ info.name }}
                    </span>
                </swiper-slide>
            </swiper>
        </div>
        <div :class="[cssClass(['game-wrap-inner']), 'clearfix']">
            <!-- 遊戲卡片區塊 -->
            <template v-if="!listLoading">
                <game-item
                    v-for="(kyinfo, index) in kyData"
                    :key="`ky-game-item-${index}`"
                    :theme="kyElement.theme"
                    :game-info="kyinfo"
                />
            </template>
            <ele-loading v-else />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import debounce from 'lodash/debounce';
import ajax from '@/lib/ajax';
import { gameType } from '@/config/api';
import openGame from '@/lib/open_game';
import gameItem from '../../../../common/gameItem';
import getData from '../js/getData';
import eleLoading from '../../../../tpl/common/element/loading/circle';

/**
 * 開元棋牌板塊
 * @module element/hall/ky/template/themeDefault
 * @param {object} element - 板塊資料
 */
export default {
    components: {
        eleLoading,
        gameItem,
        swiper,
        swiperSlide
    },
    props: {
        element: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            swiperOption: {
                slidesPerView: 'auto' // 容器呈現內的項目數量
            },
            reqVendor: '',
            curNavName: {
                vendor: '',
                name: '',
                text: this.$text('S_ALL')
            },
            kyData: [], // 遊戲資料
            firstResult: 0, // 起始資料
            listLoading: true, // 遊戲列表是否正在載入中
            typeList: [],
            curType: 27, // 棋牌遊戲分類預設“棋牌遊戲”
            isSearchShow: false,
            isTopListShow: false
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus',
            gameData: 'getGameData'
        }),
        kyElement() {
            return {
                theme: this.element.theme !== 'B' ? this.element.theme : 'whiteBasic'
            };
        },
        /**
         * 遊戲提供廠商代號及名稱對照表
         * @method vendorList
         * @returns {object} 代號及名稱對照表
         */
        vendorList() {
            const result = [
                {
                    vendor: '',
                    text: this.$text('S_ALL'),
                    name: ''
                }
            ];

            Object.keys(this.gameData).forEach((type) => {
                if (this.gameData[type].kind === 5 && this.gameData[type].switch === 'Y') {
                    result.push({
                        vendor: this.gameData[type].vendor,
                        text: this.$t(this.gameData[type].text),
                        name: ''
                    });
                }
            });

            if (result.length > 1) {
                return result;
            }

            return [];
        },
        searchText: {
            get() {
                return this.curNavName.name;
            },
            set(value) {
                debounce(() => { this.setSearchText(value); }, 600)();
            }
        }
    },
    watch: {
        /* eslint-disable object-shorthand */
        '$route.params.subId'() {
            if (this.isBackEnd) {
                return;
            }

            this.curNavName = this.vendorList.find((data) => data.vendor === this.$route.params.subId);
            this.firstResult = 0;
            this.getGameData();
        }
    },
    created() {
        if (this.$route.params.subId) {
            this.curNavName = this.vendorList.find((data) => data.vendor === this.$route.params.subId);
        }

        // 抓取遊戲導覽清單
        this.getCardType();
        // 取得遊戲資料
        this.getGameData();

        if (this.isBackEnd) {
            return;
        }

        // 取得最愛
        if (this.loginStatus) {
            this.actionSetFavoriteGame();
        }
    },
    methods: {
        ...mapActions([
            'actionSetFavoriteGame'
        ]),
        /**
         * 抓取遊戲資料
         * @method getGameData
         */
        getGameData() {
            this.listLoading = true;

            getData(this.isBackEnd, this.curNavName.vendor, this.firstResult, this.curType, this.curNavName.name, (kyData) => {
                this.kyData = kyData;
                this.listLoading = false;
                this.firstResult = kyData.length;
            });
        },
        /**
         * 開啟遊戲
         * @method play
         * @param {string} vendor - 供應商
         * @param {string|number} kind - 大廳類別
         * @param {string|number} code - 遊戲代碼
         */
        play(vendor, kind, code) {
            if (this.isBackEnd) {
                return;
            }
            if (!this.loginStatus) {
                alert(this.$i18n.t('S_LOGIN_TIPS'));
                return;
            }
            openGame({
                vendor, kind, code, width: 1280, height: 780
            });
        },
        /**
         * 取得classModule
         * @method cssClass
         * @param {string} className - class名稱
         * @return {object} classObj - 返回有撰寫的className
         */
        cssClass(className) {
            const themeName = this[`$theme${this.element.theme}`];
            const classObj = {};

            className.forEach((classInfo) => {
                if (themeName[classInfo]) {
                    classObj[themeName[classInfo]] = true;
                    return;
                }
                classObj[classInfo] = '';
            });

            return classObj;
        },
        /**
         * 切換廠商
         * @method changeCurrent
         * @param {string} vendorInfo - 廠商資訊
         */
        changeCurrent(vendorInfo) {
            if (this.isBackEnd || vendorInfo.vendor === this.curNavName.vendor) {
                return;
            }

            this.curType = 27; // 棋牌遊戲分類預設“棋牌遊戲”
            this.curNavName = vendorInfo;
            this.firstResult = 0;
            this.isTopListShow = false;
            this.getCardType();
            this.getGameData();
        },
        /**
         * 點選遊戲分類
         * @method onTypeClick
         */
        onTypeClick(type) {
            this.curType = type;
            this.firstResult = 0;
            this.getGameData();
        },
        /**
         * 抓取遊戲導覽清單
         * @method getCardType
         */
        getCardType() {
            const defaultData = [
                {
                    label: '',
                    name: this.$text('S_ALL')
                }
            ];

            ajax({
                method: 'get',
                url: `${gameType}?kind=5&vendor=${this.curNavName.vendor}`
            }).then((response) => {
                this.typeList = defaultData.concat(response.ret);
            });
        },
        /**
         * 設定搜尋文字
         * @param {string} value - 搜尋的文字
         */
        setSearchText(value) {
            this.curNavName.name = value;
            this.firstResult = 0;
            this.getGameData();
        },
        /**
         * 點擊搜尋的放大鏡圖示，展開/收合搜尋框
         * @method onSearchClick
         */
        onSearchClick() {
            if (this.isBackEnd) {
                return;
            }

            if (this.isSearchShow) {
                this.isSearchShow = false;
                return;
            }

            this.isSearchShow = true;
        },
        /**
         * 點擊分類，展開/收合下方遊戲商及分類列表
         * @method onCategoryClick
         */
        onCategoryClick() {
            if (this.isBackEnd) {
                return;
            }

            if (this.isTopListShow) {
                this.isTopListShow = false;
                return;
            }

            this.isTopListShow = true;
        }
    }
};
</script>

<style lang="scss" src="../css/themeDefaultA.module.scss" module="$themeA"></style>
<style lang="scss" src="../css/themeDefaultB.module.scss" module="$themeB"></style>
<style lang="scss" src="../css/27.module.scss" module="$theme519"></style>
