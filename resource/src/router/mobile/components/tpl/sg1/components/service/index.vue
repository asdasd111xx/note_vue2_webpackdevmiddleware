<template>
  <mobile-container :has-footer="!hasPrev" :class="$style['container']">
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style['top-bg']" />
      <div :class="$style['service-header']">
        <div v-if="hasPrev" :class="$style['btn-prev']" @click="handleBack()">
          <img :src="$getCdnPath(`/static/image/common/btn_back_white.png`)" />
        </div>
        <div :class="$style.title">我的客服</div>
        <div
          v-if="!isStatic"
          :class="$style.feedback"
          @click="
            $router.push(
              loginStatus
                ? '/mobile/mcenter/feedback/sendFeedback'
                : '/mobile/login'
            )
          "
        >
          {{ this.$text("S_FEEDBACK", "意见反馈") }}
        </div>
      </div>

      <div :class="$style['userInfo-block']">
        <div :class="$style['avatar-info-wrap']">
          <div :class="$style['avatar-wrap']">
            <img :src="avatarSrc" />
          </div>
          <div :class="$style['info-wrap']">
            <span
              >Hi,&nbsp;
              {{ name }}
            </span>
            <span>欢迎来到客服中心</span>
          </div>
        </div>

        <div :class="$style['line']" />

        <div v-if="isIos && !isStatic" :class="$style['add-wrap']">
          <span>添加桌面客服，随时享受一对一在线解答</span>
          <span :class="$style['add-bottom']" @click="handleAddClick"
            >立即添加</span
          >
        </div>
      </div>

      <template v-for="(item, index) in serviceList">
        <img
          :key="index"
          :class="$style[`info-card`]"
          @click="clickService(index)"
          :src="
            item.image
              ? item.image
              : $getCdnPath(
                  `/static/image/${routerTPL}/service/service_service0${index +
                    1}.png`
                )
          "
        />
      </template>
      <div
        v-if="isIos && !isStatic"
        :class="$style['tip-block']"
        @click="clickPopTip"
        :style="hasPrev ? { bottom: '15px' } : {}"
      >
        <div :class="$style['tip-img']">
          <img :src="$getCdnPath(`/static/image/sg1/common/appicon_pao.png`)" />
        </div>

        <div :class="$style['tip-text']">永久网址</div>
      </div>

      <div v-if="isShowPop" :class="$style['pop-wrap']">
        <div :class="$style['pop-mask']" @click="isShowPop = false" />
        <div :class="$style['pop-block']">
          <div :class="$style['close']" @click="isShowPop = false">
            <img
              :src="
                $getCdnPath(
                  '/static/image/common/service/popup/popup_ic_close.png'
                )
              "
              alt="close"
            />
          </div>
          <div :class="$style['tip']">
            <span>重要提醒</span>
          </div>
          <div :class="$style['title']">
            <div :class="$style['title-img']">
              <img
                :src="
                  $getCdnPath('/static/image/sg1/service/popup/popup_img01.png')
                "
                alt="img01"
              />
            </div>
            <span
              >尊敬的泡泡直播会员，当iOS用户的泡泡直播App掉签无法打开时，可以通过以下方法继续游戏</span
            >
          </div>

          <div :class="$style['content']">
            <div :class="$style['content-cell']">
              <span>1.通过泡泡直播图标上的网址，重新下载App：</span>
              <div :class="$style['content-img']">
                <img
                  :src="
                    $getCdnPath(
                      '/static/image/sg1/service/popup/popup_img02.png'
                    )
                  "
                  alt="img02"
                />
              </div>
            </div>

            <div :class="$style['content-cell']">
              <span>2.收藏泡泡直播永久网址，浏览器打开，随时畅玩：</span>
              <div
                :class="$style['link']"
                v-for="(item, index) in linkArray"
                :key="index"
              >
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../common/mobileContainer";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    mobileContainer
  },
  props: {
    isStatic: {
      type: Boolean,
      default: false
    },
    sourceSiteConfig: { type: Object, default: null }
  },
  data() {
    return {
      hasPrev: true,
      divHeight: 0,
      isShowPop: false,
      linkArray: [],
      avatarSrc: `/static/image/common/default/avatar_nologin.png`,
      serviceList: []
    };
  },
  created() {
    // 跳轉頁面需要有返回及不顯示tabbar
    if (this.$route.query.prev !== undefined) {
      this.hasPrev = this.$route.query.prev === "true";
    }
    this.getService();
  },
  mounted() {
    if (this.loginStatus) {
      this.actionSetUserdata(true).then(() => {
        this.getAvatarSrc();
      });
    }

    this.divHeight = document.body.offsetHeight - 60;
    if (!this.isStatic) {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/System/downloadlink`
      }).then(res => {
        if (res && res.data) {
          this.linkArray = res.data;
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      systemSiteConfig: "getSiteConfig",
      mobileInfo: "getMobileInfo"
    }),
    siteConfig() {
      return this.sourceSiteConfig || this.systemSiteConfig;
    },
    isIos() {
      return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    },
    name() {
      if (this.loginStatus) {
        return this.memInfo.user.show_alias
          ? this.memInfo.user.alias
          : this.memInfo.user.username;
      }
      return "尊敬的用户";
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionSetWebDomain",
      "actionSetWebInfo",
      "actionGetMobileInfo",
      "actionGetExtRedirect"
    ]),
    handleBack() {
      const { query } = this.$route;
      let redirect = query.redirect;
      switch (redirect) {
        case "withdraw":
          localStorage.setItem("service-back", true);
        default:
          this.$router.back();
          break;
      }
    },
    getService() {
      goLangApiRequest({
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/For/Customer/Service`
      }).then(res => {
        if (res && res.status === "000" && res.errorCode === "00") {
          this.serviceList = res.data;
        }
      });
    },
    clickService(item) {
      window.open(this.serviceList[item].url);
    },
    clickPopTip() {
      this.isShowPop = true;
    },
    handleAddClick() {
      this.$router.push("/mobile/install");
    },
    getAvatarSrc() {
      if (!this.loginStatus) return;

      // 是否自訂上傳頭像
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/front-page",
        method: "get"
      }).then(data => {
        if (data && data.result && data.result.head_photo) {
          this.avatarSrc = data.result.head_photo;
        }
      });

      if (this.avatarSrc) {
        return;
      }

      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/head-photo/preset-list",
        method: "get"
      }).then(res => {
        if (res && res.result && res.result.data) {
          let currentImgID = res.result.use;
          let defaultAvatarList = res.result.data;
          if (currentImgID && defaultAvatarList) {
            this.avatarSrc = defaultAvatarList.find(
              i => i.image_id === currentImgID
            ).link;
          }
        }
      });
      return;
      Ｆ;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  position: relative;
  height: 100vh;
}

