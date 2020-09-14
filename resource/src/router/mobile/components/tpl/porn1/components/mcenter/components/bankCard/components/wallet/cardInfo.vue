<template>
  <div>
    <!-- 卡片管理列表 -->
    <template v-if="!showDetail">
      <div v-if="isRevice && wallet_card.length > 0" :class="$style['my-card']">
        <p :class="[$style['card-count'], 'clearfix']">
          <span :class="$style['title']">
            {{ $text("S_MY_DIGITAL_CURRENCY_WALLET", "我的数字货币钱包") }}
          </span>

          <span :class="$style['count']">
            {{
              $text("S_CRAD_COUNT", "共%s张").replace("%s", wallet_card.length)
            }}
          </span>
        </p>

        <!-- 需調整版型與銀行一致 -->
        <div :class="$style['card-list']">
          <div
            v-for="item in wallet_card"
            :key="item.id"
            :class="$style['bankcard-item']"
            @click="
              () => {
                onClickDetail(item);
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
                  {{ item.payment_gateway_name }}
                </div>
              </div>
            </div>

            <div :class="$style['card-number']">
              {{ item.address.slice(0, 4) }} **** ****
              <span>{{ item.address.slice(-4) }}</span>
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
          <img src="/static/image/porn1/mcenter/bankCard/no_bankcard.png" />
        </div>
      </div>

      <!-- 添加卡片按鈕區塊 -->
      <template v-if="!isBindNowOpenAllWallets">
        <div :class="$style['add-card']">
          <div :class="$style['add-wrap']">
            <div
              :class="$style['add-btn']"
              @click="setPageStatus(1, 'addWalletCard', false)"
            >
              <img src="/static/image/porn1/mcenter/add_2.png" />
              <span>{{ $text("S_ADD_DIGITAL_CURRENCY", "添加数字货币") }}</span>
            </div>
          </div>
        </div>

        <p :class="$style['remind']">
          {{ $t("S_DIGITAL_CURRENCY_LIMIT").replace("%s", 1) }}
        </p>
      </template>
    </template>

    <!-- 卡片詳細資料 -->
    <template v-if="showDetail && wallet_cardDetail">
      <div :class="$style['card-detail']">
        <div v-if="wallet_cardDetail.auditing" :class="$style['audit-block']">
          <div>删除审核中</div>
          <span>审核通过后，系统会自动刪除錢包</span>
        </div>

        <div :class="$style['bankcard-item']">
          <div :class="[$style['card-top'], 'clearfix']">
            <div :class="$style['card-logo']">
              <img v-lazy="getBankImage(wallet_cardDetail.swift_code)" />
            </div>

            <div :class="$style['card-info']">
              <div :class="$style['card-name']">
                {{ wallet_cardDetail.payment_gateway_name }}
              </div>
            </div>
          </div>

          <div :class="$style['card-number']">
            {{ wallet_cardDetail.address.slice(4) }} **** ****
            <span>{{ wallet_cardDetail.address.slice(-4) }}</span>
          </div>
        </div>

        <div v-if="editStatus" :class="$style['edit-bankcard']">
          <div :class="$style['edit-mask']" />
          <div :class="$style['edit-button']">
            <!-- 目前購寶暫不支援刪除 -->
            <div
              v-if="
                memInfo.config.delete_bank_card &&
                  wallet_cardDetail.payment_gateway_id !== 37
              "
              :class="[$style['edit-option-item'], $style['confirm']]"
              @click="isShowPop = true"
            >
              解除綁定
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
import virtualMixin from "@/mixins/mcenter/bankCard/cardInfo/wallet";

export default {
  mixins: [virtualMixin],
  props: {
    setPageStatus: {
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
  computed: {
    isBindNowOpenAllWallets() {
      // 根據目前已綁定的 ID 與目前有開放的所有銀行 ID 做比對
      let nowBindWalletCount = 0;
      let idArr = [
        ...new Set(
          this.wallet_card.map(item => {
            return item.payment_gateway_id;
          })
        )
      ];

      if (idArr) {
        this.nowOpenWallet.forEach(item => {
          if (idArr.includes(item.id)) {
            nowBindWalletCount += 1;
          }
        });

        return nowBindWalletCount >= this.nowOpenWallet.length ? true : false;
      }

      return false;
    }
  },
  methods: {
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath(
          "/static/image/porn1/default/bank_default_2.png"
        ),
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
