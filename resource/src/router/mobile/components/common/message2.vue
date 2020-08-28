<template>
  <transition name="fade">
    <div v-show="isShow && msg" class="dialog">
      <div v-html="msg" />
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { setCookie } from '@/lib/cookie';

export default {
  props: {
    callback: {
      type: Function,
      default: null
    },
    msgObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isShow: false,
      msg: '',
      timer: null
    };
  },
  created() {
    if (this.msgObj) {
      if (this.msgObj.msg) {
        this.msg = this.msgObj.msg;
      }

      if (this.msgObj.type) {
        const type = this.msgObj.type;
        switch (type) {
          case "incoming":
            this.msg = "正在上线 敬请期待"
            break;
          case "bindcard":
            this.msg = "请先绑定提现银行卡"
            break;
          case "bindVirtualBank":
            this.msg = "请先绑定电子钱包"
            break;
          case "balanceTrans":
            this.msg = "请先完成提现信息"
            break;
          case "login":
            this.msg = "请先登入"
            break;

          default:
            this.msg = type;
            break;
        }
      }
    }

    this.isShow = true;
    this.timer = setTimeout(() => {
      this.isShow = false;
      setTimeout(() => {
        this.clearMsg();
      }, 300);
    }, 2000);
  },
  computed: {
    ...mapGetters({
      globalMessage: 'getGlobalMessage',
      siteConfig: 'getSiteConfig',
    }),
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.actionSetGlobalMessage(null);
    this.$emit('close');
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    clearMsg() {
      if (this.globalMessage) {
        const msgObj = this.globalMessage;

        if (process.env.NODE_ENV === "development") {
          console.log("msg:", msgObj.msg, " origin:", msgObj.origin, " code:", msgObj.code)
        }

        const code = msgObj.code;
        const callback = msgObj.cb;
        const redirect = msgObj.origin;

        this.actionSetGlobalMessage(null);

        if (callback) {
          callback();
          return;
        }

        switch (code) {
          // 充值
          case "C50101":  // 轉帳需首充 暫時
          case "C50100":
          // 只需充值一次 开通转让功能
          case "recharge_deposit":
            this.$router.push(`/mobile/mcenter/deposit?redirect=${redirect ? redirect : 'home'}`);
            break;
          // 銀行卡
          case "C50099":
          case "C50102":
          case "bindcard":
            this.$router.push(`/mobile/mcenter/bankCard?redirect=${redirect ? redirect : 'home'}&type=bankCard`);
            break;
          // 電子錢包
          case "C50103":
          case "bindVirtualBank":
            this.$router.push(`/mobile/mcenter/bankCard?redirect=${redirect ? redirect : 'home'}&type=virtualBank`)
            break;
          // 重新登入
          case "M00001":
            setCookie('cid', '');
            setCookie('y_token', '');
            setCookie('aid', '');
            this.$router.push('/mobile/login');
            break;
          case "C50104":
          case "C50106":
            if (this.siteConfig.MOBILE_WEB_TPL === "ey1") {
              this.$router.push('/mobile/withdrawAccount');
            } else {
              this.$router.push('/mobile/mcenter/accountData');
            }
            break;
          default:
            break;
        }

        this.$emit('close');
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.dialog {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
}

.dialog /deep/ div {
  background-color: rgba($color: #161616, $alpha: 0.8);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  //   min-width: 200px;
  padding: 15px;
  color: white;
}
</style>
