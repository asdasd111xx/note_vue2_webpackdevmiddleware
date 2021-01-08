<template>
  <div :class="['clearfix']">
    <serial-number v-if="showSerial" :handle-close="toggleSerial" />
    <!-- 一件回收 -->
    <balance-back />

    <!-- 喜訊 -->
    <template v-if="hasBonusRule">
      <div :class="$style['promotion-tips']" v-for="item in bonusList">
        <div>
          {{ item.text }}
        </div>
        <a title="奖励规则" @click="onGoToRewardRules()">奖励规则</a>
      </div>
    </template>

    <div :class="$style['form']">
      <!-- 錯誤訊息 -->
      <div v-show="tipMsg" :class="$style['top-tips']">
        <div>
          {{ tipMsg }}
        </div>
      </div>

      <template v-for="item in inputInfo">
        <!-- 各欄位錯誤訊息 -->
        <div
          v-if="errorMessage[item.key] && item.key !== 'keyring'"
          :class="[$style['form-tips']]"
        >
          <div>
            {{ errorMessage[item.key] }}
          </div>
        </div>

        <div
          :key="item.key"
          :class="[
            $style['form-content'],
            { [$style['keyring-content']]: item.key === 'keyring' }
          ]"
        >
          <template v-if="item.key === 'target_username'">
            <div :class="$style['form-title']">
              {{ item.title }}
            </div>
            <div :class="$style['form-input']">
              <input
                v-model="formData[item.key]"
                @input="verification(item)"
                :placeholder="item.placeholder"
                type="text"
              />
            </div>
          </template>
          <template v-else-if="item.key === 'keyring'">
            <div :class="[$style['keyring-title']]">
              {{ item.title }}
              &nbsp; &nbsp;
              <span
                v-if="errorMessage['keyring']"
                :class="[$style['keyring-tips']]"
              >
                {{ errorMessage["keyring"] }}
              </span>
            </div>
            <div :class="[$style['keyring-input']]">
              <input
                v-model="formData.keyring"
                :placeholder="item.placeholder"
                @blur="verification(inputInfo[3])"
                @input="verification(inputInfo[3])"
                :maxlength="item.maxlength"
                type="tel"
              />
              <div
                :class="[
                  $style['send-keyring'],
                  {
                    [$style.disabled]:
                      isSendKeyring ||
                      !isVerifyPhone ||
                      !formData.target_username ||
                      !formData.amount
                  }
                ]"
                @click="showCaptcha"
              >
                {{ ttl > 0 ? `${ttl}s` : "获取验证码" }}
              </div>
            </div>
          </template>
          <template v-else>
            <div :class="$style['form-title']">
              {{ item.title }}
            </div>
            <div :class="$style['form-input']">
              <input
                v-if="item.key === 'amount'"
                v-model="formData[item.key]"
                :class="{ [$style.amount]: item.key === 'amount' }"
                @blur="verification(item)"
                @input="verification(item)"
                :placeholder="item.placeholder"
                type="text"
                inputmode="decimal"
              />
              <input
                v-else-if="item.key === 'phone'"
                v-model="formData[item.key]"
                @input="verification(item)"
                :placeholder="item.placeholder"
                type="tel"
              />
            </div>
            <div
              :class="$style['serial-number-links']"
              v-if="item.key === 'amount'"
              @click="toggleSerial"
            >
              流水详情
            </div>
          </template>
        </div>
      </template>

      <div
        :class="[
          $style['submit-wrap'],
          {
            [$style.disabled]: !isVerifyForm || isSendRecharge
          }
        ]"
        @click="sendRecharge"
      >
        <div>立即转让</div>
      </div>
    </div>

    <tips-credit-trans />
    <popup-verification
      v-if="isShowCaptcha"
      :is-show-captcha.sync="isShowCaptcha"
      :captcha.sync="captchaData"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceBack from "@/router/mobile/components/tpl/porn1/components/mcenter/components/common/balanceBack";
import popupVerification from "@/components/popupVerification";
import axios from "axios";
import tipsCreditTrans from "./tipsCreditTrans";
import mixin from "@/mixins/mcenter/recharge/recharge";
import serialNumber from "../../withdraw/components/serialNumber";
export default {
  mixins: [mixin],
  data() {
    return {
      showSerial: false,
      captcha: null,
      toggleCaptcha: false
    };
  },
  components: {
    balanceBack,
    popupVerification,
    tipsCreditTrans,
    serialNumber
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    isShowCaptcha: {
      get() {
        return this.toggleCaptcha;
      },
      set(value) {
        return (this.toggleCaptcha = value);
      }
    },
    captchaData: {
      get() {
        return this.captcha;
      },
      set(value) {
        return (this.captcha = value);
      }
    }
  },
  created() {
    this.getRechargeBalance();
    this.actionSetRechargeConfig();
  },
  watch: {
    captchaData(val) {
      this.getKeyring();
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionSetUserdata"]),
    toggleSerial() {
      this.showSerial = !this.showSerial;
    },
    showCaptcha() {
      if (!this.formData.phone) {
        return;
      }

      const params = [this.rechargeCheck(), this.actionSetUserdata(true)];

      Promise.all(params).then(res => {
        if (res[0] === true) {
          this.toggleCaptcha = true;
        }
      });
    }
  }
};
</script>
<style lang="scss" src="../css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
