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
        :class="$style['icon-edit']"
        @click="editDetailStatus = true"
      >
        <img
          :src="$getCdnPath('/static/image/ey1/common/btn_more_w.png')"
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
      :change-page="changePage"
      :show-tab="showTab"
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
    virtualBankCardInfo: () =>
      import(
        /* webpackChunkName: 'virtualBankCardInfo' */ "./components/virtualBank/cardInfo"
      )
  },
  mixins: [entryMixin],
  data() {
    return {
      currentTab: 0,
      currentKind: "bank",
      isShowTab: true
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
          key: "virtualBank",
          text: "电子钱包"
        }
      ];
    },
    headerTitle() {
      if (this.showDetail) {
        return this.currentPage === "virtualBankCardInfo"
          ? this.$text("S_VIRTUAL_BANKCARD")
          : this.$text("S_BANKCARD");
      } else {
        return this.$text("S_HISTORY_ACCOUNT", "历史帐号");
      }
    }
  },
  created() {
    this.actionSetUserLevels().then(() => {
      // 目前尚有歷史銀行卡的頁面，故預設為電子錢包
      this.setCurrentTab(1);

      // 銀行卡/電子錢包，其中有一方關閉
      // if (!this.userLevelObj.bank || !this.userLevelObj.virtual_bank) {
      //   this.isShowTab = false;
      //   this.$nextTick(() => {
      //     if (this.userLevelObj.bank) {
      //       // this.currentKind = "bank";
      //       // this.currentPage = "bankCardInfo";
      //       this.setCurrentTab(0);
      //       return;
      //     }
      //     if (this.userLevelObj.virtual_bank) {
      //       // this.currentKind = "virtualBank";
      //       // this.currentPage = "virtualBankCardInfo";
      //       this.setCurrentTab(1);
      //       return;
      //     }
      //   });
      // }
    });
  },
  methods: {
    ...mapActions(["actionSetUserLevels"]),
    setCurrentTab(index) {
      this.currentTab = index;
      switch (index) {
        case 0:
          this.currentKind = "bank";
          this.currentPage = "bankCardInfo";
          break;

        case 1:
          this.currentKind = "virtualBank";
          this.currentPage = "virtualBankCardInfo";
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
        this.currentPage === "virtualBankCardInfo"
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

.icon-edit {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 12px;
  width: 20px;
  height: 20px;
  margin: auto;
}

.tab-wrap {
  position: relative;
  display: flex;
  background: #fff;
  border-bottom: 1px solid #eee;
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
