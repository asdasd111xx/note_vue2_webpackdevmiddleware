<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" :class="$style['content-wrap']">
      <!-- 暫時不顯示 -->
      <!-- <app-tip v-if="showTip" @close="showTip = false" /> -->
      <avatar-info />
      <shortcut-info />
      <mem-list />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mobileContainer from '../../../common/new/mobileContainer';
import shortcutInfo from './components/shortcutInfo';
import memList from './components/memList';
import avatarInfo from './components/avatarInfo'
import appTip from './components/appTip'
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
      showTip: true,
      isShowAppTip: true,
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    headerConfig() {
      return {
        hasLogo: false,
        hasMemInfo: false,
        hasSearchBtn: false,
        isMCenter: true,
        title: this.$text('S_INFORMATION', '我的'),
      };
    },
  },
  created() {
      this.actionSetVip();
  },
  methods: {
    ...mapActions([
      'actionSetVip'
    ]),
    goMessage() {
      if (!this.loginStatus) {
        this.$router.push('/mobile/login');
        return;
      }
      this.$router.push('/mobile/mcenter/information/message');
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: $main_background_white1;
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
