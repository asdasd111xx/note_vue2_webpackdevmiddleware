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

      <div :class="$style['info-card']" @click="clickService(2)">
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
              $getCdnPath(`/static/image/_new/webview/ic_service_arrow.png`)
            "
          />
        </div>
      </div>

      <div :class="$style['info-card2']" @click="clickService">
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
              $getCdnPath(`/static/image/_new/webview/ic_service_arrow.png`)
            "
          />
        </div>
      </div>

      <div
        :class="$style['tip-block']"
        @click="clickPopTip"
        :style="hasPrev ? { bottom: '15px' } : {}"
      >
        <div :class="$style['tip-img']">
          <img
            :src="$getCdnPath(`/static/image/_new/service/appicon_yabo.png`)"
          />
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
                  '/static/image/_new/service/popup/popup_ic_close.png'
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
                    '/static/image/_new/service/popup/popup_img01.png'
                  )
                "
                alt="img01"
              />
            </div>
            <span
              >尊敬的鸭博娱乐会员，当iOS用户的鸭博娱乐App掉签无法打开时，可以通过以下方法继续游戏</span
            >
          </div>

          <div :class="$style['content']">
            <div :class="$style['content-cell']">
              <span>1.通过鸭博娱乐图标上的网址，重新下载App：</span>
              <div :class="$style['content-img']">
                <img
                  :src="
                    $getCdnPath(
                      '/static/image/_new/service/popup/popup_img02.png'
                    )
                  "
                  alt="img02"
                />
              </div>
            </div>

            <div :class="$style['content-cell']">
              <span>2.收藏鸭博娱乐永久网址，浏览器打开，随时畅玩：</span>
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
      hasPrev: true,
      divHeight: 0,
      isShowPop: false,
      linkArray: [],
      avatarSrc: `/static/image/common/mcenter/avatar_nologin.png`
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

    this.divHeight = document.body.offsetHeight - 60;

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
  background-image: url("/static/image/_new/service/header_bg.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: 0 -70px;
  background-repeat: no-repeat;
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
    background-image: url("/static/image/_new/service/service_card.png");
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

.info-card2 {
  margin-top: 20px;
  background-image: -webkit-linear-gradient(16deg, #8ab3e2, #b5d0ef);
  background-image: linear-gradient(74deg, #8ab3e2, #b5d0ef);
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
  right: 20px;
  bottom: 65px;
}

.tip-img {
  width: 65px;
  height: 65px;

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
  font-size: 12px;
  color: #fff;
  background: #be9e7f;
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
    height: 80px;

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
        background: url("/static/image/_new/service/popup/popup_ic_search.png")
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
