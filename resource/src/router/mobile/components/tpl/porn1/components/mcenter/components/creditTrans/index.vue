<template>
  <mobile-container :header-config="headerSetting" :has-footer="false">
    <div slot="content" :class="[$style['content-wrap'], 'clearfix']">
      <!-- 黑名單阻擋 -->
      <template v-if="isShowBlockTips">
        <block-list-tips type="transfer" @close="closeTips" />
      </template>

      <div :class="[$style['tab-wrap']]">
        <div
          v-for="(item, index) in tabItem"
          :key="`tab-${item.key}`"
          :class="[
            $style['tab-item'],
            { [$style['is-current']]: currentTab === index }
          ]"
          @click="setTabCurrent(index)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceTran from "@/components/mcenter/components/balanceTran";
import blockListTips from "../../../common/new/blockListTips";
import mobileContainer from "../../../common/new/mobileContainer";

export default {
  components: {
    mobileContainer,
    blockListTips,
    balanceTran,
  },
  data() {
    return {
      transferMoney: null,
      headerSetting: {
        title: this.$text("S_CREDIT_TRANSDER", "额度转让"),
        prev: true,
        onClick: () => {
          this.$router.back();
        },
      },
      isShowBlockTips: false,
      isShowMore: true,
      isShowTransOutSelect: false,
      isShowTransInSelect: false,
      currentTab: "transder"
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    tabItem() {
      return [
        {
          key: "discount",
          text: this.$text("S_CREDIT_DISCOUNT", "转让优惠"),
        },
        {
          key: "transder",
          text: this.$text("S_CREDIT_TRANSDER", "额度转让"),
        },
        {
          key: "recoard",
          text: this.$text("S_CREDIT_RECOARD", "转让纪录"),
        },
      ]
    },
  },
  created() {

  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      'actionSetGlobalMessage'
    ]),
    closeTips() {
      this.isShowBlockTips = false;
      this.$router.back();
    }
  }
};
</script>
<style lang="scss" src="./css/index.module.scss" module></style>
