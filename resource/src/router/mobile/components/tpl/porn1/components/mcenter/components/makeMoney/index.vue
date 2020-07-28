<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content">
      <div v-for="item in 6" :key="`img${item}`" :class="$style['img-wrap']">
        <img
          :src="`/static/image/_new/mcenter/makeMoney/promotion_${item}.png`"
        />
        <template v-if="item === 2">
          <span>{{ agentCode }}</span>
          <div :class="$style['copy-btn']" @click="copyCode">
            复制
          </div>
        </template>
      </div>
      <message v-if="msg" @close="msg = ''">
        <div slot="msg">
          {{ msg }}
        </div>
      </message>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from "../../../common/mobileContainer";
import { API_PROMOTION_INFO } from "@/config/api";
import axios from "axios";
import message from "../../../common/new/message";

export default {
  components: {
    mobileContainer,
    message
  },
  data() {
    return {
      msg: "",
      domain: "",
      agentCode: ""
    };
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        title: "推广赚钱",
        recommendGift: true,
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
    copyCode() {
      this.$copyText(this.agentLink).then(() => {
        this.msg = "复制成功";
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
    bottom: 6vw;
    left: 46%;
    font-weight: 700;
    color: #424654;
  }

  .copy-btn {
    padding: 3px 10px;
    position: absolute;
    bottom: calc(6vw - 3px);
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
