<template>
  <div :class="[$style['account-header']]" id="header">
    <div
      v-if="headerConfig.prev"
      :class="$style['btn-prev']"
      @click="headerConfig.onClick"
    >
      <img :src="$getCdnPath(`/static/image/common/btn_back_black.png`)" />
    </div>

    <div v-if="headerConfig.title" :class="[$style.wrap, 'clearfix']">
      <div :class="[[$style.title]]">
        {{ headerConfig.title }}
      </div>
    </div>

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
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    headerConfig: {
      type: Object,
      default: "porn1"
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    })
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"])
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.account-header {
  margin: 0 auto;
  max-width: $mobile_max_width;
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  color: #ffffff;
  text-align: center;
  border-bottom: 1px solid #eee;
  background: #fefffe;

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
}

.wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.btn-prev {
  align-items: center;
  bottom: 0;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 12px;
  margin: auto;
  position: absolute;
  top: 0;
  width: 20px;
  z-index: 2;

  > img {
    width: 20px;
    height: 20px;
  }
}

.save-wrap {
  -webkit-appearance: none;
  -moz-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -moz-tap-highlight-color: rgba(0, 0, 0, 0);
  box-shadow: none;
  color: #a6a9b2;
  font-size: 15px;
  height: 100%;
  line-height: 43px;
  outline: none;
  position: absolute;
  right: 14px;
  top: 0;
  border: unset;

  > .active {
    color: #414655;
  }
}

.title {
  height: 43px;
  line-height: 43px;
  color: #000000;
  font-size: 17px;
  font-weight: 500;
  margin: 0 auto;
}
</style>
