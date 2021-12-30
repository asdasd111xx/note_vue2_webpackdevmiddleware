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
  <div v-else-if="postData" :class="$style['post-wrap']">
    <div v-if="$route.query.pid" :class="$style['post-content']">
      <div :class="[$style['content-title'], 'clearfix']">
        <div :class="$style['icon-post']">
          <img
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/information/icon_information.png`
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
      <template>
        <div v-if="currentPost.content">
          <div
            :class="$style['content-wrap']"
            v-html="
              setContent(
                currentPost.content || currentPost.image,
                !!currentPost.image
              )
            "
          />
        </div>
      </template>
      <template>
        <div :class="$style['post-image']">
          <img
            :id="`image-${currentPost.id}`"
            :src="currentPostImage"
            @click="linkTo(currentPost)"
          />
        </div>
      </template>
    </div>
    <div v-else :class="$style['post-list']">
      <div
        v-for="post in postData"
        :key="post.id"
        :class="[$style.post, 'clearfix']"
        @click="onClickPost(post.id)"
      >
        <div :class="$style['icon-post']">
          <img
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/information/icon_information.png`
              )
            "
          />
        </div>
        <div :class="$style.wrap">
          <div class="clearfix">
            <div :class="$style.title" v-html="post.title" />
            <div v-if="post.categoryText" :class="$style.category">
              {{ post.categoryText }}
            </div>
            <div :class="$style['post-time']">
              {{ post.enable_at | shortDateFormat }}
            </div>
          </div>
          <div :class="$style['content']" v-html="post.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mixin from "@/mixins/mcenter/message/message";
import mobileLinkOpen from "@/lib/mobile_link_open";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  mixins: [mixin],
  data() {
    return {
      hasReceive: false,
      postData: [],
      currentPostImage: "",
      currentPost: {}
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      post: "getPost"
    })
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionSetPost"]),
    mobileLinkOpen,
    onClickPost(id) {
      this.currentPost = {};
      this.currentPostImage = "";
      this.$router.push({ query: { page: "post", pid: id } });

      if (!this.$route.query.pid || this.postData.length == 0) {
        this.$router.back();
        return null;
      }

      let target = this.postData.find(
        post => post.id === this.$route.query.pid
      );

      if (target.image) {
        this.getImage(target.image).then(data => {
          this.currentPostImage = data;
        });
      }

      this.currentPost = this.postData.find(
        post => post.id === this.$route.query.pid
      );
    },
    linkTo(value) {
      // link_type 1/外部連結, 2/內部連結, 3/遊戲連結, 4/優小秘連結
      switch (value.link_type) {
        case 1:
          localStorage.setItem("iframe-third-url", value.zh_cn_url);
          this.$router.push(`/mobile/iframe/${this.$route.name}`);
          break;
        case 2:
          // 內部連結選項：必填。{string=deposit/存款, withdraw/取款, bank-rebate/我的返水, ubb/寰宇瀏覽器, cgpay/CGP教程, mobile-bet/app下載頁, agent-login/代理登入, service/在線客服, promotion/優惠活動}
          // internal_link
          let mobile_internal_link = "";
          switch (value.internal_link) {
            case "ubb": //寰宇瀏覽器
              break;
            case "cgpay": //CGP教程
              break;
            case "mobile-bet": //app下載頁
              break;
            case "agent-login": //代理登入
              break;
            case "deposit": //存款
            case "withdraw": //取款
            case "bank-rebate": //我的返水
            case "service": //在線客服
            case "promotion": //優惠活動
            default:
              mobile_internal_link = value.internal_link;
              break;
          }
          this.mobileLinkOpen({
            linkType: "internal",
            linkTo: mobile_internal_link
          });
          break;
        case 3:
          let gameLinkType = 0;
          switch (value.kind) {
            case 1:
              gameLinkType = "sport";
              break;

            case 2:
              gameLinkType = "live";
              break;

            case 3:
              gameLinkType = "casino";
              break;

            case 4:
              gameLinkType = "lottery";
              break;

            case 5:
              gameLinkType = "card";
              break;

            case 6:
              gameLinkType = "mahjong";
              break;

            default:
              break;
          }
          this.mobileLinkOpen({
            linkType: gameLinkType,
            linkTo: value.vendor,
            linkItem: { "zh-cn": value.code }
          });
          break;
        case 4:
          let usmCode = value.zh_cn_url.split("/")[
            value.zh_cn_url.split("/").length - 1
          ];
          usmCode = usmCode.split("?")[0];
          console.log(usmCode);
          this.getPromotionList(usmCode);
          break;
        default:
          break;
      }
    },
    getPromotionList(id) {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Promotion/List`,
        params: {
          tabId: 0
        }
      }).then(res => {
        if (res && res.data) {
          let linkData = res.data.ret.find(data => {
            return data.id === +id;
          });
          if (linkData) {
            this.mobileLinkOpen({
              linkType: "mi",
              linkTitle: linkData.name,
              linkTo: linkData.link
            });
          } else {
            this.actionSetGlobalMessage({
              msg: "抱歉，此活动不存在"
            });
          }
        }
      });
    }
  },
  created() {
    this.actionSetPost("0").then(() => {
      this.hasReceive = true;
      if (!this.post || !this.post.list) {
        this.postData = [];
        return;
      }

      const categoryList = {
        0: "",
        1: "最新",
        2: "重要",
        3: "活动",
        4: "维护"
      };

      this.postData = this.post.list.map(item => ({
        ...item,
        categoryText: categoryList[item.category]
      }));
      this.hasReceive = true;

      if (this.$route.query.pid && this.postData.length !== 0) {
        this.onClickPost(this.$route.query.pid);
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
    width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.content-wrap {
  color: #414655;
  font-size: 14px;
  margin-top: 8px;
  padding: 0 17px;
  width: 100%;
  overflow-x: scroll;
  overflow-y: scroll;
}

.title {
  float: left;
  max-width: calc(100% - 115px);
  height: 20px;
  line-height: 20px;
  color: #414655;
  font-size: 14px;
  overflow-x: hidden;
  overflow-y: hidden;
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
  overflow-x: hidden;
  overflow-y: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  height: 12px;
  line-height: 12px;
  margin-top: 6px;
  color: #a6a9b2;
  font-size: 12px;
}

.post-image {
  width: 100%;
  padding: 0 7px;

  > img {
    width: 100%;
  }
}
</style>
