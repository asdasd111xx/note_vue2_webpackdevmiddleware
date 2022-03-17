<template>
  <div
    :class="$style['video-player-wrap']"
    :style="!isInit ? { 'pointer-events': 'none' } : {}"
  >
    <video
      x5-video-player-type="h5-page"
      id="video-play"
      ref="video-player"
      playsinline="playsinline"
      :webkit-playsinline="playsinline"
      type="application/x-mpegURL"
      class="video-js vjs-default-skin vjs-fluid vjs-big-play-centered"
    ></video>
    <!-- 彩金活動 -->
    <div id="video-play-block" :class="$style['video-block']">
      <bonuns-dialog
        ref="bonunsDialog"
        :type="dialogType"
        :videoid="videoInfo.id"
        :is-unlogin-mode="isUnloginMode"
        @close="handleCloseDialog"
      />
      <bonuns-process
        v-show="isActiveBouns"
        ref="bonunsProcess"
        :type="dialogType"
        :is-unlogin-mode="isUnloginMode"
        @click="handleClickProcess"
      />
    </div>
    <ad-dialog
      v-if="isAdDialog && ['porn1', 'sg1'].includes(routerTPL)"
      ref="adDialog"
      :adData="adShowData"
      @close="handleCloseAdDialog"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import videojs from "video.js";
import adDialog from "../bouns/compontents/adDialog";
import bonunsDialog from "../bouns/compontents/bonunsDialog";
import bonunsProcess from "../bouns/compontents/bonunsProcess";
import goLangApiRequest from "@/api/goLangApiRequest";
import { getCookie } from "@/lib/cookie";

