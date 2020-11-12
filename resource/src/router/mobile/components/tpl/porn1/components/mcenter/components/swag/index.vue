<template>
  <mobile-container :header-config="headerSetting" :has-footer="false">
    <div slot="content" :class="[$style['content-wrap'], 'clearfix']">
      <div :class="[$style['tab-wrap']]">
        <div
          v-for="(item, index) in tabItem"
          :key="`tab-${item.key}`"
          :class="[
            $style['tab-item'],
            { [$style['is-current']]: currentTab === index },
            { [$style['SWAG']]: index === 2 }
          ]"
          @click="setCurrentTab(index)"
        >
          {{ item.text }}
        </div>
        <div
          :class="$style['active-slider']"
          :style="{
            left: `calc(16.5% + 33% * ${currentTab})`
          }"
        />
      </div>

      <div :class="[$style['credit-trans-container']]">
        <component :is="currentTemplate" @linkToSwag="linkToSwag" />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../common/mobileContainer";
import buyDiamond from './compontents/buyDiamond';
import recoardDiamond from './compontents/recoardDiamond';
import axios from 'axios';
import goLangApiRequest from '@/api/goLangApiRequest';

export default {
  components: {
    mobileContainer,
    buyDiamond,
    recoardDiamond,
  },
  data() {
    return {
      transferMoney: null,
      headerSetting: {
        title: this.$text("S_BUY_DIAMOND", "购买钻石"),
        prev: true,
        onClick: () => {
          this.$router.back();
        },
      },
      currentTab: 0, //buy recoard
      currentTemplate: "buy-diamond",
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig'
    }),
    tabItem() {
      return [
        {
          key: "buy",
          text: this.$text("S_DIAMOND_DISCOUNT", "钻石优惠"),
        },
        {
          key: "recoard",
          text: this.$text("S_DIAMOND_RECOARD", "钻石记录"),
        },
        {
          key: "linkToSWAG",
          text: '进入SWAG',
          text: this.$text("S_INTO_SWAG", "进入SWAG"),
        },
      ]
    },
  },
  created() {
    if (this.$route.query && this.$route.query.tab) {
      this.setCurrentTab(Number(this.$route.query.tab));
    } else {
      this.$router.replace(`/mobile/mcenter/swag?tab=0`);
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      'actionSetGlobalMessage',
      "actionGetRechargeStatus",
    ]),
    linkToSwag() {
      if (!this.loginStatus) {
        this.$router.push('/mobile/login');
      } else {
        if (this.isLoading) {
          return;
        }
        this.isLoading = true;

        let userId = 'guest';
        if (this.memInfo && this.memInfo.user && this.memInfo.user.id && this.memInfo.user.id !== 0) {
          userId = this.memInfo.user.id;
        }

        goLangApiRequest({
          method: 'get',
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/ThirdParty/SWAG/${userId}`,
          headers: {
            'x-domain': this.memInfo.user.domain
          }
        }).then(res => {
          if (res && res.status !== '000') {
            if (res.msg) {
              this.actionSetGlobalMessage({ msg: res.msg });
            }
            return;
          }
          else {
            localStorage.setItem('iframe-third-url', res.data);
            localStorage.setItem('iframe-third-origin', 'mcenter/swag?tab=0');
            this.$router.push(`/mobile/iframe/SWAG?&hasFooter=false&hasHeader=true`);
            return;
          }

          this.isLoading = false;
        })
      }
    },
    setCurrentTab(index) {

      switch (index) {
        default:
        case 0:
          this.currentTemplate = "buy-diamond";
          this.currentTab = index;
          // this.$router.replace(`/mobile/mcenter/swag?tab=${index}`);

          break;
        case 1:
          this.currentTemplate = "recoard-diamond";
          this.currentTab = index;
          // this.$router.replace(`/mobile/mcenter/swag?tab=${index}`);

          break;
        case 2:
          // 鴨博色播
          this.linkToSwag();

          break;
      }
    },
  }
};
</script>
<style lang="scss" src="./css/index.module.scss" module></style>
