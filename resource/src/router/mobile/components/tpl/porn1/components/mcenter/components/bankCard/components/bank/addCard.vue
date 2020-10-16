<template>
  <div :class="$style['add-bankcard']">
    <template v-if="addBankCardStep === 'one'">
      <div :class="$style['username-wrap']">
        <p :class="$style['input-title']">持卡人姓名</p>
        <div :class="$style['input-wrap']">
          <div
            v-if="memInfo.user.name"
            :class="[
              $style['input-wrap'],
              { [$style['has-name']]: memInfo.user.name }
            ]"
          >
            {{ username }}**
          </div>
          <input
            v-else
            v-model="formData.account_name"
            type="text"
            placeholder="请输入持卡人姓名，仅支持中文、“·”"
            @input="checkData($event.target.value, 'account_name')"
          />
        </div>
      </div>
      <p v-if="!memInfo.user.name" :class="$style['username-remind']">
        为了您的资金能够迅速到账，请确保填写的姓名与银行卡的开户姓名一致
      </p>
    </template>

    <div :class="$style['card-info']">
      <template v-if="addBankCardStep === 'one'">
        <div :class="$style['info-item']">
          <p :class="$style['input-title']">所属银行</p>
          <div :class="$style['select-bank']" @click="isShowPopBankList = true">
            <span :class="{ [$style['select-active']]: currentBank }">
              {{ currentBank ? currentBank : "请选择银行" }}
            </span>
            <img
              :class="$style['arrow-icon']"
              :src="`/static/image/${themeTPL}/common/arrow_next.png`"
            />
          </div>
        </div>

        <template v-if="themeTPL === 'ey1' && !memInfo.config.player_user_bank">
          <div :class="$style['info-item']">
            <p :class="$style['input-title']">省/直辖市</p>
            <div :class="$style['input-wrap']">
              <input
                v-model.trim="formData.province"
                type="text"
                placeholder="请输入省/直辖市"
                maxlength="36"
                @input="checkData($event.target.value, 'province')"
              />
            </div>
          </div>

          <div :class="$style['info-item']">
            <p :class="$style['input-title']">县/市</p>
            <div :class="$style['input-wrap']">
              <input
                v-model.trim="formData.city"
                type="text"
                placeholder="请输入县/市"
                maxlength="36"
                @input="checkData($event.target.value, 'city')"
              />
            </div>
          </div>
        </template>

        <div :class="$style['info-item']">
          <p :class="$style['input-title']">开户支行</p>
          <div :class="$style['input-wrap']">
            <input
              v-model.trim="formData.branch"
              type="text"
              placeholder="请输入开户支行名称"
              maxlength="36"
              @input="checkData($event.target.value, 'branch')"
            />
            <div :class="$style['clear-input']" v-if="formData.branch">
              <img
                :src="
                  $getCdnPath(`/static/image/${themeTPL}/common/ic_clear.png`)
                "
                @click="formData.branch = ''"
              />
            </div>
          </div>
        </div>

        <div :class="$style['info-item']">
          <p :class="$style['input-title']">银行卡号</p>
          <div :class="$style['input-wrap']">
            <input
              v-model="formData.account"
              type="tel"
              placeholder="请输入银行卡卡号(限定16位以上数字)"
              minlength="16"
              maxlength="36"
              @input="checkData($event.target.value, 'account')"
            />
            <div :class="$style['clear-input']" v-if="formData.account">
              <img
                :src="
                  $getCdnPath(`/static/image/${themeTPL}/common/ic_clear.png`)
                "
                @click="formData.account = ''"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-if="addBankCardStep === 'two'">
        <p :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]">
          {{ errorMsg }}
        </p>

        <div :class="$style['info-item']">
          <p :class="$style['input-title']">手机号码</p>
          <div :class="$style['input-wrap']">
            <input
              v-model="formData.phone"
              type="text"
              :placeholder="
                themeTPL === 'porn1' ? '11位手机号码' : '请输入手机号码'
              "
              maxlength="36"
              @input="verification('phone')"
            />
          </div>
        </div>

        <div :class="$style['info-item']">
          <p :class="$style['input-title']">手机验证码</p>
          <div :class="$style['input-wrap']">
            <input
              v-model="formData.keyring"
              type="text"
              placeholder="请输入手机验证码"
              id="phone-code"
              @input="checkData($event.target.value, 'keyring')"
            />
            <div
              :class="[
                $style['send-keyring'],
                { [$style.disabled]: smsTimer || !isVerifyPhone }
              ]"
              @click="showCaptchaPopup"
            >
              {{ time ? `${time}s` : "获取验证码" }}
            </div>
          </div>
        </div>
      </template>

      <div :class="$style['info-confirm']">
        <div :class="$style['confirm-remind']">
          <p v-if="addBankCardStep === 'one'">
            请认真校对银行卡号，卡号错误资金将无法到账
          </p>
          <p v-else>
            1. 为确保您的资金安全，添加银行卡需进行简单的数据核实 <br />
            2. 因手机号码影响各项重要功能，请您务必谨慎填写 <br />
            3. {{ siteConfig.SITE_NAME }}娱乐时刻关心您的资金安全
          </p>
        </div>
        <div
          :class="[$style['submit'], { [$style['disabled']]: !NextStepStatus }]"
          @click="sendData"
        >
          {{
            addBankCardStep === "one" && memInfo.config.player_user_bank_mobile
              ? "下一步"
              : "提交"
          }}
        </div>
      </div>
    </div>

    <p :class="$style['service-remind']">
      如需帮助，请<span
        :class="$style['service-btn']"
        @click="$router.push('/mobile/service?redirect=bankCard')"
        >联系客服</span
      >
    </p>

    <div v-if="isShowPopBankList" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" @click="isShowPopBankList = false" />
      <div :class="$style['pop-menu']">
        <div :class="$style['pop-title']">
          <span @click="isShowPopBankList = false">
            {{ $text("S_CANCEL", "取消") }}
          </span>
          选择所属银行
        </div>
        <ul :class="$style['pop-list']">
          <li v-for="item in bankList" :key="item.id" @click="setBank(item)">
            <!-- <img :src="`https://bbos.bbin-asia.com/elibom/bank/${item.id}.png`" /> -->
            <img v-lazy="getBankImage(item.swift_code)" />
            {{ item.name }}
            <icon
              v-if="item.id === formData.bank_id"
              :class="$style['select-icon']"
              name="check"
            />
          </li>
        </ul>
      </div>
    </div>

    <popup-verification
      v-if="isShowCaptcha"
      :is-show-captcha.sync="isShowCaptcha"
      :captcha.sync="captchaData"
    />

    <message v-if="msg" @close="clearMsg">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import message from "@/router/mobile/components/common/message";
