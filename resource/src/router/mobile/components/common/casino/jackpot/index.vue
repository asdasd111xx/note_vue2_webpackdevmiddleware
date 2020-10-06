<template>
  <div v-show="jackpotData" :class="$style['jackpot-container']">
    <!-- 單一彩金+名單 -->
    <div v-if="jackpotType === 1" :class="$style['multiTotal-container']">
      <div :class="$style['total-bonus']">
        <div :class="$style['total-image']">
          <img :src="totalBonusImage" />
        </div>
        <div :class="$style['total-bonus-content']">
          <div>
            Grand
          </div>
          <div>
            Jackpot
          </div>
          <div :class="$style['total-bonus-amount']">
            ¥15,349,879.56
          </div>
        </div>
      </div>
      <div :class="$style['multi-bonus-wrap']" v-if="currentUsers">
        <div
          v-for="(item, key) in currentUsers.slice(0, 3)"
          :class="$style['multi-bonus-cell']"
        >
          <div>
            {{ `no.${key}` }}
          </div>
          <div>
            {{ item.username }}
          </div>
          <div>
            {{ item.amount }}
          </div>
        </div>
      </div>
    </div>

    <template v-else-if="jackpotType === 2"> </template>
    <template v-else-if="jackpotType === 3"> </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  props: {
    vendor: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      jackpotData: null,
      jackpotType: 1, //
      currentUsers: null
    };
  },
  created() {
    this.getJackpotList();
  },
  watch: {
    jackpotData() {
      console.log(this.jackpotData)
      this.initJackpot();
      this.currentUsers = this.jackpotData.jpUserList;
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
    }),
    totalBonusImage() {
      return '/static/image/casino/jackpot/ic_grand.png';
    }
  },
  methods: {
    ...mapActions([
      'actionNoticeData'
    ]),
    getJackpotList() {
      return axios({
        method: 'get',
        url: '/api/v1/c/vendor/jackpot_list',
        params: { vendor: this.vendor }
      }).then(res => {
        console.log(res);
        if (res && res.data && res.data.result === 'ok') {
          this.jackpotData = res.data.ret;
        }
      }).catch((error) => { })
    },
    initJackpot() {
      switch (this.vendor) {
        // 單一彩金+名單
        case 'bbin':
          this.jackpotType = 1;
          return;
        default:
          return;
      }
    },
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.jackpot-container {
  height: 115px;
  padding: 6px 9px;
}

.multiTotal-container {
  position: relative;
}

.total-bonus {
  background: #ffffff;
  border-radius: 17px;
}

.total-image {
  display: inline-block;
  height: 33px;
  width: 33px;

  > img {
    height: 33px;
    width: 33px;
  }
}

.total-bonus-content {
  display: inline-block;
  position: relative;
  width: calc(100% - 40px);
}

.total-bonus-amount {
  position: absolute;
  right: 14px;
  top: 0;
  height: 100%;
  line-height: 39px;
}

.multi-bonus-wrap {
  padding-top: 6px;
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
