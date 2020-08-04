<template>
  <div :class="$style['wrap']">
    <div :class="$style['header']">
      <div :class="$style['btn-prev']" @click="backPre">
        <img
          :src="$getCdnPath('/static/image/_new/common/btn_back_w.png')"
          alt="more"
        />
      </div>

      <div :class="[$style['content'], 'clearfix']">
        <div :class="$style['title']">{{ headerTitle }}</div>
      </div>

      <div
        v-if="showDetail"
        :class="$style['icon-edit']"
        @click="editDetailStatus = true"
      >
        <img
          :src="$getCdnPath('/static/image/_new/common/btn_more_w.png')"
          alt="more"
        />
      </div>
    </div>

    <div :class="$style['tab-wrap']">
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
      :current-kind="currentKind"
      :change-page="changePage"
      :show-detail.sync="showDetail"
      :edit-status.sync="editStatus"
      :add-bank-card-step.sync="addBankCardStep"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import entryMixin from "@/mixins/mcenter/bankCard/index";

export default {
  components: {
    cardInfo: () =>
      import(/* webpackChunkName: 'cardInfo' */ "./components/cardInfo"),
    addCard: () =>
      import(/* webpackChunkName: 'addCard' */ "./components/addCard")
  },
  mixins: [entryMixin],
  data() {
    return {
      currentTab: 0,
      currentKind: "bank"
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
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
      if (this.hasRedirect && this.$route.query.redirect !== "withdraw") {
        return "提现银行卡";
      }
      return this.$text(
        ...(this.currentPage === "cardInfo"
          ? ["S_CARD_MANAGEMENT", "卡片管理"]
          : ["S_ADD_BANKCARD", "添加银行卡"])
      );
    }
  },
  created() {
    // todo: 判斷 bank & virtualBank 是否有被啟用
    /*
    //   return axios({
    //     method: "get",
    //     url: "api/v1/c/levels/by_user",
    //   }).then(response => {
    */
  },
  methods: {
    setCurrentTab(index) {
      this.currentTab = index;
      switch (index) {
        case 0:
          this.currentKind = "bank";
          break;

        case 1:
          this.currentKind = "virtualBank";
          break;
      }
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
