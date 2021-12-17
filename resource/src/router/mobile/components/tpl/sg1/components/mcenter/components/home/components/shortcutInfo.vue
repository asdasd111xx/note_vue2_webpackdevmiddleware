<template>
  <div :class="$style['mcenter-vip-wrap']">
    <!-- VIP 推廣 -->
    <div :class="$style['vip-promotion-wrap']">
      <div @click="onClickEvent('accountVIP')">
        <img
          :src="$getCdnPath('/static/image/_new/mcenter/ic_vipprivicege.png')"
        />
        <div>
          <div>VIP特权</div>
          <div :class="$style['sub-text']">VIP PRIVILEGE</div>
        </div>
      </div>
      <div :class="$style['v-line']" />
      <div @click="onClickEvent('makeMoney')">
        <img
          :src="$getCdnPath('/static/image/_new/mcenter/ic_promotion.png')"
        />
        <div>
          <div>推广赚钱</div>
          <div :class="$style['sub-text']">PROMOTION</div>
        </div>
      </div>
    </div>
    <!-- 快捷功能 -->
    <div :class="$style['mcenter-func']">
      <div :class="$style['cell']" @click="onClickEvent('wallet')">
        <div>
          <img :src="$getCdnPath('/static/image/_new/mcenter/ic_wallet.png')" />
        </div>
        <div>{{ $text("S_MY_PURSE", "我的钱包") }}</div>
      </div>
      <div :class="$style['cell']" @click="onClickEvent('betRecord')">
        <div>
          <img
            :src="$getCdnPath('/static/image/_new/mcenter/ic_bethistory.png')"
          />
        </div>
        <div>{{ $text("S_BETHISTORYBTN", "投注记录") }}</div>
      </div>
      <div :class="$style['cell']" @click="onClickEvent('moneyDetail')">
        <div>
          <img
            :src="$getCdnPath('/static/image/_new/mcenter/ic_transaction.png')"
          />
        </div>
        <div>{{ $text("S_TRANSACTION_RECORD", "交易记录") }}</div>
      </div>
      <div :class="$style['cell']" @click="onClickEvent('bankRebate')">
        <div>
          <img :src="$getCdnPath('/static/image/_new/mcenter/ic_rebate.png')" />
        </div>
        <div>{{ $text("S_REAL_TIME_REBATE", "实时返水") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import mcenterPageAuthControl from "@/lib/mcenterPageAuthControl";
import mcenter from "@/api/mcenter";
import member from "@/api/member";
import { sendUmeng } from "@/lib/sendUmeng";

export default {
  components: {},
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
        : true
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      memCurrency: "getMemCurrency",
      memBalance: "getMemBalance",
      siteConfig: "getSiteConfig"
    })
  },
  created() {
    member.data({
      success: res => {
        this.countDays(res.ret.user.created_at);
      }
    });
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetGlobalMessage"]),
    onListClick(listIndex) {
      const item = this.list[listIndex];

      if (!this.loginStatus) {
        this.$router.push("/mobile/login");
        return;
      }
      if (item.pageName === "deposit") {
        this.$depositLink(true);
        return;
      }

      mcenterPageAuthControl(item.pageName).then(response => {
        if (response && response.status) {
          this.$router.push(item.path);
        }
      });
    },
    countDays(ceatedTime) {
      const startTime = moment(ceatedTime);
      const now = moment(new Date());

      this.createdTime = now.diff(startTime, "days") + 1;
    },
    onClickEvent(type) {
      if (!this.loginStatus) {
        this.$router.push("/mobile/login");
        return;
      } else {
        switch (type) {
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
        this.$router.push(`/mobile/mcenter/${type}`);
      }
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

.mcenter-vip-wrap {
  margin-bottom: 10px;
  background-color: #fefffe;
}

.sub-text {
  color: var(--member_text_color3);
}

.vip-promotion-wrap {
  margin: 0px 18px 0;
  display: flex;
  align-items: center;
  /* width: 347pt; */
  height: 50pt;
  background: #ffffff;
  border-radius: 10pt;
  box-shadow: 0pt 0pt 7px 0pt rgba(0, 0, 0, 0.05);

  > div {
    width: 50%;
    height: 60px;
    display: flex;

    > div {
      width: 100%;
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
        font-size: 8px;
      }
    }

    > img {
      //   width: 60px;
      height: 100%;
    }
  }
  .v-line {
    border-left: 1px solid #eee;
    height: 38px;
    width: 1px;
  }
}

.mcenter-func {
  height: 100px;
  display: flex;
  align-items: center;
  margin-top: 3px;
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

  .vip-promotion-wrap > div {
    height: 55px;
  }

  .sub-text {
    font-size: 8px;
  }

  .mcenter-func {
    padding: 0 16px;
  }
}
</style>
