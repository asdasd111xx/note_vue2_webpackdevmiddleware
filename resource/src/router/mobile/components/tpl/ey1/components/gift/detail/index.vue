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

export default {
  data() {
    return {
      type: '',
      title: ''
    }
  },
  components: {
    mobileContainer,
  },
  mounted() {

  },
  computed: {
    ...mapGetters({
    }),
    headerConfig() {
      if (this.$route.params.key === "wechat") {
        this.type = 'wechat';
        this.title = '微信'
      }

      return {
        prev: true,
        title: this.title,
        customLinkTitle: '点我报价',
        customLinkAction: () => {
          window.open('https://ey.italking.asia:5569/guest.php?gid=eyag');
        },
        onClick: () => {
          this.$router.back();
        }
      };
    },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    wechatClick() {
      window.open('https://ey.italking.asia:5569/guest.php?gid=eyag');
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
  padding-bottom: 5px;

  > img {
    width: 100%;
  }
}
</style>
