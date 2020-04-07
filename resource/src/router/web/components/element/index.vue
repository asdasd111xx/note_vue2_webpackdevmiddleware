<template>
    <div class="main-content clearfix">
        <template v-for="(element, index) in sortArray">
            <!-- 標題純文本版塊 -->
            <article01
                v-if="element.type === 'article01' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 純文本版塊 -->
            <article02
                v-if="element.type === 'article02' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 多產品版塊 -->
            <article-img01
                v-if="element.type === 'articleImg01' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 純文本與多圖版塊 -->
            <article-img02
                v-if="element.type === 'articleImg02' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 圖文版塊 -->
            <article-img03
                v-if="element.type === 'articleImg03' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 營銷圖文板塊 -->
            <article-img04
                v-if="element.type === 'articleImg04' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 圖文連結板塊 -->
            <article-img06
                v-if="element.type === 'articleImg06' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 圖塊版塊 -->
            <image01
                v-if="element.type === 'image01' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 大圖與小圖版塊 -->
            <image02
                v-if="element.type === 'image02' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 1 + 4 圖塊版塊 -->
            <image03
                v-if="element.type === 'image03' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 1 + 1 圖塊版塊 -->
            <image04
                v-if="element.type === 'image04' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <image05
                v-if="element.type === 'image05' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 4 + 1 大小圖 -->
            <image06
                v-if="element.type === 'image06' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 輪播圖版塊 -->
            <slider01
                v-if="element.type === 'slider01' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 單產品版塊 -->
            <slider02
                v-if="element.type === 'slider02' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 輪播圖版塊（大小圖） -->
            <slider03
                v-if="element.type == 'slider03' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 彩金與輪播圖版塊 -->
            <slider04
                v-if="element.type == 'slider04' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 輪播圖版塊(新版) -->
            <slider05
                v-if="element.type === 'slider05' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 3D透視輪播圖板塊 -->
            <slider07
                v-if="element.type == 'slider07'"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 自訂連結 -->
            <links01
                v-if="element.type == 'links01' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 自訂連結 -->
            <links02
                v-if="element.type == 'links02' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <jackpot01
                v-if="element.type == 'jackpot01' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 聯絡我們 -->
            <form01
                v-if="element.type == 'form01' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 電子大廳 -->
            <casino
                v-if="element.type == 'casino'"
                :key="`element-${element.i}`"
                :element="element"
            />
            <gameList
                v-if="element.type === 'gameList' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 廳主推薦模塊 -->
            <customizedRecommandedGameList
                v-if="element.type === 'customizedRecommandedGameList'"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 開元棋牌版塊 -->
            <card
                v-if="element.type === 'card' || element.type === 'ky'"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 麻將大廳版塊 -->
            <mahjong
                v-if="element.type === 'mahjong'"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 捕魚大廳版塊 -->
            <fisharea
                v-if="element.type === 'fisharea'"
                :key="`element-${element.i}`"
                :element="element"
            />
            <!-- 彩金與自訂圖塊版塊 -->
            <jackpot02
                v-if="element.type === 'jackpot02' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 彩金與自訂圖塊版塊 -->
            <news01
                v-if="element.type === 'news01' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
                :element-index="index"
            />
            <!-- 優惠活動版塊 -->
            <promotion
                v-if="element.type === 'promotion' && element.case.data.length !== 0"
                :key="`element-${element.i}`"
                :element="element"
            />
            <widget
                v-if="element.type === 'widget'"
                :key="`widget-${element.i}`"
                :element="element"
                :element-index="index"
                :widget-edit-index.sync="widgetEditIndex"
            />
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        article01: () => import(/* webpackChunkName: 'article01' */'./article/article01'), // 標題純文本版塊
        article02: () => import(/* webpackChunkName: 'article02' */'./article/article02'), // 純文本版塊
        articleImg01: () => import(/* webpackChunkName: 'articleImg01' */'./articleImage/articleImg01'), // 多產品版塊
        articleImg02: () => import(/* webpackChunkName: 'articleImg02' */'./articleImage/articleImg02'), // 純文本與多圖版塊
        articleImg03: () => import(/* webpackChunkName: 'articleImg03' */'./articleImage/articleImg03'), // 圖文版塊
        articleImg04: () => import(/* webpackChunkName: 'articleImg04' */'./articleImage/articleImg04'), // 營銷圖文板塊
        articleImg06: () => import(/* webpackChunkName: 'articleImg06' */'./articleImage/articleImg06'), // 圖文連結板塊
        image01: () => import(/* webpackChunkName: 'image01' */'./image/image01'), // 圖塊版塊
        image02: () => import(/* webpackChunkName: 'image02' */'./image/image02'), // 大圖與小圖版塊
        image03: () => import(/* webpackChunkName: 'image03' */'./image/image03'), // 1 + 4 圖塊版塊
        image04: () => import(/* webpackChunkName: 'image04' */'./image/image04'), // 1 + 1 圖塊版塊
        image05: () => import(/* webpackChunkName: 'image05' */'./image/image05'), // 1+2大小圖
        image06: () => import(/* webpackChunkName: 'image06' */'./image/image06'), // 4+1大小圖
        slider01: () => import(/* webpackChunkName: 'slider01' */'./slider/slider01'), // 輪播圖版塊
        slider02: () => import(/* webpackChunkName: 'slider02' */'./slider/slider02'), // 單產品版塊
        slider03: () => import(/* webpackChunkName: 'slider03' */'./slider/slider03'), // 輪播圖版塊（大小圖)
        slider04: () => import(/* webpackChunkName: 'slider04' */'./slider/slider04'), // 彩金與輪播圖版塊
        slider05: () => import(/* webpackChunkName: 'slider05' */'./slider/slider05'), // 輪播圖版塊(新版)
        slider07: () => import(/* webpackChunkName: 'slider07' */'./slider/slider07'), // 3D透視輪播圖板塊
        links01: () => import(/* webpackChunkName: 'links01' */'./links/links01'), // 自訂連結
        links02: () => import(/* webpackChunkName: 'links02' */'./links/links02'), // 自訂連結與純圖版塊
        form01: () => import(/* webpackChunkName: 'form01' */'./form/form01'), // 聯絡我們
        casino: () => import(/* webpackChunkName: 'casino' */'./hall/casino'), // 電子大廳
        gameList: () => import(/* webpackChunkName: 'gameList' */'./hall/gameList'), // 自訂遊戲版塊
        customizedRecommandedGameList: () => import(/* webpackChunkName: 'customizedRecommandedGameList' */'./hall/customizedRecommandedGameList'), // 廳主推薦模塊
        card: () => import(/* webpackChunkName: 'card' */'./hall/card'), // 開元棋牌版塊
        mahjong: () => import('./hall/mahjong'), // 麻將大廳版塊
        fisharea: () => import(/* webpackChunkName: 'fisharea' */'./hall/fisharea'), // 捕魚大廳版塊
        jackpot01: () => import(/* webpackChunkName: 'jackpot01' */'./other/jackpot01'), // 超級彩金版塊
        jackpot02: () => import(/* webpackChunkName: 'jackpot02' */'./other/jackpot02'), // 彩金與自訂圖塊版塊
        news01: () => import(/* webpackChunkName: 'news01' */'./other/news01'), // 跑馬燈版塊
        promotion: () => import(/* webpackChunkName: 'promotion' */'./other/promotion'), // 優惠活動版塊
        widget: () => import(/* webpackChunkName: 'widget' */'./widget') // 小部件版塊
    },
    props: {
        sortArray: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            widgetEditIndex: ''
        };
    },
    computed: {
        ...mapGetters({
            nowpage: 'getNowpage',
            sportData: 'getSportData',
            casinoData: 'getCasinoData',
            lotteryData: 'getLotteryData',
            liveData: 'getLiveData'
        })
    }
};
</script>
