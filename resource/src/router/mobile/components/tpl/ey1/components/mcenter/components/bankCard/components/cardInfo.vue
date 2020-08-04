<template>
  <div v-if="isRevice">
    <template v-if="currentKind === 'bank'">
      <template v-if="!showDetail">
        <div v-if="bank_card.length > 0" :class="$style['my-card']">
          <p :class="[$style['card-count'], 'clearfix']">
            <span :class="$style['title']">{{
              $text("S_MY_CRAD", "我的卡")
            }}</span>
            <span :class="$style['count']">{{
              $text("S_CRAD_COUNT", "共%s张").replace("%s", bank_card.length)
            }}</span>
          </p>
          <div :class="$style['card-list']">
            <div
              v-for="item in bank_card"
              :key="item.id"
              :class="$style['bankcard-item']"
              @click="getBankDetail(item)"
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

        <div :class="{ [$style['no-data']]: bank_card.length === 0 }">
          <div v-if="bank_card.length === 0" :class="$style['no-bankcard']">
            <img src="/static/image/_new/mcenter/no_bankcard.png" />
          </div>

          <template v-if="bank_card.length < 3">
            <div :class="$style['add-card']">
              <div :class="$style['add-wrap']">
                <div :class="$style['add-btn']" @click="changePage('addCard')">
                  <img src="/static/image/_new/mcenter/add.png" />
                  <span>{{ $text("S_ADD_BANKCARD", "添加银行卡") }}</span>
                </div>
              </div>
            </div>

            <p :class="$style['remind']">
              {{ $t("S_BANKCARD_LIMIT").replace("%s", 3) }}
            </p>
          </template>
        </div>
      </template>

      <div v-else :class="$style['card-detail']">
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
    </template>

    <template v-if="currentKind === 'virtualBank'">
      <template v-if="!showDetail">
        <div v-if="virtualBank_card.length > 0" :class="$style['my-card']">
          <p :class="[$style['card-count'], 'clearfix']">
            <span :class="$style['title']">{{
              $text("S_MY_VIRTUAL_BANK_CARD", "我的电子钱包")
            }}</span>

            <span :class="$style['count']">{{
              $text("S_CRAD_COUNT", "共%s张").replace("%s", virtualbank_card.length)
            }}</span>
          </p>

          <div :class="$style['card-list']">
            <div
              v-for="item in virtualbank_card"
              :key="item.id"
              :class="$style['virtual-bankcard-item']"
              @click="getBankDetail(item)"
            >
              <div :class="[$style['card-top'], 'clearfix']">
                <div :class="$style['card-logo']">
                  <img v-lazy="getBankImage(item.swift_code)" />
                </div>

                <div :class="$style['card-info']">
                  <div :class="$style['card-name']">
                    {{ item.bank_name }}
                  </div>

                  <div :class="$style['card-number']">
                    12312313123123
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
            <img src="/static/image/_new/mcenter/no_bankcard.png" />
          </div>

          <template v-if="virtualBank_card.length < 15">
            <div :class="$style['add-card']">
              <div :class="$style['add-wrap']">
                <div :class="$style['add-btn']" @click="changePage('addCard')">
                  <img src="/static/image/_new/mcenter/add.png" />
                  <span>{{
                    $text("S_ADD_VIRTUAL_BANK_CARD", "添加电子钱包")
                  }}</span>
                </div>
              </div>
            </div>

            <p :class="$style['remind']">
              {{ $t("S_VIRTUAL_BANK_CARD_LIMIT").replace("%s", 15) }}
            </p>
          </template>
        </div>
      </template>

      <div v-else :class="$style['card-detail']">
        <div :class="$style['virtual-bankcard-item']">
          <div :class="[$style['card-top'], 'clearfix']">
            <div :class="$style['card-logo']">
              <img v-lazy="getBankImage(bank_cardDetail.swift_code)" />
            </div>
            <div :class="$style['card-info']">
              <div :class="$style['card-name']">
                {{ bank_cardDetail.bank_name }}
              </div>

              <div :class="$style['card-number']">
                12312313123123
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
    </template>
  </div>
</template>

<script>
import ajax from "@/lib/ajax";
import bankMixin from "@/mixins/mcenter/bankCard/cardInfo/bank";
import virtualMixin from "@/mixins/mcenter/bankCard/cardInfo/virtualBank";

export default {
  mixins: [bankMixin, virtualMixin],
  props: {
    currentKind: {
      type: String,
      required: true
    },
    changePage: {
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
    return {
      isRevice: false
    };
  },
  created() {
    this.getUserBankList();
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

<style lang="scss" src="./css/cardInfo.module.scss" module />
