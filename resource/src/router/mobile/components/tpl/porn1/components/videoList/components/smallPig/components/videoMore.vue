<template>
  <div :class="$style['video-more-container']">
    <div :class="$style['box']">
      <swiper :options="{ slidesPerView: 'auto', slideClass: $style['tab'] }">
        <swiper-slide v-for="info in videoTabs" :key="info.id">
          <div
            :class="[$style['wrap'], { [$style.active]: info.id === +sortId }]"
            @click="setSortId(info.id)"
          >
            <div>{{ info.title }}</div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div
      :class="[$style['video-list-wrap'], 'clearfix']"
      :style="{ height: divHeight + 'px' }"
    >
      <div
        v-for="info in videoList"
        :key="info.id"
        :class="$style['multiple']"
        @click="
          $router.push({
            name: 'videoPlay',
            params: { id: info.id },
            query: { source: $route.query.source }
          })
        "
      >
        <div :class="$style['image-wrap']">
          <img v-lazy="getImg(info.image)" />
        </div>
        <div :class="$style['title']">{{ info.title }}</div>
      </div>

      <infinite-loading
        v-if="hasInfinite"
        ref="infiniteLoading"
        @infinite="infiniteHandler"
      >
        <span slot="no-more" />
        <span slot="no-results" />
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import axios from "axios";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import pornRequest from "@/api/pornRequest";

export default {
  components: {
    Swiper,
    SwiperSlide,
    InfiniteLoading
  },
  props: {
    setHeaderTitle: {
      type: Function,
      required: true
    },
    setHasSearchBtn: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      divHeight: null,
      isReceive: false,
      hasInfinite: false,
      videoList: [],
      current: 0,
      total: 0,
      videoTabs: [],
      sortId: +this.$route.query.sortId
    };
  },
  created() {
    this.setHeaderTitle(this.$text("S_FULL_HD_MOVIE", "全部高清影片"));
    this.setHasSearchBtn(true);
    this.getVideoTab();
    this.setVideoList();
  },
  mounted() {
    this.divHeight = document.body.offsetHeight - 137;
  },
  methods: {
    getVideoTab() {
      pornRequest({
        method: "get",
        url: `/video/sort`,
        timeout: 30000
      }).then(response => {
        if (response.status !== 200) {
          return;
        }

        this.videoTabs = [{ id: 0, title: "全部" }, ...response.result];
      });
    },
    setSortId(value) {
      this.sortId = value;
    },
    getImg(image) {
      return {
        src: image,
        error: this.$getCdnPath(`/static/image/_new/default/bg_video03_d.png`),
        loading: this.$getCdnPath(`/static/image/_new/default/bg_video03_d.png`)
      };
    },
    getVideoList(page) {
      return pornRequest({
        method: "post",
        url: `/video/list`,
        data: {
          tagId: this.$route.query.tagId,
          sortId: this.sortId,
          page: page
        }
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

      this.getVideoList(this.current + 1).then(response => {
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
  },
  watch: {
    sortId() {
      this.setVideoList();
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.video-more-container {
  overflow: hidden;
  padding-bottom: 20px;
}

.box {
  position: relative;
  background: $main_white_color1;
}

.tab {
  margin: 0 10px;
}

.wrap {
  position: relative;
  line-height: 44px;
  color: #bcbdc1;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;

  > div {
    display: inline-block;
    line-height: 27px;
    min-width: 70px;
  }

  &.active {
    color: $main_text_color4;

    > div {
      background: #333;
      color: #fff;
      border-radius: 14px;
    }
  }
}

.video-list-wrap {
  width: 97%;
  margin: 5px auto 0;
}

.multiple {
  composes: video-list-wrap;
  position: relative;
  float: left;
  width: 48%;
  margin-left: 0.6%;

  &:nth-child(2n) {
    float: right;
    margin-right: 0.6%;
  }

  .image-wrap {
    height: 100px;
    border-radius: 5px;
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
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #bfbfbf;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
