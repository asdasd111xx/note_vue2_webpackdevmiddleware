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
            <input
              v-else-if="field.key === 'password'"
              v-model="allValue[field.key]"
              :class="[$style['join-input'], field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              type="password"
              @focus="onFocus(field.key)"
              @blur="verification(field.key)"
              @keydown.13="keyDownSubmit()"
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
              @keydown.13="keyDownSubmit()"
            />
            <input
              v-else-if="field.key === 'username'"
              :ref="field.key"
              v-model="allValue[field.key]"
              :class="[$style['join-input'], field.key]"
              :name="field.key"
              :placeholder="field.content.note1"
              type="text"
              @focus="onFocus(field.key)"
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
import { mapGetters } from 'vuex';
import capitalize from 'lodash/capitalize';
import split from 'lodash/split';
import ajax from '@/lib/ajax';
import appEvent from '@/lib/appEvent';
import member from '@/api/member';
import joinMemInfo from '@/config/joinMemInfo';
import slideVerification from '@/components/slideVerification';
import puzzleVerification from '@/components/puzzleVerification';
import { getCookie, setCookie } from '@/lib/cookie';
import bbosRequest from "@/api/bbosRequest";

export default {
  components: {
    slideVerification,
    puzzleVerification,
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
      captchaImg: '',
      aid: '',
      allValue: {
        username: '',
        password: '',
        confirm_password: '',
        captcha_text: ''
      },
      allTip: {
        username: '',
        password: '',
        confirm_password: '',
        captcha_text: ''
      },
      puzzleData: null,
      registerData: [],
      currentTip: '',
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
      if (this.memInfo.config.register_captcha_type === 3 && !this.puzzleObj) {
        return false;
      }

      return this.registerData
        .filter((field) => this.joinMemInfo[field.key].show)
        .every((field) => {
          if (this.allTip[field.key] || this.currentTip) {
            return false;
          }

          if (this.joinMemInfo[field.key].isRequired) {
            if (field.key === 'confirm_password' && this.allValue.password !== this.allValue.confirm_password) {
              return false;
            }

            return this.allValue[field.key] ? this.allValue[field.key].replace(/(^\s*)|(\s*$)/g, '') !== '' : false;
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
        note1: this.$text('S_ACCOUNT_PLACEHOLDER', '请输入4-20码英文小写、数字'),
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
  },
  methods: {
    keyDownSubmit() {
      if (this.memInfo.config.register_captcha_type === 2) {
        return
      }
      this.joinSubmit();
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
    onFocus(key) {
      this.currentTip = this.allTip[key];
      this.allTip[key] = '';
    },
    verification(key) {
      const data = this.joinMemInfo[key];
      this.allValue[key] = this.allValue[key].replace(/[\W]/g, '')

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
        return;
      }

      if (key === 'password' || key === 'username') {
        if (this.allValue.username !== '' && this.allValue.password === this.allValue.username) {
          this.allTip[key] = this.$text('S_USERNAME_CONFIRM_ERROR', '密码不能与帐号相同');
          return;
        }
      }

      this.allTip[key] = '';
      this.currentTip = '';
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

      // 暫時調整欄位
      const params = {
        ...this.allValue,
        captchaText: this.allValue.captcha_text,
        confirmPassword: this.allValue.confirm_password,
        aid: this.aid || getCookie('aid') || '',
        speedy: true
      };
      delete params.captcha_text;
      delete params.withdraw_Password;

      if (this.memInfo.config.register_captcha_type === 3) {
        delete params.confirm_password;
      }

      bbosRequest({
        method: 'post',
        url: `${this.siteConfig.BBOS_DOMIAN}/Player/Add`,
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: {
          ...params
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
            // 若不支持至少保留cid cookie
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
