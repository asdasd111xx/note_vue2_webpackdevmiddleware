<template>
  <div :class="$style['video-guess-wrap']">
    <div :class="$style.like">
      <img :src="$getCdnPath('/static/image/_new/video/icon_like.png')" />
      {{ $text("S_YOU_MAY_LIKE", "猜你喜欢") }}
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
        <div :class="$style['views']">
          <img :src="$getCdnPath('/static/image/_new/discover/ic_video.png')" />
          <div>{{ video.views }}</div>
        </div>
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
@import "~@/css/variable.scss";

.video-guess-wrap {
  padding: 10px 15px 34px;
  overflow-x: hidden;
}

.like {
  line-height: 20px;
  margin-bottom: 15px;
  color: $main_discover_color1;
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
  display: flex;
  flex-direction: column;
  justify-content: center;

  > div {
    height: 33%;
    display: flex;
    align-items: center;
  }
}

.video-title {
  overflow: hidden;
  line-height: 14px;
  color: $main_text_color4;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.views {
  height: 12px;
  line-height: 12px;
  color: $main_text_color4;
  font-size: 9px;
  display: flex;
  align-items: center;

  > img {
    margin-right: 3px;
    width: 13px;
    height: 13px;
  }
}

@media screen and (min-width: $pad) {
  .video-wrap {
    > div {
      height: 160px;
    }
  }

  .video-title {
    font-size: 14px;
  }

  .views {
    font-size: 12px;
  }
}
</style>
