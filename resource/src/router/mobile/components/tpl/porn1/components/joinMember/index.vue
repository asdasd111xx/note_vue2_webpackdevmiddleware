<script>
//data:tabItem 為陣列
//div v-for tabItem(後端手機註冊有開關)

//component: import webchunk的方式
</script>

<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="false"
  >
    <div slot="content" class="content-wrap">
      <div :class="[$style['join-member-wrap'], $style[routerTPL]]">
        <!-- 訪客&&活動開啟文案 -->
        <div
          class="clearfix"
          v-if="activity.isActivity && activity.totalAmount > 0"
        >
          <div :class="$style['visitor-get']">
            访客加入会员
          </div>
          <div :class="$style['visitor-get']">
            {{
              `领取彩金：${formatThousandsCurrency(activity.totalAmount)} 元`
            }}
          </div>
        </div>
        <template v-if="routerTPL === 'sg1'"
          ><div :class="$style['visitor-get']" style="color:#000">
            注册即送 300 钻
          </div></template
        >
        <div :class="[$style['join-tab']]">
          <div
            v-for="(item, index) in tabItem"
            :key="item.key"
            :class="[
              [$style['tab-item']],
              { [$style['is-current']]: $route.params.type === item.key }
            ]"
            :style="{ width: `${100 / tabItem}%` }"
            @click="
              $route.params.type === item.key ? '' : changeItem(item, index)
            "
          >
            {{ item.name }}
          </div>
          <div
            :class="$style['active-slider']"
            :style="{ left: `calc(25% + 50% * ${currentTab})` }"
          ></div>
        </div>

        <component :is="$route.params.type" :theme="$style">
          <template slot="join-header" />
        </component>

        <!-- <joinmember :theme="$style">
          <template slot="join-header" />
        </joinmember> -->
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
// import joinMember from "@/router/web/components/page/join_member";
// import joinPhone from "@/router/web/components/page/join_phone";
import mobileContainer from "../common/mobileContainer";
import { thousandsCurrency } from "@/lib/thousandsCurrency";

export default {
  components: {
    joinmember: () =>
      import(
        /* webpackChunkName: 'joinMember' */ "@/router/web/components/page/join_member"
      ),
    joinphone: () =>
      import(
        /* webpackChunkName: 'join_phone' */ "@/router/web/components/page/join_phone"
      ),
    mobileContainer
  },
  data() {
    return {
      script: null,
      tabItem: [
        {
          key: "joinmember",
          name: "帳號註冊",
          show: true
        },
        {
          key: "joinphone",
          name: "手機註冊",
          show: true
        }
      ],
      currentTab: 1
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      activity: "getActivity"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          if (this.$route.query.login === "1") {
            this.$router.replace(`/mobile/login`);
          } else {
            this.$router.push(`/mobile/home`);
          }
        },
        hasClose: true,
        title:
          this.activity.isActivity && this.activity.totalAmount > 0
            ? "领取彩金"
            : "访客注册"
      };
    }
  },
  methods: {
    changeItem(item, index) {
      this.$router.replace({ params: { type: item.key } });
      this.currentTab = index;
    },
    formatThousandsCurrency(value) {
      let _value = Number(value).toFixed(2);
      return thousandsCurrency(_value);
    }
  },
  beforeDestroy() {},
  created() {
    if (this.loginStatus) {
      this.$router.push("/mobile");
      return;
    }
    if (this.$route.params.type === "joinmember")
      this.$router.replace({
        params: {
          type: "joinphone"
        }
      });
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
@import "~@/css/page/joinMem.module.scss";

.join-input {
  background-color: #fff;

  &::placeholder {
    color: #a5a5a5;
  }
}

.js-nc-check-bar {
  max-width: 300px;
  padding: 0;
  width: 100%;
}
.join-tab {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}
.tab-item {
  color: #5e626d;
  font-weight: 500;
  font-size: 17px;

  &.is-current {
  }
}
.active-slider {
  width: 43px;
  height: 3px;
  background-color: black;
  position: absolute;
  bottom: -5px;
  transform: translateX(-50%);
  transition: all 0.3s;
}

.visitor-get {
  margin: 5px;
  // color: var(--joinmember_title);
  color: #5e626d;
  width: 100%;
  text-align: center;
  font-weight: 500;
  font-size: 17px;
  &:first-child {
    margin-top: 40px;
  }
  &:last-child {
    margin-bottom: 40px;
  }
}
</style>
