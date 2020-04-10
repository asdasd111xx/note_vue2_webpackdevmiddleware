<template>
  <div :class="[$style.footer, 'clearfix']">
    <div
      v-for="info in list"
      :key="info.key"
      :class="[
        $style['footer-item'],
        $style[`${info.key}`],
        { [$style.active]: info.key === $route.name }
      ]"
      @click="onClick(info)"
    >
      <img
        v-if="info.key === $route.name"
        :src="
          $getCdnPath(`/static/image/_new/common/footer/icon_${info.key}_h.png`)
        "
      />
      <img
        v-else
        :src="
          $getCdnPath(`/static/image/_new/common/footer/icon_${info.key}_n.png`)
        "
      />
      <div>{{ info.name }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    list() {
      return [
        { key: 'home', name: this.$text('S_HOME', '首页'), path: '/mobile' },
        { key: 'promotion', name: this.$text('S_PROMOTION', '优惠'), path: '/mobile/promotion' },
        // { key: 'liveStream', name: this.$text('S_LIVE_STREAM', '直播'), path: '/mobile/liveStream' },
        { key: 'service', name: this.$text('S_SERVIEC', '客服'), path: '/mobile/service' },
        { key: 'discover', name: this.$text('S_DISCOVER', '发现'), path: '/mobile/discover' },
        { key: 'mcenter-home', name: this.$text('S_INFORMATION', '我的'), path: '/mobile/mcenter/home' }
      ];
    }
  },
  methods: {
    onClick({ key, path }) {
      //   if ((key === 'mcenter-home' || key === 'liveStream') && !this.loginStatus) {
      //     this.$router.push('/mobile/login');
      //     return;
      //   }  console.log(path)
      this.$router.push(path);
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 60px;
  z-index: 2;

  background: -webkit-linear-gradient(right, #ffffff, #eeeeee);
  background: -o-linear-gradient(left, #ffffff, #eeeeee);
  background: -moz-linear-gradient(left, #ffffff, #eeeeee);
  background: linear-gradient(to left, #ffffff, #eeeeee);

  border-radius: 20px 20px 0 0;
  box-shadow: 0pt -7px 7px 0 rgba(0, 0, 0, 0.05);
}

.footer-item {
  float: left;
  width: 20%;
  height: 45px;
  color: $main_footer_color1;

  &.active {
    color: $main_footer_active_color1;
  }

  > div {
    overflow: hidden;
    height: 21px;
    line-height: 21px;
    padding: 0 3px;
    font-size: 12px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > img {
    display: block;
    width: 18px;
    height: 18px;
    margin: 6px auto 0;
  }
}

.liveStream {
  position: relative;
  bottom: 16px;

  img {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    border-radius: 50%;
  }
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
