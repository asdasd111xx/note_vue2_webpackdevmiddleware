<template>
  <div :class="[$style.footer, 'clearfix']" id="footer">
    <div
      v-for="info in list"
      :key="info.key"
      :class="[
        $style['footer-item'],
        $style[`${info.key}`],
        { [$style.active]: isActive(info) }
      ]"
      @click="onClick(info)"
    >
      <div>
        <img
          v-if="isActive(info)"
          :src="
            $getCdnPath(`/static/image/sg1/home/footer/icon_${info.key}_h.png`)
          "
        />
        <img
          v-else
          :src="
            $getCdnPath(`/static/image/sg1/home/footer/icon_${info.key}_n.png`)
          "
        />
        <div
          v-if="hasUnreadMessage && info.key === 'mcenter-home'"
          :class="$style['red-dot']"
        />
      </div>
      <div>{{ info.name }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    hasUnreadMessage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus"
    }),
    list() {
      return [
        {
          key: "home",
          routeName: "liveHome",
          name: this.$text("S_HOME", "首页"),
          path: "/mobile/live/home"
        },
        {
          // 泡泡直播體育開啟BB體育
          key: "sport",
          routeName: "live-sport",
          name: this.$text("S_SPORTS_SHORT", "体育"),
          path: `/mobile/iframe/game?kind=1&vendor=lg_sport&hasFooter=true`
        },
        {
          // 泡泡直播娛樂城
          key: "game",
          routeName: "home",
          name: this.$text("S_GAME", "游戏"),
          path: "/mobile/home"
        },
        {
          key: "deposit",
          routeName: "deposit",
          name: this.$text("S_DEPOSIT_BTN", "充值"),
          path: "/mobile/mcenter/deposit?prev=false"
        },
        {
          key: "my",
          routeName: "mcenter-home",
          name: this.$text("S_INFORMATION", "我的"),
          path: "/mobile/mcenter/home"
        }
      ];
    }
  },
  methods: {
    onClick({ key, path }) {
      this.$router.push(path);
    },
    isActive(info) {
      if (
        this.$route.name.indexOf("mcenter-live") > -1 &&
        info.routeName === "mcenter-home"
      ) {
        return true;
      } else if (
        this.$route.name.indexOf("live") > -1 &&
        info.routeName === "liveHome"
      ) {
        return true;
      }
      return info.routeName === this.$route.name;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.footer {
  margin: 0 auto;
  max-width: $mobile_max_width;
  transition: unset !important;
  position: fixed;
  bottom: 0;
  width: 100%;
  min-height: 66px;
  z-index: 5;

  background: -webkit-linear-gradient(bottom, #ffffff, #f0f0f0);
  background: -o-linear-gradient(bottom, #ffffff, #f0f0f0);
  background: -moz-linear-gradient(bottom, #ffffff, #f0f0f0);
  background: linear-gradient(to bottom, #ffffff, #f0f0f0);

  border-radius: 20px 20px 0 0;
  box-shadow: 0pt -7px 7px 0 rgba(0, 0, 0, 0.05);
}

.footer-item {
  float: left;
  width: 20%;
  height: 45px;
  color: $main_footer_color2;
  position: relative;

  &.active {
    color: $main_footer_active_color2;
  }

  > div {
    img {
      display: block;
      width: 33px;
      height: 33px;
      margin: 6px auto 0;
    }
  }

  > div:last-of-type {
    overflow: hidden;
    height: 18px;
    line-height: 18px;
    padding: 0 3px;
    font-size: 12px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.red-dot {
  position: absolute;
  background: red;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  top: 5px;
  right: 33%;
}

@media screen and (min-width: $phone) {
  .footer-item {
    > div {
      font-size: 13px;
    }
  }
}

@media screen and (min-width: $pad) {
  .footer-item {
    > div {
      font-size: 15px;
    }
  }
}
</style>
