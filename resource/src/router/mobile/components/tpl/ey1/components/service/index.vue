<template>
  <mobile-container :class="$style.container" :has-footer="!hasPrev">
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style['service-header']">
        <div v-if="hasPrev" :class="$style['btn-prev']" @click="handleBack()">
          <img :src="$getCdnPath(`/static/image/ey1/common/btn_back.png`)" />
        </div>

        <div :class="$style.title">我的客服</div>
        <div
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

      <div :class="$style['info-card']" @click="clickService()">
        <div>
          <div>
            <img
              :src="
                $getCdnPath(`/static/image/common/service/ic_service01.png`)
              "
            />
            &nbsp;
            <span>在线客服</span>
          </div>
          <div>Main Customer Support</div>
          <div>7*24小时专线服务 贴心至上</div>
        </div>

        <div :class="$style['btn-next']">
          <img
            :src="$getCdnPath(`/static/image/ey1/webview/ic_service_arrow.png`)"
          />
        </div>
      </div>

      <div
        :class="$style['tip-block']"
        @click="clickPopTip"
        :style="hasPrev ? { bottom: '15px' } : {}"
      >
        <div :class="$style['tip-img']">
          <img :src="$getCdnPath(`/static/image/ey1/service/appicon.png`)" />
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
                  '/static/image/ey1/service/popup/popup_ic_close.png'
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
                  $getCdnPath('/static/image/ey1/service/popup/popup_img01.png')
                "
                alt="img01"
              />
            </div>
            <span>
              尊敬的亿元会员，当iOS用户的亿元App掉签无法打开时，可以通过以下方法继续游戏
            </span>
          </div>

          <div :class="$style['content']">
            <div :class="$style['content-cell']">
              <span>1.通过亿元图标上的网址，重新下载APP：</span>
              <img
                :class="$style['url-image']"
                :src="
                  $getCdnPath('/static/image/ey1/service/popup/popup_img02.png')
                "
                alt="img02"
              />
            </div>

            <div :class="$style['content-cell']">
              <span>2.收藏亿元永久网址，浏览器打开，随时畅玩：</span>
              <div :class="$style['content-link']">
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
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../common/mobileContainer";
import mobileLinkOpen from "@/lib/mobile_link_open";
import yaboRequest from "@/api/yaboRequest";
import goLangApiRequest from "@/api/goLangApiRequest";
import axios from "axios";

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      imgID: 0,
      imgIndex: 0,
      isShowPop: false,
      linkArray: [],
      avatarSrc: `/static/image/common/mcenter/avatar_nologin.png`,
      hasPrev: true
    };
  },
  created() {
    // 跳轉頁面需要有返回及不顯示tabbar
    if (this.$route.query.prev !== undefined) {
      this.hasPrev = this.$route.query.prev === "true";
    }
  },
  mounted() {
    this.actionSetUserdata(true).then(() => {
      this.getAvatarSrc();
    });

    // yaboRequest({
    //   method: "get",
    //   url: `${this.siteConfig.YABO_API_DOMAIN}/system/downloadlink`,
    //   headers: {
    //     'x-domain': this.memInfo.user.domain
    //   }
    // }).then(res => {
    //   if (res && res.data) {
    //     this.linkArray = res.data;
    //   }
    // });

    goLangApiRequest({
      method: "get",
      url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/System/downloadlink`
    }).then(res => {
      if (res && res.data) {
        this.linkArray = res.data;
      }
    });
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
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
    ...mapActions(["actionSetUserdata"]),
    handleBack() {
      const redirect = this.$route.query.redirect;
      switch (redirect) {
        default:
          this.$router.back();
          break;
      }
    },
    clickService(type = "") {
      mobileLinkOpen({ linkType: "static", linkTo: `service${type}` });
    },
    clickPopTip() {
      this.isShowPop = true;
    },
    getAvatarSrc() {
      if (!this.loginStatus) return;

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
  background-image: url("/static/image/ey1/service/bg_service.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: 0 -40px;
  background-repeat: no-repeat;
}

@media (orientation: landscape) {
  div.container {
    background-position: 0 -40%;
  }
}

.avatar-info-wrap {
  height: 90px;
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: white;
  margin: 0 14px;
  margin-top: 30px;
  border-radius: 5px;

  -webkit-box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);

  .info-wrap {
    padding: 10px;
    height: 100%;

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
  color: white;
  background: linear-gradient(to left, #f6d2bd, #e5997a);
  box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.15);
  margin: 15px;
  height: 100px;
  border-radius: 10px;
  position: relative;

  > div:first-child {
    display: flex;
    flex-direction: column;
    padding: 14px;
    background-image: url("/static/image/ey1/service/bg_service01.png");
    background-size: auto 100%;
    background-position: top 0 right 0;
    height: 100%;
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

.tip-block {
  position: absolute;
  right: 20px;
  bottom: 65px;
}

.tip-img {
  width: 60px;
  height: 60px;
  margin: 0 auto;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.tip-text {
  width: fit-content;
  text-align: center;
  padding: 0 5px;
  margin: 0 auto;
  font-size: 12px;
  color: #fff;
  background: #e42a30;
  border-radius: 12px;
  box-shadow: 0pt 2px 5px 0pt rgba(0, 0, 0, 0.16);
  margin-top: 5px;
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
    top: -25px;
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
      background: #e42a30;
      border-radius: 9px 0 0 9px;
    }
  }

  .title,
  .content {
    margin: 5px 17px;
    color: $main_text_color2;
    font-size: 12px;
  }

  .title-img {
    width: 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .content-cell {
    margin-top: 12px;

    span {
      padding: 2px 0;
    }

    .content-img {
      width: 100%;
      height: 100px;

      img {
        width: 100%;
        height: 100%;
      }
    }
    .content-link {
      width: 100%;
      height: 100%;
      background-color: #f7f7f7;
      border-radius: 10px;
      padding: 3px;
    }
    .link {
      position: relative;
      width: 180px;
      margin: 10px auto;
      background: #ffffff;
      border: 1px solid $main_text_color2;
      border-radius: 10px;
      color: #414655;
      text-align: center;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        background: url("/static/image/_new/service/popup/popup_ic_search.png")
          no-repeat;
        width: 12px;
        height: 12px;
        background-size: cover;
      }
    }

    .url-image {
      width: 100%;

      > img {
        width: 100%;
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
