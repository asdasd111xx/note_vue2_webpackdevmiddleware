<template>
    <div
        v-if="isReceive"
        ref="home-wrap"
        :style="{ height: `${wrapHeight}px` }"
        :class="[$style['home-wrap'], 'clearfix']"
    >
        <!-- 左側分類 -->
        <div :class="$style['type-wrap']">
            <swiper ref="type-swiper" :options="typeOptions">
                <swiper-slide
                    v-for="(type, index) in typeList"
                    :key="`type-${index}`"
                    :class="$style['type-swiper']"
                >
                    <img v-if="selectedIndex === index" :src="$getCdnPath(`/static/image/_new/platform/icon/icon_${type.icon}_h.png`)" />
                    <img v-else :src="$getCdnPath(`/static/image/_new/platform/icon/icon_${type.icon}_n.png`)" />
                    <div :class="[$style['type-title'], { [$style.active]:selectedIndex === index }]">{{ type.name }}</div>
                </swiper-slide>
            </swiper>
        </div>
        <!-- 右側內容 -->
        <div :class="$style['all-game-wrap']">
            <!-- 上方功能列 -->
            <div :class="$style['top-wrap']">
                <!-- 影片分類 -->
                <div v-if="isAdult && selectedIndex === 0" :class="[$style['video-tag-wrap'], 'clearfix']">
                    <div :class="$style['btn-search']" @click="$router.push({ name: 'search' })">
                        <img :src="$getCdnPath('/static/image/_new/common/icon_search.png')" />
                    </div>
                    <div :class="[$style['video-tag'], 'clearfix']">
                        <swiper ref="tag-swiper" :options="tagOptions">
                            <swiper-slide v-for="(tag, index) in videoTag" :key="`tag-${index}`">
                                <div :class="{ [$style.active]: tag.id === videoType.id }" @click="onChangeVideoType(index)">{{ tag.title }}</div>
                            </swiper-slide>
                        </swiper>
                    </div>
                    <div :class="[$style['icon-arrow'], { [$style.active]: isShowAllTag }]" @click.stop="onShowAllTag(!isShowAllTag)">
                        <img :src="$getCdnPath('/static/image/_new/common/icon_more.png')" />
                    </div>
                    <div v-if="isShowAllTag" :class="[$style['all-tag-wrap'], 'clearfix']">
                        <template v-for="(tag, index) in videoTag">
                            <div :key="`all-tag-${index}`" @click="onChangeVideoType(index)">{{ tag.title }}</div>
                        </template>
                    </div>
                </div>
                <!-- 會員中心連結 -->
                <div v-else :class="[$style['mcenter-func-wrap'], 'clearfix']">
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
            <!-- 下方影片與遊戲 -->
            <div
                ref="game-wrap"
                :class="[$style['game-list-wrap'], 'clearfix']"
                :style="{ height: `${wrapHeight - 50}px` }"
                @touchstart="onTouchStart"
                @touchmove="onTouchMove"
                @touchend="onTouchEnd"
            >
                <!-- 影片 -->
                <template v-if="currentGame.isVideo">
                    <div
                        v-for="(videoData, i) in currentGame.data"
                        :key="`video-type-${i}`"
                        :class="$style['video-list-wrap']"
                    >
                        <div :class="[$style['video-type'], 'clearfix']">
                            <div :class="$style['type-name']">{{ videoData.name }}</div>
                            <div :class="$style['btn-more']" @click="$router.push({ name: 'videoList', query: { tagId: videoType.id, sortId: videoData.id || 0 } })">更多</div>
                        </div>
                        <div :class="['video-wrap', 'clearfix']">
                            <div
                                v-for="video in videoData.list.slice(0,2)"
                                :key="`video-${video.id}`"
                                :href="`/mobile/videoPlay/${video.id}`"
                                :class="$style.video"
                                @click="$router.push({ name: 'videoPlay', params: { id: video.id } })"
                            >
                                <img :src="video.image" />
                                <div>{{ video.title }}</div>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- 遊戲 -->
                <template v-else>
                    <div
                        v-for="(game, i) in currentGame.vendors"
                        :key="`game-${i}`"
                        :class="[$style.game, { [$style['is-full']]: game.imageType > 0 }]"
                        @click="onOpenGame(game)"
                    >
                        <img :src="game.image" />
                        <span v-if="!['D', 'R'].includes(game.type) && game.name">{{ game.name }}</span>
                    </div>
                </template>
            </div>
        </div>
        <message v-if="msg" @close="msg = ''">
            <div slot="msg">{{ msg }}</div>
        </message>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import querystring from 'querystring';
