<template>
  <div class="mem-list">
    <div
      v-for="listInfo in list"
      :key="`list-${listInfo.pageName}`"
      :class="$style.list"
      @click="onListClick(listInfo)"
    >
      <img
        :class="$style['list-icon']"
        :src="
          $getCdnPath(
            `/static/image/mobile/tpl/porn1/mcenter/${listInfo.image}_icon_n.png`
          )
        "
      />
      <span>{{ $text(listInfo.name, listInfo.initName) }}</span>
      <img
        :class="$style['arrow']"
        :src="
          $getCdnPath('/static/image/mobile/tpl/porn1/mcenter/icon_goto_n.png')
        "
      />
      <img
        :class="[$style['is-active'], $style['arrow']]"
        :src="
          $getCdnPath('/static/image/mobile/tpl/porn1/mcenter/icon_goto_h.png')
        "
      />
    </div>
    <div v-if="memInfo.config.content_rating" :class="$style['switch-list']">
      <img
        :class="$style['list-icon']"
        :src="
          $getCdnPath(
            `/static/image/mobile/tpl/porn1/mcenter/porn_switch_icon_n.png`
          )
        "
      />
      <span>{{ $text("S_PORN_SWITCH", "色站开关") }}</span>
      <label
        :class="[$style['switch'], { [$style.active]: pornSwitchState }]"
        @click="toggleSwitch"
      >
        <span />
      </label>
    </div>
    <div :class="$style['logout']" @click="onLogout()">
      {{ $text("S_LOGOUT2", "退出登录") }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import member from '@/api/member';
import common from '@/api/common';
import ajax from '@/lib/ajax';
import { API_MCENTER_DESPOSIT_AMOUNT } from '@/config/api';
import mobileLinkOpen from '@/lib/mobile_link_open';

export default {
  data() {
    return {
      isReceive: false,
      list: [
        // {
        //   initName: '下载超级签，成为超级会员', name: 'S_VIP_APP', path: '', pageName: 'super', image: 'download'
        // }, // 超級籤
        {
          initName: '在线客服', name: 'S_CUSTOMER_SERVICE_ONLINE', path: '', pageName: 'service', image: 'service'
        }, // 在線客服
        {
          initName: '帐户资料', name: 'S_ACCOUNT_DATA', path: '/mobile/mcenter/accountData', pageName: 'accountData', image: 'account_data'
        }, // 個人資料
        {
          initName: '我的推广', name: 'S_TEAM_CENTER', path: '/mobile/mcenter/tcenter', pageName: 'tcenter', image: 'my_promote'
        }, // 我的推廣
        {
          initName: '绑定银行卡', name: 'S_BIND_BANK', path: '/mobile/mcenter/bankCard', pageName: 'accountBankCard', image: 'bank_info'
        }, // 銀行卡管理
        {
          initName: '资金明细', name: 'S_FUNDS_DETAILS', path: '/mobile/mcenter/moneyDetail', pageName: 'bankMoneyDetail', image: 'money_detail'
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
          initName: '信息中心', name: 'S_MSG_CENTER', path: '/mobile/mcenter/information/post', pageName: 'information', image: 'info_post'
        } // 信息中心
      ],
      vipData: {},
      pornSwitchState: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      onlineService: 'getOnlineService'
    })
  },
  created() {
    this.pornSwitchState = this.memInfo.config.content_rating && this.memInfo.user.content_rating;

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
  methods: {
    ...mapActions([
      'actionEnterMCenterThirdPartyLink',
      'actionSetUserdata'
    ]),
    mobileLinkOpen,
    onListClick(item) {
      if (item.pageName === 'super') {
        // 超級籤需滿足的最低金額
        const requiredMoney = 200;
        // 超級籤app下載網址
        const appUrl = 'https://www.sxkuge.com/3B2BF7AC5674E8E2';
        // 暫時用來判斷馬甲包
        const webview = window.location.hostname === 'yaboxxxapp02.com';
        const isUBMobile = navigator.userAgent.match(/UBiOS/) !== null && navigator.userAgent.match(/iPhone/) !== null;
        let newWindow = '';

        if (!isUBMobile && !webview) {
          newWindow = window.open('');
        }
        common.systemTime({
          errorAlert: isUBMobile || webview,
          success: (response) => {
            if (response.result !== 'ok') {
              return;
            }

            ajax({ // 會員存款總額
              method: 'get',
              url: API_MCENTER_DESPOSIT_AMOUNT,
              params: {
                start_at: '2020-03-01 00:00:00-04:00',
                end_at: Vue.moment(response.ret).format('YYYY-MM-DD HH:mm:ss-04:00')
              },
              errorAlert: isUBMobile || webview,
              success: ({
                result, ret, msg, code
              }) => {
                if (result !== 'ok') {
                  const errorCode = code || '';

                  if (!isUBMobile && !webview) {
                    newWindow.alert(`${msg} ${errorCode}`);
                    newWindow.close();
                    return;
                  }
                  alert(`${msg} ${errorCode}`);
                  return;
                }

                if (ret && +ret >= requiredMoney) {
                  if (webview) {
                    window.location.href = appUrl;
                    return;
                  }
                  if (!isUBMobile) {
                    newWindow.location.href = appUrl;
                    return;
                  }
                  window.open(appUrl, '_blank');
                  return;
                }

                if (!isUBMobile && !webview) {
                  newWindow.alert(this.$text('S_VIP_ONLY_DOWNLOAD', '充值超过％s即可下载').replace('％s', requiredMoney));
                  newWindow.close();
                  return;
                }
                alert(this.$text('S_VIP_ONLY_DOWNLOAD', '充值超过％s即可下载').replace('％s', requiredMoney));
              },
              fail: (error) => {
                if (!isUBMobile && !webview) {
                  newWindow.alert(`${error.data.msg} ${error.data.code ? `(${error.data.code})` : ''}`);
                  newWindow.close();
                }
              }
            });
          },
          fail: (error) => {
            if (!isUBMobile && !webview) {
              newWindow.alert(`${error.data.msg} ${error.data.code ? `(${error.data.code})` : ''}`);
              newWindow.close();
            }
          }
        });
        return;
      }

      if (item.pageName === 'service') {
        if (!this.onlineService.url) {
          return;
        }

        this.mobileLinkOpen({ linkType: 'static', linkTo: 'service' });
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
      }

      mcenterPageAuthControl(item.pageName).then((response) => {
        if (response && response.status) {
          this.$router.push(item.path);
        }
      });
    },
    /**
     * 登出
     * @method onLogout
     */
    onLogout() {
      member.logout().then(() => { window.location.reload(); });
    },
    /**
     * 色站開關 狀態切換
     * @function toggleSwitch
     * @param {string} e - input argument
     */
    toggleSwitch() {
      if (!this.memInfo.config.content_rating) {
        return;
      }

      if (this.isReceive) {
        return;
      }

      this.isReceive = true;

      mcenter.accountDataSet({
        params: {
          content_rating: +!this.pornSwitchState
        },
        success: () => {
          this.memInfo.user.content_rating = +!this.pornSwitchState;
          this.pornSwitchState = !this.pornSwitchState;
          this.isReceive = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.list {
  position: relative;
  border-bottom: 1px solid #242424;
  background: url("/static/image/mobile/tpl/porn1/home/mem_list_bg.png") 0 0
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
    background: url("/static/image/mobile/tpl/porn1/home/mem_list_bg_active.png")
      0 0 no-repeat;
    color: #5c4030;

    .arrow {
      display: none;

      &.is-active {
        display: block;
      }
    }
  }
}

.switch-list {
  position: relative;
  border-bottom: 1px solid #242424;
  background: url("/static/image/mobile/tpl/porn1/home/mem_list_bg.png") 0 0
    no-repeat;
  background-size: 100%;
  padding-left: 50px;
  width: 100%;
  height: 43px;
  line-height: 43px;
  font-size: 14px;
  color: #f8f1eb;
  display: block;
}

.list-icon {
  position: absolute;
  top: 7px;
  left: 14px;
  width: 28px;
  height: 28px;
}

.arrow {
  position: absolute;
  top: 8px;
  right: 14px;
  width: 24px;
  height: 24px;

  &.is-active {
    display: none;
  }
}

.switch {
  display: block;
  position: absolute;
  top: 9px;
  right: 9px;
  width: 42px;
  height: 24px;
  border-radius: 12px;
  background-color: #ccc;
  transition: all 0.4s;

  > span {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
    transition: all 0.4s;
  }

  &.active {
    background-color: #32db64;

    > span {
      left: 18px;
    }
  }
}

.logout {
  margin: 15px auto;
  background: url("/static/image/mobile/tpl/porn1/home/logout_btn.png") 0 0
    no-repeat;
  background-size: 100%;
  width: 301px;
  line-height: 37px;
  color: #9c6e54;
  text-align: center;
}

@media screen and (min-width: $phone) {
  .list,
  .switch-list {
    font-size: 15px;
  }
}

@media screen and (min-width: $pad) {
  .list,
  .switch-list {
    font-size: 16px;
  }

  .logout {
    font-size: 16px;
  }
}
</style>
