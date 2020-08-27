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
          :src="`/static/image/_new/mcenter/makeMoney/pic_promotion_banner.png`"
        />
      </div>
      <div :class="$style['img-wrap']">
        <img
          @click="copyCode"
          :class="$style['img-wrap']"
          :src="`/static/image/_new/mcenter/makeMoney/img001.png`"
        />
        <span>{{ agentCode }}</span>
        <div :class="$style['copy-btn']">
          复制
        </div>
      </div>
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/_new/mcenter/makeMoney/img002.png`"
        />
      </div>
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/_new/mcenter/makeMoney/btn_promote.png`"
        />
      </div>
      <div :class="$style['img-wrap']">
        <img
          :class="$style['img-wrap']"
          :src="`/static/image/_new/mcenter/makeMoney/img003.png`"
        />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { API_PROMOTION_INFO } from "@/config/api";
import { getCookie, setCookie } from '@/lib/cookie';
import { mapGetters, mapActions } from 'vuex';
import axios from "axios";
import mobileContainer from "../../../common/mobileContainer";
import yaboRequest from '@/api/yaboRequest';

export default {
  components: {
    mobileContainer,
  },
  data() {
    return {
      msg: "",
      domain: "",
      agentCode: "",
      yToken: ''
    };
  },
  watch: {
    yToken() {
      const query = this.$route.query;

      yaboRequest({
        method: 'put',
        url: `${this.siteConfig.YABO_API_DOMAIN}/Account/UnlockTagId`,
        headers: {
          'x-domain': query.domain,
        },
        params: {
          cid: query.cid,
          userid: query.userid,
          tagId: Number(query.tagId),
          domain: query.domain
        },
      }).then((res) => {
      }).catch(e => {
        console.log(e)
      });
    }
  },
  mounted() {
    const query = this.$route.query;
    if (query && query.check && query.cid && query.userid && query.tagId && query.domain) {
      setCookie('cid', query.cid);

      yaboRequest({
        method: 'get',
        url: this.siteConfig.YABO_API_DOMAIN + '/Account/GetAuthorizationToken',
      }).then((res) => {
        if (res.data) {
          this.yToken = res.data;
          setCookie('y_token', res.data);
          return;
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
    }),
    headerConfig() {
      return {
        prev: true,
        title: "推广赚钱",
        customLinkTitle: '礼金明细',
        customLinkAction: () => {
          this.$router.push('/mobile/mcenter/tcenter/recommendGift');
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
    agentLink() {
      if (!this.domain || !this.agentCode) {
        return "";
      }

      return `https://${this.domain}/a/${this.agentCode}`;
    }
  },
  beforeCreate() {
    if (this.$route.query && this.$route.query.refresh) {
      window.location.replace('/mobile/mcenter/makeMoney');
      return;
    }
  },
  created() {
    this.getDomain();
    this.getAgentCode();
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    copyCode() {
      this.$copyText(this.agentLink).then(() => {
        this.actionSetGlobalMessage({ msg: "复制成功" })
      });
    },
    getDomain() {
      axios({
        method: "get",
        url: "/api/v1/c/hostnames"
      }).then(res => {
        if (res.data.result !== "ok") {
          return;
        }
        this.domain = res.data.ret[0];
      });
    },
    getAgentCode() {
      axios({
        method: "get",
        url: API_PROMOTION_INFO
      }).then(res => {
        if (res.data.result !== "ok") {
          return;
        }
        this.agentCode = res.data.ret.code;
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
</style>
