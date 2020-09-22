<template>
  <div :class="$style['add-bankcard']">
    <div :class="$style['card-info']">
      <p :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]">
        {{ errorMsg }}
      </p>

      <!-- Select Wallet Type -->
      <!-- Yabo -->
      <template v-if="themeTPL === 'porn1'">
        <div :class="$style['wallet-block']">
          <p :class="$style['wallet-text']">
            {{ $text("S_WALLET_TYPE", "钱包类型") }}
          </p>

          <ul :class="$style['wallet-list']">
            <li
              :class="[
                $style['wallet-item'],
                {
                  [$style['is-current']]: item.id === selectTarget.walletId
                }
              ]"
              v-for="item in selectTarget.fixed ? filterWalletList : walletList"
              :key="item.id"
              @click="setBank(item)"
            >
              {{ item.name }}

              <img
                v-if="item.id === selectTarget.walletId"
                :class="$style['select-wallet-img']"
                src="/static/image/porn1/common/select_active.png"
              />
            </li>
          </ul>
        </div>
      </template>

      <!-- 億元 -->
      <template v-if="themeTPL === 'ey1'">
        <div :class="$style['info-item']">
          <p :class="$style['input-title']">
            {{ $text("S_WALLET_TYPE", "钱包类型") }}
          </p>
          <div
            :class="[
              $style['select-bank'],
              { [$style['disable']]: selectTarget.fixed }
            ]"
            @click="isShowPopBankList = true"
          >
            <span
              :class="{ [$style['select-active']]: selectTarget.walletName }"
            >
              {{
                selectTarget.walletName
                  ? selectTarget.walletName
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
      </template>

      <!-- Input -->
      <div v-if="selectTarget.walletName" :class="$style['info-item']">
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
          v-if="
            (themeTPL !== 'porn1' && selectTarget.walletId === 21) ||
              isGoBaoWallet
          "
          :class="$style['qrcode']"
          @click="isShowPopQrcode = true"
        >
          <img
            :src="
              $getCdnPath(
                `/static/image/${themeTPL}/mcenter/bankCard/ic_qrcode.png`
              )
            "
            alt="qrcode"
          />
        </div>
      </div>

      <!-- CGPay 支付密碼欄位 -->
      <div v-if="selectTarget.walletId === 21" :class="$style['info-item']">
        <p :class="$style['input-title']">
          {{ formData["CGPPwd"].title }}
        </p>
        <div :class="$style['input-wrap']">
          <input
            v-model="formData['CGPPwd'].value"
            type="password"
            :placeholder="formData['CGPPwd'].placeholder"
            @input="verification('CGPPwd')"
            @blur="verification('CGPPwd')"
          />
        </div>
      </div>

      <!-- Confirm Button -->
      <div :class="$style['info-confirm']">
        <!-- Yabo : 上方 Tip 顯示 -->
        <template v-if="themeTPL === 'porn1' && selectTarget.walletName">
          <li
            v-for="(item, index) in walletTipInfo"
            :key="`${item.key}-${index}`"
          >
            {{ item.text }}
            <a v-if="item.hasLink" :href="item.dataObj.src" target="_blank">
              {{ item.dataObj.text }}
            </a>
            <span v-if="item.hasPopupTip" @click="item.dataObj.cb">
              {{ item.dataObj.text }}
            </span>
          </li>
        </template>

        <!-- 億元：確認鈕上方text -->
        <template v-if="themeTPL === 'ey1' && selectTarget.walletName">
          <p v-if="!isGoBaoWallet">
            请认真校对钱包地址，地址错误资金将无法到帐
          </p>
        </template>

        <!-- 確認鈕 -->
        <!-- 針對 CGpay -->
        <div
          v-if="selectTarget.walletId === 21"
          :class="[$style['submit'], { [$style['disabled']]: lockStatus }]"
          @click="submitByToken"
        >
          {{ $text("S_CONFIRM", "确认") }}
        </div>

        <!-- 新增一般錢包 -->
        <div
          v-else
          :class="[
            $style['submit'],
            { [$style['disabled']]: lockStatus },
            {
              [$style['hidden']]: isGoBaoWallet
            }
          ]"
          @click="submitByNormal"
        >
          {{ $text("S_CONFIRM", "确认") }}
        </div>
      </div>
    </div>

    <p v-if="selectTarget.walletName" :class="$style['service-remind']">
      如需帮助，请<span
        :class="$style['service-btn']"
        @click="$router.push('/mobile/service')"
        >联系客服</span
      >
    </p>

    <!-- 錢包類型選單 -->
    <template v-if="themeTPL === 'ey1'">
      <div v-if="isShowPopBankList" :class="$style['pop-wrap']">
        <div :class="$style['pop-mask']" @click="isShowPopBankList = false" />
        <div :class="[$style['pop-menu'], $style['custom1']]">
          <div :class="$style['pop-title']">
            <span @click="isShowPopBankList = false">
              {{ $text("S_CANCEL", "取消") }}
            </span>
            请选择钱包类型
          </div>
          <ul :class="$style['pop-list']">
            <li
              v-for="item in walletList"
              :key="item.id"
              @click="setBank(item)"
            >
              <img v-lazy="getBankImage(item.swift_code)" />
              {{ item.name }}
              <icon
                v-if="item.id === selectTarget.walletId"
                :class="$style['select-icon']"
                name="check"
              />
            </li>
          </ul>
        </div>
      </div>
    </template>

    <!-- USDT Tip 彈窗 -->
    <template v-if="themeTPL === 'porn1'">
      <popup-tip v-if="isShowPopTip" :isShowPop.sync="isShowPopTip" />
    </template>

    <popup-qrcode
      v-if="isShowPopQrcode"
      :isShowPop.sync="isShowPopQrcode"
      :paymentGatewayId="selectTarget.walletId"
    />
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import i18n from "@/config/i18n";
// import virtualBankMixin from "@/mixins/mcenter/bankCard/addCard/virtualBank";
import popupQrcode from "@/router/mobile/components/common/virtualBank/popupQrcode";
import popupTip from "../popupTip";

export default {
  components: {
    popupQrcode,
    popupTip
  },
  props: {
    setPageStatus: {
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
        walletId: "",
        walletName: "",
        swiftCode: "",
        fixed: false
      },
      walletList: [],
      filterWalletList: [],
      userBindWalletList: [],

      isShowPopBankList: false,
      isShowPopTip: false,
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
      msg: "",

      walletTipInfo: []
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      noticeData: "getNoticeData",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    showPopQrcode: {
      get() {
        return this.isShowPopQrcode;
      },
      set(value) {
        this.isShowPopQrcode = value;
      }
    },
    showPopTip: {
      get() {
        return this.isShowPopTip;
      },
      set(value) {
        this.isShowPopTip = value;
      }
    }
  },
  watch: {
    "selectTarget.walletId"(value) {
      // 不確定點擊相同錢包時，是否要清除資料?假如有，將以下 code 搬至 setBank
      this.formData["CGPPwd"].value = "";
      this.formData["walletAddress"].value = "";
      this.isGoBaoWallet = false;
      this.walletTipInfo = [];

      let text = "";

      switch (value) {
        case 21:
          if (this.themeTPL === "porn1") {
            text = "请输入CGP邮箱/手机号";
          } else {
            text = "请输入CGP邮箱/手机号或扫扫二维码";
          }

          this.getWalletTipInfo();
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
          text = "请点击二维码綁定";
          this.isGoBaoWallet = true;
          this.getWalletTipInfo();
          break;
        case 38:
          text = "请输入VenusPoint取款帐号";
          break;

        default:
          text = "请输入钱包地址";
          this.getWalletTipInfo();
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
              if (this.$route.query.redirect) {
                this.$router.back();
              } else {
                this.setPageStatus(1, "walletCardInfo", true);
              }
            }
          });
        }
      }
    },
    walletList() {
      // Yabo
      if (this.themeTPL === "porn1" && this.$route.query.wallet) {
        switch (this.$route.query.wallet) {
          case "CGPay":
            this.filterWalletList = this.walletList.filter(item => {
              return item.id === 21;
            });
            break;

          case "goBao":
            this.filterWalletList = this.walletList.filter(item => {
              return item.id === 37;
            });
            break;

          // 目前僅開放 USDT(ERC20)
          case "usdt":
            this.filterWalletList = this.walletList.filter(item => {
              // return item.swift_code === "BBUSDTCN1";
              return item.id === 39;
            });
            break;
        }

        this.setBank(this.filterWalletList[0]);
        this.selectTarget.fixed = true;
      }

      // 億元
      // 從首頁 or 提現頁進來，且只選擇 CGPay
      if (this.themeTPL === "ey1" && this.$route.query.wallet) {
        switch (this.$route.query.wallet) {
          case "CGPay":
            let item = this.walletList.find(item => {
              return item.id === 21;
            });

            // 如果使用者未綁定，導到 CGPay 指定頁面
            if (item) {
              this.setBank(item);
              this.selectTarget.fixed = true;
              return;
            } else {
              // 如果已綁定，導到卡片管理-添加電子錢包
              this.$router.replace({
                path: "bankcard",
                query: { type: "wallet" },
                replace: true
              });
              this.setPageStatus(1, "walletCardInfo", true);
              return;
            }

            break;
        }
      }
    }
  },
  created() {
    Promise.all([this.getUserBindList()]).then(() => {
      this.getWalletList();
    });
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetGlobalMessage"]),
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
        !this.selectTarget.walletName ||
        !this.formData["walletAddress"].value
      ) {
        lock = true;
      }

      // 針對 CGpay
      if (this.selectTarget.walletId === 21 && !this.formData["CGPPwd"].value) {
        lock = true;
      }

      this.lockStatus = lock;
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

        this.userBindWalletList = ret.filter((item, index) => index < 15);
      });
    },
    getWalletList() {
      axios({
        method: "get",
        url: "/api/payment/v1/c/virtual/bank/list"
      }).then(response => {
        const { ret, result } = response.data;

        if (!response || result !== "ok") {
          return;
        }

        // 預設錢包
        this.walletList = ret;

        // Yabo：辨别目前使用者已绑定的錢包，並過濾出尚未綁定的錢包
        // 億元：如果已綁定過相同類型錢包時，錢包類型就不出現選項。因此 CGPay 與 購寶 只能綁定一組的條件已符合
        // Yabo 目前與 億元　等同條件判斷
        if (
          this.themeTPL === "porn1" ||
          (this.themeTPL === "ey1" && this.userLevelObj.virtual_bank_single)
        ) {
          let idArr = [
            ...new Set(
              this.userBindWalletList.map(item => {
                return item.payment_gateway_id;
              })
            )
          ];

          if (idArr) {
            this.walletList = ret.filter(item => {
              if (!idArr.includes(item.id)) {
                return item;
              }
            });
          }
        } else {
          // 億元：沒有開啟綁定一組開關，需 Check 是否有綁定 CGPay 與 購寶
          let idArr = [
            ...new Set(
              this.userBindWalletList.filter(item => {
                return (
                  item.payment_gateway_id === 21 ||
                  item.payment_gateway_id === 37
                );
              })
            )
          ].map(item => {
            return item.payment_gateway_id;
          });

          if (idArr) {
            this.walletList = ret.filter(item => {
              if (!idArr.includes(item.id)) {
                return item;
              }
            });
          }
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
          payment_gateway_id: this.selectTarget.walletId
        }
      })
        .then(response => {
          const { result, msg } = response.data;
          this.lockStatus = false;

          if (result !== "ok" || result === "error") {
            this.errorMsg = `${msg}`;
            return;
          }

          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: this.clearMsgCallback
          });
        })
        .catch(res => {
          if (res.response && res.response.data && res.response.data.msg) {
            this.errorMsg = `${res.response.data.msg}`;
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
            this.errorMsg = `${msg}`;
            return;
          }

          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: this.clearMsgCallback
          });
        })
        .catch(res => {
          if (res.response && res.response.data && res.response.data.msg) {
            this.errorMsg = `${res.response.data.msg}`;
            this.lockStatus = false;
            return;
          }
        });
    },
    setBank(bank) {
      this.isShowPopBankList = false;
      this.selectTarget.walletName = bank.name;
      this.selectTarget.walletId = bank.id;
      this.selectTarget.swiftCode = bank.swift_code;
    },
    clearMsgCallback() {
      const { query } = this.$route;

      let redirect = query.redirect;

      if (!redirect) {
        this.setPageStatus(1, "walletCardInfo", true);
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
          this.setPageStatus(1, "walletCardInfo", true);
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
        error: this.$getCdnPath(
          `/static/image/${this.themeTPL}/default/bank_default_2.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/${this.themeTPL}/default/bank_default_2.png`
        )
      };
    },
    getWalletTipInfo() {
      if (this.themeTPL === "ey1") return;

      if (this.selectTarget.walletId === 21) {
        this.walletTipInfo = [
          {
            key: "CGPay",
            text: `可输入${this.selectTarget.walletName}帐号或扫码绑定`
          },
          {
            key: "CGPay",
            text: `没有${this.selectTarget.walletName}帐号？`,
            hasLink: true,
            dataObj: {
              src: "https://cgpayintroduction.azurewebsites.net/index.aspx",
              text: "立即申请"
            }
          }
        ];
        return;
      }

      if (this.selectTarget.walletId === 37) {
        this.walletTipInfo = [
          {
            key: "goBao",
            text: "请使用扫码绑定"
          },
          {
            key: "goBao",
            text: `没有${this.selectTarget.walletName}帐号？`,
            hasLink: true,
            dataObj: {
              src: "https://www.gamewallet.asia/",
              text: "立即申请"
            }
          }
        ];
        return;
      }

      if (this.selectTarget.swiftCode === "BBUSDTCN1") {
        this.walletTipInfo = [
          {
            key: "USDT",
            text: `还没有数字货币帐号？`,
            hasPopupTip: true,
            dataObj: {
              text: "点我查看交易所",
              cb: () => {
                this.isShowPopTip = true;
              }
            }
          }
        ];
        return;
      }
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/bankCard/porn1.addCard.module.scss"
  module="$style_porn1"
></style>

<style
  lang="scss"
  src="@/css/page/bankCard/ey1.addCard.module.scss"
  module="$style_ey1"
></style>
