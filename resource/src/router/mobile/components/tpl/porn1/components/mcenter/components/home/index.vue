<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" :class="$style['content-wrap']">
      <app-tip v-if="isService" @close="showTip = false" />
      <avatar-info />
      <shortcut-info />
      <mem-list />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../common/mobileContainer";
import shortcutInfo from "./components/shortcutInfo";
import memList from "./components/memList";
import avatarInfo from "./components/avatarInfo";
import appTip from "./components/appTip";
import { sendUmeng } from "@/lib/sendUmeng";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    mobileContainer,
    shortcutInfo,
    avatarInfo,
    memList,
    appTip
  },
  data() {
    return {
      isShowAppTip: true,
      isService: true //立即收藏開關
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        isMCenter: true,
        title: this.$text("S_INFORMATION", "我的")
      };
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  created() {
    sendUmeng(24);
    if (this.routerTPL === "sp1") this.getService();
  },
  methods: {
    goMessage() {
      if (!this.loginStatus) {
        this.$router.push("/mobile/login");
        return;
      }
      this.$router.push("/mobile/mcenter/information/message");
    },
    getService() {
      //立即收藏開關
      goLangApiRequest({
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
        params: {
          urlName: "myStoreUp",
          needToken: false
        }
      }).then(res => {
        if (res && res.status === "000" && res.errorCode === "00") {
          this.isService = res.data.open_flag === 1;
        }
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: #f8f8f8;
}

.content-wrap {
  overflow-y: scroll;
}

.msg-icon {
  margin: 5px auto;
  width: 94%;
  height: 28px;

  img {
    float: right;
    width: 28px;
  }
}
</style>
