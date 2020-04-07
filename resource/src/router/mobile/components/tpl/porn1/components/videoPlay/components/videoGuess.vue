<template>
    <div :class="$style['video-guess-wrap']">
        <div :class="$style.like">
            <img :src="$getCdnPath('/static/image/mobile/tpl/porn1/video/heart.png')" />
            {{ $text('S_YOU_MAY_LIKE', '猜你喜欢') }}
        </div>
        <div
            v-for="video in videoList"
            :key="video.id"
            :class="[$style['video-wrap'], 'clearfix']"
            @click="onClick(video.id)"
        >
            <div :class="$style['image-wrap']">
                <img :src="video.image" />
            </div>
            <div :class="$style['info-wrap']">
                <div :class="$style['video-title']">{{ video.title }}</div>
                <video-tag :tag="video.tag" />
                <div :class="$style.viewers">{{ video.views }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import videoTag from './videoTag';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
    components: {
        videoTag
    },
    data() {
        return {
            videoList: []
        };
    },
    created() {
        axios({
            method: 'get',
            url: `${API_PORN1_DOMAIN}/api/v1/video/guess`,
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

            this.videoList = [...response.data.result.data];
        });
    },
    methods: {
        onClick(id) {
            window.location.href = `/mobile/videoPlay/${id}`;
        }
    }
};
</script>

<style lang="scss" module>
.video-guess-wrap {
    padding: 10px 15px 34px;
    overflow-x: hidden;
}

.like {
    line-height: 20px;
    margin-bottom: 15px;
    color: #FFF;
    font-weight: 500;
    position: relative;

    img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        vertical-align: middle;
    }
}

.video-wrap {
    margin-bottom: 10px;

    > div {
        float: left;
        height: 80px;
    }
}

.image-wrap {
    overflow: hidden;
    position: relative;
    width: 40%;

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

.info-wrap {
    width: 60%;
    padding-left: 10px;
}

.video-title {
    overflow: hidden;
    line-height: 24px;
    color: #FFF;
    font-weight: 500;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.viewers {
    overflow: hidden;
    height: 15px;
    line-height: 15px;
    margin-top: 10px;
    padding-left: 20px;
    background: url('/static/image/mobile/tpl/porn1/video/icon_play.png') 0 0 no-repeat;
    background-size: 15px 15px;
    color: #BCBDC1;
    font-weight: 500;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
