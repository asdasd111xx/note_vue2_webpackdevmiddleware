<template>
  <div>
    <template v-if="!qrcodeObj.isShow">
      <div :class="$style['popup']">
        <div :class="$style['mask']" />
        <div :class="$style['block']">
          <div :class="$style['content']">
            <div :class="$style['title']">{{ title }}</div>

            <p
              :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]"
            >
              {{ errorMsg }}
            </p>

            <div :class="$style['info-item']">
              <div :class="$style['input-title']">
                {{ formData["walletAddress"].title }}
              </div>

              <div :class="$style['input-wrap']">
                <input
                  v-model="formData['walletAddress'].value"
                  type="text"
                  :placeholder="formData['walletAddress'].placeholder"
                />
              </div>
            </div>

            <template v-if="walletType === 'CGP'">
              <div :class="$style['info-item']">
                <div :class="$style['input-title']">
                  {{ formData["cgpPwd"].title }}
                </div>

                <div :class="$style['input-wrap']">
                  <input
                    v-model="formData['cgpPwd'].value"
                    type="text"
                    :placeholder="formData['cgpPwd'].placeholder"
                  />
                </div>
              </div>

              <div :class="$style['tips-text']">
                <p>
                  ● 可使用输入或
                  <span @click="tipMethod(0)">扫码绑定</span>
                </p>

                <p>●<span @click="tipMethod(1)"> CGP是什么?</span></p>

                <!-- <p>●<span @click="tipMethod(2)"> 如何透过CGP存款?</span></p> -->

                <p>
                  ● 沒有CGP帐号?
                  <span @click="tipMethod(3)">立即申请</span>
                </p>
              </div>
            </template>
          </div>

          <div :class="$style['close']">
            <span @click="closeTips">取消</span>
            <span @click="submitByToken">送出</span>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- Qrcode Popup -->
      <popup-qrcode
        v-if="qrcodeObj.isShow"
        :isShowPop.sync="qrcodeObj.isShow"
        :paymentGatewayId="qrcodeObj.bank_id"
        :bindType="qrcodeObj.bind_type"
      />
    </template>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import popupQrcode from "@/router/mobile/components/common/virtualBank/popupQrcode";

export default {
  components: {
    popupQrcode
  },
  props: {
    walletType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      errorMsg: "",
      title: "",
      formData: {
        walletAddress: {
          title: "",
          value: "",
          placeholder: "必填"
        },
        cgpPwd: {
          title: "CGP安全防护码",
          value: "",
          placeholder: "必填"
        }
      },
      qrcodeObj: {
        isShow: false,
        bank_id: null,
        bind_type: "deposit"
      }
    };
  },
  computed: {
    showPopQrcode: {
      get() {
        return this.qrcodeObj.isShow;
      },
      set(value) {
        this.qrcodeObj.isShow = value;
      }
    }
  },
  watch: {
    "qrcodeObj.isShow"(value) {
      // 切換到 Qrcode 頁面，連同整個 popup 關掉
      if (!value) {
        this.closeTips();
      }
    }
  },
  created() {
    switch (this.walletType) {
      case "CGP":
        this.title = "绑定CGP";
        this.formData["walletAddress"].title = "CGP邮箱/手机号";
        this.qrcodeObj.bank_id = 21;
        break;

      default:
        break;
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    tipMethod(index) {
      switch (index) {
        case 0:
          this.qrcodeObj.isShow = true;
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
    closeTips() {
      this.$emit("close");
    },
    submitByToken() {
      // if (this.lockStatus) {
      //   return;
      // }

      this.lockStatus = true;
      this.errorMsg = "";

      axios({
        method: "post",
        url: "/api/v1/c/ext/inpay",
        data: {
          api_uri: "/api/trade/v2/c/withdraw/bind_wallet_by_token",
          bind_type: "deposit",
          wallet_gateway_id: 3, // 3 為CGpay
          wallet_account: this.formData["walletAddress"].value,
          wallet_token: this.formData["cgpPwd"].value
        }
      })
        .then(response => {
          const { result, msg, code } = response.data;
          // this.lockStatus = false;

          if (result !== "ok" || result === "error") {
            this.errorMsg = `${msg}[${code}]`;
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
          if (res.response && res.response.data && res.response.data.msg) {
            this.errorMsg = `${res.response.data.msg}[${res.response.data.code}]`;
            // this.lockStatus = false;
            return;
          }
        });
    },
    verification(key, index) {
      // let target = this.formData[key];
      // let lock = false;
      // if (key === "walletAddress") {
      //   target.value = target.value.replace(" ", "").trim();
      // }
      // if (key === "cgpPwd") {
      //   target.value = target.value
      //     .replace(" ", "")
      //     .trim()
      //     .replace(/[^0-9]/g, "");
      // }
      // if (
      //   !this.selectTarget.virtualBank ||
      //   !this.formData["walletAddress"].value
      // ) {
      //   lock = true;
      // }
      // // 針對 CGpay
      // if (this.selectTarget.bank_id === 21 && !this.formData["cgpPwd"].value) {
      //   lock = true;
      // }
      // // this.lockStatus = lock;
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
  min-height: 320px;
  padding: 0 20px;
  color: $main_text_color3;

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

    > input {
      height: 40px;
      width: 100%;
      border-radius: 5px;
      border: 1px solid #eee;
      padding: 0 10px;
      outline: none;
    }
  }
}

.tips-text {
  color: $main_text_color2;
  padding: 20px 0;

  p {
    margin: 0 0 6px;
  }

  span {
    color: #6aaaf5;
    border-bottom: 1px solid #6aaaf5;
  }
}

.close {
  display: flex;
  text-align: center;
  padding: 15px 0;
  border-top: 2px solid #f9f9f8;
  font-size: 18px;
  color: $main_text_color3;

  span {
    flex: 1;

    &:last-child {
      color: #e42a30;
    }
  }
}
</style>
