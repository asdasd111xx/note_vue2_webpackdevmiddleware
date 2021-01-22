import { mapActions, mapGetters } from "vuex";

import isMobile from "@/lib/is_mobile";

export default {
  data() {
    return {
      isRegister: false,
      isPopup: false,
      popupType: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      agentLink: "getAgentLink",
      promotionLink: "getPromotionLink"
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
          type = key;
          this.actionSetGlobalMessage({ msg: "连结已复制" });
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
    }
  }
};
