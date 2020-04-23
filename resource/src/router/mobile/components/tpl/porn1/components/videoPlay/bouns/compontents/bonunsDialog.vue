<template>
  <div
    :class="
      isClose ? [$style['dialog'], $style['dialog-close']] : $style['dialog']
    "
  >
    <div
      :class="{ [$style['earn-wrap']]: !type.includes('tips') }"
      id="earn-wrap"
    >
      <div
        :class="$style['title-coin']"
        :style="
          dialogHeight && { top: `calc(100% - ${dialogHeight}px - 64px)` }
        "
      >
        <img
          :src="$getCdnPath('/static/image/_new/actives/bouns/coin_title.png')"
        />
      </div>
      <div :class="$style['title']">
        <template v-if="type.includes('poor')">
          {{ $text("S_ACTIVITY_SHORT", "余额不足 请先充值") }}
        </template>
        <template v-else>
          {{ $text("S_ACTIVITY_SLOGAN", "看视频送现金 看越久送越多") }}
        </template>
      </div>
      <template v-if="type == 'tips' || type.includes('poor')">
        <div :class="$style['bouns-func']">
          <div @click="$router.back()">
            {{ $text("S_FIRST_LOOK", "先去逛逛") }}
          </div>
          <div
            v-if="type.includes('poor')"
            @click="$router.push('/mobile/mcenter/deposit')"
            :class="$style['active-btn']"
          >
            {{ $text("S_GO_DEPOSIT", "去充值") }}
          </div>
          <div
            v-else
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
            <template v-if="type.includes('full')">
              <span>
                恭喜获得今日最高彩金
              </span>
              <span> ¥&nbsp;{{ limitAmount }} </span>
            </template>
            <template v-else>
              <span>
                恭喜获得彩金
              </span>
              <span> ¥&nbsp;{{ earnCurrentNum }} </span>
            </template>
          </div>
          <div :class="$style['earn-cell-wrap']">
            <div
              v-for="index in earnCellNum"
              :key="index"
              :class="[
                $style['earn-cell'],
                { [$style['active']]: index <= hadEarnNum }
              ]"
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
                <div :class="[$style['earn-single-num']]">
                  +{{ earnSingleNum }}
                </div>
                <img
                  v-if="index <= hadEarnNum"
                  :class="[$style['had-earned']]"
                  :src="
                    $getCdnPath('/static/image/_new/actives/bouns/get_icon.png')
                  "
                />
              </div>
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
  watch: {
    earnCellNum() {
      if (this.earnCellNum < 0) {
        this.earnCellNum = 6; //暫時防呆
      }
    }
  },
  data() {
    return {
      dialogHeight: 0,
      isClose: false,
      earnCellNum: 6, // 可獲得彩金數
      hadEarnNum: 0, // 已經獲得彩金數
      earnSingleNum: "0.00", //每次獲得彩金
      earnCurrentNum: "0.00", //獲得彩金
      limitAmount: "" //最高彩金
    };
  },
  computed: {

  },
  mounted() {
    this.$nextTick(() => {
      this.getDialogHeight()
    });
    window.addEventListener('resize', this.getDialogHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getDialogHeight);
  },
  created() {
  },
  methods: {
    getDialogHeight() {
      let t = document.getElementById('earn-wrap');
      if (t.offsetHeight)
        this.dialogHeight = t.offsetHeight;
    },
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

