<template>
  <div v-if="isShowPop" :class="$style['pop-wrap']">
    <div :class="$style['pop-mask']" />
    <div :class="$style['pop-block']">
      <div :class="$style['content']">
        <div :class="$style['title']">{{ title }}</div>

        <div :class="$style['qrcode-img']">
          <!-- <qrcode
            :value="qrcodeLink"
            :options="{ width: 75, margin: 1 }"
            tag="img"
          /> -->
        </div>
        <p>长按下载图片</p>

        <div :class="$style['timer']">{{ timer }}秒后连结失败，并关闭视窗</div>

        <div :class="$style['tips']">
          <template v-if="walletId === 37">
            <div>● 请使用CGPay内扫描器扫描二維碼</div>
            <div>● 成功绑定钱包后，此视窗自动关闭</div>
            <div>● 没有CGPay帐号?<span>立即申请</span></div>
          </template>

          <template v-if="walletId === 21">
            <div>● 请使用扫描器扫描二維碼</div>
            <div>● 成功绑定钱包后，此视窗自动关闭</div>
          </template>
        </div>
      </div>

      <div :class="$style['button-block']">
        <span @click="$emit('update:isShowPop', false)">关闭</span>
        <span>长按下载图片</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import bbosRequest from "@/api/bbosRequest";
import { mapGetters } from "vuex";

export default {
  props: {
    isShowPop: {
      type: Boolean,
      require: true
    },
    walletId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      timer: 60,
      qrcodeLink: ""
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    title() {
      if (this.walletId === 37) {
        return "绑定购宝钱包";
      } else if (this.walletId === 21) {
        return "扫描绑定";
      }
    }
  },
  created() {
    console.log(this.walletId);
    this.getQrcode();
  },
  methods: {
    // walletGatewayId = 3 ---> CGPay ??
    // 購寶 id ?
    getQrcode() {
      bbosRequest({
        url: this.siteConfig.BBOS_DOMIAN + "/Ext/V2/Withdraw/Bind/Wallet",
        method: "get",
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: {
          bindType: "withdraw",
          walletGatewayId: 3,
          lang: "zh-cn"
        }
      }).then(res => {
        console.log(res);
      });
    }
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
  width: 85%;
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
    width: 83px;
    height: 83px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  > p {
    font-size: 12px;
    margin: 8px 0;
  }

  .timer {
    color: $main_error_color1;
  }

  .tips {
    padding: 16px 0;
    text-align: left;
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
