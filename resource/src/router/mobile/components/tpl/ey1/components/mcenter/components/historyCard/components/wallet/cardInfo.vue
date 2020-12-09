<template>
  <div :class="$style['my-card']">
    <template v-if="!showDetail">
      <div v-if="isRevice && wallet_card.length > 0">
        <div
          :class="[$style['card-count'], 'clearfix']"
          :style="isShowTab ? {} : { top: '43px' }"
        >
          <span :class="$style['title']">
            {{ $text("S_HISTORY_WALLET", "历史钱包") }}
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
          <div
            v-for="item in wallet_card"
            :key="item.id"
            :class="[$style['virtual-bankcard-item'], $style['history']]"
            @click="
              () => {
                getWalletDetail(item),
                  setPageStatus(1, 'walletCardInfo', false);
              }
            "
          >
            <div :class="[$style['card-top'], 'clearfix']">
              <div :class="$style['card-logo']">
                <img v-lazy="getBankImage(item.swift_code)" />
              </div>

              <div :class="$style['card-info']">
                <div :class="$style['card-name']">
                  {{ item.virtual_bank_name }}
                </div>

                <div :class="$style['card-number']">
                  {{ item.address.slice(0, 4) }} **** ****
                  <span>{{ item.address.slice(-4) }}</span>
                </div>
              </div>

              <div v-if="item.auditing" :class="$style['audit-tip']">
                删除审核中
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 無資料時 -->
      <div
        v-if="!isRevice || wallet_card.length === 0"
        :class="[$style['no-data'], $style['history']]"
      >
        <div :class="$style['no-bankcard']">
          <img
            :src="`/static/image/${themeTPL}/mcenter/bankCard/no_bankcard.png`"
          />
        </div>
      </div>
    </template>

    <!-- 卡片詳細資料 -->
    <template v-if="showDetail && wallet_cardDetail">
      <div v-if="wallet_cardDetail.auditing" :class="$style['audit-block']">
        <div>删除审核中</div>
        <span>
          审核通过后，系统会自动刪除{{
            themeTPL === "porn1" ? "钱包" : "银行卡"
          }}
        </span>
      </div>

      <div :class="[$style['virtual-bankcard-item'], $style['history']]">
        <div :class="[$style['card-top'], 'clearfix']">
          <div :class="$style['card-logo']">
            <img v-lazy="getBankImage(wallet_cardDetail.swift_code)" />
          </div>

          <div :class="$style['card-info']">
            <div :class="$style['card-name']">
              {{ wallet_cardDetail.virtual_bank_name }}
            </div>

            <div :class="$style['card-number']">
              <div :class="$style['card-number']">
                {{ wallet_cardDetail.address.slice(0, 4) }} **** ****
                <span>{{ wallet_cardDetail.address.slice(-4) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="editStatus" :class="$style['edit-bankcard']">
        <div :class="$style['edit-mask']" />
        <div :class="$style['edit-button']">
          <div :class="$style['edit-option-item']" @click="moveCard">
            移至我的电子钱包
          </div>

          <div
            v-if="memInfo.config.delete_bank_card"
            :class="$style['edit-option-item']"
            @click="isShowPop = true"
          >
            删除电子钱包
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

          <span>确定删除该张卡片吗?</span>
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
import virtualMixin from "@/mixins/mcenter/historyCard/cardInfo/wallet";

export default {
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
    }
  },
  created() {
    this.getUserWalletList();
  },
  methods: {
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath(
          `/static/image/common/default/bank_card_default.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/common/default/bank_card_default.png`
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
