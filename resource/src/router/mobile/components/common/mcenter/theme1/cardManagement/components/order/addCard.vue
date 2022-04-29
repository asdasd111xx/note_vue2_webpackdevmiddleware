<template>
  <div :class="$style['add-bankcard']">
    <p :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]">
      {{ errorMsg }}
    </p>
    <div :class="$style['card-info']">
      <div :class="$style['info-item']">
        <p :class="$style['input-title']">所属银行</p>
        <div :class="$style['input-wrap']">
          <input
            v-model="formData.bank"
            type="text"
            placeholder="请输入所属银行"
            @input="handleType($event.target.value, 'order-bank')"
          />
          <div :class="$style['clear-input']" v-if="formData.bank">
            <img
              :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
              @click="formData.bank = ''"
            />
          </div>
        </div>
      </div>
      <div :class="$style['info-item']">
        <p :class="$style['input-title']">银行卡号</p>
        <div :class="$style['input-wrap']">
          <input
            v-model="formData.account"
            type="text"
            placeholder="请输入银行卡卡号/钱包"
            @input="handleType($event.target.value, 'order-bank-account')"
          />
          <div :class="$style['clear-input']" v-if="formData.account">
            <img
              :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
              @click="formData.account = ''"
            />
          </div>
        </div>
      </div>
      <div :class="$style['info-confirm']">
        <div :class="$style['confirm-remind']">
          <p>
            请认真校对银行卡号，卡号错误资金将无法到帐
          </p>
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
  </div>
</template>

<script>
import goLangApiRequest from "@/api/goLangApiRequest";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      formData: { bank: "", account: "" },
      errorMsg: ""
    };
  },
  props: {
    setPageStatus: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    orderConfirmBtnActive() {
      return this.formData.bank && this.formData.account;
    }
  },
  methods: {
    ...mapActions(["actionVerificationFormData"]),
    handleType(value, key) {
      switch (key) {
        case "order-bank":
          this.actionVerificationFormData({
            target: "order-bank",
            value: value
          }).then(val => {
            this.formData.bank = val;
          });
          break;
        case "order-bank-account":
          this.actionVerificationFormData({
            target: "order-bank-account",
            value: value
          }).then(val => {
            this.formData.account = val;
          });
          break;
        default:
          break;
      }
      this.errorMsg = "";
      this.$emit(
        "update",
        Boolean(this.formData.bank && this.formData.account)
      );
    },
    addOrderCard() {
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Transfer/Account`,
        params: {
          bank: this.formData.bank,
          account: this.formData.account
        }
      })
        .then(res => {
          const { status, errorCode, msg } = res;
          if (errorCode !== "00" || status !== "000") {
            this.errorMsg = msg;
            return;
          }
          this.setPageStatus("orderCardInfo", true);
        })
        .catch(err => {
          const { msg } = err.response.data;
          this.errorMsg = msg;
        });
    },
    handleClickService() {
      localStorage.setItem("bankCardType", "orderCard");
      this.$router.push("/mobile/service?redirect=bankCard");
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.add-bankcard {
  background: #fff;
}
.error-msg {
  height: 35px;
  line-height: 35px;
  margin-bottom: 0;
  font-size: 14px;
  color: #db6372;
  padding: 0 14px;

  &.is-hide {
    opacity: 0;
  }
}

.card-info {
  padding: 0 14px;
  background: #fff;
}
.info-item {
  position: relative;
  padding-top: 15px;
  height: 80px;
  border-bottom: 1px solid #eee;
}

.input-title {
  margin-bottom: 10px;
  line-height: 16px;
  font-size: 14px;
  // color: var(--slider_text_active_color);
  color: #414655;
}

.input-wrap {
  padding-bottom: 15px;
  position: relative;

  input {
    width: 100%;
    height: 21px;
    line-height: 21px;
    font-size: 16px;
    color: #414655;
    background: transparent;
    border: none;
    outline: 0;
    padding: 0;

    &::-webkit-input-placeholder {
      font-size: 14px;
      color: var(--mcenter_slider_text_color);
    }

    &::-moz-placeholder {
      font-size: 14px;
      color: var(--mcenter_slider_text_color);
    }

    &:-ms-input-placeholder {
      font-size: 14px;
      color: var(--mcenter_slider_text_color);
    }

    &::placeholder {
      font-size: 14px;
      color: var(--mcenter_slider_text_color);
    }
  }

  .clear-input {
    position: absolute;
    right: 14px;
    height: 100%;
    width: 12px;
    top: 0;

    > img {
      height: 12px;
      width: 12px;
    }
  }
}

.info-confirm {
  display: flex;
  flex-direction: column;
  color: var(--mcenter_slider_text_color);

  .confirm-remind {
    margin-top: 20px;
  }
  p {
    font-size: 12px;
  }
}

// 聯繫客服
.service-remind {
  padding: 50px 0;
  text-align: center;
  font-size: 14px;
  color: var(--mcenter_slider_text_color);
}

.service-btn {
  margin-left: 5px;
  color: #6aaaf5;
}
</style>
