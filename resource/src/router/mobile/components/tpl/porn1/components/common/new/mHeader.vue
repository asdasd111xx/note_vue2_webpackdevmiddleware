<template>
  <div :class="mainClass" id="header">
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
      <img
        v-if="source === 'gay' || source === 'les'"
        :src="$getCdnPath(`/static/image/_new/common/btn_back_w.png`)"
      />
      <img
        v-else
        :src="
          $getCdnPath(
            `/static/image/_new/common/btn_${
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

    <template v-if="headerConfig.hasSearchBar">
      <div :class="[$style['search-wrap'], $style[source]]">
        <input
          v-model="headerConfig.keyWord"
          :placeholder="$text('S_PLEASE_INPUT_AV', '请输入片名、女优或番号')"
          type="text"
          @keydown.enter="headerConfig.onSearchClick(headerConfig.keyWord)"
          :class="$style[source]"
        />
        <div
          :class="[$style['icon-search'], $style[source]]"
          @click="headerConfig.onSearchClick(headerConfig.keyWord)"
        >
          <icon name="search" width="20" height="20" />
        </div>
      </div>
    </template>

    <template v-if="headerConfig.hasSearchBtn">
      <div :class="$style['btn-search-wrap']" @click="goSearch">
        <img
          v-if="source === 'smallPig'"
          :src="$getCdnPath('/static/image/_new/common/icon_search_gray.png')"
        />

        <img
          v-else-if="source === 'gay' || source === 'les'"
          :src="$getCdnPath('/static/image/_new/common/icon_search_white.png')"
        />

        <img
          v-else
          :src="$getCdnPath('/static/image/_new/common/icon_search_n.png')"
        />
      </div>
    </template>

    <template v-if="headerConfig.hasFeedBackBtn">
      <div
        :class="$style['btn-feedback']"
        @click="$router.push('/mobile/mcenter/feedback/feedbackList')"
      >
        {{ $text("S_MY_FEEDBACK", "我的反馈") }}
      </div>
    </template>

    <!-- 登錄&註冊 -->
    <template v-if="headerConfig.hasMemInfo">
      <div
        v-if="loginStatus"
        :class="$style['balance-wrap']"
        @click="setMenuState('balance')"
      >
        <span>
          {{ membalance.total }}
        </span>
        <img
          :src="$getCdnPath('/static/image/_new/common/icon_ask.png')"
          @click="handleClickAsk"
        />
      </div>
      <div v-else :class="$style['login-wrap']">
        <span @click="$router.push('/mobile/login')">{{
          $text("S_LOGON", "登录")
        }}</span>
        <span @click="$router.push('/mobile/joinmember')">{{
          $text("S_REGISTER", "注册")
        }}</span>
        <img
          :src="$getCdnPath('/static/image/_new/common/icon_ask.png')"
          @click="handleClickAsk"
        />
      </div>
      <!-- 側開額度 -->
      <side-balance
        v-if="currentMenu === 'balance'"
        :open-state.sync="currentMenu"
      />
    </template>

    <template v-if="headerConfig.isMCenter">
      <div :class="$style['mcenter-wrap']">
        <img
          :src="$getCdnPath('/static/image/_new/common/btn_setting.png')"
          @click="handleClickSetting"
        />
        <img
          :src="$getCdnPath('/static/image/_new/common/icon_ask.png')"
          @click="handleClickAsk"
        />
      </div>
    </template>
    <template v-if="headerConfig.onClickFunc">
      <div
        :class="$style['save-wrap']"
        @click="
          () => {
            headerConfig.funcBtnActive ? headerConfig.onClickFunc() : '';
          }
        "
      >
        <div :class="headerConfig.funcBtnActive ? $style['active'] : ''">
          {{
            headerConfig.funcBtn
              ? headerConfig.funcBtn
              : $text("S_COMPLETE", "完成")
          }}
        </div>
      </div>
    </template>

    <message v-if="msg" @close="msg = ''">
      <div slot="msg">{{ msg }}</div>
    </message>
    <template v-if="headerConfig.hasHelp">
      <div :class="$style['balance-wrap']" @click="setMenuState('balance')">
        <img
          :src="
            $getCdnPath('/static/image/_new/mcenter/balanceTrans/btn_help.png')
          "
          @click="
            $router.push(
              `/mobile/mcenter/help${
                headerConfig.helpRouter ? headerConfig.helpRouter : ''
              }`
            )
          "
        />
      </div>
    </template>

    <template v-if="headerConfig.hasDespositHelp">
      <div :class="$style['deposit-wrap']">
        教程
        <img
          :src="
            $getCdnPath('/static/image/_new/mcenter/balanceTrans/btn_help.png')
          "
          @click="
            $router.push(
              `/mobile/mcenter/help${
                headerConfig.helpRouter ? headerConfig.helpRouter : ''
              }`
            )
          "
        />
      </div>
    </template>

    <template v-if="headerConfig.hasTransaction">
      <div
        :class="$style['btn-feedback']"
        @click="$router.push('/mobile/mcenter/moneyDetail')"
      >
        {{ $text("S_TRANSACTION_RECORD", "交易记录") }}
      </div>
    </template>
    <template v-if="headerConfig.recommendGift">
      <div
        :class="$style['btn-feedback']"
        @click="$router.push('/mobile/mcenter/tcenter/recommendGift')"
      >
        礼金明细
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import message from "./message";

export default {
  components: {
    message
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
    }
  },
  data() {
    return {
      currentMenu: "",
      msg: "",
      source: this.$route.query.source
    };
  },
  computed: {
    ...mapGetters({
      membalance: "getMemBalance",
      loginStatus: "getLoginStatus"
    }),
    mainClass() {
      // const config = this.headerConfig;
      const style = this.$style;
      // 暫時移除底色渲染
      return {
        [style.header]: true,
        [style["is-home"]]: this.$route.name === "home",
        [style[this.source]]: this.source ? this.source : "",
        [style["search-page"]]: this.headerConfig.isSmallPigSearch
          ? true
          : false,
        // [style['background-gradient']]: config.isBackgroundGradient ,
        clearfix: true
      };
    }
  },
  methods: {
    // 設定選單狀態
    setMenuState(value) {
      this.currentMenu = this.currentMenu === value ? "" : value;
    },
    handleClickAsk() {
      if (this.loginStatus) {
        this.$router.push("/mobile/mcenter/information/message");
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
  background: $main_white_color1;
  text-align: center;
  border-bottom: 1px solid #eee;

  // 小豬視頻的search Header 為黑色底
  &.search-page {
    background: #414141;
  }

  &.gay {
    background: #4a8cb8;
    border-bottom: none;
  }

  &.les {
    background: #d64545;
    border-bottom: none;
  }

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  &.is-home {
    border-bottom: none;
  }
}

.logo-wrap {
  float: left;
  width: 99px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    display: block;
    height: 33px;
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
    height: 20px;
    line-height: 20px;
    margin: 0 1.5px;
    padding: 0 3px;
    color: black;
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

.mcenter-wrap {
  position: absolute;
  right: 10px;
  top: 0;
  height: 43px;
  display: flex;
  align-items: center;

  img {
    height: 20px;
    width: 20px;
    margin: 0 5px;
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

  &.les,
  &.gay {
    color: #fff;
  }
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

  &.smallPig,
  &.gay,
  &.les {
    border-radius: 18px;
  }

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

    &.smallPig,
    &.gay,
    &.les {
      border-radius: 18px;
    }

    &.smallPig {
      background-color: #333;
    }

    &.gay {
      color: #fff;
      background-color: #3a79a1;

      &::placeholder {
        color: #fff;
      }
    }

    &.les {
      color: #fff;
      background-color: #b73939;

      &::placeholder {
        color: #fff;
      }
    }

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

  &.smallPig,
  &.gay,
  &.les {
    width: 85px;
    border-radius: 0 18px 18px 0;
  }

  &.smallPig {
    background: #1e1e1e;
  }

  &.gay {
    background: #3e81ac;
  }

  &.les {
    background: #c54242;
  }

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

.btn-feedback {
  position: absolute;
  top: calc(50% - 10px);
  right: 12px;
  color: #414655;
}

.deposit-wrap {
  position: absolute;
  right: 17px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;

  > img {
    display: inline-block;
    height: 20px;
    width: 20px;
    margin-left: 1.5px;
  }

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
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

  > img {
    display: inline-block;
    height: 20px;
    width: 20px;
    margin-left: 1.5px;
  }

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
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
