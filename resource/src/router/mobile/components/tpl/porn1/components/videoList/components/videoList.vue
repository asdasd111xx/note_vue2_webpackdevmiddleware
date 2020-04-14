<template>
    <div :class="[$style['video-list-wrap'], 'clearfix']">
        <div
            v-for="info in videoList"
            :key="info.id"
            :class="Permutation"
            @click="$router.push({ name: 'videoPlay', params: { id: info.id } })"
        >
            <div :class="$style['image-wrap']">
                <img :src="info.image" />
            </div>
            <div :class="$style.title">{{ info.title }}</div>
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
    props: {
        sortId: {
            type: Number,
            required: true
        },
        isSingle: {
            type: Boolean,
            required: true
        }
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
        Permutation() {
            return this.isSingle ? this.$style.single : this.$style.multiple;
        }
    },
    watch: {
        sortId() {
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
                url: `${API_PORN1_DOMAIN}/api/v1/video/list`,
                timeout: 30000,
                data: querystring.stringify({
                    tagId: this.$route.query.tagId,
                    sortId: this.sortId,
                    page
                }),
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

.video-list-wrap {
    margin-top: 10px;
}

.multiple {
    composes: video-list-wrap;
    float: left;
    width: 49%;

    &:nth-child(2n) {
        margin-left: 2%;
    }

    .image-wrap {
        height: 110px;
    }
}

.single {
    composes: video-list-wrap;
    width: 100%;

    .image-wrap {
        height: 200px;
    }
}

.image-wrap {
    overflow: hidden;
    position: relative;
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

.title {
    overflow: hidden;
    height: 30px;
    line-height: 30px;
    color: #FFF;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;
}

@media screen and (min-width: $phone) {
    .title {
        font-size: 15px;
    }
}

@media screen and (min-width: $pad) {
    .title {
        font-size: 16px;
    }
}
</style>
