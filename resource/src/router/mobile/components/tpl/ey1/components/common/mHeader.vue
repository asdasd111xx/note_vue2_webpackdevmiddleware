<template>
  <div :class="mainClass" id="header">
    <div
      v-if="headerConfig.hasLogo"
      :class="[$style['logo-wrap']]"
      @click="headerConfig.onClick"
    >
      <img :src="$getCdnPath('/static/image/ey1/common/logo.png')" />
    </div>

    <div
      v-if="headerConfig.prev"
      :class="$style['btn-prev']"
      @click="headerConfig.onClick"
    >
      <img
        :src="
          $getCdnPath(
            `/static/image/ey1/common/btn_${
              headerConfig.hasClose ? 'close' : 'back'
            }.png`
          )
        "
      />
    </div>

    <div v-if="headerConfig.title" :class="[$style.wrap, 'clearfix']">
      <div :class="[[$style.title], $style[source]]">
        {{ headerConfig.title }}
      </div>
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

    <template v-if="headerConfig.hasSearchBtn">
      <div :class="$style['btn-search-wrap']" @click="goSearch">
        <div :class="$style['normal-search']" />
      </div>
    </template>

    <template v-if="headerConfig.hasMemInfo">
      <div v-if="loginStatus" :class="$style['balance-wrap']">
        <div>
          <img
            :src="$getCdnPath('/static/image/ey1/common/icon_ask.png')"
            @click="handleClickAsk"
          />
          <div v-show="hasUnreadMessage" :class="$style['red-dot']" />
        </div>
      </div>
      <div v-else :class="$style['login-wrap']">
        <span @click="$router.push('/mobile/login')">{{
          $text("S_LOGON", "登录")
        }}</span>
        <span @click="$router.push('/mobile/joinmember')">{{
          $text("S_REGISTER", "注册")
        }}</span>
        <img
          :src="$getCdnPath('/static/image/ey1/common/icon_ask.png')"
          @click="handleClickAsk"
        />
      </div>
    </template>

    <template v-if="headerConfig.isMCenter">
      <div :class="$style['mcenter-wrap']">
        <img
          :src="$getCdnPath('/static/image/ey1/mcenter/btn_setting.png')"
          @click="handleClickSetting"
        />
        <div>
          <img
            :src="$getCdnPath('/static/image/ey1/common/icon_ask.png')"
            @click="handleClickAsk"
          />
          <div v-show="hasUnreadMessage" :class="$style['red-dot']" />
        </div>
      </div>
    </template>

    <!-- 自訂右側按鈕 -->
    <template v-if="headerConfig.customLinkTitle">
      <div
        :class="[
          $style['header-custom-wrap'],
          {
            [$style[headerConfig.customLinkStyle]]: headerConfig.customLinkStyle
          }
        ]"
      >
        <div
          :class="[$style['header-custom-btn']]"
          @click="
            headerConfig.customLinkAction
              ? headerConfig.customLinkAction()
              : () => {}
          "
        >
          {{ headerConfig.customLinkTitle }}
        </div>
      </div>
    </template>

    <!-- 幫助中心連結 -->
    <template v-if="headerConfig.hasHelp">
      <div :class="[$style['btn-help']]">
        <span v-if="headerConfig.hasHelp.type === 'deposit'">
          教程
        </span>
        <div :class="$style['btn-icon']">
          <img
            :src="$getCdnPath('/static/image/ey1/common/btn_help.png')"
            @click="$router.push('/mobile/mcenter/helpCenter/')"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    // sideBalance,
    // topGameList: () => import(/* webpackChunkName: 'topGameList' */'./topGameList')
  },
  props: {
    headerConfig: {
      type: Object,
      required: true
    },
    updateSearchStatus: {
      type: Function,
      default: () => { }
    },
    hasUnreadMessage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentMenu: "",
      msg: "",
      source: this.$route.query.source,
    };
  },
  computed: {
    ...mapGetters({
      membalance: "getMemBalance",
      loginStatus: "getLoginStatus"
    }),
    mainClass() {
      const style = this.$style;

      return {
        [style.header]: true,
        [style["is-home"]]: this.$route.name === "home",
        [style[this.source]]: this.source ? this.source : "",
        [style["search-page"]]: this.headerConfig.isSmallPigSearch
          ? true
          : false,
        [style["no-border-bottom"]]: this.headerConfig.noBottomBorder,
        clearfix: true
      };
    },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    // 自訂幫助中心事件
    handleHelpLinkTo() {
      if (this.headerConfig.hasHelp && this.headerConfig.hasHelp.func) {
        this.headerConfig.hasHelp.func();
      }

      // 充值不開放
      if (this.headerConfig.hasHelp.type === "deposit") {
        this.actionSetGlobalMessage({ type: "incoming" });
        return;
      }

      this.$router.push(this.headerConfig.hasHelp.url);
    },
    // 設定選單狀態
    setMenuState(value) {
      this.currentMenu = this.currentMenu === value ? "" : value;
    },
    handleClickAsk() {
      if (this.loginStatus) {
        this.$router.push({ name: 'mcenter-information' });
      } else {
        this.$router.push("/mobile/login");
      }
    },
    handleClickSetting() {
      if (this.loginStatus) {
        this.$router.push("/mobile/mcenter/setting");
      } else {
        this.$router.push("/mobile/login");
      }
    },
    goSearch() {
      if (["casino", "card", "mahjong"].includes(this.$route.name)) {
        this.updateSearchStatus();
        return;
      }

      this.$router.push({ path: "search", query: { source: this.source } });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.header {
  margin: 0 auto;
  max-width: $mobile_max_width;
  position: fixed;
  top: 0;
  z-index: 3;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  background: linear-gradient(#fe2a2a, #b60303);
  color: #ffffff;
  text-align: center;
  border-bottom: 1px solid #eee;

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  &.is-home {
    border-bottom: none;
    background: unset;
  }
}

.logo-wrap {
  float: left;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    display: block;
    height: 30px;
  }
}

.mcenter-wrap {
  position: absolute;
  right: 10px;
  top: 0;
  height: 43px;
  display: flex;
  align-items: center;

  > img,
  > div {
    height: 20px;
    width: 20px;
    margin: 0 5px;
    position: relative;

    > img {
      height: 20px;
      width: 20px;
    }
  }
}

.btn-prev {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  width: 20px;
  height: 20px;
  margin: auto;
  z-index: 2;

  > img {
    display: block;
    width: 100%;
  }
}

.wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.title {
  height: 43px;
  line-height: 43px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 500;
  margin: 0 auto;
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
    height: 35px;
    line-height: 32px;
    padding: 0 40px 0 7px;
    border: none;
    border-radius: 5px;
    background-color: #eeeeee;
    color: $main_text_color2;
    font-size: 14px;
    outline: none;

    &::placeholder {
      color: $main_text_color2;
    }
  }
}

.icon-search {
  position: absolute;
  top: 0;
  right: 0;
  width: 35px;
  height: 35px;
  padding: 6px 0;
  border-radius: 0 5px 5px 0;
  background: linear-gradient(to left, #bd9d7d, #f9ddbd);
  color: white;
  margin: 0 auto;
  text-align: center;

  > img {
    width: 21px;
    height: 21px;
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

.btn-icon {
  height: 20px;
  width: 20px;
  > img {
    height: 100%;
    width: 100%;
  }
}

.btn-help {
  height: 100%;
  align-items: center;
  display: flex;
  position: absolute;
  right: 17px;
  top: 0;

  > span {
    margin: 0 5px;
  }
}

.balance-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  float: right;
  color: #5e626d;
  > span {
    display: inline-block;
    font-size: 18px;
    margin-right: 9px;
  }

  > div {
    position: relative;
    display: inline-block;
    height: 20px;
    width: 20px;
    margin-left: 1.5px;

    > img {
      height: 20px;
      width: 20px;
    }
  }

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
}

.header-custom-wrap {
  height: 43px;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;

  .header-custom-btn {
    line-height: 43px;
    position: absolute;
    right: 14px;
    top: 0;
    color: #ffffff;
    font-family: Arial, Arial-Bold;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
  }
}

.save-wrap {
  font-size: 15px;
  position: absolute;
  line-height: 43px;
  top: 0;
  height: 100%;
  right: 14px;
  color: $main_text_color2;

  > .active {
    color: $main_text_color3;
  }
}

.red-dot {
  position: absolute;
  right: -4px;
  background: red;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  top: -2px;
}

.login-wrap {
  align-items: center;
  color: #ffffff;
  display: flex;
  float: right;
  height: 100%;

  > span {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    margin: 0 1.5px;
    padding: 0 3px;
    font-size: 17px;
    vertical-align: middle;
  }

  img {
    display: inline-block;
    height: 20px;
    width: 20px;
    margin-left: 1.5px;
    vertical-align: middle;
  }

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
}

.normal-search {
  background: url("/static/image/ey1/common/icon_search_n.png");
  width: 20px;
  height: 20px;
  background-size: contain;
}
</style>
