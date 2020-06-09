<template>
  <div :class="$style['video-lobby-container']">
    <div :class="[$style['tag-box'], $style[source]]">
      <swiper
        ref="tag-swiper"
        :options="{ slidesPerView: 'auto', slideClass: $style['tag-tab'] }"
      >
        <swiper-slide v-for="(info, index) in videoTag" :key="info.id">
          <div
            :class="[
              $style['tag-wrap'],
              $style[source],
              { [$style.active]: info.id === +videoType.id }
            ]"
            @click="onChangeVideoType(index)"
          >
            <span>{{ info.title }}</span>
            <div :class="$style['line']" />
          </div>
        </swiper-slide>
      </swiper>

      <div
        v-if="source === 'yabo'"
        :class="[$style['icon-arrow'], { [$style.active]: isShowAllTag }]"
        @click.stop="onShowAllTag(!isShowAllTag)"
      >
        <img
          :src="
            $getCdnPath(
              `/static/image/_new/common/icon_more${
                isShowAllTag ? '_close' : ''
              }.png`
            )
          "
        />
      </div>

      <div v-if="isShowAllTag" :class="[$style['all-tag-wrap'], 'clearfix']">
        <template v-for="(tag, index) in videoTag">
          <div :key="`all-tag-${index}`" @click="onChangeVideoType(index)">
            {{ tag.title }}
          </div>
        </template>
      </div>
    </div>

    <div :class="[$style['video-list-wrap'], 'clearfix']">
      <div
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
            @click.stop="
              openVideo('videoList', {
                query: {
                  source: $route.query.source,
                  tagId: +videoType.id || 0,
                  sortId: +videoData.id || 30
                }
              })
            "
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
            @click.stop="
              openVideo('videoPlay', {
                params: { id: video.id },
                query: { source: $route.query.source }
              })
            "
          >
            <img v-lazy="getImg(video.image)" />
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
      videoType: { id: 0, title: "" }
    };
  },
  computed: {
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

      return videoList;
    }
  },
  created() {
    switch (this.source) {
      case "yabo":
        this.setHeaderTitle("鸭脖视频");
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

    this.getVideoTag();
    this.getVideoSort();
    this.getVideoRecommand();
    this.getVideoList();
  },
  methods: {
    getImg(img) {
      const isYabo = this.source === 'yabo';
      return {
        src: img,
        error: this.$getCdnPath(`/static/image/_new/default/${isYabo ? 'bg_video03_d' : 'bg_video03_1_d@3x'}.png`),
        loading: this.$getCdnPath(`/static/image/_new/default/${isYabo ? 'bg_video03_d' : 'bg_video03_1_d@3x'}.png`),
      };
    },
    getVideoTag() {
      try {
        let videolistStorage = localStorage.getItem(`${this.source}-video-tag`);
        if (videolistStorage) {
          this.videoTag = JSON.parse(
            localStorage.getItem(`${this.source}-video-tag`)
          );
        }
      } catch (e) {
        console.log(e);
      }

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

        try {
          localStorage.setItem(
            `${this.source}-video-tag`,
            JSON.stringify([{ id: 0, title: "全部" }, ...response.result])
          );
          localStorage.setItem(
            `${this.source}-video-tag-timestamp`,
            Date.now()
          );
        } catch (e) {
          console.log(e);
        }

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
      try {
        let videolistStorage = localStorage.getItem(
          `${this.source}-video-sort`
        );
        if (videolistStorage) {
          this.videoSort = JSON.parse(
            localStorage.getItem(`${this.source}-video-sort`)
          );
        }
      } catch (e) {
        console.log(e);
      }

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

        try {
          localStorage.setItem(
            `${this.source}-video-sort`,
            JSON.stringify(response.result)
          );
          localStorage.setItem(
            `${this.source}-video-sort-timestamp`,
            Date.now()
          );
        } catch (e) {
          console.log(e);
        }

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
      try {
        let videolistStorage = localStorage.getItem(
          `${this.source}-video-list`
        );
        if (videolistStorage) {
          this.videoList = JSON.parse(
            localStorage.getItem(`${this.source}-video-list`)
          );
        }
      } catch (e) {
        console.log(e);
      }

      return pornRequest({
        method: "post",
        url: `/video/videolist`,
        data: {
          tag: this.videoType.title === "全部" ? "" : this.videoType.title,
          siteId: this.siteId
        }
      }).then(response => {
        if (response.status !== 200) {
          return;
        }

        try {
          localStorage.setItem(
            `${this.source}-video-list`,
            JSON.stringify(response.result)
          );
          localStorage.setItem(
            `${this.source}-video-list-timestamp`,
            Date.now()
          );
        } catch (e) {
          console.log(e);
        }

        this.videoList = [...response.result];
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

.tag-box {
  position: relative;

  &.yabo {
    background: $main_white_color1;
    padding-right: 40px;
  }

  &.gay {
    background: #3e81ac;
  }

  &.les {
    background: #cc4646;
  }
}

.tag-tab {
  display: inline-block;
  margin: 0 15px;
}

.tag-wrap {
  position: relative;
  line-height: 44px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;

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
}

.video-list-wrap {
  overflow-y: auto;
  padding: 0 17px;
  background: $main_background_white1;
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
