<template>
    <div
        v-if="isReceive"
        ref="home-wrap"
        :class="[$style['home-wrap'], 'clearfix']"
    >
        <div :class="$style['type-wrap']">
            <swiper ref="type-swiper" :options="typeOptions">
                <template v-for="(type, index) in typeList">
                    <swiper-slide :key="`type-${index}`" :class="[$style['type-swiper'], { 'swiper-no-swiping': !isCanSlide }]">
                        <img :src="$getCdnPath(`/static/image/_new/platform/icon/icon_${type.icon}_h.png`)" :class="$style['image-active']" />
                        <img :src="$getCdnPath(`/static/image/_new/platform/icon/icon_${type.icon}_n.png`)" :class="$style['image-normal']" />
                        <div :class="$style['type-title']">{{ type.name }}</div>
                    </swiper-slide>
                </template>
            </swiper>
        </div>
        <div v-if="isTypeSwiperCreated" :class="$style['all-game-wrap']">
            <div :class="$style['top-wrap']">
                <div :class="[$style['video-tag-wrap'], 'clearfix']">
                    <div :class="$style['btn-search']" @click="$router.push({ name: 'search' })">
                        <img :src="$getCdnPath('/static/image/_new/common/icon_search.png')" />
                    </div>
                    <div :class="[$style['video-tag'], 'clearfix']">
                        <swiper ref="tag-swiper" :options="tagOptions">
                            <swiper-slide v-for="(tag, index) in videoTag" :key="`tag-${index}`">
                                <div :class="{ [$style.active]: tag.id === videoType.id }" @click="onVideoTypeChange(index)">{{ tag.title }}</div>
                            </swiper-slide>
                        </swiper>
                    </div>
                    <div :class="[$style['icon-arrow'], { [$style.active]: isShowAllTag }]" @click.stop="onShowAllTag(!isShowAllTag)">
                        <img :src="$getCdnPath('/static/image/_new/common/icon_more.png')" />
                    </div>
                    <div v-if="isShowAllTag" :class="[$style['all-tag-wrap'], 'clearfix']">
                        <template v-for="(tag, index) in videoTag">
                            <div :key="`all-tag-${index}`" @click="onVideoTypeChange(index)">{{ tag.title }}</div>
                        </template>
                    </div>
                </div>
                <div :class="[$style['mcenter-func-wrap'], 'clearfix']">
                    <div
                        v-for="(info, index) in mcenterList"
                        :key="`mcenter-${index}`"
                        :class="$style['mcenter-wrap']"
                        @click="onGoToMcenter(info.name)"
                    >
                        <template v-if="info.name === 'grade'">
                            <img :src="$getCdnPath(`/static/image/_new/level/icon_level_${vipLevel}.png`)" />
                            <div>{{ vipLevel === 'max' ? vipLevel : info.text }}</div>
                        </template>
                        <template v-else>
                            <img :src="$getCdnPath(`/static/image/_new/wallet/icon_wallet_${info.name}.png`)" />
                            <div>{{ info.text }}</div>
                        </template>
                    </div>
                </div>
            </div>
            <div v-show="isGameSwiperCreated" :class="$style['game-list-wrap']">
                <swiper
                    ref="game-swiper"
                    :options="gameOptions"
                    :style="style"
                >
                    <template v-for="(info, index) in allGameList">
                        <swiper-slide
                            v-if="info.isVideo"
                            :key="`video-wrap-${index}`"
                        >
                            <div
                                v-for="(videoData, i) in info.data"
                                :key="`video-type-${i}`"
                                :class="$style['video-list-wrap']"
                            >
                                <div :class="[$style['video-type'], 'clearfix']">
                                    <div :class="$style['type-name']">{{ videoData.name }}</div>
                                    <a :href="`/mobile/videoList?tagId=${videoType.id}&sortId=${videoData.id || 0}`" :class="$style['btn-more']">更多</a>
                                </div>
                                <div :class="['video-wrap', 'clearfix']">
                                    <a
                                        v-for="video in videoData.list"
                                        :key="`video-${video.id}`"
                                        :href="`/mobile/videoPlay/${video.id}`"
                                        :class="$style.video"
                                    >
                                        <img :src="video.image" />
                                        <div>{{ video.title }}</div>
                                    </a>
                                </div>
                            </div>
                        </swiper-slide>
                        <swiper-slide
                            v-else
                            :key="`game-wrap-${index}`"
                            class="clearfix"
                        >
                            <div
                                v-for="(game, i) in info.vendors"
                                :key="`game-${i}`"
                                :class="[$style.game, { [$style['is-full']]: game.imageType > 0 }]"
                                @click="onOpenGame(game)"
                            >
                                <img :src="game.image" />
                                <span v-if="!['D', 'R'].includes(game.type) && game.name">{{ game.name }}</span>
                            </div>
                        </swiper-slide>
                    </template>
                </swiper>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import axios from 'axios';
