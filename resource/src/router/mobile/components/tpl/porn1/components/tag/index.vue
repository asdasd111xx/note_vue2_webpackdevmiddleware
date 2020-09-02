<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style.title">{{ searchTags }}</div>
      <template v-if="videoList.length > 0">
        <div
          v-for="video in videoList"
          :key="video.id"
          :class="[$style.video, 'clearfix']"
          @click="$router.push({ name: 'videoPlay', params: { id: video.id } })"
        >
          <div :class="$style['image-wrap']">
            <img :src="img" :img-id="video.id" />
          </div>
          <div :class="$style['info-wrap']">
            <div :class="$style['video-title']">{{ video.title }}</div>
            <div :class="$style['tag-wrap']">
              <div
                v-for="(tag, index) in getTag(video.tag)"
                :key="`tag-${index}`"
              >
                {{ tag }}
              </div>
            </div>
            <div :class="$style.views">
              <img
                :src="$getCdnPath('/static/image/_new/discover/ic_video.png')"
              />
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
      </template>

      <template v-else-if="videoList.length === 0 && !isLoading">
        <div :class="$style['no-data']">
          <div :class="$style['search-img']">
            <img
              :src="$getCdnPath('/static/image/_new/common/icon_search_n.png')"
              alt="search"
            />
          </div>
          <p>无视频资料</p>
        </div>
      </template>
      <page-loading :is-show="isLoading" />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import axios from 'axios';
import querystring from 'querystring';
import mobileContainer from '../common/mobileContainer';
import pornRequest from '@/api/pornRequest';
import { getEncryptImage } from '@/lib/crypto';

export default {
  components: {
    pageLoading: () => import(/* webpackChunkName: 'pageLoading' */ '@/router/mobile/components/common/pageLoading'),
    InfiniteLoading,
    mobileContainer
  },
  data() {
    return {
      isLoading: true,
      isReceive: false,
      hasInfinite: false,
      videoList: [],
      current: 0,
      total: 0,
      img: this.$getCdnPath(`/static/image/_new/default/bg_video03_d.png`)
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    searchTags() {
      return this.$route.params.key ? this.$route.params.key.replace(/,/g, "・") : ''
    },
    headerConfig() {
      return {
        prev: true,
        isBackgroundGradient: true,
        title: '筛选结果',
        onClick: () => { this.$router.back(); }
      };
    }
  },
  created() {
    if (localStorage.getItem('content_rating')) {
      if (localStorage.getItem('content_rating') !== "1") {
        this.$router.push('/mobile');
      }
    } else if (!this.memInfo.config.content_rating || !this.memInfo.user.content_rating) {
      this.$router.push('/mobile');
    }

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
    getTag(tag) {
      return tag.split(',');
    },
    getVideoList(page) {
      return pornRequest({
        method: 'post',
        url: `/video/tagsearch`,
        data: { tags: this.$route.params.key, page: page },
      });
    },
    setVideoList() {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;
      this.hasInfinite = false;

      this.getVideoList(1).then((response) => {
        this.isLoading = false;
        this.isReceive = false;

        if (response.status !== 200) {
          return;
        }

        this.videoList = [...response.result.data];
        this.current = response.result.current_page;
        this.total = response.result.last_page;

        setTimeout(() => {
          this.videoList.forEach(item => {
            getEncryptImage(item);
          })
        }, 300)

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

.content-wrap {
  padding-top: 45px;
}

.title {
  position: fixed;
  top: 43px;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 43px;
  line-height: 43px;
  color: $main_discover_color1;
  background-color: $main_white_color1;
  font-size: 12px;
  text-align: center;

  border-top: solid 1px $main_background_white1;
  border-bottom: solid 1px $main_background_white1;
}

.video {
  padding: 0 18px 10px;

  > div {
    float: left;
    height: 80px;
  }
}

.image-wrap {
  overflow: hidden;
  position: relative;
  width: 40%;
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

.info-wrap {
  width: 60%;
  padding-left: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;

  > div {
    height: 33%;
    width: 100%;
    align-items: center;
  }
}

.video-title {
  display: block;
  overflow: hidden;
  height: 17px;
  line-height: 17px;
  color: $main_text_color4;
  font-size: 13px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-wrap {
  overflow: hidden;
  white-space: nowrap;
  overflow: auto;
  white-space: nowrap;

  > div {
    display: inline-block;
    height: 17px;
    line-height: 17px;
    margin-right: 8px;
    padding: 0 10px;
    border-radius: 7px;
    background-color: #eeeeee;
    color: $main_text_color2;
    font-size: 12px;
  }
}

.views {
  display: flex;
  align-items: center;
  color: $main_text_color2;
  height: 13px;
  line-height: 13px;
  font-size: 10px;

  > img {
    width: 13px;
    height: 13px;
    margin-right: 2.5px;
  }
}

.no-data {
  position: absolute;
  width: 100%;
  height: calc(100vh - 100px);
  background: $main_background_white1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .search-img {
    position: relative;
    width: 63px;
    height: 63px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  p {
    font-size: 16px;
    margin-top: 10px;
    color: #000;
  }
}

@media screen and (min-width: $pad) {
  .title {
    font-size: 17px;
  }

  .video-title {
    font-size: 17px;
  }

  .tag-wrap {
    > div {
      height: 18px;
      line-height: 18px;
      font-size: 16px;
    }
  }

  .video {
    > div {
      height: 115px;
    }
  }

  .views {
    font-size: 14px;
  }
}
</style>
