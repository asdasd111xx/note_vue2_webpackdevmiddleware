<template>
  <div
    v-if="routerTPL === 'porn1'"
    :class="[$style.footer, $style[siteConfig.ROUTER_TPL], 'clearfix']"
    id="footer"
  >
    <div
      v-for="info in list"
      :key="info.key"
      :class="[
        $style['footer-item'],
        $style[`${info.key}`],
        {
          [$style.active]: isActive(info.key)
        }
      ]"
      @click="onClick(info)"
    >
      <div>
        <img
          v-if="isActive(info.key)"
          :src="
            $getCdnPath(
              `/static/image/${imagePath}/common/footer/icon_${info.key}_h.png`
            )
          "
        />
        <img
          v-else
          :src="
            $getCdnPath(
              `/static/image/${imagePath}/common/footer/icon_${info.key}_n.png`
            )
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

  <div
    v-else-if="routerTPL === 'aobo1'"
    :class="[$style.footer, 'clearfix']"
    id="footer"
  >
    <div
      v-for="info in listAobo"
      :key="info.key"
      :class="[
        $style['footer-item'],
        $style[`${info.key}`],
        { [$style.active]: isActive(info.key) }
      ]"
      @click="onClick(info)"
    >
      <div>
        <img
          v-if="isActive(info.key)"
          :src="
            $getCdnPath(
              `/static/image/${imagePath}/common/footer/icon_${info.key}_h.png`
            )
          "
        />
        <img
          v-else
          :src="
            $getCdnPath(
              `/static/image/${imagePath}/common/footer/icon_${info.key}_n.png`
            )
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

  <div
    v-else-if="routerTPL === 'sp1'"
    :class="[$style.footer, 'clearfix']"
    id="footer"
  >
    <div
      v-for="info in listSp"
      :key="info.key"
      :class="[
        $style['footer-item'],
        $style[`${info.key}`],
        { [$style.active]: isActive(info.key) }
      ]"
      @click="onClick(info)"
    >
      <div>
        <img
          v-if="isActive(info.key)"
          :src="
            $getCdnPath(
              `/static/image/${imagePath}/common/footer/icon_${info.key}_h.png`
            )
          "
        />
        <img
          v-else
          :src="
            $getCdnPath(
              `/static/image/${imagePath}/common/footer/icon_${info.key}_n.png`
            )
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
import { sendUmeng } from "@/lib/sendUmeng";

export default {
  props: {
    hasUnreadMessage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    imagePath() {
      switch (this.routerTPL) {
        default:
          return "_new";
        case "sp1":
          return "sp1";
        case "porn1":
          return "porn1";
      }
    },
    list() {
      return [
        {
          key: "home",
          name: this.$text("S_HOME", "首页"),
          path: "/mobile"
        },
        {
          key: "promotion",
          name: this.$text("S_PROMOTION", "优惠"),
          path: "/mobile/promotion"
        },
        {
          key: "service",
          name: this.$text("S_SERVIEC", "客服"),
          path: "/mobile/service?prev=false"
        },
        {
          key: "iframe",
          name: this.$text("S_GIFT", "礼包"),
          path:
            "/mobile/iframe/gift?alias=specific_promotion&fullscreen=false&hasHeader=true&hasFooter=true&func=false"
        },
        {
          key: "mcenter-home",
          name: this.$text("S_INFORMATION", "我的"),
          path: "/mobile/mcenter/home"
        }
      ];
    },
    listAobo() {
      return [
        {
          key: "home",
          name: this.$text("S_HOME", "首页"),
          path: "/mobile"
        },
        {
          key: "promotion",
          name: this.$text("S_PROMOTION", "优惠"),
          path: "/mobile/promotion"
        },
        {
          key: "service",
          name: this.$text("S_SERVIEC", "客服"),
          path: "/mobile/service?prev=false"
        },
        {
          key: "discover",
          name: this.$text("S_ALLIANCE", "联盟"),
          path: "/mobile/discover/sponsor?prev=false"
        },
        {
          key: "mcenter-home",
          name: this.$text("S_INFORMATION", "我的"),
          path: "/mobile/mcenter/home"
        }
      ];
    },
    listSp() {
      return [
        {
          key: "home",
          name: this.$text("S_HOME", "首页"),
          path: "/mobile"
        },
        {
          key: "promotion",
          name: this.$text("S_PROMOTION", "优惠"),
          path: "/mobile/promotion"
        },
        {
          key: "service",
          name: this.$text("S_SERVIEC", "客服"),
          path: "/mobile/service?prev=false"
        },
        {
          key: "discover",
          name: this.$text("S_ALLIANCE", "联盟"),
          path: "/mobile/discover/sponsor?prev=false"
        },
        {
          key: "mcenter-home",
          name: this.$text("S_INFORMATION", "我的"),
          path: "/mobile/mcenter/home"
        }
      ];
    }
  },
  methods: {
    onClick({ key, path }) {
      if (key === "discover") {
        localStorage.removeItem("discover-tag");
      }
      switch (key) {
        case "home":
          sendUmeng(19);
          break;
        case "promotion":
          sendUmeng(20);
          break;
        case "service":
          sendUmeng(21);
          break;
        case "iframe":
          sendUmeng(22);
          break;
        case "mcenter-home":
          sendUmeng(23);
          break;
      }
      this.$router.push(path);
    },
    isActive(key) {
      // if (key === "discover") {
      //   return (
      //     [key, "artist", "videoPlay", "tag"].indexOf(this.$route.name) >= 0
      //   );
      // }
      return key === this.$route.name;
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

  background: -webkit-linear-gradient(right, #ffffff, #eeeeee);
  background: -o-linear-gradient(left, #ffffff, #eeeeee);
  background: -moz-linear-gradient(left, #ffffff, #eeeeee);
  background: linear-gradient(to left, #ffffff, #eeeeee);
  &.porn1 {
    background: url("/static/image/porn1/common/footer/bg_tabbar.png") 50% 40% /
      100% no-repeat;
  }

  border-radius: 20px 20px 0 0;
  box-shadow: 0pt -7px 7px 0 rgba(0, 0, 0, 0.05);
}

.footer-item {
  float: left;
  width: 20%;
  height: 45px;
  color: var(--footer_color);
  position: relative;

  &.active {
    color: var(--footer_active_color);
  }

  > div {
    img {
      display: block;
      width: 18px;
      height: 18px;
      margin: 6px auto 0;
    }
  }

  > div:last-of-type {
    overflow: hidden;
    height: 21px;
    line-height: 21px;
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
