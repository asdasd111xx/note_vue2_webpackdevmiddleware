<template>
    <div :class="$style['artist-video-wrap']">
        <div :class="$style.title">{{ $text('S_RELATED_VIDEO', '相关影集') }}</div>
        <div :class="[$style['video-list'], 'clearfix']">
            <div
                v-for="video in videoList"
                :key="video.id"
                :class="$style.wrap"
                @click="$router.push({ name: 'videoPlay', params: { id: video.id } })"
            >
                <div :class="$style['image-wrap']">
                    <img :src="video.image" />
                </div>
                <div :class="$style['video-title']">{{ video.title }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        videoList: {
            type: Array,
            required: true
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.artist-video-wrap {
    margin-top: 20px;
}

.title {
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    color: #FFF;
    font-weight: 500;
    font-size: 15px;
}

.video-list {
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
    height: 100px;
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

.video-title {
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

@media screen and (min-width: $phone) {
    .title {
        font-size: 16px;
    }

    .video-title {
        font-size: 15px;
    }
}

@media screen and (min-width: $pad) {
    .title {
        font-size: 18px;
    }

    .video-title {
        font-size: 16px;
    }
}
</style>
