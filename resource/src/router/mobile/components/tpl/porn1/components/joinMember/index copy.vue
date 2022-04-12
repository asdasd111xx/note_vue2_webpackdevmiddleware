<script>
//data:tabItem 為陣列
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
        <div v-for="item in tabItem" :key="item.key" @click="changeItem(item)">
          {{ item.name }}
        </div>
        <component :is="$route.params.type">
          <template slot="join-header" />
        </component>

        <!-- <joinmember>
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
      ]
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
    changeItem(item) {
      this.$router.replace({ params: { type: item.key } });
    }
  },
  beforeDestroy() {},
  created() {
    if (this.loginStatus) {
      this.$router.push("/mobile");
      return;
    }
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
@import "~@/css/variable.scss";

.join-member-wrap {
  min-height: calc(100vh - 43px);
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/image/porn1/common/bg.png");

  &.aobo1,
  &.sp1 {
    background-image: url("/static/image/aobo1/common/bg.png");
  }
  // form {
  //   width: 90vw;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  // }
}

.join-input {
  background-color: #fff;

  &::placeholder {
    color: #a5a5a5;
  }
}

.join-withdraw-password-help-show {
  width: 290px;
  font-size: 12px;
  text-align: start;
  position: relative;
  left: -90px;
}

.join-btn {
  margin: 0 auto;
  background: var(--main_button_color1);
  border-radius: 30px;
  height: 50px;
  line-height: 50px;
  width: 100%;
  max-width: 300px;
  font-size: 13px;
  font-family: Segoe UI, Segoe UI-Bold;
  font-weight: 700;
  text-align: center;
  color: var(--main_button_text_color1);

  &.disable {
    background: var(--main_button_color2);
    color: var(--main_button_text_color2);
    pointer-events: none;
  }
}

.js-nc-check-bar {
  max-width: 300px;
  padding: 0;
  width: 100%;
}
</style>
