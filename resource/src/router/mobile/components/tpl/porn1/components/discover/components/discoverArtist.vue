<template>
  <div
    :class="$style['discover-artist-wrap']"
    @scroll="onScroll"
    :style="{ paddingBottom: dynamicPB + 'px' }"
  >
    <div :class="$style['artist-container']" data-letter="HOT">
      <div :class="[$style.title, $style.hot]">
        {{ $text("S_HOT_ARTIST", "人气女优") }}
      </div>
      <div :class="[$style['artist-wrap'], 'clearfix']">
        <div
          v-for="info in hotArtist"
          :key="info.id"
          :class="$style.wrap"
          @click="$router.push({ name: 'artist', params: { id: info.id } })"
        >
          <img v-lazy="getImg(info.image)" />
          <div :class="$style['artist-name']">{{ info.artist }}</div>
        </div>
      </div>
    </div>
    <div
      v-for="artist in allArtist"
      :key="`artist-${artist.letter}`"
      :class="$style['artist-container']"
      :data-letter="artist.letter"
    >
      <div :class="[$style.title, $style.all]">{{ artist.letter }}</div>
      <div :class="[$style['artist-wrap'], 'clearfix']">
        <div
          v-for="info in artist.list"
          :key="info.id"
          :class="$style.wrap"
          @click="$router.push({ name: 'artist', params: { id: info.id } })"
        >
          <img v-lazy="getImg(info.image)" />
          <div :class="$style['artist-name']">{{ info.artist }}</div>
        </div>
      </div>
    </div>

    <div v-if="allArtist.length" :class="$style.sidebar">
      <div
        :class="{ [$style.active]: active === 'HOT' }"
        @click="onScrollTop('HOT')"
      >
        <span>人</span>
      </div>
      <div
        v-for="artist in allArtist"
        :key="`sidebar-${artist.letter}`"
        :class="{ [$style.active]: active === artist.letter }"
        @click="onScrollTop(artist.letter)"
      >
        <span>{{ artist.letter }}</span>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import axios from "axios";
import find from "lodash/find";
import pornRequest from "@/api/pornRequest";

export default {
  data() {
    return {
      hotArtist: [],
      allArtist: [],
      active: "HOT",
      dynamicPB: null
    };
  },
  mounted() {
    $(window).scroll(this.onScroll);

    pornRequest({
      url: `/video/artist`
    }).then(response => {
      if (response.status !== 200) {
        return;
      }

      this.hotArtist = [...response.result.hotArtist];
      this.allArtist = [...response.result.allArtist];
    }).then(() => {
      let wrap = document.getElementsByClassName(
        this.$style["discover-artist-wrap"]
      );
      const container = document.getElementsByClassName(
        this.$style["artist-container"]
      );
      const target = container[container.length - 1];
      this.dynamicPB = wrap[0].offsetHeight - target.offsetHeight
    });
  },
  beforeDestroy() {
    $(window).off("scroll", this.onScroll);
  },
  methods: {
    getImg(image) {
      return {
        src: image,
        error: this.$getCdnPath(`/static/image/_new/default/bg_avatar_d.png`),
        loading: this.$getCdnPath(`/static/image/_new/default/bg_avatar_d.png`)
      };
    },
    onScroll() {
      let wrap = document.getElementsByClassName(
        this.$style["discover-artist-wrap"]
      )[0];
      const scrollTop = wrap.scrollTop;
      const container = document.getElementsByClassName(
        this.$style["artist-container"]
      );
      const element = find(
        container,
        ele =>
          scrollTop >= ele.offsetTop - 40 &&
          scrollTop < ele.offsetTop + ele.offsetHeight
      );
      if (element && element.dataset) this.active = element.dataset.letter;
    },
    onScrollTop(target) {
      let wrap = document.getElementsByClassName(
        this.$style["discover-artist-wrap"]
      )[0];
      const container = document.getElementsByClassName(
        this.$style["artist-container"]
      );
      const element = find(container, ele => ele.dataset.letter === target);
      wrap.scrollTo(0, element.offsetTop);
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.discover-artist-wrap {
  position: relative;
  height: calc(100vh - 105px);
  overflow-y: scroll;
  //   padding-bottom: 100px;
}

.artist-container {
  &:not(:first-child) {
    margin-top: 10px;
  }
}

.title {
  width: 100%;
  background-color: #f8f8f7;
  padding: 0 16px;
  margin: 3px 0 8px;
  font-size: 14px;
}

.hot {
  color: $main_discover_color1;
}

.all {
  color: $main_text_color4;
}

.artist-wrap {
  background-color: #ffffff;
  padding-right: 43px;
}

.wrap {
  float: left;
  width: 25%;
  margin-top: 15px;

  > img {
    display: block;
    width: 56px;
    height: 56px;
    margin: 0 auto;
    border-radius: 50%;
  }
}

.artist-name {
  overflow: hidden;
  height: 15px;
  line-height: 15px;
  margin-top: 8px;
  color: $main_text_color1;
  font-size: 11px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar {
  position: fixed;
  top: 148px;
  right: 18px;
  z-index: 1;
  width: 16px;
  height: 350px;

  > div {
    margin: 5px 0;
    height: 15px;
    line-height: 16px;
    border-radius: 50%;
    color: $main_discover_color1;
    font-size: 9px;
    text-align: center;

    &.active {
      background-color: $main_discover_color1;
      color: #fefffe;
    }
  }
}

@media screen and (min-width: $phone) {
  .title {
    font-size: 16px;
  }

  .artist-name {
    font-size: 13px;
  }

  .sidebar {
    div {
      font-size: 13px;
    }
  }
}

@media screen and (min-width: $pad) {
  .title {
    font-size: 18px;
  }

  .artist-name {
    font-size: 15px;
  }

  .sidebar {
    div {
      font-size: 14px;
    }
  }
}
</style>