import find from 'lodash/find';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import mcenter from '@/api/mcenter';
import { API_PORN1_DOMAIN } from '@/config/api';
import openGame from '@/lib/open_game';
import message from '../../common/new/message';

export default {
    components: {
        message,
        Swiper,
        SwiperSlide
    },
    data() {
        return {
            isReceive: false,
            isShowAllTag: false,
            isSliding: false,
            hasScrollBar: false,
            startTouchY: 0,
            slideDirection: '',
            slideStatus: '',
            wrapHeight: 0,
            videoTag: [],
            videoSort: [],
            videoRecommand: [],
            videoList: [],
            allGame: [],
            videoType: { id: 0, title: '' },
            selectedIndex: 0,
            currentLevel: 0,
            mcenterList: [
                { name: 'deposit', text: '充值' },
                { name: 'balanceTrans', text: '转帐' },
                { name: 'withdraw', text: '提现' },
                { name: 'accountVip', text: 'VIP' },
                { name: 'grade', text: '等级' }
            ],
            msg: ''
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            loginStatus: 'getLoginStatus',
            memInfo: 'getMemInfo'
        }),
        isAdult() {
            return this.memInfo.config.content_rating && this.memInfo.user.content_rating;
        },
        typeList() {
            const adultVideo = this.isAdult ? [{ icon: 'Tv', name: '影片' }] : [];
            return [...adultVideo, ...this.allGame.map((game) => ({ icon: game.iconName, name: game.name }))];
        },
        typeSwiper() {
            return this.$refs['type-swiper'].$swiper;
        },
        typeOptions() {
            return {
                loop: true,
                freeMode: true,
                mousewheel: true,
                slideToClickedSlide: true,
                preventInteractionOnTransition: true,
                loopAdditionalSlides: this.typeList.length,
                height: 63,
                direction: 'vertical',
                on: {
                    click: () => {
                        this.onChangeSelectInedx(this.typeSwiper.realIndex);
                    }
                }
            };
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
        allGameList() {
            const gameList = this.allGame.map((game) => ({ ...game, isVideo: false }));

            if (!this.isAdult) {
                return [...gameList];
            }

            const videoRecommand = this.videoType.id === 0 ? [...this.videoRecommand] : [];
            const videoList = this.videoSort.reduce((init, sort) => {
                const data = find(this.videoList, (video) => video.id === sort.id);

                if (!data) {
                    return init;
                }

                return [...init, { ...data }];
            }, [...videoRecommand]);

            return [{ isVideo: true, data: videoList }, ...gameList];
        },
        currentGame() {
            return { ...this.allGameList[this.selectedIndex] };
        },
        vipLevel() {
            return this.currentLevel <= 10 ? this.currentLevel : 'max';
        }
    },
    watch: {
        videoType() {
            this.getVideoList();
        }
    },
    mounted() {
        window.addEventListener('resize', this.onResize);

        const params = this.isAdult ? [this.getVideoTag(), this.getVideoSort(), this.getVideoRecommand(), this.getVideoList(), this.getAllGame()] : [this.getAllGame()];

        Promise.all(params).then(() => {
            this.isReceive = true;

            this.$nextTick(() => {
                window.dispatchEvent(new Event('resize'));
            });
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
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
    methods: {
        // 取得影片分類
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
        // 取得影片排序
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
        // 取得熱門推薦影片
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
        // 取得所有影片(熱門推薦除外)
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
        // 取得所有遊戲
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

                this.allGame = [...response.data.data.filter((game) => game.vendors.length > 0)];
            });
        },
        onResize() {
            // 計算外框高度
            this.wrapHeight = window.innerHeight - this.$refs['home-wrap'].offsetTop - 60;
        },
        onTouchStart(e) {
            if (this.isSliding) {
                return;
            }

            // 取得touch起始位置
            this.startTouchY = e.touches[0].clientY;
            // 檢查是否有scroll bar
            this.hasScrollBar = this.$refs['game-wrap'].scrollHeight > this.$refs['game-wrap'].clientHeight;
        },
        onTouchMove(e) {
            if (this.isSliding) {
                return;
            }

            // 單純點擊不做切換
            if (this.startTouchY === e.touches[0].clientY) {
                this.slideDirection = '';
                return;
            }

            // 判斷滑動方向
            this.slideDirection = this.startTouchY > e.touches[0].clientY ? 'down' : 'up';
        },
        onTouchEnd() {
            if (this.isSliding) {
                return;
            }

            if (this.slideDirection === '') {
                return;
            }

            // 無scroll bar
            if (!this.hasScrollBar) {
                if (this.slideDirection === 'up') {
                    const index = this.selectedIndex <= 0 ? this.typeList.length - 1 : this.selectedIndex - 1;
                    this.onChangeSelectInedx(index);
                    return;
                }
                const index = this.selectedIndex >= this.typeList.length - 1 ? 0 : this.selectedIndex + 1;
                this.onChangeSelectInedx(index);
                return;
            }

            // 以下為有scroll bar
            if (this.slideDirection === 'up') {
                if (this.$refs['game-wrap'].scrollTop > 0) {
                    return;
                }
                const index = this.selectedIndex <= 0 ? this.typeList.length - 1 : this.selectedIndex - 1;
                this.onChangeSelectInedx(index);
                return;
            }

            if (this.$refs['game-wrap'].scrollHeight > this.$refs['game-wrap'].scrollTop + this.$refs['game-wrap'].clientHeight) {
                return;
            }

            const index = this.selectedIndex >= this.typeList.length - 1 ? 0 : this.selectedIndex + 1;
            this.onChangeSelectInedx(index);
        },
        // 切換當前分類
        onChangeSelectInedx(index) {
            this.isSliding = true;
            this.slideDirection = '';
            this.selectedIndex = index;
            this.typeSwiper.slideToLoop(index);

            this.$nextTick(() => {
                this.isSliding = false;
            });
        },
        // 切換當前影片分類
        onChangeVideoType(index) {
            this.onShowAllTag(false);
            this.videoType = { ...this.videoTag[index] };

            this.$nextTick(() => {
                this.tagSwiper.slideTo(index);
            });
        },
        // 開啟影片分類選單
        onShowAllTag(value) {
            this.isShowAllTag = value;
        },
        // 前往會員中心
        onGoToMcenter(path) {
            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            if (path === 'grade') {
                this.$router.push('/mobile/mcenter/accountVip');
                return;
            }

            this.$router.push(`/mobile/mcenter/${path}`);
        },
        // 開啟遊戲
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

            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            if (game.type === 'L' && [3, 5, 6].includes(game.kind)) {
                const trans = { 3: 'casino', 5: 'card', 6: 'mahjong' };
                this.$router.push(`/mobile/${trans[game.kind]}/${game.vendor}`);
                return;
            }


            if (game.type === 'T') {
                this.msg = '正在上线 敬请期待';
                return;
            }

            if (['BL', 'SL'].includes(game.type)) {
                switch (game.type) {
                    case 'BL':
                        this.$router.push({ name: 'liveStream', params: { type: 'cutiesLive' } });
                        break;

                    case 'SL':
                        this.$router.push({ name: 'liveStream', params: { type: 'ballLive' } });
                        break;

                    default:
                        break;
                }
                return;
            }

            openGame({ kind: game.kind, vendor: game.vendor, code: game.code });
        }
    }
};
</script>

<style lang="scss" module>
.home-wrap {
    overflow: hidden;
    padding: 0 18px 0 13px;
}

.type-wrap {
    float: left;
    width: 63px;
}

.type-swiper {
    position: relative;
    width: 63px;

    > img {
        display: block;
        width: 100%;
    }
}

.type-title {
    position: absolute;
    top: 32px;
    right: 0;
    left: 0;
    color: #A6A9B2;
    font-size: 12px;
    text-align: center;

    &.active {
        color: #FFF;
    }
}

.all-game-wrap {
    float: right;
    width: calc(100% - 63px);
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
    width: 100%;
    transition: all 0.5s;
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
    overflow-y: auto;
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
