<template>
  <div v-if="isRevice">
    <template v-if="!showDetail">
      <div v-if="virtualBank_card.length > 0" :class="$style['my-card']">
        <p :class="[$style['card-count'], 'clearfix']">
          <span :class="$style['title']">
            {{ $text("S_MY_VIRTUAL_BANKCARD", "我的电子钱包") }}
          </span>

          <span :class="$style['count']">{{
            $text("S_CRAD_COUNT", "共%s张").replace(
              "%s",
              virtualBank_card.length
            )
          }}</span>
        </p>

        <div :class="$style['card-list']">
          <div
            v-for="item in virtualBank_card"
            :key="item.id"
            :class="$style['virtual-bankcard-item']"
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
            </div>
          </div>
        </div>
      </div>

      <div :class="{ [$style['no-data']]: virtualBank_card.length === 0 }">
        <div
          v-if="virtualBank_card.length === 0"
          :class="$style['no-bankcard']"
        >
          <img src="/static/image/ey1/mcenter/bankCard/no_bankcard.png" />
        </div>

        <template v-if="virtualBank_card.length < 15">
          <div :class="$style['add-card']">
            <div :class="$style['add-wrap']">
              <div
                :class="$style['add-btn']"
                @click="changePage('addVirtualBankCard'), showTab(false)"
              >
                <img src="/static/image/ey1/mcenter/add.png" />
                <span>{{
                  $text("S_ADD_VIRTUAL_BANKCARD", "添加电子钱包")
                }}</span>
              </div>
            </div>
          </div>

          <p :class="$style['remind']">
            <span
              >{{ $t("S_VIRTUAL_BANKCARD_LIMIT").replace("%s", 15) }} ({{
                virtualBank_card.length
              }}/15)
            </span>
          </p>
        </template>
      </div>
    </template>

    <div v-else :class="$style['card-detail']">
      <div :class="$style['virtual-bankcard-item']">
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
          <div :class="$style['edit-option-item']">
            移至历史帐号
          </div>

          <div :class="$style['edit-option-item']">
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
  </div>
</template>

<script>
import virtualMixin from "@/mixins/mcenter/bankCard/cardInfo/virtualBank";

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
    }
  },
  data() {
    return {};
  },
  created() {
    console.log("virtualBankCardInfo");
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

<style lang="scss" src="../css/cardInfo.module.scss" module />
