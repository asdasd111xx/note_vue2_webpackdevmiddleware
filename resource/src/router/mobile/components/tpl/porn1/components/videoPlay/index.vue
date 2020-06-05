<template>
  <mobile-container v-if="videoInfo" :class="$style.container">
    <div slot="content" class="content-wrap">
      <div :class="$style['header']" id="header">
        <div :class="$style['btn-prev']" @click="$router.back()">
          <img :src="$getCdnPath('/static/image/_new/common/btn_back_w.png')" />
        </div>
      </div>
      <template v-if="videoInfo">
        <video-player :video-info="videoInfo" />
        <video-info :video-info="videoInfo" />
        <video-tag :tag="videoInfo.tag" :padding="true" />
      </template>
      <video-guess />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import querystring from 'querystring';
import videoPlayer from './components/videoPlayer';
import videoInfo from './components/videoInfo';
import videoGuess from './components/videoGuess';
import videoTag from './components/videoTag';
import mobileContainer from '../common/new/mobileContainer';
import pornRequest from '@/api/pornRequest';

export default {
  components: {
    mobileContainer,
    videoPlayer,
    videoInfo,
    videoGuess,
    videoTag
  },
  data() {
    return {
      videoInfo: null
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    })
  },
  mounted() {

    pornRequest({
      method: 'post',
      url: `/video/videoinfo`,
      data: { videoId: this.$route.params.id },
      //   reqHeaders: {
      //     // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
      //      'Content-Type': 'application/x-www-form-urlencoded',
      //      origin: 'http://127.0.0.1'
      //   }
    }).then((res) => {
      if (res.status !== 200) {
        return;
      }

      this.videoInfo = { ...res.result };
    });
  },
  created() {
    if (!this.memInfo.config.content_rating || !this.memInfo.user.content_rating) {
      this.$router.push('/mobile');
      return;
    }

    if(this.$route.query.source === 'smallPig') {
      axios.defaults.withCredentials = true;
      axios({
          method: 'post',
          url: 'https://api.pv123.app/v1/device/verify',
          data: {
            type: 'ios',
            token: '111123333',
            info: 'brrrr'
          }
      }).then((res) => {
          return
      })
    }


    // axios({
    //   method: 'post',
    //   url: `https://daydayyouhui.com/api/v1/video/videoinfo`,
    //   timeout: 30000,
    //   //   data: querystring.stringify({ videoId: this.$route.params.id }),
    //   headers: {
    //     Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
    //     Version: 1
    //     // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //     // origin: 'http://127.0.0.1'
    //   }
    // }).then((response) => {
    //   if (response.status !== 200) {
    //     return;
    //   }

    //   this.videoInfo = { ...response.data.result };
    // });
  },
  destroyed() {
    axios.defaults.withCredentials = false;
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: $main_white_color1;
}

.header {
  position: fixed;
  top: 0;
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
