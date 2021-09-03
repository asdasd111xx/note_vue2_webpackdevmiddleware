<template>
  <transition :name="'fade'">
    <div :class="$style['detail-alert-wrap']">
      <div :class="$style['alert-wrap']">
        <div :class="$style['alert-title']">
          <span>{{ $text("S_SUBMIT_WITHDRAW", "提交取款资料") }} </span>
          <div :class="$style['close-btn']" @click="closeFuc">
            <img
              :src="$getCdnPath(`/static/image/common/btn_close_white.png`)"
            />
          </div>
        </div>
        <div :class="$style['alert-body-wrap']">
          <div :class="$style['detail-block']">
            <div v-for="(col, index) in columns" :class="$style['detail-cell']">
              <div :class="$style['title']">
                {{ withdrawData.hasOwnProperty(col.key) && $text(col.title) }}
              </div>
              <div :class="$style['value']">
                {{ withdrawData[col.key] }}
              </div>
              <div :class="$style['item-status-border']" />
            </div>
            <!-- 提現帳號 -->
            <!-- <template v-if="withdrawData.withdraw === '迅付'">
              <div :class="$style['withdraw-info-tr']">
                <div
                  :class="[
                    $style['withdraw-info-td'],
                    $style['withdraw-info-thead']
                  ]"
                >
                  {{ $text("S_WITHDRAW_ACCOUNT02", "取款帐号") }}
                </div>
                <div
                  :class="[
                    $style['withdraw-info-td'],
                    { [$style['multiple-item']]: allWithdrawAccount.length > 1 }
                  ]"
                >
                  <span v-if="allWithdrawAccount.length <= 1">{{
                    allWithdrawAccount[0] ? allWithdrawAccount[0].alias : ""
                  }}</span>
                  <Multiselect
                    v-else
                    v-model="withdrawAccount"
                    :placeholder="$text('S_SELECTED', '请选择')"
                    :options="allWithdrawAccount"
                    :searchable="false"
                    :show-labels="false"
                    :class="$style['withdraw-select-wrap']"
                    track-by="id"
                    label="alias"
                  />
                </div>
              </div>
            </template> -->
          </div>
          <div :class="$style['btn-wrap']">
            <div :class="$style['cancel-btn']" @click="closeFuc()">
              {{ $text("S_CANCEL", "取消") }}
            </div>
            <div :class="$style['confirm-btn']" @click="saveWithdrawData">
              {{ $text("S_ENTER_SHORT", "提交") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import Multiselect from "vue-multiselect";
import ajax from "@/lib/ajax";
import { API_TRADE_RELAY, API_WITHDRAW } from "@/config/api";

export default {
  components: {
    Multiselect
  },
  props: {
    closeFuc: {
      type: Function,
      default: () => {}
    },
    withdrawData: {
      type: Object,
      default: () => {}
    },
    thirdUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      columns: [
        { key: "at", title: "S_DATE" },
        { key: "id", title: "S_ORDER_NUMBER" },
        { key: "amount", title: "S_WITHDRAW_MONEY" },
        { key: "deduction", title: "S_DEDUCTION_MONEY" },
        { key: "real_amount", title: "S_REAL_WITHDRAW" }
      ],

      withdrawUserData: [],
      withdrawAccount: {},
      withdrawPwd: "",
      isAjax: false
    };
  },
  computed: {
    ...mapGetters({
      webInfo: "getWebInfo",
      memInfo: "getMemInfo",
      curLang: "getCurLang"
    }),
    /**
     * 使用者所有取款帳戶
     *
     * @return Array
     */
    allWithdrawAccount() {
      if (!this.withdrawUserData.account && !this.withdrawUserData.wallet) {
        return [];
      }

      const resulAccount = [
        ...this.withdrawUserData.account.map(info => ({
          ...info,
          withdrawType: "account_id"
        })),
        ...this.withdrawUserData.wallet.map(info => ({
          ...info,
          withdrawType: "wallet_id"
        }))
      ];

      return resulAccount;
    }
  },
  created() {
    if (this.withdrawData.withdraw === "迅付") {
      this.actionGetWithdrawAccount().then(data => {
        if (data) {
          this.withdrawUserData = data;
          [this.withdrawAccount] = this.allWithdrawAccount;
        }
      });
    }
  },
  methods: {
    ...mapActions(["actionGetWithdrawAccount"]),
    saveWithdrawData() {
      if (this.isAjax) {
        return;
      }

      this.isAjax = true;

      // 第三方寫單
      ajax({
        method: "get",
        url: API_WITHDRAW,
        errorAlert: true,
        params: {
          amount: this.withdrawData.amount,
          withdraw_id: this.withdrawData.id,
          stage: "forward",
          logo: this.webInfo.logo
            ? `${this.webInfo.cdn_domain}${this.webInfo.logo}`
            : "",
          mlogo: this.webInfo.m_logo
            ? `${this.webInfo.cdn_domain}${this.webInfo.m_logo}`
            : "",
          title: encodeURI(this.memInfo.config.domain_name[this.curLang]),
          favicon: this.webInfo.fav_icon
            ? `${this.webInfo.cdn_domain}${this.webInfo.fav_icon}`
            : "",
          check: true
        }
      }).then(res => {
        if (res.result === "ok") {
          if (this.withdrawData.withdraw === "迅付") {
            // 迅付寫單
            ajax({
              method: "post",
              url: API_TRADE_RELAY,
              errorAlert: true,
              params: {
                api_uri: "/api/trade/v2/c/withdraw/entry",
                [`method[${this.withdrawAccount.withdrawType}]`]: this
                  .withdrawAccount.id,
                password: this.withdrawPwd,
                withdraw_id: this.withdrawData.id
              }
            }).then(response => {
              if (response && response.result === "ok") {
                window.location.reload();
                return;
              }

              this.isAjax = false;
              this.closeFuc(false, {});
            });

            return;
          }

          this.isAjax = false;
          this.closeFuc(false, {});
          this.$emit("update:thirdUrl", res.ret.uri);
        }
      });
    }
  }
};
</script>

<style lang="scss" src="../../css/edit.module.scss" module></style>
