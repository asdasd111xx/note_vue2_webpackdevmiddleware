<template>
  <div :class="$style['video-more-container']">
    <div :class="$style['wrap']">
      <swiper ref="swiper" :options="options">
        <swiper-slide
          v-for="info in videoTabs"
          :key="info.id"
          :class="[
            $style['item'],
            $style[source],
            { [$style.active]: info.id === +sortId }
          ]"
        >
          <div @click="setSortId(info.id)" :disabled="isDisable">
            {{ info.title }}
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div
      :ref="'video-list-wrap'"
      id="video-list-wrap"
      :class="[$style['video-list-wrap'], 'clearfix']"
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
import { mapActions, mapGetters } from "vuex";

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
      tagId: +this.$route.query.tagId,
      source: this.$route.query.source,
      isDisable: false,
      queryTitle: this.$route.query.tag
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    options() {
      return {
        slidesPerView: "auto",
        slideToClickedSlide: false,
        centeredSlides: true,
        centeredSlidesBounds: true,
        spaceBetween: 15,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
        freeMode: true,
        observer: true,
        observeParents: true
      };
    },
    defaultImg() {
      const isYabo = this.source === "yv" || this.source === "av";
      return this.$getCdnPath(
        `/static/image/${this.themeTPL}/default/${
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

    this.getNewTab().then(() => {
      // 讓 Swiper 的 index 在初始進來時，能將 Label 置中
      let initIndex = this.videoTabs.findIndex(item => {
        return item.id === this.sortId;
      });

      swiper.slideTo(initIndex, 500, false);
    });
    this.setVideoList();
  },
  methods: {
    getNewTab() {
      return pornRequest({
        method: "post",
        url: `/video/videolist`,
        data: {
          tag: this.queryTitle === "全部" ? "" : this.queryTitle,
          siteId: this.siteId,
          page: 1
        }
      }).then(response => {
        if (response.result && response.result.length > 0) {
          let videoArray = [];
          for (let i = 0; i < Object.keys(response.result).length; i++) {
            videoArray.push({
              id: response.result[i].id,
              title: response.result[i].name
            });
          }
          if (this.$route.query.tag === "全部") {
            this.videoTabs = [
              { id: 0, title: "全部" },
              { id: 1, title: "热门推荐" },
              ...videoArray
            ];
          } else {
            this.videoTabs = [{ id: 0, title: "全部" }, ...videoArray];
          }
        } else {
          this.videoTabs = [];
        }
      });
    },
    getVideoTab() {
      return pornRequest({
        method: "get",
        url: `/video/sort`,
        smallPig: true,
        params: {
          tag: this.$route.query.tag,
          tagId: this.tagId || "",
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
      if (this.sortId === value) {
        return;
      }

      this.sortId = value;
      this.current = 0;
      this.$router.replace({
        query: {
          tag: this.$route.query.tag,
          source: this.$route.query.source,
          tagId: this.tagId,
          sortId: value
        }
      });
      this.$refs["video-list-wrap"].scrollTop = 0;
      this.isDisable = true;
      this.changeTabTimer = setTimeout(() => {
        this.isDisable = false;
        this.changeTab(250);
      }, 250);
    },
    changeTab(time) {
      const swiper = this.$refs.swiper.$swiper;

      this.getNewTab().then(() => {
        // 讓 Swiper 的 index 在初始進來時，能將 Label 置中
        let initIndex = this.videoTabs.findIndex(item => {
          return item.id === this.sortId;
        });

        swiper.slideTo(initIndex, time, false);
      });
    },
    getVideoList(page) {
      return pornRequest({
        method: "post",
        url: `/video/list`,
        smallPig: true,
        data: {
          tagId: this.tagId,
          sortId: this.sortId === 1 ? 0 : this.sortId,
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

        if (response.result.data && response.result.data.length > 0) {
          this.videoList = [...response.result.data];
        } else {
          this.videoList = [];
        }
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
  background: #fefffe;
  max-width: $mobile_max_width;
  width: 100%;
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
  overflow-y: scroll;
  height: calc(100vh - 60px);
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
  z-index: 1;
}
</style>
