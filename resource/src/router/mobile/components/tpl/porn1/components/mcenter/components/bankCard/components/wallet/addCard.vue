<template>
  <div :class="$style['add-bankcard']">
    <div :class="$style['card-info']">
      <p :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]">
        {{ errorMsg }}
      </p>

      <!-- Select Wallet Type -->
      <!-- Yabo -->
      <template v-if="['porn1', 'sg1'].includes(themeTPL)">
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
                :src="$getCdnPath(`/static/image/common/select_active.png`)"
              />
            </li>
          </ul>
        </div>
      </template>

      <!-- 億元 -->
      <template v-if="['ey1'].includes(themeTPL)">
        <div :class="$style['info-item']">
          <p :class="$style['input-title']">
            {{ $text("S_WALLET_TYPE", "钱包类型") }}
          </p>
          <div
            :class="[
              $style['select-bank'],
              { [$style['disable']]: selectTarget.fixed }
            ]"
            @click="setPopupStatus(true, 'bank-list')"
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
              :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
            />
          </div>
        </div>
      </template>

      <template v-if="!selectTarget.oneClickBindingMode">
        <!-- Input -->
        <!-- 錢包地址 -->
        <div v-if="selectTarget.walletName" :class="$style['info-item']">
          <p :class="$style['input-title']">
            {{ formData["walletAddress"].title }}
          </p>

          <div
            :class="[
              $style['input-wrap'],
              { [$style['disable']]: selectTarget.walletId === 37 }
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
              (['ey1'].includes(themeTPL) && selectTarget.walletId === 21) ||
                selectTarget.walletId === 37
            "
            :class="$style['qrcode']"
            @click="setPopupStatus(true, 'qrcode')"
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
      </template>

      <!-- 億元：確認鈕上方text -->
      <template
        v-if="
          ['ey1'].includes(themeTPL) &&
            !selectTarget.oneClickBindingMode &&
            selectTarget.walletName
        "
      >
        <p :class="$style['wallet-tip']">
          请认真校对钱包地址，地址错误资金将无法到帐
        </p>
      </template>

      <!-- Confirm Button -->
      <div
        :class="$style['info-confirm']"
        :style="{
          flexDirection: selectTarget.oneClickBindingMode
            ? 'column-reverse'
            : 'column'
        }"
      >
        <!-- 上方 Tip 顯示 -->
        <template v-if="selectTarget.walletName">
          <ul
            :class="[
              {
                [$style['onTop']]:
                  !selectTarget.oneClickBindingMode && walletTipInfo.length > 0
              },
              {
                [$style['onBottom']]:
                  selectTarget.oneClickBindingMode && walletTipInfo.length > 0
              },
              {
                [$style['no-button']]:
                  !selectTarget.oneClickBindingMode &&
                  walletTipInfo.length > 0 &&
                  selectTarget.walletId === 37
              }
            ]"
          >
            <li
              v-for="(item, index) in walletTipInfo"
              :key="`${item.key}-${index}`"
            >
              {{ item.text }}

              <a v-if="item.hasLink" :href="item.dataObj.src" target="_blank">
                {{ item.dataObj.text }}
              </a>

              <span v-if="item.hasCallback" @click="item.dataObj.cb">
                {{ item.dataObj.text }}
              </span>
            </li>
          </ul>
        </template>

        <!-- 確認鈕 -->
        <div
          :class="[
            $style['submit'],
            {
              [$style['disabled']]:
                lockStatus && !selectTarget.oneClickBindingMode
            },
            {
              [$style['hidden']]:
                selectTarget.walletId === 37 &&
                !selectTarget.oneClickBindingMode
            }
          ]"
          @click="handleSmbmit"
        >
          {{
            selectTarget.oneClickBindingMode
              ? "一键绑定"
              : $text("S_CONFIRM", "确认")
          }}
        </div>
      </div>
    </div>

    <p
      v-if="['porn1', 'sg1'].includes(themeTPL) || selectTarget.walletName"
      :class="$style['service-remind']"
    >
      如需帮助，请<span
        :class="$style['service-btn']"
        @click="$router.push('/mobile/service')"
        >联系客服</span
      >
    </p>

    <template v-if="showPopStatus.isShow">
      <!-- 銀行列表選單 -->
      <template
        v-if="['ey1'].includes(themeTPL) && showPopStatus.type === 'bank-list'"
      >
        <div :class="$style['pop-wrap']">
          <div :class="$style['pop-mask']" @click="closePopup" />
          <div :class="[$style['pop-menu'], $style['custom1']]">
            <div :class="$style['pop-title']">
              <span @click="closePopup">
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
                <img v-lazy="getBankImage(item.image_url)" />
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
      <template
        v-if="
          ['porn1', 'sg1'].includes(themeTPL) && showPopStatus.type === 'tip'
        "
      >
        <popup-tip @close="closePopup" />
      </template>

      <!-- 錢包綁定 Qrcode -->
      <template v-if="showPopStatus.type === 'qrcode'">
        <popup-qrcode
          :virtualBankId="selectTarget.walletId"
          @close="closePopup"
        />
      </template>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import i18n from "@/config/i18n";
