<template>
  <div>
    <div :class="$style['mcenter-vip-wrap']">
      <div :class="$style['tool-wrap']">
        <div :class="$style['myTool']" @click="onListClick('my_props')">
          <i
            ><img
              :src="
                $getCdnPath(`/static/image/sg1/mcenter/icon_props.png`)
              "/></i
          >道具
        </div>
        <div :class="$style['myStyle']" @click="onListClick('my_style')">
          <i
            ><img
              :src="
                $getCdnPath(`/static/image/sg1/mcenter/icon_style.png`)
              "/></i
          >我的风格
        </div>
        <div
          :class="$style['myContribute']"
          @click="onListClick('my_contribute')"
        >
          <i
            ><img
              :src="
                $getCdnPath(`/static/image/sg1/mcenter/icon_contribution.png`)
              "/></i
          >贡献榜
        </div>
        <div :class="$style['myCenterWallet']">
          <p @click="onListClick('wallet', false)">
            <img
              :src="$getCdnPath(`/static/image/sg1/mcenter/icon_gold.png`)"
            />中心钱包
          </p>
          <span :style="unloginString ? { color: ' #939393' } : {}"
            >{{ unloginString || memAmount }}
          </span>
          <button @click="onListClick('deposit', false)">
            充值
          </button>
        </div>
        <div :class="$style['myDiamond']">
          <p>
            <img
              :src="$getCdnPath(`/static/image/sg1/mcenter/ic_diamond.png`)"
            />
            {{ $text("S_MY_DIAMOND") }}
          </p>
          <span
            :style="[
              diamondTotal && diamondTotal.length > 9
                ? { 'font-size': '12px' }
                : {},
              unloginString ? { color: ' #939393' } : {}
            ]"
            >{{ unloginString || formatThousandsCurrency(diamondTotal) }}</span
          >

          <button @click="$router.push('/mobile/mcenter/live/diamond')">
            兌換
          </button>
        </div>
      </div>
      <!-- VIP 推廣 -->
      <div :class="$style['vip-promotion-wrap']">
        <div :class="$style['sec-1']" @click="onListClick('mall')">
          <img :src="$getCdnPath('/static/image/sg1/mcenter/icon_mall.png')" />
          <div>
            <div>商城</div>
            <!-- <div :class="$style['sub-text']">VIP PRIVILEGE</div> -->
          </div>
        </div>
        <!-- <div :class="$style['v-line']" /> -->
        <div :class="$style['sec-1']" @click="onListClick('my_guard')">
          <img :src="$getCdnPath('/static/image/sg1/mcenter/icon_guard.png')" />
          <div>
            <div>守护</div>
            <!-- <div :class="$style['sub-text']">PROMOTION</div> -->
          </div>
        </div>

        <!-- 快捷功能4 -->
        <div :class="$style['mcenter-func-four']">
          <div :class="$style['cell']" @click="onListClick('exchange_diamond')">
            <div>
              <img
                :src="
                  $getCdnPath('/static/image/sg1/mcenter/icon_experince.png')
                "
              />
            </div>
            <div>经验值</div>
          </div>
          <div :class="$style['cell']" @click="onListClick('leaderboard')">
            <div>
              <img
                :src="$getCdnPath('/static/image/sg1/mcenter/icon_ranking.png')"
              />
            </div>
            <div>排行榜</div>
          </div>
          <div :class="$style['cell']" @click="onListClick('task_wall')">
            <div>
              <img
                :src="$getCdnPath('/static/image/sg1/mcenter/icon_mission.png')"
              />
            </div>
            <div>任务</div>
          </div>
          <div :class="$style['cell']" @click="isShowShare = !isShowShare">
            <div>
              <img
                :src="$getCdnPath('/static/image/sg1/mcenter/icon_share.png')"
              />
            </div>
            <div>分享APP</div>
          </div>
        </div>
      </div>

      <!-- 快捷功能8 -->
      <div :class="$style['mcenter-func-eight']">
        <div :class="$style['cell']" @click="onListClick('accountVip', false)">
          <div>
            <img :src="$getCdnPath('/static/image/sg1/mcenter/icon_vip.png')" />
          </div>
          <div>娱乐城VIP</div>
        </div>
        <div :class="$style['cell']" @click="onListClick('wallet', false)">
          <div>
            <img
              :src="$getCdnPath('/static/image/sg1/mcenter/ic_mywallet.png')"
            />
          </div>
          <div>{{ $text("S_MY_PURSE", "我的钱包") }}</div>
        </div>
        <div :class="$style['cell']" @click="onListClick('betRecord', false)">
          <div>
            <img
              :src="
                $getCdnPath('/static/image/sg1/mcenter/icon_bethistory.png')
              "
            />
          </div>
          <div>{{ $text("S_BETHISTORYBTN", "投注记录") }}</div>
        </div>
        <div :class="$style['cell']" @click="onListClick('moneyDetail', false)">
          <div>
            <img
              :src="
                $getCdnPath('/static/image/sg1/mcenter/icon_transaction.png')
              "
            />
          </div>
          <div>{{ $text("S_TRANSACTION_RECORD", "交易记录") }}</div>
        </div>
        <div :class="$style['cell']" @click="onListClick('bankRebate', false)">
          <div>
            <img
              :src="$getCdnPath('/static/image/sg1/mcenter/icon_rebate.png')"
            />
          </div>
          <div>{{ $text("S_REAL_TIME_REBATE", "实时返水") }}</div>
        </div>

        <div
          :class="$style['cell']"
          @click="onListClick('tcenterLobby', false)"
        >
          <div>
            <img
              :src="
                $getCdnPath('/static/image/sg1/mcenter/icon_userprocess.png')
              "
            />
          </div>
          <div>我的推广</div>
        </div>
        <div :class="$style['cell']" @click="onListClick('makeMoney', false)">
          <div>
            <img
              :src="$getCdnPath('/static/image/sg1/mcenter/icon_process.png')"
            />
          </div>
          <div>推广赚钱</div>
        </div>
        <div
          :class="$style['cell']"
          @click="onListClick('creditTrans?tab=1', false)"
        >
          <div>
            <img
              :src="$getCdnPath('/static/image/sg1/mcenter/icon_transfer.png')"
            />
          </div>
          <div>额度转让</div>
        </div>
      </div>
    </div>

    <share v-if="isShowShare" :is-show-share.sync="isShowShare" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import mcenterPageAuthControl from "@/lib/mcenterPageAuthControl";
