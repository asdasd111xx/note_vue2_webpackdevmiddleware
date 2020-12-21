<template>
  <div v-show="jackpotData && showJackpot" :class="$style['jackpot-container']">
    <!-- 1. 單一總彩金/名單 -->
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
              :formatValue="formatMoney"
              :duration="animatedNumber.duration"
            />
          </div>
        </div>
      </div>
      <div
        :class="$style['multi-bonus-wrap-bg']"
        v-if="currentUsers && currentUsers.length > 0"
      />

      <swiper
        v-if="currentUsers && currentUsers.length > 0"
        :options="swiperOpts"
        :key="updateKey"
        :class="[$style['multi-bonus-wrap']]"
      >
        <swiper-slide
          v-for="(item, key) in currentUsers"
          :key="key"
          :class="$style['multi-bonus-cell']"
        >
          <div>
            {{ `no.${key + 1}` }}
          </div>
          <div>
            {{ item.username }}
          </div>
          <div>
            {{ formatMoney(item.amount, false) }}
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- 2. 單一遊戲彩金 -->
    <div v-else-if="jackpotType === 2">
      <swiper
        v-if="currentBonus && currentBonus.length > 0"
        :options="swiperOpts"
        :key="updateKey"
        :class="[
          $style['multiBonus-container'],
          {
            [$style['single']]: vendor !== 'bbin'
          }
        ]"
        :style="
          currentBonus && currentBonus.length <= 1
            ? { animation: 'none', height: '80px' }
            : ''
        "
      >
        <swiper-slide
          v-for="(item, key) in currentBonus"
          :key="key"
          :class="$style['single-bonus-cell']"
          :style="
            currentBonus && currentBonus.length <= 1
              ? { animation: 'none' }
              : ''
          "
        >
          <div :class="$style['single-bonus-image']">
            <img :src="item.imgSrc" />
          </div>
          <div :class="$style['single-bonus-content']">
            <div>
              {{ item.name }}
            </div>

            <div :class="$style['single-bonus-amount']">
              <span> {{ formatMoney(item.amount) }}</span>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- 3. 多層彩金 -->
    <div
      v-else-if="jackpotType === 3"
      :class="[$style['multiBonus-container']]"
      :style="{ height: 'auto' }"
    >
      <div
        :class="$style['single-bonus-cell']"
        :style="{ animation: 'none', marginTop: '2px' }"
      >
        <div :class="$style['single-bonus-image']">
          <img :src="'/static/image/common/casino/jackpot/ic_grand.png'" />
        </div>
        <div :class="$style['single-bonus-content']">
          <div :class="$style['weight']">Grand</div>
          <div :class="$style['single-bonus-amount']">
            <span> {{ formatMoney(jackpotData.jpGrand) }} </span>
          </div>
        </div>
      </div>
      <div
        :class="$style['single-bonus-cell']"
        :style="{ animation: 'none', marginTop: '4px' }"
      >
        <div :class="$style['single-bonus-image']">
          <img :src="'/static/image/common/casino/jackpot/ic_major.png'" />
        </div>
        <div :class="$style['single-bonus-content']">
          <div :class="$style['weight']">Major</div>
          <div :class="$style['single-bonus-amount']">
            <span> {{ formatMoney(jackpotData.jpMajor) }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import animatedNumber from "animated-number-vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

export default {
  components: {
    animatedNumber,
    Swiper,
    SwiperSlide
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

      // 1. 單一總彩金/名單
      // 2. 單一遊戲彩金
      // 3. 多層彩金
      jackpotType: 0,
      showJackpot: false,

      totalBonusImage: "",
      totalBonusTitle: "",

      currentBonus: null,
      currentBonusIndex: 0,

      currentUsers: null,
      currentUsersIndex: 0,

      animatedNumber: { value: 0 },
      swiperOpts: {
        loop: true,
        touchmove: false,
        loopFillGroupWithBlank: true,
        direction: "vertical",
        slidesPerView: 3,
        slidesPerGroup: 3,
        autoplay: { delay: 3000, disableOnInteraction: false }
      },
      updateKey: 0
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
    })
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
            this.$emit("setJackpotData", this.jackpotData);
            this.initJackpot();
          }
        })
        .catch(error => {});
    },
    setSingleBonuns() {
      if (!this.jackpotData.jpMinor) {
        return;
      }

      if (this.jackpotData.jpMinor.length > 1) {
        this.currentBonus = [];
        this.jackpotData.jpMinor.forEach(i => {
          let imgSrc = `${this.siteConfig.BBOS_DOMIAN_CDN}/image/${this.$route.name}/${this.vendor}/Game_${i.code}.png`;
          this.currentBonus.push({
            ...i,
            imgSrc: imgSrc
          });
        });
        this.swiperOpts = {
          // loopFillGroupWithBlank: true,
          loop: true,
          direction: "vertical",
          slidesPerView: 2,
          slidesPerGroup: 2,
          autoplay: { delay: 3000, disableOnInteraction: false },
          spaceBetween: 5
        };
        this.updateKey = 1;
      } else {
        this.currentBonus = [];
        this.currentBonus.push({
          ...this.jackpotData.jpMinor[0],
          imgSrc: imgSrc
        });
      }
    },
    setCurrentUsers() {
      if (!this.jackpotData.jpUserList) {
        return;
      }

      if (this.jackpotData.jpUserList.length > 1) {
        this.currentUsers = this.jackpotData.jpUserList;
        this.swiperOpts = {
          // loopFillGroupWithBlank: true,
          loop: true,
          direction: "vertical",
          slidesPerView: 3,
          slidesPerGroup: 3,
          autoplay: { delay: 3000, disableOnInteraction: false }
        };
        this.updateKey = 1;
      } else {
        this.currentUsers = [];
        this.currentUsers.push({ ...this.jackpotData.jpUserList[0], no: 1 });
      }
    },
    initJackpot() {
      this.showJackpot = true;

      switch (this.vendor) {
        // 單一總彩金+名單
        case "bbin":
          this.jackpotType = 1;
          this.totalBonusTitle = "Grand";
          this.totalBonusImage =
            "/static/image/common/casino/jackpot/gamejp.png";
          break;

        // 單一總彩金
        case "jdb":
        case "wm":
        case "ps":
        case "gti":
          this.jackpotType = 1;
          this.totalBonusTitle = this.vendor.toUpperCase();
          this.totalBonusImage = `/static/image/common/casino/jackpot/ic_${this.vendor}.png`;
          break;

        // 單一遊戲彩金
        case "pt":
        case "gns":
        case "isb":
        case "hb":
        case "sg":
        case "ag":
        case "ag_casino":
        case "sw":
        case "fg":
        case "mg":
        case "mg2":
          this.jackpotType = 2;
          break;

        // 多層彩金
        case "lg_casino":
          this.jackpotType = 3;
          break;

        default:
          break;
      }

      switch (this.jackpotType) {
        // 單一總彩金+名單
        // 單一總彩金
        case 1:
          this.setCurrentUsers();

          if (!this.jackpotData.jpGrand) {
            return;
          }

          if (
            this.animatedNumber.value !== 0 &&
            this.animatedNumber.value < +this.jackpotData.jpGrand
          ) {
            this.animatedNumber.value = +this.jackpotData.jpGrand;
            this.animatedNumber.duration = 150000;
            return;
          }

          this.animatedNumber.value = +this.jackpotData.jpGrand - 2;
          this.animatedNumber.duration = 0;

          setTimeout(() => {
            this.animatedNumber.value = +this.jackpotData.jpGrand;
            this.animatedNumber.duration = 150000;
          }, 300);
          return;

        // 單一遊戲彩金
        case 2:
          this.setSingleBonuns();
          return;

        // 多層彩金
        case 3:
          return;

        default:
          return;
      }
    },
    formatMoney(value, symbol = true) {
      if (!value || value === 0) {
        return 0.0;
      }
      return `${symbol ? "¥" : ""}${(Math.round(value * 100) / 100)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.jackpot-container {
  padding: 6px 9px;
  pointer-events: none;
}

.multiTotal-container {
  height: 105px;
  position: relative;
  background: #f5f5f5;
  border-radius: 17px;

  &.single {
    height: auto;
  }
}

.multiBonus-container {
  height: 98px;
  position: relative;
  background: #f5f5f5;
  border-radius: 17px;
}

.total-bonus,
.single-bonus-cell {
  background: #ffffff;
  border-radius: 17px;
  z-index: 2;
}

.single-bonus-cell {
  align-items: center;
  animation: fade-out-up-cell 3s linear;
  display: flex;
  height: 40px;
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
    width: 55%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 5px;
    border-right: #eeeeee 1px solid;
    &.weight {
      font-size: 15px;
      font-weight: 700;
    }
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
  height: 78px;
}

.multi-bonus-cell {
  padding: 0 7px;
  font-weight: 400;
  color: #313131;

  > div {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > div:first-child {
    width: 30%;
  }

  > div:nth-child(2) {
    width: 40%;
  }

  > div:nth-child(3) {
    text-align: left;
    position: absolute;
    right: 7px;
    max-width: 25%;
  }
}
</style>
