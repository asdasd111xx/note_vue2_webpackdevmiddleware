<template>
  <mobile-container v-if="artistInfo" :class="$style.container">
    <div slot="content" class="content-wrap">
      <div :class="$style['header']">
        <div :class="$style['btn-prev']" @click="$router.back()">
          <img :src="$getCdnPath('/static/image/_new/common/btn_back.png')" />
        </div>
        <div :class="$style.title">{{ title }}</div>
      </div>

      <artist-info
        :artist="artistInfo.artist"
        :image="artistInfo.image"
        :birthday="artistInfo.birthday"
        :measurement="artistInfo.measurement"
        :cup="artistInfo.cup"
        :desc="artistInfo.desc"
        :height="artistInfo.height"
        :amount="artistInfo.videoList.length"
        :set-title="setTitle"
      />
      <artist-video :video-list="artistInfo.videoList" />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import querystring from 'querystring';
import artistInfo from './components/artistInfo';
import artistVideo from './components/artistVideo';
import mobileContainer from '../common/mobileContainer';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
  components: {
    mobileContainer,
    artistInfo,
    artistVideo
  },
  data() {
    return {
      artistInfo: null,
      title: ""
    };
  },
  methods: {
    setTitle(title) {
      this.title = title;
    }
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    })
  },
  created() {
    if (!this.memInfo.config.content_rating || !this.memInfo.user.content_rating) {
      this.$router.push('/mobile');
      return;
    }

    axios({
      method: 'post',
      url: `${API_PORN1_DOMAIN}/api/v1/video/artistvideo`,
      timeout: 30000,
      data: querystring.stringify({ artistId: this.$route.params.id }),
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

      this.artistInfo = { ...response.data.result };
    });
  }
};
</script>

<style lang="scss" module>
div.container {
  background-color: white;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/image/_new/common/bg.png");
  height: 100vh;
}

.header {
  position: relative;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 43px;
  padding: 0 14px;
  text-align: center;

  > .title {
    width: 100%;
    line-height: 43px;
    font-size: 17px;
    height: 43px;
    color: black;
  }

  .btn-prev {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 14px;
    width: 24px;
    height: 24px;
    margin: auto;

    > img {
      display: block;
      width: 100%;
    }
  }
}
</style>
