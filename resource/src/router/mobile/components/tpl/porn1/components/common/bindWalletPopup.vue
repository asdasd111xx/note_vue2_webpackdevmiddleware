<template>
  <!-- 目前只有億元-存款綁 USDT 會使用到-->
  <div>
    <template v-if="!showPopStatus.isShow">
      <div :class="$style['popup']">
        <div
          :class="$style['mask']"
          @click="
            () => {
              if (walletType === 'USDT') {
                closePopup();
              }
            }
          "
        />
        <div :class="$style['block']">
          <div :class="$style['content']">
            <div :class="$style['title']">{{ title }}</div>

            <!-- <p
              :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]"
            >
              {{ errorMsg }}
            </p> -->

            <div :class="$style['info-item']">
              <div :class="$style['input-title']">
                {{ formData["walletAddress"].title }}
              </div>

              <div :class="$style['input-wrap']">
                <textarea
                  v-model="formData['walletAddress'].value"
                  :placeholder="formData['walletAddress'].placeholder"
                  maxlength="42"
                  @input="verification('walletAddress')"
                  @blur="verification('walletAddress')"
                />
              </div>
            </div>

            <!-- CGPay -->
            <!-- <template v-if="walletType === 'CGPay'">
              <div :class="$style['info-item']">
                <div :class="$style['input-title']">
                  {{ formData["CGPPwd"].title }}
                </div>

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

              <div :class="$style['tips-text']">
                <p>
                  ● 可使用输入或
                  <span @click="tipMethod(0)">扫码绑定</span>
                </p>

                <p>●<span @click="tipMethod(1)"> CGP是什么?</span></p>

                <p>●<span @click="tipMethod(2)"> 如何透过CGP存款?</span></p>

                <p>
                  ● 沒有CGP帐号?
                  <span @click="tipMethod(3)">立即申请</span>
                </p>
              </div>
            </template> -->

            <!-- USDT -->
            <!-- <template v-if="walletType === 'USDT'">
              <div :class="$style['info-item']">
                <div :class="$style['input-title']">建立您的加密货币帐号</div>

                <div :class="$style['icon-block']">
                  <div
                    v-for="(item, key) in usdtTipsList"
                    :key="key"
                    :class="$style['item']"
                    @click="item.onClick"
                  >
                    <img :src="$getCdnPath(item.iconSrc)" :alt="item.alias" />
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </div>
            </template> -->
          </div>

          <div :class="$style['button-block']">
            <template v-if="walletType === 'USDT'">
              <span :class="[$style['submit']]" @click="submitByNormal"
                >送出</span
              >
            </template>

            <!-- <template v-if="walletType === 'CGPay'">
              <span @click="closePopup">取消</span>
              <span :class="$style['submit']" @click="submitByToken">送出</span>
            </template> -->
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- Qrcode Popup -->
      <popup-qrcode
        :virtualBankId="qrcodeObj.bank_id"
        :bindType="qrcodeObj.bind_type"
        @close="closePopup"
      />
    </template>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import popupQrcode from "@/router/mobile/components/common/virtualBank/popupQrcode";
import lib_newWindowOpen from "@/lib/newWindowOpen";

