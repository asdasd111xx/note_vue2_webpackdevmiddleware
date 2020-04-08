<template>
  <div :class="mainClass">
    <div
      v-if="headerConfig.hasLogo"
      :class="[$style['logo-wrap']]"
      @click="headerConfig.onClick"
    >
      <img :src="$getCdnPath('/static/image/_new/common/logo.png')" />
    </div>

    <!-- 登錄&註冊 -->
    <template v-if="headerConfig.hasMemInfo">
      <div
        v-if="loginStatus"
        :class="$style['balance-wrap']"
        @click="setMenuState('balance')"
      >
        {{ membalance.total }}
      </div>
      <div v-else :class="$style['login-wrap']">
        <span @click="$router.push('/mobile/login')">{{
          $text("S_LOGON", "登录")
        }}</span>
        <span @click="$router.push('/mobile/joinmember')">{{
          $text("S_REGISTER", "注册")
        }}</span>
        <img :src="$getCdnPath('/static/image/_new/common/icon_ask.png')" />
      </div>
      <!-- 側開額度 -->
      <side-balance
        v-if="currentMenu === 'balance'"
        :open-state.sync="currentMenu"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {
    // sideBalance,
    // topGameList: () => import(/* webpackChunkName: 'topGameList' */'./topGameList')
  },
  props: {
    headerConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentMenu: ''
    };
  },
  computed: {
    ...mapGetters({
      membalance: 'getMemBalance',
      loginStatus: 'getLoginStatus'
    }),
    mainClass() {
      const config = this.headerConfig;
      const style = this.$style;
      // 暫時移除底色渲染
      return {
        [style.header]: true,
        // [style['background-gradient']]: config.isBackgroundGradient ,
        clearfix: true
      };
    }
  },
  methods: {
    // 設定選單狀態
    setMenuState(value) {
      this.currentMenu = this.currentMenu === value ? '' : value;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 43px;
  padding: 0 17px; //or 5%
  //   padding-top: 27px;
  background: white;
  text-align: center;

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
}

.logo-wrap {
  float: left;
  width: 64px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    display: block;
    height: 24px;
    width: 100%;
  }
}

.login-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  float: right;
  > span {
    display: inline-block;
    line-height: 12px;
    margin: 0 1.5px;
    padding: 3px;
    color: black;
    font-size: 14px;
  }

  > img {
    display: inline-block;
    height: 18px;
    width: 18px;
    margin-left: 1.5px;
  }
}

.balance-wrap {
  position: absolute;
  top: 16px;
  right: 34px;
  line-height: 12px;
}

@media screen and (min-width: $pad) {
  .login-wrap {
    > span {
      font-size: 18px;
    }
  }

  .title {
    font-size: 18px;
  }
}
</style>
