import { mapActions, mapGetters } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
import isMobile from "@/lib/is_mobile";

export default {
  data() {
    return {
      isRegister: false,
      isPopup: false,
      popupType: "",
      friendCode: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      agentLink: "getAgentLink",
      promotionLink: "getPromotionLink",
      siteConfig: "getSiteConfig"
    }),
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
  created() {
    this.actionSetAgentLink();
    this.getBindFriendCode();
  },
  methods: {
    ...mapActions(["actionSetAgentLink", "actionSetGlobalMessage"]),
    /**
     * 複製推廣代碼或連結
     * @method onCopy
     * @param {String} key - code or link
     */
    onCopy(key) {
      let value = "";
      let type = "";

      switch (key) {
        case "CODE":
          value = this.agentLink.agentCode;
          type = key;
          this.actionSetGlobalMessage({ msg: "推广代码已复制" });
          break;

        case "LINK":
          //   value = this.agentLink.domain;
          value = this.promotionLink;
          console.log(this.promotionLink);
          type = key;
          this.actionSetGlobalMessage({ msg: "连结已复制" });
          break;

        case "FRIEND":
          value = this.friendCode;
          type = key;
          this.actionSetGlobalMessage({ msg: "绑定码已复制" });
          break;
      }

      this.$copyText(value);
    },
    /**
     * 顯示 QR Code(for mobile)
     * @method onQrcodeOpen
     */
    onQrcodeOpen() {
      this.isPopup = true;
      this.popupType = "qrcode";
    },
    /**
     * 關閉彈跳視窗
     * @method onPopupClose
     */
    onPopupClose() {
      if (isMobile()) {
        this.isPopup = false;
        this.popupType = "";
        return;
      }

      this.isPopup = false;
    },
    /**
     * 取得綁定好友綁定碼 C02.349
     * @method getBindFriendCode
     */
    getBindFriendCode() {
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Bind/Code`,
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res && res.status === "000") {
          //friendCode="" 代表已綁過不可以轉移
          this.friendCode = res.data || "";
        }
        return;
      });
    }
  }
};
