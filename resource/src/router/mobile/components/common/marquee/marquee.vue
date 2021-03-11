<template>
  <div class="news-wrap">
    <div class="news-icon">
      <img
        :src="$getCdnPath(`/static/image/${themeTPL}/common/icon_news.png`)"
      />
    </div>

    <div ref="container" :class="['news-content', `${themeTPL}`]">
      <div
        ref="news"
        class="news-content-text"
        :style="`left: ${currentLeft}px;`"
      >
        <span
          class="title-item"
          v-for="(item, index) in newsTitleList"
          :key="index"
          @click="handleClick(item.switch)"
        >
          {{ item.title }}
        </span>
      </div>
    </div>

    <template v-if="newsPopControl.status">
      <div class="mask" />
      <div class="modal-wrap">
        <div class="modal-content">
          <div class="modal-news">
            <div
              v-for="(item, sort) in newslist"
              :key="`news-${sort}`"
              class="news-item"
            >
              <h4 class="news-title">{{ item.title }}</h4>
              <p
                class="news-text"
                v-html="item.content.replace('\n', '<br>')"
              />
            </div>
          </div>
        </div>
        <div class="modal-button" @click="togglePopup">
          关闭
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    titleList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      commonClass: ["news-content-wrap", "clearfix"],
      totalWidth: 0,
      currentLeft: 0,
      paused: false
    };
  },
  computed: {
    ...mapGetters({
      newsPopControl: "getNewsPopControl",
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
    }
  },
  mounted() {
    this.currentLeft = this.$refs.container.offsetWidth;
    this.totalWidth =
      this.$refs.news.offsetWidth > this.currentLeft
        ? this.$refs.news.offsetWidth
        : 1.5 * this.currentLeft;
    this.startMove();
  },
  methods: {
    ...mapActions(["actionNewsPopControl"]),
    // 開啟最新消息方式
    togglePopup() {
      if (this.newsTitleList?.length < 0) {
        return;
      }

      this.paused = !this.paused;
      if (!this.paused) {
        this.startMove();
      }
      document.querySelector("body").style = !this.newsPopControl.status
        ? "overflow: hidden"
        : "";
      this.actionNewsPopControl({
        // type: this.dataSource,
        status: !this.newsPopControl.status
      });
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
    handleClick(switchType = 1) {
      // switchType = 1 為開啟 popup ; 0 則不顯示
      if (switchType === 0) return;
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
}

.news-content-text {
  position: relative;

  .title-item {
    padding-right: 10px;
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
