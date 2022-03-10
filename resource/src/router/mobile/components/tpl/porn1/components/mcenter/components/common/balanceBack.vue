<template>
  <balance-tran class="clearfix">
    <template scope="{ balanceTran , balanceBack}">
      <div>
        <div
          :class="[$style['balance-wrap'], 'clearfix']"
          :style="{ marginTop: hasTopSpace ? '3%' : null }"
        >
          <div :class="$style['balance-total-item']">
            <img
              :src="
                $getCdnPath(
                  '/static/image/common/mcenter/balanceTrans/ic_wallet_center.png'
                )
              "
            />
            <span> {{ $text("S_MCENTER_WALLET", "中心钱包") }} </span>
            <div :class="[$style['balance-item-money']]">
              {{ balanceTran.membalance.vendor.default.amount }}
            </div>
          </div>

          <div
            v-if="hasLink"
            @click="handleCreditTrans"
            :class="[
              $style['balance-total-item'],
              $style['credit-trans-link'],
              $style[siteConfig.ROUTER_TPL]
            ]"
          >
            <span> {{ $text("S_CREDIT_TRANSFER", "额度转让") }} </span>
          </div>

          <div
            id="one-recycle-btn"
            :class="[
              $style['recycle-btn'],
              balanceTran.balanceBackLock ? $style.disable : ''
            ]"
            @click="balanceBack()"
          >
            {{ $text("S_ONE_CLICK_TO_ACCOUNT") }}
          </div>
        </div>
      </div>
    </template>
  </balance-tran>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceTran from "@/components/mcenter/components/balanceTran";
import goLangApiRequest from "@/api/goLangApiRequest";
import { getCookie } from "@/lib/cookie";

export default {
  data() {
    return {
      birdBalance: "--"
    };
  },
  props: {
    hasTopSpace: {
      type: Boolean,
      default: true
    },
    hasLink: {
      type: Boolean,
      default: false
    },
    backRouter: {
      type: String,
      default: "/mcenter/wallet"
    }
  },
  components: {
    balanceTran
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionGetRechargeStatus",
      "actionGetMemInfoV3"
    ]),
    handleCreditTrans() {
      this.actionGetMemInfoV3().then(() => {
        this.actionGetRechargeStatus("");
      });
    },
    goBirdUrl() {
      let cid = getCookie("cid");
      let newWindow = "";
      newWindow = window.open();
      this.isLoading = true;
      let target = "forum_benefits";
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url?lang=zh-cn&urlName=${target}&needToken=true&externalCode=fengniao`,
        headers: {
          cid: cid
        }
      })
        .then(res => {
          setTimeout(() => {
            this.isLoading = false;
          }, 1500);
          const url = res.data.uri + "&cors=embed";
          newWindow.location = url;
        })
        .catch(error => {
          setTimeout(() => {
            this.isLoading = false;
          }, 1500);
          newWindow.close();

          if (error && error.data && error.data.msg) {
            this.actionSetGlobalMessage({ msg: error.data.msg });
          }
        });
      return;
    },
    birdMoney() {
      let cid = getCookie("cid");
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Member/Info`,
        headers: {
          cid: cid
        },
        params: {
          lang: "zh-cn",
          account: this.memInfo.user.username
        }
      }).then(res => {
        this.birdBalance = res.data ? res.data.credits2 : "--";
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.index.scss" module="$style_sg1"></style>
