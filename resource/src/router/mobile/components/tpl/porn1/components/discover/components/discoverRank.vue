<template>
  <div :class="$style['discover-rank-wrap']">
    <div :class="[$style['tab-wrap'], 'clearfix']">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="[$style.tab, { [$style.active]: tab.key === active }]"
        @click="handleClick(tab)"
      >
        <span>{{ tab.name }}</span>
      </div>

      <div
        :class="$style['active-slider']"
        :style="{
          left: `calc(calc(12.5% - 25px + 25% * ${curIndex}))`
        }"
      />
    </div>
    <div :class="$style['video-wrap']">
      <div
        v-for="video in videoList"
        :key="video.id"
        :class="$style.wrap"
        @click="$router.push({ name: 'videoPlay', params: { id: video.id } })"
      >
        <div :class="$style.title">{{ video.title }}</div>
        <img v-lazy="getImg(video.image)" />
        <div :class="$style.views">
          <img :src="$getCdnPath('/static/image/_new/discover/ic_video.png')" />
          {{ video.views }}
        </div>
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
import pornRequest from '@/api/pornRequest';

export default {
  components: {
    InfiniteLoading
  },
  data() {
    return {
      isReceive: false,
      hasInfinite: false,
      curIndex: 0,
      active: 'views',
      videoList: [],
      current: 0,
      total: 0
    };
  },
  computed: {
    tabs() {
      return [
        { index: 0, key: 'views', name: this.$text('S_PLAYS', '播放数') },
        { index: 1, key: 'zans', name: this.$text('S_ZANS', '点赞数') },
        { index: 2, key: 'downloads', name: this.$text('S_DOWNLOADS', '下载数') },
        { index: 3, key: 'comments', name: this.$text('S_COMMENTS', '评论数') }
      ];
    }
  },
  watch: {
    active() {
      this.setVideoList();
    }
  },
  created() {
    this.setVideoList();
  },
  methods: {
    getImg(image) {
      return {
        src: image,
        error: this.$getCdnPath(`/static/image/_new/default/bg_video01_d.png`),
        loading: this.$getCdnPath(`/static/image/_new/default/bg_video01_d.png`)
      }
    },
    handleClick(tab) {
      this.active = tab.key;
      this.curIndex = tab.index;
    },
    getVideoList(page) {
      return pornRequest({
        method: 'post',
        url: `/video/rank`,
        data: { type: this.active, page: page },
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

        this.videoList = [...response.result.data];
        this.current = response.result.current_page;
        this.total = response.result.last_page;

        if (response.result.current_page >= response.result.last_page) {
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

        this.videoList = [...this.videoList, ...response.result.data];
        this.current = response.result.current_page;
        this.total = response.result.last_page;
        this.isReceive = false;

        if (response.result.current_page >= response.result.last_page) {
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
@import "~@/css/variable.scss";

.discover-rank-wrap {
  position: relative;
}

.tab-wrap {
  height: 43px;
  background-color: $main_white_color1;
  position: relative;
}

.active-slider {
  position: absolute;
  bottom: 1.5px;
  left: calc(12.5% - 25px);
  height: 2px;
  background-color: #be9e7f;
  width: 50px;
  transition: left 0.31s;
}
.tab {
  float: left;
  width: 25%;
  height: 43px;
  line-height: 43px;
  color: #bcbdc1;
  font-weight: 500;
  font-size: 14px;
  text-align: center;

  &.active {
    color: $main_text_color2;
  }
}

.wrap {
  position: relative;
  margin-bottom: 5px;
  height: 260px;

  > img {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: absolute;
  bottom: 0;
  font-weight: 500;
  background-color: black;
  opacity: 0.6;
  color: $main_white_color1;
  font-size: 12px;
  height: 36px;
  width: 100%;
  padding-right: 30%;
  line-height: 36px;
}

.views {
  display: flex;
  align-items: center;
  color: #bcbdc1;
  position: absolute;
  right: 10px;
  border: 0;
  bottom: 0;
  height: 36px;
  line-height: 36px;
  font-size: 13px;

  > img {
    width: 13px;
    height: 13px;
    margin-right: 2.5px;
  }
}

@media screen and (min-width: $phone) {
  .footer-item {
    > div {
      font-size: 13px;
    }
  }

  .wrap {
    height: 320px;
  }
}

@media screen and (min-width: $pad) {
  .tab,
  .views,
  .title {
    font-size: 16px;
  }

  .wrap {
    height: 480px;
  }
}
</style>
