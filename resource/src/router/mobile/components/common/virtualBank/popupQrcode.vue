<template>
  <div v-if="isShowPop" :class="$style['pop-wrap']">
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
        <p @click="downloadImage">
          {{ downloadText }}
        </p>

        <div :class="$style['timer-block']">
          <div v-if="bindType === 'deposit' && paymentGatewayId === 37">
            入款前请先绑定钱包
          </div>

          <div>
            <span v-if="countdownSec">{{ countdownSec }}</span>
            {{
              themeTPL === "porn1" ? "秒后关闭视窗" : "秒后连结失效，并关闭视窗"
            }}
          </div>
        </div>

        <div :class="$style['tips']">
          <template v-if="paymentGatewayId === 21">
            <div>● 请使用CGPay内扫描器扫描二维码</div>
            <div>● 成功绑定钱包后，此视窗自动关闭</div>
            <div>
              ● 没有CGPay帐号?
              <span
                :class="$style['url']"
                @click="
                  () => {
                    if (themeTPL === 'porn1') {
                      openLink(
                        'https://cgpayintroduction.azurewebsites.net/index.aspx'
                      );
                    }
                    if (themeTPL === 'ey1') {
                      openLink('http://oinbox.io');
                    }
                  }
                "
                >立即申请</span
              >
            </div>
          </template>

          <template v-if="paymentGatewayId === 37">
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
        <span @click="$emit('update:isShowPop', false)">关闭</span>
        <span @click="downloadImage">{{ downloadText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import html2canvas from "html2canvas";
import { mapGetters, mapActions } from "vuex";
import downloadjs from 'downloadjs';

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
      if (this.paymentGatewayId === 37) {
        return "绑定购宝钱包";
      } else if (this.paymentGatewayId === 21) {
        return this.themeTPL === "porn1" ? "绑定CGPay" : "扫描绑定";
      }
    }
  },
  created() {
    this.getQrcode();
  },
  watch: {
    qrcodeLink(val) {
      if (val.includes('base64')) {
        this.downloadText = '长按下载图片';
      } else {
        this.downloadText = '点击截屏保存';
      }
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    getQrcode() {
      // walletGatewayId = 3 -> CGPay
      // walletGatewayId = 2 -> 購寶
      let id = null;
      let queryType = this.$route.query.redirect === "deposit" ? "deposit" : "";

      if (this.paymentGatewayId === 37) {
        id = 2;
      } else if (this.paymentGatewayId === 21) {
        id = 3;
      }

      axios({
        url: "/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/withdraw/bind_wallet",
        method: "get",
        params: {
          bind_type: queryType ? queryType : this.bindType,
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
      //   <a :href="qrcodeLink" :download="qrcodeLink" target="_blank">
      console.log(this.qrcodeLink);
      localStorage.setItem('download-item', this.qrcodeLink);

      if (this.qrcodeLink) {
        downloadjs(this.qrcodeLink, 'qrcode.gif', 'img/gif');
        if (this.qrcodeLink.includes('base64')) {
          let w = window.open(`${window.location.host}/download.html`);
          //   let a = document.createElement('a');
          //   a.download = 'qrcode.png';
          //   a.target = "_blank";
          //   a.href = this.qrcodeLink;

          //   a.style.display = 'none';
          //   document.body.appendChild(a);

          //   setTimeout(() => {
          //     a.click();
          //     document.body.removeChild(a);
          //   }, 300)

          //   html2canvas(this.$refs["qrcodeRef"], {
          //     allowTaint: false,
          //     useCORS: true
          //   }).then(canvas => {
          //     let link = document.createElement("a");
          //     link.href = canvas.toDataURL("image/png");
          //     link.setAttribute("download", "qrcode.png");
          //     link.style.display = "none";
          //     document.body.appendChild(link);
          //     link.click();
          //   });
        }
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
