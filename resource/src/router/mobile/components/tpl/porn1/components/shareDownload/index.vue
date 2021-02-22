<template>
  <div>
    <div :class="$style['back']" @click="$router.back()">
      <img
        :src="$getCdnPath(`/static/image/common/btn_back_grey.png`)"
        alt="back"
      />
    </div>
    <div :class="$style['pic-wrap']">
      <img
        :src="
          $getCdnPath(`/static/image/porn1/mcenter/share/shareapp_save.png`)
        "
        alt="shareApp"
      />

      <div v-if="getAgentLink || landingLink" :class="$style['qrcode-wrap']">
        <qrcode
          :value="loginStatus ? getAgentLink : landingLink"
          :options="{ width: 75, margin: 1 }"
          tag="img"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import yaboRequest from "@/api/yaboRequest";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  data() {
    return {
      landingLink: ""
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      agentLink: "getAgentLink",
      promotionLink: "getPromotionLink"
    }),
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
  mounted() {
    if (this.$route.query.dw) {
      let a = document.createElement("a");
      a.download = "qrcode.gif";
      a.href =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Noto_Emoji_KitKat_263a.svg/1200px-Noto_Emoji_KitKat_263a.svg.png";

      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return;
    }
  },
  created() {
    if (this.loginStatus) {
      // 已登入：註冊頁
      this.actionSetAgentLink();
    } else {
      // 未登入：落地頁
      // yaboRequest({
      //   method: "get",
      //   url: `${this.siteConfig.YABO_API_DOMAIN}/system/downloadlink`,
      //   headers: {
      //     "x-domain": this.memInfo.user.domain
      //   }
      // }).then(res => {
      //   if (res && res.data) {
      //     this.landingLink = res.data[0].value || res.data[1].value;
      //   }
      // });

      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/System/downloadlink`
      }).then(res => {
        if (res && res.data) {
          this.landingLink = res.data[0].value || res.data[1].value;
        }
      });
    }
  },
  methods: {
    ...mapActions(["actionSetAgentLink"])
  }
};
</script>

<style lang="scss" module>
.back {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 1;
  top: 5px;
  left: 5px;

  img {
    width: 100%;
    height: 100%;
  }
}
.pic-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
  }

  .qrcode-wrap {
    position: absolute;
    bottom: 29.5%;
    left: 50%;
    transform: translateX(-50%);
    width: 25%;
  }
}
</style>