import member from "@/api/member";
import { thousandsCurrency } from "@/lib/thousandsCurrency";
import goLangApiRequest from "@/api/goLangApiRequest";
import share from "./share";
import { sendUmeng } from "@/lib/sendUmeng";
export default {
  props: {
    paopaoUserInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    share
  },
  data() {
    return {
      list: [
        { path: "", pageName: "deposit" }, // 存款
        { path: "/mobile/mcenter/balanceTrans", pageName: "bankBalanceTran" }, // 額度轉換
        { path: "/mobile/mcenter/withdraw", pageName: "withdraw" }, // 取款
        { path: "/mobile/mcenter/accountVip", pageName: "accountVip" } // VIP
      ],
      //   vipData: {},
      createdTime: "",
      isShowPromotion: localStorage.getItem("is-show-promotion")
        ? localStorage.getItem("is-show-promotion") === "true"
        : true,
      centerWallet: 0,
      diamondTotal: 0,
      isShowShare: false
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      membalance: "getMemBalance",
      siteConfig: "getSiteConfig"
    }),
    memAmount() {
      return (this.membalance && this.membalance.vendor.default.amount) || "--";
    },
    unloginString() {
      if (!this.loginStatus) {
        return "--";
      } else {
        return;
      }
    }
  },
  mounted() {
    if (this.loginStatus) {
      this.updateBalanceTimer = setInterval(() => {
        this.actionSetUserBalance();
      }, 40000);
    }
  },
  beforeDestroy() {
    clearInterval(this.updateBalanceTimer);
    this.updateBalanceTimer = null;
  },
  created() {
    this.actionSetUserBalance();
    member.data({
      success: res => {
        this.countDays(res.ret.user.created_at);
      }
    });

    if (this.loginStatus) {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/diamond-total",
        method: "get"
      }).then(data => {
        if (data && data.result && data.result.diamond_total) {
          this.diamondTotal = data.result.diamond_total;
        } else {
          this.diamondTotal = 0;
        }
      });
    }
  },
  filters: {
    thousandFormat(val) {
      return val
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        .slice(0, -3);
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionGetExtRedirect",
      "actionSetUserBalance"
    ]),
    formatThousandsCurrency(value) {
      return thousandsCurrency(value.toFixed(2));
    },
    onListClick(target, isLive = true) {
      if (!this.loginStatus) {
        this.$router.push("/mobile/login");
        return;
      }
      switch (target) {
        case "accountVIP":
          sendUmeng(26);
          break;
        case "makeMoney":
          sendUmeng(27);
          break;
        case "wallet":
          sendUmeng(28);
          break;
        case "betRecord":
          sendUmeng(29);
          break;
        case "moneyDetail":
          sendUmeng(30);
          break;
        case "bankRebate":
          sendUmeng(31);
          break;

        default:
          break;
      }

      if (isLive) {
        this.$router.push(`/mobile/live/iframe/${target}`);
      } else {
        this.$router.push(`/mobile/mcenter/${target}`);
      }
    },
    countDays(ceatedTime) {
      const startTime = moment(ceatedTime);
      const now = moment(new Date());

      this.createdTime = now.diff(startTime, "days") + 1;
    },

    goToRebate() {
      if (this.loginStatus) {
        this.isShowPromotion =
          localStorage.getItem("is-show-promotion") === "true";

        this.isShowPromotion
          ? this.getRebateSwitch()
          : this.actionSetGlobalMessage({ msg: "实时返佣升级中" });
      } else {
        this.$router.push("/mobile/login");
      }
    },

    getRebateSwitch() {
      // 因開關在此 api 的回傳，所以在入口點先呼叫此 api
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/SelfDispatchInfo`,
        params: { lang: "zh-cn" }
      }).then(response => {
        if (response.status === "000" && response.data.ret.show_real_time) {
          this.$router.push("/mobile/mcenter/tcenter/commission/rebate");
        } else {
          this.$router.push("/mobile/mcenter/tcenter/commission/summary");
        }
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.vip-promotion-wrap > .sec-1 {
  height: 55px;
}

.sub-text {
  font-size: 8px;
}

.tool-wrap {
  position: relative;
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);

  div {
    width: 33.3%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    i {
      margin: 3px;
      img {
        width: 23px;
        height: 23px;
      }
    }
  }

  &::after {
    content: "";
    position: absolute;
    border: 0.5px solid #eeeeee;
    width: 90%;
    top: 60px;
  }
}

.myCenterWallet {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  p {
    height: 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin: 0;
    img {
      max-width: 20px;
      margin-right: 5px;
    }
  }
  span {
    display: block;
    height: 16px;
    color: #e53266;
    font-size: 16px;
    text-align: center;
    margin: 8px 0 5px 0;
  }

  button {
    color: #fff;
    font-size: 12px;
    background: #000;
    padding: 3px 25px;
    border-radius: 10px;
  }
}

.myDiamond {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  p {
    height: 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin: 0;
    img {
      max-width: 20px;
      margin-right: 5px;
    }
  }
  span {
    display: block;
    height: 16px;
    color: #e53266;
    font-size: 16px;
    text-align: center;
    margin: 8px 0 5px 0;
  }

  button {
    color: #fff;
    font-size: 12px;
    background: #000;
    padding: 3px 25px;
    border-radius: 10px;
  }
}

.mcenter-vip-wrap {
  margin-bottom: 10px;
  background-color: #fefffe;
}

.sub-text {
  color: var(--main_text_color2);
}

.vip-promotion-wrap {
  position: relative;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: 120pt;
  background: #ffffff;
  border-radius: 10pt;
  box-shadow: 0pt 0pt 8px 0pt rgba(0, 0, 0, 0.05);

  > .sec-1 {
    width: 50%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      // width: 100%;
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
        font-size: 14px;
      }
    }

    > img {
      width: 37px;
      height: 37px;
      margin-right: 5px;
    }
  }
  // .v-line {
  //   border-left: 1px solid #eee;
  //   height: 38px;
  //   width: 1px;
  // }

  &::after {
    content: "";
    position: absolute;
    border: 0.5px solid #eeeeee;
    width: 90%;
    top: 70px;
  }
}

.mcenter-func-four {
  width: 100%;
  height: 80px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 18px;

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

.mcenter-func-eight {
  position: relative;
  height: 165px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  background: #fff;

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

  &::after {
    content: "";
    position: absolute;
    border: 0.5px solid #eeeeee;
    width: 90%;
    top: 85px;
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

@media screen and (max-width: 374px) {
  .vip-promotion-wrap {
    margin: 0px 16px 0;
    font-size: 14px;
  }

  .mcenter-func {
    padding: 0 16px;
  }
}
</style>
