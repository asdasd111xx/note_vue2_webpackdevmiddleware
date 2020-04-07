<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content" :class="$style['content-wrap']">
            <div :class="$style.title">{{ $route.params.key }}</div>
            <div
                v-for="video in videoList"
                :key="video.id"
                :class="[$style.video, 'clearfix']"
                @click="$router.push({ name: 'videoPlay', params: { id: video.id } })"
            >
                <div :class="$style['image-wrap']">
                    <img :src="video.image" />
                </div>
                <div :class="$style['info-wrap']">
                    <div :class="$style['video-title']">{{ video.title }}</div>
                    <div :class="$style['tag-wrap']">
                        <div v-for="(tag, index) in getTag(video.tag)" :key="`tag-${index}`">{{ tag }}</div>
                    </div>
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
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import axios from 'axios';
import querystring from 'querystring';
import mobileContainer from '../common/mobileContainer';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
    components: {
        InfiniteLoading,
        mobileContainer
    },
    data() {
        return {
            isReceive: false,
            hasInfinite: false,
            videoList: [],
            current: 0,
            total: 0
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        headerConfig() {
            return {
                prev: true,
                isBackgroundGradient: true,
                title: '篩選結果',
                onClick: () => { this.$router.back(); }
            };
        }
    },
    created() {
        if (!this.memInfo.config.content_rating || !this.memInfo.user.content_rating) {
            this.$router.push('/mobile');
            return;
        }

        this.setVideoList();
    },
    methods: {
        getTag(tag) {
            return tag.split(',');
        },
        getVideoList(page) {
            return axios({
                method: 'post',
                url: `${API_PORN1_DOMAIN}/api/v1/video/tagsearch`,
                timeout: 30000,
                data: querystring.stringify({ tags: this.$route.params.key, page }),
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
.content-wrap {
    padding: 30px 0 10px;
}

.title {
    position: fixed;
    top: 43px;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #161823;
    color: #9A9DA4;
    font-weight: 500;
    font-size: 15px;
    text-align: center;
}

.video {
    padding: 10px 15px;

    > div {
        float: left;
        height: 80px;
    }
}

.image-wrap {
    overflow: hidden;
    position: relative;
    width: 40%;
    background-color: #161823;

    > img {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        min-height: 100%;
        margin: auto;
    }
}

.info-wrap {
    width: 60%;
    padding-left: 10px;
}

.video-title {
    overflow: hidden;
    height: 24px;
    line-height: 24px;
    color: #FFF;
    font-weight: 500;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tag-wrap {
    overflow: hidden;
    margin: 10px 0;
    white-space: nowrap;

    > div {
        display: inline-block;
        height: 24px;
        line-height: 24px;
        margin-right: 8px;
        padding: 0 10px;
        border-radius: 10px;
        background-color: #242630;
        color: #FACE15;
        font-size: 12px;
    }
}

.views {
    height: 12px;
    line-height: 12px;
    padding-left: 20px;
    background: url('/static/image/mobile/tpl/porn1/video/icon_play.png') 0 50% no-repeat;
    background-size: 15px 15px;
    color: #BCBDC1;
    font-weight: 500;
    font-size: 12px;
}
</style>
