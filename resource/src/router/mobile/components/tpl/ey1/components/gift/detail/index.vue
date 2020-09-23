<template>
  <mobile-container :class="$style.container" :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <div v-if="this.type === 'wechat'" @click="wechatClick">
        <img
          :class="$style['wechat-image']"
          src="/static/image/ey1/gift/wechat_promote.png"
        />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from '../../common/mobileContainer';
import { mapGetters, mapActions } from 'vuex';
import jwt from 'jwt-simple';

export default {
  data() {
    return {
      type: '',
      title: '',
      url: 'https://ey.italking.asia/guest.php?gid=EY'
    }
  },
  components: {
    mobileContainer,
  },
  mounted() {
    if (this.loginStatus && this.onlineService) {
      const memberData = {
        name: this.memInfo.user.name || '',
        mobile: this.memInfo.user.phone || '',
        account: this.memInfo.user.username
      };
      const rsaData = jwt.encode(memberData, 'T9AuSgQfh2');
      this.url = `${this.onlineService.url}&jwtToken=${rsaData}`;
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      onlineService: 'getOnlineService',
      memInfo: 'getMemInfo'

    }),
    headerConfig() {
      if (this.$route.params.key === "wechat") {
        this.type = 'wechat';
        this.title = '微信推广'
      }

      return {
        prev: true,
        title: this.title,
        customLinkTitle: '点我报价',
        customLinkAction: () => {
          window.open(this.url);
        },
        onClick: () => {
          this.$router.back('/mobile/gift?q=通讯软体');
        }
      };
    },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    wechatClick() {
      window.open(this.url);
    }
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.wechat-image {
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding-bottom: 15px;
  padding-top: 1px;

  > img {
    width: 100%;
  }
}
</style>
