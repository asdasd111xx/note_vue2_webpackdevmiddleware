<template>
  <div :class="[$style['deposit-info-wrap'], 'clearfix']">
    <!-- 訂單時間 -->
    <div v-if="isShowTimer" :class="$style['time-tip']">
      <template v-if="countdownSec > 0">
        收款帐户不定期更换，请於
        <span>{{ timeToDate() }}</span>
        内完成转帐款
      </template>

      <template v-else> 已经超过有效时间，请重新申请 </template>
    </div>
    <!-- 收款帳號 -->
    <div
      :class="[$style['info-wrap'], $style['info-wrap-account'], 'clearfix']"
    >
      <!-- 只有非 crypto 的存款單才顯示 -->
      <div v-if="!orderData.is_crypto" :class="$style['deposit-info-title']">
        {{ $text("S_WITHDRAW_ACCOUNT", "收款帐号") }}
      </div>

      <div :class="$style['deposit-submit-info']">
        <template v-for="(info, index) in receiptInfo">
          <div
            :key="`receipt-info-${index}`"
            :class="[
              $style['submit-info-wrap'],
              { [$style['is-memo']]: info.objKey === 'memo' },
              { [$style['is-even']]: index % 2 !== 0 }
            ]"
          >
            <!-- Title -->
            <div
              :class="[$style['basic-info-text'], $style['basic-info-title']]"
            >
              {{ info.title }}
            </div>

            <!-- Qrcode -->
            <div
              v-if="info.qrcode && info.qrcode.length > 0"
              :class="[$style['basic-info-text'], $style['qrcode-wrap']]"
            >
              <template v-for="(qrcodeInfo, infoIndex) in info.qrcode">
                <div
                  v-if="qrcodeInfo.value"
                  :key="`qrcode-item-${infoIndex}`"
                  :class="$style['qrcode-item']"
                >
                  <div :class="$style['qrcode-title']">
                    {{ qrcodeInfo.title }}
                  </div>
                  <img
                    :src="qrcodeInfo.value"
                    :class="$style['qrcode-img']"
                    @click="
                      switchQrcodePopup(
                        true,
                        qrcodeInfo.value,
                        qrcodeInfo.title
                      )
                    "
                  />
                </div>
              </template>
            </div>

            <!-- 以 v-html 呈現 -->
            <div
              v-else-if="info.htmlShow"
              :class="[
                $style['basic-info-text'],
                $style[`info-${info.objKey}`]
              ]"
              v-html="info.value"
            />

            <!-- 以正常 value 呈現 -->
            <div
              v-else
              :class="[
                $style['basic-info-text'],
                {
                  [$style['highlight']]: info.isHighlightValue
                }
              ]"
            >
              {{ info.value }}
            </div>

            <!-- icon -->
            <div
              v-if="info.copyShow"
              :class="$style['icon-wrap']"
              @click="handleCopy(info.value)"
            >
              <img :src="`/static/image/${themeTPL}/mcenter/ic_copy.png`" />
            </div>
          </div>
          <div
            :key="`border-line-${index}`"
            :class="{ [$style['info-border']]: info.isBorderBottom }"
          />
        </template>
      </div>
    </div>

    <!-- 存款信息 -->
    <div :class="[$style['info-wrap'], 'clearfix']">
      <div v-if="!orderData.is_crypto" :class="$style['deposit-info-title']">
        {{ $text("S_APPLICATION_INFORMATION", "您的申请资料") }}
      </div>
      <div
        :class="[$style['deposit-submit-info'], $style['application-table']]"
      >
        <div
          v-for="(info, index) in yourDepositData"
          :key="`your-deposit-${index}`"
          :class="$style['submit-info-wrap']"
        >
          <div :class="[$style['basic-info-text'], $style['basic-info-title']]">
            {{ info.title }}
          </div>
          <div
            :class="[
              $style['basic-info-text'],
              { [$style['info-important']]: info.isBorderBottom }
            ]"
          >
            {{ info.value }}
          </div>
        </div>
      </div>
      <speed-pay-field
        v-if="orderData.methodType === 'remit'"
        :speed-field.sync="resultSpeedField"
        :required-fields="requiredFields"
        :is-edit="true"
        :method-id="orderData.method_id"
        :type-id="orderData.type_id"
      />
    </div>

    <!-- Only 加密貨幣 顯示注意事項 -->
    <div v-if="orderData.is_crypto" :class="$style['remider-block']">
      注意事項
      <div v-html="orderData.reminder.replace(/\n/gi, '<br/>')" />
    </div>

    <!-- 提交按鈕 -->
    <div
      :class="[
        $style['submit-btn'],
        {
          [$style['disabled']]:
            isSubmitDisabled || (countdownSec < 1 && isShowTimer)
        }
      ]"
      :title="
        orderData.methodType !== 'remit'
          ? $text('S_FINISH_DEPOSIT', '完成支付')
          : $text('S_SUBMIT_DEPOSIT', '提交資料')
      "
      @click="submitData"
    >
      {{
        orderData.methodType !== "remit"
          ? $text("S_FINISH_DEPOSIT", "完成支付")
          : $text("S_SUBMIT_DEPOSIT", "提交資料")
      }}
    </div>
    <p :class="$style['service-remind']">
      如需帮助，请<span
        :class="$style['service-btn']"
        @click="$router.push('/mobile/service')"
        >联系客服</span
      >
    </p>
    <deposit-alert v-if="isAlertTip" :close-fuc="goBack" />
    <deposit-popup
      v-if="isShowQrcode"
      :value="qrcodeValue"
      :title="qrcodeTitle"
      @close="switchQrcodePopup"
    />
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        <div
          style="background-color: transparent; margin: 0; padding: 0"
          v-html="msg"
        />
      </div>
    </message>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import mixin from "@/mixins/mcenter/deposit/depositInfo";
