<template>
  <div :class="$style['search-info-wrap']">
    <template v-if="searchList.length">
      <div :class="[$style['list-wrap'], 'clearfix']">
        <div v-for="info in searchList" :key="info.id" :class="$style.wrap">
          <div
            :class="$style['image-wrap']"
            @click="
              $router.push({
                name: 'videoPlay',
                params: { id: info.id }
              })
            "
          >
            <img v-lazy="getImg(info.image)" />
          </div>
          <div :class="$style.title">{{ info.title }}</div>
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

    <template v-else>
      <div :class="$style['no-data']">
        <div :class="$style['search-img']">
          <img
            :src="$getCdnPath('/static/image/_new/search/ic_search.png')"
            alt="search"
          />
        </div>
        <p>无视频资料</p>
      </div>
    </template>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import axios from "axios";
import querystring from "querystring";
import pornRequest from "@/api/pornRequest";

export default {
  components: {
    InfiniteLoading
  },
  props: {
    keyWord: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isReceive: false,
      hasInfinite: false,
      searchList: [],
      current: 0,
      total: 0
    };
  },
  watch: {
    keyWord() {
      this.setSearchList();
    }
  },
  created() {
    this.setSearchList();
  },
  methods: {
    getImg(image) {
      return {
        src: image,
        error: this.$getCdnPath(
          `/static/image/_new/default/bg_video03_d.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/_new/default/bg_video03_d.png`
        )
      };
    },
    getSearchList(page) {
      return pornRequest({
        method: "post",
        url: `/video/searchbywords`,
        data: {
          keyWords: this.keyWord,
          page: page
        }
      });
    },
    setSearchList() {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;
      this.hasInfinite = false;

      this.getSearchList(1).then(response => {
        this.isReceive = false;

        if (response.status !== 200) {
          return;
        }

        this.searchList = [...response.result.data];
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

      this.getSearchList(this.current + 1).then(response => {
        if (response.status !== 200) {
          return;
        }

        this.searchList = [...this.searchList, ...response.result.data];
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

.search-info-wrap {
  position: relative;
}

.list-wrap {
  width: 97%;
  margin: 10px auto 0;
}

.wrap {
  position: relative;
  float: left;
  height: 110px;
  width: 49%;
  margin-left: 0.6%;
  margin-top: 5px;

  &:nth-child(2n) {
    float: right;
    margin-right: 0.6%;
  }
}

.image-wrap {
  overflow: hidden;
  position: relative;
  height: 100%;
  background-color: #161823;

  > img {
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
  background: rgb(2, 1, 1);
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
    color: $main_text_color5;
  }
}

@media screen and (min-width: $pad) {
  .title {
    font-size: 16px;
  }

  .image-wrap {
    height: 115px;
  }

  .title {
    font-size: 16px;
  }
}
</style>
