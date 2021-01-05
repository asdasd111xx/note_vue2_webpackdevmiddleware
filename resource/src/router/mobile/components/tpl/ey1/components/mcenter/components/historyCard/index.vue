<template>
  <div :class="$style['wrap']">
    <div :class="$style['header']">
      <div :class="$style['btn-prev']" @click="backPre">
        <img
          :src="$getCdnPath(`/static/image/common/btn_back_white.png`)"
          alt="back"
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
          :src="$getCdnPath('/static/image/ey1/common/btn_more.png')"
          alt="more"
        />
      </div>
    </div>

    <!-- 目前還未有歷史銀行卡的需求，先一律隱藏 Tab -->
    <!-- <div v-if="isShowTab" :class="$style['tab-wrap']">
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
    </div> -->

    <component
      :is="currentPage"
      :is-show-tab="isShowTab"
      :set-page-status="setPageStatus"
      :show-detail.sync="showDetail"
      :edit-status.sync="editStatus"
      :is-audit.sync="isAudit"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import entryMixin from "@/mixins/mcenter/historyCard/index";

export default {
  components: {
    bankCardInfo: () =>
      import(
        /* webpackChunkName: 'bankCardInfo' */ "./components/bank/cardInfo"
      ),
    walletCardInfo: () =>
      import(
        /* webpackChunkName: 'walletCardInfo' */ "./components/wallet/cardInfo"
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
          text: this.themeTPL === "porn1" ? "数字货币" : "电子钱包"
        }
      ];
    },
    headerTitle() {
      if (this.showDetail) {
        return this.currentPage === "walletCardInfo"
          ? this.$text("S_VIRTUAL_BANKCARD")
          : this.$text("S_BANKCARD");
      } else {
        return this.$text("S_HISTORY_ACCOUNT", "历史帐号");
      }
    },
    isOneTab() {
      return !this.userLevelObj.bank || !this.userLevelObj.virtual_bank;
    }
  },
  created() {
    this.actionSetUserLevels().then(() => {
      // 目前尚有歷史銀行卡的頁面，故預設為電子錢包

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
    ...mapActions(["actionSetUserLevels"]),
    setPageStatus(tabIndex, pageName, isShowTab) {
      this.currentTab = tabIndex;
      this.currentPage = pageName;
      this.isShowTab = false;

      // 歷史錢包目前只有電子錢包，等開放銀行卡在把它註解回來
      // 當 Tab 在某些頁面不用顯示，this.isShowTab = false
      // if (!isShowTab) {
      //   this.isShowTab = false;
      // } else {
      //   this.isShowTab = this.isOneTab ? false : true;
      // }
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
      // 當頁面停留在卡片管理
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
      }

      this.$router.back();
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/bankCard/ey1.index.module.scss"
  module="$style_ey1"
></style>
