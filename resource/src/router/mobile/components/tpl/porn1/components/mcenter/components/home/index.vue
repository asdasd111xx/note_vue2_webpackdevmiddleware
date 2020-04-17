<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" :class="$style['content-wrap']">
      <!-- <div :class="$style['msg-icon']">
        <img
          :src="
            $getCdnPath('/static/image/mobile/tpl/porn1/home/message_icon.png')
          "
          @click="goMessage()"
        />
      </div> -->

      <!-- 暫時不顯示 -->
      <!-- <app-tip v-if="showTip" @close="showTip = false" /> -->
      <avatar-info />
      <shortcut-info />
      <mem-list />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../../../common/new/mobileContainer';
import shortcutInfo from './components/new/shortcutInfo';
import memList from './components/new/memList';
import avatarInfo from './components/new/avatarInfo'
import appTip from './components/new/appTip'
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

  },
  methods: {
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
  background-color: $main_white_color1;
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
