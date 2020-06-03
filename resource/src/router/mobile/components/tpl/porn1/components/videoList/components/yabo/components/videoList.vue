<template>
  <div :class="[$style['video-list-wrap'], 'clearfix']">
    <div
      v-for="info in videoList"
      :key="info.id"
      :class="Permutation"
      @click="$router.push({ name: 'videoPlay', params: { id: info.id } })"
    >
      <div :class="$style['image-wrap']">
        <img v-lazy="getImg(info.image)" />
      </div>
      <div :class="$style.title">{{ info.title }}</div>
      <div v-if="isSingle" :class="$style.views">
        <img :src="$getCdnPath('/static/image/_new/discover/ic_video.png')" />
        {{ info.views }}
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
import InfiniteLoading from "vue-infinite-loading";
import axios from "axios";
import pornRequest from '@/api/pornRequest';

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
    getImg(image) {
      return {
        src: image,
        error: this.$getCdnPath(`/static/image/_new/default/bg_video03_d.png`),
        loading: this.$getCdnPath(`/static/image/_new/default/bg_video03_d.png`)
      }
    },
    getVideoList(page) {
      return pornRequest({
        method: "post",
        url: `/video/list`,
        data: {
          tagId: this.$route.query.tagId,
          sortId: this.sortId,
          page: page
        },
      });
    },
    setVideoList() {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;
      this.hasInfinite = false;

      this.getVideoList(1).then(response => {
        this.isReceive = false;

        if (response.status !== 200) {
          return;
        }

        this.videoList = [...response.result.data];
        this.current = response.result.current_page;
        this.total = response.result.last_page;

        if (
          response.result.current_page >=
          response.result.last_page
        ) {
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

      this.getVideoList(this.current + 1).then(response => {
        if (response.status !== 200) {
          return;
        }

        this.videoList = [
          ...this.videoList,
          ...response.result.data
        ];
        this.current = response.result.current_page;
        this.total = response.result.last_page;
        this.isReceive = false;

        if (
          response.result.current_page >=
          response.result.last_page
        ) {
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

.video-list-wrap {
  width: 97%;
  margin: 5px auto 0;
}

.multiple {
  composes: video-list-wrap;
  position: relative;
  float: left;
  width: 49%;
  margin-left: 0.6%;

  &:nth-child(2n) {
    float: right;
    margin-right: 0.6%;
  }

  .image-wrap {
    height: 110px;
  }
}

.single {
  composes: video-list-wrap;
  width: 99%;
  position: relative;

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
  position: absolute;
  width: 100%;
  height: 20px;
  line-height: 20px;
  bottom: 0;
  font-size: 12px;
  color: $main_white_color1;
  background: #000;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.single .title {
  height: 35px;
  line-height: 35px;
  padding-right: 30%;
}

.views {
  display: flex;
  align-items: center;
  color: #bcbdc1;
  position: absolute;
  right: 10px;
  border: 0;
  bottom: 0;
  height: 35px;
  line-height: 35px;
  font-size: 13px;

  > img {
    width: 13px;
    height: 13px;
    margin-right: 2.5px;
  }
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
