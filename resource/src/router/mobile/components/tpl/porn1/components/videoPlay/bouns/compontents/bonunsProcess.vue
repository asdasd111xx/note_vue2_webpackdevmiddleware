<template>
  <div
    :class="
      isClose
        ? [$style['bouns-process-wrap'], $style['dialog-close']]
        : $style['bouns-process-wrap']
    "
  >
    <div :class="[$style['bouns-process'], { [$style['active']]: isEarn }]">
      <div :class="$style['coin']">
        <img
          :src="
            $getCdnPath(`/static/image/_new/actives/bouns/${curCoinSrc}.png`)
          "
        />
        <span>{{ process }} </span>
      </div>
    </div>

    <div :class="$style['content']"></div>
  </div>
</template>
<script>

export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      curCoinSrc: "coin_bg",
      coinType: [{ key: 'done', src: 'coin_g' },
      { key: 'process', src: 'coin_bg' },
      { key: 'done', src: 'coin_y' }],
      process: 9,
      isEarn: false,
      isClose: false
    };
  },
  computed: {

  }
};
</script>
<style src="../index.scss" lang="scss" module></style>

