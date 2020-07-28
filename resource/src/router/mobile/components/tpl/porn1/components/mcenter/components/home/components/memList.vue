<template>
  <div :class="$style['mem-list']">
    <template v-for="listInfo in list">
      <div
        v-if="listInfo.pageName !== 'super' || isShowSuper"
        :key="`list-${listInfo.pageName}`"
        :class="[
          $style.list,
          { [$style['list-part']]: listInfo.isPart },
          { [$style['list-border-bottom']]: !listInfo.isPart }
        ]"
        @click="onListClick(listInfo)"
      >
        <div :class="$style['list-icon']">
          <img
            :src="
              $getCdnPath(`/static/image/_new/mcenter/ic_${listInfo.image}.png`)
            "
          />
        </div>
        <span>{{ $text(listInfo.name, listInfo.initName) }}</span>

        <div v-if="listInfo.info" :class="$style['list-info']">
          {{ listInfo.info }}
        </div>
        <div :class="$style['btn-next']">
          <img
            :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
          />
        </div>
      </div>
    </template>

    <div :class="$style.list" @click="showShare">
      <div :class="$style['list-icon']">
        <img :src="$getCdnPath(`/static/image/_new/mcenter/ic_share.png`)" />
      </div>
      <span>{{ $text("S_SHARE_APP", "分享APP") }}</span>

      <div :class="$style['btn-next']">
        <img
          :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
        />
      </div>
    </div>

    <div
      v-if="memInfo.config.content_rating"
      :class="[$style['list'], $style['list-part']]"
    >
      <div :class="$style['list-icon']">
        <img :src="$getCdnPath(`/static/image/_new/mcenter/ic_18+.png`)" />
      </div>
      <span>{{ $text("S_PORN_SWITCH", "色站开关") }}</span>
      <label
        :class="[$style['switch'], { [$style.active]: pornSwitchState }]"
        @click="toggleSwitch"
      >
        <span />
      </label>
    </div>
    <!-- Share Modal -->
    <share v-if="isShowShare" :is-show-share.sync="isShowShare" />
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import common from '@/api/common';
import ajax from '@/lib/ajax';
import { API_MCENTER_DESPOSIT_AMOUNT } from '@/config/api';
import mobileLinkOpen from '@/lib/mobile_link_open';
import share from './share';
import { getCookie } from '@/lib/cookie';
import yaboRequest from "@/api/yaboRequest";
import bbosRequest from "@/api/bbosRequest";
import axios from 'axios'
export default {
  components: {
    share,
  },
  data() {
    return {
      isReceive: false,
      toggleShare: false,
      requiredMoney: 'load',
      superErrorMsg: '', // 超級簽錯誤訊息
      isShowSuper: false, // *顯示超級簽開關
      superAppUrl: '', // 超級簽URL
      list: [
        {
          initName: '下载超级签，成为超级会员',
          name: 'S_VIP_APP',
          path: '',
          pageName: 'super',
          image: 'vip',
          isPart: true
        },
        {
          initName: '帮助中心',
          name: 'S_HELP_CENTER',
          path: '/mobile/mcenter/help',
          pageName: 'help',
          image: 'help',
          info: '存提现、投注有疑问，看这里',
          isPart: true

        },
        {
          initName: '关于鸭博娱乐',
          name: 'S_ABOUT_YABOLIVE',
          path: '/mobile/mcenter/about',
          pageName: 'about',
          image: 'about',
          isPart: false

        },
        {
          initName: '我的推广',
          name: 'S_TEAM_CENTER',
          path: '/mobile/mcenter/tcenter/management',
          pageName: 'mypromotion',
          image: 'mypromotion',
          info: '合营计划',
          isPart: false
        }
        // {
        //   initName: '分享APP', name: 'S_SHARE_APP', path: '/mobile/mcenter/about', pageName: 'share', image: 'share'
        // },
        // {
        //   initName: '色站开关', name: 'S_PORN_SWITCH', path: '', pageName: '', image: '18+'
        // },

        // 原舊版亞博
        // {
        //   initName: '在线客服', name: 'S_CUSTOMER_SERVICE_ONLINE', path: '', pageName: 'service', image: 'service'
        // }, // 在線客服
        // {
        //   initName: '帐户资料', name: 'S_ACCOUNT_DATA', path: '/mobile/mcenter/accountData', pageName: 'accountData', image: 'account_data'
        // }, // 個人資料
        // {
        //   initName: '我的推广', name: 'S_TEAM_CENTER', path: '/mobile/mcenter/tcenter', pageName: 'tcenter', image: 'my_promote'
        // }, // 我的推廣
        // {
        //   initName: '绑定银行卡', name: 'S_BIND_BANK', path: '/mobile/mcenter/bankCard', pageName: 'accountBankCard', image: 'bank_info'
        // }, // 銀行卡管理
        // {
        //   initName: '资金明细', name: 'S_FUNDS_DETAILS', path: '/mobile/mcenter/moneyDetail', pageName: 'bankMoneyDetail', image: 'money_detail'
        // }, // 交易記錄
        // {
        //   initName: '投注纪录', name: 'S_BETHISTORYBTN', path: '/mobile/mcenter/betRecord', pageName: 'betRecord', image: 'bet_record'
        // }, // 投注記錄
        // {
        //   initName: '实时返水', name: 'S_REAL_TIME_REBATE', path: '/mobile/mcenter/bankRebate', pageName: 'bankRebate', image: 'bank_rebate'
        // }, // 實時返水
        // {
        //   initName: '红利帐户', name: 'S_BONUS_ACCOUNT', path: '/mobile/mcenter/bonusAccount', pageName: 'bonusAccount', image: 'bonus_account'
        // }, // 紅利帳戶
        // {
        //   initName: '信息中心', name: 'S_MSG_CENTER', path: '/mobile/mcenter/information/post', pageName: 'information', image: 'info_post'
        // } // 信息中心
      ],
      pornSwitchState: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      onlineService: 'getOnlineService',
      loginStatus: 'getLoginStatus',
      siteConfig: "getSiteConfig",
    }),
    isShowShare: {
      get() {
        return this.toggleShare;
      },
      set(value) {
        this.toggleShare = value;
      }
    }
  },
  created() {
    if (localStorage.getItem('content_rating')) {
      this.pornSwitchState = localStorage.getItem('content_rating') === "1" ? true : false;
    } else {
      this.pornSwitchState = this.memInfo.config.content_rating && this.memInfo.user.content_rating;
    }

    let type = "ccf";

    // switch (this.memInfo.user.domain) {
    //   case "500015":
    //   case "69":
    //     type = "ccf_demo";
    //     break;
    //   default:
    //   case "67":
    //     type = "ccf";
    //     break;
    // }

    yaboRequest({
      method: "get",
      url: `${this.siteConfig.YABO_API_DOMAIN}/System/config`,
      params: {
        type: type
      },
      headers: {
        AuthToken: "YaboAPIforDev0nly"
      }
    }).then(res => {
      if (res && res.data) {
        this.isShowSuper = res.data.find(i => i.name === "VipDownload").value === "true";
      }
    });

    // 超級籤需滿足的最低金額
    const requiredMoney = 200;
    if (!this.loginStatus) return;

    // 會員存款狀態
    axios({
      method: 'get',
      url: '/api/v1/c/user-stat/deposit-withdraw',
    }).then(res => {
      if (res && res.data && res.data.ret.deposit_total) {
        const depositTotal = Number(res.data.ret.deposit_total);
        //   超級簽需求200充值
        if (depositTotal >= requiredMoney) {
          this.requiredMoneyStatus = 'ok';
          return;
        } else {
          this.superErrorMsg = this.$text(
            'S_VIP_ONLY_DOWNLOAD',
            '充值超过％s即可下载'
          ).replace('％s', requiredMoney);
        }
      }
    }).catch(error => {
      console.log(error);
    })

    // common.systemTime({
    //   success: (response) => {
    //     let today = '';
    //     if (response.result !== 'ok') {
    //       today = new Date().toISOString()
    //     } else {
    //       today = response.ret
    //     }

    //     ajax({
    //       // 會員存款總額
    //       method: 'get',
    //       url: API_MCENTER_DESPOSIT_AMOUNT,
    //       params: {
    //         start_at: '2020-03-01 00:00:00-04:00',
    //         end_at: Vue.moment(today).format(
    //           'YYYY-MM-DD HH:mm:ss-04:00'
    //         )
    //       },
    //       errorAlert: false,
    //       success: ({
    //         result, ret, msg, code
    //       }) => {
    //         if (result !== 'ok') {
    //           const errorCode = code || '';
    //           this.superErrorMsg = `${msg} ${errorCode}`;
    //           return;
    //         }
    //         if (ret && +ret >= requiredMoney) {
    //           this.requiredMoneyStatus = 'ok';
    //           return;
    //         }

    //         this.superErrorMsg = this.$text(
    //           'S_VIP_ONLY_DOWNLOAD',
    //           '充值超过％s即可下载'
    //         ).replace('％s', requiredMoney);
    //       },
    //       fail: (error) => {
    //         if (error && error.data) {
    //           this.superErrorMsg = error.data.msg;
    //         }
    //       }
    //     });
    //   },
    //   fail: (error) => {
    //     if (error && error.data) {
    //       this.superErrorMsg = error.data.msg;
    //     }
    //   }
    // });

    setTimeout(() => {
      bbosRequest({
        method: "get",
        url: this.siteConfig.BBOS_DOMIAN + "/App/Download",
        reqHeaders: {
          Vendor: 67
        },
        params: {
          lang: 'zh-cn',
          bundleID: 'chungyo.foxyporn.prod.enterprise.vip',
          platform: 1,
        }
      }).then(res => {
        this.superAppUrl = res.data.url;
      });
    })
  },
  methods: {
    ...mapActions(['actionEnterMCenterThirdPartyLink',
      'actionSetUserdata',
      'actionSetGlobalMessage'
    ]),
    mobileLinkOpen,
    onListClick(item) {
      if (item.pageName === 'super') {
        if (!this.loginStatus) {
          this.$router.push('/mobile/login');
          return;
        }

        if (this.requiredMoneyStatus === "ok") {
          // 超級籤app下載網址
          const appUrl = this.superAppUrl || 'https://user.51cjq.xyz/pkgs/ybsp2.app';
          let isWebView = getCookie('platform') === "H" || window.location.host === "yaboxxxapp02.com";
          if (isWebView) {
            window.location.href = appUrl;
          } else {
            window.open(appUrl, '_blank');
          }
        } else {
          this.actionSetGlobalMessage({ msg: this.superErrorMsg });
        }

        return;
      }

      if (item.pageName === 'service') {
        if (!this.onlineService.url) {
          return;
        }

        this.mobileLinkOpen({ linkType: 'static', linkTo: 'service' });
        return;
      }

      if (item.pageName === 'mypromotion') {
        if (!this.loginStatus) {
          this.$router.push('/mobile/login');
          return;
        }
      }

      if (item.pageName === 'bankRebate') {
        this.actionEnterMCenterThirdPartyLink({
          type: 'member',
          page: item.pageName
        }).then((pageName) => {
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
 * 色站開關 狀態切換
 * @function toggleSwitch
 * @param {string} e - input argument
 */
    toggleSwitch() {
      if (!this.loginStatus) {
        this.$router.push('/mobile/joinmember');
        return;
      }
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
          localStorage.setItem('content_rating', (+!this.pornSwitchState));
          this.memInfo.user.content_rating = +!this.pornSwitchState;
          this.pornSwitchState = !this.pornSwitchState;
          this.isReceive = false;
        }
      });
    },

    showShare() {
      this.isShowShare = true;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.mem-list {
  background-color: $main_background_white1;
}

.list-part {
  margin: 10px 0;
}

.list-border-bottom {
  border-bottom: 1px solid #eee;
}

.list {
  position: relative;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  background-color: $main_white_color1;
  color: $main_text_color3;

  > span {
    width: 100%;
    padding: 0 5px;
  }

  .btn-next {
    width: 14px;
    height: 100%;
    display: flex;
    align-items: center;
    > img {
      height: 14px;
      width: 14px;
    }
  }

  .list-icon {
    width: 21px;
    height: 21px;
    display: flex;
    align-items: center;
    margin-right: 5px;

    > img {
      height: 100%;
    }
  }
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
  position: relative;
  display: block;
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background-color: #ccc;
  transition: all 0.4s;

  > span {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
    transition: all 0.4s;
    display: block;
    left: 0;
    position: absolute;
  }

  &.active {
    background-color: #7d87a3;

    > span {
      display: block;
      left: 18px;
      position: absolute;
    }
  }
}
.list-info {
  color: #9ca3bf;
  font-size: 12px;
  position: absolute;
  right: 38px;
}

@media screen and (min-width: $phone) {
  .list {
    font-size: 14px;
  }
}

@media screen and (min-width: $pad) {
  .list {
    font-size: 15px;
  }
}
</style>
