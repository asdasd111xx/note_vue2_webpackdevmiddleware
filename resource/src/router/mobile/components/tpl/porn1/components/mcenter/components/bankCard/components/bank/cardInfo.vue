<template>
  <div>
    <!-- 卡片管理列表 -->
    <template v-if="!showDetail">
      <div v-if="isRevice && bank_card.length > 0" :class="$style['my-card']">
        <p :class="[$style['card-count'], 'clearfix']">
          <span :class="$style['title']">
            {{ $text("S_MY_CRAD", "我的卡") }}
          </span>
          <span :class="$style['count']">
            {{
              $text("S_CRAD_COUNT", "共%s张").replace("%s", bank_card.length)
            }}
          </span>
        </p>

        <div :class="$style['card-list']">
          <div
            v-for="item in bank_card"
            :key="item.id"
            :class="$style['bankcard-item']"
            @click="getBankDetail(item), showTab(false)"
          >
            <div :class="[$style['card-top'], 'clearfix']">
              <div :class="$style['card-logo']">
                <img v-lazy="getBankImage(item.swift_code)" />
              </div>

              <div :class="$style['card-info']">
                <div :class="$style['card-name']">
                  {{ item.bank_name }}
                </div>

                <div :class="$style['card-type']">
                  {{ item.type }}
                </div>
              </div>
            </div>

            <div :class="$style['card-number']">
              **** **** **** <span>{{ item.account.slice(-4) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 無資料時 -->
      <div
        v-if="!isRevice || bank_card.length === 0"
        :class="$style['no-data']"
      >
        <div :class="$style['no-bankcard']">
          <img src="/static/image/porn1/mcenter/bankCard/no_bankcard.png" />
        </div>
      </div>

      <!-- 添加卡片按鈕區塊 -->
      <template v-if="bank_card.length < 3">
        <div :class="$style['add-card']">
          <div :class="$style['add-wrap']">
            <div
              :class="$style['add-btn']"
              @click="changePage('addBankCard'), showTab(false)"
            >
              <img src="/static/image/porn1/mcenter/add_2.png" />
              <span>{{ $text("S_ADD_BANKCARD", "添加银行卡") }}</span>
            </div>
          </div>
        </div>

        <p :class="$style['remind']">
          {{ $t("S_BANKCARD_LIMIT").replace("%s", 3) }}
        </p>
      </template>
    </template>

    <!-- 卡片詳細資料 -->
    <div v-if="showDetail && bank_cardDetail" :class="$style['card-detail']">
      <div :class="$style['bankcard-item']">
        <div :class="[$style['card-top'], 'clearfix']">
          <div :class="$style['card-logo']">
            <img v-lazy="getBankImage(bank_cardDetail.swift_code)" />
          </div>

          <div :class="$style['card-info']">
            <div :class="$style['card-name']">
              {{ bank_cardDetail.bank_name }}
            </div>

            <div :class="$style['card-type']">
              {{ bank_cardDetail.type }}
            </div>
          </div>
        </div>

        <div :class="$style['card-number']">
          **** **** **** <span>{{ bank_cardDetail.account.slice(-4) }}</span>
        </div>
      </div>

      <div v-if="editStatus" :class="$style['edit-bankcard']">
        <div :class="$style['edit-mask']" />
        <div :class="$style['edit-button']">
          <div
            :class="[$style['edit-option-item'], $style['confirm']]"
            @click="removeBankCard"
          >
            解除绑定
          </div>

          <div
            :class="[$style['edit-option-item'], $style['cancel']]"
            @click="$emit('update:editStatus', false)"
          >
            取消
          </div>
        </div>
      </div>
      <!-- <div v-if="popStatus" :class="$style['pop-message']">
          正在上线 敬请期待
        </div> -->
    </div>
  </div>
</template>

<script>
import ajax from "@/lib/ajax";
import bankMixin from "@/mixins/mcenter/bankCard/cardInfo/bank";

export default {
  mixins: [bankMixin],
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
    }
  },
  created() {
    this.getUserBankList();
  },
  methods: {
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath("/static/image/porn1/default/bank_default_2.png"),
        loading: this.$getCdnPath(
          "/static/image/porn1/default/bank_default_2.png"
        )
      };
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/page/bankCard/porn1.cardInfo.module.scss";
</style>
