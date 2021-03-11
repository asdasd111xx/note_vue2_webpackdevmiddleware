<template>
  <div
    :class="
      isClose
        ? [$style['bouns-process-wrap'], $style['dialog-close']]
        : $style['bouns-process-wrap']
    "
    @click="$emit('click')"
  >
    <div
      :class="[
        $style['bouns-process'],
        { [$style['active']]: processType === 'earn' },
        { [$style['loading']]: processType === 'loading' }
      ]"
    >
      <div
        :class="[$style['coin-wrap'], { [$style['active']]: playingCueTime }]"
      >
        <div :class="$style['icon']">
          <img
            :src="
              $getCdnPath(`/static/image/_new/actives/bouns/${curCoinSrc}.png`)
            "
          />
        </div>

        <!-- 連接中/斷線 -->
        <template v-if="processType === 'loading'">
          <span :class="$style['loading-text']">连线中...</span>
        </template>

        <!-- 動畫進行中 -->
        <template v-else-if="playingCueTime && processType !== 'earn'">
          <div class="circle_container">
            <div :class="`circle_loader ${isPause ? 'pause' : ''}`">
              <div id="halfclip">
                <div class="halfcircle" id="clipped"></div>
              </div>
              <div class="halfcircle" id="fixed"></div>
            </div>
          </div>
          <span>{{ curMin }}</span>
        </template>

        <!-- 一般顯示 -->
        <template v-else>
          <span v-if="processType === 'earn'" :class="$style['earn']">
            {{ `+${earnCoin} ` }}元</span
          >
          <span v-else-if="processType === 'process'">{{ curMin }}</span>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isUnloginMode: {
      type: Boolean
    }
  },
  data() {
    return {
      curCoinSrc: "coin_disconnected",
      processType: "loading", // 累加,達標,已完成
      coinType: [
        { key: "done", src: "coin_g" },
        { key: "process", src: "coin_bg" },
        { key: "earn", src: "coin_y" },
        { key: "next", src: "coin_next" },
        { key: "wait", src: "coin_open" },
        { key: "loading", src: "coin_disconnected" }
      ],
      isClose: false,
      isInit: false,
      totalAmount: 0,
      earnCoin: "",
      curMin: 0,
      timer: null,
      playingCueTime: null,
      isPause: false
    };
  },
  watch: {
    // 總獲得彩金量變化 或 時間變化時 時需顯示動畫
    totalAmount(newValue, oldValue) {
      if (
        Number(newValue) !== Number(oldValue) &&
        this.isInit &&
        !window.YABO_SOCKET_RECONECT_STATUS
      ) {
        this.handleToggleEarnCoin();
      }
      window.YABO_SOCKET_RECONECT_STATUS = undefined;
    },
    curMin(newValue, oldValue) {
      if (
        Number(newValue) !== Number(oldValue) &&
        this.isInit &&
        !window.YABO_SOCKET_RECONECT_STATUS
      ) {
        this.handleToggleEarnCoin();
      }
      window.YABO_SOCKET_RECONECT_STATUS = undefined;
    },
    isUnloginMode(val) {
      console.log(`isUnloginMode is ${val}`);
      if (val) {
        this.processType = "process";
        // this.curCoinSrc = this.coinType.find(i => i.key == "earn").src;
        this.curCoinSrc = this.coinType.find(
          i => i.key == this.processType
        ).src;
        // this.earnCoin = "999";
      }
    },
    processType(val) {
      console.log(`processType is ${val}`);
      // if (this.isUnloginMode) {
      //   this.curCoinSrc = this.coinType.find(i => i.key == "earn").src;
      // } else {
      this.curCoinSrc = this.coinType.find(i => i.key == this.processType).src;
      // }
    }
  },
  mounted() {
    console.log(123);
    // if (this.isUnloginMode) {
    //   this.curCoinSrc = this.coinType.find(i => i.key == "earn").src;
    //   this.earnCoin = "999";
    // }
  },
  methods: {
    //   賺得彩金後變換樣式3秒後還原
    handleToggleEarnCoin() {
      if (this.timer) return;
      this.timer = setTimeout(() => {
        if (this.isForceWait) {
          this.processType = "wait";
        } else {
          this.processType = "process";
        }

        clearTimeout(this.timer);
        this.timer = null;
      }, 2500);

      this.curCoinSrc = this.coinType.find(i => i.key == "earn").src;
      this.processType = "earn";
    },
    // 收到play跑一次進度動畫
    playCueTime(play) {
      // 強制暫停動畫 目前無使用
      if (play === "pause") {
        this.isPause = true;
      }

      //重置計數
      else if (["stop"].includes(play)) {
        if (this.isUnloginMode) {
        } else {
          this.isPause = false;
        }

        clearInterval(this.playingCueTime);
        this.playingCueTime = null;
        return;
      }

      // 暫停後繼續播放
      else if (this.playingCueTime) {
        this.isPause = false;
        return;
      }

      // 未登入模式 60秒+999
      if (this.isUnloginMode) {
        this.isPause = false;
        this.playingCueTime = setInterval(() => {
          this.handleToggleEarnCoin();
        }, 60000);
      } else {
        this.isPause = false;
        this.playingCueTime = setTimeout(() => {
          clearTimeout(this.playingCueTime);
          this.playingCueTime = null;
        }, 59000);
      }
    }
  },
  destroyed() {
    this.curMin = 0;
    clearTimeout(this.timer);
    this.timer = null;
    clearTimeout(this.playingCueTime);
    this.playingCueTime = null;
  }
};
</script>
<style src="../index.scss" lang="scss" module></style>
<style lang="scss" scoped>
// 轉圈進度動畫
.circle_container {
  width: 24px; // 轉圈進度大小需跟圖形同樣大小
  height: 24px;
  position: absolute;
  top: 3px;
  right: 1.5px;
}

@media screen and (min-width: 768px) {
  .circle_container {
    top: 3px;
    left: 4.5px;
  }
}

.circle_loader {
  position: absolute;
  width: 24px;
  height: 24px;
}

#halfclip {
  width: 50%;
  height: 100%;
  right: 0px;
  position: absolute;
  overflow: hidden;
  transform-origin: left center;
  animation: cliprotate 60s steps(2) infinite;
  -webkit-animation: cliprotate 60s steps(2) infinite;
}

.halfcircle {
  box-sizing: border-box;
  height: 100%;
  right: 0px;
  position: absolute;
  border: solid 2px transparent;
  border-top-color: #ffd628;
  border-left-color: #ffd628;
  border-radius: 50%;
}

#clipped {
  width: 200%;
  animation: rotate 30s linear infinite;
  -webkit-animation: rotate 30s linear infinite;
}

#fixed {
  width: 100%;
  transform: rotate(135deg);
  animation: showfixed 60s steps(2) infinite;
  -webkit-animation: showfixed 60s linear infinite;
}

.circle_loader {
  &.pause * {
    -webkit-animation-play-state: paused !important;
    -moz-animation-play-state: paused !important;
    -o-animation-play-state: paused !important;
    animation-play-state: paused !important;
  }
}
@-webkit-keyframes cliprotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes cliprotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes rotate {
  0% {
    transform: rotate(-45deg);
  }

  100% {
    transform: rotate(135deg);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(-45deg);
  }

  100% {
    transform: rotate(135deg);
  }
}

@-webkit-keyframes showfixed {
  0% {
    opacity: 0;
  }

  49.9% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}
</style>
