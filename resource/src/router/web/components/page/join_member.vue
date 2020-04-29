<template>
  <div
    v-show="fieldsData.length"
    :class="['normal-page', $style['join-wrap'], 'clearfix']"
  >
    <!-- <join-agreement
            v-if="joinAgree"
            @agree-check="openAgreement"
            @hide="joinAgree = false"
        /> -->
    <slot name="top-content" />
    <account-text
      v-if="accountTextStatus"
      :class="$style['agreement-text']"
      :btn-status="true"
      @change-agreement="changeAgreement"
    />
    <div v-if="!accountTextStatus" :class="$style.join">
      <slot name="join-header">
        <div :class="$style['join-banner']">
          <div :class="$style['join-banner-icon']" />
          {{ $t("S_JOIN_MEMBER") }}
        </div>
      </slot>
      <div :class="$style['join-content']">
        <!-- 錯誤訊息 -->
        <div :class="$style['err-msg']">
          <div v-show="errMsg">
            {{ errMsg }}
          </div>
        </div>

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
              $style[`field-${field.key}`],
              'clearfix'
            ]"
            @click="
              () => {
                onLabelClick(field.key);
              }
            "
          >
            <span :class="$style['field-text']">{{
              $t(joinMemInfo[field.key].text)
            }}</span>
            <span
              v-if="joinMemInfo[field.key].isRequired"
              :class="$style['join-star']"
              >*</span
            >
            <span v-else :class="$style['join-star']">&nbsp;</span>
          </label>
          <div :class="[$style['field-right'], 'clearfix']">
            <datepicker
              v-if="field.key === 'birthday'"
              v-model="allValue[field.key]"
              :language="dateLang"
              :disabled="{ from: ageLimit }"
              :open-date="ageLimit"
              :clear-button="true"
              :monday-first="true"
              :placeholder="field.content.note1"
              :input-class="$style['join-input-birthday']"
              name="birthday"
              format="yyyy/MM/dd"
              initial-view="year"
              @cleared="verification(field.key)"
              @input="verification(field.key)"
            />
            <v-select
              v-else-if="field.key === 'gender'"
              v-model="selectData[field.key].selected"
              :options="selectData[field.key].options"
              :searchable="false"
              :class="$style['join-input-gender']"
              @input="changSelect(field.key)"
            />
            <v-select
              v-for="(num, index) in 4"
              v-else-if="field.key === 'withdraw_password'"
              :key="index"
              v-model="selectData[field.key][index].selected"
              :class="
                num === 4
                  ? $style['join-input-withdraw-last']
                  : $style['join-input-withdraw']
              "
              :options="selectData[field.key][index].options"
              :searchable="false"
              @input="changWithdrawPassword(field.key, num)"
            />
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
                :class="[
                  $style['join-input'],
                  $style['join-input-phone'],
                  field.key
                ]"
                :name="field.key"
                :placeholder="field.content.note1"
                type="text"
                @input="verification(field.key)"
                @keydown.13="joinSubmit()"
              />
            </template>
            <template v-else-if="field.key === 'captcha_text'">
              <input
                v-model="allValue[field.key]"
                :class="[$style['join-input-captcha'], field.key]"
                type="text"
                name="join-captcha"
                maxlength="4"
                @focus="getCaptcha()"
                @input="verification(field.key)"
                @keydown.13="joinSubmit()"
              />
              <img
                v-if="captchaImg"
                :src="captchaImg"
                :class="$style['captcha-img']"
                @click="getCaptcha()"
              />
            </template>
            <input
              v-else-if="field.key === 'password'"
              v-model="allValue[field.key]"
              :class="[$style['join-input'], field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              type="password"
              @input="verification(field.key)"
              @keydown.13="joinSubmit()"
            />
            <input
              v-else-if="field.key === 'confirm_password'"
              v-model="allValue[field.key]"
              :class="[$style['join-input'], field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              type="password"
              @input="verification(field.key)"
              @blur="verification(field.key)"
              @focus="onFocus"
              @keydown.13="joinSubmit()"
            />
            <input
              v-else-if="field.key === 'email'"
              v-model="allValue[field.key]"
              :class="[
                $style['join-input'],
                {
                  [$style['join-input-email']]: joinMemInfo[field.key].hasVerify
                },
                field.key
              ]"
              :name="field.key"
              :placeholder="field.content.note1"
              type="text"
              @input="verification(field.key)"
              @keydown.13="joinSubmit()"
            />
            <input
              v-else-if="field.key === 'weixin'"
              v-model="allValue[field.key]"
              :class="[$style['join-input'], field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              type="text"
              maxlength="100"
              @input="verification(field.key)"
              @keydown.13="joinSubmit()"
            />
            <input
              v-else-if="field.key === 'qq_num'"
              v-model="allValue[field.key]"
              :class="[$style['join-input'], field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              type="text"
              maxlength="16"
              @input="verification(field.key)"
              @keydown.13="joinSubmit()"
            />
            <input
              v-else
              :ref="field.key"
              v-model="allValue[field.key]"
              :class="[$style['join-input'], field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              type="text"
              @input="verification(field.key)"
              @keydown.13="joinSubmit()"
            />
            <div v-if="field.content.note2" :class="$style['join-msg']">
              <icon :class="$style['join-msg-icon']" name="circle" />
              {{ field.content.note2 }}
            </div>
            <template v-if="joinMemInfo[field.key].hasVerify">
              <div
                v-if="
                  isVerified[field.key] &&
                    allValue[field.key] === oldValue[field.key]
                "
                :class="$style['icon-verify']"
              >
                <icon name="check-circle" width="16" height="16" />
              </div>
              <div
                v-else
                :class="[
                  $style['btn-verify'],
                  {
                    [$style.disabled]:
                      !allValue[field.key] ||
                      allTip[field.key] ||
                      (field.key === 'phone' && !countryCode)
                  }
                ]"
                @click="
                  getVerify(
                    field.key,
                    !allValue[field.key] ||
                      (field.key === 'phone' && !countryCode)
                  )
                "
              >
                {{ $text("S_SEND_CHECK_CODE", "发送验证码") }}
              </div>
            </template>
            <!-- eslint-disable vue/no-v-html -->
            <div
              :class="
                allTip[field.key] ? $style['join-tip-show'] : $style['join-tip']
              "
              v-html="allTip[field.key]"
            />
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>
      </div>
      <div v-if="hasAgreement" :class="$style.agreement">
        <input v-model="agreement" type="checkbox" />
        <span @click="agreement = !agreement">{{
          $text("S_I_ADULT_AGREE", "我已届满合法博彩年龄，且同意各项开户条约。")
        }}</span>
        <span :class="$style['agreement-link']" @click="openAgreement">{{
          $text("S_AGREEMENT", "开户协议")
        }}</span>
      </div>

      <slide-verification
        v-if="memInfo.config.register_captcha_type === 2"
        :class="$style['join-btn-wrap']"
        :is-enable="isSlideAble"
        :success-fuc="joinSubmit"
        page-status="register"
      />
      <div v-else :class="$style['join-btn-wrap']">
        <div :class="$style['join-btn']" @click="joinSubmit()">
          {{ $text("S_COMFIRM_AND_LOGIN", "确认送出") }}
        </div>
      </div>
      <slot name="bottom-content" />
    </div>
    <pop-verify
      v-if="isVerifying"
      :type="'player'"
      :current-verify="currentVerify"
      :value="allValue[currentVerify]"
      :old-value="oldValue[currentVerify]"
      :country-code="countryCode"
      :verify-tips="verifyTips"
      @clear="clearVerifyTips"
      @send="sendVerify"
      @verify="onVerify"
      @close="onVerifyClose"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import capitalize from 'lodash/capitalize';
