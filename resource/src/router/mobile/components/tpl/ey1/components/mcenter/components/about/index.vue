<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :hasFooter="false"
  >
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style['logo']">
        <img :src="$getCdnPath(`/static/image/ey1/common/appicon.png`)" />
      </div>
      <div :class="$style['version']">版本号 {{ version }}</div>

      <div :class="$style['partner-wrap']">
        <div :class="$style['partner-title']">
          合作伙伴
        </div>
        <div
          v-for="(item, index) in partners"
          :class="$style['partner-cell']"
          :key="index"
        >
          <img
            :src="
              $getCdnPath(`/static/image/ey1/mcenter/about/logo_${item}.png`)
            "
          />
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../../../common/mobileContainer";
import { getCookie, setCookie } from "@/lib/cookie";

export default {
  data() {
    return {
      version: "",
      partners: [
        "bbin",
        "xbb",
        "ag",
        "ob",
        "pt",
        "mg",
        "jdb",
        "saba",
        "cs",
        "im",
        "ky",
        "cq9"
      ]
    };
  },
  components: {
    mobileContainer
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: `关於${this.siteConfig.SITE_NAME}娱乐`
      };
    }
  },
  mounted() {
    this.version = `${this.siteConfig.VERSION}${getCookie("platform") || ""}`;
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.container {
  color: $main_text_color1;
  background-color: white;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/image/_new/about/bg.png");
}

.content-wrap {
  overflow-y: auto;
  padding: 25px 0;
}

.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  margin-top: 10px;
  > img {
    height: 100%;
  }
}

.version {
  margin-top: 10px;
  font-size: 13px;
  text-align: center;
  width: 100%;
  color: #a6a9b2;
}

.partner-wrap {
  margin-top: 70px;
}

.partner-title {
  font-size: 17px;
  font-weight: 700;
  text-align: center;
  color: #414655;
  width: 100%;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 30px;
}

.partner-cell {
  width: 33%;
  height: 40px;
  float: left;
  margin-bottom: 30px;
  text-align: center;

  > img {
    width: 90px;
    height: 40px;
  }
}
</style>
