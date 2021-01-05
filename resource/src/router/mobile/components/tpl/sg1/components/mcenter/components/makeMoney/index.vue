<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content">
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/sg1/mcenter/makeMoney/pic_promotion_banner.png`"
        />
      </div>
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/sg1/mcenter/makeMoney/img001.png`"
        />
        <span>{{ agentLink.agentCode }}</span>
        <div @click="copyCode" :class="$style['copy-btn']">
          复制
        </div>
      </div>
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/sg1/mcenter/makeMoney/img002.png`"
        />
      </div>
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/sg1/mcenter/makeMoney/btn_promote.png`"
        />
      </div>
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/sg1/mcenter/makeMoney/img003.png`"
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
import yaboRequest from "@/api/yaboRequest";

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      yToken: ""
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
      query.domain
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
            this.yToken = res.data.data;
            setCookie("y_token", res.data.data);
            console.log("authToken:", res.data.data);

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
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      agentLink: "getAgentLink",
      promotionLink: "getPromotionLink"
    }),
    headerConfig() {
      return {
        prev: true,
        title: "推广赚钱",
        customLinkTitle: this.$route.query.check ? "" : "礼金明细",
        customLinkAction: () => {
          this.$router.push("/mobile/mcenter/tcenter/recommendGift");
        },
        onClick: () => {
          this.$router.back();
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
  beforeCreate() {
    if (this.$route.query && this.$route.query.refresh) {
      window.location.replace("/mobile/mcenter/makeMoney");
      return;
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionSetAgentLink"]),
    copyCode() {
      this.$copyText(this.getAgentLink).then(() => {
        this.actionSetGlobalMessage({ msg: "复制成功" });
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

  img {
    display: block;
    max-width: 100%;
  }

  span {
    position: absolute;
    bottom: 4vw;
    left: 46%;
    font-weight: 700;
    color: #424654;
  }

  .copy-btn {
    padding: 6px 10px;
    position: absolute;
    bottom: calc(4vw - 3px);
    right: 4%;
    font-weight: 700;
    color: #000000;
    background-image: url("/static/image/sg1/mcenter/makeMoney/img001_btn.png");
    background-size: 48px auto;
  }
}
</style>
