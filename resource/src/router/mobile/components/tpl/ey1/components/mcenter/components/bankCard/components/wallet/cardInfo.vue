<template>
  <div>
    <!-- 卡片管理列表 -->
    <template v-if="!showDetail">
      <div
        v-if="isRevice && wallet_card.length > 0"
        :class="$style['my-card']"
      >
        <p :class="[$style['card-count'], 'clearfix']">
          <span :class="$style['title']">
            {{ $text("S_MY_VIRTUAL_BANKCARD", "我的电子钱包") }}
          </span>

          <span :class="$style['count']">
            {{
              $text("S_CRAD_COUNT", "共%s张").replace(
                "%s",
                wallet_card.length
              )
            }}
          </span>
        </p>

        <div :class="$style['card-list']">
          <div
            v-for="item in wallet_card"
            :key="item.id"
            :class="$style['virtual-bankcard-item']"
            @click="onClickDetail(item), showTab(false)"
          >
            <div :class="[$style['card-top'], 'clearfix']">
              <div :class="$style['card-logo']">
                <img v-lazy="getBankImage(item.swift_code)" />
              </div>

              <div :class="$style['card-info']">
                <div :class="$style['card-name']">
                  {{ item.payment_gateway_name }}
                </div>

                <div :class="$style['card-number']">
                  {{ item.address.slice(0,4) }} **** ****
                 <span>{{ item.address.slice(-4) }}</span>
                 </div>
              </div>
            </div>

            <div v-if="item.auditing" :class="$style['audit-tip']">
              删除审核中
            </div>
          </div>
        </div>
      </div>

      <!-- 無資料時 -->
      <div
        v-if="!isRevice || wallet_card.length === 0"
        :class="$style['no-data']"
      >
        <div :class="$style['no-bankcard']">
          <img src="/static/image/ey1/mcenter/bankCard/no_bankcard.png" />
        </div>
      </div>

      <!-- 添加卡片按鈕區塊 -->
      <template
        v-if="
          (!userLevelObj.virtual_bank_single && wallet_card.length < 15) ||
            (userLevelObj.virtual_bank_single &&
              wallet_card.length < nowOpenWallet.length)
        "
      >
        <div :class="$style['add-card']">
          <div :class="$style['add-wrap']">
            <div
              :class="$style['add-btn']"
              @click="changePage('addWalletCard'), showTab(false)"
            >
              <img src="/static/image/ey1/mcenter/add.png" />
              <span>{{ $text("S_ADD_VIRTUAL_BANKCARD", "添加电子钱包") }}</span>
            </div>
          </div>
        </div>

        <p :class="$style['remind']">
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
        </p>
      </template>
    </template>

    <!-- 卡片詳細資料 -->
    <template v-if="showDetail && wallet_cardDetail">
      <div :class="$style['card-detail']">
        <div
          v-if="wallet_cardDetail.auditing"
          :class="$style['audit-block']"
        >
          <div>删除审核中</div>
          <span>审核通过后，系统会自动删除银行卡</span>
        </div>

        <div :class="$style['virtual-bankcard-item']">
          <div :class="[$style['card-top'], 'clearfix']">
            <div :class="$style['card-logo']">
              <img v-lazy="getBankImage(wallet_cardDetail.swift_code)" />
            </div>

            <div :class="$style['card-info']">
              <div :class="$style['card-name']">
                {{ wallet_cardDetail.payment_gateway_name }}
              </div>

              <div :class="$style['card-number']">
                {{ wallet_cardDetail.address }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="editStatus" :class="$style['edit-bankcard']">
          <div :class="$style['edit-mask']" />
          <div :class="$style['edit-button']">
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

            <!-- 目前購寶暫不支援刪除 -->
            <div
              v-if="
                memInfo.config.delete_bank_card &&
                  wallet_cardDetail.payment_gateway_id !== 37
              "
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
import virtualMixin from "@/mixins/mcenter/bankCard/cardInfo/wallet";

export default {
  mixins: [virtualMixin],
  props: {
    changePage: {
      type: Function,
      default: () => {}
    },
    showTab: {
      type: Function,
      default: () => {}
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
  methods: {
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath("/static/image/ey1/default/bank_default_2.png"),
        loading: this.$getCdnPath(
          "/static/image/ey1/default/bank_default_2.png"
        )
      };
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/page/bankCard/ey1.cardInfo.module.scss";
</style>
