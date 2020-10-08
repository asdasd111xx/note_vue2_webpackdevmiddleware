<template>
  <div v-show="jackpotData && showGrand" :class="$style['jackpot-container']">
    <!-- 單一彩金+名單 -->
    <div
      v-if="jackpotType === 1"
      :class="[
        $style['multiTotal-container'],
        {
          [$style['single']]: vendor !== 'bbin'
        }
      ]"
    >
      <div :class="$style['total-bonus']">
        <div :class="$style['total-image']">
          <img :src="totalBonusImage" />
        </div>
        <div :class="$style['total-bonus-content']">
          <div>
            {{ totalBonusTitle }}
          </div>
          <div>
            Jackpot
          </div>
          <div :class="$style['total-bonus-amount']">
            <animatedNumber
              :value="animatedNumber.value"
              :formatValue="formatToPrice"
              :duration="animatedNumber.duration"
            />
          </div>
        </div>
      </div>
      <div
        :class="$style['multi-bonus-wrap-bg']"
        v-if="currentUsers && currentUsers.length > 0"
      />
      <transition name="fade">
        <div
          :class="[$style['multi-bonus-wrap']]"
          v-if="currentUsers && currentUsers.length > 0"
        >
          <div
            v-for="(item, key) in currentUsers"
            :class="$style['multi-bonus-cell']"
          >
            <div>
              {{ `no.${item.no}` }}
            </div>
            <div>
              {{ item.username }}
            </div>
            <div>
              {{ item.amount }}
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div
      v-else-if="jackpotType === 2"
      :class="[
        $style['multiBonus-container'],
        {
          [$style['single']]: vendor !== 'bbin'
        }
      ]"
    >
      <div
        v-for="(item, key) in currentBonus"
        :class="$style['single-bonus-cell']"
      >
        <div :class="$style['single-bonus-image']">
          <img :src="item.imgSrc" />
        </div>
        <div :class="$style['single-bonus-content']">
          <div>{{ item.name }}</div>
          <div :class="$style['single-bonus-amount']">
            <span> ¥&nbsp;{{ item.amount }} </span>
          </div>
        </div>
      </div>
    </div>
    <template v-else-if="jackpotType === 2"> </template>
    <template v-else-if="jackpotType === 3"> </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import animatedNumber from "animated-number-vue";
