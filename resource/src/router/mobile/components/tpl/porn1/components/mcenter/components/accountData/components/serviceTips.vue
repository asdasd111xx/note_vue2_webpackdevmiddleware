<template>
  <div :class="$style['service-tip']">
    <!-- <template v-if="theme === 'ey1' || type !== 'phone'">
      为了你的隐私安全，信息在确认后将无法修改
    </template> -->
   
    <template v-if="!edit">
      为了你的隐私安全，信息在确认后将无法修改
    </template>
    <br />
      如需帮助，请
    <span @click="$router.push('/mobile/service')">联系客服</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    type: {
      type: String
    },
    edit:{
      type: Boolean
    }
  },
  mounted(){
    this.show=!this.edit
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    theme() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
};
</script>
<style src="../css/index.module.scss" lang="scss" module />
