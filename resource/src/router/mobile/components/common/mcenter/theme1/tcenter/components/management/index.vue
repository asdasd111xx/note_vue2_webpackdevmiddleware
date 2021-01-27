<template>
  <div>
    <div
      v-if="!$route.params.date && subSabState"
      :class="$style['top-link-wrap']"
    >
      <div
        :class="{ [$style.active]: $route.params.page === 'promote' }"
        @click="$router.replace('/mobile/mcenter/tcenter/management/promote')"
      >
        <span>{{ $text("S_FRIENDS_PROMOTE", "推广信息") }}</span>
      </div>
      <div
        :class="{ [$style.active]: $route.params.page === 'member' }"
        @click="$router.replace('/mobile/mcenter/tcenter/management/member')"
      >
        <span>{{ $text("S_MEMBER_STATUS", "会员概况") }}</span>
      </div>
      <div
        :class="{ [$style.active]: $route.params.page === 'friends' }"
        @click="$router.replace('/mobile/mcenter/tcenter/management/friends')"
      >
        <span>{{ $text("S_FIRST_LEVEL_FRIEND", "一级好友") }}</span>
      </div>
    </div>
    <template v-if="$route.params.page === 'member'">
      <member-info
        :set-tab-state="setTabState"
        :set-header-title="setHeaderTitle"
      />
    </template>
    <template v-else-if="$route.params.page === 'promote'">
      <recommend />
    </template>
    <template v-else-if="$route.params.page === 'friends'">
      <first-friends
        :set-header-title="setHeaderTitle"
        :set-back-func="setBackFunc"
        :set-tab-state="setTabState"
        :set-sub-tab-state="setSubTabState"
      />
    </template>
  </div>
</template>

<script>
import management from "@/mixins/mcenter/management/index";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    memberInfo: () =>
      import(
        /* webpackChunkName: 'memberInfo' */ "./components/memberInfo/index"
      ),
    firstFriends: () =>
      import(
        /* webpackChunkName: 'firstFriends' */ "./components/firstFriends/index"
      ),
    recommend: () =>
      import(/* webpackChunkName: 'recommend' */ "./components/recommend/index")
  },
  mixins: [management],
  props: {
    setTabState: {
      type: Function,
      required: true
    },
    setHeaderTitle: {
      type: Function,
      default: () => {}
    },
    setBackFunc: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      subSabState: true
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    }
  },
  created() {
    if (this.$route.params.page) {
      return;
    }

    this.$router.push({
      name: "mcenter-tcenter-management",
      params: { page: "member" }
    });
  },
  methods: {
    setSubTabState(state) {
      this.subSabState = state;
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
