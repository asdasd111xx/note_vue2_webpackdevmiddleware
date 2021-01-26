<template>
  <div :class="$style['pop-wrap']">
    <div :class="$style['pop-mask']" />
    <div v-if="qrcodeLink" :class="$style['pop-block']">
      <div :class="$style['content']">
        <div :class="$style['title']">{{ title }}</div>

        <div :class="$style['qrcode-img']">
          <template v-if="qrcodeLink">
            <img
              @click="downloadImage"
              ref="qrcodeRef"
              :src="qrcodeLink"
              alt="qrcode"
            />
          </template>
        </div>
        <span @click="downloadImage('')">
          {{ downloadText }}
        </span>

        <div :class="$style['timer-block']">
          <div>
            <span v-if="countdownSec">{{ countdownSec }}</span>
            {{
              ["porn1", "sg1"].includes(themeTPL) || bindType === "deposit"
                ? "秒后关闭视窗"
                : "秒后连结失效，并关闭视窗"
            }}
          </div>
        </div>

        <div :class="$style['tips']">
          <template v-if="virtualBankId === 21">
            <div>● 请使用CGPay内扫描器扫描二维码</div>
            <div>● 成功绑定钱包后，此视窗自动关闭</div>
            <div>
              ● 没有CGPay帐号?
              <span :class="$style['url']" @click="goToCGPBinding()"
                >立即申请</span
              >
            </div>
          </template>

          <template v-if="virtualBankId === 37">
            <div>● 请使用扫描器扫描二维码</div>
            <div>● 成功绑定钱包后，此视窗自动关闭</div>
            <div>
              ● 没有购宝钱包帐号?
              <span
                :class="$style['url']"
                @click="openLink('https://www.gamewallet.asia/')"
                >立即申请</span
              >
            </div>
          </template>
        </div>
      </div>

      <div :class="$style['button-block']">
        <span @click="closePopup">关闭</span>
        <span @click="downloadImage">
          {{ downloadText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import html2canvas from "html2canvas";
import { mapGetters, mapActions } from "vuex";
import { saveAs } from "file-saver";

export default {
  props: {
    virtualBankId: {
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
      qrcodeLink: "",
      downloadText: ""
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    title() {
      if (this.virtualBankId === 37) {
        return "绑定购宝钱包";
      } else if (this.virtualBankId === 21) {
        return "绑定CGPay";
      }
    }
  },
  created() {
    this.getQrcode();
  },
  watch: {
    qrcodeLink(val) {
      if (val.includes("base64")) {
        this.downloadText = "长按下载图片";
      } else {
        this.downloadText = "点击截屏保存";
      }
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    closePopup() {
      this.$emit("close");
    },
    getQrcode() {
      // walletGatewayId = 3 -> CGPay
      // walletGatewayId = 2 -> 購寶
      let id = null;
      let queryType = this.$route.query.redirect === "deposit" ? "deposit" : "";

      if (this.virtualBankId === 37) {
        id = 2;
      } else if (this.virtualBankId === 21) {
        id = 3;
      }

      axios({
        url: "/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/withdraw/bind_wallet",
        method: "get",
        params: {
          bind_type: queryType ? queryType : this.bindType,
          wallet_gateway_id: id
        }
      })
        .then(res => {
          const { result, ret } = res.data;
          if (result !== "ok") {
            this.actionSetGlobalMessage({ msg: res.data.msg });

            setTimeout(() => {
              this.closePopup();
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
                this.closePopup();
                return;
              }
              this.countdownSec -= 1;
            }, 1000);
          }
        })
        .catch(error => {
          this.actionSetGlobalMessage({ msg: error.response.data.msg });
          this.closePopup();
        });
    },
    openLink(url) {
      window.open(url);
    },
    downloadImage(target) {
      //   <a :href="qrcodeLink" :download="qrcodeLink" target="_blank">
      console.log(this.qrcodeLink);
      localStorage.setItem("download-item", this.qrcodeLink);

      if (this.qrcodeLink) {
        function dataURItoBlob(dataURI) {
          // convert base64 to raw binary data held in a string
          // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
          var byteString = atob(dataURI.split(",")[1]);

          // separate out the mime component
          var mimeString = dataURI
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];

          // write the bytes of the string to an ArrayBuffer
          var ab = new ArrayBuffer(byteString.length);

          // create a view into the buffer
          var ia = new Uint8Array(ab);

          // set the bytes of the buffer to the correct values
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          // write the ArrayBuffer to a blob, and you're done
          var blob = new Blob([ab], { type: mimeString });

          return blob;
        }

        if (this.qrcodeLink.includes("base64")) {
          let blob = dataURItoBlob(this.qrcodeLink);
          console.log("blob:", blob);
          let type = "png";
          if (blob.type && blob.type.split("/")) {
            type = blob.type.split("/")[1];
          }

          saveAs(blob, `qrcode.${type}`);
          return;
        } else {
          let a = document.createElement("a");
          a.download = "qrcode.gif";
          a.target = "_parent";
          a.href = this.qrcodeLink;

          a.style.display = "none";
          document.body.appendChild(a);

          setTimeout(() => {
            a.click();
            document.body.removeChild(a);
          }, 300);

          return;
        }
      }
    },
    goToCGPBinding() {
      if (["porn1", "sg1"].includes(this.themeTPL)) {
        this.openLink("https://cgpayintroduction.azurewebsites.net/index.aspx");
      }
      if (["ey1"].includes(this.themeTPL)) {
        this.openLink("http://oinbox.io");
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style
  lang="scss"
  src="./css/porn1.popupQrcode.module.scss"
  module="$style_porn1"
></style>

<style
  lang="scss"
  src="./css/ey1.popupQrcode.module.scss"
  module="$style_ey1"
></style>

<style
  lang="scss"
  src="./css/sg1.popupQrcode.module.scss"
  module="$style_sg1"
></style>
