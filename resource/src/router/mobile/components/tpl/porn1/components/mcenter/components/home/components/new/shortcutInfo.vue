<template>
  <div :class="$style['mcenter-vip-wrap']">
    <message v-if="msg" @close="msg = ''"
      ><div slot="msg">{{ msg }}</div>
    </message>
    <!-- VIP 推廣 -->
    <div :class="$style['vip-promotion-wrap']">
      <div @click="$router.push('/mobile/mcenter/accountVIP')">
        <img
          :src="$getCdnPath('/static/image/_new/mcenter/ic_vipprivicege.png')"
        />
        <div>
          <div>VIP特权</div>
          <div :class="$style['sub-text']">VIP PRIVILEGE</div>
        </div>
      </div>

      <div @click="msg = $text('S_COMING_SOON2')">
        <img
          :src="$getCdnPath('/static/image/_new/mcenter/ic_promotion.png')"
        />
        <div>
          <div>推广赚钱</div>
          <div :class="$style['sub-text']">PROMOTION</div>
        </div>
      </div>
    </div>
    <!-- 快捷功能 -->
    <div :class="$style['mcenter-func']">
      <div
        :class="$style['cell']"
        @click="$router.push('/mobile/mcenter/wallet')"
      >
        <div>
          <img :src="$getCdnPath('/static/image/_new/mcenter/ic_wallet.png')" />
        </div>
        <div>{{ $text("S_MY_PURSE", "我的钱包") }}</div>
      </div>
      <div
        :class="$style['cell']"
        @click="$router.push('/mobile/mcenter/betRecord')"
      >
        <div>
          <img
            :src="$getCdnPath('/static/image/_new/mcenter/ic_bethistory.png')"
          />
        </div>
        <div>{{ $text("S_BETHISTORYBTN", "投注纪录") }}</div>
      </div>
      <div
        :class="$style['cell']"
        @click="$router.push('/mobile/mcenter/moneyDetail')"
      >
        <div>
          <img
            :src="$getCdnPath('/static/image/_new/mcenter/ic_transaction.png')"
          />
        </div>
        <div>{{ $text("S_TRANSACTION_RECORD", "交易记录") }}</div>
      </div>
      <div
        :class="$style['cell']"
        @click="$router.push('/mobile/mcenter/bankRebate')"
      >
        <div>
          <img :src="$getCdnPath('/static/image/_new/mcenter/ic_rebate.png')" />
        </div>
        <div>{{ $text("S_REAL_TIME_REBATE", "实时返水") }}</div>
      </div>
    </div>

    <!-- <div class="clearfix">
      <div
        :class="[
          $style['info-btn-wrap'],
          { [$style['is-full']]: memInfo.user.display_vip }
        ]"
      >
        <div :class="$style['info-btn01']" @click="onListClick(0)">
          <img
            :src="
              $getCdnPath(
                '/static/image/mobile/tpl/porn1/home/online_deposit_icon.png'
              )
            "
          />
          <span>{{ $text("S_DEPOSIT", "充值") }}</span>
        </div>
        <div :class="$style['info-btn02']" @click="onListClick(1)">
          <img
            :src="
              $getCdnPath('/static/image/mobile/tpl/porn1/home/wallet_icon.png')
            "
          />
          <span>{{ $text("S_TRANSFER_BTN", "转账") }}</span>
        </div>
        <div :class="$style['info-btn03']" @click="onListClick(2)">
          <img
            :src="
              $getCdnPath(
                '/static/image/mobile/tpl/porn1/home/online_withdrawals_icon.png'
              )
            "
          />
          <span>{{ $text("S_WITHDRAWAL_TEXT", "提现") }}</span>
        </div>
        <div
          v-if="memInfo.user.display_vip"
          :class="$style['info-btn04']"
          @click="onListClick(3)"
        >
          <img
            :src="
              $getCdnPath('/static/image/mobile/tpl/porn1/home/vip_icon.png')
            "
          />
          <span>{{ $text("S_VIP_DETAILS_BTN", "VIP详情") }}</span>
        </div>
      </div>
      <div :class="$style['login-view']">
        <span :class="$style.money">¥{{ memBalance.total }}</span>
        <span>{{ $text("S_TOTAL_MONEY", "总金额") }}</span>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import mcenter from '@/api/mcenter';
