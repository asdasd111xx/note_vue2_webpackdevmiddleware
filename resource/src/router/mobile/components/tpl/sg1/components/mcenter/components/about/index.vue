<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :hasFooter="false"
  >
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style['info']">
        <div :class="$style['icon']">
          <img :src="$getCdnPath(`/static/image/sg1/common/appicon.png`)" />
        </div>
        <div :class="$style['version']">版本号 {{ version }}</div>
      </div>
      <img
        :class="$style['bg']"
        :src="$getCdnPath(`/static/image/sg1/about/bg.png`)"
      />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../../../common/mobileContainer";
import { getCookie, setCookie } from "@/lib/cookie";

export default {
  data() {
    return {};
  },
  components: {
    mobileContainer
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      version: "getVersion"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: `关于${this.siteConfig.SITE_NAME}`
      };
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.container {
  color: #9ca3bf;
  background-color: white;
  width: 100%;
  overflow-y: scroll;
}

.bg {
  min-height: 100vh;
  width: 100%;
  position: relative;
  margin-top: -150px;
}

.content-wrap {
  overflow-y: auto;
  position: relative;
}
.info {
  position: relative;
  width: 100%;
  z-index: 1;
  margin-top: 25px;
}
.icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  margin-top: 10px;
  > img {
    height: 100%;
  }
}

.version {
  margin-top: 5px;
  font-size: 13px;
  text-align: center;
  width: 100%;
}
</style>
