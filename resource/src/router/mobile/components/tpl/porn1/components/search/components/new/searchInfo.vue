<template>
    <div class="search-info-wrap">
        <div :class="[$style['list-wrap'], 'clearfix']">
            <div
                v-for="info in searchList"
                :key="info.id"
                :class="$style.wrap"
            >
                <div :class="$style['image-wrap']" @click="$router.push({ name: 'videoPlay', params: { id: info.id } })">
                    <img :src="info.image" />
                </div>
                <div :class="$style.title">{{ info.title }}</div>
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
    props: {
        keyWord: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isReceive: false,
            hasInfinite: false,
            searchList: [],
            current: 0,
            total: 0
        };
    },
    watch: {
        keyWord() {
            this.setSearchList();
        }
    },
    created() {
        this.setSearchList();
    },
    methods: {
        getSearchList(page) {
            return axios({
                method: 'post',
                url: `${API_PORN1_DOMAIN}/api/v1/video/searchbywords`,
                timeout: 30000,
                data: querystring.stringify({
                    keyWords: this.keyWord,
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
        setSearchList() {
            if (this.isReceive) {
                return;
            }

            this.isReceive = true;
            this.hasInfinite = false;

            this.getSearchList(1).then((response) => {
                this.isReceive = false;

                if (response.status !== 200) {
                    return;
                }

                this.searchList = [...response.data.result.data];
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

            this.getSearchList(this.current + 1).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.searchList = [...this.searchList, ...response.data.result.data];
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

.list-wrap {
    margin-top: 10px;
}

.wrap {
    float: left;
    width: 48.5%;
    margin-bottom: 10px;

    &:nth-child(2n) {
        margin-left: 3%;
    }
}

.image-wrap {
    overflow: hidden;
    position: relative;
    height: 110px;
    background-color: #161823;

    > img {
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
    padding: 0 8px;
    color: #FFF;
    font-weight: 500;
    font-size: 14px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media screen and (min-width: $pad) {
    .title {
        font-size: 16px;
    }
}
</style>
