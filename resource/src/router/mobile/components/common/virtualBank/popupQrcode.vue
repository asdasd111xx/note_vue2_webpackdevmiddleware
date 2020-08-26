<template>
  <div v-if="isShowPop" :class="$style['pop-wrap']">
    <div :class="$style['pop-mask']" />
    <div :class="$style['pop-block']">
      <div :class="$style['content']">
        <div :class="$style['title']">{{ title }}</div>

        <div :class="$style['qrcode-img']">
          <template v-if="qrcodeLink">
            <img ref="qrcodeRef" :src="qrcodeLink" alt="qrcode" />
          </template>
        </div>
        <p>长按下载图片</p>

        <div :class="$style['timer-block']">
          <div v-if="bindType === 'deposit' && paymentGatewayId === 37">
            入款前请先绑定钱包
          </div>

          <div>
            <span v-if="countdownSec">{{ countdownSec }}</span>
            秒后连结失效，并关闭视窗
          </div>
        </div>

        <div :class="$style['tips']">
          <template v-if="paymentGatewayId === 21">
            <div>● 请使用CGPay内扫描器扫描二维码</div>
            <div>● 成功绑定钱包后，此视窗自动关闭</div>
            <div>
              ● 没有CGPay帐号?
              <span :class="$style['url']" @click="openLink('http://oinbox.io')"
                >立即申请</span
              >
            </div>
          </template>

          <template v-if="paymentGatewayId === 37">
            <div>● 请使用扫描器扫描二維碼</div>
            <div>● 成功绑定钱包后，此视窗自动关闭</div>
          </template>
        </div>
      </div>

      <div :class="$style['button-block']">
        <span @click="$emit('update:isShowPop', false)">关闭</span>
        <span @click="downloadImage">长按下载图片</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import html2canvas from "html2canvas";
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    isShowPop: {
      type: Boolean,
      require: true
    },
    paymentGatewayId: {
      type: Number,
      require: true
    },
    bindType: {
      type: String,
      default: "withdraw"
    }
  },
  data() {
    return {
      countdownSec: 0,
      timer: null,
      qrcodeLink: ""
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    title() {
      if (this.paymentGatewayId === 37) {
        return "绑定购宝钱包";
      } else if (this.paymentGatewayId === 21) {
        return "扫描绑定";
      }
    }
  },
  created() {
    this.getQrcode();
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    getQrcode() {
      // walletGatewayId = 3 -> CGPay
      // walletGatewayId = 2 -> 購寶
      let id = null;
      if (this.paymentGatewayId === 37) {
        id = 2;
      } else if (this.paymentGatewayId === 21) {
        id = 3;
      }

      axios({
        url: "/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/withdraw/bind_wallet",
        method: "get",
        params: {
          bind_type: this.bindType,
          wallet_gateway_id: id
        }
      }).then(res => {
        const { result, ret } = res.data;
        if (result !== "ok") {
          this.actionSetGlobalMessage({ msg: res.data.msg });

          setTimeout(() => {
            this.$emit("update:isShowPop", false);
          }, 3000);
          return;
        }
        this.countdownSec = ret.expire_at;
        this.qrcodeLink = ret.url;

        if (this.countdownSec) {
          this.timer = setInterval(() => {
            if (this.countdownSec === 0) {
              clearInterval(this.timer);
              this.timer = null;
              this.$emit("update:isShowPop", false);
              return;
            }
            this.countdownSec -= 1;
          }, 1000);
        }
      });
    },
    openLink(url) {
      window.open(url);
    },
    downloadImage() {
      if (this.qrcodeLink) {
        html2canvas(this.$refs["qrcodeRef"], {
          allowTaint: false,
          useCORS: true
        }).then(canvas => {
          let link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.setAttribute("download", "qrcode.png");
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
        });
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.pop-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.pop-mask {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
}

.pop-block {
  position: absolute;
  width: 75%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: $main_white_color1;
  border-radius: 8px;
}

.content {
  padding: 17px 18px;
  color: $main_text_color2;
  text-align: center;

  .title {
    color: $main_text_color3;
    font-size: 18px;
    font-weight: 700;
  }

  .qrcode-img {
    position: relative;
    margin: 0 auto;
    margin-top: 10px;
    min-height: 80px;

    img {
      width: 80px;
      height: 80px;
      vertical-align: middle;
    }
  }

  > p {
    font-size: 12px;
    margin: 6px 0;
  }

  .timer-block {
    div {
      margin-bottom: 5px;
    }

    color: $main_error_color1;
  }

  .tips {
    padding: 13px 0;
    text-align: left;
  }

  .url {
    color: #6aaaf5;
    text-decoration: underline;
  }
}

.button-block {
  position: relative;
  display: flex;
  height: 50px;
  align-items: center;
  border-top: 1px solid #f7f8fb;

  &::after {
    content: "";
    position: absolute;
    width: 3px;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #f7f8fb;
  }

  span {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 700;

    &:nth-child(2) {
      color: #e42a30;
    }
  }
}
</style>
