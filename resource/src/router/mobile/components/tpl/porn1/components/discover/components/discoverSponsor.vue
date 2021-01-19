<template>
  <div :class="$style['discover-sponsor-wrap']">
    <div v-for="info in list" :key="info.key" :class="$style.list">
      <div :class="$style.wrap">
        <img :src="$getCdnPath(`/static/image/_new/sponsor/${info.key}.png`)" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    open(info) {
      window.open(info.requestUrl, "_blank");
    }
  },
  computed: {
    list() {
      return [
        {
          key: "sponsor_swaglive"
        },
        {
          key: "sponsor_sigualive"
        },
        {
          key: "sponsor_hglive"
        },
        {
          key: "sponsor_aglive"
        },
        {
          key: "sponsor_suncity"
        },
        {
          key: "sponsor_bbin"
        },
        {
          key: "sponsor_csball"
        },
        {
          key: "sponsor_kycard"
        }
      ];
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.discover-sponsor-wrap {
  background-color: $main_background_white1;
}

.list {
  padding: 3px 13px 0;
}

.wrap {
  display: block;

  img {
    display: block;
    border-radius: 6px;
    width: 100%;
  }
}
</style>
