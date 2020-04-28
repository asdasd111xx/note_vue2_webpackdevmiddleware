<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" class="content-wrap">
      <div :class="$style['forget-password']">
        <forget-pwd
          :username="username"
          :email="email"
          :phone="phone"
          :keyring="keyring"
          :password="password"
          :confirm_password="confirm_password"
        >
          <template
            scope="{ msg, sendEmail, verification, send, currentMethod, changeCurrentMethod }"
          >
        <div
            v-if="
            currentMethod !== 'phoneStatus2' &&
                currentMethod !== 'phoneStatus3'
            "
            class="clearfix"
        >
            <div
            :class="[
                $style['method-item'],
                { [$style.active]: currentMethod === 'phoneStatus1' }
            ]"
            @click="
                changeMethod(currentMethod === 'phoneStatus1'),
                changeCurrentMethod('phoneStatus1')
            "
            >
            {{ $t("S_RETRIEVE_PHONE") }}
            </div>
            <div
            :class="[
                $style['method-item'],
                { [$style.active]: currentMethod === 'email' }
            ]"
            @click="
                changeMethod(currentMethod === 'email'),
                changeCurrentMethod('email')
            "
            >
            {{ $t("S_RETRIEVE_EMAIL") }}
            </div>
        </div>
            <div :class="$style['form-wrap']">
              <div :class="$style['form-data']">
                <div :class="$style['user-data']">
                  <div
                    v-if="
                      currentMethod !== 'phoneStatus2' &&
                        currentMethod !== 'phoneStatus3'
                    "
                    :class="$style['form-control']"
                  >
                    <div class="clearfix">
                      <div :class="$style.fieldTitle">{{ $text('S_USER_NAME','用户名') }}</div>
                      <input
                        v-model="username"
                        :class="$style['form-input']"
                        :placeholder="$t('S_PLEASE_ENTER_USER_NAME')"
                        type="text"
                        @input="verification('username')"
                      />
                    </div>
                    <div v-if="msg.username !== ''" :class="$style.tip">
                      {{ msg.username }}
                    </div>
                  </div>
                  <div>
                    <div v-if="currentMethod === 'email'" class="clearfix">

                      <div :class="$style.fieldTitle">{{ $text('SS_E_MAIL','电子邮箱') }}</div>
                      <input
                        v-model="email"
                        :placeholder="$t('S_PLEASE_ENTER_EMAIL')"
                        :class="$style['form-input']"
                        type="text"
                        @input="verification('email')"
                      />
                    </div>
                    <!-- eslint-disable vue/no-v-html -->
                    <div
                      v-if="msg.email !== ''"
                      :class="$style.tip"
                      v-html="msg.email"
                    />
                    <!-- eslint-enable vue/no-v-html -->
                  </div>
                  <div v-if="currentMethod === 'phoneStatus2'" class="clearfix">
                    <input
                      v-model="keyring"
                      :placeholder="$t('S_ENABLE_KEYRING')"
                      :class="$style['form-input']"
                      type="text"
                      @input="verification('keyring')"
                    />
                  </div>
                  <template v-if="currentMethod === 'phoneStatus3'">
                    <div :class="$style['form-control']">
                      <div class="clearfix">
                        <input
                          v-model="password"
                          :class="$style['form-input']"
                          :placeholder="$t('S_ENABLE_PASSWORD')"
                          type="password"
                          @input="verification('password')"
                        />
                      </div>
                      <div v-if="msg.password !== ''" :class="$style.tip">
                        {{ msg.password }}
                      </div>
                    </div>
                    <div>
                      <div class="clearfix">
                        <input
                          v-model="confirm_password"
                          :class="$style['form-input']"
                          :placeholder="$t('S_ENABLE_CHK_PWD')"
                          type="password"
                          @input="verification('confirm_password')"
                        />
                      </div>
                      <div
                        v-if="msg.confirm_password !== ''"
                        :class="$style.tip"
                      >
                        {{ msg.confirm_password }}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div
                v-if="currentMethod === 'email'"
                :class="$style['forget-submit']"
                @click="sendEmail($route.params.type)"
              >
                {{ $t("S_JM_SURE_SEND") }}
              </div>
              <div
                v-else
                :class="$style['forget-submit']"
                @click="send($route.params.type)"
              >
                {{
                  currentMethod === "phoneStatus3"
                    ? $t("S_JM_SURE_SEND")
                    : $t("S_NEXT_STEP")
                }}
              </div>
            </div>
          </template>
        </forget-pwd>
      </div>
    </div>
  </mobile-container>
</template>
<script>
import forgetPwd from './components/forgetPwd';
import mobileContainer from '../common/new/mobileContainer'
export default {
  components: {
    mobileContainer,
    forgetPwd
  },
  data() {
    return {
      username: '',
      email: '',
      phone: '',
      keyring: '',
      password: '',
      confirm_password: ''
    };
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        title: this.$text("S_PASSWORD_FORGET", "忘记密码"),
        onClick: () => { this.$router.back(); }
      };
    }
  },
  methods: {
    changeMethod(status) {
      if (status) return;
      this.username = '';
      this.email = '';
      this.phone = '';
      this.keyring = '';
      this.password = '';
      this.confirm_password = '';
    }
  }
};
</script>

<style lang="scss" module>
.forget-password {
  min-height: 100%;
  font-size: 14px;
  background-repeat: no-repeat;
  background-size: cover;
}

.form-wrap {
  width: 90%;
  margin: 0 auto;
}

.form-data {
  padding: 7% 4% 15%;
}

.method-item {
  float: left;
  width: 47%;
  padding: 3.5% 0;
  margin-left: 6%;
  text-align: center;
  color: #7e7e7e;
  background: rgba(#fff, 0.3);
  border-radius: 35px;

  &:first-child {
    margin-left: 0;
  }

  &.active {
    color: #333;
    background: #fff;
  }
}

.user-data {
  margin-top: 35px;
}

.form-control {
  margin-bottom: 12px;
}

.form-icon {
  float: left;
  width: 9%;
  margin-right: 3%;

  img {
    display: block;
    max-width: 100%;
  }
}

.form-input {
  float: left;
  width: 88%;
  padding: 1.5% 0 4.5%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  outline: 0;
}

.tip {
  margin: 10px 0 0 12%;
  color: #c00;
  text-align: left;
}

.forget-submit {
  padding: 3.5% 0;
  margin-top: 25px;
  color: white;
  text-align: center;
  border-radius: 2px;
  background: linear-gradient(to left, #bd9d7d 0%, #f9ddbd 100%);
}

.fieldTitle {
    padding-bottom: 5px;
}
</style>
