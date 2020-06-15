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
        { [$style['active']]: processType === 'earn' }
      ]"
    >
      <div
        :class="[$style['coin-wrap'], { [$style['active']]: playingCueTime }]"
      >
        <!-- 動畫進行中 -->
        <template v-if="playingCueTime && processType !== 'earn'">
          <div :class="$style['icon']">
            <img
              :src="
                $getCdnPath(
                  `/static/image/_new/actives/bouns/${curCoinSrc}.png`
                )
              "
            />
          </div>

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
          <div :class="$style['icon']">
            <img
              :src="
                $getCdnPath(
                  `/static/image/_new/actives/bouns/${curCoinSrc}.png`
                )
              "
            />
          </div>
          <span v-if="processType === 'earn'" :class="$style['earn']">
            {{ `+${earnCoin} ` }}元</span
          >
          <span v-else-if="processType === 'process'">{{ curMin || 0 }}</span>
        </template>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      curCoinSrc: "coin_bg",
      processType: "process", // 累加,達標,已完成
      coinType:
        [{ key: 'done', src: 'coin_g' },
        { key: 'process', src: 'coin_bg' },
        { key: 'earn', src: 'coin_y' },
        { key: 'next', src: 'coin_next' },
        { key: 'wait', src: 'coin_open' },
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
      if (Number(newValue) !== Number(oldValue) && this.isInit) {
        this.handleToggleEarnCoin();
      }
    },
    curMin(newValue, oldValue) {
      if (Number(newValue) !== Number(oldValue) && this.isInit) {
        this.handleToggleEarnCoin();
      }
    },
    processType() {
      this.curCoinSrc = this.coinType.find(i => i.key == this.processType).src;
    },
  },
  methods: {
    //   賺得彩金後變換樣式3秒後還原
    handleToggleEarnCoin() {
      if (this.timer) return;
      this.timer = setTimeout(() => {
        this.processType = "process";
        clearTimeout(this.timer);
        this.timer = null;
      }, 2500)

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
      else if (play === "stop") {
        this.isPause = false;
        clearTimeout(this.playingCueTime);
        this.playingCueTime = null;
        return;
      }

      // 暫停後繼續播放
      else if (this.playingCueTime) { this.isPause = false; return; }

      this.isPause = false;
      this.playingCueTime = setTimeout(() => {
        // clearTimeout(this.playingCueTime);
        // this.playingCueTime = null;
      }, 60000)
    },

  },
  destroyed() {
    this.curMin = 0;
    clearTimeout(this.timer);
    this.timer = null;
    clearTimeout(this.playingCueTime);
    this.playingCueTime = null;
  },
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
