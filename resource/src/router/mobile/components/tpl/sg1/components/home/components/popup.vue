<template>
  <div :class="$style['popup']">
    <div :class="$style['mask']" />
    <div :class="$style['modal-wrap']">
      <div v-if="!sitePostList" :class="$style['modal-content']">
        <div :class="$style['modal-news']">
          <div
            v-for="item in post.list"
            :key="item.id"
            :class="$style['news-item']"
          >
            <h4 :class="$style['news-title']">{{ item.title }}</h4>
            <p :class="$style['news-content']" v-html="item.content" />
          </div>
        </div>
        <div :class="[$style['no-remind'], 'clearfix']">
          <span
            :class="[$style['checkbox-circle'], { [$style.active]: isTick }]"
            @click="isTick = !isTick"
          />
          <span :class="$style['checkbox-text']">不再提示</span>
        </div>
      </div>

      <div v-else-if="sitePostList" :class="$style['modal-content']">
        <div :class="$style['post-header']">
          网站公告
        </div>
        <div :class="$style['modal-news']">
          <div
            v-for="item in sitePostList"
            :key="item.id"
            :class="$style['news-item']"
          >
            <p :class="$style['news-content']" v-html="item.content" />
          </div>
        </div>
      </div>

      <div v-if="!sitePostList" class="clearfix">
        <div :class="$style['modal-button']" @click="closePop()">知道了</div>
        <div :class="$style['modal-button']" @click="closePop(true)">
          查看详情
        </div>
      </div>

      <div v-else-if="sitePostList" class="clearfix">
        <div :class="[$style['modal-button-center']]" @click="closePop()">
          关闭
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    sitePostList: {
      default: null
    }
  },
  data() {
    return {
      isTick: false
    };
  },
  computed: {
    ...mapGetters({
      post: "getPost"
    })
  },
  methods: {
    closePop(showDetail) {
      if (showDetail) {
        this.$router.push("mobile/mcenter/information/post");
        return;
      }

      if (this.isTick) {
        localStorage.setItem("do-not-show-home-post", true);
      }

      this.$emit("close", !!this.sitePostList);
    }
  }
};
</script>

<style lang="scss" module>
.popup {
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
  height: 192px;
  margin-bottom: 15px;
  overflow-x: hidden;
  overflow-y: auto;
}

.no-remind {
  span {
    float: left;
  }
}

.checkbox-circle {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  background: url("/static/image/_new/common/special_uncheck.png") 0 0 / contain
    no-repeat;

  &.active {
    background-image: url("/static/image/_new/common/special_check.png");
  }
}

.checkbox-text {
  line-height: 16px;
  font-size: 12px;
  color: #a5a9b3;
}

.news-item {
  margin-bottom: 20px;
  word-break: break-all;
}

.news-title {
  line-height: 23px;
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: normal;
  color: #414655;
}

.news-content {
  line-height: 21px;
  font-size: 14px;
  color: #a5a9b3;
}

.modal-button {
  float: left;
  width: 50%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;

  &:first-child {
    color: #000;
    border-right: 1px solid #eee;
  }

  &:last-child {
    color: #d2b79c;
  }
}

.modal-button-center {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
}

.post-header {
  font-size: 18px;
  font-weight: normal;
  text-align: center;
  width: 100%;
  margin-bottom: 5px;
}
</style>