// import virtualBankMixin from "@/mixins/mcenter/bankCard/addCard/virtualBank";
import popupQrcode from "@/router/mobile/components/common/virtualBank/popupQrcode";
import popupTip from "../popupTip";
import goLangApiRequest from "@/api/goLangApiRequest";

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
        fixed: false,
        oneClickBindingMode: false
      },
      // Server 回傳的可用錢包的列表
      walletList: [],
      // 當選擇某種特定錢包的列表
      filterWalletList: [],
      userBindWalletList: [],

      // 彈窗顯示狀態統整
      showPopStatus: {
        isShow: false,
        type: ""
      },

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

      // 確認按鈕鎖定狀態
      lockStatus: true,
      // Ajax 是否正在觸發
      isReceive: false,

      errorMsg: "",

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
    }
  },
  watch: {
    "selectTarget.oneClickBindingMode"() {
      this.getWalletTipInfo();
    },
    "selectTarget.walletId"(value) {
      // 不確定點擊相同錢包時，是否要清除資料?假如有，將以下 code 搬至 setBank
      this.formData["CGPPwd"].value = "";
      this.formData["walletAddress"].value = "";
      this.walletTipInfo = [];

      let text = "";

      switch (value) {
        case 21:
          if (["porn1", "sg1"].includes(this.themeTPL)) {
            // text = "请输入CGPay邮箱/手机号或扫扫二维码";
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
          text = "请点击二维码绑定";
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

        // 針對 Qrcode 掃碼，因不會跳轉至其它 App 或 Web，仍停留在目前 App 時才進行推播流程
        // 故已排除在開啟外部 App or Web 時，如收到推播成功，則不會進行任何動作
        if (
          data.event === "trade_bind_wallet" &&
          data.result === "ok" &&
          !document.hidden
        ) {
          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: this.clearMsgCallback
          });
        }
      }
    },
    walletList() {
      // 在有指定選擇特定錢包的狀況下
      if (this.$route.query.wallet) {
        let wallet = this.$route.query.wallet;
        let mapping = {
          CGPay: 21,
          goBao: 37,
          usdt: 39 // USDT(ERC20)
        };

        this.filterWalletList = this.walletList.filter(item => {
          return item.id === mapping[wallet];
        });

        // 如果使用者未綁定特定卡片，則導到 特定卡片 指定選項
        if (this.filterWalletList.length > 0) {
          this.setBank(this.filterWalletList[0]);
          this.selectTarget.fixed = true;
        } else {
          // 如果已綁定 or 沒有開放該特定卡片的時候，則導到卡片管理-添加電子錢包
          this.$router.replace({
            path: "bankcard",
            query: { type: "wallet" },
            replace: true
          });
          this.setPageStatus(1, "walletCardInfo", true);
        }
      }
    }
  },
  created() {
    Promise.all([this.getUserBindList()]).then(() => {
      this.getWalletList();
    });

    document.addEventListener("visibilitychange", () => {
      // 取得當下進來頁面時的綁定錢包的長度
      let oldWallet_length = this.userBindWalletList.length;

      if (!document.hidden) {
        console.log("Visibilitychange event");

        // 預設為舊錢包長度
        let newWallet_length = oldWallet_length;

        Promise.all([this.getUserBindList()]).then(() => {
          this.getWalletList();

          // 呼叫 API 新錢包長度
          newWallet_length = this.userBindWalletList.length;

          // 如果在外部 App or Web 有綁定成功
          if (newWallet_length > oldWallet_length) {
            console.log("wallet length change");

            this.actionSetGlobalMessage({
              msg: "绑定成功",
              cb: this.clearMsgCallback
            });
          }
        });
      }
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
      //  C02.241 查詢會員電子錢包
      return goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/Virtual/Bank/List`,
        params: {
          lang: "zh-cn"
        }
      })
        .then(response => {
          const { data, status, errorCode } = response;
          this.isRevice = true;

          if (errorCode !== "00" || status !== "000") {
            return;
          }

          this.userBindWalletList = data.filter((item, index) => index < 15);
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          this.actionSetGlobalMessage({ msg, code });
        });
    },
    getWalletList() {
      // C02.141 取得廳主支援的電子錢包列表
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Payment/VirtualBank/List`,
        params: {
          lang: "zh-cn"
        }
      })
        .then(response => {
          const { data, status, errorCode } = response;

          if (errorCode !== "00" || status !== "000") {
            return;
          }

          // 預設錢包
          this.walletList = data;

          // Yabo：辨别目前使用者已绑定的錢包，並過濾出尚未綁定的錢包
          // 億元：如果已綁定過相同類型錢包時，錢包類型就不出現選項。因此 CGPay 與 購寶 只能綁定一組的條件已符合
          // Yabo 目前與 億元　等同條件判斷
          if (
            ["porn1", "sg1"].includes(this.themeTPL) ||
            (["ey1"].includes(this.themeTPL) &&
              this.userLevelObj.virtual_bank_single)
          ) {
            let idArr = [
              ...new Set(
                this.userBindWalletList.map(item => {
                  return item.virtual_bank_id;
                })
              )
            ];

            if (idArr) {
              this.walletList = data.filter(item => {
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
                    item.virtual_bank_id === 21 || item.virtual_bank_id === 37
                  );
                })
              )
            ].map(item => {
              return item.virtual_bank_id;
            });

            if (idArr) {
              this.walletList = data.filter(item => {
                if (!idArr.includes(item.id)) {
                  return item;
                }
              });
            }
          }
        })
        .catch(error => {
          const { msg } = error.response.data;
          this.actionSetGlobalMessage({ msg });
        });
    },
    submitByNormal() {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;
      this.errorMsg = "";

      // C02.239 新增會員電子錢包
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/Virtual/Bank`,
        params: {
          lang: "zh-cn",
          address: this.formData["walletAddress"].value,
          virtualBankId: this.selectTarget.walletId
        }
      })
        .then(response => {
          this.isReceive = false;

          const { data, status, errorCode, msg } = response;

          if (errorCode !== "00" || status !== "000") {
            this.actionSetGlobalMessage({ msg });
            return;
          }

          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: this.clearMsgCallback
          });
        })
        .catch(error => {
          const { msg } = error.response.data;
          this.actionSetGlobalMessage({ msg });
          this.isReceive = false;
        });
    },
    submitByToken() {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;
      this.errorMsg = "";

      axios({
        method: "post",
        url: "/api/v1/c/ext/inpay",
        data: {
          api_uri: "/api/trade/v2/c/withdraw/bind_wallet_by_token",
          // bind_type: "withdraw",
          wallet_gateway_id: 3, // 3 為CGpay
          wallet_account: this.formData["walletAddress"].value,
          wallet_token: this.formData["CGPPwd"].value
        }
      })
        .then(response => {
          const { result, msg, code } = response.data;
          this.isReceive = false;

          if (result !== "ok" || result === "error") {
            this.actionSetGlobalMessage({ msg });
            return;
          }

          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: this.clearMsgCallback
          });
        })
        .catch(error => {
          const { msg } = error.response.data;
          this.actionSetGlobalMessage({ msg });
          this.isReceive = false;
          return;
        });
    },
    /*
    // 取得電子錢包綁定帳號資訊
    */
    getBindWalletInfo() {
      if (this.isReceive) {
        return Promise.resolve(false);
      }

      this.isReceive = true;

      // walletGatewayId = 3 -> CGPay
      // walletGatewayId = 2 -> 購寶
      let id = null;

      if (this.selectTarget.walletId === 37) {
        id = 2;
      } else if (this.selectTarget.walletId === 21) {
        id = 3;
      }

      return axios({
        url: "/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/withdraw/bind_wallet",
        method: "get",
        params: {
          wallet_gateway_id: id
        }
      })
        .then(res => {
          const { result, ret, msg } = res.data;
          this.isReceive = false;

          if (result !== "ok") {
            this.actionSetGlobalMessage({ msg });
            return Promise.resolve(false);
          }

          return Promise.resolve(ret.html);
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          this.isReceive = false;
          this.actionSetGlobalMessage({ msg, code });
        });
    },
    setBank(bank) {
      this.closePopup();
      this.selectTarget.walletName = bank.name;
      this.selectTarget.walletId = bank.id;
      this.selectTarget.swiftCode = bank.swift_code;

      // 僅 CGpay && 購寶 有一鍵綁定
      if ([21, 37].includes(this.selectTarget.walletId)) {
        this.selectTarget.oneClickBindingMode = true;
      } else {
        this.selectTarget.oneClickBindingMode = false;
      }
    },
    clearMsgCallback() {
      const { query } = this.$route;

      let redirect = query.redirect;

      console.log(redirect);

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
        // case "deposit":
        //   this.$router.push(`/mobile/mcenter/deposit`);
        //   return;
        // case "wallet":
        //   this.$router.push(`/mobile/mcenter/wallet`);
        //   return;
        case "deposit":
        case "wallet":
        case "withdraw":
        case "balanceTrans":
          this.$router.push(`/mobile/mcenter/${redirect}`);
          break;

        case "liveStream":
        case "home":
          this.$router.push(`/mobile/${redirect}`);
          break;

        default:
          // this.setPageStatus(1, "walletCardInfo", true);
          this.$router.back();
          break;
      }
    },
    verifyNumber(e) {
      const regex = /^[0-9]+$/;
      if (!regex.test(e.key)) {
        e.preventDefault();
      }
    },
    getBankImage(image_url) {
      return {
        src: image_url,
        error: this.$getCdnPath(
          `/static/image/common/default/bank_card_default.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/common/default/bank_card_default.png`
        )
      };
    },
    getWalletTipInfo() {
      const id = this.selectTarget.walletId;
      const bindingMode = this.selectTarget.oneClickBindingMode;

      // CGPay
      if (id === 21) {
        let _data = {
          key: "CGPay",
          text: bindingMode
            ? `试试`
            : `可输入${this.selectTarget.walletName}帐号、扫码绑定或试试`,
          hasCallback: true,
          dataObj: {
            text: bindingMode ? `其它绑定方式` : `一键绑定`,
            cb: () => {
              if (bindingMode) {
                this.selectTarget.oneClickBindingMode = false;
              } else {
                this.selectTarget.oneClickBindingMode = true;
              }
            }
          }
        };

        this.walletTipInfo = [
          _data,
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

      // 購寶
      if (id === 37) {
        let _data = {
          key: "goBao",
          text: `试试`,
          hasCallback: true,
          dataObj: {
            text: bindingMode ? `扫码绑定` : `一键绑定`,
            cb: () => {
              if (bindingMode) {
                this.selectTarget.oneClickBindingMode = false;
              } else {
                this.selectTarget.oneClickBindingMode = true;
              }
            }
          }
        };

        this.walletTipInfo = [
          _data,
          {
            key: "goBao",
            text: `没有${this.selectTarget.walletName}？`,
            hasLink: true,
            dataObj: {
              src: "https://www.gamewallet.asia/",
              text: "立即申请"
            }
          }
        ];
        return;
      }

      if (
        ["porn1", "sg1"].includes(this.themeTPL) &&
        this.selectTarget.swiftCode === "BBUSDTCN1"
      ) {
        this.walletTipInfo = [
          {
            key: "USDT",
            text: `还没有数字货币帐号？`,
            hasCallback: true,
            dataObj: {
              text: "点我查看交易所",
              cb: () => {
                this.setPopupStatus(true, "tip");
              }
            }
          }
        ];
        return;
      }
    },
    handleSmbmit() {
      if (this.selectTarget.oneClickBindingMode) {
        // 呼叫 API 前另需視窗
        let newWindow = "";
        newWindow = window.open();

        const newWindowHref = uri => {
          try {
            newWindow.location = uri;
          } catch (e) {
            console.log(e);
            console.log(newWindow);
            console.log(uri);
          }
        };

        this.getBindWalletInfo().then(url => {
          newWindowHref(url);
          return;
        });
      } else {
        // CGPay
        if (this.selectTarget.walletId === 21) {
          this.submitByToken();
        } else {
          this.submitByNormal();
        }
        return;
      }
    },
    setPopupStatus(isShow, type) {
      this.showPopStatus = {
        isShow,
        type
      };
    },
    closePopup() {
      this.setPopupStatus(false, "");
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
<style
  lang="scss"
  src="@/css/page/bankCard/sg1.addCard.module.scss"
  module="$style_sg1"
></style>
