<template>
  <div :class="$style['video-guess-wrap']">
    <div
      :class="[
        [$style.like],
        { [$style['custom']]: ['les', 'gay'].includes(source) }
      ]"
    >
      <img
        :src="
          $getCdnPath(
            `/static/image/_new/video/icon_like${
              ['les', 'gay'].includes(source) ? '_red' : ''
            }.png`
          )
        "
      />
      {{ $text("S_YOU_MAY_LIKE", "猜你喜欢") }}
    </div>
    <div
      v-for="video in videoList"
      :key="video.id"
      :class="[$style['video-wrap'], 'clearfix']"
      @click="onClick(video.id)"
    >
      <div :class="$style['image-wrap']">
        <img :src="img" :img-id="video.id" />
      </div>
      <div :class="$style['info-wrap']">
        <div
          :class="[
            $style['video-title'],
            { [$style['custom']]: ['smallPig'].includes(source) }
          ]"
        >
          {{ video.title }}
        </div>
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
import pornRequest from '@/api/pornRequest';
import { getEncryptImage } from '@/lib/crypto';

export default {
  components: {
    videoTag
  },
  data() {
    return {
      source: this.$route.query.source,
      videoList: [],
      img: this.$getCdnPath(`/static/image/_new/default/bg_video03_d.png`)
    };
  },
  computed: {
    siteId() {
      switch (this.source) {
        case 'yabo':
          return 1;
          break;

        case 'smallPig':
          return 2;
          break

        case 'gay':
          return 3;
          break;

        case 'les':
          return 4;
          break;

        default:
          break;
      }
    }
  },
  created() {
    const obj = {
      url: `/video/guess`,
      params: {
        siteId: this.siteId
      }
    }
    // if (this.$route.query.source === 'smallPig') { obj['smallPig'] = true }
    pornRequest(obj).then((response) => {
      if (response.status !== 200) {
        return;
      }

      this.videoList = [...response.result.data];

      setTimeout(() => {
        this.videoList.forEach(item => {
          getEncryptImage(item);
        })
      }, 300)
    });
  },
  methods: {
    getImg(info) {
      //   getEncryptImage(info).then((res) => {
      //     console.log(res)
      //   })
      //   return {
      //     src:
      //     // error: this.$getCdnPath(`/static/image/_new/default/bg_video03_d.png`),
      //     // loading: this.$getCdnPath(`/static/image/_new/default/bg_video03_d.png`)
      //   }
    },
    onClick(id) {
      let source = this.$route.query.source;
      this.$emit('leave', () => {
        window.location.href = `/mobile/videoPlay/${id}?source=${source}`;
      });
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

  &.custom {
    color: #333;
  }

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
  }
}

.video-title {
  padding-top: 1px;
  overflow: hidden;
  line-height: 14px;
  color: $main_text_color4;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.custom {
    color: #bfbfbf;
  }
}

.views {
  height: 12px;
  line-height: 12px;
  color: $main_text_color2;
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
      height: 115px;
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
