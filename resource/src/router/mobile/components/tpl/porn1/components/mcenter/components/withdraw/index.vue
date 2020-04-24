<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <message v-if="msg" @close="msg = ''"
        ><div slot="msg">{{ msg }}</div>
      </message>

      <balance-tran class="clearfix">
        <template
          scope="{ balanceTran, enableAutotransfer, closeAutotransfer, setTranOut, setTranIn, setMoney, balanceTransfer, balanceBack, getDefaultTran }"
        >
          <div
            :class="[$style['balance-wrap'], 'clearfix']"
            @click="balanceBack"
          >
            <div :class="$style['balance-total-item']">
              <img
                :src="
                  $getCdnPath(
                    '/static/image/_new/mcenter/balanceTrans/ic_wallet_center.png'
                  )
                "
              />
              <span> {{ $text("S_MCENTER_WALLET", "中心钱包") }} </span>
              <div :class="$style['balance-item-money']">
                {{ balanceTran.membalance.vendor.default.amount }}
              </div>
            </div>

            <div
              :class="[
                $style['recycle-btn'],
                balanceTran.balanceBackLock ? $style.disable : ''
              ]"
            >
              {{ $text("S_ONE_CLICK_TO_ACCOUNT") }}
            </div>
          </div>
          <!-- 個別餘額 -->
          <div :class="[$style['balance-item-wrap'], 'clearfix']">
            <template v-if="!isShowMore">
              <div
                v-for="(item, key, index) in balanceTran.firstThirdBalanceInfo"
                :key="`balance-item-${key}`"
                :class="[
                  $style['balance-item'],
                  {
                    [$style['is-last-item']]:
                      Object.keys(balanceTran.firstThirdBalanceInfo).length -
                        index <=
                      (Object.keys(balanceTran.firstThirdBalanceInfo).length %
                        4 || 4)
                  }
                ]"
              >
                <span :class="$style['balance-item-vendor']">{{
                  item.text
                }}</span>
                <span
                  v-if="item.maintain"
                  :class="$style['balance-info-maintain']"
                  @click="onClickMaintain(item.maintain)"
                >
                  <img
                    :src="
                      $getCdnPath(
                        '/static/image/mobile/tpl/porn1/mcenter/icon_relax.png'
                      )
                    "
                    :class="$style['balance-wrench']"
                  />
                  {{ $t("S_MAINTAIN") }}
                </span>
                <span v-else :class="$style['balance-item-money']">{{
                  item.amount
                }}</span>
              </div>

              <div :class="[$style['balance-item'], $style['collapse']]">
                <span
                  :class="$style['balance-item-vendor']"
                  @click="toggleShowMore"
                  >更多</span
                >
                <div :class="[$style['icon']]">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/_new/mcenter/balanceTrans/ic_expand.png`
                      )
                    "
                    alt="expend"
                  />
                </div>
              </div>
            </template>

            <template v-else>
              <div
                v-for="(item, key, index) in balanceTran.balanceInfo"
                :key="`balance-item-${key}`"
                :class="[
                  $style['balance-item'],
                  {
                    [$style['is-last-item']]:
                      Object.keys(balanceTran.balanceInfo).length - index <=
                      (Object.keys(balanceTran.balanceInfo).length % 4 || 4)
                  }
                ]"
              >
                <span :class="$style['balance-item-vendor']">{{
                  item.text
                }}</span>
                <span
                  v-if="item.maintain"
                  :class="$style['balance-info-maintain']"
                  @click="onClickMaintain(item.maintain)"
                >
                  {{ $t("S_MAINTAIN") }}
                  <img
                    :src="
                      $getCdnPath(
                        '/static/image/_new/mcenter/balanceTrans/icon_transfer_tips_info.png'
                      )
                    "
                    :class="$style['balance-wrench']"
                  />
                </span>
                <span v-else :class="$style['balance-item-money']">{{
                  item.amount
                }}</span>
              </div>

              <div :class="[$style['balance-item'], $style['collapse']]">
                <span
                  :class="$style['balance-item-vendor']"
                  @click="toggleShowMore"
                  >收起</span
                >
                <div :class="[$style['icon']]">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/_new/mcenter/balanceTrans/ic_collapse.png`
                      )
                    "
                    alt="collapse"
                  />
                </div>
              </div>
            </template>
          </div>
        </template>
      </balance-tran>

      <!-- 銀行卡 -->
      <div
        v-if="
          this.withdrawUserData.account &&
            this.withdrawUserData.account.length !== 0
        "
        :class="$style['bank-card-wrap']"
      >
        <div
          v-for="item in withdrawUserData.account"
          :class="$style['bank-card-cell']"
        >
          {{ $text("S_BANKCARD", "银行卡") }}
        </div>

        <div
          v-for="item in withdrawUserData.account"
          :class="$style['bank-card-cell']"
          @click="handleSelectCard(item)"
        >
          <!-- 缺銀行圖片暫時放 -->
          <!-- alias: "交通银行-*****566"
            id: 3836
            offer_limit: "0"
            offer_percent: "0.00" -->
          <img
            :src="$getCdnPath(`/static/image/_new/withdraw/16.png`)"
            alt="collapse"
          />
          <span>{{ item.alias }} </span>
          <div
            :class="[
              $style['check-box'],
              { [$style['checked']]: item.id === selectedCard }
            ]"
          />
        </div>
      </div>

      <div :class="[$style['add-bank-card']]">
        <img
          :src="$getCdnPath(`/static/image/_new/common/ic_withardw_add.png`)"
          alt="collapse"
        />
        &nbsp;
        <span @click="$router.push('/mobile/mcenter/bankcard?withdraw=true')">
          {{ $text("S_ADD_BANKCARD", "添加银行卡") }}
        </span>
      </div>

      <div :class="$style['tips']">
        {{
          $text("S_WITHRAW_DESC", {
            replace: [
              { target: "%S", value: `5` },
              { target: "%S", value: `200.000` },
              { target: "%S", value: `499.999` }
            ]
          })
        }}
      </div>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from '../../../common/new/mobileContainer';
import mixin from '@/mixins/mcenter/withdraw';
import { mapGetters, mapActions } from 'vuex';
import balanceTran from "@/components/mcenter/components/balanceTran";
import message from '../../../common/new/message'

export default {
  mixins: [mixin],
  data() {
    return {
      curTitleTab: 'withdrawMethod',
      isSerial: false,
      isCheckWithdraw: false,
      isOpenOrder: false,
      selectAccountValue: '',

      isShowMore: false,
      msg: '',
      selectedCard: ''
    }
  },
  components: {
    mobileContainer,
    balanceTran,
    message
  },
  computed: {
    ...mapGetters({
      memCurrency: 'getMemCurrency',
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo'
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_WITHDRAWAL_TEXT', '提现'),
        hasHelp: true,
        helpRouter: 'withdraw'
      };
    },
  },
  methods: {
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
    },
    handleSelectCard(item) {
      if (this.selectedCard === item.id) {
        this.selectedCard = "";
      } else {
        this.selectedCard = item.id;
      }
    }
  },
}

</script>
<style lang="scss" src="./index.module.scss" module></style>

