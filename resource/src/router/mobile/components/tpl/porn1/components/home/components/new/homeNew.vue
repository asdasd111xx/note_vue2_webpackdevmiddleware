<template>
  <div class="news-wrap">
    <div>
      <img :src="$getCdnPath('/static/image/_new/common/icon_news.png')" />
    </div>
    <marquee
      :direction="direction"
      :scrolldelay="speed"
      :onmouseover="viewFullContent ? 'this.stop()' : ''"
      :onmouseout="viewFullContent ? 'this.start()' : ''"
      class="news-content"
      @click="togglePopup"
    >
      <span v-for="(item, index) in newsData" :key="index">
        {{ item.content }} &nbsp;&nbsp;&nbsp;&nbsp;
      </span>
    </marquee>
  </div>
</template>

<script>
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
      commonClass: ['news-content-wrap', 'clearfix']
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
    }
  },
  methods: {
    ...mapActions([
      'actionNewsPopControl'
    ]),
    // 開啟最新消息方式
    togglePopup() {
      if (this.isBackEnd || !this.viewFullContent) {
        return;
      }

      this.actionNewsPopControl({ type: this.dataSource, status: !this.newsPopControl.status });
    }
  }
};
</script>

<style lang="scss" scoped>
.news-wrap {
  display: flex;
  align-content: center;
  padding: 10px 17px;

  > div {
    height: 100%;
    width: 15px;
  }

  > div > img {
    width: 15px;
    height: 12px;
  }
}
.news-content {
  display: block;
  cursor: pointer;
  white-space: nowrap;
}
</style>
