<template>
  <div :class="$style['wrap']">
    <div :class="$style['header']">
      <div :class="$style['btn-prev']" @click="backPre">
        <img
          :src="$getCdnPath('/static/image/ey1/common/btn_back_w.png')"
          alt="more"
        />
      </div>

      <div :class="[$style['content'], 'clearfix']">
        <div :class="$style['title']">{{ headerTitle }}</div>
      </div>

      <div
        v-if="showDetail && !isAudit"
        :class="$style['header-icon']"
        @click="editDetailStatus = true"
      >
        <img
          :src="$getCdnPath('/static/image/ey1/common/btn_more_w.png')"
          alt="more"
        />
      </div>

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
    </div>

    <div v-if="isShowTab" :class="$style['tab-wrap']">
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
      userLevelObj: "getUserLevels"
    }),
    tabItem() {
      return [
        {
          key: "bank",
          text: "银行卡"
        },
        {
          key: "wallet",
          text: "电子钱包"
        }
      ];
    },
    headerTitle() {
      if (
        this.hasRedirect &&
        this.$route.query.type === "bankCard" &&
        this.$route.query.redirect !== "withdraw"
      ) {
        return "提现银行卡";
      }

      if (this.hasRedirect && this.$route.query.type === "bankCard") {
        return this.$text("S_ADD_BANKCARD", "添加银行卡");
      }

      if (this.hasRedirect && this.$route.query.type === "wallet") {
        return this.$text("S_ADD_VIRTUAL_BANKCARD", "添加电子钱包");
      }

      switch (this.currentPage) {
        case "bankCardInfo":
          return this.showDetail
            ? this.$text("S_BANKCARD", "银行卡")
            : this.$text("S_CARD_MANAGEMENT", "卡片管理");
          break;

        case "walletCardInfo":
          return this.showDetail
            ? this.$text("S_VIRTUAL_BANKCARD", "电子钱包")
            : this.$text("S_CARD_MANAGEMENT", "卡片管理");
          break;
          break;

        case "addBankCard":
          return this.$text("S_ADD_BANKCARD", "添加银行卡");
          break;

        case "addWalletCard":
          return this.$text("S_ADD_VIRTUAL_BANKCARD", "添加电子钱包");
          break;
      }
    },
    isOneTab() {
      return !this.userLevelObj.bank || !this.userLevelObj.virtual_bank;
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

      // 預設頁面
      this.setPageStatus(this.currentTab, this.currentPage, this.isShowTab);
    });
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetUserLevels"]),
    setPageStatus(tabIndex, pageName, isShowTab) {
      this.currentTab = tabIndex;
      this.currentPage = pageName;

      // 當 Tab 在某些頁面不用顯示，this.isShowTab = false
      if (!isShowTab) {
        this.isShowTab = false;
      } else {
        this.isShowTab = this.isOneTab ? false : true;
      }
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
      if (this.$route.query && this.$route.query.redirect) {
        switch (this.$route.query.redirect) {
          case "home":
            this.$router.push("/mobile");

            break;

          case "liveStream":
            this.$router.push("/mobile/liveStream");
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

        default:
          break;

          return;
      }

      this.$router.back();
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.wrap {
  padding-top: 43px;
  background: #f8f8f8;
  min-height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  z-index: 3;
  max-width: $mobile_max_width;

  width: 100%;
  height: 43px;
  padding: 0 17px;
  text-align: center;
  border-bottom: 1px solid #eee;
  background: linear-gradient(#fe2a2a, #b60303);

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
}

@media (orientation: landscape) {
  .header {
    max-width: 768px !important;
  }
}

.btn-prev {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  width: 20px;
  height: 20px;
  margin: auto;

  > img {
    display: block;
    width: 100%;
  }
}

.title {
  float: left;
  height: 22px;
  line-height: 22px;
  color: #fff;
  font-size: 17px;
}

.content {
  display: inline-block;
  margin: 0 24px;
  vertical-align: middle;
}

.header-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 12px;
  width: 20px;
  height: 20px;
  margin: auto;

  > img {
    width: 100%;
  }
}

.tab-wrap {
  // position: fixed;
  position: relative;
  display: flex;
  background: #fff;
  border-bottom: 1px solid #eee;
  width: 100%;
  max-width: $mobile_max_width;
  // z-index: 10;
}

.tab-item {
  flex: 1;
  position: relative;
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: $main_text_color2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.is-current {
    color: $main_text_color4;
  }
}

.active-slider {
  position: absolute;
  width: 12%;
  height: 2px;
  bottom: 0;
  transform: translateX(-50%);
  background: #e42a30;
  transition: left 0.31s;
}
</style>
