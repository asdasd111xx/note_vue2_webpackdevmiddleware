<template>
    <div class="func-container">
        <div
            v-show="selectedIndex === 0"
            :class="['func-wrapper', 'video-tabs', { hide: selectedIndex !== 0 }, 'clearfix']"
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
                <swiper ref="tabs" :options="options">
                    <swiper-slide v-for="(tab, index) in avTabs" :key="tab.id">
                        <div :class="['tab-cell', { active: tab.id === videoTab.id }]" @click="onClick(index)">{{ tab.title }}</div>
                    </swiper-slide>
                </swiper>
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
            <div v-if="showVideoTabAll" :class="['category-wrap', 'clearfix']">
                <template v-for="(tab, index) in avTabs">
                    <div :key="`category-${tab.id}`" @click="onClick(index)">{{ tab.title }}</div>
                </template>
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
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import axios from 'axios';
import { API_PORN1_DOMAIN } from '@/config/api';
import mcenter from '@/api/mcenter';

export default {
    name: 'FuncBlock',
    components: {
        Swiper,
        SwiperSlide
    },
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
        swiper() {
            return this.$refs.tabs.$swiper;
        },
        options() {
            return {
                slidesPerView: 'auto',
                spaceBetween: 4
            };
        },
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
                Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                Version: 1
                // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // origin: 'http://127.0.0.1'
            }
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }

            this.avTabs = [{ id: 0, title: this.$text('S_ALL', '全部') }, ...response.data.result];
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
        onClick(index) {
            this.showVideoTabAll = false;
            this.swiper.slideTo(index);

            setTimeout(() => {
                this.$emit('update:videoTab', this.avTabs[index]);
            }, 300);
        },
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

.swiper-slide {
    width: auto;
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
        float: left;
        width: 25px;
        height: 25px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    &.video-tabs .tab-cells {
        float: left;
        width: calc(100% - 25px - 19px - 10px);
        margin: 0px 5px;
    }

    &.video-tabs .tab-cell {
        position: relative;
        width: 60px;
        height: 28px;
        line-height: 28px;
        border: 1px solid $main-color;
        border-radius: $border-radius;
        font-size: 14px;
        color: $main-color;
        text-align: center;

        &.active {
            height: 30px;
            line-height: 30px;
            border: none;
            background: $main-linear-background;
            color: white;
        }
    }

    &.video-tabs .show-all-arrow {
        float: right;
        width: 19px;
        height: 19px;

        img {
            display: block;
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

.category-wrap {
    position: absolute;
    top: 50px;
    right: 0;
    left: 0;
    background-color: #FFF;
    opacity: 0.9;

    > div {
        float: left;
        width: 23%;
        height: 28px;
        line-height: 28px;
        margin: 0 1% 4px;
        border: 1px solid $main-color;
        border-radius: $border-radius;
        color: $main-color;
        font-size: 14px;
        text-align: center;
    }
}
</style>
