<template>
  <div :class="$style['popup']">
    <div :class="$style['mask']" />
    <div :class="$style['block']">
      <div :class="$style['content']">
        <div>温馨提示</div>
        <div>{{ parseType }}功能无法使用，请联系在线客服</div>
      </div>
      <div :class="$style['close']" @click="closeTips">
        确认
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    parseType() {
      switch (this.type) {
        case "transfer":
          return "转帐";
          break;

        case "withdraw":
          return "提现";
          break;

        case "deposit":
          return "充值";
          break;
      }
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    closeTips() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" module>
.popup {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.mask {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
}

.block {
  position: absolute;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fefefe;
  border-radius: 8px;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 120px;
  padding: 0 20px;
  text-align: center;

  > div:first-child {
    font-size: 16px;
    padding: 15px 0 20px;
  }
}

.close {
  text-align: center;
  padding: 15px 0;
  border-top: 2px solid #f9f9f8;
  color: #93c1ff;
}
</style>