import querystring from 'querystring';
import find from 'lodash/find';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import mcenter from '@/api/mcenter';
import { API_PORN1_DOMAIN } from '@/config/api';
import openGame from '@/lib/open_game';

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    data() {
        return {
            isReceive: false,
            isTypeSwiperCreated: false,
            isGameSwiperCreated: false,
            isCanSlide: false,
            isShowAllTag: false,
            wrapHeight: 0,
            videoTag: [],
            videoSort: [],
            videoRecommand: [],
            videoList: [],
            allGame: [],
            videoType: { id: 0, title: '' },
            currentLevel: 0,
            mcenterList: [
                { name: 'deposit', text: '充值' },
                { name: 'balanceTrans', text: '转帐' },
                { name: 'withdraw', text: '提现' },
                { name: 'accountVip', text: 'VIP' },
                { name: 'grade', text: '等级' }
            ]
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            loginStatus: 'getLoginStatus'
        }),
        isAllReady() {
            return this.isTypeSwiperCreated && this.isGameSwiperCreated;
        },
        style() {
            return { height: `${this.wrapHeight}px` };
        },
        typeSwiper() {
            return this.$refs['type-swiper'].$swiper;
        },
        typeOptions() {
            return {
                loop: true,
                freeMode: true,
                slideToClickedSlide: true,
                preventInteractionOnTransition: true,
                loopAdditionalSlides: this.typeList.length,
                height: 63,
                direction: 'vertical',
                on: {
                    init: () => {
                        this.onChangeTypeSwiperStatus();
                    },
                    click: () => {
                        if (!this.isCanSlide) {
                            return;
                        }

                        if (this.typeSwiper.realIndex === 0) {
                            $(`.${this.$style['mcenter-func-wrap']}`).hide();
                            $(`.${this.$style['video-tag-wrap']}`).show();
                            return;
                        }
                        $(`.${this.$style['video-tag-wrap']}`).hide();
                        $(`.${this.$style['mcenter-func-wrap']}`).show();
                    },
                    slideChange: () => {
                        if (!this.isCanSlide) {
                            return;
                        }

                        if (this.typeSwiper.realIndex === 0) {
                            $(`.${this.$style['mcenter-func-wrap']}`).hide();
                            $(`.${this.$style['video-tag-wrap']}`).show();
                            return;
                        }

                        $(`.${this.$style['video-tag-wrap']}`).hide();
                        $(`.${this.$style['mcenter-func-wrap']}`).show();
                    }
                }
            };
        },
        typeList() {
            return [{ icon: 'Tv', name: '影片' }, ...this.allGame.map((game) => ({ icon: game.iconName, name: game.name }))];
        },
        tagSwiper() {
            return this.$refs['tag-swiper'].$swiper;
        },
        tagOptions() {
            return {
                slidesPerView: 'auto',
                spaceBetween: 4,
                slideClass: this.$style.tag
            };
        },
        gameSwiper() {
            return this.$refs['game-swiper'].$swiper;
        },
        gameOptions() {
            return {
                loop: true,
                freeMode: true,
                autoHeight: true,
                preventInteractionOnTransition: true,
                slidesPerView: 'auto',
                direction: 'vertical',
                thumbs: {
                    swiper: this.typeSwiper
                },
                on: {
                    init: () => {
                        this.onChangeGameSwiperStatus();
                    }
                }
            };
        },
        allGameList() {
            const videoRecommand = this.videoType.id === 0 ? [...this.videoRecommand] : [];
            const videoList = this.videoSort.reduce((init, sort) => {
                const data = find(this.videoList, (video) => video.id === sort.id);

                if (!data) {
                    return init;
                }

                return [...init, { ...data }];
            }, [...videoRecommand]);
            const gameList = this.allGame.map((game) => ({ ...game, isVideo: false }));
            return [{ isVideo: true, data: videoList }, ...gameList];
        },
        vipLevel() {
            return this.currentLevel <= 10 ? this.currentLevel : 'max';
        }
    },
    watch: {
        isAllReady() {
            // 故意使用setTimeout等首頁輪播圖載入完畢，才能正確取得offsetTop
            setTimeout(() => {
                $(window).resize();

                this.$nextTick(() => {
                    this.typeSwiper.mousewheel.enable();
                    this.gameSwiper.mousewheel.enable();
                    this.isCanSlide = true;
                });
            }, 1000);
        },
        videoType() {
            this.getVideoList();
        }
    },
    created() {
        Promise.all([this.getVideoTag(), this.getVideoSort(), this.getVideoRecommand(), this.getVideoList(), this.getAllGame()]).then(() => {
            this.isReceive = true;
        });

        if (!this.loginStatus) {
            return;
        }

        mcenter.vipUserDetail({
            success: ({ result, ret }) => {
                if (result !== 'ok') {
                    return;
                }

                this.currentLevel = ret.find((item) => item.complex).now_level_seq;
            }
        });
    },
    mounted() {
        $(window).on('resize', this.onResize);
    },
    beforeDestroy() {
        $(window).off('resize', this.onResize);
    },
    methods: {
        getVideoTag() {
            return axios({
                method: 'get',
                url: `${API_PORN1_DOMAIN}/api/v1/video/tag`,
                timeout: 30000,
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoTag = [{ id: 0, title: '全部' }, ...response.data.result];
            });
        },
        getVideoSort() {
            return axios({
                method: 'get',
                url: `${API_PORN1_DOMAIN}/api/v1/video/sort`,
                timeout: 30000,
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoSort = [...response.data.result];
            });
        },
        getVideoRecommand() {
            return axios({
                method: 'get',
                url: `${API_PORN1_DOMAIN}/api/v1/video/recommand`,
                timeout: 30000,
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoRecommand = [...response.data.result];
            });
        },
        getVideoList() {
            return axios({
                method: 'post',
                url: `${API_PORN1_DOMAIN}/api/v1/video/videolist`,
                timeout: 30000,
                data: querystring.stringify({ tag: this.videoType.title }),
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoList = [...response.data.result];
            });
        },
        getAllGame() {
            return axios({
                method: 'get',
                url: `${this.siteConfig.YABO_API_DOMAIN}/game/list`,
                timeout: 30000,
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.allGame = [...response.data.data];
            });
        },
        onResize() {
            this.wrapHeight = window.innerHeight - this.$refs['home-wrap'].offsetTop - 60 - 50;
        },
        onChangeTypeSwiperStatus() {
            this.isTypeSwiperCreated = true;
        },
        onChangeGameSwiperStatus() {
            this.isGameSwiperCreated = true;
        },
        onVideoTypeChange(index) {
            this.onShowAllTag(false);
            this.videoType = { ...this.videoTag[index] };

            this.$nextTick(() => {
                this.tagSwiper.slideTo(index);
            });
        },
        onShowAllTag(value) {
            this.isShowAllTag = value;
        },
        onGoToMcenter(path) {
            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            if (path === 'grade') {
                return;
            }

            this.$router.push(`/mobile/mcenter/${path}`);
        },
        onOpenGame(game) {
            // Game Type
            // L => 遊戲大廳
            // G => 遊戲
            // BL => 美女直播
            // SL => 體育直播
            // D => 代理
            // T => 敬请期待
            if (game.type === 'D') {
                return;
            }

            if ([3, 5, 6].includes(game.kind) && game.code === '') {
                const trans = { 3: 'casino', 5: 'card', 6: 'mahjong' };
                this.$router.push(`/mobile/${trans[game.kind]}`);
                return;
            }

            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            if (game.type === 'T') {
                alert('正在上线 敬请期待！');
                return;
            }

            if (['BL', 'SL'].includes(game.type)) {
                this.$router.push('/mobile/liveStream');
                return;
            }

            openGame({ kind: game.kind, vendor: game.vendor, code: game.code });
        }
    }
};
</script>

