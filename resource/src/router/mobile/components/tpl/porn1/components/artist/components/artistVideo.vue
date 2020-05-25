<template>
  <div :class="$style['artist-video-wrap']">
    <div :class="$style.title">
      <span />&nbsp;
      <span> {{ $text("S_RELATED_VIDEO", "相关影集") }} </span>
    </div>
    <div :class="[$style['video-list'], 'clearfix']">
      <div
        v-for="video in videoList"
        :key="video.id"
        :class="$style.wrap"
        @click="$router.push({ name: 'videoPlay', params: { id: video.id } })"
      >
        <div :class="$style['image-wrap']">
          <img v-lazy="getImg(video.image)" />
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
  },
  methods: {
    getImg(image) {
      return {
        src: image,
        error: this.$getCdnPath(`/static/image/_new/default/bg_video03_d.png`),
        loading: this.$getCdnPath(`/static/image/_new/default/bg_video03_d.png`)
      }
    },
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.artist-video-wrap {
  margin-top: 9px;
  height: 100vh;
  background: #fefffe;
  border-radius: 10px 10px 0 0;
  box-shadow: 0pt -2pt 7px 0pt rgba(0, 0, 0, 0.1);
  padding: 0 14px;
}

.title {
  height: 32px;
  line-height: 32px;
  padding: 9px 2.5px;
  display: flex;
  align-items: center;

  > span:last-child {
    color: $main_text_color4;
    font-size: 14px;
  }
  > span:first-child {
    display: inline-block;
    width: 3px;
    height: 100%;
    background: -webkit-linear-gradient(top, #bd9d7d, #f9ddbd);
    background: -o-linear-gradient(bottom, #bd9d7d, #f9ddbd);
    background: -moz-linear-gradient(bottom, #bd9d7d, #f9ddbd);
    background: linear-gradient(to bottom, #bd9d7d, #f9ddbd);
  }
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
  height: 17px;
  line-height: 17px;
  color: #fefffe;
  font-size: 11px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: black;
}

@media screen and (min-width: $pad) {
  .title {
    font-size: 18px;
  }

  .video-title {
    font-size: 16px;
  }

  .image-wrap {
    height: 160px;
  }

  .video-title {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
  }
}
</style>
