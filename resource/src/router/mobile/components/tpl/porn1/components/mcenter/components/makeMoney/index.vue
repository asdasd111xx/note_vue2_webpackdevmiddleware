<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content">
      <div v-if="['porn1', 'sg1'].includes(routerTPL) && showOldVersion">
        <div :class="$style['img-wrap']">
          <img
            :class="$style['img-wrap']"
            :src="
              `/static/image/porn1/mcenter/makeMoney/pic_promotion_banner.png`
            "
          />
        </div>
        <div :class="$style['img-wrap']">
          <img
            :class="$style['img-wrap']"
            :src="`/static/image/porn1/mcenter/makeMoney/img001.png`"
          />
          <span :class="$style['agent-code']">{{ agentLink.agentCode }}</span>
          <div @click="copyCode" :class="$style['copy-btn']">
            复制
          </div>
        </div>
        <div :class="$style['img-wrap']">
          <img
            :class="$style['img-wrap']"
            :src="`/static/image/porn1/mcenter/makeMoney/img002.png`"
          />
        </div>
        <!-- <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/porn1/mcenter/makeMoney/btn_promote.png`"
        />
      </div> -->
        <!-- <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/porn1/mcenter/makeMoney/img003.png`"
        />
      </div> -->
        <!-- <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/porn1/mcenter/makeMoney/btn_promote2.png`"
        />
      </div> -->
        <div :class="$style['img-wrap']">
          <img
            :class="$style['img-wrap']"
            :src="`/static/image/porn1/mcenter/makeMoney/img004.png`"
          />
        </div>
      </div>
      <div v-else :class="$style['iframe-wrap']">
        <iframe
          v-if="src"
          :src="src"
          :class="$style['iframe-item']"
          @load="onLoadiframe"
        />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { getCookie, setCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import mobileContainer from "../../../common/mobileContainer";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      isShowPromotion: false,
      src: "",
      // 舊版推廣賺錢
      showOldVersion: false,
      contentTitle: ""
    };
  },
  created() {
    const query = this.$route.query;

    if (query && query.cid) {
      setCookie("cid", "");
      setCookie("y_token", "");
      this.actionSetAgentLink({ reqHeaders: { cid: this.$route.query.cid } });
      setCookie("cid", query.cid);
    } else {
      this.actionSetAgentLink();
    }

    if (
      query &&
      query.check &&
      query.cid &&
      query.userid &&
      query.tagId &&
      query.domain &&
      query.check === "true"
    ) {
      let cid = query.cid,
        userid = query.userid || query.userId,
        tagId = query.tagId,
        domain = query.domain;

      setCookie("cid", cid);

      let _headers = {
        cid: cid,
        "x-domain": domain
      };

      axios({
        method: "get",
        url: this.siteConfig.YABO_API_DOMAIN + "/Account/GetAuthorizationToken",
        headers: _headers
      })
        .then(res => {
          if (res.data && res.data.data) {
            setCookie("y_token", res.data.data);

            axios({
              method: "put",
              url: `${this.siteConfig.YABO_API_DOMAIN}/Account/UnlockTagId`,
              headers: {
                cid: cid,
                "x-domain": query.domain,
                AuthToken: res.data.data
              },
              data: {
                cid: cid,
                userid: userid,
                tagId: Number(tagId),
                domain: domain
              }
            })
              .then(res => {
                console.log(res);
              })
              .catch(e => {
                console.log(e);
              });

            return;
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      if (this.loginStatus) {
        this.actionSetUserdata(true).then(() => {
          // 我的推廣開關 && 禮金開關需同時開啟，才顯示禮金明細
          this.isShowPromotion =
            this.memInfo.user.show_promotion && this.memInfo.config.festival;
          localStorage.setItem("is-show-promotion", this.isShowPromotion);
        });
      } else {
        this.isShowPromotion = true;
        return;
      }
    }
  },
  mounted() {
    document.getElementById("mobile-wrap").scrollTo(0, 0);
    this.embeddedLink();
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      agentLink: "getAgentLink",
      promotionLink: "getPromotionLink"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    headerConfig() {
      let hasRecommendGift = this.isShowPromotion;
      return {
        prev: true,
        title: this.contentTitle,
        customLinkTitle:
          this.$route.query.check || !hasRecommendGift ? "" : "礼金明细",
        customLinkAction: () => {
          this.$router.push(
            "/mobile/mcenter/tcenterManageRebate/recommendGift/today?giftDetail=1&redirect=mobile/mcenter/home"
          );
        },
        onClick: () => {
          if (this.$route.query.giftDetail) {
            // this.$router.push("/mobile/mcenter/home");
            this.$router.replace(
              "/mobile/mcenter/tcenterManageRebate/recommendGift/today?giftDetail=1&redirect=mobile/mcenter/home"
            );
          } else {
            this.$router.back();
          }
        }
      };
    },
    /**
     * 推廣連結
     * @method agentLink
     * @returns {String} 推廣連結
     */
    getAgentLink() {
      if (this.promotionLink) {
        return this.promotionLink;
      }

      if (!this.agentLink.domain || !this.agentLink.agentCode) {
        return "";
      }

      return `https://${this.agentLink.domain}/a/${this.agentLink.agentCode}`;
    }
  },
  beforeDestroy() {
    window.removeEventListener("message", this.onListener);
  },
  beforeCreate() {
    if (this.$route.query && this.$route.query.refresh) {
      window.location.replace("/mobile/mcenter/makeMoney");
      return;
    }
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionSetAgentLink",
      "actionSetUserdata"
    ]),
    onListener(e) {
      if (e && e.data && e.data.event) {
        const event = e.data.event;
        switch (event) {
          case "EVENT_THIRDPARTY_CLOSE":
            this.$router.back();
            return;
        }
      }
    },
    onLoadiframe(event) {
      try {
        window.addEventListener("message", this.onListener);
      } catch (e) {
        console.log("onbeforeunload Catch:", e);
      }
    },
    copyCode() {
      this.$copyText(this.getAgentLink).then(() => {
        this.actionSetGlobalMessage({ msg: "复制成功" });
      });
    },
    embeddedLink() {
      let target = "promotion_earn";
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
        params: {
          urlName: target,
          lang: "zh-cn",
          needToken: "true",
          externalCode: "promotion"
        }
      }).then(res => {
        this.isLoading = false;
        if (res && res.data && res.data.uri) {
          this.src = res.data.uri;
        }

        if (res && res.msg) {
          this.actionSetGlobalMessage({ msg: res.msg });
          return;
        }

        // 標題
        goLangApiRequest({
          method: "get",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Promotion/List`,
          params: {
            lang: "zh-cn"
          }
        }).then(res => {
          if (res.status === "000") {
            let promotionId = this.src.split("?")[0].split("/")[
              this.src.split("?")[0].split("/").length - 1
            ];

            if (!promotionId) {
              this.contentTitle = "";
              return;
            }

            res.data.ret.forEach(promo => {
              if (promo.link.includes(promotionId)) {
                this.contentTitle = promo.name;
              }
            });
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" module>
.container {
  position: relative;
  background-color: #f8f8f7;
}

.img-wrap {
  position: relative;
  width: 100%;

  img {
    display: block;
    width: 100%;
  }

  .copy-btn {
    padding: 3px 10px;
    position: absolute;
    bottom: calc(4vw - 3px);
    right: 5%;
    font-weight: 700;
    color: #fff;
    background: #bd9d7d;
    background-image: -webkit-linear-gradient(top, #bd9d7d, #f9ddbd);
    background-image: linear-gradient(top, #bd9d7d, #f9ddbd);
    border-radius: 20px;
  }
}

.agent-code {
  font-size: 14px;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
  font-weight: 700;
  text-align: center;
  color: #997458;
  position: absolute;
  bottom: 4vw;
  left: 46%;
}

.iframe-wrap {
  width: 100%;
  height: calc(100vh - 43px);
  background-color: #fff;

  .iframe-item {
    border: none;
    display: block;
    height: 100%;
    padding: 0;
    width: 100%;
  }
}
</style>
