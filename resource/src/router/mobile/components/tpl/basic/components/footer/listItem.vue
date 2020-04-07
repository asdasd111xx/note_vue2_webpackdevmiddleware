<template>
    <div>
        <!-- vendor 標示 -->
        <div v-if="[3, 5, 6].includes(listInfo.kind)" class="vendor-name">{{ getVendorName }}</div>
        <!-- 遊戲圖片區塊 -->
        <div class="list-box-wrap">
            <!-- 行動裝置點擊圖片開啟遊戲 -->
            <div :class="`list-box kind-${listInfo.kind} clearfix`" @click="onEnter(listInfo)">
                <!-- 電子遊戲圖片 -->
                <img v-if="listInfo.kind === 3" :src="$getCdnPath(`${cdnDomain}/image/casino/${listInfo.vendor}/Game_${listInfo.code}.png`)" />
                <!-- 棋牌遊戲圖片，大廳時 code 為空 -->
                <img v-else-if="listInfo.kind === 5 && listInfo.code !== ''" :src="$getCdnPath(`${cdnDomain}/image/card/${listInfo.vendor}/Game_${listInfo.code}.png`)" />
                <!-- 麻將館 -->
                <img v-else-if="listInfo.kind === 6" :src="$getCdnPath(`${cdnDomain}/image/mahjong/${listInfo.vendor}/Game_${listInfo.code}.png`)" />
                <!-- 大廳圖片 -->
                <img v-else :src="$getCdnPath(`${cdnDomain}/image/platform/${listInfo.vendor}_${listInfo.kind}.png`)" />
            </div>
        </div>
        <!-- 遊戲標題 -->
        <div class="list-title">{{ listInfo.name }}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import openGame from '@/lib/open_game';

export default {
    props: {
        listInfo: {
            type: Object,
            default: () => []
        }
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain'
        }),
        getVendorName() {
            const vendor = this.listInfo.vendor.split('_')[0];
            const transList = {
                lg: 'xbb',
                mg2: 'mg',
                rt: 'sbg'
            };
            return (transList[vendor] || vendor).toUpperCase();
        }
    },
    methods: {
        /**
         * 點擊遊戲
         * @param {object} gameInfo - 遊戲資訊
         * @param {string} gameInfo.vendor - 遊戲供應商名稱
         * @param {number} gameInfo.kind - 遊戲分類代號
         * @param {string} gameInfo.code - 遊戲代號
        */
        onEnter({ vendor, kind, code }) {
            openGame({
                vendor,
                kind,
                code
            });
        }
    }
};
</script>

<style lang="scss" src="../../css/footer/listItem.scss" scoped></style>
