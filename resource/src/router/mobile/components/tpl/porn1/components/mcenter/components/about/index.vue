<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :hasFooter="false"
  >
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style['yabo']">
        <img :src="$getCdnPath(`/static/image/_new/about/appicon.png`)" />
        <div :class="$style['version']">{{ version }}</div>
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

      <div :class="$style['sponsor']">
        <div>赞助伙伴</div>
        <div :class="$style['content']">
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img05.png`)" />
            <div>英超曼联<br />全球赞助商</div>
          </div>
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img06.png`)" />
            <div>意甲联赛<br />全球赞助商</div>
          </div>
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img07.png`)" />
            <div>德甲拜仁慕尼黑<br />亚洲区赞助商</div>
          </div>
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img08.png`)" />
            <div>英超莱斯特城<br />亚洲区赞助商</div>
          </div>
        </div>
      </div>

      <div :class="$style['sponsor-2']">
        <div :class="$style['content']">
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img09.png`)" />
            <div>阿根廷国家队<br />官方合作伙伴</div>
          </div>
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img010.png`)" />
            <div>法甲摩纳哥<br />官方合作伙伴</div>
          </div>
          <div :class="$style['cell']">
            <img :src="$getCdnPath(`/static/image/_new/about/img011.png`)" />
            <div>德甲柏林赫塔<br />官方合作伙伴</div>
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
      loginStatus: 'getLoginStatus'
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
    let version = this.$route.query.version || getCookie('version');
    this.version = version;
    setCookie('version', version);
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
  margin-top: 43px;
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
.sponsor,
.sponsor-2 {
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
.sponsor-2 {
  margin-top: 10px;
  .content {
    display: flex;
    margin-top: 14px;
    padding: 0 15%;
  }

  .cell {
    width: calc(100% / 3);
    font-size: 9px;
  }
}
</style>
