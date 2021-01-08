<template>
  <div :class="$style['video-lobby-container']">
    <div :class="[$style['tag-wrap'], $style[source]]">
      <swiper ref="tag-swiper" :options="options">
        <swiper-slide
          v-for="(info, index) in videoTag"
          :key="info.id"
          :class="[
            $style['tag-item'],
            $style[source],
            { [$style.active]: info.id === +videoType.id }
          ]"
        >
          <span @click="onChangeVideoType(index)">
            {{ info.title }}
          </span>
          <div :class="$style['line']" />
        </swiper-slide>
      </swiper>

      <div
        :class="[
          $style['icon-arrow'],
          $style[source],
          { [$style.active]: isShowAllTag }
        ]"
        @click.stop="onShowAllTag(!isShowAllTag)"
      >
        <img
          v-if="source === 'yabo'"
          :src="
            $getCdnPath(
              `/static/image/_new/common/icon_more${
                isShowAllTag ? '_close' : ''
              }.png`
            )
          "
        />
        <img
          v-else
          :src="
            $getCdnPath(
              `/static/image/_new/common/icon_more${
                isShowAllTag ? '_close_w' : '_w'
              }.png`
            )
          "
        />
      </div>

      <div
        v-if="isShowAllTag"
        :class="[$style['all-tag-wrap'], $style[source], 'clearfix']"
      >
        <template v-for="(tag, index) in videoTag">
          <div :key="`all-tag-${index}`" @click="onChangeVideoType(index)">
            {{ tag.title }}
          </div>
        </template>
      </div>
    </div>

    <div :class="[$style['video-list-wrap'], 'clearfix']" id="video-list-wrap">
      <div
        :id="`${i}`"
        v-for="(videoData, i) in allVideoList"
        :key="`video-type-${i}`"
        :class="$style['video-cell']"
      >
        <div :class="[$style['video-type'], 'clearfix']">
          <div :class="[$style['type-name'], $style[source]]">
            {{ videoData.name }}
          </div>
          <div
            :class="[$style['btn-more'], $style[source]]"
            @click.stop="handleMore(i, videoData)"
          >
            更多
          </div>
        </div>

        <div :class="[$style['video-block'], $style['clearfix']]">
          <div
            v-for="video in videoData.list.slice(0, 2)"
            :key="`video-${video.id}`"
            :href="`/mobile/videoPlay/${video.id}`"
            :class="[$style['video'], $style[source]]"
            @click.stop="handleVideo(i, video)"
          >
            <img :src="defaultImg" :img-id="video.id" />
            <div>{{ video.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import find from "lodash/find";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import pornRequest from "@/api/pornRequest";
import { getEncryptImage } from "@/lib/crypto";

export default {
  components: {
    Swiper,
    SwiperSlide
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
      isShowAllTag: false,
      source: this.$route.query.source,
      videoTag: [],
      videoSort: [],
      videoRecommand: [],
      videoList: [],
      videoType: { id: 0, title: "" },
      resetTimer: null
    };
  },
  computed: {
    options() {
      return {
        slidesPerView: "auto",
        slideToClickedSlide: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
        spaceBetween: 25,
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
    },
    allVideoList() {
      const videoRecommand =
        this.videoType.id === 0 ? [...this.videoRecommand] : [];
      const videoList = this.videoSort.reduce(
        (init, sort) => {
          const data = find(this.videoList, video => video.id === sort.id);

          if (!data) {
            return init;
          }

          return [...init, { ...data }];
        },
        [...videoRecommand]
      );

      setTimeout(() => {
        videoList.forEach(item => {
          item.list.forEach(i => {
            getEncryptImage(i);
          });
        });
      }, 300);

      return videoList;
    }
  },
  created() {
    switch (this.source) {
      case "yabo":
        this.setHeaderTitle(this.$text("鸭脖视频", "鸭脖视频"));
        break;

      case "gay":
        this.setHeaderTitle("男男视频");
        break;

      case "les":
        this.setHeaderTitle("女女视频");
        break;

      default:
        break;
    }

    this.initData();
  },
  beforeDestroy() {
    clearTimeout(this.resetTimer);
    this.resetTimer = null;
  },
  methods: {
    initData() {
      this.getVideoTag();
      this.getVideoSort();
      this.getVideoRecommand();
      this.getVideoList();
    },
    handleVideo(tag, video) {
      window.location.replace(
        `${window.location.pathname}${window.location.search}#${tag}`
      );
      this.openVideo("videoPlay", {
        params: { id: video.id },
        query: { source: this.$route.query.source }
      });
    },
    handleMore(tag, videoData) {
      window.location.replace(
        `${window.location.pathname}${window.location.search}#${tag}`
      );
      this.openVideo("videoList", {
        query: {
          source: this.$route.query.source,
          tagId: +this.videoType.id || 0,
          sortId: +videoData.id || 0
        }
      });
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
    getVideoTag() {
      //   try {
      //     let videolistStorage = localStorage.getItem(`${this.source}-video-tag`);
      //     if (videolistStorage) {
      //       this.videoTag = JSON.parse(
      //         localStorage.getItem(`${this.source}-video-tag`)
      //       );
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }

      return pornRequest({
        url: "/video/tag",
        method: "get",
        params: {
          siteId: this.siteId
        }
      }).then(response => {
        if (response.status !== 200) {
          return;
        }

        // try {
        //   localStorage.setItem(
        //     `${this.source}-video-tag`,
        //     JSON.stringify([{ id: 0, title: "全部" }, ...response.result])
        //   );
        //   localStorage.setItem(
        //     `${this.source}-video-tag-timestamp`,
        //     Date.now()
        //   );
        // } catch (e) {
        //   console.log(e);
        // }

        this.videoTag = [{ id: 0, title: "全部" }, ...response.result];
      });
    },
    // 切換當前影片分類
    onChangeVideoType(index) {
      this.onShowAllTag(false);
      this.videoType = { ...this.videoTag[index] };

      this.$nextTick(() => {
        this.$refs["tag-swiper"].$swiper.slideTo(index);
      });
    },
    // 開啟影片分類選單
    onShowAllTag(value) {
      this.isShowAllTag = value;
    },
    // 取得影片排序
    getVideoSort() {
      //   try {
      //     let videolistStorage = localStorage.getItem(
      //       `${this.source}-video-sort`
      //     );
      //     if (videolistStorage) {
      //       this.videoSort = JSON.parse(
      //         localStorage.getItem(`${this.source}-video-sort`)
      //       );
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }

      return pornRequest({
        method: "get",
        url: "/video/sort",
        params: {
          siteId: this.siteId
        }
      }).then(response => {
        if (response.status !== 200) {
          return;
        }

        // try {
        //   localStorage.setItem(
        //     `${this.source}-video-sort`,
        //     JSON.stringify(response.result)
        //   );
        //   localStorage.setItem(
        //     `${this.source}-video-sort-timestamp`,
        //     Date.now()
        //   );
        // } catch (e) {
        //   console.log(e);
        // }

        this.videoSort = [...response.result];
      });
    },
    // 取得熱門推薦影片
    getVideoRecommand() {
      return pornRequest({
        url: `/video/recommand`,
        params: {
          siteId: this.siteId
        }
      }).then(response => {
        if (response.status !== 200) {
          return;
        }

        this.videoRecommand = [...response.result];
      });
    },
    // 取得所有影片(熱門推薦除外)
    getVideoList() {
      return pornRequest({
        method: "post",
        url: `/video/videolist`,
        data: {
          tag: this.videoType.title === "全部" ? "" : this.videoType.title,
          siteId: this.siteId
        }
      }).then(response => {
        if (response.status !== 200) {
          if (!this.resetTimer) {
            this.resetTimer = setTimeout(() => {
              this.initData();
              clearTimeout(this.resetTimer);
            }, 3000);
          }
          return;
        }

        this.resetTimer = null;
        this.videoList = [...response.result];
        this.$nextTick(() => {
          if (window.location.hash) {
            const hash = Number(window.location.hash.replace("#", "")) || 0;
            const wrap = document.getElementById("video-list-wrap");
            const cell = document.getElementsByClassName(
              this.$style["video-cell"]
            );
            if (wrap && cell && cell[0]) {
              wrap.scrollTop = cell[0].offsetHeight * hash;
            }
          }
        });
      });
    },
    openVideo(name, routerParam) {
      this.$router.push({ name, ...routerParam });
    }
  },
  watch: {
    videoType() {
      this.getVideoList();
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.video-lobby-container {
  padding-bottom: 20px;
}

.tag-wrap {
  width: 100%;
  max-width: $mobile_max_width;
  padding-right: 40px;
  position: fixed;
  top: 43px;
  z-index: 2;

  &.yabo {
    background: $main_white_color1;
  }

  &.gay {
    background: #3e81ac;
  }

  &.les {
    background: #cc4646;
  }
}

@media (orientation: landscape) {
  .tag-wrap {
    max-width: $mobile_max_landscape_width !important;
  }
}

.tag-item {
  width: auto;
  line-height: 44px;

  &.yabo {
    color: #bcbdc1;

    // 亞博點擊的文字color
    &.active {
      color: $main_text_color4;
    }
  }

  &.gay {
    color: #a8ceff;
  }

  &.les {
    color: #ffbbbb;
  }

  &.gay,
  &.les {
    // 男男 or 女女 點擊的文字color
    &.active {
      color: #fff;
    }
  }

  .line {
    display: none;
    position: absolute;
    width: 48px;
    height: 2px;
    left: 50%;
    bottom: 2px;
    transform: translateX(-50%);
    border-radius: 1px;
    background-color: #fff;
  }

  &.active .line {
    display: block;
  }

  &.yabo.active .line {
    background-color: #be9e7f;
  }
}

.icon-arrow {
  float: right;
  width: 30px;
  height: 100%;
  position: absolute;
  right: 20px;
  top: 0;
  transition: all 0.1s;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: -webkit-linear-gradient(left, hsla(0, 0%, 100%, 0.3), #fff);
  background: -o-linear-gradient(right, hsla(0, 0%, 100%, 0.3), #fff);
  background: -moz-linear-gradient(right, hsla(0, 0%, 100%, 0.3), #fff);
  background: linear-gradient(90deg, hsla(0, 0%, 100%, 0.3), #fff);

  &.gay,
  &.les {
    background: none;
  }

  img {
    display: block;
    width: 17px;
  }
}

.all-tag-wrap {
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  z-index: 2;
  background-color: #fff;
  max-height: calc(100vh - 150px);
  overflow-y: scroll;

  > div {
    float: left;
    width: 23%;
    height: 28px;
    line-height: 28px;
    margin: 0 1% 4px;
    border: 1px solid #d5bea4;
    border-radius: 5px;
    color: #d5bea4;
    font-size: 14px;
    text-align: center;
  }

  &.gay > div {
    border-color: #3e81ac;
    color: #3e81ac;
  }

  &.les > div {
    border-color: #d64545;
    color: #d64545;
  }
}

.video-list-wrap {
  overflow-y: auto;
  padding: 0 17px;
  background: $main_background_white1;
  padding-top: 43px;
  height: calc(100vh - 105px);
}

.video-cell {
  padding: 8px 0 1px;
}

.video-type {
  margin-bottom: 5px;
}

.type-name {
  float: left;
  height: 20px;
  line-height: 20px;
  padding-left: 20px;
  background: url("/static/image/_new/common/icon_item.png") 0 50% no-repeat;
  background-size: 15px 15px;
  color: #be9e7f;
  font-weight: 700;
  font-size: 12px;

  &.gay {
    color: #333;
  }

  &.gay,
  &.les {
    background-image: url("/static/image/_new/common/icon_item_black.png");
  }
}

.btn-more {
  float: right;
  width: 53px;
  height: 20px;
  line-height: 20px;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  &.yabo {
    background: linear-gradient(to left, #bd9d7d, #f9ddbd);
  }

  &.gay {
    background: #4a8cb8;
  }

  &.les {
    background: #d64545;
  }

  // &:hover {
  //   color: #fff;
  // }
}

.video-block {
  display: flex;
  justify-content: space-between;
}

.wrap {
  overflow: hidden;
  position: relative;
  float: left;
  width: 49%;
  margin-bottom: 3px;
  box-sizing: border-box;

  > img {
    display: block;
    width: 100%;
  }

  > div {
    overflow: hidden;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    line-height: 20px;
    background-color: #000;
    color: #fefefe;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.8;
  }
}

.video {
  composes: wrap;
  height: 117px;

  > img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    min-height: 100%;
    margin: auto;
  }

  &.yabo > div {
    background-color: #fff;
    color: #3d3d3d;
  }
}
</style>
