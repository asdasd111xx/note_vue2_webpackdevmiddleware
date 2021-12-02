<template>
  <div
    v-show="fieldsData.length"
    :class="['normal-page', $style['join-wrap'], 'clearfix']"
  >
    <slot name="top-content" />
    <div :class="$style.join">
      <slot name="join-header">
        <div :class="$style['join-banner']">
          <div :class="$style['join-banner-icon']" />
          {{ $t("S_JOIN_MEMBER") }}
        </div>
      </slot>
      <div :class="$style['join-content']">
        <!-- 訪客文案 -->
        <div v-if="themeTPL != 'ey1'" style="margin-top: 40px;">
          <div :class="$style['visitor-get']">{{ "访客加入会员" }}</div>
          <div :class="$style['visitor-get']">
            {{ `领取彩金：${formatThousandsCurrency(guestAmount)}元` }}
          </div>
        </div>
        <!-- 錯誤訊息 -->
        <div :class="$style['err-msg']">
          <div v-show="errMsg">
            {{ errMsg }}
          </div>
        </div>

        <!-- mail驗證彈窗 -->
        <div
          v-if="mailVerifyModalShow"
          :class="$style['modal-dark-bg']"
          @click.self="mailVerifyModalShow = false"
        >
          <div :class="$style['verify-modal-wrap']">
            <h1>电子邮箱</h1>
            <div :class="$style['mail-wrap']">
              <input
                disabled
                v-model="allValue.email"
                :class="$style['mail']"
              />
              <button
                :class="[
                  $style['get-verify'],
                  { [$style.submit]: mailVerifybtnSubmit == true }
                ]"
                @click="getMailVerifyCode"
              >
                {{ mailVerifybtnSubmit ? ttlCount + "s" : "获取验证码" }}
              </button>
              <input
                v-model="mailVerifyCode"
                :class="$style['verifycode-input']"
                placeholder="请輸入验证码"
              />
            </div>
            <p
              v-if="mailSubmitSuccess && mailSubmitFail == false"
              style="color:#5E626D"
            >
              验证码已发送，有效时间为
              <span style="color: red">10</span>
              分钟，若没收到信件请尝试至垃圾箱寻找
            </p>
            <!-- <p
              v-if="phoneSubmitFail"
              style="color: red;margin-right: auto;padding: 0 10px;"
            >
              {{ phoneSubmitFailMsg }}
            </p> -->
            <button @click="submitMailVerify">确认送出</button>
          </div>
        </div>

        <!-- mail驗證錯誤訊息 -->
        <div
          v-if="mailSubmitFail"
          :class="$style['modal-dark-bg']"
          @click.self="mailSubmitFail = false"
        >
          <div :class="$style['verify-error-msg']">
            {{ mailSubmitFailMsg }}
            <button @click="mailSubmitFail = false">关闭</button>
          </div>
        </div>
        <!-- 手機驗證彈窗 -->
        <div
          v-if="phoneVerifyModalShow"
          :class="$style['modal-dark-bg']"
          @click.self="phoneVerifyModalShow = false"
        >
          <div :class="$style['verify-modal-wrap']">
            <h1>手机号码</h1>
            <div :class="$style['phonenum-wrap']">
              <input
                disabled
                v-model="countryCode"
                :class="$style['phone-number-countrycode']"
              />
              <input
                disabled
                v-model="allValue.phone"
                :class="$style['phone-number']"
              />
              <button
                :class="[
                  $style['get-verify'],
                  { [$style.submit]: phoneVerifybtnSubmit == true }
                ]"
                @click="getPhoneVerifyCode"
              >
                {{ phoneVerifybtnSubmit ? ttlCount + "s" : "获取验证码" }}
              </button>
              <input
                v-model="phoneVerifyCode"
                :class="$style['verifycode-input']"
                placeholder="请輸入验证码"
              />
            </div>
            <p
              v-if="phoneSubmitSuccess && phoneSubmitFail == false"
              style="color:#5E626D"
            >
              验证码已发送，有效时间为
              <span style="color: red">10</span>
              分钟，若没收到信件请尝试至垃圾箱寻找
            </p>
            <!-- <p
              v-if="phoneSubmitFail"
              style="color: red;margin-right: auto;padding: 0 10px;"
            >
              {{ phoneSubmitFailMsg }}
            </p> -->
            <button @click="submitPhoneVerify">确认送出</button>
          </div>
        </div>

        <!-- 手機驗證錯誤訊息 -->
        <div
          v-if="phoneSubmitFail"
          :class="$style['modal-dark-bg']"
          @click.self="phoneSubmitFail = false"
        >
          <div :class="$style['verify-error-msg']">
            {{ phoneSubmitFailMsg }}
            <button @click="phoneSubmitFail = false">关闭</button>
          </div>
        </div>
        <form>
          <div
            v-for="field in fieldsData"
            :key="field.key"
            :class="[$style['field-wrap'], 'clearfix']"
          >
            <label
              :for="field.key"
              :title="$t(joinMemInfo[field.key].text)"
              :class="[
                $style['field-title'],
                $style[siteConfig.ROUTER_TPL],
                $style[`field-${field.key}`],
                {
                  [$style['show-red-star']]: joinMemInfo[field.key].isRequired
                },
                'clearfix'
              ]"
              @click="
                () => {
                  onLabelClick(field.key);
                }
              "
            >
              <span :class="$style['field-text']">
                {{ $t(joinMemInfo[field.key].text) }}</span
              >
            </label>
            <div
              :class="[
                $style['field-right'],
                $style[siteConfig.ROUTER_TPL],
                {
                  [$style['withdraw-password']]:
                    field.key === 'withdraw_password'
                },
                {
                  [$style['phone']]: field.key === 'phone'
                },
                'clearfix'
              ]"
            >
              <div
                v-if="field.key === 'captcha_text'"
                :class="$style['captchaText-wrap']"
              >
                <input
                  v-model="allValue[field.key]"
                  :class="[$style['join-input-captcha'], field.key]"
                  type="text"
                  :ref="'captcha'"
                  id="captcha"
                  name="join-captcha"
                  maxlength="4"
                  placeholder="请填写验证码"
                  @input="verification(field.key)"
                  @keydown.13="keyDownSubmit()"
                />
                <img
                  v-if="captchaImg"
                  :src="captchaImg"
                  :class="$style['captcha-img']"
                />
                <div :class="$style['captchaText-refresh']" @click="getCaptcha">
                  <img
                    :src="'/static/image/common/ic_verification_reform.png'"
                  />
                </div>
              </div>

              <template v-else-if="field.key === 'password'">
                <input
                  id="pwd"
                  v-model="allValue[field.key]"
                  :class="[$style['join-input'], field.key]"
                  :name="field.key"
                  :placeholder="field.content.note1"
                  type="password"
                  maxlength="12"
                  @input="verification(field.key)"
                  @keydown.13="keyDownSubmit()"
                  autocomplete="password"
                />
                <div :class="$style['eye']">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/common/login/btn_eye_${
                          isShowPwd ? 'n' : 'd'
                        }.png`
                      )
                    "
                    @click="toggleEye('confPwd')"
                  />
                </div>
              </template>

              <template v-else-if="field.key === 'confirm_password'">
                <input
                  id="confirm_password"
                  v-model="allValue[field.key]"
                  :class="[$style['join-input'], field.key]"
                  :name="field.key"
                  :placeholder="field.content.note1"
                  type="password"
                  maxlength="12"
                  @input="verification(field.key)"
                  @keydown.13="keyDownSubmit()"
                  autocomplete="password"
                />
                <div :class="$style['eye']">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/common/login/btn_eye_${
                          isShowPwd ? 'n' : 'd'
                        }.png`
                      )
                    "
                    @click="toggleEye('confPwd')"
                  />
                </div>
              </template>

              <template v-else-if="field.key === 'username'">
                <input
                  :ref="field.key"
                  v-model="allValue[field.key]"
                  :class="[$style['join-input'], field.key]"
                  :name="field.key"
                  :placeholder="field.content.note1"
                  type="text"
                  maxlength="20"
                  @keydown.13="keyDownSubmit()"
                  @input="verification(field.key)"
                />
                <div :class="$style['clear']" v-if="field.key === 'username'">
                  <img
                    :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
                    @click="allValue[field.key] = ''"
                  />
                </div>
              </template>

              <template v-else-if="field.key === 'gender'">
                <v-select
                  v-model="selectData['gender'].selected"
                  :options="selectData['gender'].options"
                  :searchable="false"
                  :class="[
                    $style['join-input-gender'],
                    $style[siteConfig.ROUTER_TPL]
                  ]"
                  @input="changSelect(field.key)"
                />
              </template>
              <template v-else-if="field.key === 'email'">
                <input
                  v-model="allValue[field.key]"
                  :class="[$style['join-input'], $style[field.key]]"
                  :name="field.key"
                  :placeholder="placeholderKeyValue('email', 'tip')"
                  type="tel"
                  @input="verification(field.key)"
                  @keydown.13="joinSubmit()"
                />
                <img
                  v-if="showMailCheckIcon"
                  style="position: absolute ; top: 12px; right: 10px"
                  :src="
                    $getCdnPath(
                      `/static/image/common/ic_verification_success.png`
                    )
                  "
                  alt=""
                />
                <div
                  v-if="mailNeedCode"
                  :class="[
                    $style['get-verify-btn'],
                    { [$style.active]: mailVerifybtnActive == true }
                  ]"
                  @click="openMailVerifyModal"
                >
                  {{ $text("S_GET_VERIFICATION_CODE", "获取验证码") }}
                </div>
              </template>
              <template v-else-if="field.key === 'phone'">
                <v-select
                  v-model="selectData[field.key].selected"
                  :options="selectData[field.key].options"
                  :searchable="false"
                  :class="$style['join-select-phone']"
                  @input="changSelect(field.key)"
                />
                <input
                  v-model="allValue[field.key]"
                  :class="[$style['join-input'], $style[field.key]]"
                  :name="field.key"
                  :placeholder="placeholderKeyValue('phone', 'tip')"
                  type="tel"
                  @input="verification(field.key)"
                  @keydown.13="joinSubmit()"
                />
                <img
                  v-if="showPhoneCheckIcon"
                  style="position: absolute ; top: 12px; right: 15px"
                  :src="
                    $getCdnPath(
                      `/static/image/common/ic_verification_success.png`
                    )
                  "
                  alt=""
                />
                <div
                  v-if="NeedCode"
                  :class="[
                    $style['get-verify-btn'],
                    { [$style.active]: phoneVerifybtnActive == true }
                  ]"
                  @click="openPhoneVerifyModal"
                >
                  {{ $text("S_GET_VERIFICATION_CODE", "获取验证码") }}
                </div>
              </template>

              <template v-else-if="field.key === 'birthday'">
                <datepicker
                  v-if="field.key === 'birthday'"
                  v-model="allValue[field.key]"
                  :language="dateLang"
                  :disabled="{ from: ageLimit }"
                  :open-date="ageLimit"
                  :clear-button="true"
                  :monday-first="true"
                  :placeholder="placeholderKeyValue('birthday', 'tip')"
                  :class="[
                    $style['join-input-birthday'],
                    $style[siteConfig.ROUTER_TPL]
                  ]"
                  name="birthday"
                  format="yyyy/MM/dd"
                  initial-view="year"
                  @cleared="verification(field.key)"
                  @input="verification(field.key)"
                />
              </template>

              <template
                v-else-if="field.key === 'withdraw_password'"
                :class="$style['join-select-withdraw-wrap']"
              >
                <v-select
                  v-for="(item, index) in allValue.withdraw_password.value"
                  :key="`widthdrawPwd-${index}`"
                  v-model="selectData['withdraw_password'].selected[index]"
                  :options="selectData['withdraw_password'].options"
                  :clearable="false"
                  :searchable="false"
                  :class="$style['join-select-withdraw']"
                  @input="changSelect('withdraw_password', index)"
                ></v-select>
                <!-- <input
                  v-for="(item, index) in allValue['withdraw_password'].value"
                  v-model="allValue['withdraw_password'].value[index]"
                  :key="`widthdrawPwd-${index}`"
                  @input="verification('withdraw_password', index)"
                  @blur="verification('withdraw_password', index)"
                  :data-key="`withdraw_password_${index}`"
                  :class="$style['withdraw-pwd-input']"
                  :maxlength="1"
                  :minlength="1"
                  :placeholder="allValue['withdraw_password'].placeholder"
                  type="tel"
                /> -->
              </template>
              <input
                v-else
                :ref="field.key"
                v-model="allValue[field.key]"
                :class="[$style['join-input'], field.key]"
                :name="field.key"
                :placeholder="placeholderKeyValue(field.key, 'tip')"
                type="text"
                @blur="verification(field.key)"
                @keydown.13="keyDownSubmit()"
              />
              <div
                :class="$style['clear']"
                v-if="
                  !noCancelButton.includes(field.key) &&
                    allValue[field.key].length > 1
                "
              >
                <img
                  :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
                  @click="allValue[field.key] = ''"
                />
              </div>
            </div>
            <!-- </div> -->
            <div
              :class="
                placeholderKeyValue(field.key, 'help')
                  ? $style['join-help-show']
                  : $style['join-help']
              "
              v-html="placeholderKeyValue(field.key, 'help')"
            />
            <!-- eslint-disable vue/no-v-html -->
            <div
              :class="
                allTip[field.key] ? $style['join-tip-show'] : $style['join-tip']
              "
              v-html="allTip[field.key]"
            />
          </div>
        </form>

        <!-- 3拼圖驗證/4手繪/5行為驗證 -->
        <template
          v-if="[3, 4, 5].includes(memInfo.config.register_captcha_type)"
        >
          <thirdy-verification
            ref="thirdyCaptchaObj"
            @set-captcha="setCaptcha"
            :class="$style['thirdy-block']"
            :page-type="'register'"
          />

          <div
            :class="
              allTip['captcha_text']
                ? $style['join-tip-show']
                : $style['join-tip']
            "
            v-html="allTip['captcha_text']"
          />
        </template>
      </div>

      <!-- :is-enable="isSlideAble" -->
      <slide-verification
        v-if="memInfo.config.register_captcha_type === 2"
        :class="$style['join-btn-wrap']"
        :style="isSlideAble ? {} : { 'pointer-events': 'none' }"
        :success-fuc="joinSubmit"
        page-status="register"
      />

      <div v-else :class="[$style['join-btn-wrap']]">
        <div
          :class="[
            $style['join-btn'],
            { [$style.disabled]: isLoading },
            $style[this.siteConfig.ROUTER_TPL]
          ]"
          @click="joinSubmit()"
        >
          {{ $text("S_REGISTER", "注册") }}
        </div>
      </div>

      <div
        v-if="themeTPL != 'ey1'"
        :class="$style['has-visitor']"
        @click.stop="$router.push('/mobile/login')"
      >
        已有会员帐号
      </div>
      <div :class="$style['version']">
        {{ version }}
      </div>
      <slot name="bottom-content" />
    </div>
    <page-loading :is-show="isLoading" />
    <div v-if="showRedirectJump">
      <div :class="$style['mask']" />

      <div :class="$style['modal-wrap']">
        <div :class="$style['modal-content']">
          {{
            `尊敬的会员您好，${siteConfig.SITE_NAME}为进行线路与安全分流，将为您导至${siteConfig.SITE_NAME}子网址，并请您以后利用此网址登入，如有疑虑，欢迎洽询线上客服!`
          }}
        </div>

        <div
          :class="[
            $style['modal-button-center'],
            $style[siteConfig.MOBILE_WEB_TPL]
          ]"
          @click="closeRedirect_url()"
        >
          确定
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie, setCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import ajax from "@/lib/ajax";
import axios from "axios";
import appEvent from "@/lib/appEvent";
import capitalize from "lodash/capitalize";
import datepicker from "vuejs-datepicker";
import datepickerLang from "@/lib/datepicker_lang";
import joinMemInfo from "@/config/joinMemInfo";
import member from "@/api/member";
import thirdyVerification from "@/components/thirdyVerification";
import slideVerification from "@/components/slideVerification";
import vSelect from "vue-select";
import Vue from "vue";
import goLangApiRequest from "@/api/goLangApiRequest";
import { thousandsCurrency } from "@/lib/thousandsCurrency";

