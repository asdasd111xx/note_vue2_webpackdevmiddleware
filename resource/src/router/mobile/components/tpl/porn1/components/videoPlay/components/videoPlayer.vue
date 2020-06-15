<template>
  <div :class="$style['video-player-wrap']">
    <video
      id="video-play"
      ref="video-player"
      playsinline="1"
      :webkit-playsinline="playsinline"
      class="video-js vjs-default-skin vjs-fluid vjs-big-play-centered"
    ></video>
    <!-- 彩金活動 -->
    <div
      v-if="isActiveBouns"
      id="video-play-block"
      :class="$style['video-block']"
    >
      <bonuns-dialog
        ref="bonunsDialog"
        :type="dialogType"
        :videoid="videoInfo.id"
        @close="handleCloseDialog"
      />
      <bonuns-process
        ref="bonunsProcess"
        :type="dialogType"
        @click="handleClickProcess"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import videojs from 'video.js';
import bonunsDialog from '../bouns/compontents/bonunsDialog'
import bonunsProcess from '../bouns/compontents/bonunsProcess'
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
    },
    source: {
      type: String,
    }
  },
  data() {
    return {
      player: null,
      isPlaying: false,
      //   彩金開關
      isActiveBouns: true, //預設打開由message決定是否啟動
      dialogType: "tips",// 提示 & 賺得彩金
      reconnectTimer: null, //重新連線timer
      isFULL: false,
      socket: null,
      socketId: "",
      mission: null,
      keepPlay: false, // wait 任務未達成繼續觀看不發送play
      breakwaitCallback: () => { },
      isFULL: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig',
    }),
    playsinline() {
      return "true"
    },
    isDebug() {
      return process.env.NODE_ENV === 'development' || (this.$route.query & this.$route.query.debug)
    }
  },
  mounted() {
    //  暫時手動轉換https
    if (!this.videoInfo.url) return;
    let obj = {
      sources: [{ src: this.videoInfo.url.replace('http://', 'https://'), type: 'application/x-mpegURL' }],
      // sources: [{ src: 'https://pv-oa-1259142350.file.myqcloud.com/dev/video/FCC/FC2-PPV-777661-3/FC2-PPV-777661-3.m3u8', type: 'application/x-mpegURL' , withCredentials: true}],
      autoplay: false,
      controls: true,
      controlBar: true,
      loop: false,
      preload: 'auto',
      bigPlayButton: true,
    }

    // hls sarfari 小豬視頻必須
    if (this.source === "smallPig") {
      obj['html5'] = {
        hls: {
          "overrideNative": true,
          "withCredentials": true,
        },
        "nativeAudioTracks": false,
        "nativeVideoTracks": false,
      }
    }
    this.player = videojs(this.$refs['video-player'], obj);

    // 彩金疊加在播放器上
    let videoDom = document.getElementById("video-play");
    videoDom.insertBefore(document.getElementById("video-play-block"), videoDom.childNodes[0]);

    //活動開關
    if (this.isActiveBouns) {
      // connect websocket
      this.connectWS();

      this.player.on("playing", () => {
        if (this.player.seeking()) return;
        this.isPlaying = true;
        if (window.YABO_SOCKET && !this.keepPlay && !this.isFULL) {
          this.onSend("PLAY");
        }
        this.keepPlay = false
      })

      // 快轉
      this.player.on("seeking", () => {
      })

      this.player.on("seeked", () => {
      })

      this.player.on("pause", () => {
        if (this.player.seeking()) return;
        this.isPlaying = false;
        if (window.YABO_SOCKET && !this.keepPlay) {
          this.onSend("STOP");
          this.$refs.bonunsProcess.playCueTime("stop");
        }
        this.keepPlay = false
      })

      this.player.on("ended", () => {
        this.$refs.bonunsProcess.playCueTime("stop");
        this.isPlaying = false;
        if (window.YABO_SOCKET)
          this.onSend("STOP");
      })

      this.player.on("play", () => {
        this.handleClickVideo();
      })

      if (!this.loginStatus) {
        this.$refs.bonunsDialog.isShow = true
        this.dialogType = 'tips';
      }
    }
  },
  methods: {
    handleCloseDialog(keepPlay) {
      this.keepPlay = keepPlay;
      if (this.breakwaitCallback) {
        this.breakwaitCallback();
      }
    },
    //   點擊進圖條任務彈窗
    handleClickProcess() {
      const bonunsProcess = this.$refs.bonunsProcess;
      const bonunsDialog = this.$refs.bonunsDialog;
      if (this.mission) {
        this.dialogType = 'tips-wait';
        bonunsDialog.isFinishMission = Number(this.mission.ActionType) === 7;
        bonunsDialog.missionDesc = this.mission.Description;
        bonunsDialog.missionActionType = this.mission.ActionType;
        bonunsDialog.isShow = true;
        this.playerPause();
      } else if (this.isFULL) {
        bonunsProcess.processType = 'wait';
        bonunsDialog.isShow = true;
        this.dialogType = 'tips-full-open';
        this.playerPause();
      }
    },
    handleClickVideo() {
      if (!this.isActiveBouns) return
      // 餘額夠可播放
      if (!this.loginStatus) {
        this.dialogType = 'tips';
        this.$refs.bonunsDialog.isShow = true
        this.playerPause();
      } else if (this.$refs.bonunsDialog.isShow) {
        this.playerPause();
        return;
      }
    },
    playerPause() {
      if (this.player && !this.player.paused()) {
        this.player.pause();

        // 取消全螢幕
        if (this.player.isFullscreen()) {
          this.player.exitFullscreen();
        }
      }
    },
    connectWS() {
      if (window.YABO_SOCKET) {
        if (this.isDebug) {
          console.log("[WS]: Video active message connected");
        }
        window.YABO_SOCKET_VIDEO_ONMESSAGE = this.onMessage;
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      } else {
        if (this.reconnectTimer) return;
        this.reconnectTimer = setTimeout(() => {
          if (this.isDebug) {
            console.log("[WS]: Video active Reconnecting...");
          }
          this.connectWS();
        }, 1000)
      }
    },
    onMessage(e) {
      if (e && e.data) {
        let data = JSON.parse(e.data);
        this.socketId = data.SocketId;
        // 彩金開關
        this.isActiveBouns = !!(data.HasActivity);
        if (!data.HasActivity) {
          return
        }

        this.reconnectTimer = null;

        if (data.Active) {
          // 轉圈進度 彈窗
          const bonunsProcess = this.$refs.bonunsProcess;
          const bonunsDialog = this.$refs.bonunsDialog;

          // 每分鐘獲得最小彩金
          // bonunsProcess.earnCoin = Number(Number(data.Active.MinAmout) * Number(data.Active.CueTimes)).toFixed(2);
          bonunsProcess.earnCoin = Number(data.Active.MinAmout);

          /* 每分鐘都顯示獲得金額 */
          // 當前累積時間(0-9)
          bonunsProcess.curMin = Number(data.CueTimes);
          //   let n = Math.floor(Math.random() * 10);

          // 目前總獲得彩金
          bonunsProcess.totalAmount = Number(data.TotalAmount);
          //   bonunsProcess.totalAmount = n * 10

          // 獲得彩金
          bonunsDialog.earnCurrentNum = parseFloat((Number(data.Active.BreakAmout) * Number(data.BreakTimes)).toFixed(2));

          // 可獲得最高彩金
          bonunsDialog.limitAmount = Number(data.Active.LimitAmout);

          // 每個中斷點獲得的彩金
          bonunsDialog.earnSingleNum = Number(data.Active.BreakAmout);

          // 可獲得中斷點數量
          bonunsDialog.earnCellNum = (Number(data.Active.LimitAmout) / Number(data.Active.BreakAmout));

          // 已獲得中斷點數量
          bonunsDialog.hadEarnNum = Number(data.BreakTimes);

          // 第一次收到初始化
          if (!bonunsProcess.isInit) {
            setTimeout(() => {
              this.$nextTick(() => {
                bonunsProcess.isInit = true;
                bonunsDialog.isInit = true;
              })
            }, 200)
          }
          //狀態
          // 'OPEN', 'PLAY', 'STOP', 'CLOSE', 'BREAK', 'FULL', 'POOR', 'BREAK_WAIT'
          this.$nextTick(() => {
            switch (data.Status) {
              case 'OPEN':
                bonunsProcess.isInit = true;
                bonunsDialog.isInit = true;
                break;
              case 'RISK':
                bonunsProcess.processType = 'done';
                break;
              case 'FULL':
                bonunsProcess.isForceWait = true;
                bonunsProcess.processType = 'wait';
                bonunsDialog.isShow = true;
                this.dialogType = 'tips-full';
                this.isFULL = true;
                this.playerPause();
                break;
              case 'POOR':
                this.dialogType = 'tips-poor';
                bonunsDialog.isShow = true;
                this.playerPause();
                break;
              case 'BREAK':
                this.dialogType = 'tips-break';
                bonunsDialog.isShow = true;
                this.playerPause();
                break;
              case 'PLAY':
                bonunsProcess.playCueTime();
                break;
              case 'STOP':
                this.$nextTick(() => bonunsProcess.playCueTime("stop"));
                break;
              case 'WAIT':
                let mission = data.Mession;
                this.mission = mission;

                if (mission) {
                  this.dialogType = 'tips-wait';
                  bonunsProcess.processType = Number(mission.ActionType) === 6 ? 'next' : 'wait';
                  bonunsDialog.tagId = mission.TagId;
                  bonunsDialog.missionDesc = mission.Description;
                  bonunsDialog.missionActionType = Number(mission.ActionType);
                  bonunsDialog.isShow = true;
                  this.$nextTick(() => bonunsDialog.getDialogHeight());
                }
                this.playerPause();
                break;
              case 'BREAK_WAIT':
                let _mission = data.Mession;
                this.mission = _mission;
                this.dialogType = 'tips-break';
                this.$nextTick(() => {
                  if (_mission) bonunsProcess.processType = Number(_mission.ActionType) === 6 ? 'next' : 'wait';
                  bonunsDialog.hadEarnNum = data.BreakTimes;
                  bonunsDialog.isShow = true;
                });
                this.playerPause();

                // 收到中斷彩金後繼續播放要處理 wait 第二次彈窗
                this.breakwaitCallback = () => {
                  this.$nextTick(() => {
                    if (_mission) {
                      this.dialogType = 'tips-wait';
                      bonunsDialog.tagId = mission.TagId;
                      bonunsDialog.missionDesc = _mission.Description;
                      bonunsDialog.missionActionType = Number(_mission.ActionType);
                      bonunsDialog.isShow = true;
                      this.$nextTick(() => bonunsDialog.getDialogHeight());
                    }
                    this.breakwaitCallback = null;
                  });
                }
                break;
              case 'CLOSE':
                this.onSend("STOP");
                break;
              default:
                break;
            }
          });
        }
      }
    },
    // "STOP" | "CLOSE" | "PLAY"
    onSend(type) {
      // 0	CONNECTING
      // 1	OPEN
      // 2	CLOSING
      // 3	CLOSED
      if (!window.YABO_SOCKET || window.YABO_SOCKET.readyState !== 1) {
        return
      }
      let data = {
        "SocketId": window.YABO_SOCKET_ID || this.socketId,
        "Type": type,
        "SendTime": new Date().toISOString(),
        "Data": {
          "web-platform": getCookie('platform') || 'web'
        }
      }
      if (this.isDebug) {
        console.log("[WS]: onSend:", data)
      }
      window.YABO_SOCKET.send(JSON.stringify(data));
    },
  },
  created() {
    const self = this;
    const listner = function () {
      let isHiddenWindow = document.hidden;
      if (self.player) {
        //離開視窗強制暫停影片
        if (!self.player.paused()) {
          self.player.pause();
        }
        // if (isHiddenWindow) {
        //   self.onSend("CLOSE");
        // }
      }
    }
    document.addEventListener('visibilitychange', listner, false);
  },
  beforeDestroy() {
    this.onSend("STOP");
    document.removeEventListener('visibilitychange', () => { }, false);
    window.YABO_SOCKET_VIDEO_ONMESSAGE = null;
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.player.dispose();
    this.player = null;
  }
};
</script>
<style lang="scss" module>
.video-player-wrap {
  position: relative;
}

:global {
  .video-js * {
    outline: none !important;
    box-shadow: none !important;
  }
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
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2147483647;
}
</style>
