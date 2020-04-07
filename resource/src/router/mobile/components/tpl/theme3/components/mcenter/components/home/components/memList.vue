<template>
  <div :class="$style['mem-list']">
    <div
      v-for="listInfo in list"
      :key="`list-${listInfo.pageName}`"
      :class="$style['list']"
      @click="onListClick(listInfo)"
    >
      <img
        :class="$style['list-icon']"
        :src="
          $getCdnPath(
            `/static/image/mobile/tpl/theme3/home/${listInfo.image}_icon_n.png`
          )
        "
      />
      <img
        :class="[$style['is-active'], $style['list-icon']]"
        :src="
          $getCdnPath(
            `/static/image/mobile/tpl/theme3/home/${listInfo.image}_icon_h.png`
          )
        "
      />
      <span>{{ $text(listInfo.name, listInfo.initName) }}</span>
      <img
        :class="$style['arrow']"
        :src="
          $getCdnPath('/static/image/mobile/tpl/theme3/home/icon_goto_n.png')
        "
      />
      <img
        :class="[$style['is-active'], $style['arrow']]"
        :src="
          $getCdnPath('/static/image/mobile/tpl/theme3/home/icon_goto_h.png')
        "
      />
    </div>
    <div :class="$style['logout']" @click="onLogout()">
      {{ $text("S_LOGOUT2", "退出登录") }}
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import mcenter from '@/api/mcenter';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import agent from '@/api/agent';
import member from '@/api/member';

export default {
  data() {
    return {
      list: [
        {
          initName: '个人资料', name: 'S_PERSONAL_DATA', path: '/mobile/mcenter/accountData', pageName: 'accountData', image: 'account_data'
        }, // 個人資料
        {
          initName: '银行卡管理', name: 'S_BANK_INFO_MANAGE', path: '/mobile/mcenter/bankCard', pageName: 'bankInfo', image: 'bank_info'
        }, // 銀行卡管理
        {
          initName: '交易纪录', name: 'S_TRANSACTION_RECORD', path: '/mobile/mcenter/moneyDetail', pageName: 'bankMoneyDetail', image: 'money_detail'
        }, // 交易記錄
        {
          initName: '投注纪录', name: 'S_BETHISTORYBTN', path: '/mobile/mcenter/betRecord', pageName: 'betRecord', image: 'bet_record'
        }, // 投注記錄
        {
          initName: '实时返水', name: 'S_REAL_TIME_REBATE', path: '/mobile/mcenter/bankRebate', pageName: 'bankRebate', image: 'bank_rebate'
        }, // 實時返水
        {
          initName: '红利帐户', name: 'S_BONUS_ACCOUNT', path: '/mobile/mcenter/bonusAccount', pageName: 'bonusAccount', image: 'bonus_account'
        }, // 紅利帳戶
        {
          initName: '公告', name: 'S_HOT_NEWS', path: '/mobile/mcenter/information/post', pageName: 'infoPost', image: 'info_post'
        }, // 公告
        {
          initName: '联系我们', name: 'S_CONTACT_US', path: '/mobile/contact', pageName: 'contactUs', image: 'contact_us'
        }, // 聯系我們
        // { initName: '合营计划', name: 'S_JOIN_PLAN', path: '/mobile/agent', pageName: 'JoinPlan', image: 'join_plan' }, // 合營計畫
        {
          initName: '关于威尼斯人', name: 'S_ABOUT_THEME3', path: '/mobile/about', pageName: 'aboutTheme3', image: 'about_theme3'
        } // 關於威尼斯人
      ],
      vipData: {}
    };
  },
  computed: {
    ...mapGetters({
      webInfo: 'getWebInfo',
      memInfo: 'getMemInfo'
    })
  },
  created() {
    mcenter.accountVIP({
      success: (response) => {
        this.vipData = {
          type: 'vip',
          key: 'text',
          position: 'mcenter',
          btnText: this.$t('S_VIP_LEVEL', 'VIP等级'),
          ...response.ret
        };
      }
    });
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
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
    },
    setHeight() {
      const screenHeight = document.documentElement.clientHeight;
      const imgLinkHeight = $('#imgLink').height() || 0;
      const memListHeight = screenHeight - 38 - 103 - (5 + imgLinkHeight) - 47; // 扣掉 => 訊息圖示區塊＋資訊欄＋圖片連結＋footer

      $(`.${this.$style['mem-list']}`).css({ height: memListHeight });
    },
    /**
     * 登出
     * @method onLogout
     */
    onLogout() {
      const reload = () => { window.location.reload(); };

      // 代理會員
      if (this.$route.name === 'agcenter') {
        agent.logout().then(reload);
        this.$router.push('/mobile');
        return;
      }

      // 會員
      member.logout().then(reload);
      this.$router.push('/mobile');
    }
  }
};
</script>

<style lang="scss" module>
.mem-list {
  .list {
    position: relative;
    border-bottom: 1px solid #242424;
    background: url("/static/image/mobile/tpl/theme3/home/mem_list_bg.png") 0 0
      no-repeat;
    background-size: 100%;
    padding-left: 50px;
    width: 100%;
    height: 43px;
    line-height: 43px;
    font-size: 14px;
    color: #f8f1eb;
    display: block;

    &:active {
      background: url("/static/image/mobile/tpl/theme3/home/mem_list_bg_active.png")
        0 0 no-repeat;
      color: #5c4030;

      .arrow,
      .list-icon {
        display: none;

        &.is-active {
          display: block;
        }
      }
    }

    .arrow,
    .list-icon {
      position: absolute;

      &.is-active {
        display: none;
      }
    }

    .arrow {
      top: 8px;
      right: 14px;
      width: 24px;
      height: 24px;
    }

    .list-icon {
      top: 7px;
      left: 14px;
      width: 28px;
      height: 28px;
    }

    &.vip {
      background-color: #f1f1f1;
    }

    .vip-text {
      position: relative;
      color: #56b9fe;

      svg {
        position: absolute;
        top: 2px;
        left: 47px;
      }
    }
  }
  .logout {
    margin: 15px auto;
    background: url("/static/image/mobile/tpl/theme3/home/logout_btn.png") 0 0
      no-repeat;
    background-size: 100%;
    width: 301px;
    line-height: 37px;
    color: #9c6e54;
    text-align: center;
  }
}
</style>
