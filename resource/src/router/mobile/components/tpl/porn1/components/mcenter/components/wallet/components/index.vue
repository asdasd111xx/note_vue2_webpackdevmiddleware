<template>
  <div :class="$style['my-wallet-wrap']">
    <div :class="$style['wallet-info-wrap']">
      <div>总金额(元)</div>

      <div :class="$style['money-block']">
        <span :class="$style['money']">{{ memInfo.balance.total }}</span>
        <div :class="$style['goDeposit']" @click="handleDeposit">
          去充值
        </div>
      </div>

      <div :class="$style['icon-block']">
        <div
          v-for="(item, index) in walletIcons"
          v-if="
            item.show ||
              (item.key === 'recharge' && siteConfig.MOBILE_WEB_TPL !== 'ey1')
          "
          :key="'icon-' + index"
          :class="$style['icon-cell']"
          @click="item.onClick"
        >
          <div :class="$style['image']">
            <img :src="$getCdnPath(item.imgSrc)" alt="icon" />
          </div>
          {{ item.text }}
        </div>
      </div>

      <div :class="[$style['wallet-desc-block']]">
        <div>钱包明细</div>
        <div @click="toggleTrans">
          点击查看全部场馆余额
          <i :class="[$style.expand, { [$style.collapse]: isShowTrans }]" />
        </div>
      </div>
    </div>

    <balance-tran v-if="isShowTrans" class="clearfix">
      <template scope="{ balanceTran , balanceBack}">
        <div>
          <div
            :class="[$style['balance-wrap'], 'clearfix']"
            @click="balanceBack()"
          >
            <div :class="$style['balance-total-item']">
              <img
                :src="
                  $getCdnPath(
                    '/static/image/_new/mcenter/balanceTrans/ic_wallet_center.png'
                  )
                "
              />
              <span> {{ $text("S_MCENTER_WALLET", "中心钱包") }} </span>
              <div :class="$style['balance-item-money']">
                {{ balanceTran.membalance.vendor.default.amount }}
              </div>
            </div>

            <div
              :class="[
                $style['recycle-btn'],
                balanceTran.balanceBackLock ? $style.disable : ''
              ]"
            >
              {{ $text("S_ONE_CLICK_TO_ACCOUNT") }}
            </div>
          </div>

          <div :class="[$style['balance-item-wrap'], 'clearfix']">
            <div
              v-for="(item, key, index) in balanceTran.balanceInfo"
              :key="`balance-item-${key}`"
              :class="[
                $style['balance-item'],
                {
                  [$style['is-last-item']]:
                    Object.keys(balanceTran.balanceInfo).length - index <=
                    (Object.keys(balanceTran.balanceInfo).length % 4 || 4)
                }
              ]"
            >
              <span :class="$style['balance-item-vendor']">{{
                item.text
              }}</span>
              <span
                v-if="item.maintain"
                :class="$style['balance-info-maintain']"
                @click="onClickMaintain(item.maintain)"
              >
                {{ $t("S_MAINTAIN") }}
                <img
                  :src="
                    $getCdnPath(
                      '/static/image/_new/mcenter/balanceTrans/icon_transfer_tips_info.png'
                    )
                  "
                  :class="$style['balance-wrench']"
                />
              </span>
              <span v-else :class="$style['balance-item-money']">{{
                item.amount
              }}</span>
            </div>
          </div>
        </div>
      </template>
    </balance-tran>

    <div :class="$style['invite-wrap']" @click="onClickInvite">
      <template v-if="siteConfig.MOBILE_WEB_TPL === 'porn1'">
        <div :class="$style['content']">
          <div>邀请好友获得现金奖励</div>
          <div>邀请人首存即可获得</div>
        </div>
      </template>
      <template v-else="siteConfig.MOBILE_WEB_TPL === 'ey1'">
        <div :class="$style['content']">
          <div>日薪月薪不如推荐加薪</div>
          <div>分享入金稳拿奖金</div>
        </div>
      </template>
      <div :class="$style['image']">
        <img
          :src="
            $getCdnPath(
              `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/wallet/img_wallter.png`
            )
          "
          alt="wallter"
        />
      </div>
    </div>

    <div :class="$style['wager-wrap']">
      <div :class="$style['title']">
        投注记录
        <span @click="$router.push('/mobile/mcenter/betRecord')">查看更多</span>
      </div>

      <template v-if="!mainNoData">
        <div :class="$style['list']">
          <div
            v-for="(item, index) in mainListData.slice(0, 5)"
            :key="'cell-' + index"
            :class="$style['cell']"
          >
            <div :class="$style['vendor']">
              {{ getVendorName(item.vendor, item.kind) }}
            </div>

            <div :class="$style['game-desc']">
              <span :class="$style['game']">{{ item.game_name }}</span>
              <span :class="$style['money']">{{
                parseFloat(item.valid_bet).toFixed(2)
              }}</span>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div :class="$style['no-data']">
          还没有任何投注记录
        </div>
      </template>
    </div>

    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        <div
          style="background-color: transparent ; margin: 0 ; padding: 0"
          v-html="msg"
        />
      </div>
    </message>
  </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import { getCookie } from '@/lib/cookie';
