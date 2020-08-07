<template>
  <div :class="[$style['account-header']]" id="header">
    <div
      v-if="headerConfig.prev"
      :class="$style['btn-prev']"
      @click="headerConfig.onClick"
    >
      <img
        :src="
          $getCdnPath(
            `/static/image/${theme}/common/btn_${
              headerConfig.hasClose ? 'close' : 'back'
            }.png`
          )
        "
      />
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
      default: 'porn1'
    },
  },
  data() {
    return {
      theme: 'porn1'
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
  },
  created() {
    this.theme = this.siteConfig.MOBILE_WEB_TPL;
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    onClick() {
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.header.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.header.scss" module="$style_ey1"></style>
