<template>
  <div v-if="isRevice">
    <template v-if="!showDetail">
      <div v-if="bank_card.length > 0" :class="$style['my-card']">
        <div :class="[$style['card-count'], 'clearfix']">
          <span :class="$style['title']">{{
            $text("S_MY_CRAD", "我的卡")
          }}</span>
          <span :class="$style['count']">{{
            $text("S_CRAD_COUNT", "共%s张").replace("%s", bank_card.length)
          }}</span>
        </div>
        <div :class="$style['card-list']">
          <div
            v-for="item in bank_card"
            :key="item.id"
            :class="$style['bankcard-item']"
            @click="onClickDetail(item), showTab(false)"
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

            <div v-if="item.auditing" :class="$style['audit-tip']">
              删除审核中
            </div>
          </div>
        </div>
      </div>

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
    </template>

    <template v-else>
      <div :class="$style['card-detail']">
        <div v-if="bank_cardDetail.auditing" :class="$style['audit-block']">
          <div>删除审核中</div>
          <span>审核通过后，系统会自动刪除錢包</span>
        </div>

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
              @click="isShowPop = true"
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
      </div>
    </template>

    <div v-if="isShowPop" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" />
      <div :class="$style['pop-block']">
        <div :class="$style['content']">
          <div :class="$style['title']">
            {{ $text("S_TIPS", "温馨提示") }}
          </div>

          <span>确定解除绑定该钱包？</span>
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
import ajax from "@/lib/ajax";
import bankMixin from "@/mixins/mcenter/historyCard/cardInfo/bank";

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
        error: this.$getCdnPath(
          "/static/image/common/default/bank_card_default.png"
        ),
        loading: this.$getCdnPath(
          "/static/image/common/default/bank_card_default.png"
        )
      };
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/page/bankCard/ey1.cardInfo.module.scss";
</style>
