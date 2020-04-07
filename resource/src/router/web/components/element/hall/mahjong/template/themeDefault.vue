<template>
    <div v-if="vendorList.length !== 0" :class="cssClass(['card-wrap'])">
        <!-- 導覽列區塊 -->
        <div v-if="vendorList.length > 2" :class="cssClass(['game-nav-wrap'])">
            <div :class="cssClass(['current-nav-wrap'])">
                <div :class="cssClass(['current-nav-bg'])">
                    {{ curNavName.text }}
                </div>
            </div>
            <swiper :options="swiperOption" :class="cssClass(['nav-btn-wrap'])">
                <swiper-slide
                    v-for="nav in vendorList"
                    :key="`nav-${nav.vendor}`"
                    :class="cssClass(['nav-btn', `${curNavName.vendor === nav.vendor ? 'current' : ''}`])"
                >
                    <div :class="cssClass(['nav-text'])" @click="changeCurrent(nav)">{{ nav.text }}</div>
                </swiper-slide>
            </swiper>
        </div>
        <div :class="[cssClass(['game-wrap-inner']), 'clearfix']">
            <!-- 遊戲卡片區塊 -->
            <template v-if="!listLoading">
                <game-item
                    v-for="(mjinfo, index) in mjData"
                    :key="`mj-game-item-${index}`"
                    :theme="mjElement.theme"
                    :game-info="mjinfo"
                />
            </template>
            <ele-loading v-else />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import openGame from '@/lib/open_game';
import gameItem from '../../../../common/gameItem';
import getData from '../js/getData';
import eleLoading from '../../../../tpl/common/element/loading/circle';

/**
 * 開元棋牌板塊
 * @module element/hall/mj/template/themeDefault
 * @param {object} element - 板塊資料
 */
export default {
    components: {
        swiper,
        swiperSlide,
        eleLoading,
        gameItem
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
            curNavName: {
                vendor: '',
                text: this.$t('S_ALL')
            },
            mjData: [], // 遊戲資料
            firstResult: 0, // 起始資料
            listLoading: true // 遊戲列表是否正在載入中
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus',
            gameData: 'getGameData'
        }),
        mjElement() {
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
                    text: this.$t('S_ALL')
                }
            ];

            Object.keys(this.gameData).forEach((type) => {
                if (this.gameData[type].kind === 6 && this.gameData[type].switch === 'Y') {
                    result.push({
                        vendor: this.gameData[type].vendor,
                        text: this.$t(this.gameData[type].text)
                    });
                }
            });

            if (result.length > 1) {
                return result;
            }

            return [];
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

            getData(this.isBackEnd, this.curNavName.vendor, this.firstResult, (mjData) => {
                this.mjData = mjData;
                this.listLoading = false;
                this.firstResult = mjData.length;
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

            this.curNavName = vendorInfo;
            this.firstResult = 0;
            this.getGameData();
        }
    }
};
</script>

<style lang="scss" src="../css/themeDefaultA.module.scss" module="$themeA"></style>
<style lang="scss" src="../css/themeDefaultB.module.scss" module="$themeB"></style>
<style lang="scss" src="../css/27.module.scss" module="$theme519"></style>