.userInfo-block {
  border-radius: 5px;

  background-color: white;
  margin: 30px 21px;

  -webkit-box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);
}

.line {
  background: #eee;
  width: 100%;
  height: 2px;
}

.avatar-info-wrap {
  position: relative;
  display: flex;
  align-items: center;
  padding: 19px 15px;

  .info-wrap {
    padding: 10px;
    line-height: 24px;

    span {
      height: 50%;
      display: flex;
      align-items: center;
    }

    > span:last-child {
      color: #a5a9b3;
    }
  }

  .avatar-wrap {
    height: 70px;
    width: 70px;

    > img {
      height: 100%;
      border-radius: 50%;
    }
  }
}

.add-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 17px 15px;
  font-size: 12px;
  color: var(--service_text_color);
  font-weight: bold;

  .add-bottom {
    color: var(--service_add_text_button);
    background: var(--service_add_button);
    border-radius: 36px;
    padding: 3px 12px;
    min-width: 72px;
  }
}

.service-header {
  text-align: center;
  position: relative;
  height: 43px;
  color: white;
  font-size: 17px;

  .title {
    line-height: 43px;
  }
  .feedback {
    line-height: 43px;
    position: absolute;
    top: 0;
    right: 12px;
  }
}

.info-card {
  display: block;
  margin: 5px auto;
  width: 100%;
}

.btn-prev {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  width: 20px;
  height: 20px;
  margin: auto;

  > img {
    display: block;
    width: 100%;
  }
}

.tip-block {
  position: absolute;
  right: 20px;
  bottom: 80px;
}

.tip-img {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 50px;
    height: 50px;
  }
}

.tip-text {
  margin-top: 6px;
  width: fit-content;
  text-align: center;
  padding: 0 5px;
  font-size: 12px;
  color: #fff;
  background: #000000;
  border-radius: 12px;
  box-shadow: 0pt 2px 5px 0pt rgba(0, 0, 0, 0.16);
}

.pop-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.pop-mask {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
}

.pop-block {
  position: absolute;
  width: 85%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border-radius: 8px;

  .close {
    position: absolute;
    top: -40px;
    right: 0;
    width: 21px;
    height: 21px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .tip {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    height: 40px;
    text-align: right;

    span {
      padding: 0 5px;
      font-size: 12px;
      color: #fff;
      background: var(--service_tip_color);
      border-radius: 9px 0 0 9px;
    }
  }

  .title,
  .content {
    margin: 0 17px;
    color: var(--mcenter_slider_text_color);
    font-size: 12px;
  }

  .title-img {
    width: 100%;

    img {
      width: 100%;
    }
  }

  .content-cell {
    span {
      padding: 2px 0;
    }

    .content-img {
      width: 100%;

      img {
        width: 100%;
      }
    }

    .link {
      position: relative;
      width: 180px;
      margin: 10px auto;
      padding: 0 0 0 40px;
      background: #ffffff;
      border: 1px solid var(--mcenter_slider_text_color);
      border-radius: 10px;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        background: url("/static/image/common/service/popup/popup_ic_search.png")
          no-repeat;
        width: 12px;
        height: 12px;
        background-size: cover;
      }
    }
  }
}

.btn-prev {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  width: 20px;
  height: 20px;
  margin: auto;
  z-index: 2;

  > img {
    display: block;
    width: 100%;
  }
}

.top-bg {
  background: url("/static/image/sg1/service/bg_service.png");
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  height: 120px;
  width: 100%;
  max-width: $mobile_max_width;
  top: 0;
  position: absolute;
  z-index: -1;
}

@media (orientation: landscape) {
  .top-bg {
    max-width: $mobile_max_landscape_width !important;
  }
}
</style>
