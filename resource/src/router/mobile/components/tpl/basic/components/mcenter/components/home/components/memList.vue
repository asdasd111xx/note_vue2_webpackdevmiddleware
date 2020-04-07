<template>
  <div class="mem-list">
    <!-- vip彈跳視窗 -->
    <div v-if="vipData.enable" class="list vip" @click="vipPop">
      {{ $t("S_VIP_LEVEL") }}： {{ vipData.now_level_alias }}，
      <span class="vip-text">
        {{ $t("S_NEXT_LEVEL") }}
        <icon name="exclamation-circle" width="13" height="13" />
      </span>
      <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_goto_n.png')" />
      <img
        :src="$getCdnPath('/static/image/mobile/mcenter/icon_goto_h.png')"
        class="is-active"
      />
    </div>
    <div
      v-for="listInfo in listFilter"
      :key="`list-${listInfo.pageName}`"
      class="list"
      @click="onListClick(listInfo)"
    >
      <span>{{ $t(listInfo.name) }}</span>
      <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_goto_n.png')" />
      <img
        :src="$getCdnPath('/static/image/mobile/mcenter/icon_goto_h.png')"
        class="is-active"
      />
    </div>
    <!--特例 日本站 代理中心 -->
    <div v-if="isException" class="list" @click="onJpAgent">
      <span>{{ $t("S_AGENT") }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import mcenter from '@/api/mcenter';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import exceptionList from '@/config/exceptionList';

export default {
  data() {
    return {
      list: [
        { name: 'S_BONUS_ACCOUNT', path: '/mobile/mcenter/bonusAccount', pageName: 'bonusAccount' }, // 紅利帳戶
        { name: 'S_MYREBATE', path: '/mobile/mcenter/bankRebate', pageName: 'bankRebate' }, // 我的返水
        { name: 'S_TEAM_CENTER', path: '/mobile/mcenter/tcenter', pageName: 'tcenter' }, // 團隊中心
        { name: 'S_FUNDS_DETAILS', path: '/mobile/mcenter/moneyDetail', pageName: 'bankMoneyDetail' }, // 資金明細
        { name: 'S_BETHISTORYBTN', path: '/mobile/mcenter/betRecord', pageName: 'betRecord' }, // 投注記錄
        { name: 'S_ACCOUNT_DATA', path: '/mobile/mcenter/accountData', pageName: 'accountData' }, // 帳戶資料
        { name: 'S_BIND_BANK', path: '/mobile/mcenter/bankCard', pageName: 'accountBankCard' }, // 綁定銀行卡
        { name: 'S_PERSONAL_MESSAGE', path: '/mobile/mcenter/message', pageName: 'infoMessage' }, // 站內信
        { name: 'S_HOT_NEWS', path: '/mobile/mcenter/post', pageName: 'infoPost' }, // 公告
        { name: 'S_MSG_CENTER', path: '/mobile/mcenter/information/post', pageName: 'information' } // 信息中心
      ],
      vipData: {}
    };
  },
  computed: {
    ...mapGetters({
      webInfo: 'getWebInfo',
      memInfo: 'getMemInfo'
    }),
    listFilter() {
      return this.list.filter((data) => {
        // 日本站特例移除紅利帳戶
        if (data.pageName === 'bonusAccount') {
          return !this.isException;
        }

        // 無限層廳才顯示團隊中心
        if (data.pageName === 'tcenter') {
          return this.memInfo.config.infinity;
        }

        return true;
      });
    },
    // 日本站特例判斷
    isException() {
      const { wonderCasino, knightCasino } = exceptionList;
      return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
    }
  },
  created() {
    mcenter.accountVIP({
      success: (response) => {
        this.vipData = {
          type: 'vip',
          key: 'text',
          position: 'mcenter',
          btnText: this.$t('S_VIP_LEVEL'),
          ...response.ret
        };
      }
    });
  },
  methods: {
    ...mapActions([
      'actionSetPop',
      'actionEnterMCenterThirdPartyLink'
    ]),
    onListClick(item) {
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
    },
    vipPop() {
      this.actionSetPop({
        type: 'account',
        data: this.vipData
      });
    }
  }
};
</script>

<style lang="scss" src="../css/memList.scss" scoped></style>
