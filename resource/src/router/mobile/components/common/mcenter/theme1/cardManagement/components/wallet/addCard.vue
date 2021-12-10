<template>
  <div :class="$style['add-bankcard']">
    <p :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]">
      {{ errorMsg }}
    </p>

    <div :class="$style['card-info']">
      <!-- Select Wallet Type -->
      <!-- Yabo -->
      <template
        v-if="['porn1', 'sg1'].includes(themeTPL) && addBankCardStep === 'one'"
      >
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
      <template v-if="['ey1'].includes(themeTPL) && addBankCardStep === 'one'">
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

      <template
        v-if="!selectTarget.oneClickBindingMode && addBankCardStep === 'one'"
      >
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
                (selectTarget.walletId === 37 && addBankCardStep === 'one')
            "
            :class="$style['qrcode']"
            @click="
              checkWalletPhoneVerification
                ? goToPhoneCheck()
                : setPopupStatus(true, 'qrcode')
            "
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
            selectTarget.walletName &&
            addBankCardStep === 'one'
        "
      >
        <p :class="$style['wallet-tip']">
          请认真校对钱包地址，地址错误资金将无法到帐
        </p>
      </template>

      <!-- 手機驗證 -->
      <template v-if="addBankCardStep === 'two'">
        <div :class="$style['info-item']">
          <p :class="$style['input-title']">手机号码</p>
          <div :class="$style['input-wrap']">
            <template v-if="['ey1'].includes(themeTPL)">
              <select v-model="phoneHead" :class="$style['phone-selected']">
                <option
                  v-for="option in phoneHeadOption"
                  v-bind:value="option"
                  :key="option"
                >
                  {{ option }}
                </option>
              </select>
            </template>
            <input
              v-model="formData.phone"
              type="text"
              :placeholder="'请输入手机号码'"
              :class="$style['phone-input']"
              maxlength="36"
              @input="verification('phone')"
            />
          </div>
        </div>

        <div :class="$style['info-item']">
          <p :class="$style['input-title']">手机验证码</p>
          <div :class="$style['input-wrap']">
            <input
              v-model="formData.keyring"
              type="text"
              placeholder="请输入手机验证码"
              id="phone-code"
              @input="checkData($event.target.value, 'keyring')"
            />
            <div
              :class="[
                $style['send-keyring'],
                { [$style.disabled]: smsTimer || !isVerifyPhone }
              ]"
              @click="getKeyring"
            >
              {{ time ? `${time}s` : "获取验证码" }}
            </div>
          </div>
        </div>
      </template>

      <div :class="$style['info-confirm']">
        <div :class="$style['confirm-remind']">
          <p v-if="addBankCardStep === 'two'">
            1. 为确保您的资金安全，添加电子钱包需进行简单的数据核实 <br />
            2. 因手机号码影响各项重要功能，请您务必谨慎填写 <br />
            3.
            {{ siteConfig.SITE_NAME }}时刻关心您的资金安全
          </p>
        </div>
      </div>
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
        <template v-if="selectTarget.walletName && addBankCardStep === 'one'">
          <ul
            :class="[
              {
                [$style['onTop']]:
                  !selectTarget.oneClickBindingMode &&
                  walletTipInfo.length > 0 &&
                  addBankCardStep === 'one'
              },
              {
                [$style['onBottom']]:
                  selectTarget.oneClickBindingMode &&
                  walletTipInfo.length > 0 &&
                  addBankCardStep === 'one'
              },
              {
                [$style['no-button']]:
                  !selectTarget.oneClickBindingMode &&
                  walletTipInfo.length > 0 &&
                  selectTarget.walletId === 37 &&
                  addBankCardStep === 'one'
              }
            ]"
          >
            <li
              v-for="(item, index) in walletTipInfo"
              :key="`${item.key}-${index}`"
            >
              {{ item.text }}

              <span v-if="item.hasCallback" @click="item.dataObj.cb">
                {{ item.dataObj.text }}
              </span>
            </li>
          </ul>
        </template>
        <div
          v-if="epointTimeCount > 0 && selectTarget.walletId === 48"
          :class="$style['epoint-time']"
        >
          {{ `请于 ${epointTimeCount} 秒内绑定帐号` }}
        </div>
        <!-- 確認鈕 -->

        <div
          :class="[
            $style['submit'],
            {
              [$style['disabled']]:
                (addBankCardStep === 'two' && !NextStepStatus) ||
                (!NextStepStatus &&
                  lockStatus &&
                  !selectTarget.oneClickBindingMode) ||
                epointTimeCount > 0
            },
            {
              [$style['hidden']]:
                addBankCardStep === 'one' &&
                selectTarget.walletId === 37 &&
                !selectTarget.oneClickBindingMode
            }
          ]"
          @click="handleSmbmit"
        >
          <span
            v-if="addBankCardStep === 'one' && checkWalletPhoneVerification"
          >
            下一步
          </span>
          <span
            v-else-if="
              addBankCardStep === 'two' || selectTarget.walletId === 37
            "
            >提交</span
          >
          <span v-else
            >{{
              selectTarget.oneClickBindingMode
                ? selectTarget.walletId === 48
                  ? "绑定钱包"
                  : "一键绑定"
                : $text("S_CONFIRM", "确认")
            }}
          </span>
        </div>
      </div>
    </div>

    <p
      v-if="['porn1', 'sg1'].includes(themeTPL) || selectTarget.walletName"
      :class="$style['service-remind']"
    >
      如需帮助，请<span
        :class="$style['service-btn']"
        @click="handleClickService"
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
import ajax from "@/lib/ajax";
import { API_MCENTER_USER_CONFIG } from "@/config/api";
import { mapGetters, mapActions } from "vuex";
import i18n from "@/config/i18n";
// import virtualBankMixin from "@/mixins/mcenter/bankCard/addCard/virtualBank";
import popupQrcode from "@/router/mobile/components/common/virtualBank/popupQrcode";
import popupTip from "../popupTip";
import goLangApiRequest from "@/api/goLangApiRequest";
import lib_newWindowOpen from "@/lib/newWindowOpen";
// import bankMixin from "@/mixins/mcenter/bankCard/addCard/bank";
import walletMixin from "@/mixins/mcenter/bankCard/addCard/wallet";

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
    },
    addBankCardStep: {
      type: String,
      required: true
    }
  },
  mixins: [walletMixin],
  data() {
    return {
      phoneHead: "+86",
      phoneHeadOption: [],
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
        phone: "",
        keyring: "",
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

      walletTipInfo: [],

      //紀錄卡片資料
      isBackFromService: "",

      //紀錄是否開啟卡片欄位
      showBindingFormat: "",

      epointTimeCount: 0,
      epointTimeStamp: null
    };
  },
  mounted() {
    this.isBackFromService = JSON.parse(localStorage.getItem("selectTarget"));
    if (this.isBackFromService) {
      this.setBank(this.isBackFromService);
    }
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
        if (data.event === "trade_bind_wallet") {
          if (data.result === "ok" && !document.hidden) {
            this.actionSetGlobalMessage({
              msg: "绑定成功",
              cb: this.clearMsgCallback
            });
          } else if (data.code === "1500180017") {
            this.actionSetGlobalMessage({
              msg: "电子钱包已达绑定上限",
              cb: this.clearMsgCallback
            });
          } else {
            this.actionSetGlobalMessage({
              msg: data.msg,
              cb: this.clearMsgCallback
            });
          }
        }
      }
    },
    walletList() {
      // 在有指定選擇特定錢包的狀況下
      if (this.$route.query.swift) {
        // let wallet = this.$route.query.wallet;
        // let mapping = {
        //   CGPay: 21,
        //   goBao: 37,
        //   usdt: 39 // USDT(ERC20)
        // };

        this.filterWalletList = this.walletList.filter(item => {
          return item.swift_code === this.$route.query.swift;
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
    // 國碼
    ajax({
      method: "get",
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then(response => {
      if (response && response.result === "ok") {
        this.phoneHeadOption = response.ret.config.phone.country_codes;
      }
    });
    Promise.all([this.getUserBindList()]).then(() => {
      this.getWalletList();
    });

    document.addEventListener("visibilitychange", () => {
      // 記錄當前 redirect，因用手機外開至其它 App 時，再關閉外開網頁時，router 會改變
      const redirect = this.$route?.query?.redirect;

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
              cb: this.clearMsgCallback(redirect)
            });
          }
        });
      }
    });
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "getCustomerServiceUrl",
      "actionVerificationFormData"
    ]),
    goToPhoneCheck() {
      if (this.addBankCardStep === "one" && this.checkWalletPhoneVerification) {
        this.NextStepStatus = false;
        this.$emit("update:addBankCardStep", "two");
        return;
      }
    },
    handleClickService() {
      localStorage.setItem("bankCardType", "wallet");
      this.$router.push("/mobile/service?redirect=bankCard");
    },
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

      if (key === "phone") {
        this.actionVerificationFormData({
          target: "phone",
          value: this.formData.phone
        }).then(res => {
          this.formData.phone = res;
        });
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
          lang: "zh-cn",
          phone: `${this.phoneHead.replace("+", "")}-${this.formData.phone}`,
          keyring: this.formData.keyring
        }
      })
        .then(response => {
          const { data, status, errorCode } = response;
          this.isRevice = true;

          if (errorCode !== "00" || status !== "000") {
            return;
          }

          this.userBindWalletList = data;
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
          // console.log(this.userBindWalletList);
          // 預設錢包
          this.walletList = data;

          // 使用者所有已綁定的錢包ID
          const allBindingWalletIDs = [
            ...new Set(
              this.userBindWalletList.filter(item => {
                // CGPay || 購寶，只能綁定過一次(不論存放常用 or 歷史)
                if ([21, 37, 48].includes(item.virtual_bank_id)) {
                  return [21, 37, 48].includes(item.virtual_bank_id);
                } else if (
                  // 億元沒開限綁一組，則可添加多個同種類錢包，
                  // ["ey1"].includes(this.themeTPL) &&
                  !this.userLevelObj.virtual_bank_single
                ) {
                  return;
                } else {
                  // 億元開限綁一組的情況，在常用底下已有綁定過該種類，則不可重複綁(目前先不考慮歷史)
                  // 鴨博/絲瓜亦同
                  return item.common;
                }
              })
            )
          ].map(item => {
            return item.virtual_bank_id;
          });

          // 過濾可選擇的錢包列表
          this.walletList = data.filter(item => {
            if (!allBindingWalletIDs.includes(item.id)) {
              return item;
            }
          });
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
          virtualBankId: String(this.selectTarget.walletId),
          phone: `${this.phoneHead.replace("+", "")}-${this.formData.phone}`,
          keyring: this.formData.keyring
        }
      })
        .then(response => {
          this.isReceive = false;

          const { data, status, errorCode, msg } = response;

          if (errorCode !== "00" || status !== "000") {
            // this.actionSetGlobalMessage({ msg });
            this.errorMsg = msg;
            return;
          }

          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: this.clearMsgCallback
          });
        })
        .catch(error => {
          this.isReceive = false;
          const { msg } = error.response.data;
          // this.actionSetGlobalMessage({ msg });
          this.errorMsg = msg;
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
          wallet_token: this.formData["CGPPwd"].value,
          phone: `${this.phoneHead.replace("+", "")}-${this.formData.phone}`,
          keyring: this.formData.keyring
        }
      })
        .then(response => {
          const { result, msg, code } = response.data;
          this.isReceive = false;

          if (result !== "ok" || result === "error") {
            // this.actionSetGlobalMessage({ msg });
            this.errorMsg = msg;

            return;
          }

          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: this.clearMsgCallback
          });
        })
        .catch(error => {
          this.isReceive = false;
          const { msg } = error.response.data;
          // this.actionSetGlobalMessage({ msg });
          this.errorMsg = msg;
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

      switch (this.selectTarget.walletId) {
        case 37:
          id = 2;
          break;
        case 21:
          id = 3;
          break;
        case 48:
          id = 5;
          break;
        default:
          return;
      }

      return axios({
        url: "/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/withdraw/bind_wallet",
        method: "get",
        params: {
          wallet_gateway_id: id,
          phone: `${this.phoneHead.replace("+", "")}-${this.formData.phone}`,
          keyring: this.formData.keyring
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
      localStorage.setItem("selectTarget", JSON.stringify(bank));
      this.closePopup();
      localStorage.setItem("selectTarget", JSON.stringify(bank));
      this.selectTarget.walletName = bank.name;
      this.selectTarget.walletId = bank.id;
      this.selectTarget.swiftCode = bank.swift_code;
      this.lockStatus = true;

      this.showBindingFormat = localStorage.getItem("oneClickBindingMode");
      // 僅 CGpay 有一鍵綁定 (購寶等之後才有)
      if ([21, 48].includes(this.selectTarget.walletId)) {
        this.selectTarget.oneClickBindingMode = true;
        if (this.showBindingFormat) {
          this.selectTarget.oneClickBindingMode = false;
        } else {
          this.selectTarget.oneClickBindingMode = true;
        }
      } else {
        this.selectTarget.oneClickBindingMode = false;
      }
      if (this.isBackFromService) localStorage.removeItem("isBackFromService");
    },
    clearMsgCallback(_redirect = null) {
      const { query } = this.$route;
      localStorage.removeItem("selectTarget");
      let redirect = _redirect || query?.redirect;

      if (!redirect) {
        this.setPageStatus(1, "walletCardInfo", true);
        return;
      }

      let split = redirect?.split("-");
      if (split.length === 2) {
        this.$router.replace(`/mobile/${split[0]}/${split[1]}`);
        return;
      }

      // 有分類的遊戲大廳 card casino
      if (split.length === 3) {
        this.$router.replace(
          `/mobile/${split[0]}/${split[1]}?label=${split[2]}`
        );
        return;
      }

      switch (redirect) {
        case "deposit":
        case "wallet":
        case "withdraw":
        case "balanceTrans":
          this.$router.replace(`/mobile/mcenter/${redirect}`);
          return;

        case "liveStream":
        case "home":
          this.$router.replace(`/mobile/${redirect}`);
          return;
        default:
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
                localStorage.setItem(
                  "oneClickBindingMode",
                  "oneClickBindingMode"
                );
              } else {
                this.selectTarget.oneClickBindingMode = true;
                localStorage.removeItem("oneClickBindingMode");
              }
            }
          }
        };

        this.walletTipInfo = [
          _data,
          {
            key: "CGPay",
            text: `没有${this.selectTarget.walletName}帐号？`,
            hasCallback: true,
            dataObj: {
              cb: () => {
                lib_newWindowOpen(
                  this.getCustomerServiceUrl({
                    urlName: "cgp_introduce",
                    needToken: false
                  }).then(res => {
                    return res.uri;
                  })
                );
              },
              text: "立即申请"
            }
          }
        ];

        return;
      }

      // 購寶
      if (id === 37) {
        // 等購寶有一鍵綁定需求才註解掉
        // let _data = {
        //   key: "goBao",
        //   text: `试试`,
        //   hasCallback: true,
        //   dataObj: {
        //     text: bindingMode ? `扫码绑定` : `一键绑定`,
        //     cb: () => {
        //       if (bindingMode) {
        //         this.selectTarget.oneClickBindingMode = false;
        //       } else {
        //         this.selectTarget.oneClickBindingMode = true;
        //       }
        //     }
        //   }
        // };
        // this.walletTipInfo = [
        //   _data,
        //   {
        //     key: "goBao",
        //     text: `没有${this.selectTarget.walletName}？`,
        //     hasCallback: true,
        //     dataObj: {
        //       cb: () => {
        //         this.getCustomerServiceUrl({
        //           urlName: "game_wallet",
        //           needToken: false
        //         }).then(res => {
        //           window.open(res.uri);
        //         });
        //       },
        //       text: "立即申请"
        //     }
        //   }
        // ];

        let _data = {
          key: "goBao",
          text: `请使用扫码绑定`
        };

        this.walletTipInfo = [
          _data,
          {
            key: "goBao",
            text: `没有${this.selectTarget.walletName}帐号？`,
            hasCallback: true,
            dataObj: {
              cb: () => {
                lib_newWindowOpen(
                  this.getCustomerServiceUrl({
                    urlName: "game_wallet",
                    needToken: false
                  }).then(res => {
                    return res.uri;
                  })
                );
              },
              text: "立即申请"
            }
          }
        ];
        return;
      }
      //e點富
      if (id === 48) {
        this.walletTipInfo = [
          {
            key: "epoint",
            text: ``,
            hasCallback: true,
            dataObj: {
              cb: () => {
                // lib_newWindowOpen(
                //   this.getCustomerServiceUrl({
                //     urlName: "what_is_Epoint",
                //     needToken: false
                //   }).then(res => {
                //     return res.uri;
                //   })
                // );
                this.getCustomerServiceUrl({
                  urlName: "what_is_Epoint",
                  needToken: false
                }).then(res => {
                  localStorage.setItem("iframe-third-url", res.uri);
                  localStorage.setItem(
                    "iframe-third-url-title",
                    "e点富是什么?"
                  );
                  console.log(this.$route.query);
                  this.$router.replace(
                    `/mobile/iframe/${
                      this.$route.query.redirect === "deposit"
                        ? "epointfromdeposit"
                        : "epoint"
                    }?func=false`
                  );
                });
              },
              text: "e点富是什么?"
            }
          },
          // {
          //   key: "epoint",
          //   text: ``,
          //   hasCallback: true,
          //   dataObj: {
          //     cb: () => {
          //       // lib_newWindowOpen(
          //       //   this.getCustomerServiceUrl({
          //       //     urlName: "game_wallet",
          //       //     needToken: false
          //       //   }).then(res => {
          //       //     return res.uri;
          //       //   })
          //       // );
          //     },
          //     text: "如何使用e点富存款"
          //   }
          // },
          // {
          //   key: "epoint",
          //   text: `没有e点富帐号?`,
          //   hasCallback: true,
          //   dataObj: {
          //     cb: () => {
          //       // lib_newWindowOpen(
          //       //   this.getCustomerServiceUrl({
          //       //     urlName: "game_wallet",
          //       //     needToken: false
          //       //   }).then(res => {
          //       //     return res.uri;
          //       //   })
          //       // );
          //     },
          //     text: "立即申请"
          //   }
          // },
          {
            key: "epoint",
            text: `建议您e点富户名同网站真实姓名，加速出款审核时间`
          }
        ];
        return;
      }

      // if (
      //   ["porn1", "sg1"].includes(this.themeTPL) &&
      //   this.selectTarget.swiftCode === "BBUSDTCN1"
      // ) {
      //   this.walletTipInfo = [
      //     {
      //       key: "USDT",
      //       text: `还没有数字货币帐号？`,
      //       hasCallback: true,
      //       dataObj: {
      //         text: "点我查看交易所",
      //         cb: () => {
      //           this.setPopupStatus(true, "tip");
      //         }
      //       }
      //     }
      //   ];
      //   return;
      // }
    },
    handleSmbmit() {
      if (this.addBankCardStep === "one" && this.checkWalletPhoneVerification) {
        this.NextStepStatus = false;
        this.$emit("update:addBankCardStep", "two");
        return;
      }
      if (this.selectTarget.walletId === 37) {
        setPopupStatus(true, "qrcode");
      }
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
        if (this.selectTarget.walletId === 48) {
          this.epointTimeCount = 60;
          this.epointTimeStamp = setInterval(() => {
            if (this.epointTimeCount === 0) {
              clearInterval(this.epointTimeStamp);
              this.epointTimeStamp = null;
            }
            this.epointTimeCount -= 1;
          }, 1000);
        }
        this.getBindWalletInfo().then(url => {
          if (url) {
            newWindowHref(url);
          } else {
            newWindow.close();
          }
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

      // if (this.selectTarget.walletId === 37) {
      //   setPopupStatus(true, "qrcode");
      // }
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
