<template>
    <div class="func-container">
        <div
            :class="['func-wrapper', 'video-tabs', { hide: !isVideoPage }]"
            v-show="isVideoPage"
        >
            <div class="video-search">
                <img
                    :src="
                        $getCdnPath('/static/image/_new/common/icon_search.png')
                    "
                    alt="search"
                />
            </div>
            <div class="tab-cells">
                <div
                    :class="[
                        'tab-cell',
                        { active: selectedVideoTab === item.id }
                    ]"
                    v-for="(item, index) in videoTab"
                    :key="'v-tab-' + index"
                    @click="onClickVideoTab(item.id)"
                >
                    {{ item.title }}
                </div>
            </div>
            <div class="show-all-arrow">
                <img
                    :src="
                        $getCdnPath('/static/image/_new/common/icon_more.png')
                    "
                    alt="more"
                />
            </div>
        </div>

        <div
            :class="['func-wrapper', 'wallet-tabs', { hide: isVideoPage }]"
            v-show="!isVideoPage"
        >
            <div
                class="tab-cells"
                v-for="(item, index) in walletTab"
                :key="'wallet-' + index"
            >
                <img :src="$getCdnPath(item.imgSrc)" :alt="item.name" />
                <div class="tab-cell-name">{{ item.name }}</div>
            </div>

            <div class="tab-cells">
                <img
                    :src="
                        $getCdnPath('/static/image/_new/level/icon_level_0.png')
                    "
                    alt="level"
                />
                <div class="tab-cell-name">等级</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "funcBlock",
    props: { isVideoPage: { type: Boolean, default: true } },
    data() {
        return {
            selectedVideoTab: 1,
            showVideoTabAll: false,
            videoTab: [
                { id: 1, title: "全部" },
                { id: 2, title: "无码" },
                { id: 67, title: "潮吹" },
                { id: 68, title: "轮奸" },
                { id: 70, title: "乳交" },
                { id: 75, title: "颜射" },
                { id: 78, title: "口交" },
                { id: 92, title: "后入" },
                { id: 95, title: "手淫" },
                { id: 113, title: "体液" },
                { id: 117, title: "诱惑" },
                { id: 142, title: "淫乱" },
                { id: 64, title: "深喉" },
                { id: 54, title: "痉挛" },
                { id: 5, title: "大鸡巴" },
                { id: 7, title: "凌辱" },
                { id: 14, title: "中出" },
                { id: 15, title: "短发" },
                { id: 17, title: "人妻" },
                { id: 18, title: "女搜查官" },
                { id: 30, title: "丝袜" },
                { id: 34, title: "中文字幕" },
                { id: 40, title: "女上位" },
                { id: 52, title: "剧情" },
                { id: 153, title: "少妇" }
            ],
            walletTab: [
                {
                    name: "充值",
                    imgSrc: "/static/image/_new/wallet/icon_wallet_deposit.png"
                },
                {
                    name: "转帐",
                    imgSrc: "/static/image/_new/wallet/icon_wallet_transfer.png"
                },
                {
                    name: "提现",
                    imgSrc: "/static/image/_new/wallet/icon_wallet_withdraw.png"
                },
                {
                    name: "VIP",
                    imgSrc: "/static/image/_new/wallet/icon_wallet_vip.png"
                }
            ]
        };
    },
    mounted() {},
    methods: {
        onClickVideoTab(videoTabId) {
            this.selectedVideoTab = videoTabId;
            // To do call tag api
        }
    }
};
</script>

<style lang="scss" scoped>
$border-radius: 5px;
$main-color: #d5bea4;
$main-linear-background: linear-gradient(#bd9d7d, #f9ddbd);
$icon-wallet-size: 33px;
$height: 60px;
$animation-time: 1s;

@keyframes fade-in {
    0% {
        display: flex;
        opacity: 0;
    }
    100% {
        display: flex;
        opacity: 1;
    }
}

@keyframes fade-out {
    0% {
        display: flex;
        opacity: 1;
    }
    100% {
        display: none;
        opacity: 0;
    }
}

.func-container {
    position: relative;
    width: calc(100% - 70px);
    height: $height;
    left: 70px;
}

.func-wrapper {
    animation: fade-in $animation-time;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: $height;
    font-size: 14px;
    color: $main-color;
    z-index: 10;

    &.hide {
        animation: fade-out $animation-time;
    }

    &.video-tabs .video-search {
        width: 25px;
        height: 25px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    &.video-tabs .tab-cells {
        display: inline-flex;
        justify-content: center;
        flex-direction: column;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        overflow: auto;
        overflow-y: hidden;
        margin: 0px 5px;
    }

    &.video-tabs .tab-cell {
        position: relative;
        padding: 8px 18px;
        margin: 0 2.5px;
        border: 1.25px solid $main-color;
        border-radius: $border-radius;
        font-size: 14px;
        color: $main-color;

        &.active {
            background: $main-linear-background;
            color: white;
            border-color: white;
        }
    }

    &.video-tabs .show-all-arrow {
        width: 25px;
        height: 25px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    &.wallet-tabs .tab-cells {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    &.wallet-tabs img {
        width: $icon-wallet-size;
        height: $icon-wallet-size;
    }
}
</style>
