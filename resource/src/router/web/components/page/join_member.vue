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
          </label>
          <div :class="[$style['field-right'], 'clearfix']">
            <template v-if="field.key === 'captcha_text'">
              <input
                v-model="allValue[field.key]"
                :class="[$style['join-input-captcha'], field.key]"
                type="text"
                name="join-captcha"
                maxlength="4"
                placeholder="请填写验证码"
                @focus="getCaptcha()"
                @input="verification(field.key)"
                @keydown.13="keyDownSubmit()"
              />
              <img
                v-if="captchaImg"
                :src="captchaImg"
                :class="$style['captcha-img']"
                @click="getCaptcha()"
              />
            </template>

            <template v-else-if="field.key === 'password'">
              <input
                id="pwd"
                v-model="allValue[field.key]"
                :class="[$style['join-input'], field.key]"
                :name="field.key"
                :placeholder="field.content.note1"
                type="password"
                maxlength="12"
                @blur="verification(field.key)"
                @input="verification(field.key)"
                @keydown.13="keyDownSubmit()"
              />
              <div :class="$style['eye']">
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/_new/login/btn_eye_${
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
                @blur="verification(field.key)"
                @keydown.13="keyDownSubmit()"
              />
              <div :class="$style['eye']">
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/_new/login/btn_eye_${
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
                @blur="verification(field.key)"
                @keydown.13="keyDownSubmit()"
                @input="
                  allValue[field.key] = $event.target.value
                    .toLowerCase()
                    .replace(' ', '')
                    .trim()
                    .replace(/[\W]/g, '')
                "
              />
              <div :class="$style['clear']" v-if="allValue[field.key]">
                <img
                  :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
                  @click="allValue[field.key] = ''"
                />
              </div>
            </template>

            <template v-else-if="field.key === 'gender'">
              <v-select
                v-model="selectData['gender'].selected"
                :options="selectData['gender'].options"
                :searchable="false"
                :class="$style['join-input-gender']"
                @input="changSelect(field.key)"
              />
            </template>

            <template v-else-if="field.key === 'phone'">
              <!-- <v-select
                v-model="selectData[field.key].selected"
                :options="selectData[field.key].options"
                :searchable="false"
                :class="$style['join-select-phone']"
                @input="changSelect(field.key)"
              /> -->
              <input
                v-model="allValue['phone']"
                :class="[$style['join-input'], field.key]"
                :name="field.key"
                :placeholder="field.content.note1"
                type="number"
                @input="verification(field.key)"
                @keydown.13="joinSubmit()"
              />
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
                :placeholder="field.content.note1"
                :input-class="$style['join-input-birthday']"
                name="birthday"
                format="yyyy/MM/dd"
                initial-view="year"
                @cleared="verification(field.key)"
                @input="verification(field.key)"
              />
            </template>

            <template v-else-if="field.key === 'withdraw_password'">
              <!-- 有問題待修正 -->
              <!-- <div :class="$style['withdraw-password-wrap']">
                <input
                  v-for="(item, index) in allValue['withdraw_password'].value"
                  v-model="allValue['withdraw_password'].value[index]"
                  :key="`widthdrawPwd-${index}`"
                  @input="verification('withdraw_password', index)"
                  @blur="verification('withdraw_password', index)"
                  :data-key="`withdraw_password${index}`"
                  :class="$style['withdraw-pwd-input']"
                  :maxlength="1"
                  :minlength="1"
                  :placeholder="formData['new_withdraw_password'].placeholder"
                  type="tel"
                />
              </div> -->

              <!-- <div>
                <v-select
                  v-for="(num, index) in 4"
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
              </div> -->
            </template>

            <input
              v-else
              :ref="field.key"
              v-model="allValue[field.key]"
              :class="[$style['join-input'], field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              type="text"
              @blur="verification(field.key)"
              @keydown.13="keyDownSubmit()"
            />
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <div
            :class="
              allTip[field.key] ? $style['join-tip-show'] : $style['join-tip']
            "
            v-html="allTip[field.key]"
          />
        </div>
        <puzzle-verification
          v-if="memInfo.config.register_captcha_type === 3"
          ref="puzzleVer"
          :class="$style['puzzle-block']"
          :puzzle-obj.sync="puzzleObj"
        />
      </div>

      <div
        :class="
          allTip['captcha_text'] ? $style['join-tip-show'] : $style['join-tip']
        "
        :style="{ 'padding-right': '40px', 'padding-top': '0' }"
        v-html="allTip['captcha_text']"
      />

      <slide-verification
        v-if="memInfo.config.register_captcha_type === 2"
        :class="$style['join-btn-wrap']"
        :is-enable="isSlideAble"
        :success-fuc="joinSubmit"
        page-status="register"
      />
      <div v-else :class="$style['join-btn-wrap']">
        <div
          :class="[$style['join-btn'], { [$style.disabled]: !isSlideAble }]"
          @click="joinSubmit()"
        >
          {{ $text("S_COMFIRM_AND_LOGIN", "确认送出") }}
        </div>
      </div>
      <slot name="bottom-content" />
    </div>
  </div>
</template>

<script>
import { getCookie, setCookie } from '@/lib/cookie';
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import appEvent from '@/lib/appEvent';
import bbosRequest from "@/api/bbosRequest";
import capitalize from 'lodash/capitalize';
import datepicker from 'vuejs-datepicker';
import datepickerLang from '@/lib/datepicker_lang';
import joinMemInfo from '@/config/joinMemInfo';
import mcenter from '@/api/mcenter';
import member from '@/api/member';
import puzzleVerification from '@/components/puzzleVerification';
import slideVerification from '@/components/slideVerification';
import split from 'lodash/split';
import vSelect from 'vue-select';
import Vue from 'vue';

export default {
  components: {
    slideVerification,
    puzzleVerification,
    vSelect,
    datepicker
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
      ageLimit: new Date(Vue.moment(new Date()).add(-18, 'year')),
      isShowPwd: false,
      errMsg: '',
      joinMemInfo,
      captchaImg: '',
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
        withdraw_password: {
          value: ['', '', '', ''],
        },
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
      lock: false,
      puzzleData: null,
      registerData: [],
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
      }
    };
  },
  computed: {
    ...mapGetters({
      isWebview: 'getIsWebview',
      webInfo: 'getWebInfo',
      memInfo: 'getMemInfo',
      siteConfig: 'getSiteConfig'
    }),
    puzzleObj: {
      get() {
        return this.puzzleData;
      },
      set(value) {
        this.puzzleData = value;
      }
    },
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
            if (field.key === 'confirm_password' && this.allValue.password !== this.allValue.confirm_password) {
              return false;
            }

            if (this.joinMemInfo[field.key].type !== 'select' && field.key !== 'birthday') {
              return this.allValue[field.key].replace(/(^\s*)|(\s*$)/g, '') !== '';
            }

            if (field.key === 'gender') {
              return +this.allValue[field.key] !== 0;
            }

            if (field.key === 'withdraw_password') {
              return this.allValue.withdraw_password.length === 4;
            }

            // if (field.key === 'phone') {
            //   return this.joinMemInfo[field.key].hasVerify && this.countryCode;
            // }

            return this.allValue[field.key];
          }
          return true;
        });
    }
  },
  created() {
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
        note1: '请填写验证码',
        note2: ''
      }
    };

    member.joinConfig({
      success: ({ result, ret }) => {
        if (result !== 'ok') {
          return;
        }

        Object.keys(this.joinMemInfo).forEach((key) => {
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

          //   if (key === 'phone') {
          //     this.selectData.phone.options = [
          //       ...this.selectData.phone.options,
          //       ...ret[key].country_codes.map((label) => ({ label, value: label }))
          //     ];

          //     [this.selectData.phone.selected] = this.selectData.phone.options;
          //   }

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
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetGlobalMessage'
    ]),
    keyDownSubmit() {
      if (this.memInfo.config.register_captcha_type === 2) {
        return
      }
      this.joinSubmit();
    },
    toggleEye() {
      if (this.isShowPwd) {
        document.getElementById("pwd").type = 'password';
        document.getElementById("confirm_password").type = 'password';
      } else {
        document.getElementById("pwd").type = 'text';
        document.getElementById("confirm_password").type = 'text';
      }

      this.isShowPwd = !this.isShowPwd;
    },
    getCaptcha() {
      bbosRequest({
        method: 'post',
        url: `${this.siteConfig.BBOS_DOMIAN}/Captcha`,
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: {
          lang: 'zh-cn',
          format: 'png'
        }
      }).then((res) => {
        if (res.data && res.data.data) {
          this.captchaImg = res.data.data;
          this.aid = res.data.cookie.aid;
          setCookie('aid', res.data.cookie.aid);
        }
      });
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
      if (!this.allValue[key]) {
        return;
      }

      switch (key) {
        case 'password':
        case 'username':
        case 'phone':
        case 'qq_num':
        case 'withdraw_password':
        case 'confirm_password':
          this.allValue[key] = this.allValue[key].toLowerCase()
            .replace(' ', '')
            .trim()
            .replace(/[\W]/g, '');
          break;
      }

      if (key === 'name' && this.allValue[key].length > 30) {
        this.allValue[key] = this.allValue[key].substring(0, 30);
        return;
      }

      //  非必填欄位，空值不做驗證
      if (!data.isRequired && this.allValue[key] === '') {
        this.allTip[key] = '';
        return;
      }

      if (data.isRequired && this.allValue[key] === '') {
        this.allTip[key] = '该栏位不得为空';
        return;
      }

      const re = data.regExp;
      const msg = data.errorMsg;

      if (key === 'password') {
        if (re && !re.test(this.allValue.password)) {
          this.allTip.password = msg;
          return;
        }

        if (this.allValue.confirm_password === this.allValue.password) {
          this.allTip.confirm_password = '';
          return;
        }
      }

      if (key === 'confirm_password') {
        if (this.allValue.confirm_password !== this.allValue.password) {
          this.allTip.confirm_password = msg;
          return;
        } else {
          this.allTip.confirm_password = '';

        }

        return;
      }

      if (key == 'withdraw_password') {
        let target = this.allTip.withdraw_password.value[key];
        let errorMsg = '';
        let correct_value = target.value[index]
          .replace(' ', '')
          .trim()
          .replace(/[^\d+]$/g, '');

        if (target.value[index] === correct_value && correct_value !== '') {
          if (index < 3) {
            document.querySelector(`input[data-key="${key}_${index + 1}"]`).focus();
          }
        }

        target.value[index] = correct_value;

        if (target.value[index].length > 1) {
          target.value[index] = target.value[index].substring(0, 1);
        }

        for (let i = 0; i < 4; i++) {
          if (!this.allTip.withdraw_password.value[i]) {
            this.checkFormData = false;
            return;
          }
        }
      }

      if ((re && !re.test(this.allValue[key]))
        || (data.minimum && this.allValue[key].length < data.minimum)
        || (data.maximum && this.allValue[key].length > data.maximum)
      ) {
        this.allTip[key] = msg;
        return;
      }

      if (key === 'password' || key === 'username') {
        if (this.allValue.username !== '' && this.allValue.password === this.allValue.username) {
          this.allTip[key] = this.$text('S_USERNAME_CONFIRM_ERROR', '密码不能与帐号相同');
          return;
        }
      }

      if (key === "captcha_text") {
        // 圖形驗證格式
        this.allValue.captcha_text = this.allValue['captcha_text']
          .replace(/[\W\_]/g, '');
      }

      this.allTip[key] = '';
    },
    changSelect(key) {
      //   if (key === 'phone') {
      //     if (!this.selectData[key].selected) {
      //       this.selectData[key].selected = {
      //         label: this.countryCode,
      //         value: this.countryCode
      //       };
      //       return;
      //     }

      //     this.countryCode = this.selectData[key].selected.value;
      //     return;
      //   }

      if (this.selectData[key].selected && !this.selectData[key].selected.value) {
        this.allValue[key] = '0';
        return;
      }

      this.allValue[key] = this.selectData[key].selected ? this.selectData[key].selected.value : '0';
      this.verification(key);
    },
    joinSubmit(captchaInfo) {
      // 滑動
      if (this.memInfo.config.register_captcha_type === 2) {
        this.allValue.captcha_text = captchaInfo.data;
      }

      // 拼圖
      if (this.memInfo.config.register_captcha_type === 3) {
        this.allValue.captcha_text = this.puzzleObj;
        this.puzzleData = null;
      }

      const params = {
        ...this.allValue,
        captchaText: this.allValue.captcha_text,
        confirmPassword: this.allValue.confirm_password,
        aid: this.aid || getCookie('aid') || '',
        speedy: true
      };

      const self = this;
      const platform = getCookie('platform');

      bbosRequest({
        method: 'post',
        url: `${this.siteConfig.BBOS_DOMIAN}/Player/Add`,
        reqHeaders: {
          'Vendor': this.memInfo.user.domain,
          'kind': platform === "H" ? 'h' : 'pwa'
        },
        params: {
          ...params,
          host: window.location.host,
        }
      }).then((res) => {
        if (this.$refs.puzzleVer) this.$refs.puzzleVer.ret = null;
        if (res.data && res.data.cookie) {
          try {
            const { cookie } = res.data;
            for (const [key, value] of Object.entries(cookie)) {
              setCookie(key, value);
            }
          } catch (e) {
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

          self.actionSetUserdata(true);
          localStorage.setItem('new_user', true);
          this.actionSetGlobalMessage({ msg: "注册成功", cb: () => { window.location.reload(true) } })
          return;
        }

        if (captchaInfo && captchaInfo.slideFuc) {
          captchaInfo.slideFuc.reset();
        }

        this.allValue.captcha_text = '';

        if (res.status === '429') {
          this.errMsg = '操作太频繁，请稍候在试';
          return
        }

        if (res.status !== '000') {
          if (res.errors && Object.keys(res.errors)) {
            Object.keys(res.errors).forEach((item) => {
              this.allTip[item] = res.errors[item]
            })
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
    }
  }
};
</script>

<style lang="scss" src="@/css/page/joinMem.module.scss" module="$styleDefault"></style>
