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
import pornRequest from '@/api/pornRequest';

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

    pornRequest({
      method: 'post',
      url: `/video/artistvideo`,
      data: { artistId: this.$route.params.id },
    }).then((response) => {
      if (response.status !== 200) {
        return;
      }

      this.artistInfo = { ...response.result };
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
    font-weight: 500;
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
