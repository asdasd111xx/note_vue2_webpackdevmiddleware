<template>
  <div v-if="isRevice">
    <template v-if="!showDetail">
      <div :class="$style['my-card']">
        <p :class="[$style['card-count'], 'clearfix']">
          <span :class="$style['title']">
            {{ $text("S_HISTORY_WALLET", "历史钱包") }}
          </span>

          <span :class="$style['count']">
            {{
              $text("S_CRAD_COUNT", "共%s张").replace(
                "%s",
                virtualBank_card.length
              )
            }}
          </span>
        </p>
        <div v-if="virtualBank_card.length > 0" :class="$style['card-list']">
          <div
            v-for="item in virtualBank_card"
            :key="item.id"
            :class="[$style['virtual-bankcard-item'], $style['history']]"
            @click="getVirtualBankDetail(item), showTab(false)"
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
                  {{ item.address }}
                </div>
              </div>

              <div v-if="item.auditing" :class="$style['audit-tip']">
                删除审核中
              </div>
            </div>
          </div>
        </div>
      </div>

      <template v-if="virtualBank_card.length === 0">
        <div :class="[$style['no-data'], $style['history']]">
          <div :class="$style['no-bankcard']">
            <img src="/static/image/ey1/mcenter/bankCard/no_bankcard.png" />
          </div>
        </div>
      </template>
    </template>

    <template v-if="showDetail && virtualBank_cardDetail">
      <div :class="$style['card-detail']">
        <div
          v-if="virtualBank_cardDetail.auditing"
          :class="$style['audit-block']"
        >
          <div>删除审核中</div>
          <span>审核通过后，系统会自动删除银行卡</span>
        </div>

        <div :class="[$style['virtual-bankcard-item'], $style['history']]">
          <div :class="[$style['card-top'], 'clearfix']">
            <div :class="$style['card-logo']">
              <img v-lazy="getBankImage(virtualBank_cardDetail.swift_code)" />
            </div>
            <div :class="$style['card-info']">
              <div :class="$style['card-name']">
                {{ virtualBank_cardDetail.payment_gateway_name }}
              </div>

              <div :class="$style['card-number']">
                {{ virtualBank_cardDetail.address }}
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
import virtualMixin from "@/mixins/mcenter/historyCard/cardInfo/virtualBank";

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
    }
  },
  created() {
    this.getUserVirtualBankList();
  },
  methods: {
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath(
          "/static/image/_new/default/bank_default_2.png"
        ),
        loading: this.$getCdnPath(
          "/static/image/_new/default/bank_default_2.png"
        )
      };
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/page/cardInfo.module.scss";
</style>
