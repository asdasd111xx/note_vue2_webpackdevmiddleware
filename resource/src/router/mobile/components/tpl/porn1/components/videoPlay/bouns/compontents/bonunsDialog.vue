<template>
  <div
    :class="
      isClose ? [$style['dialog'], $style['dialog-close']] : $style['dialog']
    "
  >
    <div>
      <div :class="$style['title-coin']">
        <img
          :src="$getCdnPath('/static/image/_new/actives/bouns/coin_title.png')"
        />
      </div>
      <div :class="$style['title']">
        {{ $text("S_ACTIVITY_SLOGAN", "看越久送越多") }}
      </div>
      <div :class="$style['bouns-func']">
        <div @click="handleClose">
          {{ $text("S_FIRST_LOOK", "先去逛逛") }}
        </div>
        <div @click="handleClose">
          {{ $text("S_JOIN_MEMBER", "加入会员") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {

  },
  data() {
    return {
      isClose: false
    };
  },
  computed: {

  },
  methods: {
    handleClose() {
      this.isClose = true;
      setTimeout(() => {
        this.$emit('close')
      }, 300)
    }
  },
};
</script>
<style src="../index.scss" lang="scss" module></style>

