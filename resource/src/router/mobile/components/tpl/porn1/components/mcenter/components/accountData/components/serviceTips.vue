<template>
  <div :class="$style['service-tip']">
    <template v-if="type !== 'phone'">
      为了你的隐私安全，信息在确认后将无法修改
    </template>
    <br />
    如需帮助，请
    <span @click="$router.push('/mobile/service')">联系客服</span>
  </div>
</template>

<script>

export default {
  props: {
    type: {
      type: String
    }
  },
};
</script>
<style src="../css/index.module.scss" lang="scss" module>
