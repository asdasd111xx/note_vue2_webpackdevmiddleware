<template>
  <div :class="$style['video-more-container']">
    <div :class="[$style['box'], $style[source]]">
      <swiper :options="{ slidesPerView: 'auto', slideClass: $style['tab'] }">
        <swiper-slide v-for="info in videoTabs" :key="info.id">
          <div
            :class="[
              $style['wrap'],
              $style[source],
              { [$style.active]: info.id === +sortId }
            ]"
            @click="setSortId(info.id)"
          >
            <span>{{ info.title }}</span>
            <div :class="$style['line']" />
          </div>
        </swiper-slide>
      </swiper>
      <div
        :class="[isSingle ? $style['is-single'] : $style['is-multiple']]"
        @click="isSingle = !isSingle"
      />
    </div>

    <div :class="[$style['video-list-wrap'], 'clearfix']">
      <div
        v-for="info in videoList"
        :key="info.id"
        :class="[
          isSingle ? $style['single'] : $style['multiple'],
          $style['video-cell']
        ]"
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
        <div v-if="isSingle" :class="$style['views']">
          <img :src="$getCdnPath('/static/image/_new/discover/ic_video.png')" />
          {{ info.views }}
        </div>
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
import { getEncryptImage } from '@/lib/crypto';

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
      isReceive: false,
      hasInfinite: false,
      videoList: [],
      current: 0,
      total: 0,
      videoTabs: [],
      sortId: +this.$route.query.sortId,
      tagId: +this.$route.query.tagId,
      isSingle: false,
      source: this.$route.query.source
    };
  },
  created() {
    this.setHeaderTitle(this.$text("S_FULL_HD_MOVIE", "全部高清影片"));
    this.getVideoTab();
    this.setVideoList();
  },
  computed: {
    defaultImg() {
      const isYabo = this.source === 'yabo';
      return this.$getCdnPath(`/static/image/_new/default/${isYabo ? 'bg_video03_d' : 'bg_video03_1_d@3x'}.png`)
    },
  },
  methods: {
    getVideoTab() {
      pornRequest({
        method: "get",
        url: `/video/sort`,
        params: {
          tagId: !this.tagId ? '' : this.tagId,
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
    getVideoList(page) {
      return pornRequest({
        method: "post",
        url: `/video/list`,
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
    },
    videoList(val) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.videoList.forEach(item => {
            getEncryptImage(item);
          })
        }, 100)
      })
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.box {
  max-width: $mobile_max_width;
  width: 100%;
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
  .box {
    max-width: $mobile_max_landscape_width !important;
  }
}

.tab {
  display: inline-block;
  margin: 0 15px;
}

.wrap {
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

.btn-column {
  $size: 20px;
  position: absolute;
  top: 50%;
  right: 10px;
  width: $size;
  height: $size;
  background-position: 0 50%;
  background-repeat: no-repeat;
  background-size: $size $size;
  transform: translateY(-50%);
}

.is-multiple {
  composes: btn-column;
  background-image: url("/static/image/_new/discover/ic_list_double.png");
}

.is-single {
  composes: btn-column;
  background-image: url("/static/image/_new/discover/ic_list_single.png");
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
</style>
