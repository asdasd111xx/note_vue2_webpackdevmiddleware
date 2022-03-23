<template>
  <div :class="$style['my-card']">
    <!-- 卡片管理列表 -->
    <template v-if="!statusList.showDetail">
      <div v-if="isRevice && bank_card.length > 0">
        <div
          :class="$style['card-list']"
          :style="isShowTab ? {} : { 'margin-top': '41px' }"
        >
          <div v-for="(item, index) in bank_card" :key="index">
            <div>
              {{ item.bank }}
              <img
                :src="$getCdnPath('/static/image/common/btn_delete.png')"
                @click="deleteOrderCard(item.id)"
              />
            </div>
            <div>{{ item.account }}</div>
          </div>
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
      <template>
        <div v-if="bank_card.length < 10" :class="$style['add-wrap']">
          <div
            :class="$style['add-btn']"
            @click="setPageStatus(0, 'addOrderCard', false)"
          >
            <img :src="`/static/image/common/mcenter/add_2.png`" />
            <span>{{ $text("S_ADD_ORDERCARD", "添加挂单银行卡") }}</span>
          </div>
        </div>

        <p :class="$style['remind']">
          {{ $t("S_BANKCARD_LIMIT").replace("%s", userLevelObj.bank_max) }}
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

          <span>{{
            ["sg1"].includes(this.routerTPL)
              ? "确定解除绑定？"
              : "确定解除绑定该张卡片吗？"
          }}</span>
        </div>

        <div :class="[$style['button-block']]">
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
import { mapGetters } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";

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
    },
    userLevelObj: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getUserOrderBankList();
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  methods: {
    getUserOrderBankList() {
      this.isRevice = false;
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Transfer/Account/List`
      }).then(res => {
        if (res && res.status === "000" && res.errorCode === "00") {
          this.isRevice = true;
          this.bank_card = res.data;
        }
      });
    },
    deleteOrderCard(id) {
      return goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Transfer/Account/${id}`,
        params: { lang: "zh-cn" }
      }).then(res => {
        if (res && res.status === "000" && res.errorCode === "00") {
          console.log(res);
          this.bank_card = this.bank_card.filter(v => v.id !== id);
        }
      });
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
  src="@/css/page/bankCard/sg1.cardInfo.module.scss"
  module="$style_sg1"
></style>
