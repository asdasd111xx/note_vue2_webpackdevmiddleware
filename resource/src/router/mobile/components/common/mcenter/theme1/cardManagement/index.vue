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
    </div>

    <div v-if="isReceive && isShowTab" :class="$style['tab-wrap']">
      <div
        v-for="(item, index) in tabItem"
        :key="`tab-${item.key}`"
        :class="[
          $style['tab-item'],
          { [$style['is-current']]: currentTab === index }
        ]"
        @click="setCurrentTab(index)"
      >
        {{ item.text }}
      </div>
      <div
        :class="[$style['active-slider']]"
        :style="{ left: `calc(25% + 50% * ${currentTab})` }"
      />
    </div>

    <component
      :is="currentPage"
      :is-show-tab="isShowTab"
      :set-page-status="setPageStatus"
      :status-list.sync="statusList"
      :add-bank-card-step.sync="addBankCardStep"
      :user-level-obj="userLevelObj"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import entryMixin from "@/mixins/mcenter/bankCard/index";

export default {
  components: {
    bankCardInfo: () =>
      import(
        /* webpackChunkName: 'bankCardInfo' */ "./components/bank/cardInfo"
      ),
    addBankCard: () =>
      import(/* webpackChunkName: 'addBankCard' */ "./components/bank/addCard"),
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
    return {};
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
          text: "银行卡"
        },
        {
          key: "wallet",
          text: ["porn1", "sg1", "aobo1", "sp1"].includes(this.themeTPL)
            ? "数字货币"
            : "电子钱包"
        }
      ];
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
      }
    },
    isOneTab() {
      return !this.userLevelObj.bank || !this.userLevelObj.virtual_bank;
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
    this.actionSetUserLevels().then(() => {
      let type = this.$route.query.type;
      let tempType = localStorage.getItem("bankCardType");
      console.log(this.$route.query.redirect);
      // 如果是從其它頁導轉過來，會進到添加卡片頁面，不用判斷開關(已 Set 為 False)
      if (this.hasRedirect || tempType) {
        if ((type && type === "bankCard") || tempType === "bankCard") {
          this.setPageStatus(0, "addBankCard", false);
        }

        if ((type && type === "wallet") || tempType === "wallet") {
          this.setPageStatus(1, "addWalletCard", false);
          if (this.$route.query.redirect === "epoint") {
            this.$router.replace("/mobile/mcenter/bankCard");
          }
        }

        localStorage.removeItem("bankCardType");
        return;
      }

      // 銀行卡/電子錢包，其中有一方關閉(在常用錢包頁面)
      if (this.isOneTab) {
        if (this.userLevelObj.bank) {
          this.setPageStatus(0, "bankCardInfo", false);
          return;
        }

        if (this.userLevelObj.virtual_bank) {
          this.setPageStatus(1, "walletCardInfo", false);
          return;
        }
      }

      // 預設頁面(預設為銀行卡頁面)
      this.setPageStatus(0, "bankCardInfo", true);
    });
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetUserLevels"]),
    setPageStatus(tabIndex, pageName, isShowTab) {
      this.isReceive = false;
      this.currentTab = tabIndex;
      this.currentPage = pageName;

      // 當 Tab 在某些頁面不用顯示，this.isShowTab = false
      if (!isShowTab) {
        this.isShowTab = false;
      } else {
        this.isShowTab = this.isOneTab ? false : true;
      }

      this.isReceive = true;
    },
    setCurrentTab(index) {
      this.currentTab = index;
      switch (index) {
        case 0:
          this.currentPage = "bankCardInfo";
          break;

        case 1:
          this.currentPage = "walletCardInfo";
          break;
      }
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
              this.currentTab,
              this.currentPage,
              this.$route.name != "mcenter-historyCard"
            );
            return;
          }

          this.$router.back();
          return;

        // 當頁面停留在添加卡片
        case "addBankCard":
          this.setPageStatus(0, "bankCardInfo", true);
          return;

        case "addWalletCard":
          this.setPageStatus(1, "walletCardInfo", true);
          return;
      }
      this.$router.back();
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
