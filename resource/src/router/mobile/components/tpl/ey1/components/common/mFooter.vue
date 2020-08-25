<template>
  <div :class="[$style.footer, 'clearfix']" id="footer">
    <div
      v-for="info in list"
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
              `/static/image/ey1/common/footer/icon_tab_${info.key}_sel.png`
            )
          "
        />
        <img
          v-else
          :src="
            $getCdnPath(
              `/static/image/ey1/common/footer/icon_tab_${info.key}_normal.png`
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
import { mapGetters } from 'vuex';

export default {
  props: {
    hasUnreadMessage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    list() {
      return [
        { key: 'home', name: this.$text('S_HOME', '首页'), path: '/mobile' },
        { key: 'promotion', name: this.$text('S_PROMOTION', '优惠'), path: '/mobile/promotion' },
        { key: 'service', name: this.$text('S_SERVIEC', '客服'), path: '/mobile/service' },
        { key: 'gift', name: this.$text('S_GIFT', '礼包'), path: '/mobile/gift' },
        { key: 'mcenter-home', name: this.$text('S_INFORMATION', '我的'), path: '/mobile/mcenter/home' }
      ];
    }
  },
  methods: {
    onClick({ key, path }) {
      if (key === 'discover') {
        localStorage.removeItem('discover-tag');
      }

      this.$router.push(path);
    },
    isActive(key) {
      if (key === 'gift') {
        return ['gift', 'giftDetail'].indexOf(this.$route.name) >= 0;
      }
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
  min-height: 60px;
  z-index: 2;
  background: -webkit-linear-gradient(top, #ffffff, #f8e6e6);
  background: -o-linear-gradient(bottom, #ffffff, #f8e6e6);
  background: -moz-linear-gradient(bottom, #ffffff, #f8e6e6);
  background: linear-gradient(to bottom, #ffffff, #f8e6e6);
  border-radius: 20px 20px 0 0;
  box-shadow: 0pt -7px 7px 0 rgba(0, 0, 0, 0.05);
}

.footer-item {
  float: left;
  width: 20%;
  height: 45px;
  color: $ey_text_color1;
  position: relative;

  &.active {
    color: #e42a30;
  }

  > div {
    img {
      display: block;
      width: 23px;
      height: 23px;
      margin: 11px auto 0;
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
  top: 10px;
  right: 33%;
}
</style>
