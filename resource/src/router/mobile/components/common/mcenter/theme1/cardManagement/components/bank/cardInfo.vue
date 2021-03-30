<template>
  <div :class="$style['my-card']">
    <!-- 卡片管理列表 -->
    <template v-if="!statusList.showDetail">
      <div v-if="isRevice && bank_card.length > 0">
        <div
          :class="[$style['card-count'], 'clearfix']"
          :style="isShowTab ? {} : { top: '43px' }"
        >
          <span :class="$style['title']">
            {{ $text("S_MY_CRAD", "我的卡") }}
          </span>
          <span :class="$style['count']">
            {{
              $text("S_CRAD_COUNT", "共%s张").replace("%s", bank_card.length)
            }}
          </span>
        </div>

        <div
          :class="$style['card-list']"
          :style="isShowTab ? {} : { 'margin-top': '41px' }"
        >
          <card-item
            v-for="(item, index) in bank_card"
            :key="item.id"
            :index="index"
            :data="item"
            :isDetailPage="false"
            :type="'bankCard'"
            @onClick="onClickDetail(item, index)"
            @setPageStatus="setPageStatus(0, 'bankCardInfo', false)"
          />
        </div>
      </div>

      <!-- 無資料時 -->
      <div
        v-if="!isRevice || bank_card.length === 0"
        :class="$style['no-data']"
      >
        <div :class="$style['no-bankcard']">
          <img
            :src="$getCdnPath(`/static/image/common/default/no_bankcard.png`)"
          />
        </div>
      </div>

      <!-- 添加卡片按鈕區塊 -->
      <template v-if="isRevice && isCommon && bank_card.length < 3">
        <div :class="$style['add-wrap']">
          <div
            :class="$style['add-btn']"
            @click="setPageStatus(0, 'addBankCard', false)"
          >
            <img :src="`/static/image/common/mcenter/add_2.png`" />
            <span>{{ $text("S_ADD_BANKCARD", "添加银行卡") }}</span>
          </div>
        </div>

        <p :class="$style['remind']">
          {{ $t("S_BANKCARD_LIMIT").replace("%s", 3) }}
        </p>
      </template>
    </template>

    <!-- 卡片詳細資料 -->
    <template v-if="statusList.showDetail && bank_cardDetail">
      <div v-if="bank_cardDetail.auditing" :class="$style['audit-block']">
        <div>删除审核中</div>
        <span>审核通过后，系统会自动刪除銀行卡</span>
      </div>

      <card-item
        :data="bank_cardDetail"
        :index="colorRepeatIndex"
        :isDetailPage="true"
        :type="'bankCard'"
      />

      <div v-if="statusList.editDetail" :class="$style['edit-bankcard']">
        <div :class="$style['edit-mask']" />
        <div :class="$style['edit-button']">
          <template v-if="['ey1'].includes(this.themeTPL)">
            <div :class="$style['edit-option-item']" @click="moveCard">
              {{ isCommon ? "移至历史帐号" : "移至我的卡片" }}
            </div>
          </template>

          <div
            v-if="memInfo.config.delete_bank_card"
            :class="[
              $style['edit-option-item'],
              {
                [$style['confirm']]: ['porn1', 'sg1'].includes(this.themeTPL)
              }
            ]"
            @click="isShowPop = true"
          >
            解除绑定
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

          <span>确定删除该张卡片吗？</span>
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
import bankMixin from "@/mixins/mcenter/bankCard/cardInfo/bank";
import cardItem from "../cardItem";

export default {
  components: {
    cardItem
  },
  mixins: [bankMixin],
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
    }
  },
  created() {
    this.getUserBankList();
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
