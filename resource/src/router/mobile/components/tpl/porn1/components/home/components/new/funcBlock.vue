<template>
    <div class="func-container">
        <div
            v-show="selectedIndex === 0"
            :class="['func-wrapper', 'video-tabs', { hide: selectedIndex !== 0 }]"
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
                    :class="['tab-cell', { active: videoTab.id === 0 }]"
                    @click="$emit('update:videoTab', { id: 0, title: '' })"
                >
                    {{ $text("S_ALL", "全部") }}
                </div>
                <div
                    v-for="(tab, index) in avTabs"
                    :key="'v-tab-' + index"
                    :class="['tab-cell', { active: tab.id === videoTab.id }]"
                    @click="$emit('update:videoTab', tab)"
                >
                    {{ tab.title }}
                </div>
            </div>
            <div
                :style="rotateArrow"
                class="show-all-arrow"
                @click="onClickShowAll"
            >
                <img
                    :src="
                        $getCdnPath('/static/image/_new/common/icon_more.png')
                    "
                    alt="more"
                />
            </div>
        </div>

        <div
            v-show="selectedIndex !== 0"
            :class="['func-wrapper', 'wallet-tabs', { hide: selectedIndex === 0 }]"
        >
            <div
                v-for="(item, index) in mcenterTab"
                :key="'wallet-' + index"
                class="tab-cells"
                @click="goMcenter(item.name)"
            >
                <img
                    v-if="item.name === 'grade'"
                    :src="
                        $getCdnPath(
                            `/static/image/_new/level/icon_level_${vipLevel}.png`
                        )
                    "
                    :alt="item.name"
                />
                <img
                    v-else
                    :src="
                        $getCdnPath(
                            `/static/image/_new/wallet/icon_wallet_${item.name}.png`
                        )
                    "
                    :alt="item.name"
                />
                <div
                    v-if="item.name === 'grade' && currentLevel > 10"
                    class="tab-cell-name"
                >
                    {{ vipLevel }}
                </div>
                <div v-else class="tab-cell-name">{{ item.text }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import { API_PORN1_DOMAIN } from '@/config/api';
import mcenter from '@/api/mcenter';

export default {
    name: 'FuncBlock',
    props: {
        selectedIndex: {
            type: Number,
            required: true
        },
        videoTab: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showVideoTabAll: false,
            avTabs: [],
            mcenterTab: [
                {
                    name: 'deposit',
                    text: this.$text('S_DEPOSIT', '充值')
                },
                {
                    name: 'balanceTrans',
                    text: this.$text('S_TRANSDER', '转帐')
                },
                {
                    name: 'withdraw',
                    text: this.$text('S_WITHDRAWAL_TEXT', '提现')
                },
                {
                    name: 'accountVip',
                    text: this.$text('S_VIP', 'VIP')
                },
                {
                    name: 'grade',
                    text: this.$text('S_LEVEL', '等级')
                }
            ],
            currentLevel: 0
        };
    },
    computed: {
        rotateArrow() {
            return this.showVideoTabAll ? { transform: 'rotate(180deg)' } : {};
        },
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            onlineService: 'getOnlineService'
        }),
        vipLevel() {
            return this.currentLevel <= 10 ? this.currentLevel : 'max';
        }
    },
    created() {
        axios({
            method: 'get',
            url: `${API_PORN1_DOMAIN}/api/v1/video/tag`,
            timeout: 30000,
            headers: {
                // Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                // Version: 1
                // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                'Content-Type': 'application/x-www-form-urlencoded',
                origin: 'http://127.0.0.1'
            }
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }

            this.avTabs = [...response.data.result];
        });

        if (!this.loginStatus) {
            return;
        }

        mcenter.vipUserDetail({
            success: ({ ret }) => {
                this.currentLevel = ret.find((item) => item.complex).now_level_seq;
            }
        });
    },
    methods: {
        onClickShowAll() {
            this.showVideoTabAll = !this.showVideoTabAll;
        },
        goMcenter(path) {
            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            if (path === 'grade') {
                return;
            }

            this.$router.push(`/mobile/mcenter/${path}`);
        }
    }
};
</script>

<style lang="scss" scoped>
$border-radius: 5px;
$main-color: #d5bea4;
$main-linear-background: linear-gradient(#bd9d7d, #f9ddbd);
$icon-wallet-size: 33px;
$height: 50px;
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
