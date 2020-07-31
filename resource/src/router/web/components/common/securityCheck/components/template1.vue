<template>
  <div :class="$style.container">
    <div :class="$style.mask" />
    <div :class="$style.content">
      <div :class="$style.title">{{ $text("S_CHECK_PLZ", "请进行验证") }}</div>
      <div :class="$style.close" @click="onClose"></div>
      <div :class="$style.form">
        <div :class="$style.field">
          <div :class="$style['field-title']">
            {{ checkItemInfo[checkItem].title }}
          </div>
          <input
            v-model="inputVal"
            :placeholder="checkItemInfo[checkItem].placeholder"
            type="text"
            @keydown.13="submit"
          />
        </div>
        <div :class="$style.submit" @click="submit">
          {{ $text("S_JM_SURE_SEND", "确认送出") }}
        </div>
      </div>
      <div :class="$style.tip">
        {{ $text("S_NO_SETTING", "若未设置，请联系线上客服") }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: Object,
      default: null
    },
    checkItem: {
      type: String,
      required: true
    },
    onLogin: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      checkItemInfo: {
        name: {
          title: this.$text('S_ENTER_REAL_NAME', '请输入真实姓名'),
          placeholder: this.$text('S_REAL_NAME', '真实姓名')
        }
      },
      inputVal: '',
      lock: false
    };
  },
  computed: {
    $style() {
      return this.theme || this.$styleDefault;
    }
  },
  methods: {
    onClose() {
      this.$emit('update:checkItem', '');
    },
    submit() {
      if (this.lock) {
        return;
      }
      this.lock = true;
      this.onLogin({ [this.checkItem]: this.inputVal }).then(() => {
        this.lock = false;
      });
    }
  }
};
</script>

<style lang="scss" module="$styleDefault">
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: left;
  z-index: 999;
}

.content {
  position: relative;
  margin: 194px auto 0;
  border-radius: 4px;
  background: #2f2f2f;
  padding-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  max-width: 400px;
  color: #fff;
}

.title {
  margin-bottom: 44px;
  padding: 15px 20%;
  background: #292929;
  width: 100%;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.field {
  margin: 0 auto 32px;
  width: 80%;
  max-width: 240px;

  .field-title {
    line-height: 1.5;
  }

  input {
    display: block;
    border: none;
    border-radius: 8px;
    width: 100%;
    height: 40px;
    text-indent: 10px;
    outline: none;
    &.fail {
      border-color: #dc5575;
    }
  }
}

.submit {
  margin: 0 auto;
  border-radius: 8px;
  background: #ba2622;
  width: 80%;
  max-width: 240px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: #d43e3d;
  }
}

.close {
  position: absolute;
  top: 5px;
  right: 10px;
  width: 40px;
  height: 40px;
  line-height: 36px;
  font-size: 36px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: rotate(90deg);
  }
}

.tip {
  margin: 12px auto 0;
  width: 80%;
  color: #b9b9b9;
  font-size: 15px;
  text-align: center;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}
</style>
