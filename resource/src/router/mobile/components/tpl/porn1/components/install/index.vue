<script>
//localStorage.setItem("service-app-bundleID",
//我的｜客服-> 立即收藏｜下載客服->連iframe到 www/static/tpl/install/index.html
//index.html getItem("service-app-bundleID"  發送/xbb/App/Download請求取得桌面客服的連結並下載
</script>
<template>
  <div :class="$style['container']">
    <div :class="$style['btn-prev']" @click="backPre">
      <img
        :src="$getCdnPath(`/static/image/common/btn_back_black.png`)"
        alt="back"
      />
    </div>
    <div :class="$style['contain-page']">
      <div :class="$style['app-info']">
        <div :class="$style['app-logo']">
          <img
            id="appicon"
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.ROUTER_TPL}/install/service_appicon_1.png`
              )
            "
          />
        </div>
        <div :class="$style['app-info-rig']">
          <strong :class="$style['site-name']">
            {{ `${siteConfig.SITE_NAME}客服` }}</strong
          >
          <p>娱乐</p>
          <div :class="$style['clr']">
            <div :class="$style['btn']" @click="download">免费安装</div>
          </div>
        </div>
      </div>
      <!-- 评价 -->
      <div :class="$style['app-show']">
        <div :class="$style['app-age']">
          <strong>4+</strong>
          <p>年龄</p>
        </div>
        <div :class="$style['app-score']">
          <strong>4.9</strong
          ><img :src="$getCdnPath(`/static/image/common/install/star.png`)" />
          <p><span :class="$style['down-count']"> 10</span>个评分</p>
        </div>
      </div>
      <!-- 图片展示 -->

      <!-- intro -->
      <div :class="$style['app-intro']">
        <h2 :class="$style['app-title']">
          简介
        </h2>
        <div :class="$style['app-intro-con']" style="height: auto;">
          <p>
            【官方直营】线上娱乐首选！整合所有游戏，一机畅玩所有游戏厅！创造经典，无线革新！
          </p>
        </div>
      </div>
      <!-- 评分及评论 -->
      <div :class="$style['comment-box']">
        <h2 :class="$style['app-title']">
          评分及评论
        </h2>
        <div :class="$style['comment-con']">
          <div :class="$style['comment-right']">
            <ul :class="$style['comment-star-list']">
              <li>
                <div :class="$style['comment-star']">
                  <img
                    :src="$getCdnPath(`/static/image/common/install/star.png`)"
                  />
                  <div></div>
                </div>
                <div :class="$style['comment-progress']">
                  <div></div>
                </div>
              </li>
              <li>
                <div :class="$style['comment-star']">
                  <img
                    :src="$getCdnPath(`/static/image/common/install/star.png`)"
                  />
                  <div></div>
                </div>
                <div :class="$style['comment-progress']">
                  <div></div>
                </div>
              </li>
              <li>
                <div :class="$style['comment-star']">
                  <img
                    :src="$getCdnPath(`/static/image/common/install/star.png`)"
                  />
                  <div></div>
                </div>
                <div :class="$style['comment-progress']">
                  <div></div>
                </div>
              </li>
              <li>
                <div :class="$style['comment-star']">
                  <img
                    :src="$getCdnPath(`/static/image/common/install/star.png`)"
                  />
                  <div></div>
                </div>
                <div :class="$style['comment-progress']">
                  <div></div>
                </div>
              </li>
              <li>
                <div :class="$style['comment-star']">
                  <img
                    :src="$getCdnPath(`/static/image/common/install/star.png`)"
                  />
                  <div></div>
                </div>
                <div :class="$style['comment-progress']">
                  <div></div>
                </div>
              </li>
            </ul>
            <p><span :class="$style['down-count']"> 10</span>个评分</p>
          </div>
          <div :class="$style['comment-left']">
            <strong>4.9</strong>
            <p>满分 5 分</p>
          </div>
        </div>
      </div>
      <!-- 版本号 -->
      <div :class="$style['app-intro']">
        <h2 :class="$style['app-title']">
          新功能
        </h2>
        <div :class="$style['app-intro-con']" style="height: auto;">
          <p>版本 unknown</p>
        </div>
      </div>
      <!-- 信息 -->
      <div :class="$style['information-box']">
        <h2 :class="$style['app-title']">
          信息
        </h2>
        <ul :class="$style['information-list']">
          <li>
            <span :class="$style['l']"> 销售商</span>
            <div :class="$style['r']"></div>
          </li>
          <li>
            <span :class="$style['l']"> 大小</span>
            <div :class="$style['r']">
              KB
            </div>
          </li>
          <li>
            <span :class="$style['l']"> 类别</span>
            <div :class="[$style['r'], $style['blue-color']]">
              娱乐
            </div>
          </li>
          <li>
            <span :class="$style['l']"> 兼容性</span>
            <div :class="$style['r']">
              <p>
                需要 iOS 8.0 或更高版本。与 iPhone、iPad 和 iPod touch 兼容。
              </p>
            </div>
          </li>
          <li>
            <span :class="$style['l']"> 语言</span>
            <div :class="$style['r']">
              简体中文
            </div>
          </li>
          <li>
            <span :class="$style['l']"> 年龄分级</span>
            <div :class="$style['r']">
              限4岁以上
            </div>
          </li>
          <li>
            <span :class="$style['l']"> 价格</span>
            <div :class="$style['r']">
              免费
            </div>
          </li>
          <li>
            <span :class="[$style['l'], $style['blue-color']]"> 隐私政策</span>
            <div :class="$style['r']"></div>
          </li>
        </ul>
      </div>
      <!-- 免责声明 -->
      <div :class="$style['disclaimer']">
        免责声明：<br />
        本网站仅提供下载托管，App内容相关事项由开发者负责，与本网站无关。
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  data() {
    return {
      isDownloadPub: false,
      bundleIDList: {
        67: "yaboxxxapp01.com.mobile.webview",
        69: "yb0t.66relish.com/mobile/webview",
        100003: "ybbe1.777vendor.com/mobile/webview",
        500015: "yb01.66boxing.com/mobile/webview",

        41: "",
        74: "",
        100004: "",
        500023: "",

        80: "siguaxxxapp01.com.mobile.webview",
        81: "sgt.66relish.com.mobile.webview",
        100009: "sgbe1.grtymart.com/mobile/webview",
        500035: "sgtt.66boxing.com.mobile.webview",

        92: "aupr1.688lg.com.mobile.webview",
        93: "aude1.688lg.com.mobile.webview",
        9999894: "auqa1.66boxing.com/mobile/webview",

        94: "sppr1.688lg.com.mobile.webview",
        95: "spde1.688lg.com.mobile.webview",
        9999905: "spqa1.66boxing.com/mobile/webview"
      }
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    })
  },

  mounted() {
    document.getElementsByClassName(
      this.$style["contain-page"]
    )[0].style.height = document.documentElement.clientHeight + "px";
  },
  methods: {
    backPre() {
      this.$router.back();
    },

    download() {
      goLangApiRequest({
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/App/Download`,
        params: {
          bundleID: this.bundleIDList[this.memInfo.user.domain],
          platform: 2
        }
      }).then(res => {
        if (res.errorCode === "00" && res.status === "000") {
          let a = document.createElement("a");
          a.href = res.data.url;
          a.click();
          const focusHandler = () => {
            if (this.isDownloadPub) return;
            this.isDownloadPub = true;
            window.location.href = "/pub.mobileprovision";
            window.removeEventListener("focus", focusHandler);
          };

          window.addEventListener("focus", focusHandler);
        }
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "./index.scss";
.container {
  position: relative;
  overflow: hidden;
  padding-bottom: 40px;
}

.btn-prev {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 20px;
  height: 20px;
  margin: auto;

  > img {
    display: block;
    width: 100%;
  }
}

iframe {
  width: 100%;
  overflow: hidden;
}
</style>
