<template>
  <div :class="$style['wrap']">
    <div :class="$style['header']">
      <div :class="$style['btn-prev']" @click="backPre">
        <img
          :src="$getCdnPath('/static/image/porn1/common/btn_back.png')"
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
          :src="$getCdnPath('/static/image/porn1/common/btn_more.png')"
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
      :change-page="changePage"
      :show-tab="showTab"
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
    return {
      currentTab: 0,
      currentKind: "bank",
      isShowTab: false
    };
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
          text: "数字货币"
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
        return this.$text("S_ADD_DIGITAL_CURRENCY", "添加数字货币");
      }

      switch (this.currentPage) {
        case "bankCardInfo":
        case "walletCardInfo":
          return this.$text("S_CARD_MANAGEMENT", "卡片管理");

        default:
          return this.currentKind === "bank"
            ? this.$text("S_ADD_BANKCARD", "添加银行卡")
            : this.$text("S_ADD_DIGITAL_CURRENCY", "添加数字货币");
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
      if (!this.userLevelObj.bank || !this.userLevelObj.virtual_bank) {
        this.isShowTab = false;

        this.$nextTick(() => {
          if (this.userLevelObj.bank) {
            this.setCurrentTab(0);
            return;
          }

          if (this.userLevelObj.virtual_bank) {
            this.setCurrentTab(1);
            return;
          }
        });

        return;
      }

      this.isShowTab = true;
    });
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetUserLevels"]),
    setCurrentTab(index) {
      this.currentTab = index;
      switch (index) {
        case 0:
          this.currentKind = "bank";
          this.currentPage = "bankCardInfo";
          break;

        case 1:
          this.currentKind = "wallet";
          this.currentPage = "walletCardInfo";
          break;
      }
    },
    showTab(value) {
      this.isShowTab = value;
    },
    backPre() {
      const isOneTab =
        !this.userLevelObj.bank || !this.userLevelObj.virtual_bank;

      // 當頁面停留在卡片管理
      if (
        this.currentPage === "bankCardInfo" ||
        this.currentPage === "walletCardInfo"
      ) {
        // 卡片管理-詳細頁面
        if (this.showDetail) {
          this.showDetail = false;
          this.isShowTab = isOneTab ? false : true;
          return;
        }
        this.$router.back();
        return;
      }

      // 目前只有銀行卡有分兩階段
      if (this.addBankCardStep === "two") {
        this.step = "one";
        return;
      }

      // 從其它頁面進入到此頁面(通常停留在添加卡片的頁面)
      if (this.$route.query && this.$route.query.redirect) {
        if (this.$route.query.redirect === "home") {
          this.$router.push("/mobile");
          return;
        } else if (this.$route.query.redirect === "liveStream") {
          this.$router.push("/mobile/liveStream");
          return;
        }
        this.$router.back();
        return;
      }

      // 當頁面停留在添加卡片
      if (this.currentKind === "bank") {
        this.isShowTab = isOneTab ? false : true;
        this.currentPage = "bankCardInfo";
        return;
      } else if (this.currentKind === "wallet") {
        this.isShowTab = isOneTab ? false : true;
        this.currentPage = "walletCardInfo";
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
  background: #fefffe;
  text-align: center;
  border-bottom: 1px solid #eee;

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
  color: #000;
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
  position: fixed;
  display: flex;
  background: #fff;
  border-bottom: 1px solid #eee;
  width: 100%;
  max-width: $mobile_max_width;
  z-index: 10;
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
  background: #be9e7f;
  transition: left 0.31s;
}
</style>