<style lang="scss" module>
:global(.swiper-slide-thumb-active) {
    .image-active {
        display: block;
    }

    .image-normal {
        display: none;
    }

    .type-title {
        color: #FFF;
    }
}

.home-wrap {
    overflow: hidden;
    padding: 0 18px;
}

.type-wrap {
    overflow: hidden;
    float: left;
    width: 63px;
    height: 100%;
}

.type-swiper {
    position: relative;
    width: 63px;
    height: 63px;

    > img {
        width: 100%;
        height: 100%;
    }
}

.image-active {
    display: none;
}

.image-normal {
    display: block;
}

.type-title {
    position: absolute;
    top: 32px;
    right: 0;
    left: 0;
    color: #A6A9B2;
    font-size: 12px;
    text-align: center;
}

.all-game-wrap {
    overflow: hidden;
    float: right;
    width: calc(100% - 63px);
    height: 100%;
}

.top-wrap {
    height: 50px;
}

.video-tag-wrap {
    position: relative;
    width: 100%;
    transition: all 0.5s;
}

.btn-search {
    float: left;
    width: 20px;
    height: 22px;
    margin: 14px 9px 14px 1px;

    > img {
        display: block;
        width: 100%;
        height: 100%;
    }
}

.video-tag {
    float: left;
    width: calc(100% - 52px);
    height: 30px;
    margin: 10px 0;
}

