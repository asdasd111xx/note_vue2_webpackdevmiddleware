<template>
  <div :class="[$style['wrap']]">
    <div :class="$style['header']">
      <div :class="$style['btn-prev']" @click="backPre">
        <template v-if="['porn1', 'sg1'].includes(themeTPL)">
          <img
            :src="$getCdnPath('/static/image/porn1/common/btn_back.png')"
            alt="more"
          />
        </template>

        <template v-if="['ey1'].includes(themeTPL)">
          <img
            :src="$getCdnPath('/static/image/ey1/common/btn_back_w.png')"
            alt="more"
          />
        </template>
      </div>

      <div :class="[$style['content'], 'clearfix']">
        <div :class="$style['title']">{{ headerTitle }}</div>
      </div>

      <!-- 詳細頁-編輯按鈕 -->
      <div
        v-if="showDetailButton"
        :class="$style['header-icon']"
        @click="editDetailStatus = true"
      >
        <template v-if="['porn1', 'sg1'].includes(themeTPL)">
          <img
            :src="$getCdnPath('/static/image/porn1/common/btn_more.png')"
            alt="more"
          />
        </template>

        <template v-if="['ey1'].includes(themeTPL)">
          <img
            :src="$getCdnPath('/static/image/ey1/common/btn_more_w.png')"
            alt="more"
          />
        </template>
      </div>

      <!-- 歷史錢包按鈕 -->
      <template v-if="['ey1'].includes(themeTPL)">
        <div
          v-if="
            (currentPage === 'bankCardInfo' ||
              currentPage === 'walletCardInfo') &&
              !showDetail &&
              !userLevelObj.virtual_bank_single
          "
          :class="$style['header-icon']"
          @click="changeToHistory"
        >
          <img
            :src="
              $getCdnPath('/static/image/ey1/mcenter/bankCard/ic_history.png')
            "
            alt="more"
          />
        </div>
      </template>
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
        :class="$style['active-slider']"
        :style="{ left: `calc(25% + 50% * ${currentTab})` }"
      />
    </div>

    <component
      :is="currentPage"
      :is-show-tab="isShowTab"
      :set-page-status="setPageStatus"
      :show-detail.sync="showDetail"
      :edit-status.sync="editStatus"
      :is-audit.sync="isAudit"
      :add-bank-card-step.sync="addBankCardStep"
      :user-level-obj="userLevelObj"
    />
  </div>
</template>

<script>
import axios from "axios";
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
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    tabItem() {
      return [
        {
          key: "bank",
          text: "银行卡"
        },
        {
          key: "wallet",
          text: ["porn1", "sg1"].includes(this.themeTPL) ? "数字货币" : "电子钱包"
        }
      ];
    },
    headerTitle() {
      // 非提現頁面跳轉過來 & 類型為銀行卡
      if (
        this.hasRedirect &&
        this.$route.query.type === "bankCard" &&
        this.$route.query.redirect !== "withdraw"
      ) {
        return "提现银行卡";
      }

      // 從其它頁面跳轉過來 & 類型為銀行卡
      if (this.hasRedirect && this.$route.query.type === "bankCard") {
        return this.$text("S_ADD_BANKCARD", "添加银行卡");
      }

      // 從其它頁面跳轉過來 & 類型為錢包
      if (this.hasRedirect && this.$route.query.type === "wallet") {
        switch (this.themeTPL) {
          case "porn1":
          case "sg1":
            return this.$text("S_ADD_DIGITAL_CURRENCY", "添加数字货币");
            break;

          case "ey1":
            return this.$text("S_ADD_VIRTUAL_BANKCARD", "添加电子钱包");
            break;
        }
      }

      // 根據目前頁面
      switch (this.currentPage) {
        // 銀行卡-卡片管理
        case "bankCardInfo":
          return this.showDetail
            ? this.$text("S_BANKCARD", "银行卡")
            : this.$text("S_CARD_MANAGEMENT", "卡片管理");
          break;

        // 錢包-卡片管理
        case "walletCardInfo":
          switch (this.themeTPL) {
            case "porn1":
            case "sg1":
              return this.showDetail
                ? this.$text("S_DIGITAL_CURRENCY", "数字货币")
                : this.$text("S_CARD_MANAGEMENT", "卡片管理");
              break;

            case "ey1":
              return this.showDetail
                ? this.$text("S_VIRTUAL_BANKCARD", "电子钱包")
                : this.$text("S_CARD_MANAGEMENT", "卡片管理");
              break;
          }

          break;

        // 添加銀行卡
        case "addBankCard":
          return this.$text("S_ADD_BANKCARD", "添加银行卡");
          break;

        // 添加錢包
        case "addWalletCard":
          switch (this.themeTPL) {
            case "porn1":
            case "sg1":
              return this.$text("S_ADD_DIGITAL_CURRENCY", "添加数字货币");
              break;

            case "ey1":
              return this.$text("S_ADD_VIRTUAL_BANKCARD", "添加电子钱包");
              break;
          }
          break;
      }
    },
    isOneTab() {
      return !this.userLevelObj.bank || !this.userLevelObj.virtual_bank;
    },
    showDetailButton() {
      switch (this.currentPage) {
        case "bankCardInfo":
          return (
            this.showDetail &&
            !this.isAudit & this.memInfo.config.delete_bank_card
          );
          break;

        case "walletCardInfo":
          return this.showDetail && !this.isAudit;
          break;
      }
    }
  },
  created() {
    this.actionSetUserdata(true);
    this.actionSetUserLevels().then(() => {
      // 如果是從其它頁導轉過來，會進到添加卡片頁面，不用判斷開關(已 Set 為 False)
      if (this.hasRedirect) {
        return;
      }

      // 銀行卡/電子錢包，其中有一方關閉
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
      // this.setPageStatus(this.currentTab, this.currentPage, this.isShowTab);
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
      // 目前只有銀行卡有分兩階段
      if (
        this.currentPage === "addBankCard" &&
        this.addBankCardStep === "two"
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

          default:
            this.$router.back();
            // this.$router.push(`/mobile/mcenter/${redirect}`);
            break;
        }
        return;
      }

      switch (this.currentPage) {
        // 當頁面停留在卡片管理
        case "bankCardInfo":
        case "walletCardInfo":
          // 卡片管理-詳細頁面
          if (this.showDetail) {
            this.showDetail = false;
            this.setPageStatus(this.currentTab, this.currentPage, true);
            return;
          }

          this.$router.back();
          return;

          break;

        // 當頁面停留在添加卡片
        case "addBankCard":
          this.setPageStatus(0, "bankCardInfo", true);
          return;

          break;

        case "addWalletCard":
          this.setPageStatus(1, "walletCardInfo", true);
          return;

          break;
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
  src="@/css/page/bankCard/ey1.index.module.scss"
  module="$style_ey1"
></style>
<style
  lang="scss"
  src="@/css/page/bankCard/sg1.index.module.scss"
  module="$style_sg1"
></style>