export default {
  components: {
    slideVerification,
    thirdyVerification,
    vSelect,
    datepicker,
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      )
  },
  props: {
    theme: {
      type: Object,
      default: null
    },
    hasAgreement: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dateLang: datepickerLang(this.$i18n.locale),
      ageLimit: new Date(Vue.moment(new Date()).add(-18, "year")),
      isShowPwd: false,

      phoneVerifybtnActive: false,
      phoneVerifybtnSubmit: false,
      NeedCode: true,
      phoneSubmitSuccess: false,
      phoneSubmitFail: false,
      phoneSubmitFailMsg: "",
      phoneVerifyCode: "",
      showMailCheckIcon: false,
      showPhoneCheckIcon: false,
      mailVerifybtnActive: false,
      mailVerifybtnSubmit: false,
      mailNeedCode: true,
      mailSubmitSuccess: false,
      mailSubmitFail: false,
      mailSubmitFailMsg: "",
      mailVerifyCode: "",
      errMsg: "",
      joinMemInfo,
      captchaImg: "",
      aid: "",
      guestAmount: 0,
      allValue: {
        username: "",
        password: "",
        confirm_password: "",
        introducer: this.$cookie.get("a") || "",
        name: "",
        email: "",
        phone: "",
        alias: "",
        birthday: "",
        gender: 0,
        qq_num: "",
        weixin: "",
        line: "",
        facebook: "",
        skype: "",
        telegram: "",
        kakaotalk: "",
        zalo: "",
        withdraw_password: {
          value: ["", "", "", ""],
          placeholder: "--"
        },
        captcha_text: ""
      },
      allTip: {
        username: "",
        password: "",
        confirm_password: "",
        introducer: "",
        name: "",
        email: "",
        phone: "",
        alias: "",
        birthday: "",
        gender: "",
        qq_num: "",
        telegram: "",
        kakaotalk: "",
        weixin: "",
        line: "",
        facebook: "",
        skype: "",
        zalo: "",
        withdraw_password: "",
        captcha_text: ""
      },
      noCancelButton: [
        "password",
        "confirm_password",
        "email",
        "phone",
        "birthday",
        "gender",
        "withdraw_password"
      ],
      checkFail: false,
      registerData: [],
      withdraw_passwordStatus: false,
      joinAgree: false,
      accountTextStatus: false,
      isVerifying: false,
      isVerified: {
        email: false,
        phone: false
      },
      currentVerify: "",
      oldValue: {
        email: "",
        phone: ""
      },
      countryCode: "",
      phoneVerifyModalShow: false,
      mailVerifyModalShow: false,
      ttlCount: 10,
      timer: null,
      verifyTips: "",
      lock: false,
      thirdyCaptchaObj: null,
      registerData: [],
      selectData: {
        phone: {
          options: [],
          selected: { label: "", value: "" }
        },
        gender: {
          options: [
            {
              label: this.$i18n.t("S_SELECTED"),
              value: ""
            },
            { label: this.$i18n.t("S_MALE"), value: "1" },
            { label: this.$i18n.t("S_FEMALE"), value: "2" }
          ],
          selected: { label: this.$i18n.t("S_SELECTED"), value: "" }
        },
        withdraw_password: {
          options: [
            { label: "-", value: "" },
            { label: "0", value: "0" },
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "6", value: "6" },
            { label: "7", value: "7" },
            { label: "8", value: "8" },
            { label: "9", value: "9" }
          ],
          selected: [
            { label: "-", value: "" },
            { label: "-", value: "" },
            { label: "-", value: "" },
            { label: "-", value: "" }
          ]
        }
      },
      isGetCaptcha: false,
      isLoading: false,
      showRedirectJump: false,
      redirect_url: "",
      placeholderResult: []
    };
  },
  computed: {
    ...mapGetters({
      isWebview: "getIsWebview",
      webInfo: "getWebInfo",
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      version: "getVersion"
    }),
    fieldsData() {
      return this.registerData.filter(
        field => this.joinMemInfo[field.key] && this.joinMemInfo[field.key].show
      );
    },
    requireTrueData() {
      return this.registerData.filter(
        field =>
          this.joinMemInfo[field.key] && this.joinMemInfo[field.key].required
      );
    },
    $style() {
      if (this.theme) {
        return this.theme;
      }

      if (this.siteConfig.JOIN_MEMBER_THEME) {
        return this[`$style${capitalize(this.siteConfig.JOIN_MEMBER_THEME)}`];
      }

      return this.$styleDefault;
    },
    isSlideAble() {
      return this.registerData
        .filter(field => this.joinMemInfo[field.key].show)
        .every(field => {
          if (this.joinMemInfo[field.key].isRequired) {
            if (this.allTip[field.key]) {
              return false;
            }

            if (
              field.key === "confirm_password" &&
              this.allValue.password !== this.allValue.confirm_password
            ) {
              return false;
            }

            if (
              this.joinMemInfo[field.key].type !== "select" &&
              field.key !== "birthday"
            ) {
              return (
                this.allValue[field.key].replace(/(^\s*)|(\s*$)/g, "") !== ""
              );
            }

            if (field.key === "gender") {
              return +this.allValue[field.key] !== 0;
            }

            if (field.key === "withdraw_password") {
              return this.allValue.withdraw_password.length === 4;
            }

            if (field.key === "phone") {
              return this.joinMemInfo[field.key].hasVerify && this.countryCode;
            }

            return this.allValue[field.key];
          }
          return true;
        });
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  created() {
    this.getCaptcha();
    let joinConfig = [];
    let joinReminder = {};
    const username = {
      key: "username",
      content: {
        note1: this.$text("S_ACCOUNT_PLACEHOLDER"),
        note2: ""
      }
    };
    const password = {
      key: "password",
      content: {
        note1: this.$text("S_PASSWORD_PLACEHOLDER"),
        note2: ""
      }
    };
    const confirmPassword = {
      key: "confirm_password",
      content: {
        note1: "请再次输入设置密码",
        note2: ""
      }
    };
    const captchaText = {
      key: "captcha_text",
      content: {
        note1: "请填写验证码",
        note2: ""
      }
    };

    member
      .joinConfig({
        success: ({ result, ret }) => {
          if (result !== "ok") {
            return;
          }
          //是否顯示mail驗證按鈕
          if (ret.email.code_register == true) {
            this.mailNeedCode = true;
          } else {
            this.mailNeedCode = false;
          }

          //是否顯示手機驗證按鈕
          if (ret.phone.code_register == true) {
            this.NeedCode = true;
          } else {
            this.NeedCode = false;
          }
          Object.keys(this.joinMemInfo).forEach(key => {
            if (
              key === "captcha_text" &&
              this.memInfo.config.register_captcha_type !== 1
            ) {
              this.joinMemInfo[key].show = false;
              return;
            }

            if (!ret[key]) {
              return;
            }

            if (key === "introducer" && this.$cookie.get("a")) {
              this.joinMemInfo[key] = {
                ...this.joinMemInfo[key],
                isRequired: true,
                show: false,
                hasVerify: ret[key].code_register
              };
              return;
            }

            if (key === "gender") {
              let tip = this.placeholderKeyValue("gender", "tip");
              if (tip) {
                this.selectData.gender.options[0].label = tip;
                this.selectData.gender.selected.label = tip;
              }
            }

            if (key === "phone") {
              this.selectData.phone.options = [
                ...this.selectData.phone.options,
                ...ret[key].country_codes.map(label => ({
                  label,
                  value: label
                }))
              ];

              [this.selectData.phone.selected] = this.selectData.phone.options;
            }

            this.joinMemInfo[key] = {
              ...this.joinMemInfo[key],
              isRequired: ret[key].required,
              show: !ret[key].none,
              hasVerify: ret[key].code_register
            };
            joinConfig = [
              ...joinConfig,
              { key, content: { note1: "", note2: "" } }
            ];
          });
        }
      })
      .then(() => {
        const preview = this.$route.name === "preview" ? "View" : "";
        const status = this.$cookie.get("newsite") ? "New" : "";

        ajax({
          method: "get",
          url: `/tpl/${this.memInfo.user.domain}/playerRegister${preview}${status}.json`,
          params: {
            v: Date.parse(new Date())
          },
          success: response => {
            response.data.forEach(item => {
              Object.keys(item).forEach(key => {
                const content = JSON.parse(item[key][this.$i18n.locale]);

                joinReminder = {
                  ...joinReminder,
                  [key]: {
                    note1: content.note1 || "",
                    note2: content.note2 || ""
                  }
                };

                if (key === "gender" && joinReminder[key].note1) {
                  this.selectData.gender.options[0].label =
                    joinReminder[key].note1;
                  this.selectData.gender.selected.label =
                    joinReminder[key].note1;
                }
              });
            });

            joinConfig.map(item => {
              const info = item;
              info.content = {
                ...item.content,
                ...joinReminder[item.key]
              };

              return info;
            });
          }
        }).then(() => {
          this.registerData = [
            username,
            password,
            confirmPassword,
            ...joinConfig,
            captchaText
          ];
        });
      });

    if (!this.loginStatus) {
      this.getGuestBalance();
    }
    this.getPlaceholderList();
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionVerificationFormData",
      "actionGetToManyRequestMsg"
    ]),
    keyDownSubmit() {
      if (this.memInfo.config.register_captcha_type === 2) {
        return;
      }
      this.joinSubmit();
    },
    toggleEye() {
      if (this.isShowPwd) {
        document.getElementById("pwd").type = "password";
        document.getElementById("confirm_password").type = "password";
      } else {
        document.getElementById("pwd").type = "text";
        document.getElementById("confirm_password").type = "text";
      }

      this.isShowPwd = !this.isShowPwd;
    },
    getCaptcha() {
      if (
        this.isGetCaptcha ||
        this.memInfo.config.register_captcha_type !== 1
      ) {
        return;
      }

      this.isGetCaptcha = true;

      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Captcha`
      }).then(res => {
        if (res.data && res.status === "000") {
          setTimeout(() => {
            this.isGetCaptcha = false;
          }, 800);

          localStorage.setItem("aid", res.data.cookie.aid);
          setCookie("aid", res.data.cookie.aid);
          this.captchaImg = res.data.data;
        }
      });
    },
    changWithdrawPassword(key, num) {
      this.allValue[key] = "";
      Object.keys(this.selectData.withdraw_password).forEach(index => {
        if (this.selectData.withdraw_password[index].selected) {
          this.allValue[key] += this.selectData.withdraw_password[
            index
          ].selected.value;
        }
      });

      if (!this.withdraw_passwordStatus) {
        if (num === 4) {
          this.withdraw_passwordStatus = true;
        }
        return;
      }

      // 驗證輸入值
      this.verification(key);
    },
    verification(key, index) {
      const data = this.joinMemInfo[key];

      if (!data.show) {
        return;
      }

      if (this.joinMemInfo[key].isRequired && this.allValue[key] === "") {
        //必填 欄位為空
        this.allTip[key] = this.$text("S_JM_FIELD_REQUIRE");
      } else {
        if (this.allValue[key] !== "") {
          //進入驗證
          switch (key) {
            case "password":
            case "username":
            case "phone":
            case "qq_num":
            case "telegram":
            case "kakaotalk":
            case "line":
            case "facebook":
            case "skype":
            case "zalo":
            case "confirm_password":
            case "name":
            case "email":
            case "weixin":
              this.allTip[key] = "";

              this.actionVerificationFormData({
                target: key,
                value: this.allValue[key]
              }).then(val => {
                this.allValue[key] = val;
                const regex = new RegExp(data.regExp);
                const msg = data.errorMsg;

                // 1. 密碼只判斷是否符合格式不判斷空
                // 2. 確認密碼只判斷是否相同
                switch (key) {
                  case "password":
                    // if (!val) {
                    //   this.allTip[key] = "";
                    //   return;
                    // }

                    this.allTip["confirm_password"] = "";
                    if (
                      this.allValue["password"] !==
                      this.allValue["confirm_password"]
                    ) {
                      this.allTip["confirm_password"] = this.$text(
                        "S_PASSWD_CONFIRM_ERROR"
                      );
                    }

                    if (!val.match(regex)) {
                      this.allTip[key] = msg;
                    }
                    break;

                  case "email":
                    if (val.match(regex)) {
                      this.mailVerifybtnActive = true;
                    } else {
                      this.mailVerifybtnActive = false;
                    }

                  case "confirm_password":
                    // if (!val) {
                    //   this.allTip[key] = "";
                    //   return;
                    // }

                    this.allTip["confirm_password"] = "";
                    if (
                      this.allValue["password"] !==
                      this.allValue["confirm_password"]
                    ) {
                      this.allTip["confirm_password"] = this.$text(
                        "S_PASSWD_CONFIRM_ERROR"
                      );
                    }
                    break;

                  default:
                    if (!val.match(regex)) {
                      this.allTip[key] = msg;
                    }
                    break;
                }
              });
              break;

            case "withdraw_password":
              break;
          }

          //  非必填欄位，空值不做驗證
          if (!data.isRequired && this.allValue[key] === "") {
            this.allTip[key] = "";
            return;
          }

          if (key == "withdraw_password") {
            if (index === "all") {
              if (this.allValue.withdraw_password.value.join("").length < 4) {
                this.allTip["withdraw_password"] = "请填写完整";

                return;
              }
            } else {
              if (index) {
                let target = this.allValue.withdraw_password;
                let correct_value = target.value[index]
                  .replace(" ", "")
                  .trim()
                  .replace(/[^\d+]$/g, "");

                if (
                  target.value[index] === correct_value &&
                  correct_value !== ""
                ) {
                  if (index < 3) {
                    document
                      .querySelector(
                        `v-select[data-key="withdraw_password_${index + 1}"]`
                      )
                      .focus();
                  }
                }

                target.value[index] = correct_value;

                if (target.value[index].length > 1) {
                  target.value[index] = target.value[index].substring(0, 1);
                }

                for (let i = 0; i < 4; i++) {
                  if (!this.allValue.withdraw_password.value[i]) {
                    this.checkFormData = false;
                    return;
                  }
                }
              }
            }
          }

          if (key === "password" || key === "username") {
            if (
              this.allValue.username !== "" &&
              this.allValue.password === this.allValue.username
            ) {
              this.allTip[key] = this.$text(
                "S_USERNAME_CONFIRM_ERROR",
                "密码不能与帐号相同"
              );
              return;
            }
          }

          if (key === "captcha_text") {
            // 圖形驗證格式
            this.allValue.captcha_text = this.allValue["captcha_text"].replace(
              /[\W\_]/g,
              ""
            );
          }

          if (key === "phone") {
            this.allValue[key] = `${this.countryCode.replace("+", "")}-${
              this.allValue[key]
            }`;
            if (this.allValue[key].length > 13) {
              this.phoneVerifybtnActive = true;
            } else {
              this.phoneVerifybtnActive = false;
            }
          }

          this.allTip[key] = "";
        }
        return;
      }
    },
    changSelect(key, index) {
      if (key === "phone") {
        if (!this.selectData[key].selected) {
          this.selectData[key].selected = {
            label: this.countryCode,
            value: this.countryCode
          };
          return;
        }

        this.countryCode = this.selectData[key].selected.value;
        return;
      }

      if (key === "withdraw_password") {
        if (
          this.selectData[key].selected[index].value &&
          !this.selectData[key].selected[index].value
        ) {
          this.allValue[key].value[index] = "";
          return;
        }
        this.allValue[key].value[index] = this.selectData[key].selected[index]
          ? this.selectData[key].selected[index].value
          : "";
      } else {
        if (
          this.selectData[key].selected &&
          !this.selectData[key].selected.value
        ) {
          this.allValue[key] = "0";
          return;
        }

        this.allValue[key] = this.selectData[key].selected
          ? this.selectData[key].selected.value
          : "0";
      }
      this.verification(key);
    },
    checkField() {
      if (this.allValue["password"] !== this.allValue["confirm_password"]) {
        this.allTip["confirm_password"] = this.$text("S_PASSWD_CONFIRM_ERROR");
      }

      if (
        !this.allValue["password"].match(
          new RegExp(joinMemInfo["password"].regExp)
        )
      ) {
        this.allTip["password"] = joinMemInfo["password"].errorMsg;
      }

      if (
        !this.allValue["username"].match(
          new RegExp(joinMemInfo["username"].regExp)
        )
      ) {
        this.allTip["username"] = joinMemInfo["username"].errorMsg;
      }

      let hasError = false;

      Object.keys(this.allTip).forEach(key => {
        if (this.allTip[key] !== "") {
          hasError = true;
        }
      });

      if (hasError) {
        this.isLoading = false;
        return false;
      }
      return true;
    },
    joinSubmit(captchaInfo) {
      this.isLoading = true;

      Object.keys(this.allValue).forEach(item => {
        this.allTip[item] = "";
        if (item === "withdraw_password") {
          if (
            this.joinMemInfo["withdraw_password"].isRequired &&
            this.allValue.withdraw_password.value.join("").length === 0
          ) {
            this.allTip[item] = this.$text("S_JM_FIELD_REQUIRE");
          } else if (
            this.allValue.withdraw_password.value.join("").length > 1
          ) {
            this.verification("withdraw_password", "all");
          }
        } else {
          this.verification(item);
        }
      });

      if (this.memInfo.config.register_captcha_type === 0) {
      }

      // 滑動
      else if (this.memInfo.config.register_captcha_type === 2) {
        this.allValue.captcha_text = captchaInfo.data;
      }

      // 拼圖
      else if ([3, 4, 5].includes(this.memInfo.config.register_captcha_type)) {
        if (!this.thirdyCaptchaObj) {
          this.allTip["captcha_text"] = this.$text("S_PLS_CLICK_CAPTCHA_FIRST");
          this.isLoading = false;
        } else {
          this.allTip["captcha_text"] = "";
        }

        this.allValue.captcha_text = this.thirdyCaptchaObj;
      }

      // 圖形
      else if (this.memInfo.config.register_captcha_type === 1) {
        if (!this.allValue.captcha_text) {
          this.allTip["captcha_text"] = this.$text("S_ENABLE_KEYRING");
          this.isLoading = false;
        } else {
          this.allTip["captcha_text"] = "";
        }
      }

      if (!this.checkField()) {
        return;
      }

      const params = {
        ...this.allValue,
        captchaText: this.allValue.captcha_text,
        confirmPassword: this.allValue.confirm_password,
        withdraw_password: this.allValue.withdraw_password.value.join(""),
        aid: this.aid || getCookie("aid") || localStorage.getItem("aid") || "",
        speedy: false, //檢查是否唯一
        code: localStorage.getItem("promotionCode") || ""
      };

      const self = this;
      const platform = getCookie("platform");

      goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Account/register`,
        headers: {
          Vendor: this.memInfo.user.domain
        },
        params: {
          ...params,
          host: window.location.host,
          deviceId: localStorage.getItem("uuidAccount"),
          lang: "zh-cn"
        }
      }).then(res => {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        if (this.$refs.thirdyCaptchaObj) this.$refs.thirdyCaptchaObj.ret = null;
        let cookieData;
        if (res.data) {
          cookieData = res.data.ret;
        }
        if (cookieData && res.data && cookieData.cookie) {
          if (
            cookieData.redirect &&
            cookieData.redirect_url &&
            getCookie("platform") === "h"
          ) {
            this.redirect_url = cookieData.redirect_url;
            this.showRedirectJump = true;
          } else {
            try {
              const { cookie } = res.data;
              for (const [key, value] of Object.entries(cookie)) {
                setCookie(key, value);
              }
            } catch (e) {
              setCookie("cid", cookieData.cookie.cid);
            }
            // GA流量統計
            window.dataLayer.push({
              dep: 2,
              event: "ga_click",
              eventCategory: "sign_up",
              eventAction: "sign_up",
              eventLabel: "sign_up",
              ga_hall_id: 3820325,
              ga_domain_id: this.memInfo.user.domain
            });
            if (this.isWebview) {
              appEvent.jsToAppMessage("PLAYER_REGIST_SUCCESS");
              return;
            }
            self.actionSetUserdata(true);
            this.actionSetGlobalMessage({
              msg: "注册成功",
              cb: () => {
                if (localStorage.getItem("rememberPwd")) {
                  localStorage.setItem("username", this.allValue.username);
                  localStorage.setItem("password", this.allValue.password);
                } else {
                  localStorage.removeItem("username");
                  localStorage.removeItem("password");
                }

                window.RESET_LOCAL_SETTING(true);
                window.RESET_MEM_SETTING();
              }
            });
            return;
          }
        }
        if (captchaInfo && captchaInfo.slideFuc) {
          captchaInfo.slideFuc.reset();
        }
        this.allValue.captcha_text = "";
        if (res.response && res.status === "506") {
          this.actionGetToManyRequestMsg(res.msg).then(res => {
            this.errMsg = res;
          });
          return;
        }

        if (res.status !== "000") {
          this.getCaptcha();
          if (res.errors && Object.keys(res.errors)) {
            Object.keys(res.errors).forEach(item => {
              this.allTip[item] = res.errors[item];
              // msg: "验证码错误"
              if (item === "captcha_text") {
                if (document.getElementById("captcha")) {
                  document.getElementById("captcha").focus();
                }
              }

              if (
                this.memInfo.config.register_captcha_type === 0 &&
                item === "captcha_text"
              ) {
                this.allTip["confirm_password"] = res.errors[item];
              }

              //msg: "无此介绍人"
              if (
                item === "introducer" &&
                localStorage.getItem("promotionCode")
              ) {
                this.errMsg = res.errors[item];
              }
            });
            return;
          }
          this.errMsg = res.msg;
        }
      });
    },

    // eslint-disable-next-line
    onLabelClick(fieldKey) {
      try {
        this.$refs[fieldKey][0].focus();
      } catch (error) {
        return error;
      }
    },

    // 取得訪客餘額
    getGuestBalance() {
      return goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Account/getAmount`,
        params: {
          account: localStorage.getItem("uuidAccount"),
          cid: localStorage.getItem("guestCid")
        }
      }).then(res => {
        if (res.status === "000") {
          this.guestAmount = res.data.totalAmount;
          this.getRedJackpot();
        }
      });
    },

    setCaptcha(obj) {
      this.thirdyCaptchaObj = obj;
      this.allTip["captcha_text"] = "";
    },

    getRedJackpot() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Event/Info`,
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res.errorCode === "00" && res.status === "000") {
          if (res.data.enable) {
            this.guestAmount = Number(
              parseFloat(this.guestAmount) +
                parseFloat(res.data.personal_max_bonus)
            ).toFixed(2);
          }
        }
      });
    },
    formatThousandsCurrency(value) {
      return thousandsCurrency(value);
    },

    closeRedirect_url() {
      if (this.redirect_url.includes("http")) {
        window.location.href = this.redirect_url;
      } else {
        window.location.href = `https://${this.redirect_url}`;
      }
    },
    getPlaceholderList() {
      //取得 [前台設置/網站建置平台] 的 [會員/代理] 註冊提示語 C02.329
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Platform/Placeholder`
      })
        .then(response => {
          if (response.status === "000") {
            this.placeholderResult = [];
            this.placeholderResult = response.data.JOINMEMBER.data || [];
          }
          return;
        })
        .catch(error => {
          const { msg } = error.response.data;
          this.actionSetGlobalMessage({ msg });
        });
    },
    placeholderKeyValue(key, option) {
      let result = this.placeholderResult.find(item => item.key === key);
      //tip：代表欄位placeholder ,help：代表欄位提示
      if (result) {
        switch (option) {
          case "tip":
            if (result.tip) {
              return result.tip["zh-cn"] || "";
            }
          case "help":
            if (result.help) {
              return result.help["zh-cn"] || "";
            }
        }
      }
      return;
    },
    openPhoneVerifyModal() {
      if (this.phoneVerifybtnActive == true) {
        this.phoneVerifyModalShow = true;
      } else {
        return;
      }
    },
    openMailVerifyModal() {
      if (this.mailVerifybtnActive == true) {
        this.mailVerifyModalShow = true;
      } else {
        return;
      }
    },
    getPhoneVerifyCode() {
      //取得驗證碼倒數秒數
      axios({
        method: "get",
        url: "/api/v1/c/player/register/phone/ttl"
      }).then(res => {
        // console.log("phonettl", res);
        if (res && res.data.result == "ok") {
          this.phoneVerifybtnSubmit = true;
          this.phoneSubmitSuccess = true;
          this.ttlCount = res.data.ret;
          this.timer = setInterval(() => {
            if (this.ttlCount <= 1) {
              this.ttlCount = 0;
              clearInterval(this.timer);
              this.phoneVerifybtnSubmit = false;
              this.timer = null;
              return;
            }
            this.ttlCount -= 1;
          }, 1500);
        } else {
          this.phoneSubmitFail = true;
          this.phoneSubmitFailMsg =
            res.msg + "(" + res.code + ")" || "ttl error";
        }
      });

      //寄出會員註冊驗證簡訊
      axios({
        method: "post",
        url: "/api/v1/c/player/register/phone",
        data: {
          phone: `${this.countryCode.replace("+", "")}-${this.allValue.phone}`
        }
      })
        .then(res => {
          if (res && res.data.result !== "ok") {
            this.phoneSubmitFail = true;
            this.phoneSubmitFailMsg =
              res.msg + "(" + res.code + ")" || "phone error1";
          }
        })
        .catch(error => {
          this.phoneSubmitFail = true;
          this.phoneSubmitFailMsg =
            error.response.data.msg + "(" + error.response.data.code + ")" ||
            "phone error2";
        });
    },
    submitPhoneVerify() {
      //會員註冊手機簡訊驗證
      axios({
        method: "put",
        url: "/api/v1/c/player/register/phone/verify",
        data: {
          phone: `${this.countryCode.replace("+", "")}-${this.allValue.phone}`,
          keyring: this.phoneVerifyCode
        }
      })
        .then(res => {
          if (res && res.data.result !== "ok") {
            this.phoneSubmitFail = true;
            this.phoneSubmitFailMsg =
              res.data.msg + "(" + res.data.code + ")" || "phoneverify error1";
          } else {
            // this.mailSubmitFailMsg = "验证OK";
            this.phoneVerifyModalShow = false;
            this.showPhoneCheckIcon = true;
            this.NeedCode = false;
          }
        })
        .catch(error => {
          this.phoneSubmitFail = true;
          this.phoneSubmitFailMsg =
            error.response.data.msg + "(" + error.response.data.code + ")" ||
            "phoneverify error2";
        });
    },
    getMailVerifyCode() {
      //取得mail驗證碼倒數秒數
      axios({
        method: "get",
        url: "/api/v1/c/player/register/email/ttl",
        data: {
          email: this.allValue.email
        }
      }).then(res => {
        // console.log("mailttl", res);
        if (res && res.data.result == "ok") {
          this.mailVerifybtnSubmit = true;
          this.mailSubmitSuccess = true;
          this.ttlCount = res.data.ret;
          this.timer = setInterval(() => {
            if (this.ttlCount <= 1) {
              this.ttlCount = 0;
              clearInterval(this.timer);
              this.mailVerifybtnSubmit = false;
              this.timer = null;
              return;
            }
            this.ttlCount -= 1;
          }, 1500);
        } else {
          this.mailSubmitFail = true;
          this.mailSubmitFailMsg =
            res.msg + "(" + res.code + ")" || "ttl error";
        }
      });

      //寄出mail會員註冊驗證碼
      axios({
        method: "post",
        url: "/api/v1/c/player/register/email",
        data: {
          email: this.allValue.email
        }
      })
        .then(res => {
          if (res && res.data.result !== "ok") {
            this.mailSubmitFail = true;
            this.mailSubmitFailMsg =
              res.msg + "(" + res.code + ")" || "mail error1";
          }
        })
        .catch(error => {
          this.mailSubmitFail = true;
          this.mailSubmitFailMsg =
            error.response.data.msg + "(" + error.response.data.code + ")" ||
            "mail error2";
        });
    },
    submitMailVerify() {
      //會員註冊mail驗證
      axios({
        method: "put",
        url: "/api/v1/c/player/register/email/verify",
        data: {
          email: this.allValue.email,
          keyring: this.mailVerifyCode
        }
      })
        .then(res => {
          if (res && res.data.result !== "ok") {
            this.mailSubmitFail = true;
            this.mailSubmitFailMsg =
              res.data.msg + "(" + res.data.code + ")" || "mailverify error1";
          } else {
            // this.mailSubmitFailMsg = "验证OK";
            this.mailVerifyModalShow = false;
            this.showMailCheckIcon = true;
            this.mailNeedCode = false;
          }
        })
        .catch(error => {
          this.mailSubmitFail = true;
          this.mailSubmitFailMsg =
            error.response.data.msg + "(" + error.response.data.code + ")" ||
            "mailverify error2";
        });
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/joinMem.module.scss"
  module="$styleDefault"
/>
