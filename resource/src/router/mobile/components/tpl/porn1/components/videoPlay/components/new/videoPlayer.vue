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
import { ACTIVES_BOUNS_WEBSOCKET } from '@/api/bbos/config'
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
      isActiveBouns: true,
      isShowBounsDialog: false,
      isShowBounsProcess: true,
      dialogType: "tips",// 提示 & 賺得彩金
      socket: null,
      socketId: ""
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
      controls: true,
      controlBar: true,
      loop: false,
      preload: 'auto',
      bigPlayButton: true,
    });
    this.player.on("playing", () => {
      if (this.socket)
        this.onSend("play");
    })

    this.player.on("pause", () => {
      if (this.socket)
        this.onSend("stop");
    })

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
        // 取不到cid 先固定
        var uri = ACTIVES_BOUNS_WEBSOCKET + "?cid=9df6ea538e348fb738e0ace7008beafe8c8ae77c";
        this.socket = new WebSocket(uri);
        this.socket.onmessage = this.onMessage;
        this.socket.onopen = this.onOpen;
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;

        // ErrorCode: null
        // ErrorMessage: null
        // SocketId: "0eca0564-2229-48a7-9a3f-4e10c24e5982"
        // Cid: "28c0566e56a402f084e3dc508df40023c7beef12"
        // UserName: "mobjames"
        // ConnectionTime: 0
        // ActiveTime: 0
        // Amount: 0
        // TotalAmount: 0
        // CueTimes: 0
        // BreakTimes: 0
        // Status: "OPEN"
        // Active:
        //     Id: 1
        //     Name: "test active"
        //     OPcode: 5015
        //     StartTime: "2020-04-20T00:00:00"
        //     EndTime: "2020-05-01T00:00:00"
        //     Enable: true
        //     Type: "A"
        //     MinAmout: 0.05
        //     LimitAmout: 0.1
        //     BreakAmout: 5
        //     CueTimes: 10
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
    handleClickVideoBlock(e) {
      // 餘額夠可播放
      if (!this.loginStatus) {
        this.isShowBounsDialog = true;
      } else {
        if (this.player.playing) {
          this.player.pause();
        } else {
          this.player.play();
        }
      }
    },
    onMessage(e) {
      if (e.data) {
        let data = JSON.parse(e.data)
        console.log(data)

        if (data.Active) {
          this.$refs.bonunsProcess.earnCoin = data.Active.MinAmout;
          this.$refs.bonunsProcess.curMin = data.Active.CueTimes;
        }
        this.socketId = data.SocketId;
      }
    },
    onOpen(e) {
      console.log(e)
    },
    onClose(e) {
      console.log(e)
    },
    onError(e) {
      console.log(e)
      this.isActiveBouns = false;
      this.socket = null;
    },
    onSend(type) {
      if (!this.socket) {
        return
      }
      let data = {
        "SocketId": this.socketId,
        "Type": type | "stop" | "close" | "play",
        "SendTime": new Date,
        "Data": {}
      }
      this.socket.send(JSON.stringify(data))
    }
  },
  beforeDestroy() {
    this.player.dispose();

    this.socket.send({
      "SocketId": this.socketId,
      "Type": "close",
      "SendTime": new Date,
      "Data": {}
    })
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