import message from "@/router/mobile/components/common/message";

export default {
  components: {
    message,
    depositAlert: () =>
      import(/* webpackChunkName: 'depositAlert' */ "./depositAlert"),
    speedPayField: () =>
      import(
        /* webpackChunkName: 'speedPayField' */ "../../common/speedPayField"
      ),
    depositPopup: () =>
      import(/* webpackChunkName: 'depositPopup' */ "./depositPopup")
  },
  mixins: [mixin],
  props: {
    orderData: {
      type: Object,
      default: () => {}
    },
    isShow: {
      type: Boolean,
      default: false
    },
    submitStatus: {
      type: String,
      default: ""
    },
    limitTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      moreShow: false,
      isAlertTip: false,
      isShowQrcode: false,
      qrcodeValue: "",
      qrcodeTitle: "",
      msg: "",
      // 計時器 params
      countdownSec: this.limitTime,
      // countdownSec: 70, // 測試用
      timer: null,
      isShowTimer: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    resultSpeedField: {
      get() {
        return this.speedField;
      },
      set(value) {
        this.speedField[value.objKey] = value.data;
      }
    }
  },
  created() {
    if (this.countdownSec) {
      this.isShowTimer = true;
      this.timer = setInterval(() => {
        if (this.countdownSec === 0) {
          clearInterval(this.timer);
          this.timer = null;
          return;
        }
        this.countdownSec -= 1;
      }, 1000);
    }
  },
  methods: {
    handleCopy(val) {
      this.msg = "已复制到剪贴板";
      this.copyInfo(val);
    },
    /**
     * 回填寫存款資料頁
     * @method goBack
     */
    goBack() {
      this.isAlertTip = false;
      this.$emit("update:submitStatus", "stepOne");
      window.scrollTo(0, 0);
    },
    submitData() {
      if (this.isSubmitDisabled) {
        return;
      }

      this.$emit("update:isShow", true);

      this.confirmDeposit().then(response => {
        if (response.status === "ok") {
          this.isAlertTip = true;
        }

        this.$emit("update:isShow", false);
      });
    },
    switchQrcodePopup(enable, value, text) {
      console.log(enable, value, text);
      this.qrcodeValue = value;
      this.isShowQrcode = enable;
      this.qrcodeTitle = text;
    },
    timeToDate() {
      let hours = Math.floor(this.countdownSec / 3600);
      let minutes = Math.floor((this.countdownSec - hours * 3600) / 60);
      let sec = this.countdownSec - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }

      switch (true) {
        case this.countdownSec >= 3600:
          return `${hours}時${minutes}分${sec}秒`;
          break;

        case this.countdownSec >= 60:
          return `${minutes}分${sec}秒`;
          break;

        default:
          return `${sec}秒`;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style
  lang="scss"
  src="../css/depositInfo/porn1.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="../css/depositInfo/ey1.scss"
  module="$style_ey1"
></style>
