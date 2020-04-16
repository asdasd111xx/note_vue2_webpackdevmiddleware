<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" class="content-wrap">
      <message v-if="msg" @close="msg = ''"
        ><div slot="msg">{{ msg }}</div>
      </message>
      <!-- 錯誤訊息 -->
      <div :class="$style['top-tips']">
        <div v-show="tipMsg">
          {{ tipMsg }}
        </div>
      </div>
      <div :class="$style['reset-content']">
        <form id="resetPwdForm">
          <div
            v-for="field in pwdResetInfo"
            :key="field.key"
            :class="$style['field-wrap']"
          >
            <div class="clearfix">
              <div :class="$style['title']">{{ $text(field.text) }}</div>
              <input
                :id="field.key"
                :type="field.type"
                :name="field.key"
                :placeholder="$t(field.text)"
                @input="verification($event.target.id, $event.target.value)"
              />
            </div>
          </div>
          <div
            :class="[$style['submit'], { [$style['active']]: hasValue }]"
            @click="pwdResetSubmit()"
          >
            {{ $text("S_SUBMIT", "提交") }}
          </div>
        </form>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import resetPwd from '@/mixins/resetPwd';
import mobileContainer from '../common/new/mobileContainer'
import message from '../common/new/message'

export default {
  mixins: [resetPwd],
  data() {
    return {
      tipMsg: "",
      msg: ""
    }
  },
  components: {
    mobileContainer,
    message,
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text("S_CHANGE_PASSWD", "修改密码"),
      };
    },
    hasValue() {
    }

  },
  created() {
  },
  methods: {
  }
};

</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.reset-container {
  min-height: 100%;
  background-color: $main_background_white1;
}

.top-tips {
  background: $main_white_color1;
  padding: 0 14px;
  color: #db6372;
  height: 40px;
  line-height: 40px;
}

.reset-content {
  margin-top: 50px;
  padding: 0 14px;
}

input {
  width: 100%;
  background: none;
  border: none;
  outline: none;
  border-radius: 0;
  color: $main_text_color3;

  &::placeholder {
    color: #cbced8;
  }
}

.field-wrap {
  font-size: 14px;
  width: 100%;
  margin-bottom: 8px;
  height: 77px;

  .title {
    color: $main_text_color3;
    margin-bottom: 6px;
  }

  input {
    font-size: 16px;
    height: 21px;

    &::placeholder {
      color: #cbced8;
    }
  }

  border-bottom: solid 1px $main_background_white1;
}

.submit {
  height: 45px;
  text-align: center;
  line-height: 45px;
  max-width: 375px;
  width: 100%;
  font-size: 14px;
  background: -webkit-linear-gradient(right, #e9dacb, #eee5db);
  background: -o-linear-gradient(left, #e9dacb, #eee5db);
  background: -moz-linear-gradient(left, #e9dacb, #eee5db);
  background: linear-gradient(to left, #e9dacb, #eee5db);
  color: #f3ede7;
  margin: 0 auto;
  &.active {
    background: -webkit-linear-gradient(right, #bd9d7d, #f9ddbd);
    background: -o-linear-gradient(left, #bd9d7d, #f9ddbd);
    background: -moz-linear-gradient(left, #bd9d7d, #f9ddbd);
    background: linear-gradient(to left, #bd9d7d, #f9ddbd);
    color: white;
  }
}

@media screen and (min-width: $pad) {
  .submit {
    font-size: 17px;
  }

  .field-wrap {
    font-size: 16px;
  }

  .field-wrap {
    font-size: 17px;
  }
}
</style>
