<template>
  <div :class="$style['list-wrap']">
    <div :class="[$style['content-wrap'], 'clearfix']">
      <div
        v-for="(item, index) in list"
        :key="item.pageName"
        :class="[$style.card, { [$style.last]: (index + 1) % 4 === 0 }]"
        @click="onListClick(item)"
      >
        <div :class="[$style.content, $style[`is-${item.pageName}`]]">
          {{ $text(item.name) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import exceptionList from '@/config/exceptionList';

export default {
  props: {
    filter: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      webInfo: 'getWebInfo',
      memInfo: 'getMemInfo'
    }),
    list() {
      return [
        { name: 'S_ACCOUNT_DATA', path: '/mobile/mcenter/accountData', pageName: 'accountData' }, // 帳戶資料
        { name: 'VIP', path: '/mobile/mcenter/accountVip', pageName: 'accountVip' }, // VIP
        { name: 'S_ACCOUNT_DEPOSITE', path: '', pageName: 'deposit' }, // 存款
        { name: 'S_ACCOUNT_WITHDRAW', path: '/mobile/mcenter/withdraw', pageName: 'withdraw' }, // 取款
        { name: 'S_TRAN_BALANCE', path: '/mobile/mcenter/balanceTrans', pageName: 'bankBalanceTran' }, // 額度轉換
        { name: 'S_BIND_BANK', path: '/mobile/mcenter/bankCard', pageName: 'accountBankCard' }, // 綁定銀行卡
        { name: 'S_FUNDS_DETAILS', path: '/mobile/mcenter/moneyDetail', pageName: 'bankMoneyDetail' }, // 資金明細
        { name: 'S_BETHISTORYBTN', path: '/mobile/mcenter/betRecord', pageName: 'betRecord' }, // 投注記錄
        { name: 'S_MYREBATE', path: '/mobile/mcenter/bankRebate', pageName: 'bankRebate' }, // 我的返水
        { name: 'S_BONUS_ACCOUNT', path: '/mobile/mcenter/bonusAccount', pageName: 'bonusAccount' }, // 紅利帳戶
        { name: 'S_MSG_CENTER', path: '/mobile/mcenter/information/post', pageName: 'information' }, // 信息中心
        { name: 'S_DEVICE_MANAGEMENT', path: '/mobile/mcenter/bindingDevice', pageName: 'bindingDevice' }, // 裝置管理
        { name: 'S_TEAM_CENTER', path: '/mobile/mcenter/tcenter', pageName: 'tcenter' }, // 團隊中心
        { name: 'S_AGENT', path: '', pageName: 'jpAgent' } // 特例 日本站 代理中心
      ]
        .filter((item) => {
          // 日本站特例移除紅利帳戶
          if (item.pageName === 'bonusAccount' || item.pageName === 'bindingDevice') {
            return !this.isException;
          }

          // 日本站特例加入代理中心
          if (item.pageName === 'jpAgent') {
            return this.isException;
          }

          // 無限層廳才顯示團隊中心
          if (item.pageName === 'tcenter') {
            return this.memInfo.config.infinity;
          }

          // 判斷是否開啟vip
          if (item.pageName === 'accountVip') {
            return this.memInfo.user.display_vip;
          }

          return true;
        })
        .filter((item) => {
          switch (true) {
            case this.filter === 'money':
              return ['deposit', 'withdraw', 'bankBalanceTran'].includes(item.pageName);
            case this.filter === 'transaction':
              return ['bankMoneyDetail', 'betRecord', 'bonusAccount', 'bankRebate', 'tcenter'].includes(item.pageName);
            default:
              return true;
          }
        });
    },
    // 日本站特例判斷
    isException() {
      const { wonderCasino, knightCasino } = exceptionList;
      return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
    }
  },
  methods: {
    ...mapActions(['actionEnterMCenterThirdPartyLink']),
    onListClick(item) {
      if (item.pageName === 'jpAgent') {
        this.onJpAgent();
        return;
      }
      if (item.pageName === 'deposit') {
        this.$depositLink(true);
        return;
      }

      if (item.pageName === 'bankRebate') {
        this.actionEnterMCenterThirdPartyLink({ type: 'member', page: item.pageName }).then((pageName) => {
          if (pageName) {
            mcenterPageAuthControl(pageName).then((response) => {
              if (response && response.status) {
                this.$router.push(item.path);
              }
            });
          }
        });
        return;
      }

      mcenterPageAuthControl(item.pageName).then((response) => {
        if (response && response.status) {
          this.$router.push(item.path);
        }
      });
    },
    onJpAgent() {
      let url;
      const win = window.open('');
      if (this.webInfo.alias === '110' || this.webInfo.alias === '123') {
        url = '/api/v1/c/link/customize?id=239eebc812b5772e585583d6025a7e2e6f322bb3&type=reward';
      } else {
        url = '/api/v1/c/link/customize?id=67873859460a046124c6563448ed09c7f92ab34e&type=reward';
      }

      ajax({
        method: 'get',
        url,
        errorAlert: false,
        success: (response) => {
          if (response.result === 'ok' && response.ret.uri) {
            win.location = response.ret.uri;
            return;
          }

          win.close();
        },
        fail: () => {
          win.close();
        }
      });
    }
  }
};
</script>

