<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :hasFooter="false"
  >
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style['yabo']">
        <img :src="$getCdnPath(`/static/image/_new/about/appicon.png`)" />
        <div :class="$style['version']">版本号 {{ version }}</div>
      </div>
      <div :class="$style['officel']">
        <div>官方认证</div>
        <div :class="$style['content']">
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img01.png`)" />
            <div>英国GC<br />监督委员会</div>
          </div>
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img02.png`)" />
            <div>马耳他博彩牌照<br />(MGA)认证</div>
          </div>
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img03.png`)" />
            <div>英属维尔京群岛<br />(BIV)认证</div>
          </div>
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img04.png`)" />
            <div>菲律宾(PAGCOR)<br />监督博彩牌照</div>
          </div>
        </div>
      </div>

      <div :class="[$style['sponsor'], $style['partner']]">
        <div>联盟伙伴</div>
        <div :class="$style['content']">
          <div :class="$style['cell']">
            <img
              :src="$getCdnPath(`/static/image/_new/about/logo_yabolive.png`)"
            />
            <div>鸭脖视频</div>
          </div>
          <div :class="$style['cell']">
            <img
              :src="$getCdnPath(`/static/image/_new/about/logo_yaboball.png`)"
            />
            <div>亚博体育</div>
          </div>
          <div :class="$style['cell']">
            <img
              :src="$getCdnPath(`/static/image/_new/about/logo_hglive.png`)"
            />
            <div>黄瓜视频</div>
          </div>
          <div :class="$style['cell']">
            <img
              :src="$getCdnPath(`/static/image/_new/about/logo_aglive.png`)"
            />
            <div>AG视讯</div>
          </div>
        </div>
      </div>

      <div :class="[$style['sponsor'], $style['partner']]">
        <div :class="$style['content']">
          <div :class="$style['cell']">
            <img
              :src="$getCdnPath(`/static/image/_new/about/logo_suncity.png`)"
            />
            <div>太阳城</div>
          </div>
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/logo_bbin.png`)" />
            <div>BBIN集团</div>
          </div>
          <div :class="$style['cell']">
            <img
              :src="$getCdnPath(`/static/image/_new/about/logo_csball.png`)"
            />
            <div>皇冠体育</div>
          </div>
          <div :class="$style['cell']">
            <img
              :src="$getCdnPath(`/static/image/_new/about/logo_kycard.png`)"
            />
            <div>开元棋牌</div>
          </div>
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../../../common/new/mobileContainer';
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
      loginStatus: 'getLoginStatus',
      siteConfig: "getSiteConfig",
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_ABOUT_YABOLIVE', '关于鸭脖视频'),
      };
    },
  },
  created() {
    this.version = this.siteConfig.VERSION;
  },
  methods: {
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
.yabo {
  width: 75px;
  height: 75px;
  margin: 0 auto;
  margin-top: 10px;
  > img {
    height: 100%;
  }
}

.version {
  font-size: 9px;
  text-align: center;
  width: 100%;
}

.officel,
.sponsor {
  text-align: center;
  margin-top: 91px;

  > div:first-child {
    font-size: 16px;
  }

  .content {
    display: flex;
    margin-top: 19px;
    padding: 0 5%;
  }

  .cell {
    width: 25%;
    font-size: 9px;

    img {
      height: 41px;
      width: 41px;
    }
  }
}
.sponsor {
  margin-top: 40px;
}

.partner {
  .cell {
    width: 25%;
    font-size: 9px;

    img {
      height: 26px;
      width: 67px;
    }
  }
}
</style>
