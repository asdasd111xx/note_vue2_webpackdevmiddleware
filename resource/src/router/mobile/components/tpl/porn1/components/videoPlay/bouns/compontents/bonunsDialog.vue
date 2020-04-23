<template>
  <div
    :class="
      isClose ? [$style['dialog'], $style['dialog-close']] : $style['dialog']
    "
  >
    <div :class="{ [$style['earn-wrap']]: type !== 'tips' }">
      <div :class="$style['title-coin']">
        <img
          :src="$getCdnPath('/static/image/_new/actives/bouns/coin_title.png')"
        />
      </div>
      <div :class="$style['title']">
        {{ $text("S_ACTIVITY_SLOGAN", "看越久送越多") }}
      </div>
      <template v-if="type == 'tips'">
        <div :class="$style['bouns-func']">
          <div @click="$router.back()">
            {{ $text("S_FIRST_LOOK", "先去逛逛") }}
          </div>
          <div
            @click="$router.push('/mobile/mcenter')"
            :class="$style['active-btn']"
          >
            {{ $text("S_JOIN_MEMBER", "加入会员") }}
          </div>
        </div>
      </template>
      <template v-else>
        <div :class="$style['bouns-earn-wrap']">
          <div :class="$style['earn-title']">
            <span>
              恭喜获得彩金
            </span>
            <span>
              {{ earnCurrentNum }}
            </span>
          </div>
          <div
            v-for="index in earnCellNum"
            :key="index"
            :class="$style['earn-cell']"
          >
            <div>
              <div>
                <img
                  :src="
                    $getCdnPath(
                      '/static/image/_new/actives/bouns/coin_solid.png'
                    )
                  "
                />
              </div>
              <div>+{{ earnSingleNum }}</div>
            </div>
          </div>
        </div>
        <div
          @click="handleClose"
          :class="[$style['earn-keep-btn'], $style['active-btn']]"
        >
          {{ $text("S_ACTIVITY_KEEP") }}
        </div>
      </template>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    type: {
      type: String,
      default: "tips"
    },
  },
  components: {

  },
  data() {
    return {
      isClose: false,
      earnCellNum: 6,
      earnSingleNum: "5.00", //每次獲得彩金
      earnCurrentNum: "15.00", //獲得彩金
      dialogEarnNum: "3" // 賺得彩金量
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

