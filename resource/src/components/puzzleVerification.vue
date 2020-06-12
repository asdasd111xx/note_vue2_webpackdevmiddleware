<template>
  <div
    id="TencentCaptcha"
    :class="[
      $style['click-unit'],
      $style['click-unit-captcha'],
      { [$style['disable']]: ret === 0 }
    ]"
    @click="showCaptcha"
  >
    <div :class="$style['icon']">
      <img
        :src="
          $getCdnPath(
            `/static/image/_new/login/ic_verification_${
              ret === 0 ? 'success' : 'check'
            }.png`
          )
        "
      />
    </div>

    <span v-if="ret === 0" :class="$style['success']">验证成功</span>
    <span v-else>点击按钮进行验证</span>
  </div>
</template>

<script>
export default {
  props: {
    puzzleObj: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      ret: null
    };
  },
  methods: {
    showCaptcha() {
      let captcha = new TencentCaptcha("2028894711", res => {
        if (res.ret === 0) {
          const { appid, randstr, ticket, ret } = res;
          this.ret = ret;
          let data = {
            appid: appid,
            randstr: randstr,
            ticket: ticket
          };
          this.$emit("update:puzzleObj", data);
        } else {
          this.ret = null;
          this.$emit("update:puzzleObj", null);
        }
        return;
      });

      captcha.show()
    }
  }
};
</script>

<style lang="scss" module>
.click-unit {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  background: #fefefe;
  margin-bottom: 11px;
  border: 1px solid rgba(128, 128, 128, 0.26);
  border-radius: 3px;

  &.disable {
    // pointer-events: none;
  }

  .icon {
    position: absolute;
    top: calc(50% - 9px);
    left: 0;
    width: 30px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      width: 18px;
      height: 18px;
    }
  }
  span {
    padding-left: 38px;
    color: #a5a5a5;

    &.success {
      color: #34d158;
    }
  }
}
</style>
