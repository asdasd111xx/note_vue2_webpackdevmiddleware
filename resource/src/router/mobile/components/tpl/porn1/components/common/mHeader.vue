<template>
  <div
    :class="mainClass"
    id="header"
    :style="hasAppTips ? { top: '60px' } : {}"
  >
    <div
      v-if="headerConfig.hasLogo"
      :class="[$style['logo-wrap']]"
      @click="headerConfig.onClick"
    >
      <img :src="$getCdnPath(`/static/image/${routerTPL}/common/logo.png`)" />
    </div>

    <div
      v-if="headerConfig.prev"
      :class="$style['btn-prev']"
      @click="headerConfig.onClick"
    >
      <img
        v-if="
          source === 'gay' || source === 'les' || siteConfig.ROUTER_TPL == 'ey1'
        "
        :src="$getCdnPath(`/static/image/common/btn_back_white.png`)"
      />
      <img
        v-else-if="source === 'smallPig'"
        :src="
          $getCdnPath(
            `/static/image/common/btn_${
              headerConfig.hasClose ? 'close_grey' : 'back_grey'
            }.png`
          )
        "
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
      <div
        :class="[[$style.title], $style[source], $style[siteConfig.ROUTER_TPL]]"
      >
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

        <div
          v-else
          :class="[$style['normal-search'], $style[siteConfig.ROUTER_TPL]]"
        />
      </div>
    </template>

    <!-- 登錄&註冊 -->
    <template v-if="headerConfig.hasMemInfo">
      <div
        v-if="loginStatus"
        :class="[$style['balance-wrap'], $style[siteConfig.ROUTER_TPL]]"
        @click="setMenuState('balance')"
      >
        <span> {{ `${formatThousandsCurrency(getLoginMoney)} 元` }} </span>
        <div>
          <img
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.ROUTER_TPL}/common/icon_ask2.png`
              )
            "
            @click="handleClickAsk"
          />
          <div v-show="hasUnreadMessage">
            <div :class="$style['information-dot']">
              <span>{{ UnreadMsgCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        :class="[
          $style['login-wrap'],
          { [$style['more']]: String(guestAmount).length > 6 }
        ]"
      >
        <template v-if="activity.isActivity && guestAmount > 0">
          <span :class="$style['visitor-title']" @click="checkLayeredURL"
            >访客彩金</span
          >
          <span
            :class="[$style['visitor-money'], $style['just-money']]"
            @click="checkLayeredURL"
            >{{ `${formatThousandsCurrency(guestAmount)} 元` }}</span
          >
          <span :class="$style['visitor-money']" @click="checkLayeredURL">
            领取
          </span>
        </template>
        <span
          v-else
          :class="$style['visitor-noactivity']"
          @click="checkLayeredURL"
          >访客注册</span
        >

        <span
          @click="
            () => {
              sendUmengEvent(3);
              $router.push('/mobile/login');
            }
          "
          >{{ "| " + $text("S_LOGON", "登录") }}</span
        >
        <img
          :src="
            $getCdnPath(
              `/static/image/${siteConfig.ROUTER_TPL}/common/icon_ask2.png`
            )
          "
          @click="handleClickAsk"
        />
      </div>
    </template>

    <template v-if="headerConfig.isMCenter">
      <div :class="$style['mcenter-wrap']">
        <img
          :src="
            $getCdnPath(
              `/static/image/${siteConfig.ROUTER_TPL}/common/btn_setting.png`
            )
          "
          @click="handleClickSetting"
        />
        <div>
          <img
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.ROUTER_TPL}/common/icon_ask.png`
              )
            "
            @click="handleClickAsk"
          />
          <div v-show="hasUnreadMessage">
            <div :class="$style['information-dot']">
              <span>{{ UnreadMsgCount }}</span>
            </div>
          </div>
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
          :class="[
            $style['header-custom-btn'],
            [$style[siteConfig.ROUTER_TPL]]
          ]"
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
          <img
            :src="$getCdnPath(`/static/image/${routerTPL}/common/btn_help.png`)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
