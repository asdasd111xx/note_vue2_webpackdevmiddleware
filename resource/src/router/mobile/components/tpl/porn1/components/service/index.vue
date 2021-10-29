<template>
  <mobile-container
    :class="$style.container"
    :has-footer="!hasPrev && !fromlanding"
  >
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style['service-header']">
        <div v-if="hasPrev" :class="$style['btn-prev']" @click="handleBack()">
          <img :src="$getCdnPath(`/static/image/common/btn_back_white.png`)" />
        </div>
        <div :class="$style.title">我的客服</div>
        <div
          v-if="!fromlanding && !isStatic"
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
      <div :class="$style['bg']" />

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

      <div
        :class="
          routerTPL === 'porn1'
            ? $style['info-card']
            : $style[`info-card-${routerTPL}`]
        "
        @click="clickService"
      >
        <div>
          <div>
            <img
              :src="
                $getCdnPath(`/static/image/common/service/ic_service01.png`)
              "
            />
            &nbsp;
            <span>在线客服1</span>
          </div>
          <div>Main Customer Support</div>
          <div>7*24小时专线服务 贴心至上</div>
        </div>

        <div :class="$style['btn-next']">
          <img
            :src="
              $getCdnPath(`/static/image/common/service/ic_service_arrow.png`)
            "
          />
        </div>
      </div>

      <div
        :class="
          routerTPL === 'porn1'
            ? $style['info-card2']
            : $style[`info-card2-${routerTPL}`]
        "
        @click="clickService"
      >
        <div>
          <div>
            <img
              :src="
                $getCdnPath(`/static/image/common/service/ic_service02.png`)
              "
            />
            &nbsp;
            <span>在线客服2</span>
          </div>
          <div>Reserve Customer Support</div>
          <div>7*24小时专线服务 贴心至上</div>
        </div>

        <div :class="$style['btn-next']">
          <img
            :src="
              $getCdnPath(`/static/image/common/service/ic_service_arrow.png`)
            "
          />
        </div>
      </div>

      <div
        v-if="isIos && !isStatic"
        :class="$style['tip-block']"
        @click="clickPopTip"
        :style="hasPrev || fromlanding ? { bottom: '15px' } : {}"
      >
        <div :class="$style['tip-img']">
          <img
            :src="$getCdnPath(`/static/image/${routerTPL}/service/appicon.png`)"
          />
        </div>

        <div :class="[$style['tip-text'], $style[`${routerTPL}`]]">
          永久网址
        </div>
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
                  $getCdnPath(
                    `/static/image/${routerTPL}/service/popup/popup_img01.png`
                  )
                "
                alt="img01"
              />
            </div>
            <span>{{
              `尊敬的${siteName}会员，当iOS用户的${siteName}App掉签无法打开时，可以通过以下方法继续游戏`
            }}</span>
          </div>

          <div :class="$style['content']">
            <div :class="$style['content-cell']">
              <span>{{ `1.通过${siteName}图标上的网址，重新下载App：` }}</span>
              <div :class="$style['content-img']">
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/${routerTPL}/service/popup/popup_img02.png`
                    )
                  "
                  alt="img02"
                />
              </div>
            </div>

            <div :class="$style['content-cell']">
              <span>{{
                `2.收藏${siteName}永久网址，浏览器打开，随时畅玩：`
              }}</span>
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
import axios from "axios";
import * as siteConfigOfficial from "@/config/siteConfig/siteConfigOfficial";
import * as siteConfigTest from "@/config/siteConfig/siteConfigTest";

export default {
  components: {
    mobileContainer
  },
  props: {
    isStatic: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      sourceSiteConfig: null,
      hasPrev: true,
      divHeight: 0,
      isShowPop: false,
      linkArray: [],
      avatarSrc: `/static/image/common/default/avatar_nologin.png`,
      fromlanding: false
    };
  },
  created() {
    // 跳轉頁面需要有返回及不顯示tabbar
    if (this.$route.query.prev !== undefined) {
      this.hasPrev = this.$route.query.prev === "true";
    }

    if (this.$route.query.fromlanding !== undefined) {
      this.fromlanding = this.$route.query.fromlanding === "true";
    }

    if (this.isStatic) {
      this.actionSetWebDomain().then(res => {
        this.actionGetMobileInfo();
        let configInfo = {};

        if (res) {
          configInfo =
            siteConfigTest[`site_${res.domain}`] ||
            siteConfigOfficial[`site_${res.domain}`];
        }

        this.sourceSiteConfig = configInfo;
        this.template = `${res.site}Service`;
        if (configInfo) {
          this.show = true;
        }
      });
    } else {
      this.show = true;
    }
  },
  mounted() {
    if (this.loginStatus && !this.fromlanding) {
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
      if (this.loginStatus && !this.fromlanding) {
        return this.memInfo.user.show_alias
          ? this.memInfo.user.alias
          : this.memInfo.user.username;
      }
      return "尊敬的用户";
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    siteName() {
      return this.siteConfig.SITE_NAME;
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionSetWebDomain",
      "actionSetWebInfo",
      "actionGetMobileInfo"
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
    clickService() {
      let url = this.mobileInfo.service.url;
      if (this.fromlanding) {
        window.location.href = url;
      } else {
        window.open(url);
      }

      // window.open(url);
      // // 在線客服流量分析事件
      // window.dataLayer.push({
      //   dep: 2,
      //   event: "ga_click",
      //   eventCategory: "online_service",
      //   eventAction: "online_service_contact",
      //   eventLabel: "online_service_contact"
      // });
      // return;
      // mobileLinkOpen({ linkType: "static", linkTo: `service${type}` });
    },
    clickPopTip() {
      this.isShowPop = true;
    },
    handleAddClick() {
      this.$router.push("/mobile/install");
    },
    getAvatarSrc() {
      if (!this.loginStatus || this.fromlanding) return;

      const imgSrcIndex = this.memInfo.user.image;
      if (this.memInfo.user && this.memInfo.user.custom) {
        axios({
          method: "get",
          url: this.memInfo.user.custom_image
        })
          .then(res => {
            if (res && res.data && res.data.result === "ok") {
              this.avatarSrc = res.data.ret;
            }
          })
          .catch(error => {
            this.actionSetGlobalMessage({ msg: error.data.msg });
            this.avatarSrc = this.$getCdnPath(
              `/static/image/common/mcenter/default/avatar_${imgSrcIndex}.png`
            );
          });
      } else {
        this.avatarSrc = this.$getCdnPath(
          `/static/image/common/mcenter/default/avatar_${imgSrcIndex}.png`
        );
      }
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: #fff;
  background-image: url("/static/image/porn1/service/header_bg.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: 0 -70px;
  background-repeat: no-repeat;
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
  color: #6aaaf5;
  font-weight: bold;

  .add-bottom {
    color: #fff;
    background: #6aaaf5;
    border-radius: 36px;
    padding: 3px 12px;
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

.info-card,
.info-card2 {
  color: white;
  background-image: -webkit-linear-gradient(196deg, #f8d5c0, #ce8a70);
  background-image: linear-gradient(254deg, #f8d5c0, #ce8a70);
  margin: 15px;
  height: 100px;
  border-radius: 10px;
  position: relative;

  -webkit-box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);

  > div:first-child {
    display: flex;
    flex-direction: column;
    padding: 14px;
    background-image: url("/static/image/porn1/service/service_card.png");
    background-size: auto 100%;
    background-position: top 0 right 0;
    background-repeat: no-repeat;

    > div {
      height: 25px;
      line-height: 25px;
    }

    > div:first-child {
      font-size: 20px;
      display: flex;
      align-items: center;
    }

    > div:nth-child(2) {
      color: hsla(0, 0%, 100%, 0.5);
    }

    > div > img {
      width: 24px;
      height: 24px;
    }
  }
}

.info-card2 {
  margin-top: 20px;
  background-image: -webkit-linear-gradient(16deg, #8ab3e2, #b5d0ef);
  background-image: linear-gradient(74deg, #8ab3e2, #b5d0ef);

  > div:first-child {
    background: url("/static/image/porn1/service/service_card.png");
    background-size: auto 100%;
    background-position: top 0 right 0;
    background-repeat: no-repeat;
  }
}
//澳博客服
.info-card-aobo1,
.info-card2-aobo1 {
  color: white;
  background-image: -webkit-linear-gradient(196deg, #f8d5c0, #ce8a70);
  background-image: linear-gradient(254deg, #f8d5c0, #ce8a70);
  margin: 15px;
  height: 100px;
  border-radius: 10px;
  position: relative;

  -webkit-box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);

  > div:first-child {
    display: flex;
    flex-direction: column;
    padding: 14px;
    background-image: url("/static/image/aobo1/service/service_card.png");
    background-size: auto 100%;
    background-position: top 0 right 0;
    background-repeat: no-repeat;

    > div {
      height: 25px;
      line-height: 25px;
    }

    > div:first-child {
      font-size: 20px;
      display: flex;
      align-items: center;
    }

    > div:nth-child(2) {
      color: hsla(0, 0%, 100%, 0.5);
    }

    > div > img {
      width: 24px;
      height: 24px;
    }
  }
}

.info-card2-aobo1 {
  margin-top: 20px;
  background-image: -webkit-linear-gradient(16deg, #8ab3e2, #b5d0ef);
  background-image: linear-gradient(74deg, #8ab3e2, #b5d0ef);

  > div:first-child {
    background: url("/static/image/aobo1/service/service_card.png");
    background-size: auto 100%;
    background-position: top 0 right 0;
    background-repeat: no-repeat;
  }
}

//51客服
.info-card-sp1,
.info-card2-sp1 {
  color: white;
  background-image: -webkit-linear-gradient(196deg, #f8d5c0, #ce8a70);
  background-image: linear-gradient(254deg, #f8d5c0, #ce8a70);
  margin: 15px;
  height: 100px;
  border-radius: 10px;
  position: relative;

  -webkit-box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);

  > div:first-child {
    display: flex;
    flex-direction: column;
    padding: 14px;
    background-image: url("/static/image/sp1/service/service_card.png");
    background-size: auto 100%;
    background-position: top 0 right 0;
    background-repeat: no-repeat;

    > div {
      height: 25px;
      line-height: 25px;
    }

    > div:first-child {
      font-size: 20px;
      display: flex;
      align-items: center;
    }

    > div:nth-child(2) {
      color: hsla(0, 0%, 100%, 0.5);
    }

    > div > img {
      width: 24px;
      height: 24px;
    }
  }
}

.info-card2-sp1 {
  margin-top: 20px;
  background-image: -webkit-linear-gradient(16deg, #8ab3e2, #b5d0ef);
  background-image: linear-gradient(74deg, #8ab3e2, #b5d0ef);

  > div:first-child {
    background: url("/static/image/sp1/service/service_card.png");
    background-size: auto 100%;
    background-position: top 0 right 0;
    background-repeat: no-repeat;
  }
}

.btn-next {
  position: absolute;
  height: 100%;
  top: calc(50% - 7px);
  right: 14px;

  > img {
    height: 14px;
    width: 14px;
  }
}

.card-bg {
  height: 100%;
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
  right: 8px;
  bottom: 80px;
}

.tip-img {
  width: 50px;
  height: 50px;
  display: block;
  margin: 5px auto;
  img {
    width: 100%;
    height: 100%;
  }
}

.tip-text {
  width: fit-content;
  text-align: center;
  padding: 0 5px;
  margin: 0 auto;
  font-size: 8px;
  color: $main_button_text_color;
  background: $share_main_button_color;
  border-radius: 12px;
  box-shadow: 0pt 2px 5px 0pt rgba(0, 0, 0, 0.16);

  &.porn1 {
    background: $main_button_color;
  }
  &.sp1 {
    background: #000;
  }
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
  background: #f8f8f7;
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
      background: #be9e7f;
      border-radius: 9px 0 0 9px;
    }
  }

  .title,
  .content {
    margin: 0 17px;
    color: $main_text_color2;
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
      border: 1px solid $main_text_color2;
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
</style>
