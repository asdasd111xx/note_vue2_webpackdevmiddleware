<template>
  <div :class="$style['video-more-container']">
    <div :class="$style['wrap']">
      <swiper ref="swiper" :options="options">
        <swiper-slide
          v-for="info in videoTabs"
          :key="info.id"
          :class="[$style['item'], { [$style.active]: info.id === +sortId }]"
        >
          <div @click="setSortId(info.id)">{{ info.title }}</div>
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
        :class="[$style['multiple'], $style['video-cell']]"
        @click="
          $router.push({
            name: 'videoPlay',
            params: { id: info.id },
            query: { source: $route.query.source }
          })
        "
      >
        <div :class="$style['image-wrap']">
          <img :src="defaultImg" :img-id="info.id" />
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
import { getEncryptImage } from "@/lib/crypto";

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
    },
    siteId: {
      type: Number,
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
      sortId: +this.$route.query.sortId,
      tagId: +this.$route.query.tagId
    };
  },
  computed: {
    options() {
      return {
        slidesPerView: "auto",
        slideToClickedSlide: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
        spaceBetween: 15,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
        freeMode: true
      };
    },
    defaultImg() {
      const isYabo = this.source === "yabo";
      return this.$getCdnPath(
        `/static/image/porn1/default/${
          isYabo ? "bg_video03_d" : "bg_video03_1_d@3x"
        }.png`
      );
    }
  },
  created() {
    this.setHeaderTitle(this.$text("S_FULL_HD_MOVIE", "全部高清影片"));
    this.setHasSearchBtn(true);
  },
  mounted() {
    const swiper = this.$refs.swiper.$swiper;
    this.divHeight = document.body.offsetHeight - 137;

    this.getVideoTab().then(() => {
      // 讓 Swiper 的 index 在初始進來時，能將 Label 置中
      let initIndex = this.videoTabs.findIndex(item => {
        return item.id === this.sortId;
      });

      swiper.slideTo(initIndex, 500, false);
    });
    this.setVideoList();
  },
  methods: {
    getVideoTab() {
      return pornRequest({
        method: "get",
        url: `/video/sort`,
        smallPig: true,
        params: {
          tagId: !this.tagId ? "" : this.tagId,
          siteId: this.siteId
        },
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
    defaultImg() {
      const isYabo = this.source === "yabo";
      return this.$getCdnPath(
        `/static/image/porn1/default/${
          isYabo ? "bg_video03_d" : "bg_video03_1_d@3x"
        }.png`
      );
    },
    getImg(img) {
      const isYabo = this.source === "yabo";
      return {
        src: img,
        error: this.$getCdnPath(
          `/static/image/porn1/default/${
            isYabo ? "bg_video03_d" : "bg_video03_1_d@3x"
          }.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/porn1/default/${
            isYabo ? "bg_video03_d" : "bg_video03_1_d@3x"
          }.png`
        )
      };
    },
    getVideoList(page) {
      return pornRequest({
        method: "post",
        url: `/video/list`,
        smallPig: true,
        data: {
          tagId: this.tagId,
          sortId: this.sortId,
          page: page,
          siteId: this.siteId
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
        this.current += 1;

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
        this.current += 1;

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
    },
    videoList(val) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.videoList.forEach(item => {
            getEncryptImage(item);
          });
        }, 100);
      });
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

.wrap {
  background: $main_white_color1;
  max-width: $mobile_max_width;
  width: 100%;
  padding-right: 40px;
  position: fixed;
  top: 43px;
  z-index: 2;
}

@media (orientation: landscape) {
  .wrap {
    max-width: $mobile_max_landscape_width !important;
  }
}

.tab {
  margin: 0 10px;
}

.item {
  width: auto;
  min-width: 70px;
  color: #bcbdc1;
  text-align: center;
  padding: 10px 0;

  > div {
    padding: 2.5px 5px;
  }

  &.active > div {
    background: #333;
    color: #fff;
    border-radius: 15px;
  }
}

.video-list-wrap {
  padding-top: 43px;
  width: 97%;
  margin: 5px auto 0;
}

.video-cell {
  margin: 5px auto 0;
}

.multiple {
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
