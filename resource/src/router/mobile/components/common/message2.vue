<template>
  <transition name="fade">
    <div v-show="isShow && msg" class="dialog">
      <div v-html="msg" />
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { setCookie } from "@/lib/cookie";

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
      msg: "",
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
          case "upgrade":
            this.msg = "升级中";
            break;
          case "incoming":
            this.msg = "正在上线 敬请期待";
            break;
          case "bindcard":
            this.msg = "请先绑定提现银行卡";
            break;
          case "bindVirtualBank":
            this.msg = "请先绑定电子钱包";
            break;
          case "balanceTrans":
            this.msg = "请先设定提现资料";
            break;
          case "login":
            this.msg = "请先登入";
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
      globalMessage: "getGlobalMessage",
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.actionSetGlobalMessage(null);
    this.$emit("close");
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    clearMsg() {
      if (this.globalMessage) {
        const msgObj = this.globalMessage;

        if (process.env.NODE_ENV === "development") {
          console.log(
            "msg:",
            msgObj.msg,
            " origin:",
            msgObj.origin,
            " code:",
            msgObj.code
          );
        }

        const code = String(msgObj.code);
        const callback = msgObj.cb;
        const redirect = msgObj.origin;

        this.actionSetGlobalMessage(null);

        if (callback) {
          callback();
          return;
        }

        switch (code) {
          // 充值
          case "C50101": // 轉帳需首充 暫時
          case "C50100":
          case "C650018":
          // 只需充值一次 开通转让功能
          case "recharge_deposit":
            this.$router.push(
              `/mobile/mcenter/deposit?redirect=${redirect ? redirect : "home"}`
            );
            break;

          // 只需提现一次 开通转让功能
          case "C650023":
          case "recharge_withdraw":
            this.$router.push(`/mobile/mcenter/withdraw`);
            break;

          // 銀行卡
          case "C50099":
          case "C150099":
          case "C50102":
          case "C650003":
          case "bindcard":
            this.$router.push(
              `/mobile/mcenter/bankCard?redirect=${
                redirect ? redirect : "home"
              }&type=bankCard`
            );
            break;

          // 電子錢包
          case "C50103":
          case "C50105":
          case "bindVirtualBank":
            if (["porn1", "sg1"].includes(this.themeTPL)) {
              this.$router.push(
                `/mobile/mcenter/bankCard?redirect=${
                  redirect ? redirect : "home"
                }&type=bankCard`
              );
            } else {
              // 億元
              this.$router.push(
                `/mobile/withdrawAccount?redirect=${
                  redirect ? redirect : "home"
                }`
              );
            }
            break;

          // 重新登入
          case "M00001":
          // 停權
          case "C600001":
          case "C50029":
          case "C50062":
          case "TM020058":
          case "TM020059":
          case "TM020060":
          // cid 失效
          case "C150100":
          case "77700036":
            setCookie("cid", "");
            setCookie("y_token", "");
            setCookie("aid", "");
            this.$router.push("/mobile/login");
            break;

          // 維護
          case "M00002":
            window.location.reload();
            break;

          // 提現資料補齊
          case "C50104":
          case "C50106":
          case "C590029":
          case "C50107":
          case "C50108":
            // 请先设定提现资料
            localStorage.setItem("form-withdraw-account", true);
            this.$router.push(
              `/mobile/withdrawAccount?redirect=${redirect ? redirect : "home"}`
            );
            break;

          // 充值/提現相關，有開維護
          case "M00009":
            this.$router.push("/mobile/mcenter");
            break;

          default:
            break;
        }

        this.$emit("close");
      }
    }
  }
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
  left: 0;
  top: 0;
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}

.dialog > div:first-child {
  background-color: rgba($color: #161616, $alpha: 0.8);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 12px;
  color: white;
  max-width: 65vw;
  width: max-content;
  color: white;
  text-align: center;
}
</style>