<style lang="scss" module>
.list-wrap {
  padding: 14px 5%;
}

.content-wrap {
  margin: 0 auto;
  max-width: 546px;
}

.card {
  float: left;
  background-color: #fff;
  position: relative;
  margin-right: 4%;
  margin-bottom: 10px;
  width: 22%;
  max-width: 120%;
  border-radius: 6px;
  color: #a37f5b;
  text-align: center;

  &.last {
    margin-right: 0;
  }

  &::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }

  .content {
    position: absolute;
    padding: 60% 2px 0;
    padding-top: 60%;
    width: 100%;
    height: 100%;
    line-height: 1.15;
    font-size: 12px;
    font-weight: bold;
    // white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.is-accountData {
  background: url("/static/image/mobile/mcenter/theme1/btn_data_n.png") 50% 20% /
    40% 40% no-repeat;
}
.is-deposit {
  background: url("/static/image/mobile/mcenter/theme1/btn_deposit_n.png") 50%
    20% / 40% 40% no-repeat;
}
.is-withdraw {
  background: url("/static/image/mobile/mcenter/theme1/btn_withdrawal_n.png")
    50% 20% / 40% 40% no-repeat;
}
.is-bankBalanceTran {
  background: url("/static/image/mobile/mcenter/theme1/btn_conversion_n.png")
    50% 20% / 40% 40% no-repeat;
}
.is-accountBankCard {
  background: url("/static/image/mobile/mcenter/theme1/btn_card_n.png") 50% 20% /
    40% 40% no-repeat;
}
.is-bankMoneyDetail {
  background: url("/static/image/mobile/mcenter/theme1/btn_detail_n.png") 50%
    20% / 40% 40% no-repeat;
}
.is-betRecord {
  background: url("/static/image/mobile/mcenter/theme1/btn_betting_n.png") 50%
    20% / 40% 40% no-repeat;
}
.is-bankRebate {
  background: url("/static/image/mobile/mcenter/theme1/btn_backwater_n.png") 50%
    20% / 40% 40% no-repeat;
}
.is-bonusAccount {
  background: url("/static/image/mobile/mcenter/theme1/btn_dividend_n.png") 50%
    20% / 40% 40% no-repeat;
}
.is-information {
  background: url("/static/image/mobile/mcenter/theme1/btn_mail_n.png") 50% 20% /
    40% 40% no-repeat;
}
.is-bindingDevice {
  background: url("/static/image/mobile/mcenter/theme1/btn_device_n.png") 50%
    20% / 40% 40% no-repeat;
}
.is-tcenter,
.is-jpAgent {
  background: url("/static/image/mobile/mcenter/theme1/btn_team_n.png") 50% 20% /
    40% 40% no-repeat;
}
.is-accountVip {
  background: url("/static/image/mobile/mcenter/theme1/btn_vip_n.png") 50% 20% /
    40% 40% no-repeat;
}
</style>