import { getCookie, setCookie } from "@/lib/cookie";
import { thousandsCurrency } from "@/lib/thousandsCurrency";
import { sendUmeng } from "@/lib/sendUmeng";

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
      default: () => {}
    },
    hasUnreadMessage: {
      type: Boolean,
      default: false
    },
    unreadMessageCount: {
      type: Number,
      default: 0
    },
    hasAppTips: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentMenu: "",
      msg: "",
      source: this.$route.query.source,

      remainBonus: 0
    };
  },
  computed: {
    ...mapGetters({
      membalance: "getMemBalance",
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      activity: "getActivity"
    }),
    UnreadMsgCount() {
      if (this.unreadMessageCount >= 100) {
        return "99+";
      }
      return this.unreadMessageCount;
    },
    mainClass() {
      const style = this.$style;
      let disableBackgroundColor = !!["sp1", "aobo1"].includes(
        this.siteConfig.ROUTER_TPL
      );
      return {
        [style.header]: true,
        [style.agent]: this.path[1] === "agcenter",
        [style["is-home"]]: this.$route.name === "home",
        [style[this.source]]: this.source ? this.source : "",
        [style["search-page"]]: this.headerConfig.isSmallPigSearch
          ? true
          : false,
        [style["no-border-bottom"]]: this.headerConfig.noBottomBorder,
        [style["disable-bgcolor"]]:
          disableBackgroundColor && this.$route.name === "home",
        [style[this.siteConfig.ROUTER_TPL]]: true,
        clearfix: true
      };
    },
    path() {
      return this.$route.path.split("/").filter(path => path);
    },
    getLoginMoney() {
      if (this.membalance && this.membalance.total) {
        return `${parseFloat(this.remainBonus) +
          parseFloat(this.membalance.total)}`;
      }
      return "";
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    guestAmount() {
      return this.activity.totalAmount;
    }
  },
  created() {
    this.actionSetActivity();
    if (this.loginStatus) this.getRedJackpot();
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionGetLayeredURL",
      "actionGetActingURL",
      "actionGetRegisterURL",
      "actionSetActivity"
    ]),
    formatThousandsCurrency(value) {
      let _value = Number(value).toFixed(2);
      return thousandsCurrency(_value);
    },
    // 自訂幫助中心事件
    handleHelpLinkTo() {
      if (this.headerConfig.hasHelp && this.headerConfig.hasHelp.func) {
        this.headerConfig.hasHelp.func();
      }
      switch (this.headerConfig.hasHelp.type) {
        case "deposit":
          if (this.routerTPL === "sg1") {
            sendUmeng(47);
          } else {
            sendUmeng(48);
          }
          break;
        default:
          break;
      }

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
      if (
        ["casino", "card", "mahjong", "hotLobby"].includes(this.$route.name)
      ) {
        this.updateSearchStatus();
        return;
      }

      this.$router.push({ path: "search", query: { source: this.source } });
    },

    getRedJackpot() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Event/Info`,
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res.errorCode === "00" && res.status === "000") {
          if (res.data.enable) {
            if (this.loginStatus) this.remainBonus = res.data.remain_bonus;
          }
        }
      });
    },
    checkLayeredURL() {
      sendUmeng(2);
      if (getCookie("platform") === "h") {
        // this.actionGetActingURL().then(res => {
        //   if (res.length > 0 && res.indexOf(window.location.host) != -1) {
        //     this.$router.push(`/mobile/joinmember`);
        //   } else {
        //     this.actionGetLayeredURL().then(res => {
        //       if (res.indexOf(window.location.host) != -1 || res.length < 1) {
        //         this.$router.push(`/mobile/joinmember`);
        //       } else {
        //         window.location.replace(`https://${res[0]}/mobile/joinmember`);
        //       }
        //     });
        //   }
        // });
        this.actionGetRegisterURL().then(res => {
          console.log(res);
          if (res.redirect_url) {
            window.location.replace(res.redirect_url + "/mobile/joinmember");
          } else {
            this.$router.push(`/mobile/joinmember`);
          }
        });
      } else {
        this.$router.push(`/mobile/joinmember`);
      }
    },
    sendUmengEvent(key) {
      sendUmeng(key);
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
  z-index: 10;
  width: 100%;
  height: 43px;
  padding: 0 10px;
  background: #fefffe;
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

  &.disable-bgcolor {
    background: unset;
    background-color: unset;
  }

  &.ey1 {
    background: linear-gradient(#fe2a2a, #b60303);
    color: #ffffff;
  }
}

@media screen and (max-width: 374px) {
  .header {
    width: 100%;
  }

  .balance-wrap {
    position: absolute;
    right: 0;
    top: 0;
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
    height: auto;
    width: 100%;
  }

  @media screen and (max-width: 320px) {
    width: 87px;
  }
}

.login-wrap {
  height: 100%;
  position: absolute;
  right: 8px;
  top: 0;

  &.more {
    > * {
      padding: 0 !important;
      line-height: 15px;
    }
  }

  > span {
    display: inline-block;
    height: 20px;
    // line-height: 20px;
    margin: 0 1px;
    color: var(--visitor_title_color);
    font-size: 17px;
    vertical-align: middle;
    @media screen and(max-width: 320px) {
      font-size: 14px;
    }
  }

  img {
    display: inline-block;
    height: 20px;
    width: 20px;
    vertical-align: middle;

    @media screen and (max-width: 320px) {
      height: 16px;
      width: 16px;
    }
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
    @media screen and(max-width: 320px) {
      font-size: 12px;
    }
  }
  .visitor-money {
    font-size: 14px;
    height: 14px;
    line-height: 14px;
    vertical-align: middle;
    color: var(--visitor_money_get_color);
    margin: 0;
    padding: 0;

    &.just-money {
      max-width: 90px;
      word-break: break-word;
      text-align: right;
      color: var(--visitor_money_color);
      @media screen and(max-width: 320px) {
        max-width: 85px;
      }
    }
    @media screen and(max-width: 320px) {
      font-size: 12px;
      line-height: 12px;
    }
  }
  .visitor-border {
    border-right: 1px solid #9ca4be;
  }
  .visitor-noactivity {
    color: var(--visitor_money_color);
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
  max-width: 66%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.les,
  &.gay {
    color: #fff;
  }

  &.ey1 {
    color: #ffffff;
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
    color: #5e626d;
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
      color: #fff;
    }
  }
}

.header-custom-wrap {
  .header-custom-btn {
    position: absolute;
    right: 15px;
    top: 0px;
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -moz-tap-highlight-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    line-height: 43px;
    color: #414655;
    font-family: Arial, Arial-Bold;
    font-size: 14px;
    font-weight: 500;
    text-align: center;

    &.ey1 {
      color: #ffffff;
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
  // background: var(--video_search_button);
  background: #9ca3bf;
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
  position: absolute;
  right: 17px;
  top: 0;
  color: #000000;

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
  &.aobo1 {
    color: #ffffff;
  }
  &.sp1 {
    color: #ffffff;
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

.information-dot {
  position: absolute;
  left: 9px;
  background: #fb4e74;
  border: 1px solid #fff;
  border-radius: 20px;
  line-height: 14px;
  top: -9px;
  span {
    color: #fff;
    font-size: 10px;
    padding: 0 2px;
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
  background: url("/static/image/common/ic_search_grey.png");
  width: 20px;
  height: 20px;
  background-size: contain;

  &.aobo1 {
    background: url("/static/image/common/ic_search_grey2.png");
    background-size: contain;
  }
}
</style>
