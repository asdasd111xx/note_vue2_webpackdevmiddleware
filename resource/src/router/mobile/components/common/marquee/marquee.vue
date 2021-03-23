<template>
  <div class="news-wrap">
    <div class="news-icon">
      <img
        :src="$getCdnPath(`/static/image/${themeTPL}/common/icon_news.png`)"
      />
    </div>

    <div
      ref="container"
      :class="[
        'news-content',
        `${themeTPL}`,
        { notHome: !isDepositOrWithdraw }
      ]"
    >
      <div
        ref="news"
        class="news-content-text"
        :style="`left: ${currentLeft}px;`"
      >
        <span
          class="title-item"
          v-for="(item, index) in newsTitleList"
          :key="index"
          @click="handleClick()"
          v-html="item.title.replace(/<br>/g, '')"
        />
      </div>
    </div>

    <template v-if="showPopStatus.isShow">
      <!-- 跑馬燈內容彈窗 -->
      <popup
        v-if="showPopStatus.type === 'popup'"
        :list="newslist"
        :origin="origin"
        :isFirstShow="isFirstShow"
        @close="togglePopup"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import popup from "./popup/popup";

export default {
  components: {
    popup
  },
  props: {
    list: {
      type: Array,
      default: []
    },
    titleList: {
      type: Array,
      default: []
    },
    origin: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      commonClass: ["news-content-wrap", "clearfix"],
      totalWidth: 0,
      currentLeft: 0,
      paused: false,

      isFirstShow: false,
      isDepositOrWithdraw: false,
      // 彈窗顯示狀態統整
      showPopStatus: {
        isShow: false,
        type: "popup"
      }
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    // 完整的跑馬燈資料
    newslist() {
      return this.list;
    },
    // 只取跑馬燈 Title 的資料
    newsTitleList() {
      return this.titleList;
    },
    // 確認跑馬燈的資料中，有任一 announceSwitch 開啟
    hasAnySwitch() {
      return this.newslist.find(item => item.announceSwitch === 1);
    }
  },
  mounted() {
    this.currentLeft = this.$refs.container.offsetWidth;

    this.totalWidth =
      this.$refs.news.offsetWidth > this.currentLeft
        ? this.$refs.news.offsetWidth
        : 1.5 * this.currentLeft;

    this.startMove();
    this.isDepositOrWithdraw = this.$route.name === "home";
    if (this.list?.length <= 0 || !this.hasAnySwitch) {
      return;
    } else if (
      (this.origin === "deposit" &&
        !localStorage.getItem("do-not-show-deposit-post")) ||
      (this.origin === "withdraw" &&
        !localStorage.getItem("do-not-show-withdraw-post"))
    ) {
      this.isFirstShow = true;
      this.togglePopup();
    }
  },
  methods: {
    ...mapActions([""]),
    setPopupStatus(isShow, type) {
      this.showPopStatus = {
        isShow,
        type
      };
    },
    // 開啟最新消息方式
    togglePopup() {
      if (this.isFirstShow) {
        document.querySelector("body").style = !this.showPopStatus.isShow
          ? "overflow: hidden"
          : "";

        this.setPopupStatus(!this.showPopStatus.isShow, "popup");
      } else {
        this.paused = !this.paused;

        if (!this.paused) {
          this.startMove();
        }

        document.querySelector("body").style = !this.showPopStatus.isShow
          ? "overflow: hidden"
          : "";

        this.setPopupStatus(!this.showPopStatus.isShow, "popup");
      }
    },
    startMove() {
      if (this.paused || !this.$refs.container) return;

      if (Math.abs(this.currentLeft) < this.totalWidth) {
        this.currentLeft -= this.$refs.container.offsetWidth / 350;
        window.requestAnimationFrame(this.startMove);
      } else {
        this.currentLeft = this.$refs.container.offsetWidth;
        window.requestAnimationFrame(this.startMove);
      }
    },
    handleClick() {
      this.isFirstShow = false;
      this.togglePopup();
    }
  }
};
</script>

<style lang="scss" scoped>
.news-wrap {
  display: flex;
  align-content: center;
  padding: 10px 17px 8px;

  .news-icon {
    height: 100%;
    width: 15px;
  }

  .news-icon > img {
    display: block;
    width: 15px;
    height: 12px;
  }
}

.news-content {
  position: relative;
  display: block;
  line-height: 12px;
  margin-left: 6px;
  color: #9ca3bf;
  font-size: 12px;
  overflow: hidden;
  min-width: calc(100vw - 51px);

  &.porn1 {
    color: #9ca3bf;
  }

  &.ey1 {
    color: #ff7171;
  }

  &.sg1 {
    color: #be9e7f;
  }

  &.notHome {
    color: #be9e7f;
  }
}

.news-content-text {
  position: absolute;
  padding-left: 20px;
  white-space: nowrap;

  .title-item {
    padding-right: 10px;
    white-space: nowrap;
  }
}

.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.modal-wrap {
  width: 270px;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 100;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 10px;
}

.modal-content {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-news {
  min-height: 170px;
  max-height: 190px;
  overflow-x: hidden;
  overflow-y: auto;
}

.news-item {
  margin-top: 20px;
  word-break: break-all;

  &:first-child {
    margin-top: 0;
  }
}

.news-title {
  line-height: 23px;
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: normal;
  color: #414655;
}

.news-text {
  line-height: 21px;
  font-size: 14px;
  color: #a5a9b3;
}

.modal-button {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
}

@keyframes marquee-left {
  to {
    left: -100%;
  }
}
</style>
