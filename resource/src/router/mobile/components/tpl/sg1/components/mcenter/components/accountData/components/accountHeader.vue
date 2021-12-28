<template>
  <div :class="[$style['account-header']]" id="header">
    <div
      v-if="headerConfig.prev"
      :class="$style['btn-prev']"
      @click="headerConfig.onClick"
    >
      <img :src="$getCdnPath(`/static/image/common/btn_close_black.png`)" />
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

<style lang="scss" src="../css/sg1.avater.scss" module></style>
