<template>
  <transition name="fade">
    <div
      v-show="isShow && data"
      :class="[$style['notification-wrap'], { [$style['close']]: !isShow }]"
      @click.stop="handleClick"
    >
      <div :class="$style['container']">
        <div :class="$style['notification-header']">
          <div :class="$style['icon']">
            <img
              :src="
                `/static/image/${siteConfig.MOBILE_WEB_TPL}/common/appicon.png`
              "
            />
          </div>
          <div :class="$style['title']">
            {{ siteName }}
          </div>
          <div :class="$style['time']">
            {{ getTime(data.id) }}
          </div>
        </div>
        <div
          :class="[
            $style['notification-content'],
            { [$style['maintain']]: data.event === 'maintain_notice' }
          ]"
        >
          <div
            v-if="data.event === 'maintain_notice'"
            :class="$style['maintain-icon']"
          >
            <img
              :src="
                `/static/image/${siteConfig.MOBILE_WEB_TPL}/common/icon_maintain.png`
              "
            />
          </div>
          <div v-html="getText(data.content)"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Vue from "vue";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default {
  data() {
    return {
      lang: {
        C_WS_DEPOSIT: "您的款项已入帐，请前往查看",
        C_WS_WITHDRAW: "您的取款已完成，请前往查看",
        C_WS_REBATE: "您的返水已入帐，请前往查看",
        C_WS_ACTIVITY: "您有 1 笔优惠已入帐，请前往查看",
        C_WS_INBOX: "您有 1 封新的站内信，请前往查看",
        COMMON_MAINTAIN_NOTICE:
          "网站系统公告\n网站即将进行系统维护，如有不便之处，敬请见谅 !\n" +
          "预计完成 :\n美东时间 %s\n北京时间 %s\n於 %s 分钟後开始",
        C_WS_FEEDBACK_REPLY: "您有1封新的回覆信件，请前往查看",
        C_WS_WAGE: "您的返利已入帐，请前往查看",
        C_WS_RECYCLE_FAIL: "额度无法转移，请稍后再试",
        C_WS_RECYCLE_ALL_FAIL: "额度无法转移，请稍后再试",
        C_WS_RECYCLE_OK: "一键回收完成"
      },
      msgType: [
        "player_deposit",
        "player_withdraw",
        "player_rebate",
        "player_activity",
        "player_inbox",
        "all_player_inbox",
        "player_feedback_reply",
        "player_wage",
        "player_wage_self"
      ],
      data: {},
      isShow: false,
      closeTimer: null,
      noticeQueue: [],
      timestamp: ""
    };
  },
  created() {
    // 測試訊息
    // setTimeout(() => {
    //   this.show();
    //   this.data = {
    //     content: "maintain_notice",
    //     event: "maintain_notice",
    //     message: {
    //       countdown: 978
    //     },
    //     id: new Date()
    //   };
    // }, 1500);
  },
  watch: {
    noticeQueue() {
      if (this.noticeQueue && this.noticeQueue.length > 0 && !this.isShow) {
        const target = this.noticeQueue[0];
        this.data = target;
        switch (target.showType) {
          case "showToast":
            this.showToast(`${target.showContent}`);
            break;

          case "show":
          default:
            this.show();
            break;
        }
      }
    },
    noticeData() {
      if (this.noticeData && this.noticeData.length > 0) {
        let _noticeData = this.noticeData.slice();
        let temp = _noticeData[this.noticeData.length - 1];
        this.noticeData.pop();

        if (temp.extend && temp.extend === "verification_code") {
          return;
        }

        const event = temp.event;
        console.log(Date.now());
        switch (event) {
          case "notice":
            if (this.lang[temp.content]) {
              switch (temp.content) {
                case "C_WS_RECYCLE_FAIL":
                  this.noticeQueue.push({
                    ...temp,
                    timestamp: Date.now(),
                    showType: "showToast",
                    showContent: `${temp.vendorName["zh-cn"]}${
                      this.lang[temp.content]
                    }`
                  });
                  return;
                case "C_WS_RECYCLE_ALL_FAIL":
                  this.noticeQueue.push({
                    ...temp,
                    timestamp: Date.now(),
                    showType: "showToast",
                    showContent: `${this.lang[temp.content]}`
                  });
                  return;
                case "C_WS_RECYCLE_OK":
                  this.noticeQueue.push({
                    ...temp,
                    timestamp: Date.now(),
                    showType: "showToast",
                    showContent: `${this.lang[temp.content]}`
                  });
                  return;
                default:
                  this.noticeQueue.push({
                    ...temp,
                    timestamp: Date.now(),
                    showType: "show"
                  });
                  return;
              }
            } else {
              this.$emit("close");
            }
            return;

          // 外接平台維護通知
          // case 'outer_maintain':
          case "maintain_notice":
          case "verification_code":
          case "service_maintain_notice":
            this.noticeQueue.push({
              ...temp,
              timestamp: Date.now(),
              showType: "show"
            });
            return;

          default:
            return;
        }
      }

      // event: "maintain_notice"
      // message:
      // content: "COMMON_MAINTAIN_NOTICE"
      // countdown: 1
      // end_at: "2020-06-19T17:05:00+0800"
      // start_at: "2020-06-19T17:00:00+0800"
      // text: "网站系统公告↵网站即将进行系统维护，如有不便之处，敬请见谅 !↵预计完成 :↵美东时间 %s↵北京时间 %s↵於 %s 分钟後开始"
      // type: "c_domain_maintain"

      //   if (this.noticeData.length > 4) {
      //     const resultMsg = cloneDeep(this.noticeData);
      //     resultMsg.splice(0, 1);
      //     this.actionNoticeData(resultMsg);
      //   }
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus",
      noticeData: "getNoticeData"
    }),
    siteName() {
      return this.siteConfig.SITE_NAME;
    }
  },
  methods: {
    ...mapActions(["actionNoticeData", "actionSetGlobalMessage"]),
    handleClick() {
      let content = this.data.content;
      localStorage.setItem("click-notification", 1);

      switch (content) {
        case "C_WS_FEEDBACK_REPLY":
          this.$router.push("/mobile/mcenter/feedback/feedbackList");
          break;
        case "C_WS_INBOX":
        default:
          this.$router.push("/mobile/mcenter/information");
          break;
        case "C_WS_DEPOSIT":
        case "C_WS_WITHDRAW":
        case "C_WS_REBATE":
        case "C_WS_ACTIVITY":
        case "C_WS_WAGE":
          this.$router.push("/mobile/mcenter/wallet");
          break;

        case "C_WS_SERVICE_MAINTAIN":
          break;
      }
    },
    show() {
      this.isShow = true;
      this.closeTimer = setTimeout(() => {
        this.isShow = false;
        setTimeout(() => {
          this.$emit("close");
          this.noticeQueue = this.noticeQueue.filter(
            i => i.timestamp !== this.data.timestamp
          );
          clearTimeout(this.closeTimer);
          this.closeTimer = null;
        }, 150);
      }, 3150);
    },
    getTime(string) {
      return format(new Date(), "E aaa hh:mm", { locale: zhCN });
    },
    getText(key) {
      const event = this.data.event;
      let string = "";
      switch (event) {
        case "maintain_notice":
          string = `即将进行系统维护 <br /> 于<span>${this.data.countdown}</span>分钟后开始`;
          return string;

        case "verification_code":
          string = `验证码:${this.data.code}，效期10分钟，仅能够使用一次，感谢支持!`;
          return string;

        case "service_maintain_notice":
          const type =
            this.data.service === "player_deposit_and_withdraw"
              ? "存款与取款"
              : this.data.service === "player_withdraw"
              ? "取款"
              : "";
          string = `即将进行 ${type}功能 维护，于 <span style="color: red;">${this.data.countdown}</span> 分钟后开始`;
          return string;

        default:
          return this.lang[key]
            ? this.lang[key]
            : "您有 1 封新的站内信，请前往查看";
      }
    },
    showToast(message) {
      this.actionSetGlobalMessage({
        msg: message,
        cb: () => {
          this.noticeQueue.pop();
        }
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.notification-wrap {
  &.close {
    animation: slide-up 1s forwards;
  }

  position: absolute;
  top: 0;
  height: 70px;
  z-index: 501;
  width: 100%;
  padding: 5px 2%;
  max-width: $mobile_max_width;
  animation: slide-down 1s forwards;
  opacity: 1;
  -webkit-opacity: 1;
  animation-timing-function: forwards;
  -webkit-animation-timing-function: forwards;
}

.container {
  width: 100%;
  // height: 70px;
  color: white;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.6);
}

.notification-header {
  display: flex;
  align-items: center;
  padding: 10px 10px 5px 10px;
  position: relative;
  height: 35px;
  line-height: 35px;

  .title {
    margin-left: 5px;
  }

  .icon {
    width: 24px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .time {
    position: absolute;
    right: 10px;
  }
}

.notification-content {
  display: flex;
  min-height: 35px;
  line-height: 25px;
  width: 100%;
  padding: 0 10px;
  align-items: center;

  &.maintain {
    width: 80%;
  }

  .maintain-icon {
    width: 30px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  span {
    color: #ff4c4c;
  }
}

// .dialog /deep/ div {
//   background-color: rgba($color: #161616, $alpha: 0.8);
//   border-radius: 10px;
//   margin-left: auto;
//   margin-right: auto;
//   max-width: 200px;
//   padding: 15px;
//   color: white;
// }

@media (orientation: landscape) {
  .notification-wrap {
    max-width: 768px !important;
  }
}

@keyframes slide-down {
  0% {
    opacity: 0;
    top: -140px;
  }

  100% {
    opacity: 1;
    top: 0;
  }
}

@-webkit-keyframes slide-down {
  0% {
    opacity: 0;
    top: -140px;
  }

  100% {
    opacity: 1;
    top: 0;
  }
}

@keyframes slide-up {
  0% {
    opacity: 1;
    top: 0;
  }

  100% {
    opacity: 0;
    top: -140px;
  }
}

@-webkit-keyframes slide-up {
  0% {
    opacity: 1;
    top: 0;
  }

  100% {
    opacity: 0;
    top: -140px;
  }
}
</style>
