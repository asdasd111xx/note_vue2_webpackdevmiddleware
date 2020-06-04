<template>
  <transition name="fade">
    <div
      v-show="isShow"
      :class="[$style['notification-wrap'], { [$style['close']]: !isShow }]"
    >
      <div :class="$style['container']">
        <div :class="$style['notification-header']">
          <div :class="$style['icon']">
            <img src="/static/image/_new/about/appicon.png" />
          </div>
          <div :class="$style['title']">
            鸭脖视频
          </div>
          <div :class="$style['time']">
            {{ data.time }}
          </div>
        </div>

        <div :class="$style['notification-content']">
          {{ data.text }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      data: {},
      isShow: true
    };
  },
  created() {
    this.isShow = false;
    this.data = {
      time: new Date().toISOString(),
      text: ""
    }
    setTimeout(() => {
      this.isShow = false;
      setTimeout(() => {
        this.$emit('close');
      }, 300);
    }, 2000);
  },
  watch: {
    noticeData() {
      console.log(this.noticeData)
    }
  },
  methods: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
      noticeData: 'getNoticeData'
    }),
  },
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

  .close {
    animation: slide-up 1s forwards;
  }
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
