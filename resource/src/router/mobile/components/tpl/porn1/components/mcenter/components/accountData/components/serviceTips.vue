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
<style lang="scss" module>
@import "~@/css/variable.scss";
.service-tip {
  margin-top: 19px;
  text-align: center;
  width: 100%;
  color: $main_text_color2;
  font-size: 14px;
  height: 250px;
  > span {
    color: #6aaaf5;
  }
}
</style>