import popupVerification from "@/components/popupVerification";
import bankMixin from "@/mixins/mcenter/bankCard/addCard/bank";

export default {
  components: {
    message,
    popupVerification
  },
  props: {
    setPageStatus: {
      type: Function,
      default: () => { }
    },
    addBankCardStep: {
      type: String,
      required: true
    }
  },
  mixins: [bankMixin],
  created() {
    // 真實姓名不送
    // this.formData.account_name = this.memInfo.user.name;

    axios({
      method: "get",
      url: "/api/payment/v1/c/withdraw/bank/list"
    }).then(response => {
      if (!response.data || response.data.result !== "ok") {
        return;
      }

      this.bankList = response.data.ret;
    });
  },
  beforeDestroy() {
    clearInterval(this.smsTimer);
    this.smsTimer = null;
  },
  computed: {
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    ...mapActions([
      'actionVerificationFormData'
    ]),
    verification(key) {
      if (key === "phone") {
        this.actionVerificationFormData({ target: 'phone', value: this.formData.phone }).then((res => {
          this.formData.phone = res;
        }));
      }
    },
    clearMsg() {
      const { query } = this.$route;
      if (!this.msg.includes("绑定成功")) {
        this.msg = "";
        return;
      }

      // 綁定成功後添加成功後回到遊戲 影片
      this.msg = "";
      let redirect = query.redirect;
      if (!redirect) {
        this.setPageStatus(0, "bankCardInfo", true);
        return;
      }

      clearInterval(this.smsTimer);
      this.smsTimer = null;

      let split = redirect.split("-");
      if (split.length === 2) {
        this.$router.push(`/mobile/${split[0]}/${split[1]}`);
        return;
      }

      // 有分類的遊戲大廳 card casino
      if (split.length === 3) {
        this.$router.push(`/mobile/${split[0]}/${split[1]}?label=${split[2]}`);
        return;
      }

      switch (redirect) {
        case "deposit":
          this.$router.push(`/mobile/mcenter/deposit`);
          return;
        case "wallet":
          this.$router.push(`/mobile/mcenter/wallet`);
          return;
        case "withdraw":
        case "balanceTrans":
          this.$router.push(`/mobile/mcenter/${redirect}`);
          return;
        case "liveStream":
        case "home":
          this.$router.push(`/mobile/${redirect}`);
          return;
        default:
          this.setPageStatus(0, "bankCardInfo", true);
          return;
      }
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/bankCard/porn1.addCard.module.scss"
  module="$style_porn1"
></style>

<style
  lang="scss"
  src="@/css/page/bankCard/ey1.addCard.module.scss"
  module="$style_ey1"
></style>
