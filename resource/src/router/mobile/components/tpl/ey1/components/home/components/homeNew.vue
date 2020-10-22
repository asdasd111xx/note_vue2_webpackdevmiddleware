<template>
  <div class="news-wrap">
    <div class="news-icon">
      <img :src="$getCdnPath('/static/image/ey1/common/icon_news.png')" />
    </div>
    <div ref="container" class="news-content" @click="togglePopup">
      <div
        ref="news"
        class="news-content-text"
        :style="`left: ${currentLeft}px;`"
        v-html="newsText"
      />
    </div>
    <template v-if="newsPopControl.status">
      <div class="mask" />
      <div class="modal-wrap">
        <div class="modal-content">
          <div class="modal-news">
            <div
              v-for="(item, sort) in newsData"
              :key="`news-${sort}`"
              class="news-item"
            >
              <h4 class="news-title">{{ item.time | dateFormat }}</h4>
              <p class="news-text" v-html="item.content" />
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
import Vue from "vue";
import { format } from "date-fns";
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
  },
  props: {
    dataSource: {
      type: String,
      default: 'mem'
    },
    speed: {
      type: Number,
      default: 85
    },
    direction: {
      type: String,
      default: 'left'
    },
    viewFullContent: {
      type: Boolean,
      default: true
    },
    updateNews: {
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {
      commonClass: ['news-content-wrap', 'clearfix'],
      containerWidth: 0,
      totalWidth: 0,
      currentLeft: 0,
      paused: false
    };
  },
  computed: {
    ...mapGetters({
      isBackEnd: 'getIsBackEnd',
      newsPopControl: 'getNewsPopControl',
      memNewsData: 'getNews',
      agentNewsData: 'getAgentNews'
    }),
    newsData() {
      return (this.dataSource === 'mem') ? this.memNewsData : this.agentNewsData;
    },
    newsText() {
      return this.newsData.map((item) => `${item.content} &nbsp;&nbsp;&nbsp;&nbsp;`).join('');
    }
  },
  filters: {
    dateFormat(value) {
      return Vue.moment(value).format('YYYY-MM-DD')
    }
  },
  mounted() {
    this.currentLeft = this.$refs.container.offsetWidth;
    this.totalWidth = this.$refs.news.offsetWidth;
    this.startMove();
  },
  methods: {
    ...mapActions([
      'actionNewsPopControl'
    ]),
    // 開啟最新消息方式
    togglePopup() {
      /*
      this.paused = !this.paused;
      if (!this.paused) {
        this.startMove();
      }
      */
      document.querySelector('body').style = !this.newsPopControl.status ? 'overflow: hidden' : '';
      this.actionNewsPopControl({ type: this.dataSource, status: !this.newsPopControl.status });
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

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
  cursor: pointer;
  line-height: 12px;
  margin-left: 6px;
  color: $ey_text_color1;
  font-size: 12px;
  overflow: hidden;

  > * {
    pointer-events: none;
  }
}

.news-content-text {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  // animation: marquee linear 5s infinite;
  // animation: marquee-left 3s infinite;
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
