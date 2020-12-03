<template>
  <div :class="$style['my-wallet-wrap']">
    <div :class="$style['wallet-info-wrap']">
      <div>总金额(元)</div>

      <div :class="$style['money-block']">
        <span :class="$style['money']">{{ memInfo.balance.total }}</span>
        <div :class="$style['goDeposit']" @click="handleDeposit">去充值</div>
      </div>

      <div :class="$style['icon-block']">
        <div
          v-if="item.show || (item.key === 'recharge' && themeTPL !== 'ey1')"
          v-for="(item, index) in walletIcons"
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
              :class="$style['balance-item']"
              @click="$router.push('/mobile/mcenter/bonus')"
            >
              <span :class="$style['balance-item-vendor']">
                <template v-if="themeTPL === 'porn1'">
                  {{ $text("S_BONUS", "红利彩金") }}
                </template>

                <template v-if="themeTPL === 'ey1'">
                  {{ $text("S_BONUS_ACCOUNT", "红利帐户") }}
                </template>
              </span>

              <span :class="$style['balance-item-money']">
                {{ bonus.balance }}
              </span>
            </div>

            <div
              v-for="(item, key, index) in balanceTran.balanceInfo"
              :key="`balance-item-${key}`"
              :class="[
                $style['balance-item'],
                {
                  [$style['is-last-item']]:
                    Object.keys(balanceTran.balanceInfo).length - 1 - index <=
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

    <template v-if="themeTPL === 'porn1'">
      <div :class="$style['swag-wrap']">
        <div :class="$style['title']">SWAG钱包</div>
        <div :class="$style['icon-block']">
          <div :class="$style['icon-cell']">
            <div :class="$style['balance']" @click="handleSWAGBalance">
              <template v-if="isMaintainSwag">
                <span :class="$style['maintain-tip-text']">维护中</span>
                <img
                  v-if="isMaintainSwag && swagConfig && swagConfig.enable !== 0"
                  :class="$style['maintain-tip-img']"
                  :src="
                    $getCdnPath('/static/image/porn1/mcenter/swag/ic_tips.png')
                  "
                />
              </template>
              <template v-else>
                {{ swagDiamondBalance }}
              </template>
            </div>
            {{ $t("S_DIAMOND_BALANCE") }}
          </div>

          <div
            v-for="(item, index) in swagIcons"
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
      </div>
    </template>

    <div :class="$style['invite-wrap']" @click="onClickInvite">
      <template v-if="themeTPL === 'porn1'">
        <div :class="$style['content']">
          <div>邀请好友获得现金奖励</div>
          <div>邀请人首存即可获得</div>
        </div>
      </template>

      <template v-if="themeTPL === 'ey1'">
        <div :class="$style['content']">
          <div>日薪月薪不如推荐加薪</div>
          <div>分享入金稳拿奖金</div>
        </div>
      </template>

      <div :class="$style['image']">
        <img
          :src="
            $getCdnPath(
              `/static/image/${themeTPL}/mcenter/wallet/img_wallter.png`
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
        <div :class="$style['no-data']">还没有任何投注记录</div>
      </template>
    </div>

    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        <div
          style="background-color: transparent; margin: 0; padding: 0"
          v-html="msg"
        />
      </div>
    </message>

    <maintain-block
      v-if="maintainInfo"
      :content="maintainInfo"
      @close="handleCloseMaintainInfo"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getCookie } from "@/lib/cookie";
import ajax from "@/lib/ajax";
import axios from "axios";
import balanceTran from "@/components/mcenter/components/balanceTran";
import EST from "@/lib/EST";
import message from "@/router/mobile/components/common/message";
import Vue from 'vue';
import withdrawAccount from '@/router/mobile/components/common/withdrawAccount/withdrawAccount';
import yaboRequest from '@/api/yaboRequest';
import mixin from "@/mixins/mcenter/swag/swag";
import maintainBlock from "@/router/mobile/components/common/maintainBlock";

export default {
  components: {
    balanceTran,
    message,
    maintainBlock
  },
  mixins: [mixin],
  data() {
    return {
      msg: "",
      estToday: EST(new Date(), "", true),
      limitDate: "",
      startTime: "",
      endTime: "",
      isShowTrans: false,
      mainListData: [],
      mainNoData: false,
      isCheckWithdraw: false,
      bonus: {},
      swagDiamondBalance: '0',
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
      swagConfig: "getSwagConfig",
      swagBalance: "getSwagBalance",
    }),
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL
    },
    swagIcons() {
      return [
        {
          key: 'buyDiamond',
          show: true,
          text: this.$text('S_BUY_DIAMOND', '购买钻石'),
          imgSrc: `/static/image/${this.themeTPL}/mcenter/wallet/ic_wallter_swag_buydiamond.png`,
          onClick: () => {
            this.$router.push('/mobile/mcenter/swag');
          }
        },
        {
          key: 'howToBuy',
          show: true,
          text: this.$text('S_TO_BUY', '如何购买'),
          imgSrc: `/static/image/${this.themeTPL}/mcenter/wallet/ic_wallter_swag_howtobuy.png`,
          onClick: () => {
            this.$router.push('/mobile/mcenter/help/detail?type=buymethod');
          }
        },
        {
          key: 'instrustions',
          show: true,
          text: this.$text('S_INSTRUSTIONS', '使用方法'),
          imgSrc: `/static/image/${this.themeTPL}/mcenter/wallet/ic_wallter_swag_instrustions.png`,
          onClick: () => {
            this.$router.push('/mobile/mcenter/help/detail?type=usage&key=2');
          }
        },
      ].filter(item => item.show)
    },
    walletIcons() {
      return [
        {
          key: "transfer",
          show: true,
          text: this.$text('S_TRANSFER', '转帐'),
          imgSrc: `/static/image/${this.themeTPL}/mcenter/wallet/ic_wallter_tranfer.png`,
          onClick: () => {
            if (this.themeTPL === "porn1") {
              this.$router.push("/mobile/mcenter/balanceTrans");
              return;
            }

            if (this.themeTPL === "ey1") {

              axios({
                method: 'get',
                url: '/api/v2/c/domain-config',
              }).then(res => {
                let withdraw_info_before_bet = false;
                if (res && res.data && res.data.ret) {
                  withdraw_info_before_bet = res.data.ret.withdraw_info_before_bet;
                }

                if (withdraw_info_before_bet) {
                  this.checkWithdrawData('balanceTrans');
                  return;
                }

                this.$router.push("/mobile/mcenter/balanceTrans");
              }).catch((res) => {
                this.actionSetGlobalMessage({
                  msg: res.data.msg, code: res.data.code, origin: 'wallet'
                });
              })
            }
          }
        },
        {
          key: "withdraw",
          show: true,
          text: this.$text('S_WITHDRAWAL_TEXT', '提现'),
          imgSrc: `/static/image/${this.themeTPL}/mcenter/wallet/ic_wallter_withdraw.png`,
          onClick: () => {
            if (this.themeTPL === "porn1") {
              this.$router.push("/mobile/mcenter/withdraw");
              return;
            }

            if (this.themeTPL === "ey1") {
              this.checkWithdrawData('withdraw');
              return;
            }
          }
        },
        {
          key: "recharge",
          show: false,
          text: this.$text("S_CREDIT_TRANSFER", "额度转让"),
          imgSrc: `/static/image/${this.themeTPL}/mcenter/wallet/ic_wallet_trans.png`,
          onClick: () => {
            this.actionGetMemInfoV3().then(() => {
              this.actionGetRechargeStatus("wallet");
            });
          }
        },
        {
          key: "card",
          show: true,
          text: this.$text('S_MARANGE_CARD', '卡片管理'),
          imgSrc: `/static/image/${this.themeTPL}/mcenter/wallet/ic_wallter_manage.png`,
          onClick: () => {
            this.$router.push("/mobile/mcenter/bankCard");
          }
        }
      ]
    }
  },
  created() {
    if (!this.loginStatus) {
      this.$router.push("/mobile/login");
    }

    if (this.themeTPL === 'porn1') {
      this.initSWAGConfig();
    }

    this.startTime = Vue.moment(this.estToday)
      .add(-30, "days")
      .format("YYYY-MM-DD");
    this.endTime = Vue.moment(this.estToday).format("YYYY-MM-DD");
    //紅利帳戶api
    axios.get("/api/v1/c/gift-card").then(response => {
      if (response.data.result === "ok") {
        this.bonus = response.data.total;
      }
    });

    // 清除交易紀錄搜尋快取
    localStorage.removeItem('money-detail-params');
    localStorage.removeItem('money-detail-params-service');
    localStorage.removeItem('money-detail-params-category');
    localStorage.removeItem('money-detail-params-date');
  },
  mounted() {
    this.getRecordList();
  },
  watch: {
    swagBalance(val) {
      this.swagDiamondBalance = val.balance;
    },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage',
      'actionGetRechargeStatus',
      'actionGetMemInfoV3',
      'actionSetUserBalance',
    ]),
    checkWithdrawData(target) {
      if (this.isCheckWithdraw) {
        return;
      }
      this.isCheckWithdraw = true;
      // 提現資料補齊跳轉檢查
      axios({
        method: "get",
        url: "/api/v2/c/withdraw/check"
      })
        .then(res => {
          this.isCheckWithdraw = false;

          if (res.data.result === "ok") {
            let check = true;

            Object.keys(res.data.ret).forEach(i => {
              if (i !== "bank" && !res.data.ret[i]) {

                this.actionSetGlobalMessage({
                  msg: target === 'withdraw' ? '请先完成提现信息' : '请先设定提现资料',
                  cb: () => {
                    {
                      this.$router.push(
                        "/mobile/withdrawAccount?redirect=wallet"
                      );
                    }
                  }
                });
                check = false;
                return;
              }
            });

            if (check) {
              this.$router.push(`/mobile/mcenter/${target}`);
            }
          } else {
            this.actionSetGlobalMessage({
              msg: res.data.msg,
              code: res.data.code
            });
          }
        })
        .catch(res => {
          this.isCheckWithdraw = false;

          if (res.response.data) {
            this.actionSetGlobalMessage({
              msg: res.response.data.msg,
              code: res.response.data.code
            });
          }
        });
    },
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
      this.$router.push("/mobile/mcenter/makeMoney");
    },
    toggleTrans() {
      this.isShowTrans = !this.isShowTrans;
    },
    getRecordList() {
      const params = {
        start_at: Vue.moment(this.startTime).format(
          "YYYY-MM-DD 00:00:00-04:00"
        ),
        end_at: Vue.moment(this.endTime).format("YYYY-MM-DD 23:59:59-04:00")
      };

      // 各遊戲注單統計資料(依投注日期)
      ajax({
        method: "get",
        url: "/api/v1/c/stats/wager-report/by-day-game",
        params,
        success: response => {
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
    getVendorName(vendor, kind) {
      if (
        !this.memInfo.vendors.find(
          item => item.vendor === vendor && item.kind === kind
        )
      ) {
        return this.$t(
          Object.keys(this.gameData)
            .map(key => {
              if (this.gameData[key].vendor === vendor) {
                return this.gameData[key].text;
              }

              return "";
            })
            .join("")
        );
      }
      return this.memInfo.vendors.find(
        item => item.vendor === vendor && item.kind === kind
      ).alias;
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.index.scss" module="$style_ey1"></style>
