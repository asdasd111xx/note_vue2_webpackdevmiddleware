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
                  @click="linkTo(item)"
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

      <div
        v-if="!sitePostList"
        :class="[$style['modal-button-wrap'], $style[siteConfig.ROUTER_TPL]]"
        class="clearfix"
      >
        <div :class="$style['modal-button']" @click="closePop()">
          知道了
        </div>
        <div :class="$style['modal-button']" @click="closePop(true)">
          查看详情
        </div>
      </div>

      <div v-else-if="sitePostList" class="clearfix">
        <div
          :class="[
            $style['modal-button-center'],
            $style[siteConfig.ROUTER_TPL]
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
import { mapGetters, mapActions } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
import mixin from "@/mixins/mcenter/message/message";
import mobileLinkOpen from "@/lib/mobile_link_open";

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
    ...mapActions(["actionSetGlobalMessage"]),
    mobileLinkOpen,
    closePop(showDetail) {
      if (!this.loginStatus && showDetail) {
        this.$router.push("/mobile/login");
        return;
      }

      if (showDetail) {
        this.$router.push("/mobile/mcenter/information/post?page=post");
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
          if (this.$route.name === value.internal_link) {
            this.closePop();
          } else {
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
          }
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
.modal-button-wrap {
  &.sg1 {
    .modal-button {
      color: #000000;
    }
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
    // color: var(--popup_tip_close_color);
    color: #6aaaf5;
    border-right: 1px solid #eee;
  }

  &:last-child {
    // color: var(--popup_tip_ok_color);
    color: #6aaaf5;
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

  > img {
    width: 100%;
  }
}
</style>