import member from '@/api/member';
import message from '../../../../../common/new/message'

export default {
  components: {
    message
  },
  data() {
    return {
      msg: "",
      list: [
        { path: '', pageName: 'deposit' }, // 存款
        { path: '/mobile/mcenter/balanceTrans', pageName: 'bankBalanceTran' }, // 額度轉換
        { path: '/mobile/mcenter/withdraw', pageName: 'withdraw' }, // 取款
        { path: '/mobile/mcenter/accountVip', pageName: 'accountVip' } // VIP
      ],
      vipData: {},
      createdTime: '',
      imgID: 0,
      imgIndex: 0
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
      memCurrency: 'getMemCurrency',
      memBalance: 'getMemBalance'
    })
  },
  created() {
    mcenter.accountVIP({
      success: (res) => {
        this.vipData = {
          ...res.ret
        };
      }
    });
    member.data({
      success: (res) => {
        this.countDays(res.ret.user.created_at);
      }
    });

    this.imgIndex = this.memInfo.user.image;
    this.imgID = this.memInfo.user.image;
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    onListClick(listIndex) {
      const item = this.list[listIndex];

      if (!this.loginStatus) {
        this.goLogin();
        return;
      }
      if (item.pageName === 'deposit') {
        this.$depositLink(true);
        return;
      }

      mcenterPageAuthControl(item.pageName).then((response) => {
        if (response && response.status) {
          this.$router.push(item.path);
        }
      });
    },
    goLogin() {
      this.$router.push('/mobile/login');
    },
    goAccountData() {
      if (!this.loginStatus) {
        this.goLogin();
        return;
      }
      this.$router.push('/mobile/mcenter/accountData');
    },
    countDays(ceatedTime) {
      const startTime = moment(ceatedTime);
      const now = moment(new Date());

      this.createdTime = now.diff(startTime, 'days') + 1;
    },
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.mcenter-vip-wrap {
  margin: 15px 0;
}

.sub-text {
  color: $main_text_color2;
}

.vip-promotion-wrap {
  padding: 5px 8% 0;
  display: flex;

  > div {
    width: 50%;
    height: 60px;
    display: flex;

    > div {
      width: 100%;
      padding: 10px 0;

      > div {
        text-align: left;
        font-size: 16px;
        height: 50%;
        display: flex;
        align-items: center;
        line-height: 50%;
      }

      > div:last-of-type {
        font-size: 8px;
      }
    }

    > img {
      //   width: 60px;
      height: 100%;
    }
  }
}

.mcenter-func {
  height: 75px;
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 5px 8% 0;

  .cell {
    width: 25%;
    > div {
      text-align: center;
    }

    > div:first-child {
      width: 37px;
      height: 37px;
      margin: 5px auto;

      img {
        height: 100%;
        width: 100%;
      }
    }

    > div:last-child {
      font-size: 15px;
    }
  }
}
.login-view {
  position: relative;
  float: left;
  padding: 0 3px;
  margin: 8px 0 0 1%;
  width: 30%;
  line-height: 18px;
  color: #77674d;
  img,
  span {
    display: block;
  }
  img {
    margin: 0 auto;
    width: 28px;
    height: 28px;
  }
  span {
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .money {
    line-height: 28px;
  }
}
.login-view::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -1px;
  background: #efdfd1;
  width: 1px;
  height: 120px;
}
.info-btn-wrap {
  float: left;
  margin-top: 8px;
  width: 67%;
  min-height: 42px;
  &.is-full {
    div {
      width: 25%;
    }
  }
  div {
    float: left;
    height: 43px;
    width: 33%;
    padding: 0 7px;
    color: #77674d;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-bottom: 5px;
    img {
      margin: 0 auto;
      width: 28px;
      height: 28px;
      display: block;
    }
    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
      color: #2d477e;
      display: block;
    }
  }
}

@media screen and (min-width: $pad) {
  .mcenter-info-wrap {
    font-size: 14px;
  }

  .info-btn-wrap {
    div {
      height: 48px;
    }
  }
}
</style>
