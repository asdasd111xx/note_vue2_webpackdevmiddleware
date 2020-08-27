<template>
  <div :class="$style['add-bankcard']">
    <div :class="$style['card-info']">
      <p :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]">
        {{ errorMsg }}
      </p>

      <!-- Select Wallet Type -->
      <div :class="$style['info-item']">
        <p :class="$style['input-title']">
          {{ $text("S_WALLET_TYPE", "钱包类型") }}
        </p>

        <div
          :class="[
            $style['select-bank'],
            { [$style['disable']]: selectTarget.fixed }
          ]"
          @click="isShowPop = true"
        >
          <span
            :class="{ [$style['select-active']]: selectTarget.virtualBank }"
          >
            {{
              selectTarget.virtualBank
                ? selectTarget.virtualBank
                : $text("S_SELECT_WALLET_TYPE", "请选择钱包类型")
            }}
          </span>

          <img
            v-if="!selectTarget.fixed"
            :class="$style['arrow-icon']"
            src="/static/image/ey1/common/arrow_next.png"
          />
        </div>
      </div>

      <!-- Input -->
      <div v-if="selectTarget.virtualBank" :class="$style['info-item']">
        <p :class="$style['input-title']">
          {{ formData["walletAddress"].title }}
        </p>

        <div
          :class="[
            $style['input-wrap'],
            { [$style['disable']]: isGoBaoWallet }
          ]"
        >
          <input
            v-model="formData['walletAddress'].value"
            type="text"
            :placeholder="formData['walletAddress'].placeholder"
            @input="verification('walletAddress')"
            @blur="verification('walletAddress')"
          />
        </div>

        <div
          v-if="selectTarget.bank_id === 21 || isGoBaoWallet"
          :class="$style['qrcode']"
          @click="isShowPopQrcode = true"
        >
          <img
            :src="
              $getCdnPath('/static/image/ey1/mcenter/bankCard/ic_qrcode.png')
            "
            alt="qrcode"
          />
        </div>
      </div>

      <!-- CGPay 支付密碼欄位 -->
      <div v-if="selectTarget.bank_id === 21" :class="$style['info-item']">
        <p :class="$style['input-title']">
          {{ formData["CGPPwd"].title }}
        </p>
        <div :class="$style['input-wrap']">
          <input
            v-model="formData['CGPPwd'].value"
            type="tel"
            :placeholder="formData['CGPPwd'].placeholder"
            @input="verification('CGPPwd')"
            @blur="verification('CGPPwd')"
          />
        </div>
      </div>

      <!-- Confirm Button -->
      <div v-if="!isGoBaoWallet" :class="$style['info-confirm']">
        <!-- 針對 CGpay -->
        <div
          v-if="selectTarget.bank_id === 21"
          :class="[$style['submit'], { [$style['disabled']]: lockStatus }]"
          @click="submitByToken"
        >
          {{ $text("S_CONFIRM", "确认") }}
        </div>

        <!-- 新增一般錢包 -->
        <div
          v-else
          :class="[$style['submit'], { [$style['disabled']]: lockStatus }]"
          @click="submitByNormal"
        >
          {{ $text("S_CONFIRM", "确认") }}
        </div>
      </div>
    </div>

    <div v-if="isShowPop" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" @click="isShowPop = false" />
      <div :class="[$style['pop-menu'], $style['custom1']]">
        <div :class="$style['pop-title']">
          <span @click="isShowPop = false">
            {{ $text("S_CANCEL", "取消") }}
          </span>
          请选择钱包类型
        </div>

        <ul :class="$style['pop-list']">
          <li
            v-for="item in virtualBankList"
            :key="item.id"
            @click="setBank(item)"
          >
            <img v-lazy="getBankImage(item.swift_code)" />
            {{ item.name }}
            <icon
              v-if="item.id === selectTarget.bank_id"
              :class="$style['select-icon']"
              name="check"
            />
          </li>
        </ul>
      </div>
    </div>

    <popup-qrcode
      v-if="isShowPopQrcode"
      :isShowPop.sync="isShowPopQrcode"
      :paymentGatewayId="selectTarget.bank_id"
    />
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import i18n from "@/config/i18n";
// import virtualBankMixin from "@/mixins/mcenter/bankCard/addCard/virtualBank";
import popupQrcode from "@/router/mobile/components/common/virtualBank/popupQrcode";

