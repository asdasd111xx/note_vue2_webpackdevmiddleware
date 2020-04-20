<template>
  <div :class="$style['video-player-wrap']">
    <video
      ref="video-player"
      class="video-js vjs-default-skin vjs-fluid vjs-big-play-centered"
    />

    <!-- 彩金活動 -->
    <div
      v-if="isActiveBouns"
      :class="$style['video-block']"
      @click="handleClickVideoBlock"
      :style="{ height: `${blockHeight}px` }"
    >
      <bonuns-dialog
        ref="bonunsDialog"
        v-if="isActiveBouns && isShowBounsDialog"
        :type="dialogType"
        @close="isShowBounsDialog = false"
      />
      <bonuns-process
        ref="bonunsProcess"
        v-if="isActiveBouns && isShowBounsProcess"
        @close="isShowBounsProcess = false"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import videojs from 'video.js';
import bonunsDialog from '../../bouns/compontents/bonunsDialog'
import bonunsProcess from '../../bouns/compontents/bonunsProcess'

import config from '@/api/bbos/config'

export default {
  components: {
    bonunsDialog,
    bonunsProcess
  },
  props: {
    videoInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      player: null,
      blockHeight: 0,
      //   彩金開關
      isActiveBouns: false,
      isShowBounsDialog: false,
      isShowBounsProcess: true,
      dialogType: "tips",// 提示 & 賺得彩金
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
    }),
  },
  mounted() {
    this.player = videojs(this.$refs['video-player'], {
      sources: [{ src: this.videoInfo.url, type: 'application/x-mpegURL' }],
      autoplay: false,
      controls: this.isActiveBouns ? false : true,
      controlBar: true,
      loop: false,
      preload: 'auto',
      bigPlayButton: true,
    });

    //活動開關
    if (this.isActiveBouns) {

      //取消原本video 預設點擊播放事件
      let videoDom = document.getElementsByClassName('vjs-tech');
      if (videoDom[0]) {
        videoDom[0].style.pointerEvents = "none";
        this.blockHeight = videoDom[0].offsetHeight;
      }

      try {
        // connect websocket
        if (!this.$socket) { this.isActiveBouns = false; return; }
        this.$socket.onmessage = this.onMessage;

        // 每分鐘賺得彩金
        this.$refs.bonunsProcess.earnCoin

        // 模擬每次增加1分鐘
        // setInterval(() => {
        //   this.$refs.bonunsProcess.curMin += 1
        // }, 100)
      } catch (e) {
        console.log(e)
      }
    }

  },
  methods: {
    handleClickVideoBlock() {
      // 餘額夠可播放
      this.isShowBounsDialog = true;
      return;
      if (!this.loginStatus) {
        this.isShowBounsDialog = true;
      } else {
        this.player.play();
      }
    },
    onMessage(e) {

    }
  },
  beforeDestroy() {
    this.player.dispose();
  }
};
</script>
<style lang="scss" module>
.video-player-wrap {
  position: relative;
}

.btn-prev {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
  width: 24px;
  height: 24px;

  > img {
    display: block;
    width: 100%;
  }
}

// 彩金
.video-block {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 2;
}
</style>
