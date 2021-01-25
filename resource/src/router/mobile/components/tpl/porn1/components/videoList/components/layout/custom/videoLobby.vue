<template>
  <div :class="$style['video-lobby-container']" id="video-lobby-container">
    <div :class="$style['top-wrap']">
      <span @click="msg = '正在上线 敬请期待'">频道</span>
      <div
        :class="$style['search-block']"
        @click="$router.push({ path: 'search', query: { source: 'smallPig' } })"
      >
        <p>请输入关键词找片源</p>
      </div>
      <span @click="msg = '正在上线 敬请期待'">发现</span>
    </div>

    <div :class="$style['category-wrap']" v-if="videoTag">
      <div
        :class="$style['tag-block']"
        v-for="(info, index) in videoTag.slice(0, 8)"
        :key="info.id"
      >
        <div
          :class="$style['tag-icon']"
          @click.stop="
            openVideo('videoList', {
              query: {
                source: $route.query.source,
                tagId: +info.id,
                sortId: 0
              }
            })
          "
        >
          <img
            :src="
              $getCdnPath(
                `/static/image/_new/source/smallPig/btn_av${index + 1}.png`
              )
            "
            alt="icon"
          />
        </div>
        <span>{{ info.title }}</span>
      </div>
    </div>

    <div :class="$style['video-list-wrap']">
      <div
        :id="`${i}`"
        v-for="(videoData, i) in allVideoList"
        :key="`video-type-${i}`"
        :class="$style['video-cell']"
      >
        <div v-if="videoData.list" :class="[$style['video-type'], 'clearfix']">
          <div :class="$style['type-name']">{{ videoData.name }}</div>
          <div
            :class="$style['btn-more']"
            @click.stop="handleMore(i, videoData)"
          >
            <span>更多</span>
            <span :class="$style['icon-arrow']">
              <img
                :src="
                  $getCdnPath('/static/image/_new/source/smallPig/ic_more.png')
                "
                alt="more"
              />
            </span>
          </div>
        </div>

        <div :class="$style['video-block']" v-if="videoData.list">
          <div
            v-for="video in videoData.list.slice(0, 4)"
            :key="`video-${video.id}`"
            :href="`/mobile/videoPlay/${video.id}`"
            :class="$style['video']"
            @click.stop="handleVideo(i, video)"
          >
            <div :class="$style['video-img']">
              <img :src="defaultImg" :img-id="video.id" />
            </div>
            <p :class="$style['video-title']">{{ video.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
  </div>
</template>

<script>
import axios from "axios";
import find from "lodash/find";
import pornRequest from "@/api/pornRequest";
import message from "@/router/mobile/components/common/message";
import { getEncryptImage } from "@/lib/crypto";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    message
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
      source: this.$route.query.source,
      msg: "",
      videoTag: [],
      videoSort: [],
      videoRecommand: [],
      videoList: [],
      videoType: { id: 0, title: "" },
      resetTimer: null
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    defaultImg() {
      const isYabo = this.source === "yabo";
      return this.$getCdnPath(
        `/static/image/${this.themeTPL}/default/${
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
          if (item && item.list) {
            item.list.forEach(i => {
              getEncryptImage(i);
            });
          }
        });
      }, 300);

      return videoList;
    }
  },
  created() {
    this.setHeaderTitle("小猪视频");
    this.setHasSearchBtn(false);
    this.initData();
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
    getVideoTag() {
      return pornRequest({
        url: "/video/tag",
        method: "get",
        smallPig: true,
        params: {
          siteId: this.siteId
        }
      }).then(response => {
        if (response.status !== 200) {
          return;
        }

        this.videoTag = response.result;
      });
    },
    // 取得影片排序
    getVideoSort() {
      return pornRequest({
        method: "get",
        url: "/video/sort",
        smallPig: true,
        params: {
          siteId: this.siteId
        }
      }).then(response => {
        if (response.status !== 200) {
          return;
        }

        this.videoSort = [...response.result];
      });
    },
    // 取得熱門推薦影片
    getVideoRecommand() {
      return pornRequest({
        url: `/video/recommand`,
        smallPig: true,
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
        smallPig: true,
        data: {
          tag: this.videoType.title,
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
            const wrap = document.getElementById("video-lobby-container");
            const cells = document.getElementsByClassName(
              this.$style["video-cell"]
            );

            if (wrap && cells && cells[0] && hash > 0) {
              let totalTop = 0;
              for (let i = 0; i < hash; i++) {
                totalTop += cells[i].offsetHeight;
              }

              wrap.scrollTop = 220 + totalTop;
            }
          }
        });
      });
    },
    openVideo(name, routerParam) {
      this.$router.push({ name, ...routerParam });
    }
  },
  beforeDestroy() {
    clearTimeout(this.resetTimer);
    this.resetTimer = null;
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.video-lobby-container {
  padding: 50px 0 20px;
  height: calc(100vh - 100px);
  overflow: scroll;
}

.top-wrap {
  max-width: $mobile_max_width;
  position: fixed;
  width: 100%;
  height: 50px;
  top: 43px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #414141;
  color: #fff;
  z-index: 1;

  .search-block {
    position: relative;
    width: 70%;
    height: 36px;
    line-height: 36px;
    margin: 0 12px;
    text-align: center;
    background: #333;
    color: #bfbfbf;
    border-radius: 5px;

    p {
      position: relative;
      width: 65%;
      margin: 0 auto;
      line-height: inherit;

      &::before {
        content: "";
        position: absolute;
        background: url("/static/image/_new/search/ic_search.png") no-repeat;
        width: 20px;
        height: 20px;
        background-size: 100% 100%;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
  }
}

.top-wrap {
  max-width: $mobile_max_width;
  min-width: 0;
}

@media (orientation: landscape) {
  .top-wrap {
    max-width: $mobile_max_landscape_width !important;
  }
}

.category-wrap {
  position: relative;
  width: 90%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 auto;
  border-bottom: 1px solid #444343;

  .tag-block {
    position: relative;
    width: 25%;
    height: 80px;
    text-align: center;
  }

  .tag-icon {
    width: 60px;
    height: 60px;
    margin: auto;

    img {
      width: 100%;
      height: 100%;
    }
  }

  span {
    color: #989292;
  }
}

.video-list-wrap {
  position: relative;
  padding: 0 20px;
  margin: auto;
  //   height: calc(100vh - 105px);

  .video-cell {
    position: relative;
  }

  .video-type {
    font-weight: 700;
    margin: 10px 0 15px;
    width: 100%;

    .type-name {
      font-size: 17px;
      color: #fff;
    }

    .btn-more {
      color: #989292;
      position: absolute;
      right: 0;
      top: 0;
    }

    .icon-arrow {
      display: inline-flex;
      width: 10px;
      height: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .video-block {
    position: relative;
    display: inline-flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;

    .video {
      position: relative;
      width: 48%;
    }

    .video-img {
      width: 160px;
      height: 100px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }

    .video-title {
      color: #bfbfbf;
      font-size: 12px;
      padding: 5px 0 10px;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
