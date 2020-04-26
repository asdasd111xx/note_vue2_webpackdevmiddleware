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
        v-if="isActiveBouns && isShowBounsDialog && !isFullBouns"
        :type="dialogType"
        @close="isShowBounsDialog = false"
      />
      <bonuns-process
        ref="bonunsProcess"
        v-if="isActiveBouns && isShowBounsProcess"
        @close="isShowBounsProcess = false"
        :playing="isPlaying"
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
import { getCookie } from '@/lib/cookie';

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
      isPlaying: false,
      //   彩金開關
      isActiveBouns: true,
      isShowBounsDialog: false,
      isShowBounsProcess: true,
      isFullBouns: false,
      dialogType: "tips",// 提示 & 賺得彩金
      socket: null,
      socketId: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig',
    }),
  },
  create() {
  },
  mounted() {
    this.player = videojs(this.$refs['video-player'], {
      sources: [{ src: this.videoInfo.url, type: 'application/x-mpegURL' }],
      autoplay: false,
      controls: true,
      controlBar: true,
      loop: false,
      preload: 'auto',
      bigPlayButton: true,
    });

    //活動開關
    if (this.isActiveBouns) {
      try {
        //取消原本video 預設點擊播放事件
        let videoDom = document.getElementsByClassName('vjs-tech');
        if (videoDom[0]) {
          videoDom[0].style.pointerEvents = "none";
          this.blockHeight = videoDom[0].offsetHeight;
        }

        // connect websocket
        let cid = getCookie('cid');
        if (!cid)
          return
        var uri = this.siteConfig.ACTIVES_BOUNS_WEBSOCKET + `?cid=${cid}`;
        this.socket = new WebSocket(uri);
        this.socket.onmessage = this.onMessage;
        this.socket.onopen = this.onOpen;
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
        // 模擬每次增加1分鐘
        // setInterval(() => {
        //   this.$refs.bonunsProcess.curMin += 1
        // }, 100)
      } catch (e) {
        console.log(e)
      }

      this.player.on("playing", () => {
        this.isPlaying = true;
        if (this.socket)
          this.onSend("PLAY");
      })

      this.player.on("pause", () => {
        this.isPlaying = false;
        if (this.socket)
          this.onSend("STOP");
      })
    }

  },
  methods: {
    handleClickVideoBlock(e) {
      // 餘額夠可播放
      if (!this.loginStatus) {
        this.isShowBounsDialog = true;
        this.dialogType = 'tips';
        if (this.player && !this.player.paused()) {
          this.player.pause();
        }

      } else if (this.isShowBounsDialog) {
        if (!this.player.paused()) {
          this.player.pause();
        }
        return;
      }
      else {
        if (!this.player.paused()) {
          this.player.pause();
        } else {
          this.player.play();
        }
      }
    },
    onMessage(e) {
      if (e.data) {
        let data = JSON.parse(e.data)
        this.socketId = data.SocketId;

        if (process.env.NODE_ENV === 'development') {
          //   console.log("msg ==>")
          //   console.log(data)
        }

        if (data.Active) {
          //狀態
          // 'OPEN', 'PLAY', 'STOP', 'CLOSE', 'BREAK', 'FULL', 'POOR'
          switch (data.Status) {
            case 'FULL':
              this.$refs.bonunsProcess.isFinish = true;
              this.dialogType = `tips-${data.Status.toLowerCase()}`
              this.isShowBounsDialog = true;
              break;
            case 'POOR':
              this.dialogType = `tips-${data.Status.toLowerCase()}`
              this.isShowBounsDialog = true;
              break;
            case 'BREAK':
              this.dialogType = `tips-${data.Status.toLowerCase()}`
              this.isShowBounsDialog = true;
              this.$refs.bonunsDialog.hadEarnNum = data.BreakTimes
              if (!this.player.paused()) {
                this.player.pause();
              }
              break;
            case 'CLOSE':
              return;
            default:
              break;
          }

          //每次累積彩金
          this.$refs.bonunsProcess.earnCoin = Number(Number(data.Active.MinAmout) * Number(data.Active.CueTimes)).toFixed(2);

          //當前累積時間(0)
          this.$refs.bonunsProcess.curMin = data.CueTimes;
          if (data.Amount != 0 && data.Active.CueTimes == 0) {
            this.$refs.bonunsProcess.isShowEarn = true;
          }

          //獲得彩金
          this.$refs.bonunsDialog.earnCurrentNum = Number(Number(data.Active.BreakAmout) * Number(data.Active.BreakTimes)).toFixed(2);

          //每次獲得彩金
          this.$refs.bonunsDialog.earnSingleNum = Number(data.Active.BreakAmout).toFixed(2);

          //已經獲得彩金數
          this.$refs.bonunsDialog.hadEarnNum = data.BreakTimes

          //可獲得最高彩金
          this.$refs.bonunsDialog.limitAmount = Number(data.Active.LimitAmout).toFixed(2)

          //可獲得彩金數
          this.$refs.bonunsDialog.earnCellNum = (Number(data.Active.LimitAmout) / Number(data.Active.BreakAmout))

        }
      }
    },
    onOpen(e) {
      if (process.env.NODE_ENV === 'development') {
        console.log("open ==>")
        console.log(e)
      }
    },
    onClose(e) {
      if (process.env.NODE_ENV === 'development') {
        console.log("close ==>")
        console.log(e)
      }
    },
    onError(e) {
      if (process.env.NODE_ENV === 'development') {
        console.log("err ==>")
        console.log(e)
      }
      this.isActiveBouns = false;
      this.socket = null;
    },
    // "STOP" | "CLOSE" | "PLAY"
    onSend(type) {
      if (!this.socket) {
        return
      }
      let data = {
        "SocketId": this.socketId,
        "Type": type,
        "SendTime": new Date().toISOString(),
        "Data": {}
      }

      if (process.env.NODE_ENV === 'development') {
        console.log("send ==>")
        console.log(data)
      }
      this.socket.send(JSON.stringify(data))
    }
  },
  beforeDestroy() {
    this.player.dispose();
    if (this.socket) {
      this.socket.send({
        "SocketId": this.socketId,
        "Type": "close",
        "SendTime": new Date().toISOString(),
        "Data": {}
      })
    }
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
