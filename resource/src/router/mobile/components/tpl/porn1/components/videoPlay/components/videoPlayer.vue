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
      socket: null,
      socketId: "",
      mission: null,
      keepPlay: false, // wait 任務未達成繼續觀看不發送play
      breakwaitCallback: () => { }
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
  beforeDestroy() {
    window.removeEventListener('resize', this.getVideoHeight);
  },
  mounted() {
    //  暫時手動轉換https
    if (!this.videoInfo.url) return;
    this.player = videojs(this.$refs['video-player'], {
      sources: [{ src: this.videoInfo.url.replace('http://', 'https://'), type: 'application/x-mpegURL' }],
      autoplay: false,
      controls: true,
      controlBar: true,
      loop: false,
      preload: 'auto',
      bigPlayButton: true,
    });

    // 彩金疊加在播放器上
    let videoDom = document.getElementById("video-play");
    videoDom.insertBefore(document.getElementById("video-play-block"), videoDom.childNodes[0]);

    //活動開關
    if (this.isActiveBouns) {
      // connect websocket
      this.connectWS();

      this.player.on("playing", () => {
        this.isPlaying = true;
        if (this.socket && !this.keepPlay) {
          this.onSend("PLAY");
        }
        this.keepPlay = false
      })

      this.player.on("pause", () => {
        this.isPlaying = false;
        if (this.socket && !this.keepPlay) {
          this.onSend("STOP");
        }
        this.keepPlay = false
      })

      this.player.on("ended", () => {
        this.$refs.bonunsProcess.playCueTime("pause");
        this.isPlaying = false;
        if (this.socket)
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
    handleCloseDialog() {
      this.keepPlay = true;
      if (this.breakwaitCallback) {
        this.breakwaitCallback();
      }
    },
    //   點擊進圖條任務彈窗
    handleClickProcess() {
      if (this.mission) {
        this.dialogType = `tips-wait`;
        this.$refs.bonunsDialog.missionDesc = this.mission.Description;
        this.$refs.bonunsDialog.missionActionType = this.mission.ActionType;
        this.$refs.bonunsDialog.isShow = true;
        if (!this.player.paused()) {
          this.player.pause();
          if (this.player.isFullscreen()) {
            this.player.exitFullscreen();
          }
        }
      }
    },
    handleClickVideo() {
      if (!this.isActiveBouns) return
      // 餘額夠可播放
      if (!this.loginStatus) {
        this.$refs.bonunsDialog.isShow = true
        this.dialogType = 'tips';
        if (this.player && !this.player.paused()) {
          this.player.pause();
        }

      } else if (this.$refs.bonunsDialog.isShow) {
        if (!this.player.paused()) {
          this.player.pause();
        }
        return;
      }
    },
    connectWS() {
      try {
        let cid = getCookie('cid') || '';
        let uri = this.siteConfig.ACTIVES_BOUNS_WEBSOCKET + `?cid=${cid}&domain=${this.memInfo.user.domain}`;
        this.socket = new WebSocket(uri);
        this.socket.onmessage = this.onMessage;
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
        this.socket.onopen = this.onOpen;
      } catch (e) {
        console.log("[WS]: connectWS Error:", e);
      }
    },
    onMessage(e) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;

      if (this.isDebug) {
        console.log("[WS]: onMessage:", JSON.parse(e.data));
      }

      if (e.data) {
        let data = JSON.parse(e.data);
        this.socketId = data.SocketId;
        // 彩金開關
        this.isActiveBouns = !!(data.HasActivity);
        if (!data.HasActivity) {
          return
        }

        this.reconnectTimer = null;

        if (data.Active) {
          //狀態
          // 'OPEN', 'PLAY', 'STOP', 'CLOSE', 'BREAK', 'FULL', 'POOR', 'BREAK_WAIT'
          switch (data.Status) {
            case 'RISK':
              this.$refs.bonunsProcess.processType = 'done';
              return;
            case 'FULL':
              this.$refs.bonunsProcess.processType = 'done';
              this.$refs.bonunsDialog.isShow = true;
              this.dialogType = `tips-${data.Status.toLowerCase()}`;
              if (!this.player.paused()) {
                this.player.pause();
              }
              break;
            case 'POOR':
              this.dialogType = `tips-${data.Status.toLowerCase()}`;
              this.$refs.bonunsDialog.isShow = true;
              break;
            case 'BREAK':
              this.dialogType = `tips-${data.Status.toLowerCase()}`;
              this.$refs.bonunsDialog.isShow = true;
              this.$refs.bonunsDialog.hadEarnNum = data.BreakTimes;
              if (!this.player.paused()) {
                this.player.pause();
                if (this.player.isFullscreen()) {
                  this.player.exitFullscreen();
                }
              }
              break;
            case 'PLAY':
              this.$refs.bonunsProcess.playCueTime();
              break;
            case 'STOP':
              this.$refs.bonunsProcess.playCueTime("pause");
              return;
            case 'WAIT':
              let mission = data.Mession;
              if (mission) {
                this.dialogType = `tips-wait`;
                this.$refs.bonunsProcess.processType = 'wait';
                //任務類型
                this.$refs.bonunsDialog.missionDesc = mission.Description;
                //任務動作
                this.$refs.bonunsDialog.missionActionType = mission.ActionType;
                this.$refs.bonunsDialog.isShow = true;
                this.$nextTick(() => this.$refs.bonunsDialog.getDialogHeight());
              }
              // 暫存任務內容
              this.mission = mission;
              if (!this.player.paused()) {
                this.player.pause();
                if (this.player.isFullscreen()) {
                  this.player.exitFullscreen();
                }
              }
              break;
            case 'BREAK_WAIT':
              this.dialogType = `tips-break`;
              this.$nextTick(() => {
                this.$refs.bonunsProcess.processType = 'wait';
                this.$refs.bonunsDialog.hadEarnNum = data.BreakTimes;
                this.$refs.bonunsDialog.isShow = true;
              });
              if (!this.player.paused()) {
                this.player.pause();
                if (this.player.isFullscreen()) {
                  this.player.exitFullscreen();
                }
              }

              // break wait 收到中斷彩金後繼續播放要處理 wait 第二次彈窗
              this.breakwaitCallback = () => {
                this.$nextTick(() => {
                  let mission = data.Mession;
                  //   mission =
                  //     { "Id": 2, "Name": "2\u7D1A\u5145\u503C", "Level": 2, "Amount": 18, "TagId": 132, "TagName": "2\u7D1A\u5145\u503C", "CreateDate": "05/20/2020 10:39:00", "Domain": 500015, "ActionType": 1, "Description": "\u89C2\u5F71\u9001\u94B1\u6EE1 18\u5143 \u4EFB\u52A1 <br/> \u8BF7\u5145\u503C\u2F00\u6B21", "Times": 1, "Unit": "\u6B21", "Factor": 0 }

                  if (mission) {
                    this.dialogType = `tips-wait`;
                    //任務類型
                    this.$refs.bonunsDialog.missionDesc = mission.Description;
                    //任務動作
                    this.$refs.bonunsDialog.missionActionType = mission.ActionType;
                    this.$refs.bonunsDialog.isShow = true;
                    this.$nextTick(() => this.$refs.bonunsDialog.getDialogHeight());
                  }
                  // 暫存任務內容
                  this.mission = mission;
                  this.breakwaitCallback = () => { };
                });
              }
              break;
            case 'CLOSE':
              return;
            case 'NEXT':
              this.$refs.bonunsProcess.processType = 'next';
              return;
            default:
              break;
          }

          //每次累積彩金
          // this.$refs.bonunsProcess.earnCoin = Number(Number(data.Active.MinAmout) * Number(data.Active.CueTimes)).toFixed(2);
          this.$refs.bonunsProcess.earnCoin = Number(data.Active.MinAmout).toFixed(2);

          // 0504 - 調整成每分鐘都顯示獲得金額
          //當前累積時間(0)
          this.$refs.bonunsProcess.curMin = data.CueTimes;

          // 當總金額不等於0跟計時等於0時 顯示右上角獲得金額
          // if (data.Amount != 0 && Number(data.CueTimes) % Number(data.Active.CueTimes) === 0) {
          //   this.$refs.bonunsProcess.showEarn(data.Amount);
          // }

          //獲得彩金
          this.$refs.bonunsDialog.earnCurrentNum = Number(Number(data.Active.BreakAmout) * Number(data.BreakTimes)).toFixed(2);

          //每次獲得彩金
          this.$refs.bonunsDialog.earnSingleNum = Number(data.Active.BreakAmout).toFixed(2);

          //已經獲得彩金數
          this.$refs.bonunsDialog.hadEarnNum = data.BreakTimes;

          //可獲得最高彩金
          this.$refs.bonunsDialog.limitAmount = Number(data.Active.LimitAmout).toFixed(2);

          //可獲得彩金數
          this.$refs.bonunsDialog.earnCellNum = (Number(data.Active.LimitAmout) / Number(data.Active.BreakAmout));
        }
      }
    },
    onOpen(e) {
      if (this.isDebug) {
        console.log("[WS]: onOpen:", e)
        console.log("[Video-url]:", this.videoInfo.url)
      }
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;

      if (!this.player.paused()) {
        if (this.socket && !this.keepPlay) {
          this.onSend("PLAY");
        }
      }

      // 測試log
      //   let data = {
      //     "SocketId": this.socketId,
      //     "Type": "WEB-OPEN",
      //     "SendTime": new Date().toISOString(),
      //     "Data": {
      //       "platform": getCookie('platform') || "normal",
      //       "videoid": this.videoInfo.id,
      //       "url": this.videoInfo.url,
      //     }
      //   };

      //   this.socket.send(JSON.stringify(data));
    },
    onClose(e) {
      if (this.isDebug) {
        console.log("[WS]: onClose:", e)
        console.log("[Video-url]:", this.videoInfo.url)
      }
      this.reconnect();
    },
    reconnect() {
      if (this.reconnectTimer) return;
      this.reconnectTimer = setTimeout(() => {
        if (this.isDebug) {
          console.log("[WS]: Reconnecting:");
          console.log(this.socket);

        }
        this.connectWS();
      }, 2500)
    },
    onError(e) {
      console.log("[WS]: onError:", e)
      this.reconnect();
    },
    // "STOP" | "CLOSE" | "PLAY"
    onSend(type) {
      if (!this.socket || this.socket.readyState === 3 || (this.$refs.bonunsProcess && this.$refs.bonunsProcess.processType === 'done')) {
        return
      }
      let data = {
        "SocketId": this.socketId,
        "Type": type,
        "SendTime": new Date().toISOString(),
        "Data": {
          "platform": getCookie('platform') || "normal"
        }
      }
      if (this.isDebug) {
        console.log("[WS]: onSend:", data)
      }
      this.socket.send(JSON.stringify(data));
    },
  },
  beforeDestroy() {
    this.player.dispose();
    this.player = null;
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

:global {
  .video-js {
    button {
      outline: 0;
    }
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
