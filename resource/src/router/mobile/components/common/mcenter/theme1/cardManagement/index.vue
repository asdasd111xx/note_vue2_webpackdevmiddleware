<template>
  <div :class="[$style['wrap']]">
    <div :class="$style['header']">
      <div :class="$style['btn-prev']" @click="backPre">
        <img
          :src="
            $getCdnPath(
              `/static/image/common/btn_back_${
                themeTPL === 'porn1' ||
                themeTPL === 'aobo1' ||
                themeTPL === 'sp1'
                  ? 'grey'
                  : themeTPL === 'sg1'
                  ? 'black'
                  : null
              }.png`
            )
          "
          alt="back"
        />
      </div>

      <div :class="[$style['content'], 'clearfix']">
        <div :class="$style['title']">{{ headerTitle }}</div>
      </div>

      <!-- 詳細頁-編輯按鈕 -->
      <div
        v-if="showDetailButton"
        :class="$style['header-icon']"
        @click="syncStatusList.editDetail = true"
      >
        <img
          :src="
            $getCdnPath(
              `/static/image/${siteConfig.MOBILE_WEB_TPL}/common/btn_more.png`
            )
          "
          alt="more"
        />
      </div>
      <!-- 掛單銀行卡-完成 -->
      <div
        v-if="currentPage === 'addOrderCard'"
        :class="[
          $style['order-confirm'],
          { [$style['active']]: orderConfirmBtnActive }
        ]"
        @click="orderConfirmBtnActive ? handleClickOrderConfirmBtn() : ''"
      >
        完成
      </div>
    </div>

    <div v-if="isReceive && showTabHandler" :class="$style['tab-wrap']">
      <div
        v-for="(item, index) in tabItem"
        :key="`tab-${item.key}`"
        :class="[
          $style['tab-item'],
          { [$style['is-current']]: currentTab === index }
        ]"
        @click="setCurrentTab(item, index)"
      >
        {{ item.text }}
      </div>
      <div
        :class="[$style['active-slider']]"
        :style="{ left: `${tabLeft}%` }"
      />
    </div>

    <component
      :is="currentPage"
      :is-show-tab="showTabHandler"
      :set-page-status="setPageStatus"
      :status-list.sync="statusList"
      :add-bank-card-step.sync="addBankCardStep"
      :user-level-obj="userLevelObj"
      ref="component"
      @update="handleEmitOrderConfirmBtn"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import entryMixin from "@/mixins/mcenter/bankCard/index";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    bankCardInfo: () =>
      import(
        /* webpackChunkName: 'bankCardInfo' */ "./components/bank/cardInfo"
      ),
    addBankCard: () =>
      import(/* webpackChunkName: 'addBankCard' */ "./components/bank/addCard"),
    orderCardInfo: () =>
      import(
        /* webpackChunkName: 'bankCardInfo' */ "./components/order/cardInfo"
      ),
    addOrderCard: () =>
      import(
        /* webpackChunkName: 'addBankCard' */ "./components/order/addCard"
      ),
    walletCardInfo: () =>
      import(
        /* webpackChunkName: 'walletCardInfo' */ "./components/wallet/cardInfo"
      ),
    addWalletCard: () =>
      import(
        /* webpackChunkName: 'addWalletCard' */ "./components/wallet/addCard"
      )
  },
  mixins: [entryMixin],
  data() {
    return {
      orderConfirmBtnActive: false,
      isSupportEpoint: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      userLevelObj: "getUserLevels",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.ROUTER_TPL;
    },

    tabItem() {
      return [
        {
          key: "bank",
          text: "银行卡",
          isShow: this.userLevelObj.bank
        },
        {
          key: "wallet",
          text: ["porn1", "sg1", "aobo1", "sp1"].includes(this.themeTPL)
            ? "数字货币"
            : "电子钱包",
          isShow: this.userLevelObj.virtual_bank
        },
        {
          key: "order",
          text: "挂单银行卡",
          isShow: this.isSupportEpoint
        }
      ].filter(item => item.isShow);
    },
    tabLeft() {
      return (
        100 / this.tabItem.filter(v => v.isShow).length / 2 +
        (100 / this.tabItem.filter(v => v.isShow).length) * this.currentTab
      );
    },
    headerTitle() {
      const { type, redirect } = this.$route.query;
      const { hasRedirect, currentPage, themeTPL } = this;
      const { showDetail } = this.statusList;
      // 非提現頁面跳轉過來 & 類型為銀行卡
      if (hasRedirect && type === "bankCard" && redirect !== "withdraw") {
        return "提现银行卡";
      }

      // 從其它頁面跳轉過來 & 類型為銀行卡
      if (hasRedirect && type === "bankCard") {
        return this.$text("S_ADD_BANKCARD", "添加银行卡");
      }

      // 從其它頁面跳轉過來 & 類型為錢包
      if (hasRedirect && type === "wallet") {
        switch (themeTPL) {
          case "porn1":
          case "sg1":
          case "aobo1":
          case "sp1":
            return this.$text("S_ADD_DIGITAL_CURRENCY", "添加数字货币");
        }
      }

      // 根據目前頁面
      switch (currentPage) {
        // 卡片管理-銀行卡
        case "bankCardInfo":
          return showDetail
            ? this.$text("S_BANKCARD", "银行卡")
            : this.$text("S_CARD_MANAGEMENT", "卡片管理");

        // 卡片管理-錢包
        case "walletCardInfo":
          switch (themeTPL) {
            case "porn1":
            case "sg1":
            case "aobo1":
            case "sp1":
              return showDetail
                ? this.$text("S_DIGITAL_CURRENCY", "数字货币")
                : this.$text("S_CARD_MANAGEMENT", "卡片管理");
          }

          break;
        // 卡片管理-掛單
        case "orderCardInfo":
          return this.$text("S_ORDERCARD", "挂单银行卡");

        // 添加銀行卡
        case "addBankCard":
          return this.$text("S_ADD_BANKCARD", "添加银行卡");

        // 添加錢包
        case "addWalletCard":
          switch (this.themeTPL) {
            case "porn1":
            case "sg1":
            case "aobo1":
            case "sp1":
              return this.$text("S_ADD_DIGITAL_CURRENCY", "添加数字货币");
          }
          break;
        // 添加掛單銀行卡
        case "addOrderCard":
          return this.$text("S_ADD_ORDERCARD", "添加挂单银行卡");
      }
    },
    showTabHandler() {
      //迅付-會員層級管理-可綁定取款類型
      //當銀行卡關閉且epoint關閉||電子錢包關閉||!this.isShowTab 時 不顯示頁籤
      if (
        (!this.userLevelObj.bank && !this.isSupportEpoint) ||
        !this.userLevelObj.virtual_bank ||
        !this.isShowTab
      )
        return false;
      else return true;
    },
    showDetailButton() {
      const { memInfo, currentPage } = this;
      const { showDetail, isAudit } = this.statusList;

      const showButton =
        showDetail && !isAudit && memInfo.config.delete_bank_card;

      switch (currentPage) {
        case "bankCardInfo":
          return showButton;

        case "walletCardInfo":
          return showButton;
      }
    }
  },
  created() {
    if (!document.querySelector('script[data-name="esabgnixob"]')) {
      this.script = document.createElement("script");
      this.script.setAttribute("type", "text/javascript");
      this.script.setAttribute("data-name", "esabgnixob");
      this.script.setAttribute("src", "esabgnixob.js");

      document.head.appendChild(this.script);
    }

    this.actionSetUserdata(true);

    // 以下處理頁面設定
    this.getIsSupportEpoint();
    this.actionSetUserLevels().then(() => {
      let type = this.$route.query.type;
      let tempType = localStorage.getItem("bankCardType");
      console.log(this.$route.query.redirect);
      // 如果是從其它頁導轉過來，會進到添加卡片頁面，不用判斷開關(已 Set 為 False)
      if (this.hasRedirect || tempType) {
        if ((type && type === "bankCard") || tempType === "bankCard") {
          this.setPageStatus("addBankCard", false);
        }

        if ((type && type === "wallet") || tempType === "wallet") {
          this.setPageStatus("addWalletCard", false);
          if (this.$route.query.redirect === "epoint") {
            this.$router.replace("/mobile/mcenter/bankCard");
          }
        }
        if ((type && type === "orderCard") || tempType === "orderCard") {
          this.setPageStatus("addOrderCard", false);
        }

        localStorage.removeItem("bankCardType");
        return;
      }

      // 預設頁面(預設為銀行卡頁面)
      this.setPageStatus(
        this.userLevelObj.bank ? "bankCardInfo" : "walletCardInfo",
        true
      );
    });
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetUserLevels"]),
    getIsSupportEpoint() {
      // 取得是否支援e点富/E点付 C04.58
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Vendor/Is/Support/Epoints`,
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res && res.status === "000" && res.errorCode === "00") {
          this.isSupportEpoint = res.data.ret;
        }
      });
    },
    setPageStatus(pageName, isShowTab) {
      this.isReceive = false;
      this.currentTab = this.tabItem.findIndex(v => pageName.includes(v.key));
      this.currentPage = pageName;

      // 當 Tab 在某些頁面不用顯示，this.isShowTab = false
      this.isShowTab = isShowTab;
      this.isReceive = true;
    },
    setCurrentTab(item, index) {
      this.currentTab = index;
      this.currentPage = `${item.key}CardInfo`;
    },
    backPre() {
      //刪除數字貨幣路徑 刪除選擇卡片
      localStorage.removeItem("oneClickBindingMode");
      localStorage.removeItem("isBackFromService");
      localStorage.removeItem("selectTarget");
      // 銀行卡/電子錢包分兩階段
      if (
        (this.currentPage === "addBankCard" &&
          this.addBankCardStep === "two") ||
        (this.currentPage === "addWalletCard" && this.addBankCardStep === "two")
      ) {
        this.step = "one";
        return;
      }

      // 從其它頁面進入到此頁面(通常停留在添加卡片的頁面)
      let redirect = this.$route.query.redirect;
      if (redirect) {
        switch (redirect) {
          case "home":
            this.$router.push("/mobile");
            break;

          case "liveStream":
            this.$router.push("/mobile/liveStream");
            break;

          case "iframe":
            let path = localStorage.getItem("bank-card-back-redirect");
            localStorage.removeItem("bank-card-back-redirect");
            if (path) {
              this.$router.push(path);
            } else {
              this.$router.back();
            }
            break;
          case "epoint":
            // this.$router.replace("/mobile/mcenter/bankCard");
            // this.setPageStatus(1, "walletCardInfo", true);
            console.log("epoint back?");
            break;

          case "live-iframe":
            this.$router.push("/mobile/live/iframe/home");
            break;
          default:
            this.$router.back();
            break;
        }
        return;
      }

      switch (this.currentPage) {
        // 當頁面停留在卡片管理
        case "bankCardInfo":
        case "walletCardInfo":
          // 卡片管理-詳細頁面
          if (this.statusList.showDetail) {
            this.statusList.showDetail = false;

            this.setPageStatus(
              this.currentPage,
              this.$route.name != "mcenter-historyCard"
            );
            return;
          }

          this.$router.back();
          return;

        // 當頁面停留在添加卡片
        case "addBankCard":
          this.setPageStatus("bankCardInfo", true);
          return;
        case "addWalletCard":
          this.setPageStatus("walletCardInfo", true);
          return;
        case "addOrderCard":
          this.setPageStatus("orderCardInfo", true);
          return;
      }
      this.$router.back();
    },
    handleEmitOrderConfirmBtn(boolen) {
      this.orderConfirmBtnActive = boolen;
    },
    handleClickOrderConfirmBtn() {
      this.$refs.component.addOrderCard();
      this.orderConfirmBtnActive = false;
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/bankCard/porn1.index.module.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="@/css/page/bankCard/sg1.index.module.scss"
  module="$style_sg1"
></style>
