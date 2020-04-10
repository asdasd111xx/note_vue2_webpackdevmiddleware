<template>
  <div :class="mainClass">
    <div
      v-if="headerConfig.hasLogo"
      :class="[$style['logo-wrap']]"
      @click="headerConfig.onClick"
    >
      <img :src="$getCdnPath('/static/image/_new/common/logo.png')" />
    </div>

    <div
      v-if="headerConfig.prev"
      :class="$style['btn-prev']"
      @click="headerConfig.onClick"
    >
      <img :src="$getCdnPath('/static/image/_new/common/btn_back.png')" />
    </div>

    <div v-if="headerConfig.title" :class="[$style.wrap, 'clearfix']">
      <div :class="$style.title">{{ headerConfig.title }}</div>
      <div
        v-if="headerConfig.gameList"
        :class="$style['btn-game-list']"
        @click="setMenuState('gameList')"
      >
        <img
          :src="
            $getCdnPath(
              '/static/image/mobile/tpl/porn1/header/btn_header_n.png'
            )
          "
        />
      </div>
    </div>
    <div
      v-if="headerConfig.gameList"
      v-show="currentMenu === 'gameList'"
      ref="game-list-wrap"
      :class="$style['game-list-wrap']"
    >
      <top-game-list :is-list-visible.sync="currentMenu" />
    </div>
    <template v-if="headerConfig.hasSearchBar">
      <div :class="$style['search-wrap']">
        <input
          v-model="headerConfig.keyWord"
          :placeholder="$text('S_PLEASE_INPUT_AV', '请输入片名、女优或番号')"
          type="text"
          @keydown.enter="headerConfig.onSearchClick(headerConfig.keyWord)"
        />
        <div
          :class="$style['icon-search']"
          @click="headerConfig.onSearchClick(headerConfig.keyWord)"
        >
          <icon name="search" width="20" height="20" />
        </div>
      </div>
    </template>
    <template v-if="headerConfig.hasSearchBtn">
      <div
        :class="$style['btn-search-wrap']"
        @click="$router.push({ name: 'search' })"
      >
        <!-- <icon name="search" width="16" height="16" /> -->
        <img
          :src="$getCdnPath('/static/image/_new/common/icon_search_n.png')"
        />
      </div>
    </template>

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
  background: $main_white_color1;
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

.btn-prev {
  position: absolute;
  top: 0;
  bottom: 0;
  //   left: 5%;
  left: 12px;
  width: 20px;
  height: 20px;
  margin: auto;

  > img {
    display: block;
    width: 100%;
  }
}

.wrap {
  display: inline-block;
  margin: 0 24px;
  vertical-align: middle;
}

.title {
  float: left;
  height: 22px;
  line-height: 22px;
  color: $main_title_color1;
  font-size: 17px;
}

.btn-game-list {
  float: left;
  width: 22px;
  height: 22px;
  margin-left: 5px;

  > img {
    display: block;
    width: 100%;
  }
}

.game-list-wrap {
  overflow-y: auto;
  position: fixed;
  top: 43px;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
}

.search-wrap {
  display: inline-block;
  position: relative;
  width: calc(100% - 10% - 24px);
  margin: 6px 0 0 24px;

  > input {
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding: 0 64px 0 16px;
    border: none;
    border-radius: 16px;
    background-color: #393a44;
    color: #7a7d85;
    font-size: 13px;
    outline: none;
  }
}

.icon-search {
  position: absolute;
  top: 0;
  right: -1px;
  width: 48px;
  height: 32px;
  padding: 6px 0;
  border-radius: 0 16px 16px 0;
  background-color: #f9cf33;
  color: #ea377e;

  > svg {
    display: block;
    margin: 0 auto;
  }
}

.btn-search-wrap {
  position: absolute;
  top: calc(50% - 10px);
  right: 12px;
  width: 20px;
  height: 20px;
  color: #fff;

  > svg {
    display: block;
  }

  > img {
    width: 20px;
    height: 20px;
  }
}

.balance-wrap {
  position: absolute;
  top: 16px;
  right: 34px;
  line-height: 12px;
  font-size: 14px;
  margin-right: 9px;
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
