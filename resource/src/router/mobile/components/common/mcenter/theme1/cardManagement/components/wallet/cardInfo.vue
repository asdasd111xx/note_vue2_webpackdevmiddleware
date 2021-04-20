<template>
  <div :class="$style['my-card']">
    <!-- 卡片管理列表 -->
    <template v-if="!statusList.showDetail">
      <div v-if="isRevice && wallet_card.length > 0">
        <div
          :class="[$style['card-count'], 'clearfix']"
          :style="isShowTab ? {} : { top: '43px' }"
        >
          <span :class="$style['title']">
            <template v-if="!isCommon">
              {{ $text("S_HISTORY_WALLET", "历史钱包") }}
            </template>

            <template v-else>
              {{
                ["porn1", "sg1"].includes(themeTPL)
                  ? $text("S_MY_DIGITAL_CURRENCY_WALLET", "我的数字货币钱包")
                  : $text("S_MY_VIRTUAL_BANKCARD", "我的电子钱包")
              }}
            </template>
          </span>

          <span :class="$style['count']">
            {{
              $text("S_CRAD_COUNT", "共%s张").replace("%s", wallet_card.length)
            }}
          </span>
        </div>

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
        :class="[
          $style['no-data'],
          {
            [$style['history']]: !isCommon
          }
        ]"
      >
        <div :class="$style['no-bankcard']">
          <img
            :src="$getCdnPath(`/static/image/common/default/no_bankcard.png`)"
          />
        </div>
      </div>

      <!-- 添加卡片按鈕區塊 -->
      <template v-if="isCommon && isShowAddCardButton">
        <div :class="$style['add-wrap']">
          <div
            :class="$style['add-btn']"
            @click="setPageStatus(1, 'addWalletCard', false)"
          >
            <img :src="`/static/image/common/mcenter/add_2.png`" />
            <span>
              {{
                ["porn1", "sg1"].includes(themeTPL)
                  ? $text("S_ADD_DIGITAL_CURRENCY", "添加数字货币")
                  : $text("S_ADD_VIRTUAL_BANKCARD", "添加电子钱包")
              }}
            </span>
          </div>
        </div>

        <p :class="$style['remind']">
          <template v-if="['porn1', 'sg1'].includes(themeTPL)">
            {{ $t("S_DIGITAL_CURRENCY_LIMIT").replace("%s", 1) }}
          </template>

          <template v-if="['ey1'].includes(themeTPL)">
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
    <template v-if="statusList.showDetail && wallet_cardDetail">
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

      <div v-if="statusList.editDetail" :class="$style['edit-bankcard']">
        <div :class="$style['edit-mask']" />
        <div :class="$style['edit-button']">
          <template v-if="['ey1'].includes(themeTPL)">
            <div
              v-if="userLevelObj.virtual_bank_single && hasSameTypeCard"
              :class="$style['edit-option-item']"
              @click="moveCard"
            >
              停用
            </div>

            <div
              v-if="!userLevelObj.virtual_bank_single"
              :class="$style['edit-option-item']"
              @click="moveCard"
            >
              {{ isCommon ? "移至历史帐号" : "移至我的电子钱包" }}
            </div>
          </template>

          <div
            v-if="memInfo.config.delete_bank_card"
            :class="[
              $style['edit-option-item'],
              { [$style['confirm']]: ['porn1', 'sg1'].includes(themeTPL) }
            ]"
            @click="isShowPop = true"
          >
            {{
              ["porn1", "sg1"].includes(themeTPL) ? "解除绑定" : "删除电子钱包"
            }}
          </div>

          <div
            :class="[$style['edit-option-item'], $style['cancel']]"
            @click="
              $emit('update:statusList', { key: 'editDetail', value: false })
            "
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
              ["porn1", "sg1"].includes(themeTPL)
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
      default: () => {}
    },
    statusList: {
      type: Object,
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
<style
  lang="scss"
  src="@/css/page/bankCard/sg1.cardInfo.module.scss"
  module="$style_sg1"
></style>
