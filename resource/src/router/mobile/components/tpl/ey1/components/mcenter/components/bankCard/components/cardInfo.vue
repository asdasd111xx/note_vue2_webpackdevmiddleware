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
          <div :class="$style['bankcard-list']">
            <div
              v-for="item in bank_card"
              :key="item.id"
              :class="$style['bankcard-item']"
              @click="getBankDetail(item)"
            >
              <div :class="[$style['bankcard-top'], 'clearfix']">
                <div :class="$style['bankcard-logo']">
                  <img v-lazy="getBankImage(item.swift_code)" />
                </div>
                <div :class="$style['bankcard-info']">
                  <div :class="$style['bankcard-name']">
                    {{ item.bank_name }}
                  </div>
                  <div :class="$style['bankcard-tpye']">
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

      <div v-else :class="$style['bankcard-detail']">
        <div :class="$style['bankcard-item']">
          <div :class="[$style['bankcard-top'], 'clearfix']">
            <div :class="$style['bankcard-logo']">
              <img v-lazy="getBankImage(bankCardDetail.swift_code)" />
            </div>
            <div :class="$style['bankcard-info']">
              <div :class="$style['bankcard-name']">
                {{ bankCardDetail.bank_name }}
              </div>
              <div :class="$style['bankcard-tpye']">
                {{ bankCardDetail.type }}
              </div>
            </div>
          </div>
          <div :class="$style['card-number']">
            **** **** **** <span>{{ bankCardDetail.account.slice(-4) }}</span>
          </div>
        </div>

        <div v-if="editStatus" :class="$style['edit-bankcard']">
          <div :class="$style['edit-mask']" />
          <div :class="$style['edit-button']">
            <div :class="$style['edit-confirm']" @click="removeBankCard">
              解除绑定
            </div>
            <div
              :class="$style['edit-cancel']"
              @click="$emit('update:editStatus', false)"
            >
              取消
            </div>
          </div>
        </div>
        <div v-if="popStatus" :class="$style['pop-message']">
          正在上线 敬请期待
        </div>
      </div>
    </template>

    <template v-if="currentKind === 'virtualBank'">
      virtualBank-cardInfo
    </template>
  </div>
</template>

<script>
import ajax from "@/lib/ajax";
import bankMixin from "@/mixins/mcenter/bankCard/cardInfo/bank";

export default {
  mixins: [bankMixin],
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
      popStatus: false,
      isRevice: false
    };
  },
  created() {
    switch (this.currentKind) {
      case "bank":
        this.checkHasBank();
        this.getUserBankList().then(response => {
          const { ret, result } = response.data;
          this.isRevice = true;
          if (!response || result !== "ok") {
            return;
          }

          this.bank_card = ret.filter((item, index) => index < 3);
        });
        break;

      case "virtualBank":
        break;
    }
  },
  methods: {
    // getDetail(info) {
    //   this.bankCardDetail = info;
    //   this.$emit("update:showDetail", true);
    // },
    // removeBankCard() {
    //   this.popStatus = true;
    //   setTimeout(() => {
    //     this.popStatus = false;
    //   }, 3000);
    //   this.$emit("update:editStatus", false);
    // },
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

<style lang="scss" src="./css/bankCardInfo.module.scss" module />
