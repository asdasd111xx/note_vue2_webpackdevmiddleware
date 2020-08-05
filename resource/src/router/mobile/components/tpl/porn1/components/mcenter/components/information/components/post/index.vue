<template>
  <div v-if="hasReceive && postData.length === 0" :class="$style['no-data']">
    <div :class="$style['no-data-wrap']">
      <img
        :src="
          $getCdnPath('/static/image/porn1/mcenter/information/no_message.png')
        "
      />
      <div>还没有新公告</div>
    </div>
  </div>
  <div v-else :class="$style['post-wrap']">
    <div v-if="$route.params.pid" :class="$style['post-content']">
      <div :class="[$style['content-title'], 'clearfix']">
        <div :class="$style['icon-post']">
          <img
            :src="
              $getCdnPath(
                '/static/image/porn1/mcenter/information/icon_information.png'
              )
            "
          />
        </div>
        <div :class="$style.wrap">
          <div :class="$style['detail-title']" v-html="currentPost.title" />
          <div :class="$style.time">
            {{ currentPost.enable_at | dateFormat }}
          </div>
        </div>
      </div>
      <div :class="$style['content-wrap']" v-html="currentPost.content" />
    </div>
    <div v-else :class="$style['post-list']">
      <div
        v-for="post in postData"
        :key="post.id"
        :class="[$style.post, 'clearfix']"
        @click="$router.push({ params: { pid: post.id } })"
      >
        <div :class="$style['icon-post']">
          <img
            :src="
              $getCdnPath(
                '/static/image/porn1/mcenter/information/icon_information.png'
              )
            "
          />
        </div>
        <div :class="$style.wrap">
          <div class="clearfix">
            <div :class="$style.title" v-html="post.title" />
            <div :class="$style.category">{{ post.categoryText }}</div>
            <div :class="$style['post-time']">
              {{ post.enable_at | shortDateFormat }}
            </div>
          </div>
          <div :class="$style.content" v-html="post.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { API_GET_POST } from '@/config/api';
import ajax from '@/lib/ajax';
import EST from '@/lib/EST';

export default {
  filters: {
    dateFormat(date) {
      return EST(Vue.moment(date).format('YYYY-MM-DD HH:mm:ss'));
    },
    shortDateFormat(date) {
      return Vue.moment(date).format('YYYY-MM-DD');
    }
  },
  data() {
    return {
      hasReceive: false,
      postData: []
    };
  },
  computed: {
    currentPost() {
      if (!this.$route.params.pid) {
        return null;
      }
      return this.postData.find((post) => post.id === this.$route.params.pid);
    }
  },
  created() {
    ajax({
      method: 'get',
      url: API_GET_POST,
      success: ({ result, ret }) => {
        if (result !== 'ok') {
          return;
        }

        const categoryList = {
          0: '',
          1: '最新',
          2: '重要',
          3: '活动',
          4: '维护'
        };

        this.postData = ret.map((item) => ({
          ...item,
          categoryText: categoryList[item.category]
        }));
        this.hasReceive = true;
      }
    });
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

.post-wrap {
  background-color: #fefffe;
}

.post-list {
  min-height: calc(100vh - 43px - 42px - 10px);
  margin-top: 52px;
}

.post-content {
  min-height: calc(100vh - 43px - 10px);
  margin-top: 10px;
}

.content-title {
  padding-left: 14px;

  .icon-post {
    margin: 13px 0;
  }

  .wrap {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }
}

.icon-post {
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

.post {
  height: 67px;
  margin: 0 7px;
  padding: 0 7px;
  border-bottom: 1px solid #eee;
  background-color: #fefffe;

  .icon-post {
    margin: 17px 0;
  }

  .wrap {
    padding: 13px 0;
  }
}

.icon-post {
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

.content-wrap {
  padding: 8px 18px;
  color: #414655;
  font-size: 14px;
}

.title {
  float: left;
  max-width: calc(100% - 115px);
  height: 20px;
  line-height: 20px;
  color: #414655;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-title {
  color: #414655;
  font-size: 14px;
}

.category {
  float: left;
  width: 30px;
  margin-left: 10px;
  text-align: center;
  font-size: 10px;
  color: #db6372;
  border: 1px solid #d96472;
  border-radius: 2px;
}

.post-time {
  float: right;
  width: 66px;
  line-height: 22px;
  color: #a6a9b2;
  font-size: 12px;
}

.content {
  max-width: calc(100% - 70px);
  height: 17px;
  line-height: 17px;
  margin-top: 3px;
  color: #a6a9b2;
  font-size: 12px;
}

.time {
  height: 12px;
  line-height: 12px;
  margin-top: 6px;
  color: #a6a9b2;
  font-size: 12px;
}
</style>
