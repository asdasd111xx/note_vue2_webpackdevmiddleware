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
        :src="$getCdnPath(`/static/image/common/btn_back_white.png`)"
      />
      <img
        v-else
        :src="
          $getCdnPath(
            `/static/image/common/btn_${
              headerConfig.hasClose ? 'close_black' : 'back_black'
            }.png`
          )
        "
      />
    </div>

    <div v-if="headerConfig.title" :class="[$style.wrap, 'clearfix']">
      <div :class="[[$style.title], $style[source]]">
        {{ headerConfig.title }}
      </div>
    </div>
    <template v-if="headerConfig.hasSearchBar">
      <div :class="[$style['search-wrap'], $style[source]]">
        <input
          v-model="headerConfig.keyWord"
          :placeholder="
            source === 'gay'
              ? '请输入片名、男优或番号'
              : $text('S_PLEASE_INPUT_AV', '请输入片名、女优或番号')
          "
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
        <div v-if="source === 'smallPig'" :class="$style['sp-search']" />

        <div
          v-else-if="source === 'gay' || source === 'les'"
          :class="$style['gay-search']"
        />

        <div v-else :class="$style['normal-search']" />
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
        <div>
          <img
            :src="$getCdnPath('/static/image/_new/common/icon_ask.png')"
            @click="handleClickAsk"
          />
          <div v-show="hasUnreadMessage" :class="$style['red-dot']" />
        </div>
      </div>
      <div v-else :class="$style['login-wrap']">
        <span
          :class="$style['visitor-title']"
          @click="$router.push('/mobile/joinmember')"
          >访客彩金</span
        >
        <span
          :class="$style['visitor-money']"
          @click="$router.push('/mobile/joinmember')"
          >{{ `${guestAmount}元` }}</span
        >
        <span
          :class="[$style['visitor-money'], $style['visitor-border']]"
          @click="$router.push('/mobile/joinmember')"
          >领取</span
        >
        <span @click="$router.push('/mobile/login')">{{
          $text("S_LOGON", "登录")
        }}</span>
        <!-- <span @click="$router.push('/mobile/joinmember')">{{
          $text("S_REGISTER", "注册")
        }}</span> -->
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
        <div>
          <img
            :src="$getCdnPath('/static/image/_new/common/icon_ask.png')"
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
      <div :class="[$style['btn-help']]" @click="handleHelpLinkTo">
        <span v-if="headerConfig.hasHelp.type === 'deposit'">
          教程
        </span>
        <div :class="$style['btn-icon']">
          <img :src="$getCdnPath('/static/image/_new/common/btn_help.png')" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
import { getCookie, setCookie } from "@/lib/cookie";

export default {
  components: {
    // sideBalance,
  },
  props: {
    headerConfig: {
      type: Object,
      required: true
    },
    updateSearchStatus: {
      type: Function,
      default: () => {}
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
      guestAmount: 0
    };
  },
  computed: {
    ...mapGetters({
      membalance: "getMemBalance",
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    mainClass() {
      const style = this.$style;

      return {
        [style.header]: true,
        [style.agent]: this.path[1] === "agcenter",
        [style["is-home"]]: this.$route.name === "home",
        [style[this.source]]: this.source ? this.source : "",
        [style["search-page"]]: this.headerConfig.isSmallPigSearch
          ? true
          : false,
        [style["no-border-bottom"]]: this.headerConfig.noBottomBorder,
        clearfix: true
      };
    },
    path() {
      return this.$route.path.split("/").filter(path => path);
    }
  },
  created() {
    if (!this.loginStatus) {
      this.getGuestBalance();
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    // 自訂幫助中心事件
    handleHelpLinkTo() {
      if (this.headerConfig.hasHelp && this.headerConfig.hasHelp.func) {
        this.headerConfig.hasHelp.func();
      }

      // 充值不開放
      // if (this.headerConfig.hasHelp.type === "deposit") {
      //   this.actionSetGlobalMessage({ type: "incoming" });
      //   return;
      // }

      this.$router.push(this.headerConfig.hasHelp.url);
    },
    // 設定選單狀態
    setMenuState(value) {
      this.currentMenu = this.currentMenu === value ? "" : value;
    },
    handleClickAsk() {
      if (this.loginStatus) {
        this.$router.push({ name: "mcenter-information" });
      } else {
        this.$router.push("/mobile/joinmember");
      }
    },
    handleClickSetting() {
      if (this.loginStatus) {
        this.$router.push("/mobile/mcenter/setting");
      } else {
        this.$router.push("/mobile/joinmember");
      }
    },
    goSearch() {
      // 一般遊戲大廳 & 熱門遊戲大廳
      if (
        ["casino", "card", "mahjong", "hotLobby"].includes(this.$route.name)
      ) {
        this.updateSearchStatus();
        return;
      }

      this.$router.push({ path: "search", query: { source: this.source } });
    },

    // 取得訪客餘額
    getGuestBalance() {
      return goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Account/getAmount`,
        params: {
          account: getCookie("uuidAccount"),
          cid: getCookie("guestCid")
        }
      }).then(res => {
        if (res.status === "000") {
          this.guestAmount = res.data.totalAmount;
        }
      });
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

  &.no-border-bottom {
    border-bottom: unset;
  }

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

.agent {
  background: url("/static/image/porn1/agent/common/herder_bg.png");
  border-bottom: 1px solid #000;

  .title {
    color: #fff;
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

  .visitor-title {
    font-size: 14px;
    margin: 0;
    padding: 0;
    padding-right: 5px;
  }
  .visitor-money {
    font-size: 14px;
    color: #fb7126;
    margin: 0;
    padding: 0;
    padding-right: 5px;
  }
  .visitor-border {
    border-right: 1px solid #9ca4be;
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
  bottom: 0;
  height: 20px;
  left: 12px;
  margin: auto;
  top: 0;
  width: 20px;
  position: absolute;
  z-index: 2;

  > img {
    width: 20px;
    height: 20px;
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
  color: #000000;
  font-size: 17px;
  font-weight: 500;
  margin: 0 auto;

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

.header-custom-wrap {
  .header-custom-btn {
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -moz-tap-highlight-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    line-height: 43px;
    position: fixed;
    right: 14px;
    top: 0;
    color: #414655;
    font-family: Arial, Arial-Bold;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
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
  color: #5e626d;
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

.red-dot {
  position: absolute;
  right: -4px;
  background: red;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  top: -2px;
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

.sp-search {
  background: url("/static/image/common/ic_search_grey.png");
  width: 20px;
  height: 20px;
  background-size: contain;
}

.gay-search {
  background: url("/static/image/common/ic_search_white.png");
  width: 20px;
  height: 20px;
  background-size: contain;
}

.normal-search {
  background: url("/static/image/common/ic_search_gold.png");
  width: 20px;
  height: 20px;
  background-size: contain;
}
</style>
