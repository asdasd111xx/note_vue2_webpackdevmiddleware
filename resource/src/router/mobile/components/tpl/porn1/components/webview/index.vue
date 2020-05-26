<template>
  <div :class="$style['content']">
    <div :class="$style['header']">
      <div :class="$style['header-background']">
        <img :src="$getCdnPath('/static/image/_new/webview/bg_service_app02.png')" alt="background">
      </div>

      <div :class="$style['header-desc']">
        <div>我的客服</div>
        <div>24小时为您服务</div>
      </div>

      <div :class="$style['header-icon']">
        <div
          :class="$style['icon']"
          v-for="(item, index) in iconList"
          :key="index"
        >
          <div :class="$style['img']">
            <img :src="$getCdnPath(item.imgSrc)" alt="icon" />
          </div>
          <div :class="$style['text']">{{ item.text }}</div>
        </div>
      </div>
    </div>

    <div :class="$style['card-wrap']">
      <div
        v-if="isIos"
        :class="$style['card']"
        v-for="(item, index) in iosCard"
        :key="'iOS-' + index"
      >
        <div :class="$style['img']">
          <img :src="$getCdnPath(yaboIconSrc)" alt="icon" />
        </div>
        <div>
          <div :class="$style['text']">{{ item.text }}</div>
          <div :class="$style['download']" @click="item.onClick">
            立即下载
          </div>
        </div>
      </div>

      <!-- <div v-if="isIos" :class="[$style['card'], $style['isSingle']]">
                <div :class="[$style['img'], $style['isSingle']]">
                    <img :src="$getCdnPath(yaboIconSrc)" alt="icon" />
                </div>
                <div :class="$style['isSingle']">
                    <div :class="$style['text']">IOS版</div>
                    <div :class="$style['download']" @click="download">
                        立即下载
                    </div>
                </div>
            </div> -->

      <div v-if="!isIos" :class="[$style['card'], $style['isSingle']]">
        <div :class="[$style['img'], $style['isSingle']]">
          <img :src="$getCdnPath(yaboIconSrc)" alt="icon" />
        </div>
        <div :class="$style['isSingle']">
          <div :class="$style['text']">鸭脖直播APP</div>
          <div :class="$style['download']" @click="download">
            立即下载
          </div>
        </div>
      </div>
    </div>

    <div :class="$style['info-card']" @click="clickService">
      <div>
        <div>
          <img
            :src="$getCdnPath(`/static/image/_new/webview/ic_service01.png`)"
          />
          &nbsp;
          <span>在线客服1</span>
        </div>
        <div>Main Customer Support</div>
        <div>7*24小时专线服务 贴心至上</div>
      </div>

      <div :class="$style['btn-next']">
        <img
          :src="$getCdnPath(`/static/image/_new/webview/ic_service_arrow.png`)"
        />
      </div>
    </div>

    <div :class="$style['info-card2']" @click="clickService">
      <div>
        <div>
          <img
            :src="$getCdnPath(`/static/image/_new/webview/ic_service02.png`)"
          />
          &nbsp;
          <span>在线客服2</span>
        </div>
        <div>Reserve Customer Support</div>
        <div>7*24小时专线服务 贴心至上</div>
      </div>

      <div :class="$style['btn-next']">
        <img
          :src="$getCdnPath(`/static/image/_new/webview/ic_service_arrow.png`)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mobileLinkOpen from "@/lib/mobile_link_open";
import bbosRequest from "@/api/bbosRequest";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isIos: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      iconList: [
        {
          text: "多种玩法",
          imgSrc: "/static/image/_new/webview/ic_service03.png"
        },
        {
          text: "存取便捷",
          imgSrc: "/static/image/_new/webview/ic_service04.png"
        },
        {
          text: "专业客服",
          imgSrc: "/static/image/_new/webview/ic_service05.png"
        }
      ],
      yaboIconSrc: "/static/image/_new/webview/appicon_yabo.png",
      iosCard: [
        {
          text: "极速版",
          onClick: () => {
            this.download(
              2,
              "yaboxxxapp01.com.platformG"
            );
          }
        },
        // {
        //     text: "IOS版",
        //     onClick: () => {
        //         if (this.iOSBundle) {
        //             this.download(1, this.iOSBundle);
        //         }
        //     }
        // },
        {
          text: "隐藏版",
          onClick: () => {
            window.open(
              "https://apps.apple.com/cn/app/id1507102732",
              "_blank"
            );
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    iOSBundle() {
      switch (this.memInfo.user.domain) {
        case "500015":
          return "bbin.mobile.xbbPorn.qa";
          break;

        case "69":
          return "chungyo.foxyporn.stage.enterprise";
          break;

        case "67":
          return "chungyo.foxyporn.prod.enterprise";
          break;

        default:
          break;
      }
    }
  },
  methods: {
    mobileLinkOpen,
    clickService() {
      this.mobileLinkOpen({ linkType: "static", linkTo: "service" });
    },
    download(platform, bundleID) {
      // platform: 1 -> PWA , 2 -> iOS
      bbosRequest({
        method: "get",
        url: this.siteConfig.BBOS_DOMIAN + "/App/Download",
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: {
          bundleID,
          lang: "zh-cn",
          platform
        }
      }).then(res => {
        if (res.status === "000" && res.data) {
          location.href = res.data.url;
        }
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.content {
  position: relative;
  width: 100%;
}

.header {
  position: relative;
  height: 300px;
}

.header-background {
    position: relative;
    width: 100%;
    height: 100%;
    img {
        width: 100%;
        height: 100%;
    }
}

.header-desc,
.header-icon {
  margin-left: 20px;
}

.header-desc {
  position: absolute;
  top: 40%;
  color: #fff;
  transform: translateY(-50%);

  div:first-of-type {
    font-weight: 700;
    font-size: 26px;
    line-height: 26px;
    letter-spacing: 1.5px;
    margin-bottom: 5px;
  }
}

.header-icon {
  position: absolute;
  top: 70%;
  transform: translateY(-50%);
  display: flex;

  .icon {
    padding-right: 10px;

    .img {
      width: 28px;
      height: 28px;
      margin: auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .text {
      color: #bf8646;
      font-size: 10px;
      margin-top: 2.5px;
    }
  }
}

.card-wrap {
  position: relative;
  display: flex;
  justify-content: space-around;
  margin: -50px 14px 0;

  .card {
    // width: 30%;
    flex: 1;
    background: #fff;
    border-radius: 7px;
    box-shadow: 0 3px 7px 0px rgba(0, 0, 0, 0.05);
    text-align: center;

    &.isSingle {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 0;
    }

    .img {
      width: 50px;
      height: 50px;
      margin: 20px auto 0;

      &.isSingle {
        margin: 0;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .isSingle {
      text-align: left;
      margin-left: 15px;
    }

    .text {
      color: $main_text_color3;
      padding: 10px 0;
      font-weight: 700;
    }

    .download {
      display: inline-block;
      color: #be9e7f;
      font-size: 12px;
      padding: 4px 12px;
      margin-bottom: 15px;
      border: 1px solid #be9e7f;
      border-radius: 3px;
    }
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
    background-image: url("/static/image/_new/webview/bg_service01.png");
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

  > div:first-child {
    background-image: url("/static/image/_new/webview/bg_service02.png");
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
</style>
