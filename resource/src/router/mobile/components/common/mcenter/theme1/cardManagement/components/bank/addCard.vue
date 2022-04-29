<template>
  <div :class="$style['add-bankcard']">
    <p :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]">
      {{ errorMsg }}
    </p>

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
            v-model="formData.accountName"
            type="text"
            placeholder="请输入持卡人姓名，仅支持中文、“·”"
            @input="checkData($event.target.value, 'accountName')"
          />
          <div :class="$style['clear-input']" v-if="formData.accountName">
            <img
              :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
              @click="formData.accountName = ''"
            />
          </div>
        </div>
      </div>
      <p v-if="!memInfo.user.name" :class="$style['username-remind']">
        为了您的资金能够迅速到帐，请确保填写的姓名与银行卡的开户姓名一致
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
              :src="`/static/image/common/arrow_next.png`"
            />
          </div>
        </div>

        <div :class="$style['info-item']">
          <p :class="$style['input-title']">开户支行</p>
          <div :class="$style['input-wrap']">
            <input
              v-model.trim="formData.branch"
              type="text"
              placeholder="请输入开户银行的支行(网点)名称"
              maxlength="36"
              @input="checkData($event.target.value, 'branch')"
            />
            <div :class="$style['clear-input']" v-if="formData.branch">
              <img
                :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
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
              placeholder="请输入银行卡卡号(限定16位以上)"
              minlength="16"
              maxlength="36"
              @input="checkData($event.target.value, 'account')"
            />
            <div :class="$style['clear-input']" v-if="formData.account">
              <img
                :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
                @click="formData.account = ''"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-if="addBankCardStep === 'two'">
        <div :class="$style['info-item']">
          <p :class="$style['input-title']">手机号码</p>
          <div :class="$style['input-wrap']">
            <input
              v-model="formData.phone"
              type="text"
              :placeholder="'请输入手机号码'"
              :class="$style['phone-input']"
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
            请认真校对银行卡号，卡号错误资金将无法到帐
          </p>
          <p v-else>
            1. 为确保您的资金安全，添加银行卡需进行简单的数据核实 <br />
            2. 因手机号码影响各项重要功能，请您务必谨慎填写 <br />
            3.
            {{ siteConfig.SITE_NAME }}时刻关心您的资金安全
          </p>
        </div>
        <div
          :class="[$style['submit'], { [$style['disabled']]: !NextStepStatus }]"
          @click="sendData"
        >
          {{
            addBankCardStep === "one" && checkPhoneVerification
              ? "下一步"
              : "提交"
          }}
        </div>
      </div>
    </div>

    <p :class="$style['service-remind']">
      如需帮助，请<span
        :class="$style['service-btn']"
        @click="handleClickService"
        >联系客服</span
      >
    </p>

    <div v-if="isShowPopBankList" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" @click="isShowPopBankList = false" />
      <div :class="$style['pop-menu']">
        <div :class="[$style['pop-title']]">
          <span @click="isShowPopBankList = false">
            {{ $text("S_CANCEL", "取消") }}
          </span>
          选择所属银行
        </div>
        <ul :class="$style['pop-list']">
          <li v-for="item in bankList" :key="item.id" @click="setBank(item)">
            <!-- <img :src="`https://bbos.bbin-asia.com/elibom/bank/${item.id}.png`" /> -->
            <img v-lazy="getBankImage(item.image_url)" />
            {{ item.name }}
            <icon
              v-if="item.id === formData.bankId"
              :class="[$style['select-icon']]"
              name="check"
            />
          </li>
        </ul>
      </div>
    </div>

    <popup-verification
      v-if="isShowCaptcha"
      @show-captcha="showCaptcha"
      @set-captcha="setCaptcha"
      :page-type="'default'"
    />

    <message v-if="msg" @close="clearMsg">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import message from "@/router/mobile/components/common/message";
import popupVerification from "@/components/popupVerification";
import bankMixin from "@/mixins/mcenter/bankCard/addCard/bank";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    message,
    popupVerification
  },
  props: {
    setPageStatus: {
      type: Function,
      default: () => {}
    },
    addBankCardStep: {
      type: String,
      required: true
    }
  },
  mixins: [bankMixin],
  created() {
    // 真實姓名不送
    // this.formData.accountName = this.memInfo.user.name;

    goLangApiRequest({
      method: "get",
      url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Withdraw/Bank/List`,
      params: {
        lang: "zh-cn"
      }
    }).then(response => {
      const { data, status, errorCode } = response;

      if (errorCode !== "00" || status !== "000") {
        return;
      }

      this.bankList = data;
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
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  methods: {
    ...mapActions(["actionVerificationFormData"]),
    handleClickService() {
      localStorage.setItem("bankCardType", "bankCard");
      this.$router.push("/mobile/service?redirect=bankCard");
    },
    verification(key) {
      if (key === "phone") {
        this.actionVerificationFormData({
          target: "phone",
          value: this.formData.phone
        }).then(res => {
          this.formData.phone = res;
        });
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
      let redirect = query.redirect || "";

      clearInterval(this.smsTimer);
      this.smsTimer = null;

      if (!redirect) {
        this.setPageStatus("bankCardInfo", true);
        this.NextStepStatus = false;
        this.$emit("update:addBankCardStep", "one");
        return;
      }

      let split = redirect?.split("-");
      if (split.length === 2) {
        this.$router.replace(`/mobile/${split[0]}/${split[1]}`);
        return;
      }

      // 有分類的遊戲大廳 card casino
      if (split.length === 3) {
        this.$router.replace(
          `/mobile/${split[0]}/${split[1]}?label=${split[2]}`
        );
        return;
      }

      switch (redirect) {
        case "deposit":
        case "wallet":
        case "withdraw":
        case "balanceTrans":
          this.$router.replace(`/mobile/mcenter/${redirect}`);
          return;
        case "liveStream":
        case "home":
          this.$router.replace(`/mobile/${redirect}`);
          return;
        case "live":
          this.$router.back();
        case "iframe":
          let path = localStorage.getItem("bank-card-back-redirect");
          localStorage.removeItem("bank-card-back-redirect");
          if (path) {
            this.$router.push(path);
          } else {
            this.$router.back();
          }
          break;
        default:
          break;
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
  src="@/css/page/bankCard/sg1.addCard.module.scss"
  module="$style_sg1"
></style>
