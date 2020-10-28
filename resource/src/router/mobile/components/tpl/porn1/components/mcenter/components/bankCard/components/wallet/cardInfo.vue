<template>
  <div :class="$style['my-card']">
    <!-- 卡片管理列表 -->
    <template v-if="!showDetail">
      <div v-if="isRevice && wallet_card.length > 0">
        <div
          :class="[$style['card-count'], 'clearfix']"
          :style="isShowTab ? {} : { top: '43px' }"
        >
          <span :class="$style['title']">
            {{
              themeTPL === "porn1"
                ? $text("S_MY_DIGITAL_CURRENCY_WALLET", "我的数字货币钱包")
                : $text("S_MY_VIRTUAL_BANKCARD", "我的电子钱包")
            }}
          </span>

          <span :class="$style['count']">
            {{
              $text("S_CRAD_COUNT", "共%s张").replace("%s", wallet_card.length)
            }}
          </span>
        </div>

        <!-- 需調整版型與銀行一致 -->
        <div
          :class="$style['card-list']"
          :style="isShowTab ? {} : { 'margin-top': '41px' }"
        >
          <card-item
            v-for="(item, index) in wallet_card"
            :key="item.id"
            :index="index"
            :data="item"
            :isDetailPage="false"
            :type="'wallet'"
            @onClick="onClickDetail(item, index)"
            @setPageStatus="setPageStatus(1, 'walletCardInfo', false)"
          />
        </div>
      </div>

      <!-- 無資料時 -->
      <div
        v-if="!isRevice || wallet_card.length === 0"
        :class="$style['no-data']"
      >
        <div :class="$style['no-bankcard']">
          <img
            :src="`/static/image/${themeTPL}/mcenter/bankCard/no_bankcard.png`"
          />
        </div>
      </div>

      <!-- 添加卡片按鈕區塊 -->
      <template v-if="isShowAddCardButton">
        <div :class="$style['add-wrap']">
          <div
            :class="$style['add-btn']"
            @click="setPageStatus(1, 'addWalletCard', false)"
          >
            <img :src="`/static/image/${themeTPL}/mcenter/add_2.png`" />
            <span>
              {{
                themeTPL === "porn1"
                  ? $text("S_ADD_DIGITAL_CURRENCY", "添加数字货币")
                  : $text("S_ADD_VIRTUAL_BANKCARD", "添加电子钱包")
              }}
            </span>
          </div>
        </div>

        <p :class="$style['remind']">
          <template v-if="themeTPL === 'porn1'">
            {{ $t("S_DIGITAL_CURRENCY_LIMIT").replace("%s", 1) }}
          </template>

          <template v-if="themeTPL === 'ey1'">
            <span v-if="userLevelObj.virtual_bank_single">
              {{
                $t("S_VIRTUAL_BANKCARD_TYPE_LIMIT").replace(
                  "%s",
                  nowOpenWallet.length
                )
              }}
            </span>

            <span v-else>
              {{ $t("S_VIRTUAL_BANKCARD_LIMIT").replace("%s", 15) }}
            </span>
          </template>
        </p>
      </template>
    </template>

    <!-- 卡片詳細資料 -->
    <template v-if="showDetail && wallet_cardDetail">
      <div v-if="wallet_cardDetail.auditing" :class="$style['audit-block']">
        <div>删除审核中</div>
        <span> 审核通过后，系统会自动刪除钱包 </span>
      </div>

      <card-item
        :data="wallet_cardDetail"
        :index="colorRepeatIndex"
        :isDetailPage="true"
        :type="'wallet'"
      />

      <div v-if="editStatus" :class="$style['edit-bankcard']">
        <div :class="$style['edit-mask']" />
        <div :class="$style['edit-button']">
          <template
            v-if="themeTPL === 'ey1' && !userLevelObj.virtual_bank_single"
          >
            <div
              v-if="userLevelObj.virtual_bank_single && hasSameTypeCard"
              :class="$style['edit-option-item']"
              @click="moveCard"
            >
              停用
            </div>

            <div v-else :class="$style['edit-option-item']" @click="moveCard">
              移至历史帐号
            </div>
          </template>

          <div
            v-if="memInfo.config.delete_bank_card"
            :class="[
              $style['edit-option-item'],
              { [$style['confirm']]: themeTPL === 'porn1' },
            ]"
            @click="isShowPop = true"
          >
            {{ themeTPL === "porn1" ? "解除绑定" : "删除电子钱包" }}
          </div>

          <div
            :class="[$style['edit-option-item'], $style['cancel']]"
            @click="$emit('update:editStatus', false)"
          >
            取消
          </div>
        </div>
      </div>
    </template>

    <div v-if="isShowPop" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" />
      <div :class="$style['pop-block']">
        <div :class="$style['content']">
          <div :class="$style['title']">
            {{ $text("S_TIPS", "温馨提示") }}
          </div>

          <span>
            {{
              themeTPL === "porn1"
                ? "确定解除绑定该钱包？"
                : "确定删除该张卡片吗？"
            }}
          </span>
        </div>

        <div :class="$style['button-block']">
          <span @click="isShowPop = false">
            {{ $text("S_CANCEL", "取消") }}
          </span>

          <span @click="onDelete">
            {{ $text("S_CONFIRM_2", "确定") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import virtualMixin from "@/mixins/mcenter/bankCard/cardInfo/wallet";
import cardItem from "../cardItem";

export default {
  components: {
    cardItem
  },
  mixins: [virtualMixin],
  props: {
    isShowTab: {
      type: Boolean,
      required: true
    },
    setPageStatus: {
      type: Function,
      default: () => { }
    },
    showDetail: {
      type: Boolean,
      required: true
    },
    editStatus: {
      type: Boolean,
      required: true
    },
    isAudit: {
      type: Boolean,
      required: true
    },
    userLevelObj: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.getNowOpenWallet();
    this.getUserWalletList();
  },
  computed: {
    isBindNowOpenAllWallets() {
      // 根據目前已綁定的 ID 與目前有開放的所有銀行 ID 做比對
      let nowBindWalletCount = 0;
      let idArr = [
        ...new Set(
          this.wallet_card.map(item => {
            return item.virtual_bank_id;
          })
        )
      ];

      if (idArr) {
        this.nowOpenWallet.forEach(item => {
          if (idArr.includes(item.id)) {
            nowBindWalletCount += 1;
          }
        });

        return nowBindWalletCount >= this.nowOpenWallet.length ? true : false;
      }

      return false;
    },
    isShowAddCardButton() {
      switch (this.themeTPL) {
        case "porn1":
          return !this.isBindNowOpenAllWallets;
          break;

        case "ey1":
          return (
            (!this.userLevelObj.virtual_bank_single &&
              this.wallet_card.length < 15) ||
            (this.userLevelObj.virtual_bank_single &&
              this.wallet_card.length < this.nowOpenWallet.length)
          );
          break;
      }
    }
  },
  methods: {
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath(
          `/static/image/${this.themeTPL}/default/bank_default_2.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/${this.themeTPL}/default/bank_default_2.png`
        )
      };
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/bankCard/porn1.cardInfo.module.scss"
  module="$style_porn1"
></style>

<style
  lang="scss"
  src="@/css/page/bankCard/ey1.cardInfo.module.scss"
  module="$style_ey1"
></style>
