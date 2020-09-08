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

        <div :class="$style['notification-content']">
          {{ getText(data.content) }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue';

export default {
  data() {
    return {
      lang: {
        'C_WS_DEPOSIT': '您的款项已入帐，请前往查看',
        'C_WS_WITHDRAW': '您的取款已完成，请前往查看',
        'C_WS_REBATE': '您的返水已入帐，请前往查看',
        'C_WS_ACTIVITY': '您有 1 笔优惠已入帐，请前往查看',
        'C_WS_INBOX': '您有 1 封新的站内信，请前往查看',
        'COMMON_MAINTAIN_NOTICE': '网站系统公告\n网站即将进行系统维护，如有不便之处，敬请见谅 !\n'
          + '预计完成 :\n美东时间 %s\n北京时间 %s\n於 %s 分钟後开始',
        'C_WS_FEEDBACK_REPLY': '您有1封新的回覆信件，请前往查看',
        'C_WS_WAGE': '您的返利已入帐，请前往查看',
      },
      msgType: [
        'player_deposit',
        'player_withdraw',
        'player_rebate',
        'player_activity',
        'player_inbox',
        'all_player_inbox',
        'player_feedback_reply',
        'player_wage',
        'player_wage_self'
      ],
      data: {},
      isShow: false,
      closeTimer: null
    };
  },
  created() {
    // 測試訊息
    // setInterval(() => {
    //   this.show();
    //   this.data = {
    //     content: "123",
    //     id: new Date()
    //   }
    // }, 2500)
  },
  watch: {
    noticeData() {
      if (this.noticeData && this.noticeData.length > 0) {
        // this.data = this.noticeData.pop();
        this.data = this.noticeData[this.noticeData.length - 1];

        // 目前只接通知
        if (this.data.event === ("notice")) {
          this.show();
        }

        if (this.data.event === ("maintain_notice")) {
          this.show();
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
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
      noticeData: 'getNoticeData',
    }),
    siteName() {
      return this.siteConfig.SITE_NAME;
    }
  },
  methods: {
    ...mapActions([
      'actionNoticeData'
    ]),
    handleClick() {
      let content = this.data.content;
      switch (content) {
        case 'C_WS_INBOX':
        case 'C_WS_FEEDBACK_REPLY':
        default:
          this.$router.push('/mobile/mcenter/information');
          break;
        case 'C_WS_DEPOSIT':
        case 'C_WS_WITHDRAW':
        case 'C_WS_REBATE':
        case 'C_WS_ACTIVITY':
        case 'C_WS_WAGE':
          this.$router.push('/mobile/mcenter/wallet');
          break;
      }
    },
    show() {
      this.isShow = true;
      this.closeTimer = setTimeout(() => {
        this.isShow = false;
        setTimeout(() => {
          this.$emit('close');
          clearTimeout(this.closeTimer);
          this.closeTimer = null;
        }, 800);
      }, 3000);
    },
    getTime(string) {
      return Vue.moment(string).format("llll");
    },
    getText(key) {
      if (this.data.event === ("maintain_notice")) {
        let string = `网站系统公告\n网站即将进行系统维护，如有不便之处，敬请见谅 !`
        return string;
      }
      return this.lang[key] ? this.lang[key] : "您有 1 封新的站内信，请前往查看"
    },
    deleMsg(id) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
      this.isShow = false;
      setTimeout(() => {
        this.$emit('close');
      }, 300);

      //   const resultMsg = cloneDeep(this.noticeData);
      //   const index = resultMsg.findIndex((data) => data.id === id);
      //   resultMsg.splice(index, 1);
      //   this.actionNoticeData(resultMsg);
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
  height: 70px;
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
  height: 35px;
  line-height: 35px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
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
