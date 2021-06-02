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
            <img :src="$getCdnPath(item.imgSrc)" alt="icon" />
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
            <div :class="$style['balance-total-item']">
              <img
                :src="
                  $getCdnPath(
                    '/static/image/common/mcenter/balanceTrans/ic_wallet_center.png'
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
                  $style['balance-refjackpot-text']
                ]"
              >
                <template v-if="['porn1', 'sg1'].includes(themeTPL)">
                  {{ "红包彩金" }}
                </template>
              </span>

              <span
                :class="[
                  $style['balance-item-money'],
                  $style['balance-refjackpot-text']
                ]"
              >
                {{ redJackpotData.remain_bonus }}
              </span>
              <span :class="[$style['balance-refjackpot-image']]" />
            </div>

            <div
              :class="[$style['balance-item'], $style['item-fix']]"
              @click="$router.push('/mobile/mcenter/bonus')"
            >
              <span :class="$style['balance-item-vendor']">
                <template v-if="['porn1', 'sg1'].includes(themeTPL)">
                  {{ $text("S_BONUS", "红利彩金") }}
                </template>

                <template v-if="['ey1'].includes(themeTPL)">
                  {{ $text("S_BONUS_ACCOUNT", "红利帐户") }}
                </template>
              </span>

              <span :class="[$style['balance-item-money'], $style['more']]">
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
                    $getCdnPath(`/static/image/${themeTPL}/mcenter/ic_tips.png`)
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

    <template v-if="['porn1', 'sg1'].includes(themeTPL)">
      <div :class="$style['swag-wrap']">
        <div :class="$style['title']">SWAG钱包</div>
        <div :class="$style['icon-block']">
          <div :class="$style['icon-cell']">
            <div :class="$style['balance']" @click="handleSWAGBalance">
              <template v-if="isMaintainSwag">
                <span
                  :class="$style['maintain-tip-text']"
                  @click="dialogMessage('SWAG 维护中')"
                  >维护中</span
                >
                <img
                  v-if="isMaintainSwag && swagConfig && swagConfig.enable !== 0"
                  :class="$style['maintain-tip-img']"
                  :src="
                    $getCdnPath(`/static/image/${themeTPL}/mcenter/ic_tips.png`)
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

    <template v-if="['ey1'].includes(themeTPL)">
      <div :class="$style['swag-wrap']">
        <div :class="$style['title']">蜂鸟钱包</div>
        <div :class="$style['icon-block']">
          <div :class="$style['icon-cell']">
            <div :class="$style['balance']">
              <!-- <template v-if="isMaintainSwag">
                <span :class="$style['maintain-tip-text']">维护中</span>
                <img
                  v-if="isMaintainSwag && swagConfig && swagConfig.enable !== 0"
                  :class="$style['maintain-tip-img']"
                  :src="$getCdnPath('/static/image/common/mcenter/ic_tips.png')"
                />
              </template>
              <template v-else>
                {{ swagDiamondBalance }}
              </template> -->
              {{ birdBalance }}
            </div>
            {{ $t("S_BIRD_BALANCE") }}
          </div>

          <div
            v-for="(item, index) in birdIcons"
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
      <template v-if="['porn1', 'sg1'].includes(themeTPL)">
        <div :class="$style['content']">
          <div>邀请好友获得现金奖励</div>
          <div>邀请人首存即可获得</div>
        </div>
      </template>

      <template v-if="['ey1'].includes(themeTPL)">
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
import Vue from "vue";
import yaboRequest from "@/api/yaboRequest";
import mixin from "@/mixins/mcenter/swag/swag";
import maintainBlock from "@/router/mobile/components/common/maintainBlock";
import goLangApiRequest from "@/api/goLangApiRequest";
import { lib_useLocalWithdrawCheck } from "@/lib/withdrawCheckMethod";

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
      swagDiamondBalance: "0",
      birdBalance: "--",
      redJackpotData: null,
      loginMoney: ""
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      gameData: "getGameData",
      siteConfig: "getSiteConfig",
      hasBank: "getHasBank",
      rechargeConfig: "getRechargeConfig",
      swagConfig: "getSwagConfig",
      swagBalance: "getSwagBalance",
      withdrawCheckStatus: "getWithdrawCheckStatus"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    swagIcons() {
      return [
        {
          key: "buyDiamond",
          show: true,
          text: this.$text("S_BUY_DIAMOND", "购买钻石"),
          imgSrc: `/static/image/common/mcenter/wallet/ic_wallter_swag_buydiamond.png`,
          onClick: () => {
            this.$router.push("/mobile/mcenter/swag");
          }
        },
        {
          key: "howToBuy",
          show: true,
          text: this.$text("S_TO_BUY", "如何购买"),
          imgSrc: `/static/image/common/mcenter/wallet/ic_wallter_swag_howtobuy.png`,
          onClick: () => {
            this.$router.push("/mobile/mcenter/help/detail?type=buymethod");
          }
        },
        {
          key: "instrustions",
          show: true,
          text: this.$text("S_INSTRUSTIONS", "使用方法"),
          imgSrc: `/static/image/common/mcenter/wallet/ic_wallter_swag_instrustions.png`,
          onClick: () => {
            this.$router.push("/mobile/mcenter/help/detail?type=usage&key=2");
          }
        }
      ].filter(item => item.show);
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
        },
        {
          key: "goBird",
          show: true,
          text: this.$text("S_GO_BIRD", "前往蜂鸟"),
          imgSrc: `/static/image/common/mcenter/wallet/ic_wallter_bird_go.png`,
          onClick: () => {
            this.goBirdUrl();
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
          imgSrc: `/static/image/common/mcenter/wallet/ic_wallter_tranfer.png`,
          onClick: () => {
            switch (this.themeTPL) {
              case "porn1":
              case "sg1":
              case "ey1":
                this.$router.push("/mobile/mcenter/balanceTrans");
                break;

              // 如之後點擊轉帳時需檢查 withdrawcheck，使用 lib_useGlobalWithdrawCheck(path)
            }
          }
        },
        {
          key: "withdraw",
          show: true,
          text: this.$text("S_WITHDRAWAL_TEXT", "提现"),
          imgSrc: `/static/image/common/mcenter/wallet/ic_wallter_withdraw.png`,
          onClick: () => {
            const routerPush = "/mobile/mcenter/withdraw";

            if (this.themeTPL === "ey1") {
              lib_useLocalWithdrawCheck("withdraw", routerPush);
              return;
            } else {
              this.$router.push(routerPush);
              return;
            }
          }
        },
        {
          key: "recharge",
          show: false,
          text: this.$text("S_CREDIT_TRANSFER", "额度转让"),
          imgSrc: `/static/image/common/mcenter/wallet/ic_wallet_trans.png`,
          onClick: () => {
            this.actionGetMemInfoV3().then(() => {
              this.actionGetRechargeStatus("wallet");
            });
          }
        },
        {
          key: "card",
          show: true,
          text: this.$text("S_MARANGE_CARD", "卡片管理"),
          imgSrc: `/static/image/common/mcenter/wallet/ic_wallter_manage.png`,
          onClick: () => {
            const routerPush = "/mobile/mcenter/bankCard";

            if (this.themeTPL === "ey1") {
              lib_useLocalWithdrawCheck("wallet", routerPush);
              return;
            } else {
              this.$router.push(routerPush);
              return;
            }
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
      this.initSWAGConfig();
      if (this.membalance && this.membalance.total) {
        this.loginMoney = `${this.membalance.total}`;
      } else {
        this.loginMoney = "";
      }
    }
    if (["ey1"].includes(this.themeTPL)) {
      this.loginMoney = `${this.membalance.total}`;
      this.birdMoney();
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
    localStorage.removeItem("money-detail-params");
    localStorage.removeItem("money-detail-params-service");
    localStorage.removeItem("money-detail-params-category");
    localStorage.removeItem("money-detail-params-date");

    this.getRedJackpot();
  },
  mounted() {
    this.getRecordList();
  },
  watch: {
    swagBalance(val) {
      this.swagDiamondBalance = val.balance;
    },
    membalance() {
      if (["ey1"].includes(this.themeTPL)) {
        this.loginMoney = `${this.membalance.total}`;
      }
    }
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionGetRechargeStatus",
      "actionGetMemInfoV3",
      "actionSetUserBalance"
    ]),
    dialogMessage(msg) {
      return this.actionSetGlobalMessage({ msg: msg });
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
    },
    goBirdUrl() {
      let cid = getCookie("cid");
      let newWindow = "";
      newWindow = window.open();
      this.isLoading = true;
      let target = "forum_benefits";
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url?lang=zh-cn&urlName=${target}&needToken=true&externalCode=fengniao`,
        headers: {
          cid: cid
        }
      }).then(res => {
        setTimeout(() => {
          this.isLoading = false;
        }, 1500);
        if (res && res.data && res.data.uri) {
          newWindow.location = res.data.uri + "&cors=embed";
          return;
        } else {
          newWindow.close();
          this.dialogMessage(res.msg);
          return;
        }
      });
      return;

      // localStorage.setItem("iframe-third-url-title", target.name);
      // this.$router.push(`/mobile/iframe/third/fengniao?alias=${target.alias}`);
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
        headers: {
          cid: getCookie("cid")
        },
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res.errorCode === "00" && res.status === "000") {
          this.redJackpotData = res.data;
          if (res.data.enable) {
            if (this.loginStatus) {
              this.loginMoney = `${Number(
                parseFloat(this.loginMoney) + parseInt(res.data.remain_bonus)
              ).toFixed(2)}`;
            }
          }
        } else {
          this.redJackpotData = null;
        }
      });
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.index.scss" module="$style_ey1"></style>
<style lang="scss" src="../css/sg1.index.scss" module="$style_sg1"></style>
