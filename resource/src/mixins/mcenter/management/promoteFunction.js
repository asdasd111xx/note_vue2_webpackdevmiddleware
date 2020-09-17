import { mapGetters, mapActions } from 'vuex';
import isMobile from '@/lib/is_mobile';

export default {
  data() {
    return {
      isRegister: false,
      isPopup: false,
      popupType: '',
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      agentLink: "getAgentLink"
    }),
    /**
     * 推廣連結
     * @method agentLink
     * @returns {String} 推廣連結
     */
    getAgentLink() {
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
    ...mapActions(["actionSetAgentLink"]),
    /**
     * 複製推廣代碼或連結
     * @method onCopy
     * @param {String} key - code or link
     */
    onCopy(key) {
      let value = '';
      let type = '';

      switch (key) {
        case 'CODE':
          value = this.agentLink.agentCode;
          type = key
          break;

        case 'LINK':
        //   value = this.agentLink.domain;
          value = this.getAgentLink;
          type = key
          break;
      }

      this.$copyText(value).then(() => {
        this.isPopup = true;
        this.popupType = type;

        // 三秒後自動關閉
        setTimeout(() => {
          this.onPopupClose();
        }, 3000);
      });
    },
    /**
     * 顯示 QR Code(for mobile)
     * @method onQrcodeOpen
     */
    onQrcodeOpen() {
      this.isPopup = true;
      this.popupType = 'qrcode';
    },
    /**
     * 關閉彈跳視窗
     * @method onPopupClose
     */
    onPopupClose() {
      if (isMobile()) {
        this.isPopup = false;
        this.popupType = '';
        return;
      }

      this.isPopup = false;
    }
  }
};
