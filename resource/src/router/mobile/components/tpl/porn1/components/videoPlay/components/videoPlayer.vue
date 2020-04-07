<template>
    <div :class="$style['video-player-wrap']">
        <div :class="$style['btn-prev']" @click="$router.back()">
            <img :src="$getCdnPath('/static/image/mobile/tpl/porn1/header/btn_nav_back_h.png')" />
        </div>
        <video ref="video-player" class="video-js vjs-default-skin vjs-fluid vjs-big-play-centered" />
    </div>
</template>

<script>
import videojs from 'video.js';

export default {
    props: {
        videoInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            player: null
        };
    },
    mounted() {
        this.player = videojs(this.$refs['video-player'], {
            sources: [{ src: this.videoInfo.url, type: 'application/x-mpegURL' }],
            autoplay: false,
            controls: true,
            controlBar: true,
            loop: false,
            preload: 'auto',
            bigPlayButton: true
        });
    },
    beforeDestroy() {
        this.player.dispose();
    }
};
</script>

<style lang="scss" module>
.video-player-wrap {
    position: relative;
}

.btn-prev {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 1;
    width: 24px;
    height: 24px;

    > img {
        display: block;
        width: 100%;
    }
}
</style>
