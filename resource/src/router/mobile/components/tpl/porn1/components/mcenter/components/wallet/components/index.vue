<template>
  <div :class="$style['my-wallet-wrap']">
    <div :class="$style['wallet-info-wrap']">
      <div>总金额(元)</div>

      <div :class="$style['money-block']">
        <span :class="$style['money']">{{ loginMoney }}</span>
        <div :class="$style['goDeposit']" @click="handleDeposit">去充值</div>
      </div>

      <div :class="$style['icon-block']">
        <div
          v-for="(item, index) in walletIcons"
          v-show="
            item.show ||
              (item.key === 'recharge' && ['porn1', 'sg1'].includes(themeTPL))
          "
          :key="'icon-' + index"
          :class="$style['icon-cell']"
          @click="item.onClick"
        >
          <div :class="$style['image']">
            <img
              :src="
                $getCdnPath(
                  `/static/image/${imagePath}/mcenter/wallet/${item.imgSrc}`
                )
              "
              alt="icon"
            />
          </div>
          <span>
            {{ item.text }}
          </span>
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
          <div :class="[$style['balance-wrap'], 'clearfix']">
            <div :class="[$style['balance-total-item']]">
              <img
                :src="
                  $getCdnPath(
                    '/static/image/common/mcenter/balanceTrans/ic_wallet_center.png'
                  )
                "
              />
              <span> {{ $text("S_MCENTER_WALLET", "中心钱包") }} </span>
              <div :class="[$style['balance-item-money']]">
                {{ balanceTran.membalance.vendor.default.amount }}
              </div>
            </div>

            <div
              :class="[
                $style['recycle-btn'],
                balanceTran.balanceBackLock ? $style.disable : ''
              ]"
              @click="balanceBack()"
            >
              {{ $text("S_ONE_CLICK_TO_ACCOUNT") }}
            </div>
          </div>

          <div :class="[$style['balance-item-wrap'], 'clearfix']">
            <div
              v-if="redJackpotData.enable"
              :class="[$style['balance-item'], $style['item-fix']]"
              @click="$router.push('/mobile/mcenter/redJackpot')"
            >
              <span
                :class="[
                  $style['balance-item-vendor'],
                  $style['balance-redjackpot-text']
                ]"
              >
                <template v-if="['porn1', 'sg1'].includes(themeTPL)">
                  {{ "红包彩金" }}
                </template>
              </span>

              <span
                :class="[
                  $style['balance-item-money'],
                  $style['balance-redjackpot-money']
                ]"
              >
                {{
                  formatThousandsCurrency(redJackpotData.remain_bonus, false)
                }}
              </span>
              <span
                :class="[
                  $style['balance-redjackpot-image'],
                  $style[siteConfig.ROUTER_TPL]
                ]"
              />
            </div>

            <div
              v-if="bonus.balance"
              :class="[$style['balance-item'], $style['item-fix']]"
              @click="$router.push('/mobile/mcenter/bonus')"
            >
              <span :class="$style['balance-item-vendor']">
                <template>
                  {{ $text("S_BONUS", "红利彩金") }}
                </template>
              </span>

              <span :class="[$style['balance-item-money'], $style['more']]">
                {{
                  bonus.balance
                    ? formatThousandsCurrency(bonus.balance, false)
                    : 0.0
                }}
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
              <span
                :class="[
                  $style['balance-item-vendor'],
                  { [$style['long']]: item.text.length > 6 }
                ]"
                >{{ item.text }}</span
              >
              <span
                v-if="item.maintain"
                :class="$style['balance-info-maintain']"
                @click="onClickMaintain(item.maintain)"
              >
                {{ $t("S_MAINTAIN") }}
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/${routerTPL}/mcenter/ic_tips.png`
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

    <template v-if="bcWalletEnableType && fastPaySwitch">
      <div :class="$style['bc-wrap']">
        <div :class="$style['bc-title']">币希钱包</div>
        <div :class="$style['bc-content']">
          <div
            v-if="bcWalletBindType"
            :class="[$style['bc-data'], $style['first']]"
            @click="bcClickEvent('money')"
          >
            <div :class="$style['total-money']">
              {{ formatThousandsCurrency(bcCurrencyData.total_balance, false) }}
            </div>
            <div>
              总余额(美元)
            </div>
          </div>
          <div v-if="bcWalletBindType" :class="$style['line']" />
          <div
            v-if="bcWalletBindType"
            :class="$style['bc-data']"
            @click="bcClickEvent('qrcode')"
          >
            <img
              :class="$style['img-icon']"
              :src="
                $getCdnPath('/static/image/common/wallet/btse_btn_qrcode.png')
              "
            />
            <div>币希收款码</div>
          </div>
          <div
            v-if="!bcWalletBindType"
            :class="[$style['bc-data'], $style['less']]"
            @click="bcClickEvent('bind')"
          >
            <img
              :class="$style['img-icon']"
              :src="
                $getCdnPath('/static/image/common/wallet/btse_btn_wallet.png')
              "
            />
            <div>绑定钱包</div>
          </div>
          <div :class="$style['line']" />
          <div
            :class="[
              $style['bc-data'],
              { [$style['less']]: !bcWalletBindType }
            ]"
            @click="bcClickEvent('inter')"
          >
            <img
              :class="$style['img-icon']"
              :src="
                $getCdnPath('/static/image/common/wallet/btse_btn_btse.png')
              "
            />
            <div>进入币希</div>
          </div>
          <div :class="$style['line']" />
          <div
            :class="[
              $style['bc-data'],
              { [$style['less']]: !bcWalletBindType }
            ]"
            @click="bcClickEvent('use')"
          >
            <img
              :class="$style['img-icon']"
              :src="$getCdnPath('/static/image/common/wallet/btse_btn_use.png')"
            />
            <div>使用方法</div>
          </div>
        </div>
      </div>
    </template>

    <div :class="[$style['invite-wrap']]" @click="onClickInvite">
      <template v-if="['porn1', 'sg1'].includes(themeTPL)">
        <div :class="$style['content']">
          <div>邀请好友获得现金奖励</div>
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
      <div :class="[$style['title']]">
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
                formatThousandsCurrency(item.valid_bet, false)
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
    <bc-wallet-popup
      v-if="bcMoneyShowType"
      :currency-data="bcCurrencyData"
      :open-qr-code="getWalletUserReceiveCode"
      :reload-money="getWalletCurrencyBalanceList"
      @close="closeBcMoneyPopup"
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
import Vue from "vue";
import mixin from "@/mixins/mcenter/swag/swag";
import maintainBlock from "@/router/mobile/components/common/maintainBlock";
import goLangApiRequest from "@/api/goLangApiRequest";
import bcWalletPopup from "./bcWalletPopup";
import { thousandsCurrency } from "@/lib/thousandsCurrency";
import { sendUmeng } from "@/lib/sendUmeng";
import mobileLinkOpen from "@/lib/mobile_link_open";
import lib_newWindowOpen from "@/lib/newWindowOpen";

export default {
  components: {
    balanceTran,
    message,
    maintainBlock,
    bcWalletPopup
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
      birdBalance: "--",
      redJackpotData: null,
      loginMoney: "",
      // updateBalance: null
      bcWalletEnableType: false,
      bcWalletBindType: false,
      bcMoneyShowType: false,
      bcCurrencyData: {
        bind: false,
        total_balance: "",
        currency_list: []
      },
      fastPaySwitch: false
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      gameData: "getGameData",
      siteConfig: "getSiteConfig",
      rechargeConfig: "getRechargeConfig",
      withdrawCheckStatus: "getWithdrawCheckStatus",
      domainConfig: "getDomainConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    imagePath() {
      switch (this.routerTPL) {
        default:
          return "common";
        case "porn1":
          return "porn1";
        case "sg1":
          return "sg1";
        case "aobo1":
          return "aobo1";
      }
    },
    birdIcons() {
      return [
        {
          key: "whatBird",
          show: true,
          text: this.$text("S_WHAT_BIRD", "什么是鸟蛋"),
          imgSrc: `/static/image/common/mcenter/wallet/ic_wallter_bird_what.png`,
          onClick: () => {
            this.$router.push("/mobile/mcenter/help/bird?key=0");
          }
        },
        {
          key: "howToUse",
          show: true,
          text: this.$text("S_TO_USE", "如何使用"),
          imgSrc: `/static/image/common/mcenter/wallet/ic_wallter_bird_howtouse.png`,
          onClick: () => {
            this.$router.push("/mobile/mcenter/help/bird?key=1");
          }
        }
      ].filter(item => item.show);
    },
    walletIcons() {
      return [
        {
          key: "transfer",
          show: true,
          text: this.$text("S_TRANSFER", "转帐"),
          imgSrc: `ic_wallter_tranfer.png`,
          onClick: () => {
            if (this.routerTPL === "sg1") {
              sendUmeng(39);
            } else {
              sendUmeng(40);
            }

            switch (this.themeTPL) {
              case "porn1":
              case "sg1":
                this.$router.push("/mobile/mcenter/balanceTrans?title=wallet");
                break;

              // 如之後點擊轉帳時需檢查 withdrawcheck，使用 lib_useGlobalWithdrawCheck(path)
            }
          }
        },
        {
          key: "withdraw",
          show: true,
          text: this.$text("S_WITHDRAWAL_TEXT", "提现"),
          imgSrc: `ic_wallter_withdraw.png`,
          onClick: () => {
            if (this.routerTPL === "sg1") {
              sendUmeng(40);
            } else {
              sendUmeng(41);
            }

            const routerPush = "/mobile/mcenter/withdraw";

            this.$router.push(routerPush);
            return;
          }
        },
        {
          key: "recharge",
          show: false,
          text: this.$text("S_CREDIT_TRANSFER", "额度转让"),
          imgSrc: `ic_wallet_trans.png`,
          onClick: () => {
            if (this.routerTPL === "sg1") {
              sendUmeng(41);
            } else {
              sendUmeng(42);
            }

            this.actionGetMemInfoV3().then(() => {
              this.actionGetRechargeStatus("wallet");
            });
          }
        },
        {
          key: "card",
          show: true,
          text: this.$text("S_MARANGE_CARD", "卡片管理"),
          imgSrc: `ic_wallter_manage.png`,
          onClick: () => {
            if (this.routerTPL === "sg1") {
              sendUmeng(42);
            } else {
              sendUmeng(43);
            }

            const routerPush = "/mobile/mcenter/bankCard";

            this.$router.push(routerPush);
            return;
          }
        }
      ];
    }
  },
  created() {
    if (!this.loginStatus) {
      this.$router.push("/mobile/login");
    }

    if (["porn1", "sg1"].includes(this.themeTPL)) {
      if (this.membalance && this.membalance.total) {
      } else {
        this.loginMoney = "";
      }
    }

    this.startTime = Vue.moment(this.estToday)
      .add(-30, "days")
      .format("YYYY-MM-DD");
    this.endTime = Vue.moment(this.estToday).format("YYYY-MM-DD");
    this.getDomainConfig();

    // 清除交易紀錄搜尋快取
    localStorage.removeItem("money-detail-params");
    localStorage.removeItem("money-detail-params-service");
    localStorage.removeItem("money-detail-params-category");
    localStorage.removeItem("money-detail-params-date");

    this.actionSetUserBalance().then(() => {
      this.getRedJackpot();
    });

    this.actionSetDomainConfigV2().then(() => {
      //迅付存取款開關
      const deposit = this.domainConfig.deposit.some(
        item => item.name === "迅付"
      );
      const withdraw = this.domainConfig.withdraw.name === "迅付";
      this.fastPaySwitch = deposit || withdraw;

      if (this.fastPaySwitch) {
        this.getWalletCurrencyBalanceList();
      }
    });
  },
  beforeUnmount() {
    clearInterval(this.updateBalance);
    this.updateBalance = null;
  },
  mounted() {
    this.getRecordList();
    this.updateBalance = setInterval(() => {
      let cid = getCookie("cid");

      if (!cid) {
        clearInterval(this.updateBalance);
        this.updateBalance = null;
      } else {
        this.actionSetUserBalance();
      }
    }, 30000);
  },

  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionGetRechargeStatus",
      "actionGetMemInfoV3",
      "actionSetUserBalance",
      "getCustomerServiceUrl",
      "actionSetDomainConfigV2"
    ]),
    mobileLinkOpen,
    dialogMessage(msg) {
      return this.actionSetGlobalMessage({ msg: msg });
    },
    handleDeposit() {
      if (this.routerTPL === "sg1") {
        sendUmeng(38);
      } else {
        sendUmeng(39);
      }
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
      if (this.routerTPL === "sg1") {
        sendUmeng(43);
      } else {
        sendUmeng(44);
      }

      this.$router.push("/mobile/mcenter/makeMoney");
    },
    toggleTrans() {
      this.isShowTrans = !this.isShowTrans;
    },
    getRecordList() {
      const params = {
        startAt: Vue.moment(this.startTime).format("YYYY-MM-DD 00:00:00-04:00"),
        endAt: Vue.moment(this.endTime).format("YYYY-MM-DD 23:59:59-04:00"),
        maxResults: 20,
        firstResult: 0
      };

      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Stats/WagerReport/ByDayGame`,
        params
      }).then(res => {
        if (res && res.data && res.data.ret && res.data.ret.length !== 0) {
          this.mainListData = res.data.ret;
          this.mainNoData = false;
        } else {
          this.mainListData = [];
          this.mainNoData = true;
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
    birdMoney() {
      let cid = getCookie("cid");
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Member/Info`,
        headers: {
          cid: cid
        },
        params: {
          lang: "zh-cn",
          account: this.memInfo.user.username
        }
      }).then(res => {
        this.birdBalance = res.data ? res.data.credits2 : "--";
      });
    },
    getRedJackpot() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Event/Info`,
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res.errorCode === "00" && res.status === "000") {
          this.redJackpotData = res.data;
          if (res.data.enable) {
            if (this.loginStatus) {
              let total =
                this.membalance && this.membalance.total
                  ? +this.membalance.total
                  : 0;
              let remain_bonus =
                res.data.remain_bonus && res.data.remain_bonus
                  ? +res.data.remain_bonus
                  : 0;
              this.loginMoney = `${thousandsCurrency(
                (total + remain_bonus).toFixed(2)
              )}`;
            }
          } else {
            if (this.membalance && this.membalance.total) {
              this.loginMoney = `${thousandsCurrency(this.membalance.total)}`;
            } else {
              this.loginMoney = "";
            }
          }
        } else {
          this.redJackpotData = null;
          if (this.membalance && this.membalance.total) {
            this.loginMoney = `${thousandsCurrency(this.membalance.total)}`;
          } else {
            this.loginMoney = "";
          }
        }
      });
    },
    formatThousandsCurrency(value, isDisplay) {
      if (isDisplay) {
        return thousandsCurrency(Number(value));
      }
      return thousandsCurrency(Number(value).toFixed(2));
    },
    getDomainConfig() {
      return axios({
        method: "get",
        url: "/api/v2/c/domain-config"
      })
        .then(res => {
          if (res && res.data && res.data.ret) {
            if (res.data.ret.gift_card) {
              //紅利帳戶api C02.112
              goLangApiRequest({
                method: "get",
                url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Gift/Card`
              }).then(res => {
                if (res && res.status === "000") {
                  this.bonus = res.data.total;
                }
              });
            }
          }
        })
        .catch(res => {
          this.actionSetGlobalMessage({
            msg: res.response.data.msg,
            code: res.response.data.code,
            origin: "home"
          });
        });
    },

    bcClickEvent(type) {
      switch (type) {
        case "money":
          this.bcMoneyShowType = true;
          break;
        case "qrcode":
          this.getWalletUserReceiveCode();
          break;
        case "bind":
          if (this.routerTPL === "porn1") {
            sendUmeng(71);
          }
          this.$router.push(
            `/mobile/mcenter/bankcard?redirect=wallet&type=wallet&wallet=bcwallet&swift=BBBTSECN1`
          );
          break;
        case "inter":
          if (this.routerTPL === "porn1") {
            sendUmeng(73);
          }
          lib_newWindowOpen(
            this.getCustomerServiceUrl({
              urlName: "btse_login",
              needToken: false
            }).then(res => {
              return res.uri;
            })
          );
          break;
        case "use":
          if (this.routerTPL === "porn1") {
            sendUmeng(74);
          }
          // this.getCustomerServiceUrl({
          //   urlName: "btse_wallet",
          //   needToken: false
          // }).then(res => {
          //   this.getPromotionList(res.uri);
          // });
          goLangApiRequest({
            method: "get",
            url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
            params: {
              lang: "zh-cn",
              urlName: "btse_wallet",
              needToken: false
            }
          }).then(res => {
            const { status, data, msg, errorCode } = res;

            if (status === "000" && errorCode === "00") {
              this.getPromotionList(data.uri);
            } else {
              this.actionSetGlobalMessage({
                msg: "正在上线，敬请期待"
              });
            }
          });

          break;
        default:
          break;
      }
    },
    getPromotionList(id) {
      this.promotionId = +id;
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Promotion/List`,
        params: {
          tabId: 0
        }
      }).then(res => {
        if (res && res.data) {
          let linkData = res.data.ret.find(data => {
            return data.id === this.promotionId;
          });
          if (linkData) {
            // this.mobileLinkOpen({
            //   linkType: "mi",
            //   linkTitle: linkData.name,
            //   linkTo: linkData.link
            // });
            localStorage.setItem("iframe-third-url", `${linkData.link}?v=m`);
            localStorage.setItem("iframe-third-url-title", linkData.name);
            this.$router.replace(`/mobile/iframe/bcWallet?func=false`);
          } else {
            this.actionSetGlobalMessage({
              msg: "正在上线，敬请期待"
            });
          }
        }
      });
    },
    closeBcMoneyPopup() {
      this.bcMoneyShowType = false;
    },
    getWalletCurrencyBalanceList() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Wallet/Currency/Balance/List`,
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res.status === "000") {
          this.bcWalletBindType = res.data.bind;
          this.bcCurrencyData = res.data;
          this.bcWalletEnableType = res.data.enable;
        } else {
          // this.bcCurrencyData = {
          //   bind: true,
          //   total_balance: "12414152345",
          //   currency_list: [
          //     {
          //       balance: "1,000,000.99",
          //       currency: "BTC",
          //       name: "比特币"
          //     },
          //     {
          //       balance: "900,000.00",
          //       currency: "ETH",
          //       name: "以太坊"
          //     }
          //   ]
          // };
        }
      });
    },
    getWalletUserReceiveCode() {
      lib_newWindowOpen(
        goLangApiRequest({
          method: "get",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Wallet/User/Receive/Code`,
          params: {
            lang: "zh-cn"
          }
        }).then(res => {
          console.log(res);
          if (res.status === "000") {
            return res.data.url;
          }
        })
      );
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.index.scss" module="$style_sg1"></style>
