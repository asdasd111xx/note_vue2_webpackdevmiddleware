<template>
  <div
    id="TencentCaptcha"
    :class="[
      $style['click-unit'],
      $style['click-unit-captcha'],
      { [$style['disable']]: puzzleObj }
    ]"
    data-appid="2028894711"
    data-cbfn="callback"
  >
    <div :class="$style['icon']">
      <img
        :src="
          $getCdnPath(
            `/static/image/_new/login/ic_verification_${
              puzzleObj ? 'success' : 'check'
            }.png`
          )
        "
      />
    </div>

    <span v-if="puzzleObj" :class="$style['success']">验证成功</span>
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
    return {};
  },
  mounted() {
    this.createScript();

    window.callback = res => {
      // res（用户主动关闭验证码）= {ret: 2, ticket: null}
      // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
      if (res.ret === 0) {
        const { appid, randstr, ticket } = res;
        let data = {
          appid: appid,
          randstr: randstr,
          icket: ticket
        };
        this.$emit("update:puzzleObj", data);
      } else {
        this.$emit("update:puzzleObj", {});
      }
      return;
    };
  },
  methods: {
    createScript() {
      let script = document.createElement("script");
      script.setAttribute("src", "https://ssl.captcha.qq.com/TCaptcha.js");
      document.head.appendChild(script);
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