import split from 'lodash/split';
import datepicker from 'vuejs-datepicker';
import vSelect from 'vue-select';
import ajax from '@/lib/ajax';
import appEvent from '@/lib/appEvent';
import member from '@/api/member';
import common from '@/api/common';
import datepickerLang from '@/lib/datepicker_lang';
import joinMemInfo from '@/config/joinMemInfo';
// import joinAgreement from '@/router/mobile/components/tpl/brilliant/components/common/joinAgreement';
import slideVerification from '@/components/slideVerification';
import accountText from '../tpl/8/brilliant/components/openAccountText';

import { getCookie, setCookie } from '@/lib/cookie';
import bbosRequest from '@/lib/bbosRequest';

export default {
  components: {
    datepicker,
    vSelect,
    // joinAgreement,
    accountText,
    popVerify: () => import('../common/popVerify'),
    slideVerification
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
      errMsg: '',
      joinMemInfo,
      dateLang: datepickerLang(this.$i18n.locale),
      ageLimit: new Date(Vue.moment(new Date()).add(-18, 'year')),
      captchaImg: '',
      agreement: false,
      aid: '',
      allValue: {
        username: '',
        password: '',
        confirm_password: '',
        introducer: this.$cookie.get('a') || '',
        name: '',
        email: '',
        phone: '',
        alias: '',
        birthday: '',
        gender: 0,
        qq_num: '',
        weixin: '',
        line: '',
        facebook: '',
        skype: '',
        zalo: '',
        withdraw_password: '',
        captcha_text: ''
      },
      allTip: {
        username: '',
        password: '',
        confirm_password: '',
        introducer: '',
        name: '',
        email: '',
        phone: '',
        alias: '',
        birthday: '',
        gender: '',
        qq_num: '',
        weixin: '',
        line: '',
        facebook: '',
        skype: '',
        zalo: '',
        withdraw_password: '',
        captcha_text: ''
      },
      selectData: {
        phone: {
          options: [],
          selected: { label: '', value: '' }
        },
        gender: {
          options: [
            { label: this.$i18n.t('S_SELECTED'), value: '0' },
            { label: this.$i18n.t('S_MALE'), value: '1' },
            { label: this.$i18n.t('S_FEMALE'), value: '2' }
          ],
          selected: { label: this.$i18n.t('S_SELECTED'), value: '' }
        },
        withdraw_password: [
          { options: [{ label: '-', value: '' }], selected: { label: '-', value: '' } },
          { options: [{ label: '-', value: '' }], selected: { label: '-', value: '' } },
          { options: [{ label: '-', value: '' }], selected: { label: '-', value: '' } },
          { options: [{ label: '-', value: '' }], selected: { label: '-', value: '' } }
        ]
      },
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
      currentVerify: '',
      oldValue: {
        email: '',
        phone: ''
      },
      countryCode: '',
      verifyTips: '',
      lock: false
    };
  },
  computed: {
    ...mapGetters({
      isWebview: 'getIsWebview',
      webInfo: 'getWebInfo',
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig'
    }),
    fieldsData() {
      return this.registerData.filter((field) => this.joinMemInfo[field.key] && this.joinMemInfo[field.key].show);
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
        .filter((field) => this.joinMemInfo[field.key].show)
        .every((field) => {
          if (this.allTip[field.key]) {
            return false;
          }

          if (this.joinMemInfo[field.key].isRequired) {
            if (this.joinMemInfo[field.key].type !== 'select' && field.key !== 'birthday') {
              return this.allValue[field.key].replace(/(^\s*)|(\s*$)/g, '') !== '';
            }

            if (field.key === 'gender') {
              return +this.allValue[field.key] !== 0;
            }

            if (field.key === 'withdraw_password') {
              return this.allValue.withdraw_password.length === 4;
            }

            if (field.key === 'phone') {
              return this.joinMemInfo[field.key].hasVerify && this.countryCode;
            }

            return this.allValue[field.key];
          }

          return true;
        });
    }
  },
  created() {
    if (this.loginStatus) {
      const redirectType = this.webInfo.redirect_type || 'custom';
      const redirectTo = this.webInfo.redirect_to || this.webInfo.page[0].pid;
      this.actionChangePage({ page: redirectTo, type: redirectType });
      return;
    }

    let joinConfig = [];
    let joinReminder = {};
    const username = {
      key: 'username',
      content: {
        note1: this.$text('S_ACCOUNT_PLACEHOLDER', '请输入4-20位字母或数字'),
        note2: ''
      }
    };
    const password = {
      key: 'password',
      content: {
        note1: this.$text('S_PASSWORD_PLACEHOLDER', '请输入6-12位字母或数字'),
        note2: ''
      }
    };
    const confirmPassword = {
      key: 'confirm_password',
      content: {
        note1: '请再次输入设置密码',
        note2: ''
      }
    };
    const captchaText = {
      key: 'captcha_text',
      content: {
        note1: '',
        note2: ''
      }
    };

    member.joinConfig({
      success: ({ result, ret }) => {
        if (result !== 'ok') {
          return;
        }

        Object.keys(this.joinMemInfo).forEach((key) => {
          // 因為研五API沒有上開關，所以先不判斷開關一律顯示色情影片
          if (key === 'captcha_text' && this.memInfo.config.register_captcha_type !== 1) {
            this.joinMemInfo[key].show = false;
            return;
          }

          if (!ret[key]) {
            return;
          }

          if (key === 'introducer' && this.$cookie.get('a')) {
            this.joinMemInfo[key] = {
              ...this.joinMemInfo[key],
              isRequired: true,
              show: false,
              hasVerify: ret[key].code_register
            };
            return;
          }

          if (key === 'phone') {
            this.selectData.phone.options = [
              ...this.selectData.phone.options,
              ...ret[key].country_codes.map((label) => ({ label, value: label }))
            ];

            [this.selectData.phone.selected] = this.selectData.phone.options;
          }

          this.joinMemInfo[key] = {
            ...this.joinMemInfo[key],
            isRequired: ret[key].required,
            show: !ret[key].none,
            hasVerify: ret[key].code_register
          };
          joinConfig = [...joinConfig, { key, content: { note1: '', note2: '' } }];
        });
      }
    }).then(() => {
      const preview = this.$route.name === 'preview' ? 'View' : '';
      const status = this.$cookie.get('newsite') ? 'New' : '';

      ajax({
        method: 'get',
        url: `/tpl/${this.memInfo.user.domain}/playerRegister${preview}${status}.json`,
        params: {
          v: Date.parse(new Date())
        },
        success: (response) => {
          response.data.forEach((item) => {
            Object.keys(item).forEach((key) => {
              const content = JSON.parse(item[key][this.$i18n.locale]);

              joinReminder = {
                ...joinReminder,
                [key]: {
                  note1: content.note1 || '',
                  note2: content.note2 || ''
                }
              };

              if (key === 'gender' && joinReminder[key].note1) {
                this.selectData.gender.options[0].label = joinReminder[key].note1;
                this.selectData.gender.selected.label = joinReminder[key].note1;
              }
            });
          });

          joinConfig.map((item) => {
            const info = item;
            info.content = {
              ...item.content,
              ...joinReminder[item.key]
            };

            return info;
          });
        }
      }).then(() => {
        this.registerData = [username, password, confirmPassword, ...joinConfig, captchaText];
      });
    });

    // 補取款密碼options
    for (let index = 0; index < 10; index += 1) {
      const option = { label: `${index}`, value: index };
      for (let i = 0; i < 4; i += 1) {
        this.selectData.withdraw_password[i].options.push(option);
      }
    }
  },
  methods: {
    ...mapActions([
      'actionChangePage'
    ]),
    getCaptcha() {
      bbosRequest({
        method: 'post',
        url: this.siteConfig.BBOS_DOMIAN + '/Captcha',
        reqHeaders: {
          'Vendor': this.memInfo.user.domain
        },
        params: {
          "lang": "zh-cn",
          "format": "png",
        },
      }).then((res) => {
        if (res.data && res.data.data) {
          this.captchaImg = res.data.data;
          this.aid = res.data.cookie.aid;
          setCookie('aid', res.data.cookie.aid);
        }
      });
    },
    getVerify(key, isDisable) {
      if (isDisable) {
        return;
      }

      this.currentVerify = key;
      this.isVerifying = true;
    },
    clearVerifyTips() {
      this.verifyTips = '';
    },
    sendVerify(getCount, status) {
      if (status || this.lock) {
        return;
      }

      this.lock = true;
      const { allValue } = this;
      const { currentVerify } = this;
      const params = {
        [currentVerify]: currentVerify === 'phone' ? `${this.countryCode.replace('+', '')}-${allValue[currentVerify]}` : allValue[currentVerify]
      };

      ajax({
        method: 'post',
        url: `/api/v1/c/player/register/${currentVerify}`,
        errorAlert: false,
        params,
        success: ({ result }) => {
          if (result !== 'ok') {
            return;
          }

          const msg = this.currentVerify === 'email' ? this.$text('S_FIND_TRASH', '，若没收到信件请尝试至垃圾箱寻找') : '';
          this.oldValue = { ...this.oldValue, [currentVerify]: allValue[currentVerify] };
          this.verifyTips = `${this.$text('S_SEND_CHECK_CODE_VALID_TIME', { text: '验证码已发送，有效时间为%s分钟', replace: [{ target: '%s', value: '<span>5</span>' }] })}${msg}`;
          getCount();
          this.lock = false;
        },
        fail: ({ data }) => {
          this.lock = false;
          // Email => 116004
          // Phone => 320006
          if ([116004, 320006].includes(data.code)) {
            this.verifyTips = this.$text('S_SEND_CHECK_CODE_VALID_LIMIT', { text: '发送次数已达上限，请于%s小时后再试！', replace: [{ target: '%s', value: '<span>24</span>' }] });
            return;
          }

          this.verifyTips = data.msg;
        }
      });
    },
    onVerify(keyring) {
      const { allValue } = this;
      const { currentVerify } = this;
      const params = {
        [currentVerify]: currentVerify === 'phone' ? `${this.countryCode.replace('+', '')}-${allValue[currentVerify]}` : allValue[currentVerify],
        keyring
      };

      ajax({
        method: 'put',
        url: `/api/v1/c/player/register/${currentVerify}/verify`,
        params,
        success: ({ result }) => {
          if (result !== 'ok') {
            return;
          }

          this.isVerified = { ...this.isVerified, [currentVerify]: true };
          this.allTip = { ...this.allTip, [currentVerify]: '' };
          this.onVerifyClose();
        }
      });
    },
    onVerifyClose() {
      this.isVerifying = false;
      this.currentVerify = '';
      this.verifyTips = '';
    },
    onFocus() {
      if (this.allValue.username === '') {
        this.allTip.username = this.$text('S_JM_FIELD_REQUIRE', '该栏位不得为空');
      }

      if (this.allValue.password === '') {
        this.allTip.password = this.$text('S_JM_FIELD_REQUIRE', '该栏位不得为空');
      }

      if (this.allValue.password !== '' && !this.joinMemInfo.password.regExp.test(this.allValue.password)) {
        this.allTip.password = this.$text('S_PASSWORD_ERROR', '请输入6-12码英文小写、数字');
      }

      if (this.allValue.username !== '' && this.allValue.password === this.allValue.username) {
        this.allTip.password = this.$text('S_USERNAME_CONFIRM_ERROR', '密码不能与帐号相同');
      }
    },
    changSelect(key) {
      if (key === 'phone') {
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

      if (this.selectData[key].selected && !this.selectData[key].selected.value) {
        this.allValue[key] = '0';
        return;
      }

      this.allValue[key] = this.selectData[key].selected ? this.selectData[key].selected.value : '0';
      this.verification(key);
    },
    changWithdrawPassword(key, num) {
      this.allValue[key] = '';
      Object.keys(this.selectData.withdraw_password).forEach((index) => {
        if (this.selectData.withdraw_password[index].selected) {
          this.allValue[key] += this.selectData.withdraw_password[index].selected.value;
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
    verification(key) {
      const data = this.joinMemInfo[key];

      if (key === 'name' && this.allValue[key].length > 30) {
        this.allValue[key] = this.allValue[key].substring(0, 30);
        return;
      }

      //  非必填欄位，空值不做驗證
      if (!data.isRequired && this.allValue[key] === '') {
        this.allTip[key] = '';
        return;
      }

      if (key === 'withdraw_password' && this.allValue.withdraw_password.length < 4 && data.isRequired) {
        this.allTip[key] = this.$t('S_JM_MSG_COMPLETE');
        return;
      }

      if ((key === 'birthday' && !this.allValue.birthday && data.isRequired)) {
        this.allTip[key] = this.$t('S_JM_FIELD_REQUIRE');
        return;
      }

      if ((key === 'gender' && this.allValue.gender === '0' && data.isRequired)) {
        this.allTip[key] = this.$t('S_JM_FIELD_REQUIRE');
        return;
      }

      if (data.isRequired && this.allValue[key] === '') {
        this.allTip[key] = this.$t('S_JM_FIELD_REQUIRE');
        return;
      }

      const re = data.regExp;
      const msg = data.errorMsg;

      if (key === 'password') {
        this.allTip.password = re && re.test(this.allValue.password) ? '' : msg;
        return;
      }

      if (key === 'confirm_password') {
        if (this.allValue.confirm_password === '') {
          this.allTip.confirm_password = this.$text('S_JM_FIELD_REQUIRE', '该栏位不得为空');
          return;
        }

        const password = split(this.allValue.password, '');
        const confirmPassword = split(this.allValue.confirm_password, '');
        const isSame = confirmPassword.every((value, index) => password[index] === value);

        if (isSame || this.allValue.confirm_password === this.allValue.password) {
          this.allTip.confirm_password = '';
          return;
        }

        this.allTip.confirm_password = msg;
        return;
      }

      if ((re && !re.test(this.allValue[key]))
        || (data.minimum && this.allValue[key].length < data.minimum)
        || (data.maximum && this.allValue[key].length > data.maximum)
      ) {
        this.allTip[key] = msg;
        if (data.isRequired && this.allValue[key] === '') {
          this.allTip[key] = this.$t('S_JM_FIELD_REQUIRE');
        }
        return;
      }

      this.allTip[key] = '';
    },
    joinSubmit(captchaInfo) {
      if (!this.allValue.username || !this.allValue.password || !this.allValue.confirm_password) return;
      const data = this.registerData;

      this.checkFail = false;

      if (this.allValue.username === this.allValue.password) {
        this.errMSg = (this.$text('S_USERNAME_CONFIRM_ERROR', '密码不能与帐号相同'));
        return;
      }

      if (this.hasAgreement && !this.agreement) {
        if (captchaInfo && captchaInfo.slideFuc) {
          captchaInfo.slideFuc.reset();
        }

        alert(this.$text('S_PLZ_CHECK_AGREEMENT', '请勾选同意条款！'));
        return;
      }

      if (this.allValue.birthday) {
        this.allValue.birthday = Vue.moment(this.allValue.birthday).format();
      }

      data.forEach((field) => {
        if (this.joinMemInfo[field.key].show) {
          // 提示訊息不為空
          // 或 取款密碼只填1~3碼
          // 或 欄位為必填（且input為空、input取代空白為空、姓名未選擇、取款密碼輸入不完整）
          if (this.allTip[field.key]
            || (this.allValue.withdraw_password.length < 0 && this.allValue.withdraw_password.length < 4)
            || (this.joinMemInfo[field.key].isRequired
              && (!this.allValue[field.key]
                || ((this.joinMemInfo[field.key].type !== 'select' && field.key !== 'birthday') && this.allValue[field.key].replace(/(^\s*)|(\s*$)/g, '') === '')
                || (field.key === 'gender' && +this.allValue[field.key] === 0)
                || (field.key === 'withdraw_password' && this.allValue.withdraw_password.length < 4)
                || (field.key === 'phone' && this.joinMemInfo[field.key].hasVerify && !this.countryCode)
              )
            )
          ) {
            this.checkFail = true;
          }
        }
      });

      if (this.checkFail) {
        if (captchaInfo && captchaInfo.slideFuc) {
          captchaInfo.slideFuc.reset();
        }

        this.errMsg = (this.$t('S_JM_MSG_COMPLETE'));
        return;
      }

      if (this.memInfo.config.register_captcha_type === 2) {
        this.allValue.captcha_text = captchaInfo.data;
      }

      // 暫時調整欄位
      let params = {
        ...this.allValue,
        'captchaText': this.allValue.captcha_text,
        'confirmPassword': this.allValue.confirm_password,
        'withdrawPassword': this.allValue.withdraw_Password,
        "aid": this.aid || getCookie('aid') || '',
        "speedy": true,
        phone: this.countryCode && this.allValue.phone ? `${this.countryCode.replace('+', '')}-${this.allValue.phone}` : ''
      }
      delete params['captcha_text'];
      delete params['withdraw_Password'];

      bbosRequest({
        method: 'post',
        url: this.siteConfig.BBOS_DOMIAN + '/Player/Add',
        reqHeaders: {
          'Vendor': this.memInfo.user.domain
        },
        params: {
          ...params,
        },
      }).then((res) => {
        if (res.data && res.data.cookie) {

          try {
            let cookie = res.data.cookie;
            for (let [key, value] of Object.entries(cookie)) {
              setCookie(key, value);
            }
          } catch (e) {
            //若不支持至少保留cid cookie
            setCookie('cid', res.data.cookie.cid);
          }

          // GA流量統計
          window.dataLayer.push({
            dep: 2,
            event: 'ga_click',
            eventCategory: 'sign_up',
            eventAction: 'sign_up',
            eventLabel: 'sign_up',
            ga_hall_id: 3820325,
            ga_domain_id: this.memInfo.user.domain
          });

          if (this.isWebview) {
            appEvent.jsToAppMessage('PLAYER_REGIST_SUCCESS');
            return;
          }

          window.location.reload();
          return;
        }

        if (captchaInfo && captchaInfo.slideFuc) {
          captchaInfo.slideFuc.reset();
        }

        this.allValue.captcha_text = '';
        if (res.status !== "000") {
          // to do 錯誤訊息?
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
    openAgreement(state) {
      if (this.$route.path.split('/')[1] === 'mobile') {
        this.joinAgree = true;
        window.scrollTo(0, 0);
        if (state) {
          this.agreement = state;
        }
        return;
      }

      if (['129', '30', '32', '177'].includes(this.webInfo.alias)) {
        this.accountTextStatus = true;
        window.scrollTo(0, 0);
      }
    },
    changeAgreement() {
      this.agreement = true;
      this.accountTextStatus = false;
    }
  }
};
</script>

<style lang="scss" src="@/css/page/joinMem.module.scss" module="$styleDefault"></style>