export default {
  components: {
    animatedNumber
  },
  props: {
    vendor: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timer: null,
      usersTimer: null,
      jackpotData: null,
      // 1. 單一彩金+名單
      // 2.
      // 3.
      showGrand: false,
      jackpotType: 0,

      totalBonusImage: '',
      totalBonusTitle: '',

      currentBonus: null,
      currentBonusIndex: 0,

      currentUsers: null,
      currentUsersIndex: 0,

      animatedNumber: { value: 0 }
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.usersTimer);
    this.timer = null;
    this.usersTimer = null;
  },
  created() {
    this.getJackpotList();

    this.timer = setInterval(() => {
      this.getJackpotList();
    }, 600000);
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus"
    }),
  },
  methods: {
    ...mapActions(["actionNoticeData"]),
    getJackpotList() {
      return axios({
        method: "get",
        url: "/api/v1/c/vendor/jackpot_list",
        params: { vendor: this.vendor }
      })
        .then(res => {
          if (res && res.data && res.data.result === "ok") {
            this.jackpotData = res.data.ret;
            this.$emit('setJackpotData', this.jackpotData);
            this.initJackpot();
          }
        })
        .catch(error => { });
    },
    setSingleBonuns() {
      if (!this.jackpotData.jpMinor) {
        return;
      }

      const interval = () => {
        let tmpIndex = this.currentBonusIndex === 0 ? 0 : this.currentBonusIndex + 1;
        let array = [];
        this.currentBonus = [];

        this.$nextTick(() => {
          let i = 1;
          while (i < 3) {
            if (tmpIndex + i > this.jackpotData.jpMinor.length) {
              tmpIndex = 0;
            } else {
              tmpIndex += 1;
            }

            // 3 casino, 6 mahjong,card
            let imgSrc = `https://b1.xf0371.com/cdn/image/${this.$route.name}/${this.vendor}/Game_${this.jackpotData.jpMinor[tmpIndex].code}.png`;
            array.push({ ...this.jackpotData.jpMinor[tmpIndex], imgSrc: imgSrc });
            i += 1;
          }

          this.currentBonus = array;
          this.currentBonusIndex = tmpIndex;
        })
      }

      interval();
      this.usersTimer = setInterval(() => {
        interval();
      }, 3000);
    },
    setCurrentUsers() {
      if (!this.jackpotData.jpUserList) {
        return;
      }

      const interval = () => {
        let tmpIndex = this.currentUsersIndex === 0 ? 0 : this.currentUsersIndex + 1;
        let array = [];
        this.currentUsers = [];

        this.$nextTick(() => {
          array.push({ ...this.jackpotData.jpUserList[tmpIndex], no: tmpIndex + 1 });
          let i = 1;
          while (i < 3) {
            if (tmpIndex + i > this.jackpotData.jpUserList.length) {
              tmpIndex = 0;
            } else {
              tmpIndex += 1;
            }
            array.push({ ...this.jackpotData.jpUserList[tmpIndex], no: tmpIndex + 1 });
            i += 1;
          }

          this.currentUsers = array;
          this.currentUsersIndex = tmpIndex;
        })
      }

      interval();
      this.usersTimer = setInterval(() => {
        interval();
      }, 3000);
    },
    initJackpot() {
      switch (this.vendor) {
        // 單一總彩金+名單
        case "bbin":
          this.jackpotType = 1;
          this.totalBonusTitle = "Grand";
          this.totalBonusImage = "/static/image/casino/jackpot/ic_grand.png";
          this.showGrand = true;

          break;

        case "lg_casino":
          this.jackpotType = 1;
          this.totalBonusTitle = "Grand";

          break;

        // 單一總彩金
        case "jdb":
        case "wm":
        case "ps":
        case "gti":
          this.jackpotType = 1;
          this.totalBonusTitle = this.vendor.toUpperCase();
          this.totalBonusImage = `/static/image/casino/jackpot/ic_${this.vendor}.png`;
          this.showGrand = true;

          break;

        // 單一遊戲彩金
        case "pt":
        case "gns":
        case "isb":
        case "hb":
        case "ag":
        case "sw":
        case "fg":
        case "mg":
          this.jackpotType = 2;
          this.showGrand = true;

          break;

        default:
          break;
      }

      switch (this.jackpotType) {
        // 單一彩金+名單
        case 1:
          this.setCurrentUsers();

          if (!this.jackpotData.jpGrand) {
            return;
          }

          if (this.animatedNumber.value !== 0 && this.animatedNumber.value < +this.jackpotData.jpGrand) {
            this.animatedNumber.value = +this.jackpotData.jpGrand;
            this.animatedNumber.duration = 300000;
            return;
          }

          this.animatedNumber.value = +this.jackpotData.jpGrand - 2;
          this.animatedNumber.duration = 0;

          this.$nextTick(() => {
            this.animatedNumber.value = +this.jackpotData.jpGrand;
            this.animatedNumber.duration = 300000;
          })
          return;

        case 2:
          this.setSingleBonuns();
          return;
        default:
          return;
      }
    },
    formatToPrice(value) {
      return `¥${value.toFixed(2)}`;
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.jackpot-container {
  padding: 6px 9px;
}

.multiTotal-container {
  height: 105px;
  position: relative;
  background: #f5f5f5;

  &.single {
    height: auto;
  }
}

.multiBonus-container {
  height: 90px;
  position: relative;
  background: #f5f5f5;

  &.multi {
    height: auto;
  }
}

.total-bonus,
.single-bonus-cell {
  background: #ffffff;
  border-radius: 17px;
  z-index: 20;
}

.single-bonus-cell {
  align-items: center;
  animation: fade-out-up-cell 3s linear;
  display: flex;
  height: 40px;
  margin-top: 4px;
  opacity: 1;
  position: relative;
}

.total-image {
  display: inline-block;
  height: 33px;
  width: 33px;

  > img {
    height: 33px;
    width: 33px;
    position: absolute;
    top: 3px;
    border-radius: 50%;
  }
}

.single-bonus-image {
  display: flex;
  height: 100%;
  width: 33px;
  align-items: center;

  > img {
    height: 33px;
    width: 33px;
    border-radius: 50%;
  }
}

.total-bonus-content {
  z-index: 2;
  display: inline-block;
  position: relative;
  width: calc(100% - 40px);

  > div:first-child {
    font-size: 16px;
    font-family: Arial, Arial-Bold;
    font-weight: 700;
    text-align: left;
    color: #504f4a;
  }

  > div:nth-child(2) {
    font-size: 12px;
    font-family: Arial, Arial-Regular;
    font-weight: 400;
    text-align: left;
    color: #a8a8a8;
  }
}

.single-bonus-content {
  z-index: 2;
  display: inline-block;
  position: relative;
  width: calc(100% - 40px);
  padding-left: 6px;

  > div:first-child {
    font-size: 12px;
    font-family: Segoe UI, Segoe UI-Regular;
    font-weight: 400;
    text-align: left;
    color: #504f4a;
  }

  .single-bonus-amount {
    position: absolute;
    right: 9px;
    top: 0;
    font-size: 15px;
    font-family: Arial, Arial-Regular;
    font-weight: 400;
    text-align: right;
    color: #aa7e28;
  }
}

.total-bonus-amount {
  position: absolute;
  right: 14px;
  top: 0;
  height: 100%;
  line-height: 39px;

  > span {
    font-size: 16px;
    font-family: Arial, Arial-Regular;
    font-weight: 400;
    text-align: right;
    color: #aa7e28;
  }
}

.multi-bonus-wrap-bg {
  padding-top: 6px;
  background: #f5f5f5;
  opacity: 1;
  position: absolute;
  width: 100%;
  top: 39px;
  height: 60px;
}

.multi-bonus-wrap {
  padding-top: 6px;
  background: #f5f5f5;
  opacity: 1;
  position: absolute;
  width: 100%;
  top: 39px;
  animation: fade-out-up 3s linear;
}

@keyframes fade-out-up {
  0% {
    opacity: 1;
  }

  80% {
    opacity: 0.8;
    top: 39px;
  }

  92% {
    opacity: 0;
    top: 29px;
  }

  100% {
    opacity: 0;
    top: 29px;
  }
}

@-webkit-keyframes fade-out-up {
  0% {
    opacity: 1;
  }

  80% {
    opacity: 0.8;
    top: 39px;
  }

  92% {
    opacity: 0;
    top: 29px;
  }

  100% {
    opacity: 0;
    top: 29px;
  }
}

@keyframes fade-out-up-cell {
  0% {
    opacity: 1;
  }

  80% {
    opacity: 0.8;
    top: 0;
  }

  92% {
    opacity: 0;
    top: -10px;
  }

  100% {
    opacity: 0;
    top: -10px;
  }
}

@-webkit-keyframes fade-out-up-cell {
  0% {
    opacity: 1;
  }

  80% {
    opacity: 0.8;
    top: 0;
  }

  92% {
    opacity: 0;
    top: -10px;
  }

  100% {
    opacity: 0;
    top: -10px;
  }
}

.multi-bonus-cell {
  padding: 0 7px;
  font-weight: 400;
  color: #313131;

  > div {
    display: inline-block;
  }

  > div:first-child {
    width: 30%;
  }

  > div:nth-child(2) {
    width: 40%;
  }

  > div:nth-child(3) {
    text-align: left;
  }
}

.single-container {
}

.multiBonus-container {
}
</style>