export default {
  components: { adDialog, bonunsDialog, bonunsProcess },
  props: {
    videoInfo: {
      type: Object,
      required: true
    },
    source: {
      type: String
    }
  },
  data() {
    return {
      player: null,
      firstPlay: false,
      //   彩金開關
      isActiveBouns: true, //預設打開由message決定是否啟動
      dialogType: "tips", // 提示 & 賺得彩金
      reconnectTimer: null, //重新連線timer
      checkTimer: null, // 檢查連線狀態timer
      isFULL: false,
      socket: null,
      socketId: "",
      mission: null,
      keepPlay: false, // wait 任務未達成繼續觀看不發送play
      isUnloginMode: false,
      breakwaitCallback: () => {},
      isInit: false,
      disableVideo: false, //未登入不得觀看
      adSwitch: true, //廣告開關
      adFirstShow: true, //進入首次播放跳廣告
      adShowData: null,
      isAdDialog: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      yaboConfig: "getYaboConfig"
    }),
    playsinline() {
      return "true";
    },
    isDebug() {
      return (
        process.env.NODE_ENV === "development" ||
        (this.$route.query && this.$route.query.testmode)
      );
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  mounted() {
    if (!this.videoInfo.url) return;
    let obj = {
      sources: [
        {
          src: this.videoInfo.url
        }
      ],
      autoplay: false,
      controls: true,
      controlBar: true,
      loop: false,
      preload: "auto",
      bigPlayButton: true,
      html5: {
        hls: {
          // withCredentials: true,
          cacheEncryptionKeys: true
        }
      },
      controlBar: {
        pictureInPictureToggle: false
      },
      crossOrigin: "anonymous"
    };

    this.player = videojs(this.$refs["video-player"], obj);

    if (!this.checkTPL()) {
      this.player.on("play", () => {
        if (this.disableVideo) {
          this.handleDisableVideoMode();
          return;
        }
      });
      return;
    }

    this.connectMessage();

    // 彩金疊加在播放器上
    let videoDom = document.getElementById("video-play");
    videoDom.insertBefore(
      document.getElementById("video-play-block"),
      videoDom.childNodes[0]
    );

    window.YABO_SOCKET_VIDEO_DISCONNECT = this.onDisconnect;
    window.YABO_SOCKET_VIDEO_CONNECT = () => {
      this.connectMessage(true);
    };
    this.initPlayerEvent();
  },
  methods: {
    ...mapActions(["actionSetYaboConfig", "actionSetVideoBounsPageStatus"]),
    handleCloseDialog(keepPlay) {
      this.keepPlay = keepPlay;
      if (this.breakwaitCallback) {
        this.breakwaitCallback();
      }
    },
    handleCloseAdDialog() {
      this.isAdDialog = false;
    },
    initPlayerEvent() {
      //活動開關
      if (this.isActiveBouns) {
        this.player.on("playing", () => {
          if (!this.firstPlay) {
            this.firstPlay = true;
            if (this.adSwitch) {
              this.playerPause();
              // console.log("播放first AD");
              this.onSend("AD");
              return;
            }
          }
          // 不得訪客觀影
          if (this.disableVideo) {
            this.handleDisableVideoMode();
            return;
          }
          if (this.player.seeking()) {
            return;
          }
          if (
            !this.isInit ||
            this.dialogType === "tips-wait" ||
            this.isFULL ||
            !this.isActiveBouns
          ) {
            if (this.adSwitch) {
              this.onSend("ADSTART");
            }
            return;
          }

          // 任務彈窗關閉後繼續播放
          if (window.YABO_SOCKET && !this.keepPlay) {
            this.onSend("PLAY");
            // console.log("播放");
          }
          this.keepPlay = false;

          if (this.isUnloginMode) {
            this.unloginModeAction("play");
          }
        });

        // 快轉
        this.player.on("seeking", () => {});
      } else {
        this.player.on("playing", () => {
          if (this.disableVideo) {
            this.handleDisableVideoMode();
            return;
          }
        });
      }

      // 快轉
      this.player.on("seeking", () => {});

      this.player.on("seeked", () => {});

      this.player.on("pause", () => {
        // console.log("暫停");
        if (this.disableVideo) {
          this.handleDisableVideoMode();
          return;
        }

        if (this.player.seeking()) return;
        if (
          window.YABO_SOCKET &&
          this.adSwitch &&
          (this.dialogType === "tips-wait" || this.isFULL || this.keepPlay)
        ) {
          this.onSend("ADSTOP");
        } else if (window.YABO_SOCKET && !this.keepPlay) {
          this.onSend("STOP");
        }
        this.keepPlay = false;

        if (this.isUnloginMode) {
          this.unloginModeAction("pause");
        }
      });

      this.player.on("ended", () => {
        this.$refs.bonunsProcess.playCueTime("stop");
        if (window.YABO_SOCKET) {
          this.onSend(
            this.adSwitch && (this.dialogType === "tips-wait" || this.isFULL)
              ? "ADSTOP"
              : "STOP"
          );
        }
      });

      this.player.on("play", () => {
        this.handleClickVideo();
        // console.log("播放?");
      });
    },
    // 點擊進圖條任務彈窗
    handleClickProcess() {
      console.log("click");
      if (
        window.YABO_SOCKET.readyState !== 1 ||
        !this.isInit ||
        !this.firstPlay
      ) {
        return;
      }

      if (this.isUnloginMode && !this.mission) {
        this.$refs.bonunsDialog.isShow = true;
        this.dialogType = "tips";
        this.playerPause();
        return;
      }

      const bonunsProcess = this.$refs.bonunsProcess;
      const bonunsDialog = this.$refs.bonunsDialog;
      if (this.mission) {
        this.dialogType = "tips-wait";
        bonunsDialog.isFinishMission = Number(this.mission.ActionType) === 6;
        bonunsDialog.missionDesc = this.mission.Description;
        bonunsDialog.missionActionType = this.mission.ActionType;
        bonunsDialog.isShow = true;
        this.playerPause();
      } else if (this.isFULL) {
        bonunsProcess.processType = "wait";
        bonunsDialog.isShow = true;
        this.dialogType = "tips-full-open";
        this.playerPause();
      }
    },
    handleDisableVideoMode(s) {
      if (this.disableVideo) {
        this.playerPause();
        this.dialogType = "disable";
        this.$refs.bonunsDialog.isShow = true;
      }
    },
    handleClickVideo() {
      if (!this.isActiveBouns || this.disableVideo) return;
      // 餘額夠可播放
      // if (!this.loginStatus && !this.isUnloginMode) {
      //   this.dialogType = "tips";
      //   this.$refs.bonunsDialog.isShow = true;
      //   this.playerPause();
      // } else
      if (this.$refs.bonunsDialog.isShow) {
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
    // 連接websocket message
    connectMessage(fromReconnect) {
      // if (!this.loginStatus) {
      //   if (!this.isUnloginMode) {
      //     const bonunsProcess = this.$refs.bonunsProcess;
      //     const bonunsDialog = this.$refs.bonunsDialog;
      //     bonunsProcess.processType = "process";
      //   }
      //   return;
      // }
      if (!this.checkTPL()) {
        return;
      }

      if (window.YABO_SOCKET && window.YABO_SOCKET.readyState === 1) {
        if (this.isDebug) {
          console.log("[WS]: Video active message connected SUCCESS");
        }

        window.YABO_SOCKET_VIDEO_ONMESSAGE = this.onMessage;
        const bonunsProcess = this.$refs.bonunsProcess;
        const bonunsDialog = this.$refs.bonunsDialog;
        bonunsProcess.processType = "process";

        if (window.YABO_SOCKET_RECONECT_STATUS) {
          bonunsProcess.isInit = false;
          if (this.player) {
            this.player.off("playing");
            this.player.off("play");
            this.player.off("pause");
            this.playerPause();
          }
          setTimeout(() => {
            this.initPlayerEvent();
          }, 300);
        }
      } else {
        this.setReconnect();
      }
    },
    onDisconnect(e) {
      if (this.isDebug) {
        console.log("[WS]: Video active loading...");
      }

      const bonunsProcess = this.$refs.bonunsProcess;
      bonunsProcess.processType = "loading";
      this.isActiveBouns = false;
    },
    checkTPL() {
      if (!["porn1", "sg1", "aobo1"].includes(this.siteConfig.ROUTER_TPL)) {
        this.isInit = true;
        this.isActiveBouns = false;
        if (!this.loginStatus) {
          this.disableVideo = true;
        }

        return false;
      }
      //澳博支援未登入觀影 但不顯示彩金icon fb528918
      if (["aobo1"].includes(this.siteConfig.ROUTER_TPL)) {
        this.isActiveBouns = false;
      }
      return true;
    },
    onMessage(e) {
      if (e && e.data) {
        let data = JSON.parse(e.data);
        this.socketId = data.SocketId;

        // 彩金開關
        // 預設連線中
        this.isActiveBouns = !!data.HasActivity;
        if (!data.HasActivity && !this.adSwitch) {
          clearTimeout(this.checkTimer);
          return;
        }

        this.reconnectTimer = null;

        if (data.Active) {
          // 轉圈進度 彈窗
          const bonunsProcess = this.$refs.bonunsProcess;
          const bonunsDialog = this.$refs.bonunsDialog;

          // 每分鐘獲得最小彩金
          // bonunsProcess.earnCoin = Number(Number(data.Active.MinAmout) * Number(data.Active.CueTimes)).toFixed(2);
          bonunsProcess.earnCoin = Number(data.Active.MinAmout).toFixed(2);

          /* 每分鐘都顯示獲得金額 */
          // 當前累積時間(0-9)
          bonunsProcess.curMin = Number(data.CueTimes);
          //   let n = Math.floor(Math.random() * 10);

          // 目前總獲得彩金
          bonunsProcess.totalAmount = Number(data.TotalAmount).toFixed(2);
          //   bonunsProcess.totalAmount = n * 10

          // 獲得彩金
          bonunsDialog.earnCurrentNum = parseFloat(
            Number(data.Active.BreakAmout) * Number(data.BreakTimes)
          ).toFixed(2);

          // 可獲得最高彩金
          bonunsDialog.limitAmount = parseFloat(
            Number(data.Active.LimitAmout)
          ).toFixed(2);

          // 每個中斷點獲得的彩金
          bonunsDialog.earnSingleNum = parseFloat(
            Number(data.Active.BreakAmout)
          ).toFixed(2);

          // 可獲得中斷點數量
          bonunsDialog.earnCellNum = Math.floor(
            Number(data.Active.LimitAmout) / Number(data.Active.BreakAmout)
          );

          // 已獲得中斷點數量
          bonunsDialog.hadEarnNum = Number(data.BreakTimes);

          // 第一次收到初始化
          if (!bonunsProcess.isInit) {
            setTimeout(() => {
              this.$nextTick(() => {
                bonunsProcess.isInit = true;
                bonunsDialog.isInit = true;
              });
            }, 200);
          }
          //狀態
          // 'OPEN', 'PLAY', 'STOP', 'CLOSE', 'BREAK', 'FULL', 'POOR', 'BREAK_WAIT'
          this.$nextTick(() => {
            let mission = data.Mession;

            switch (data.Status) {
              case "OPEN":
                bonunsProcess.isInit = true;
                bonunsDialog.isInit = true;
                bonunsProcess.playCueTime("stop");
                break;
              case "RISK":
                bonunsProcess.processType = "done";
                break;
              case "FULL":
                this.mission = mission;
                bonunsProcess.isForceWait = true;
                bonunsProcess.processType = "wait";
                if (this.mission) {
                  bonunsDialog.isFinishMission =
                    Number(this.mission.ActionType) === 6;
                }
                this.isFULL = true;
                if (data.FullMode === 1) {
                  this.$nextTick(() => bonunsProcess.playCueTime("stop"));
                  if (this.adSwitch) {
                    this.onSend("ADSTART");
                  }
                }
                // bonunsDialog.isShow = true;
                // this.dialogType = 'tips-full';
                // this.playerPause();
                break;
              case "POOR":
                this.dialogType = "tips-poor";
                bonunsDialog.isShow = true;
                this.playerPause();
                break;
              case "BREAK":
                this.dialogType = "tips-break";
                bonunsDialog.isShow = true;
                this.playerPause();
                break;
              case "PLAY":
                bonunsProcess.playCueTime();
                this.setCheckTimer();
                break;
              case "STOP":
                this.$nextTick(() => bonunsProcess.playCueTime("stop"));
                break;
              case "WAIT":
                this.mission = mission;
                bonunsProcess.isForceWait = true;

                if (mission) {
                  this.dialogType = "tips-wait";
                  bonunsProcess.processType =
                    Number(mission.ActionType) === 6 ? "next" : "wait";
                  bonunsDialog.isFinishMission =
                    Number(this.mission.ActionType) === 6;
                  bonunsDialog.tagId = mission.TagId;
                  bonunsDialog.missionDesc = mission.Description;
                  bonunsDialog.missionActionType = Number(mission.ActionType);
                  bonunsDialog.isShow = true;
                  this.$nextTick(() => bonunsDialog.getDialogHeight());
                }
                this.playerPause();
                break;
              case "BREAK_WAIT":
                let _mission = data.Mession;
                this.mission = _mission;
                bonunsProcess.isForceWait = true;
                this.dialogType = "tips-break";
                this.$nextTick(() => {
                  if (_mission)
                    bonunsProcess.processType =
                      Number(_mission.ActionType) === 6 ? "next" : "wait";
                  bonunsDialog.hadEarnNum = data.BreakTimes;
                  bonunsDialog.isShow = true;
                });
                this.playerPause();

                // 收到中斷彩金後繼續播放要處理 wait 第二次彈窗
                this.breakwaitCallback = () => {
                  this.$nextTick(() => {
                    if (_mission) {
                      this.dialogType = "tips-wait";
                      bonunsDialog.tagId = mission.TagId;
                      bonunsDialog.missionDesc = _mission.Description;
                      bonunsDialog.missionActionType = Number(
                        _mission.ActionType
                      );
                      bonunsDialog.isShow = true;
                      this.$nextTick(() => bonunsDialog.getDialogHeight());
                    }
                    this.breakwaitCallback = null;
                  });
                };
                break;
              case "CLOSE":
                this.onSend(
                  this.adSwitch &&
                    (this.dialogType === "tips-wait" || this.isFULL)
                    ? "ADSTOP"
                    : "STOP"
                );
                break;
              case "AD":
                // this.onSend("AD");
                // console.log(data);
                this.adShowData = data.Ad;
                this.isAdDialog = true;
                this.playerPause();
                break;
              case "ADSTART":
                this.keepPlay = true;
                break;
              case "ADSTOP":
                break;
              case "NOACTIVE":
                window.YABO_SOCKET_VIDEO_ONMESSAGE = null;
                window.YABO_SOCKET_VIDEO_DISCONNECT = null;
                window.YABO_SOCKET_VIDEO_CONNECT = null;
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
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
      if (
        !window.YABO_SOCKET ||
        window.YABO_SOCKET.readyState !== 1 ||
        this.disableVideo
      ) {
        return;
      }
      // 檢查連線狀態
      if (type === "PLAY") {
        this.setCheckTimer();
      } else {
        clearInterval(this.checkTimer);
        this.checkTimer = null;
      }

      let data = {
        SocketId: window.YABO_SOCKET_ID || this.socketId,
        Type: type,
        SendTime: new Date().toISOString(),
        Data: {
          "web-platform": getCookie("platform")
        }
      };
      if (this.isDebug) {
        console.log("[WS]: onSend:", data);
      }
      window.YABO_SOCKET.send(JSON.stringify(data));
    },
    unloginModeAction(type) {
      const bonunsProcess = this.$refs.bonunsProcess;
      const bonunsDialog = this.$refs.bonunsDialog;
      if (!bonunsProcess || !bonunsDialog) return;

      switch (type) {
        case "play":
          bonunsProcess.playCueTime();
          break;
        case "pause":
          bonunsProcess.playCueTime("stop");
          break;
      }
    },
    handleLeavePage(cb) {
      this.onSend(
        this.adSwitch && (this.dialogType === "tips-wait" || this.isFULL)
          ? "ADSTOP"
          : "STOP"
      );
      document.removeEventListener("visibilitychange", () => {}, false);
      window.YABO_SOCKET_VIDEO_ONMESSAGE = null;
      window.YABO_SOCKET_VIDEO_DISCONNECT = null;
      window.YABO_SOCKET_VIDEO_CONNECT = null;
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
      if (this.player && this.player.dispose) {
        this.player.dispose();
        this.player = null;
      }
      if (cb) {
        cb();
      }
    },
    setReconnect() {
      bonunsProcess.processType = "loading";
      if (this.isDebug) {
        console.log("[WS]: Video active Reconnecting...");
      }
      window.YABO_SOCKET_RECONNECT();
    },
    // 檢查連線狀態
    setCheckTimer() {
      clearTimeout(this.checkTimer);
      this.checkTimer = null;
      this.checkTimer = setTimeout(() => {
        if (this.isDebug) {
          console.log(`[WS]: State: Check fail.`);
        }
        this.setReconnect();
        clearTimeout(this.checkTimer);
        this.checkTimer = null;
      }, 15000);
    }
  },
  created() {
    this.actionSetVideoBounsPageStatus(true);

    if (!this.checkTPL()) {
      return;
    }

    this.actionSetYaboConfig().then(() => {
      if (this.yaboConfig) {
        setTimeout(() => {
          this.isInit = true;
        }, 400);

        let noLoginVideoSwitch = this.yaboConfig.find(
          i => i.name === "NoLoginVideoSwitch"
        ).value;

        if (noLoginVideoSwitch === "false" && !this.loginStatus) {
          this.disableVideo = true;
          return;
        }

        // 訪客模式/一般模式
        this.isUnloginMode = noLoginVideoSwitch === "false";
        if (this.isActiveBouns) {
          this.$refs.bonunsProcess.processType = "process";
        }

        // this.$nextTick(() => {
        //   if (!this.loginStatus && !this.isUnloginMode) {
        //     this.$refs.bonunsDialog.isShow = true;
        //     this.dialogType = "tips";
        //   }
        // });
      }
    });

    //取得廣告開啟開關
    goLangApiRequest({
      method: "get",
      url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/System/config/ad`
    }).then(res => {
      if (res.data && res.status === "000") {
        let openSwitch = res.data.find(data => {
          return data.name === "switch";
        });
        this.adSwitch = openSwitch ? openSwitch.value === "1" : false;
      }
    });

    const self = this;
    const listner = function() {
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
    };
    document.addEventListener("visibilitychange", listner, false);
  },
  beforeDestroy() {
    this.onSend(
      this.adSwitch && (this.dialogType === "tips-wait" || this.isFULL)
        ? "ADSTOP"
        : "STOP"
    );
    document.removeEventListener("visibilitychange", () => {}, false);
    window.YABO_SOCKET_VIDEO_ONMESSAGE = null;
    window.YABO_SOCKET_VIDEO_DISCONNECT = null;
    window.YABO_SOCKET_VIDEO_CONNECT = null;
    clearTimeout(this.checkTimer);
    this.checkTimer = null;
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    if (this.player && this.player.dispose) {
      this.player.dispose();
    }
    this.player = null;
    this.actionSetVideoBounsPageStatus(false);
  }
};
</script>
<style lang="scss" module>
.video-player-wrap {
  position: relative;
  min-height: 200px;
}

:global {
  .video-js * {
    outline: none !important;
    box-shadow: none !important;
  }

  .vjs-picture-in-picture-control {
    display: none !important;
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
