<template>
    <div :class="$style['discover-rank-wrap']">
        <div :class="[$style['tab-wrap'], 'clearfix']">
            <div
                v-for="tab in tabs"
                :key="tab.key"
                :class="[$style.tab, { [$style.active]: tab.key === active }]"
                @click="active = tab.key"
            >
                <span>{{ tab.name }}</span>
            </div>
        </div>
        <div :class="$style['video-wrap']">
            <div
                v-for="video in videoList"
                :key="video.id"
                :class="$style.wrap"
                @click="$router.push({ name: 'videoPlay', params: { id: video.id } })"
            >
                <div :class="$style.title">{{ video.title }}</div>
                <img v-lazy="video.image" />
                <div :class="$style.views">{{ video.views }}</div>
            </div>
        </div>
        <!-- 捲動加載 -->
        <infinite-loading
            v-if="hasInfinite"
            ref="infiniteLoading"
            @infinite="infiniteHandler"
        >
            <span slot="no-more" />
            <span slot="no-results" />
        </infinite-loading>
    </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import axios from 'axios';
import querystring from 'querystring';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
    components: {
        InfiniteLoading
    },
    data() {
        return {
            isReceive: false,
            hasInfinite: false,
            active: 'views',
            videoList: [],
            current: 0,
            total: 0
        };
    },
    computed: {
        tabs() {
            return [
                { key: 'views', name: this.$text('S_PLAYS', '播放数') },
                { key: 'zans', name: this.$text('S_ZANS', '点赞数') },
                { key: 'downloads', name: this.$text('S_DOWNLOADS', '下载数') },
                { key: 'comments', name: this.$text('S_COMMENTS', '评论数') }
            ];
        }
    },
    watch: {
        active() {
            this.setVideoList();
        }
    },
    created() {
        this.setVideoList();
    },
    methods: {
        getVideoList(page) {
            return axios({
                method: 'post',
                url: `${API_PORN1_DOMAIN}/api/v1/video/rank`,
                timeout: 30000,
                data: querystring.stringify({ type: this.active, page }),
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
                    // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    // origin: 'http://127.0.0.1'
                }
            });
        },
        setVideoList() {
            if (this.isReceive) {
                return;
            }

            this.isReceive = true;
            this.hasInfinite = false;

            this.getVideoList(1).then((response) => {
                this.isReceive = false;

                if (response.status !== 200) {
                    return;
                }

                this.videoList = [...response.data.result.data];
                this.current = response.data.result.current_page;
                this.total = response.data.result.last_page;

                if (response.data.result.current_page >= response.data.result.last_page) {
                    return;
                }

                this.hasInfinite = true;
            });
        },
        infiniteHandler($state) {
            if (this.isReceive) {
                return;
            }

            this.isReceive = true;

            this.getVideoList(this.current + 1).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoList = [...this.videoList, ...response.data.result.data];
                this.current = response.data.result.current_page;
                this.total = response.data.result.last_page;
                this.isReceive = false;

                if (response.data.result.current_page >= response.data.result.last_page) {
                    $state.complete();
                    return;
                }

                $state.loaded();
            });
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.tab {
    float: left;
    width: 25%;
    height: 26px;
    line-height: 26px;
    border-radius: 13px;
    color: #BCBDC1;
    font-weight: 500;
    font-size: 14px;
    text-align: center;

    &.active {
        background-color: #161823;
        color: #FACE15;
    }
}

.wrap {
    position: relative;
    margin-bottom: 10px;

    > img {
        display: block;
        width: 100%;
    }
}

.title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: absolute;
    top: 5px;
    right: 15px;
    left: 15px;
    height: 22px;
    line-height: 22px;
    color: #FFF;
    font-weight: 500;
    font-size: 14px;
}

.views {
    height: 40px;
    line-height: 40px;
    padding: 0 10px 0 31px;
    background: url('/static/image/mobile/tpl/porn1/video/icon_play.png') 10px 50% no-repeat;
    background-size: 16px 16px;
    color: #BCBDC1;
    font-size: 14px;
}

@media screen and (min-width: $phone) {
    .footer-item {
        > div {
            font-size: 13px;
        }
    }
}

@media screen and (min-width: $pad) {
    .tab,
    .views,
    .title {
        font-size: 16px;
    }
}
</style>
