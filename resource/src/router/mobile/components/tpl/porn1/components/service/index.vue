<template>
  <mobile-container :class="$style.container">
    <div
      slot="content"
      :class="$style['content-wrap']"
      :style="{ height: this.divHeight + 'px' }"
    >
      <div :class="$style['service-header']">
        <div :class="$style['btn-prev']" @click="$router.back()">
          <img :src="$getCdnPath('/static/image/_new/common/btn_back_w.png')" />
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
      <message v-if="msg" @close="msg = ''">
        <div slot="msg">{{ msg }}</div>
      </message>
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

      <div :class="$style['info-card']" @click="clickService">
        <div>
          <div>
            <img
              :src="$getCdnPath(`/static/image/_new/service/ic_service01.png`)"
            />
            &nbsp;
            <span>在线客服1</span>
          </div>
          <div>Main Customer Support</div>
          <div>7*24小时专线服务 贴心至上</div>
        </div>

        <div :class="$style['btn-next']">
          <img :src="$getCdnPath(`/static/image/_new/common/btn_next.png`)" />
        </div>
      </div>

      <div :class="$style['info-card2']" @click="clickService">
        <div>
          <div>
            <img
              :src="$getCdnPath(`/static/image/_new/service/ic_service02.png`)"
            />
            &nbsp;
            <span>在线客服2</span>
          </div>
          <div>Reserve Customer Support</div>
          <div>7*24小时专线服务 贴心至上</div>
        </div>

        <div :class="$style['btn-next']">
          <img :src="$getCdnPath(`/static/image/_new/common/btn_next.png`)" />
        </div>
      </div>

      <div :class="$style['tip-block']" @click="clickPopTip">
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
import { mapGetters } from "vuex";
import mobileContainer from "../common/new/mobileContainer";
import message from "../common/new/message";
import mobileLinkOpen from "@/lib/mobile_link_open";
import yaboRequest from '@/api/yaboRequest';

export default {
  components: {
    mobileContainer,
    message
  },
  data() {
    return {
      msg: "",
      imgID: 0,
      imgIndex: 0,
      avatar: [
        {
          image: "avatar_1",
          url: "/static/image/_new/mcenter/default/avatar_1.png"
        },
        {
          image: "avatar_2",
          url: "/static/image/_new/mcenter/default/avatar_2.png"
        },
        {
          image: "avatar_3",
          url: "/static/image/_new/mcenter/default/avatar_3.png"
        },
        {
          image: "avatar_4",
          url: "/static/image/_new/mcenter/default/avatar_4.png"
        },
        {
          image: "avatar_5",
          url: "/static/image/_new/mcenter/default/avatar_5.png"
        },
        {
          image: "avatar_6",
          url: "/static/image/_new/mcenter/default/avatar_6.png"
        }
      ],
      divHeight: 0,
      isShowPop: false,
      linkArray: []
    };
  },
  created() {
    if (this.memInfo.user.image === 0) {
      this.imgIndex = 1;
      this.imgID = 1;
      return;
    }
    this.imgIndex = this.memInfo.user.image;
    this.imgID = this.memInfo.user.image;


  },
  mounted() {
    this.divHeight = document.body.offsetHeight - 60;

    yaboRequest({
      method: "get",
      url: `${this.siteConfig.YABO_API_DOMAIN}/system/downloadlink`,
      headers: {
        'x-domain': this.memInfo.user.domain
      }
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
    avatarSrc() {
      return !this.loginStatus
        ? this.$getCdnPath(
          "/static/image/_new/mcenter/avatar_nologin.png"
        )
        : this.$getCdnPath(
          `/static/image/_new/mcenter/default/avatar_${this.imgIndex}.png`
        );
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
    clickService() {
      mobileLinkOpen({ linkType: "static", linkTo: "service" });
    },
    clickPopTip() {
      this.isShowPop = true;
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
  background-position: 0 -60px;
  background-repeat: no-repeat;
}

.content-wrap {
  position: relative;
}

.avatar-info-wrap {
  height: 90px;
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: white;
  margin: 0 14px;
  margin-top: 25px;
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
  bottom: 20px;
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
</style>
