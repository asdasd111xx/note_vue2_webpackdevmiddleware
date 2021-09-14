<template>
  <div :class="['news-container', `${themeTPL}`]">
    <div
      class="news-wrap"
      :class="`${['withdraw', 'deposit'].includes(origin) ? 'fixed' : ''}-wrap`"
    >
      <div class="news-icon">
        <img
          :src="
            $getCdnPath(
              `/static/image/${themeTPL}/common/${
                ['withdraw', 'deposit'].includes(origin)
                  ? 'icon_news'
                  : 'icon_news_index'
              }.png`
            )
          "
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
        <VTextMarquee
          :speed="35"
          :animate="paused"
          :content="newsTitleList.join('&nbsp;&nbsp;&nbsp;')"
          @click="handleClick()"
        ></VTextMarquee>

        <!-- <div
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
        </div> -->
      </div>
    </div>
    <div v-if="showPopStatus.isShow">
      <!-- 跑馬燈內容彈窗 -->
      <popup
        v-if="showPopStatus.type === 'popup'"
        :list="newslist"
        :origin="origin"
        :isFirstShow="isFirstShow"
        @close="togglePopup"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import popup from "./popup/popup";
import { VTextMarquee } from "vue-text-marquee";
// https://github.com/satrong/vue-text-marquee
export default {
  components: {
    popup,
    VTextMarquee: VTextMarquee
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
      paused: true,

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
      let data = [];
      data = this.titleList.map(item => {
        return item.title;
      });

      return data;
    },
    // 確認跑馬燈的資料中，有任一 announceSwitch 開啟
    hasAnySwitch() {
      return this.newslist.find(item => item.announceSwitch === 1);
    }
  },
  mounted() {
    // this.currentLeft = this.$refs.container.offsetWidth;
    // this.totalWidth =
    //   this.$refs.news.offsetWidth > this.currentLeft
    //     ? this.$refs.news.offsetWidth
    //     : 1.5 * this.currentLeft;
    //  this.startMove();
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

        // if (!this.paused) {
        //   this.startMove();
        // }

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
.news-container {
  &.ey1 {
    background: linear-gradient(#ffffff, #cbd8ff);
  }
}
.news-wrap {
  display: flex;
  align-content: center;
  padding: 10px 17px 8px;
  width: 100%;
  overflow: hidden;

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

.fixed-wrap {
  position: fixed;
  top: 43px;
  z-index: 2;
  background: #f8f8f7;
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
  -webkit-tap-highlight-color: transparent;

  &.porn1 {
    color: #9ca3bf;
  }

  &.ey1 {
    color: #2348b3;
  }

  &.sg1 {
    color: #b7b7b7;
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
</style>
