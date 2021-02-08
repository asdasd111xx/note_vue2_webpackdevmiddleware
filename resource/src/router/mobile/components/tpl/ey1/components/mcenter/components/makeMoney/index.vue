<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content">
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/ey1/mcenter/makeMoney/img_proxy01.png`"
        />
      </div>
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/ey1/mcenter/makeMoney/btn_promote.png`"
          @click="copyCode"
        />
      </div>
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/ey1/mcenter/makeMoney/img_proxy02.png`"
        />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from "../../../common/mobileContainer";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      isShowPromotion: true
    };
  },
  computed: {
    ...mapGetters({
      agentLink: "getAgentLink",
      promotionLink: "getPromotionLink",
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus"
    }),
    headerConfig() {
      let hasRecommendGift = this.isShowPromotion;
      return {
        prev: true,
        title: "一键快赚",
        customLinkTitle: hasRecommendGift ? "礼金明细" : "",
        customLinkAction: () => {
          this.$router.push("/mobile/mcenter/tcenter/recommendGift");
        },
        onClick: () => {
          this.$router.back();
        }
      };
    },
    /**
     * 推廣連結
     * @method agentLink
     * @returns {String} 推廣連結
     */
    getAgentLink() {
      if (this.promotionLink) {
        return this.promotionLink;
      }

      if (!this.agentLink.domain || !this.agentLink.agentCode) {
        return "";
      }

      return `https://${this.agentLink.domain}/a/${this.agentLink.agentCode}`;
    }
  },
  beforeCreate() {
    if (this.$route.query && this.$route.query.refresh) {
      window.location.replace("/mobile/mcenter/makeMoney");
      return;
    }
  },
  created() {
    this.actionSetAgentLink();
    if (this.loginStatus) {
      // this.isShowPromotion =
      //   localStorage.getItem("is-show-promotion") === "true";

      this.actionSetUserdata(true).then(() => {
        // 我的推廣開關 && 禮金開關需同時開啟，才顯示禮金明細
        this.isShowPromotion =
          this.memInfo.user.show_promotion && this.memInfo.config.festival;
        localStorage.setItem("is-show-promotion", this.isShowPromotion);
        // localStorage.setItem(
        //   "is-show-promotion",
        //   this.memInfo.user.show_promotion
        // );
      });
    } else {
      this.isShowPromotion = true;
      return;
    }
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionSetAgentLink",
      "actionSetUserdata"
    ]),
    copyCode() {
      this.$copyText(this.getAgentLink).then(() => {
        this.actionSetGlobalMessage({ msg: "复制成功" });
      });
    }
  }
};
</script>

<style lang="scss" module>
.container {
  position: relative;
  background-color: #f8f8f7;
  width: 100%;
  overflow-x: hidden;
}

.img-wrap {
  position: relative;
  width: 100%;

  img {
    display: block;
    width: 100%;
  }

  span {
    position: absolute;
    bottom: 4vw;
    left: 46%;
    font-weight: 700;
    color: #424654;
  }

  .copy-btn {
    padding: 3px 10px;
    position: absolute;
    bottom: calc(4vw - 3px);
    right: 5%;
    font-weight: 700;
    color: #fff;
    background: #bd9d7d;
    background-image: -webkit-linear-gradient(top, #bd9d7d, #f9ddbd);
    background-image: linear-gradient(top, #bd9d7d, #f9ddbd);
    border-radius: 20px;
  }
}
</style>
