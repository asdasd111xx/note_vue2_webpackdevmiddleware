import axios from "axios";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      isRevice: false,
      bank_card: [],
      bank_cardDetail: {},
      isShowPop: false,

      // 控制詳細頁卡片顏色
      colorRepeatIndex: null,
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
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
    ...mapActions(['actionSetGlobalMessage']),
    getUserBankList() {
      this.isRevice = false;

      return axios({
        method: "get",
        url: "/api/v1/c/player/user_bank/list",
        params: {
          common: false
        }
      }).then(response => {
        const { ret, result } = response.data;
        this.isRevice = true;
        if (!response || result !== "ok") {
          return;
        }

        this.bank_card = ret.filter((item, index) => index < 3);
      })
    },
    onClickDetail(info) {
      this.colorRepeatIndex = index

      this.bank_cardDetail = info;
      this.$emit('update:isAudit', false)
      this.$emit("update:showDetail", true);

      if (info.auditing) {
        this.$emit('update:isAudit', true);
        return;
      }
    },
    onDelete() {
      axios({
        method: "put",
        url: `/api/v1/c/player/user_bank/${this.bank_cardDetail.id}/delete/apply`,
        data: {
          userBankId: this.bank_cardDetail.id
        }
      }).then(response => {
        const { result } = response.data;
        if (!response || result !== 'ok') {
          return;
        }

        this.isShowPop = false;
        this.$emit('update:editStatus', false);

        this.getUserBankList().then(() => {
          // 更新 bank_cardDetail
          let temp = this.bank_card.find(item => {
            return item.id === this.bank_cardDetail.id;
          })
          this.bank_cardDetail = temp;
        }).then(() => {
          if (this.memInfo.config.manual_delete_bank_card) {
            this.actionSetGlobalMessage({ msg: '删除审核中' });
            switch (this.themeTPL) {
              case 'porn1':
                this.actionSetGlobalMessage({ msg: '银行卡删除审核中' });
                break;

              case 'ey1':
                this.actionSetGlobalMessage({ msg: '删除审核中' });
                break;
            }
          } else {
            switch (this.themeTPL) {
              case 'porn1':
                this.actionSetGlobalMessage({ msg: '银行卡刪除成功' });
                break;

              case 'ey1':
                this.actionSetGlobalMessage({ msg: '刪除成功' });
                break;
            }
            this.$emit("update:showDetail", false);
            this.setPageStatus(1, "walletCardInfo", true);
          }
        })
      })
    }
  },
}
