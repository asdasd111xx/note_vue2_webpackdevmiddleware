<template>
  <div :class="$style['discover-artist-wrap']">
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
          <img :src="info.image" />
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
          <img :src="info.image" />
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
import axios from 'axios';
import find from 'lodash/find';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
  data() {
    return {
      hotArtist: [],
      allArtist: [],
      active: 'HOT'
    };
  },
  created() {
    axios({
      method: 'get',
      url: `${API_PORN1_DOMAIN}/api/v1/video/artist`,
      timeout: 30000,
      headers: {
        Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
        Version: 1
        // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // origin: 'http://127.0.0.1'
      }
    }).then((response) => {
      if (response.status !== 200) {
        return;
      }

      this.hotArtist = [...response.data.result.hotArtist];
      this.allArtist = [...response.data.result.allArtist];
    });
  },
  mounted() {
    $(window).scroll(this.onScroll);
    $('.mobile-wrap').css('height', 'unset');
  },
  beforeDestroy() {
    $(window).off('scroll', this.onScroll);
    $('.mobile-wrap').css('height', '100%');
  },
  methods: {
    onScroll() {
      const scrollTop = window.scrollY;
      const container = document.getElementsByClassName(this.$style['artist-container']);
      const element = find(container, (ele) => scrollTop >= ele.offsetTop && scrollTop < ele.offsetTop + ele.offsetHeight);
      if (element && element.dataset) this.active = element.dataset.letter;
    },
    onScrollTop(target) {
      const container = document.getElementsByClassName(this.$style['artist-container']);
      const element = find(container, (ele) => ele.dataset.letter === target);
      window.scrollTo(0, element.offsetTop);
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.discover-artist-wrap {
  position: relative;
  padding-bottom: 15px;
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
