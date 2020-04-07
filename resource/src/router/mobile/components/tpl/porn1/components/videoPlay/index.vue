<template>
  <mobile-container v-if="videoInfo" :class="$style.container">
    <div slot="content" class="content-wrap">
      <video-player :video-info="videoInfo" />
      <video-info :video-info="videoInfo" />
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
import mobileContainer from '../common/mobileContainer';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
  components: {
    mobileContainer,
    videoPlayer,
    videoInfo,
    videoGuess
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
  created() {
    if (!this.memInfo.config.content_rating || !this.memInfo.user.content_rating) {
      this.$router.push('/mobile');
      return;
    }

    axios({
      method: 'post',
      url: `${API_PORN1_DOMAIN}/api/v1/video/videoinfo`,
      timeout: 30000,
      data: querystring.stringify({ videoId: this.$route.params.id }),
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

      this.videoInfo = { ...response.data.result };
    });
  }
};
</script>

<style lang="scss" module>
div.container {
  background-color: #161823;
}
</style>
