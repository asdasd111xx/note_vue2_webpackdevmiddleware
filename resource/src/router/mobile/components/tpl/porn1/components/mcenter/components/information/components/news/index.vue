<template>
  <div v-if="newsData.length === 0" :class="$style['no-data']">
    <div :class="$style['no-data-wrap']">
      <img
        :src="
          $getCdnPath('/static/image/porn1/mcenter/information/no_message.png')
        "
      />
      <div>还没有新活动消息</div>
    </div>
  </div>
  <div v-else :class="$style['news-wrap']">
    <div v-if="$route.query.pid" :class="$style['news-content']">
      <div :class="[$style['content-title'], 'clearfix']">
        <div :class="$style['icon-news']">
          <img
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/information/icon_information.png`
              )
            "
          />
        </div>
        <div :class="$style.wrap">
          <div :class="$style.date">
            {{ currentNews.title | shortDateFormat }}
          </div>
          <div :class="$style.time">{{ currentNews.title | dateFormat }}</div>
        </div>
      </div>
      <div
        :class="$style['new-content-wrap']"
        v-html="setContent(currentNews.content)"
      />
    </div>
    <div v-else :class="$style['news-list']">
      <div
        v-for="news in newsData"
        :key="news.id"
        :class="[$style.news, 'clearfix']"
        @click="$router.push({ query: { pid: news.id } })"
      >
        <div :class="$style['icon-news']">
          <img
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/information/icon_information.png`
              )
            "
          />
        </div>
        <div :class="$style.wrap">
          <div :class="$style.date">
            {{ news.title | shortDateFormat }}
          </div>
          <div :class="$style.content" v-html="news.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import EST from "@/lib/EST";
import mixin from "@/mixins/mcenter/message/message";
import store from "@/store";
export default {
  mixins: [mixin],
  computed: {
    ...mapGetters({
      newsData: "getNews",
      siteConfig: "getSiteConfig"
    }),
    currentNews() {
      if (!this.$route.query.pid || this.newsData.length == 0) {
        this.$router.back();
        return null;
      }
      return this.newsData.find(news => news.id === this.$route.query.pid);
    }
  },
  mounted() {
    store.dispatch("actionSetNews");
  }
};
</script>

<style lang="scss" module>
.no-data {
  position: relative;
  min-height: calc(100vh - 43px - 42px - 10px);
  margin-top: 52px;
  background-color: #fefffe;
}

.no-data-wrap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 180px;
  height: 220px;
  margin: auto;

  > img {
    display: block;
    width: 100%;
  }

  > div {
    height: 20px;
    line-height: 20px;
    margin-top: 20px;
    color: #a5a9b3;
    font-size: 14px;
    text-align: center;
  }
}

.news-wrap {
  background-color: #fefffe;
}

.news-list {
  min-height: calc(100vh - 43px - 42px - 10px);
  margin-top: 52px;
}

.news-content {
  min-height: calc(100vh - 43px - 10px);
  margin-top: 10px;
}

.content-title {
  padding-left: 14px;

  .icon-news {
    margin: 13px 0;
  }

  .wrap {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }
}

.icon-news {
  position: relative;
  float: left;
  width: 32px;
  height: 32px;

  > img {
    display: block;
    width: 100%;
  }

  > span {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #db6372;
  }
}

.news {
  height: 67px;
  margin: 0 7px;
  padding: 0 7px;
  border-bottom: 1px solid #eee;
  background-color: #fefffe;

  .icon-news {
    margin: 17px 0;
  }

  .wrap {
    padding: 13px 0;
  }
}

.icon-news {
  position: relative;
  float: left;
  width: 32px;
  height: 32px;

  > img {
    display: block;
    width: 100%;
  }
}

.wrap {
  float: left;
  width: calc(100% - 32px - 10px);
  margin-left: 10px;

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.new-content-wrap {
  color: #414655;
  font-size: 14px;
  word-break: break-all;
  margin-top: 8px;
  padding: 0 17px;
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
}

.date {
  height: 20px;
  line-height: 20px;
  color: #414655;
  font-size: 14px;
}

.time {
  height: 12px;
  line-height: 12px;
  margin-top: 6px;
  color: #a6a9b2;
  font-size: 12px;
}

.content {
  height: 17px;
  line-height: 17px;
  margin-top: 3px;
  color: #a6a9b2;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