.tag {
    width: auto;

    > div {
        width: 60px;
        height: 28px;
        line-height: 28px;
        border: 1px solid #D5BEA4;
        border-radius: 3px;
        color: #BF8646;
        font-size: 12px;
        text-align: center;

        &.active {
            height: 30px;
            line-height: 30px;
            border: none;
            background: linear-gradient(to left, #BD9D7D, #F9DDBD);
            color: #FFF;
        }
    }
}

.icon-arrow {
    float: right;
    width: 19px;
    height: 19px;
    margin-top: 16px;
    transition: all 0.1s;

    > img {
        display: block;
        width: 100%;
    }

    &.active {
        transform: rotate(180deg);
    }
}

.all-tag-wrap {
    position: absolute;
    top: 50px;
    right: 0;
    left: 0;
    z-index: 2;
    background-color: #FFF;
    opacity: 0.9;

    > div {
        float: left;
        width: 23%;
        height: 28px;
        line-height: 28px;
        margin: 0 1% 4px;
        border: 1px solid #D5BEA4;
        border-radius: 5px;
        color: #D5BEA4;
        font-size: 14px;
        text-align: center;
    }
}

.mcenter-func-wrap {
    display: none;
    width: 100%;
    transition: all 0.5s;

    &.show {
        display: block;
    }
}

.mcenter-wrap {
    float: left;
    width: 20%;

    > img {
        display: block;
        width: 33px;
        height: 33px;
        margin: 0 auto 1px;
    }

    > div {
        height: 16px;
        line-height: 16px;
        color: #AD9982;
        font-size: 12px;
        text-align: center;
    }
}

.game-list-wrap {
    height: calc(100% - 50px);
}

.video-list-wrap {
    padding: 8px 0 1px;
}

.video-type {
    margin-bottom: 5px;
}

.type-name {
    float: left;
    height: 20px;
    line-height: 20px;
    padding-left: 20px;
    background: url('/static/image/_new/common/icon_item.png') 0 50% no-repeat;
    background-size: 15px 15px;
    color: #BE9E7F;
    font-weight: 700;
    font-size: 12px;
}

.btn-more {
    float: right;
    width: 53px;
    height: 20px;
    line-height: 20px;
    border-radius: 3px;
    background: linear-gradient(to left, #BD9D7D, #F9DDBD);
    color: #FFF;
    font-size: 12px;
    text-align: center;

    &:hover {
        color: #FFF;
    }
}

.wrap {
    overflow: hidden;
    position: relative;
    float: left;
    width: 50%;
    margin-bottom: 3px;
    border-radius: 7px;
    box-sizing: border-box;

    > img {
        display: block;
        width: 100%;
        padding: 0 2px;
    }

    > span {
        position: absolute;
        top: 2px;
        left: 22px;
        color: #9CA3BF;
        font-weight: 700;
        font-size: 12px;
    }

    > div {
        overflow: hidden;
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        line-height: 20px;
        border-radius: 0 0 7px 7px;
        background-color: #FFF;
        color: #3D3D3D;
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
        opacity: 0.8;
    }
}

.video {
    composes: wrap;
    height: 117px;

    > img {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        min-height: 100%;
        margin: auto;
    }
}

.game {
    composes: wrap;

    &.is-full {
        width: 100%;
    }
}
</style>
