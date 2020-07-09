<template>
  <div :class="['normal-page', $style['join-wrap'], 'clearfix']">
    <div :class="$style.join">
      <div v-if="hasTitle" :class="$style['join-ag-banner']">
        <div :class="$style['join-ag-banner-icon']" />
        {{ $t("S_AGENT_JOIN") }}
      </div>
      <div :class="$style['join-content']">
        <div
          v-for="field in fieldsData"
          :key="field.key"
          :class="[$style['field-wrap'], 'clearfix']"
        >
          <label
            :for="field.key"
            :title="$t(joinAgentInfo[field.key].text)"
            :class="$style[`field-title-${field.key}`] || $style['field-title']"
            @click="triggerFocus(field.key)"
          >
            <span :class="$style['field-text']">{{
              $t(joinAgentInfo[field.key].text)
            }}</span>
            <span
              v-if="joinAgentInfo[field.key].isRequired"
              :class="$style['join-star']"
              >*</span
            >
            <span v-else :class="$style['join-star']">&nbsp;</span>
          </label>
          <div :class="$style['field-right']">
            <v-select
              v-if="field.key === 'gender'"
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
                :ref="`field-${field.key}`"
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
              :ref="`field-${field.key}`"
              v-model="allValue[field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              :class="[$style['join-input'], field.key]"
              type="password"
              @input="verification(field.key)"
              @keydown.13="joinSubmit()"
            />
            <input
              v-else-if="field.key === 'confirm_password'"
              :ref="`field-${field.key}`"
              v-model="allValue[field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              :class="[$style['join-input'], field.key]"
              type="password"
              @blur="verification(field.key)"
              @keydown.13="joinSubmit()"
            />
            <input
              v-else-if="field.key === 'email'"
              :ref="`field-${field.key}`"
              v-model="allValue[field.key]"
              :class="[
                $style['join-input'],
                {
                  [$style['join-input-email']]:
                    joinAgentInfo[field.key].hasVerify
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
              :ref="`field-${field.key}`"
              v-model="allValue[field.key]"
              :class="[$style['join-input'], field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              type="text"
              @input="verification(field.key)"
              @keydown.13="joinSubmit()"
            />
            <template v-if="joinAgentInfo[field.key].hasVerify">
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
            <div v-if="field.content.note2" :class="$style['join-msg']">
              <icon :class="$style['join-msg-icon']" name="circle" />
              {{ field.content.note2 }}
            </div>
          </div>
        </div>
      </div>
      <div :class="$style['join-line']" />
      <div :class="$style['join-btn-wrap']">
        <div :class="$style['join-btn']" @click="joinSubmit()">
          {{ $text("S_COMFIRM_AND_LOGIN", "确认送出") }}
        </div>
      </div>
    </div>
    <pop-verify
      v-if="isVerifying"
      :type="'agent'"
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
import { mapGetters } from 'vuex';
import capitalize from 'lodash/capitalize';
import vSelect from 'vue-select';
import ajax from '@/lib/ajax';
import appEvent from '@/lib/appEvent';
import common from '@/api/common';
import agent from '@/api/agent';
import joinAgentInfo from '@/config/joinAgentInfo';

export default {
  components: {
    vSelect,
    popVerify: () => import('../common/popVerify')
  },
  props: {
    hasTitle: {
      type: Boolean,
      default: true
    },
    theme: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      joinAgentInfo,
      captchaImg: '',
      allValue: {
        username: '',
        password: '',
        confirm_password: '',
        name: '',
        email: '',
        phone: '',
        alias: '',
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
        name: '',
        email: '',
        phone: '',
        alias: '',
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
      verifyTips: ''
    };
  },
  computed: {
    ...mapGetters({
      isWebview: 'getIsWebview',
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig'
    }),
    fieldsData() {
      return this.registerData.filter((field) => this.joinAgentInfo[field.key] && this.joinAgentInfo[field.key].show);
    },
    $style() {
      if (this.theme) {
        return this.theme;
      }

      if (this.siteConfig.JOIN_MEMBER_THEME) {
        return this[`$style${capitalize(this.siteConfig.JOIN_MEMBER_THEME)}`];
      }

      return this.$styleDefault;
    }
  },
  created() {
    let joinConfig = [];
    let joinReminder = {};
    const username = {
      key: 'username',
      content: {
        note1: '',
        note2: ''
      }
    };
    const password = {
      key: 'password',
      content: {
        note1: '',
        note2: ''
      }
    };
    const confirmPassword = {
      key: 'confirm_password',
      content: {
        note1: '',
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

    agent.joinConfig({
      success: ({ result, ret }) => {
        if (result !== 'ok') {
          return;
        }

        Object.keys(this.joinAgentInfo).forEach((key) => {
          if (!ret[key]) {
            return;
          }

          if (key === 'phone') {
            this.selectData.phone.options = [
              ...this.selectData.phone.options,
              ...ret[key].country_codes.map((label) => ({ label, value: label }))
            ];

            [this.selectData.phone.selected] = this.selectData.phone.options;
          }

          this.joinAgentInfo[key] = {
            ...this.joinAgentInfo[key],
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
        url: `/tpl/${this.memInfo.user.domain}/agentRegister${preview}${status}.json`,
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
      const tmp = { label: index.toString(), value: index };
      for (let i = 0; i < 4; i += 1) {
        this.selectData.withdraw_password[i].options.push(tmp);
      }
    }
  },
  methods: {
    getCaptcha() {
      common.captcha({
        success: (response) => {
          this.captchaImg = response.ret;
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
      if (status) {
        return;
      }

      const { allValue } = this;
      const { currentVerify } = this;
      const params = {
        [currentVerify]: currentVerify === 'phone' ? `${this.countryCode.replace('+', '')}-${allValue[currentVerify]}` : allValue[currentVerify]
      };

      ajax({
        method: 'post',
        url: `/api/v1/c/agent/register/${currentVerify}`,
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
        },
        fail: ({ data }) => {
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
        url: `/api/v1/c/agent/register/${currentVerify}/verify`,
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
      const data = this.joinAgentInfo[key];

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
        this.allTip[key] = `✘ ${this.$t('S_JM_MSG_COMPLETE')}`;
        return;
      }

      if ((key === 'gender' && this.allValue.gender === '0' && data.isRequired)) {
        this.allTip[key] = `✘ ${this.$t('S_JM_FIELD_REQUIRE')}`;
        return;
      }

      if (data.isRequired && this.allValue[key] === '') {
        this.allTip[key] = `✘  ${this.$t('S_JM_FIELD_REQUIRE')}`;
        return;
      }

      if (key === 'password' || key === 'confirm_password') {
        if (this.allValue.confirm_password !== '' && this.allValue.password !== this.allValue.confirm_password) {
          this.allTip.confirm_password = `✘  ${this.$text('S_PASSWD_CONFIRM_ERROR', '确认密码预设要跟密码一致')}`;
        } else {
          this.allTip.confirm_password = '';
        }
      }

      const re = (data.regExp ? data.regExp : '');
      const msg = data.errorMsg;

      if ((re && !re.test(this.allValue[key]))
        || (key === 'confirm_password' && this.allValue.password !== this.allValue.confirm_password)
        || (data.minimum && this.allValue[key].length < data.minimum)
        || (data.maximum && this.allValue[key].length > data.maximum)
      ) {
        this.allTip[key] = `✘ ${msg}`;
        if (data.isRequired && this.allValue[key] === '') {
          this.allTip[key] = `✘  ${this.$t('S_JM_FIELD_REQUIRE')}`;
        }
        return;
      }

      this.allTip[key] = '';
    },
    joinSubmit() {
      this.checkFail = false;

      Object.keys(this.allTip).forEach((index) => {
        // 提示訊息不為空
        // 或 取款密碼只填1~3碼
        // 或 欄位為必填（且input為空、input取代空白為空、姓名未選擇、取款密碼輸入不完整）
        if (this.allTip[index]
          || (this.allValue.withdraw_password.length < 0 && this.allValue.withdraw_password.length < 4)
          || (this.joinAgentInfo[index].isRequired
            && (!this.allValue[index]
              || ((this.joinAgentInfo[index].type !== 'select') && this.allValue[index].replace(/(^\s*)|(\s*$)/g, '') === '')
              || (index === 'gender' && +this.allValue[index] === 0)
              || (index === 'withdraw_password' && this.allValue.withdraw_password.length < 4)
              || (index === 'phone' && this.joinAgentInfo[index].hasVerify && !this.countryCode)
            )
          )
        ) {
          this.checkFail = true;
        }
      });

      if (this.checkFail) {
        alert(this.$t('S_JM_MSG_COMPLETE'));
        return;
      }

      agent.join({
        params: {
          ...this.allValue,
          phone: this.countryCode && this.allValue.phone ? `${this.countryCode.replace('+', '')}-${this.allValue.phone}` : ''
        },
        success: () => {
          alert(this.$text('S_CR_SUCCESS_AND_LOGIN', '成功'));

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
            appEvent.jsToAppMessage('AGENT_REGIST_SUCCESS');
            return;
          }
          if (this.$route.path.split('/').filter((path) => path)[0] === 'mobile') {
            this.$router.push('/mobile/agcenter');
            return;
          }
          window.location.href = '/agent';
        },
        fail: (response) => {
          this.allValue.captcha_text = '';

          if (response.data.errors) {
            Object.keys(response.data.errors).forEach((msg) => {
              this.allTip[msg] = response.data.errors[msg];
            });
          }
        }
      });
    },
    triggerFocus(field) {
      if (this.$refs[`field-${field}`]) {
        this.$refs[`field-${field}`][0].focus();
      }
    }
  }
};
</script>

<style lang="scss" src="@/css/page/joinMem.module.scss" module="$styleDefault"></style>
