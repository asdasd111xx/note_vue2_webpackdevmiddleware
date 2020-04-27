<template>
  <div
    :class="
      isClose
        ? [$style['bouns-process-wrap'], $style['dialog-close']]
        : $style['bouns-process-wrap']
    "
  >
    <div
      :class="[
        $style['bouns-process'],
        { [$style['active']]: processType === 'earn' }
      ]"
    >
      <div :class="$style['coin']">
        <div :class="$style['icon']">
          <img
            :src="
              $getCdnPath(`/static/image/_new/actives/bouns/${curCoinSrc}.png`)
            "
          />
        </div>

        <div v-if="processType !== 'earn' && playingCueTime" class="circle_box">
          <div
            :class="[$style['circle_loader'], { [$style['pause']]: isPause }]"
          ></div>
        </div>

        <span v-if="processType === 'earn'" :class="$style['earn']">
          {{ `+${earnCoin}元` }}</span
        >
        <span v-else>{{ curMin }}</span>
      </div>
    </div>

    <div :class="$style['content']"></div>
  </div>
</template>
<script>

export default {
  components: {

  },
  props: {
  },
  data() {
    return {
      curCoinSrc: "coin_bg",
      processType: "process", // 累加,達標,已完成
      coinType:
        [{ key: 'done', src: 'coin_g' },
        { key: 'process', src: 'coin_bg' },
        { key: 'earn', src: 'coin_y' }],
      isClose: false,
      earnCoin: "15.00",
      curMin: 0,
      playingCueTime: false,
      lastAmount: 0,
      timer: null,
      cunTimer: null,
      isPause: false
    };
  },
  computed: {

  },
  watch: {
    curMin() {
      if (this.curMin > 9)
        this.handleToggleEarnCoin();
    },

    isFinish() {
      if (this.isFinish) {
        this.curCoinSrc = this.coinType.find(i => i.key == "done").src;
        this.processType = "done";
      }
    },

    isPause() {

    }
  },
  methods: {
    // 賺得彩金
    showEarn(lastAmount) {
      if (lastAmount === this.lastAmount) {
        return
      }
      this.lastAmount = lastAmount;
      this.handleToggleEarnCoin();
    },
    //   賺得彩金後變換樣式3秒後還原
    handleToggleEarnCoin() {
      this.curCoinSrc = this.coinType.find(i => i.key == "earn").src;
      this.processType = "earn";
      this.curMin = 0;

      this.timer = setTimeout(() => {
        if (this.isFinish) {
          this.curCoinSrc = this.coinType.find(i => i.key == "done").src;
          this.processType = "done";
        } else {
          this.curCoinSrc = this.coinType.find(i => i.key == "process").src;
          this.processType = "process";
        }
      }, 3000)
    },
    // 收到playing跑一次進度動畫
    playCueTime(play) {
      if (play) { this.playingCueTime = play; return; }
      if (this.playingCueTime) { return }
      this.playingCueTime = true;

      this.cunTimer = setTimeout(() => {
        this.playingCueTime = false;
      }, 60000)
    },

  },
  destroyed() {
    clearTimeout(this.timer);
    this.timer = null;
    clearTimeout(this.cunTimer);
    this.cunTimer = null;
  },
};
</script>
<style src="../index.scss" lang="scss" module></style>
