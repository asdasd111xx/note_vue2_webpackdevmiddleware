<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :hasFooter="false"
  >
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style['logo']">
        <img
          :src="$getCdnPath(`/static/image/_new/ey1/common/app-icon-tmp.png`)"
        />
      </div>
      <div :class="$style['version']">版本号 {{ version }}</div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../../../common/mobileContainer';
import { getCookie, setCookie } from '@/lib/cookie';

export default {
  data() {
    return {
      version: ''
    }
  },
  components: {
    mobileContainer,
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: `关于${this.siteConfig.SITE_NAME}`,
      };
    },
  },
  mounted() {
    this.version = `${this.siteConfig.VERSION}${getCookie('platform') || ''}`;
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
}
</style>