export default {
  components: {
    popupQrcode
  },
  props: {
    walletType: {
      type: String,
      default: ""
    },
    eyBindWalletData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isReceive: false,
      errorMsg: "",
      title: "",
      formData: {
        walletAddress: {
          title: "",
          value: "",
          placeholder: "必填"
        },
        CGPPwd: {
          title: "CGP安全防护码",
          value: "",
          placeholder: "必填"
        }
      },

      // 彈窗顯示狀態統整
      showPopStatus: {
        isShow: false,
        type: ""
      },

      qrcodeObj: {
        bank_id: null,
        bind_type: "deposit"
      }
    };
  },
  watch: {
    "showPopStatus.isShow"(value) {
      // 切換到 Qrcode 頁面，連同整個 popup 關掉
      if (!value) {
        this.closePopup();
      }
    }
  },
  created() {
    switch (this.walletType) {
      case "CGPay":
        this.title = "绑定CGP";
        this.formData["walletAddress"].title = "CGP邮箱/手机号";
        this.qrcodeObj.bank_id = 21;
        break;

      case "USDT":
        this.title = `绑定 ${this.eyBindWalletData.payment_method_name}`;
        this.formData["walletAddress"].title = "钱包位址";
        break;

      default:
        break;
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    usdtTipsList() {
      let tips = [
        {
          name: "火币",
          iconSrc: `/static/image/common/mcenter/deposit/ic_huobi.png`,
          onClick: () => {
            lib_newWindowOpen(
              this.getCustomerServiceUrl({
                urlName: "huobi",
                needToken: false
              }).then(res => {
                return res.uri;
              })
            );
          }
        }
        // {
        //   name: "58COIN",
        //   iconSrc: `/static/image/common/mcenter/deposit/ic_58coin.png`,
        //   onClick: () => {
        //     this.getCustomerServiceUrl({
        //       urlName: "58coin",
        //       needToken: false
        //     }).then(res => {
        //       window.open(res.uri);
        //     });
        //   }
        // }
      ];

      return tips;
    }
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionVerificationFormData",
      "getCustomerServiceUrl"
    ]),
    tipMethod(index) {
      switch (index) {
        case 0:
          this.showPopStatus.isShow = true;
          break;

        case 1:
          window.open("https://cgpayintroduction.azurewebsites.net/index.aspx");
          break;

        case 2:
          window.open("");
          break;

        case 3:
          window.open("http://oinbox.io");
          break;
      }
    },
    closePopup() {
      this.$emit("close");
    },
    submitByNormal() {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;

      axios({
        method: "post",
        url: "/api/v1/c/player/user_virtual_bank",
        data: {
          address: this.formData["walletAddress"].value,
          virtual_bank_id:
            this.eyBindWalletData.swift_code === "BBUSDTCN1" ? "39" : "46" // 目前只有 USDT , ERC20 = 39 ,TRC20 = 46
        }
      })
        .then(response => {
          const { result, msg } = response.data;

          this.isReceive = false;

          if (result !== "ok" || result === "error") {
            this.actionSetGlobalMessage({
              msg: msg
            });
            return;
          }

          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: () => {
              window.location.reload();
            }
          });
        })
        .catch(res => {
          this.isReceive = false;

          if (res.response && res.response.data && res.response.data.msg) {
            this.actionSetGlobalMessage({
              msg: res.response.data.msg
            });

            return;
          }
        });
    },
    submitByToken() {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;

      // 请输入钱包位址

      axios({
        method: "post",
        url: "/api/v1/c/ext/inpay",
        data: {
          api_uri: "/api/trade/v2/c/withdraw/bind_wallet_by_token",
          // bind_type: "deposit",
          wallet_gateway_id: 3, // 3 為CGpay
          wallet_account: this.formData["walletAddress"].value,
          wallet_token: this.formData["CGPPwd"].value
        }
      })
        .then(response => {
          const { result, msg } = response.data;

          this.isReceive = false;

          if (result !== "ok" || result === "error") {
            this.actionSetGlobalMessage({
              msg: msg
            });
            return;
          }

          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: () => {
              window.location.reload();
            }
          });
        })
        .catch(res => {
          this.isReceive = false;

          if (res.response && res.response.data && res.response.data.msg) {
            this.actionSetGlobalMessage({
              msg: res.response.data.msg
            });

            return;
          }
        });
    },
    verification(key, index) {
      let target = this.formData[key];
      // let lock = false;
      // if (key === "walletAddress" && this.walletType === "USDT") {
      //   this.actionVerificationFormData({
      //     target: "USDT-address",
      //     value: target.value
      //   }).then(val => {
      //     this.formData["walletAddress"].value = val;
      //   });
      // }

      if (key === "CGPPwd") {
        target.value = target.value
          .replace(" ", "")
          .trim()
          .replace(/[^0-9]/g, "");
      }
      // if (
      //   !this.selectTarget.virtualBank ||
      //   !this.formData["walletAddress"].value
      // ) {
      //   lock = true;
      // }
      // // 針對 CGpay
      // if (this.selectTarget.bank_id === 21 && !this.formData["CGPPwd"].value) {
      //   lock = true;
      // }
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable";

.popup {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.mask {
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.5);
}

.block {
  position: absolute;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fefefe;
  border-radius: 8px;
}

.content {
  min-height: 140px;
  padding: 0 20px;
  color: var(--slider_text_color);

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 700;
    padding: 12px 0 20px;
  }
}

.error-msg {
  margin-bottom: 0;
  font-size: 14px;
  color: #db6372;

  &.is-hide {
    opacity: 0;
  }
}

.info-item {
  margin-bottom: 5px;

  .input-title {
    font-size: 12px;
    line-height: 27px;
  }

  .input-wrap {
    height: 40px;

    > input,
    > textarea {
      height: 40px;
      width: 100%;
      border-radius: 5px;
      border: 1px solid #eee;
      padding: 10px;
      outline: none;
      resize: none;
    }
  }

  .icon-block {
    display: flex;
    justify-content: space-around;

    .item {
      width: 49%;
      height: 43px;
      display: inline-flex;
      align-items: center;
      border: 1px solid #eee;
    }

    img {
      width: 27px;
      height: 32px;
      margin: 0 5px;
    }
  }
}

.tips-text {
  color: #ffffff;
  padding: 20px 0;

  p {
    margin: 0 0 6px;
  }

  span {
    color: #6aaaf5;
    border-bottom: 1px solid #6aaaf5;
  }
}

.button-block {
  display: flex;
  text-align: center;
  padding: 15px 0;
  border-top: 2px solid #f9f9f8;
  font-size: 18px;
  color: var(--slider_text_color);

  span {
    flex: 1;

    &.submit {
      color: #e42a30;
    }

    &.disable {
      pointer-events: none;
    }
  }
}
</style>
