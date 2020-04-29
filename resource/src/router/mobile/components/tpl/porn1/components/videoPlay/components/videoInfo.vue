<template>
  <div :class="$style['video-info-wrap']">
    <div :class="$style['intro-wrap']">
      <div :class="$style['v-line']" />
      <span> {{ $text("S_DESC", "简介") }}</span>
    </div>

    <div :class="$style['info-wrap']">
      <div :class="$style['title']">{{ videoInfo.title }}</div>
      <div :class="$style['views']">
        <img :src="$getCdnPath('/static/image/_new/discover/ic_video.png')" />
        <span> {{ videoInfo.views }}</span>
        <span> {{ videoInfo.created_at }} </span>
      </div>

      <div :class="[$style['desc'], { [$style['open']]: isOpenDesc }]">
        <span> {{ videoInfo.desc }}</span>
      </div>

      <div :class="$style['more-btn']" @click="isOpenDesc = !isOpenDesc">
        <img :class="[{ [$style['open']]: isOpenDesc }]" :src="openImgSrc" />
      </div>
    </div>
  </div>
</template>

<script>
import videoTag from './videoTag';

export default {
  components: {
    videoTag
  },
  props: {
    videoInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      active: 0,
      isOneLine: true,
      isOpenDesc: false
    };
  },
  computed: {
    openImgSrc() {
      if (this.isOpenDesc)
        return this.$getCdnPath('/static/image/_new/video/btn_arrow.png')
      else
        return this.$getCdnPath('/static/image/_new/video/btn_arrow_close.png')
    },
    tabs() {
      return [{ key: 0, name: '簡介' }];
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.intro-wrap {
  margin: 6px 10px 9px;
  font-size: 12px;

  > span:last-child {
    color: $main_text_color4;
  }
}

.v-line {
    display: inline-block;
    width: 3px;
    height: 15px;
    vertical-align: middle;
    background: -webkit-linear-gradient(top, #bd9d7d, #f9ddbd);
    background: -o-linear-gradient(bottom, #bd9d7d, #f9ddbd);
    background: -moz-linear-gradient(bottom, #bd9d7d, #f9ddbd);
    background: linear-gradient(to bottom, #bd9d7d, #f9ddbd);
}

.info-wrap {
  padding: 0 14px;
  position: relative;
  color: $main_text_color2;
  border-top: 1px solid #EEE;
  border-bottom: solid 1px #EEE;

  .title {
    color: $main_text_color4;
    font-size: 12px;
    line-height: 14px;
    width: 80%;
    margin: 8px 0;
  }

  .views {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    font-size: 10px;

    > img {
      margin-right: 3px;
      width: 13px;
      height: 13px;
    }
    > span {
      margin-right: 14px;
    }
  }

  .desc {
    display: none;
    font-size: 10px;
    line-height: 14px;
    padding-bottom: 6px;
    margin-top: -5px;

    &.open {
      display: block;
    }
  }
}

.more-btn {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 14px;
  top: 8px;

  > img {
    height: 100%;
  }
}
</style>