import ajax from '@/lib/ajax';
import axios from 'axios'
import balanceTran from '@/components/mcenter/components/balanceTran';
import EST from '@/lib/EST';
import message from "@/router/mobile/components/common/message";
import Vue from 'vue';
import withdrawAccount from '@/router/mobile/components/common/withdrawAccount/withdrawAccount';
import yaboRequest from '@/api/yaboRequest';

export default {
  components: {
    balanceTran,
    message
  },
  data() {
    return {
      msg: '',
      estToday: EST(new Date(), '', true),
      limitDate: '',
      startTime: '',
      endTime: '',
      isShowTrans: false,
      mainListData: [],
      mainNoData: false,
      isCheckWithdraw: false,
      walletIcons: [
        {
          key: 'transfer',
          show: true,
          text: this.$text('S_TRANSFER', '转帐'),
          imgSrc: '/static/image/_new/mcenter/wallet/ic_wallter_tranfer.png',
          onClick: () => {
            this.$router.push('/mobile/mcenter/balanceTrans');
          }
        },
        {
          key: 'withdraw',
          show: true,
          text: this.$text('S_WITHDRAWAL_TEXT', '提现'),
          imgSrc: '/static/image/_new/mcenter/wallet/ic_wallter_withdraw.png',
          onClick: () => {
            if (this.siteConfig.MOBILE_WEB_TPL !== 'ey1') {
              this.$router.push('/mobile/mcenter/withdraw');
              return;
            }

            if (this.isCheckWithdraw) { return; }
            this.isCheckWithdraw = true;
            axios({
              method: 'get',
              url: '/api/v2/c/withdraw/check',
            }).then((res) => {
              this.isCheckWithdraw = false;

              if (res.data.result === "ok") {
                let check = true;

                Object.keys(res.data.ret).forEach(i => {
                  if (i !== "bank" && !res.data.ret[i]) {
                    if (this.siteConfig.MOBILE_WEB_TPL === 'ey1') {
                      this.actionSetGlobalMessage({
                        msg: '请先完成您的出款资讯', cb: () => {
                          {
                            this.$router.push('/mobile/withdrawAccount');
                          }
                        }
                      })
                    }

                    if (this.siteConfig.MOBILE_WEB_TPL === 'porn1') {
                      this.actionSetGlobalMessage({
                        msg: '请先设定提现资料', cb: () => {
                          {
                            this.$router.push(`/mobile/mcenter/accountData?reqAccount=wallet`);
                          }
                        }
                      })
                    }

                    check = false;
                    return;
                  }
                })

                if (check) {
                  this.$router.push('/mobile/mcenter/withdraw');
                }
              } else {
                this.actionSetGlobalMessage({ msg: res.data.msg, code: res.data.msg.code });
              }
            }).catch(res => {
              if (res.response.data) {
                this.actionSetGlobalMessage({ msg: res.response.data.msg, code: res.data.msg.code, cb: () => { } });
              }
              this.isCheckWithdraw = false;
            });
          }
        },
        {
          key: 'recharge',
          show: false,
          text: this.$text("S_CREDIT_TRANSFER", "额度转让"),
          imgSrc: '/static/image/_new/mcenter/wallet/ic_wallet_trans.png',
          onClick: () => {
            this.actionGetMemInfoV3().then(() => {
              this.actionGetRechargeStatus('');
            })
          }
        },
        {
          key: 'card',
          show: true,
          text: this.$text('S_MARANGE_CARD', '卡片管理'),
          imgSrc: '/static/image/_new/mcenter/wallet/ic_wallter_manage.png',
          onClick: () => {
            this.$router.push('/mobile/mcenter/bankCard');
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
      gameData: 'getGameData',
      siteConfig: 'getSiteConfig',
      hasBank: 'getHasBank',
      rechargeConfig: 'getRechargeConfig',
    }),
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
  },
  created() {
    if (!this.loginStatus) {
      this.$router.push('/mobile/login');
    }

    this.startTime = Vue.moment(this.estToday)
      .add(-30, 'days')
      .format('YYYY-MM-DD');
    this.endTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
  },
  mounted() {
    this.getRecordList();
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage',
      'actionGetRechargeStatus',
      'actionGetMemInfoV3'
    ]),
    handleDeposit() {
      this.$router.push(`/mobile/mcenter/deposit`);
      //   0706 統一RD5判斷銀行卡
      //   yaboRequest({
      //     method: 'get',
      //     url: `${this.siteConfig.YABO_API_DOMAIN}/AccountBank/GetBankBindingStatus/${getCookie('cid')}`,
      //     timeout: 30000,
      //     headers: {
      //       'x-domain': this.memInfo.user.domain
      //     }
      //   }).then((res) => {
      //     if (res.data) {
      //       this.$router.push(`/mobile/mcenter/deposit`);
      //     }
      //     else {
      //       this.msg = "请先绑定提现银行卡"

      //       setTimeout(() => {
      //         this.$router.push('/mobile/mcenter/bankCard?redirect=wallet');
      //       }, 2500)
      //     }
      //   });
    },
    handleClick(path) {
      this.$router.push(path);
    },
    onClickInvite() {
      this.$router.push('/mobile/mcenter/makeMoney');
    },
    toggleTrans() {
      this.isShowTrans = !this.isShowTrans;
    },
    getRecordList() {
      const params = {
        start_at: Vue.moment(this.startTime).format(
          'YYYY-MM-DD 00:00:00-04:00'
        ),
        end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00')
      };

      // 各遊戲注單統計資料(依投注日期)
      ajax({
        method: 'get',
        url: '/api/v1/c/stats/wager-report/by-day-game',
        params,
        success: (response) => {
          if (response.ret.length === 0) {
            this.mainListData = [];
            this.mainNoData = true;
            return;
          }

          this.mainListData = response.ret;
          this.mainNoData = false;
        }
      });
    },
    onClickMaintain(value) {
      this.msg = `美东时间：
          <br>
          <span>${value.etc_start_at}</span>
          <p style="margin: 0 ; padding: 0 ; text-align: center">|</p>
          <span>${value.etc_end_at}</span>
          <p></p>
          北京时间：
          <br>
          <span>${value.start_at}</span>
          <p style="margin: 0 ; padding: 0 ; text-align: center">|</p>
          <span>${value.end_at}</span>
        `;
    },
    getVendorName(vendor, kind) {
      if (!this.memInfo.vendors.find((item) => item.vendor === vendor && item.kind === kind)) {
        return this.$t(Object.keys(this.gameData).map((key) => {
          if (this.gameData[key].vendor === vendor) {
            return this.gameData[key].text;
          }

          return '';
        }).join(''));
      }
      return this.memInfo.vendors.find((item) => item.vendor === vendor && item.kind === kind).alias;
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.index.scss" module="$style_ey1"></style>
