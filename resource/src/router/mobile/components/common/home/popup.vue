<template>
  <div>
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

            <template v-if="item.content">
              <p
                v-if="item.content"
                v-html="setContent(item.content, true)"
                :class="$style['news-content']"
              />
            </template>
            <template v-else-if="item.image">
              <div :class="$style['news-image']">
                <img
                  v-show="false"
                  :src="postImage[item.id]"
                  :id="`image-${item.id}`"
                />
              </div>
            </template>
          </div>
        </div>
        <div :class="[$style['no-remind'], 'clearfix']">
          <span
            :class="[$style['checkbox-circle'], { [$style.active]: isTick }]"
            @click="isTick = !isTick"
            :style="
              isTick
                ? {
                    'background-image': `url(${$getCdnPath(
                      '/static/image/common/icon_notips_active.png'
                    )})`
                  }
                : {
                    'background-image': `url(${$getCdnPath(
                      '/static/image/common/icon_noremember.png'
                    )})`
                  }
            "
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
            <p
              v-html="item.content.replace('\n', '<br>')"
              v-if="item.content"
              :class="$style['news-content']"
            />
          </div>
        </div>
      </div>

      <div v-if="!sitePostList" class="clearfix">
        <div :class="$style['modal-button']" @click="closePop()">知道了</div>
        <div
          :class="[$style['modal-button'], $style[siteConfig.ROUTER_TPL]]"
          @click="closePop(true)"
        >
          查看详情
        </div>
      </div>

      <div v-else-if="sitePostList" class="clearfix">
        <div
          :class="[
            $style['modal-button-center'],
            $style[siteConfig.MOBILE_WEB_TPL]
          ]"
          @click="closePop()"
        >
          关闭
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
import mixin from "@/mixins/mcenter/message/message";

export default {
  mixins: [mixin],
  props: {
    sitePostList: {
      default: null
    }
  },
  data() {
    return {
      isTick: false,
      postImage: {}
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      post: "getPost",
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  mounted() {
    if (this.post && this.post.list) {
      this.post.list.forEach(item => {
        if (item && item.image) {
          this.getImage(item.id, item.image);
        }
      });
    }
  },
  methods: {
    closePop(showDetail) {
      if (!this.loginStatus && showDetail) {
        this.$router.push("/mobile/login");
        return;
      }

      if (showDetail) {
        this.$router.push("/mobile/mcenter/information/post");
        return;
      }

      if (this.isTick) {
        let routeName = this.$route.name;
        switch (routeName) {
          case "promotion":
            // localStorage.setItem("do-not-show-promotion-post", true);
            localStorage.setItem("do-not-show-home-post", true);
            break;
          case "home":
            localStorage.setItem("do-not-show-home-post", true);
            break;
        }
      }

      this.$emit("close", !!this.sitePostList);
    },
    getImage(id, imageID) {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Image/${imageID}`
      }).then(res => {
        let target = document.getElementById(`image-${id}`);
        if (target) {
          this.postImage[id] = res.data;
          target.src = res.data;
          target.style = "display:unset";
        }
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
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
  padding: 15px 18px 1px 18px;
  border-bottom: 1px solid #eee;
}

.modal-news {
  height: 192px;
  margin-bottom: 10px;
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
  opacity: 0.5;
  background: url("/static/image/common/icon_noremember.png") 0 0 / contain
    no-repeat;

  &.active {
    background-image: url("/static/image/common/icon_notips_active.png");
    opacity: 0.5;
  }
}

.checkbox-text {
  line-height: 16px;
  font-size: 12px;
  color: #a5a9b3;
}

.news-item {
  margin-bottom: 15px;
  position: relative;
  width: 100%;
}

.news-title {
  line-height: 23px;
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: normal;
  color: #414655;
}

.news-content {
  line-height: 17px;
  font-size: 14px;
  color: #a5a9b3;
  width: 100%;
  position: relative;
  overflow: scroll;

  img {
    width: 100%;
  }
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
    color: $share_member_text_color4;
  }

  &.sg1:last-child {
    color: $sg_main_text_color2;
  }

  &.ey1:last-child {
    color: #e42a30;
  }

  &.porn1:last-child {
    color: $share_member_text_color4;
  }
}

.modal-button-center {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;

  // &.ey1 {
  //   color: #e42a30;
  // }
}

.post-header {
  font-size: 18px;
  font-weight: normal;
  text-align: center;
  width: 100%;
  margin-bottom: 9px;
}

// 不限制公告圖片大小
.news-image {
  width: 100%;
  overflow: scroll;
}
</style>