export default {
  components: {
    popupQrcode
  },
  props: {
    changePage: {
      type: Function,
      default: () => {}
    },
    showTab: {
      type: Function,
      default: () => {}
    },
    userLevelObj: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // 卡片有關參數
      selectTarget: {
        bank_id: "",
        virtualBank: "",
        fixed: false
      },
      virtualBankList: [],
      userBindVirtualBankList: [],
      bindWallets: {
        cgPay: false,
        goBao: false,
        ids: [] // If true then push
      },
      isShowPop: false,
      isShowPopQrcode: false,
      isGoBaoWallet: false,
      // 欄位資料
      formData: {
        walletAddress: {
          title: i18n.t("S_WALLET_ADDRESS"),
          value: "",
          placeholder: ""
        },
        CGPPwd: {
          title: "CGP安全防护码",
          value: "",
          placeholder: "请输入CGP安全防护码"
        }
      },
      lockStatus: true,
      errorMsg: "",
      msg: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      noticeData: "getNoticeData",
      siteConfig: "getSiteConfig",
      isBindGoBao: "getHasBindGoBao",
      isBindCGPay: "getHasBindCGPay"
    }),
    showPopQrcode: {
      get() {
        return this.isShowPopQrcode;
      },
      set(value) {
        this.isShowPopQrcode = value;
      }
    }
  },
  watch: {
    "selectTarget.bank_id"(value) {
      // 不確定點擊相同錢包時，是否要清除資料?假如有，將以下 code 搬至 setBank
      this.formData["CGPPwd"].value = "";
      this.formData["walletAddress"].value = "";
      this.isGoBaoWallet = false;

      let text = "";

      switch (value) {
        case 21:
          text = "请输入CGP邮箱/手机号或扫扫二维码";
          break;
        case 33:
          text = "请输入比特币取款地址";
          break;
        case 34:
          text = "请输入Ecopayz取款帐号";
          break;
        case 35:
          text = "请输入iWallet取款帐号";
          break;
        case 36:
          text = "请输入STICPAY注册信箱";
          break;
        case 37:
          text = "请点击二維碼綁定";
          this.isGoBaoWallet = true;
          break;
        case 38:
          text = "请输入VenusPoint取款帐号";
          break;

        default:
          text = "请输入钱包地址";
          break;
      }

      this.formData["walletAddress"].placeholder = text;
    },
    noticeData(value) {
      if (this.noticeData && this.noticeData.length > 0) {
        let data = this.noticeData[0];

        if (data.event === "trade_bind_wallet" && data.result === "ok") {
          // Todo 將所有 msg 替換成 actionSetGlobalMessage
          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: () => {
              this.showTab(true);
              this.changePage("virtualBankCardInfo");
            }
          });
        }
      }
    },
    virtualBankList() {
      // 從提現頁進來，且只選擇 CGPay
      if (this.$route.query.wallet && this.$route.query.wallet === "CGPay") {
        let item = this.virtualBankList.find(item => {
          return item.id === 21;
        });
        this.setBank(item);
        this.selectTarget.fixed = true;
      }
    }
  },
  created() {
    Promise.all([
      this.checkBindCGpay(),
      this.checkBindGoBao(),
      this.getUserBindList()
    ]).then(() => {
      this.getVirtualBankList();
    });
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionBindGoBao",
      "actionSetCGPayInfo"
    ]),
    verification(key, index) {
      let target = this.formData[key];
      let lock = false;

      if (key === "walletAddress") {
        target.value = target.value.replace(" ", "").trim();
      }

      if (key === "CGPPwd") {
        target.value = target.value
          .replace(" ", "")
          .trim()
          .replace(/[^0-9]/g, "");
      }

      if (
        !this.selectTarget.virtualBank ||
        !this.formData["walletAddress"].value
      ) {
        lock = true;
      }

      // 針對 CGpay
      if (this.selectTarget.bank_id === 21 && !this.formData["CGPPwd"].value) {
        lock = true;
      }

      this.lockStatus = lock;
    },
    checkBindCGpay() {
      return axios({
        method: "get",
        url:
          "/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/withdraw/user/cgp_info"
      }).then(response => {
        const { ret, result } = response.data;

        if (!response || result !== "ok") {
          return;
        }

        this.bindWallets.cgPay = ret.is_bind_wallet;

        if (this.bindWallets.cgPay) {
          this.bindWallets.ids.push(21);
        }
      });
    },
    checkBindGoBao() {
      return axios({
        method: "get",
        url: "/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/vendor/is_bind"
      }).then(response => {
        const { ret, result } = response.data;

        if (!response || result !== "ok") {
          return;
        }

        this.bindWallets.goBao = ret;

        if (this.bindWallets.goBao) {
          this.bindWallets.ids.push(37);
        }
      });
    },
    getUserBindList() {
      return axios({
        method: "get",
        url: "/api/v1/c/player/user_virtual_bank/list",
        params: {
          common: true
        }
      }).then(response => {
        const { ret, result } = response.data;

        if (!response || result !== "ok") {
          return;
        }

        this.userBindVirtualBankList = ret.filter((item, index) => index < 15);
      });
    },
    getVirtualBankList() {
      axios({
        method: "get",
        url: "/api/payment/v1/c/virtual/bank/list"
      }).then(response => {
        const { ret, result } = response.data;

        if (!response || result !== "ok") {
          return;
        }

        // 有如果已綁定過相同類型錢包時，錢包類型就不出現選項
        // 因此 CGPay 與 購寶 只能綁定一組的條件已符合
        if (this.userLevelObj.virtual_bank_single) {
          let idArr = [
            ...new Set(
              this.userBindVirtualBankList.map(item => {
                return item.payment_gateway_id;
              })
            )
          ];

          if (idArr) {
            this.virtualBankList = ret.filter(item => {
              if (!idArr.includes(item.id)) {
                return item;
              }
            });
          }
        } else {
          // 沒有開啟綁定一組開關，需 Check 是否有綁定 CGPay 與 購寶
          this.virtualBankList = ret.filter(item => {
            if (!this.bindWallets.ids.includes(item.id)) {
              return item;
            }
          });
        }
      });
    },
    submitByNormal() {
      if (this.lockStatus) {
        return;
      }

      this.lockStatus = true;
      this.errorMsg = "";

      axios({
        method: "post",
        url: "/api/v1/c/player/user_virtual_bank",
        data: {
          address: this.formData["walletAddress"].value,
          payment_gateway_id: this.selectTarget.bank_id
        }
      })
        .then(response => {
          const { result, msg } = response.data;
          this.lockStatus = false;

          if (result !== "ok" || result === "error") {
            this.errorMsg = `${msg}[${code}]`;
            return;
          }

          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: this.clearMsgCallback
          });
        })
        .catch(res => {
          if (res.response && res.response.data && res.response.data.msg) {
            this.errorMsg = `${res.response.data.msg}[${res.response.data.code}]`;
            this.lockStatus = false;
            return;
          }
        });
    },
    submitByToken() {
      if (this.lockStatus) {
        return;
      }

      this.lockStatus = true;
      this.errorMsg = "";

      axios({
        method: "post",
        url: "/api/v1/c/ext/inpay",
        data: {
          api_uri: "/api/trade/v2/c/withdraw/bind_wallet_by_token",
          bind_type: "withdraw",
          wallet_gateway_id: 3, // 3 為CGpay
          wallet_account: this.formData["walletAddress"].value,
          wallet_token: this.formData["CGPPwd"].value
        }
      })
        .then(response => {
          const { result, msg, code } = response.data;
          this.lockStatus = false;

          if (result !== "ok" || result === "error") {
            this.errorMsg = `${msg}[${code}]`;
            return;
          }

          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: this.clearMsgCallback
          });
        })
        .catch(res => {
          if (res.response && res.response.data && res.response.data.msg) {
            this.errorMsg = `${res.response.data.msg}[${res.response.data.code}]`;
            this.lockStatus = false;
            return;
          }
        });
    },
    setBank(bank) {
      this.isShowPop = false;
      this.selectTarget.virtualBank = bank.name;
      this.selectTarget.bank_id = bank.id;
    },
    clearMsgCallback() {
      const { query } = this.$route;

      let redirect = query.redirect;

      if (!redirect) {
        this.showTab(true);
        this.changePage("virtualBankCardInfo");
        return;
      }

      let split = redirect.split("-");
      if (split.length === 2) {
        this.$router.push(`/mobile/${split[0]}/${split[1]}`);
        return;
      }

      // 有分類的遊戲大廳 card casino
      if (split.length === 3) {
        this.$router.push(`/mobile/${split[0]}/${split[1]}?label=${split[2]}`);
        return;
      }

      switch (redirect) {
        case "deposit":
          this.$router.push(`/mobile/mcenter/deposit`);
          return;
        case "wallet":
          this.$router.push(`/mobile/mcenter/wallet`);
          return;
        case "withdraw":
        case "balanceTrans":
          this.$router.push(`/mobile/mcenter/${redirect}`);
          return;
        case "liveStream":
        case "home":
          this.$router.push(`/mobile/${redirect}`);
          return;
        default:
          this.changePage("virtualBankCardInfo");
          return;
      }
    },
    verifyNumber(e) {
      const regex = /^[0-9]+$/;
      if (!regex.test(e.key)) {
        e.preventDefault();
      }
    },
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath("/static/image/ey1/default/bank_default_2.png"),
        loading: this.$getCdnPath(
          "/static/image/ey1/default/bank_default_2.png"
        )
      };
    }
  }
};
</script>

<style lang="scss" src="../css/addCard.module.scss" module />
