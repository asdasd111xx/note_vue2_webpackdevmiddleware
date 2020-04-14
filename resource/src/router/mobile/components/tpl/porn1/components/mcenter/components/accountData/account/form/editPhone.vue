<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <edit-phone
        :old-code.sync="oldCode"
        :old-value="oldValue"
        :new-code.sync="newCode"
        :new-value="newValue"
        :code-value="codeValue"
        :info="info"
      >
        <template
          scope="{ countryCodes, oldPhone, newPhone, checkCode, sendBtn, countdownSec, onSend, onSubmit }"
        >
          <!-- 暫時解scope 無法使用在header computed -->
          <div :class="$style['save-btn']" @click="handleSubmit(onSubmit)">
            {{ $text("S_COMPLETE", "完成") }}
          </div>

          <div :class="$style['top-tips']">
            <div v-show="countdownSec" :class="$style.important">
              {{ $text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", 5) }}
              {{ $text("S_FIND_TRASH") }}
            </div>
            <div v-show="errMsg" :class="$style.important">
              {{ errMsg }}
            </div>
          </div>

          <div :class="[$style.wrap, 'clearfix']">
            <template v-if="oldPhone.isShow">
              <div :class="$style.block">
                <div :class="$style.title">{{ oldPhone.label }}</div>
                <div :class="$style['input-wrap']">
                  <input
                    v-model="oldValue"
                    :placeholder="oldPhone.label"
                    :class="$style.input"
                    type="text"
                  />
                </div>
              </div>
            </template>

            <template v-if="newPhone.isShow">
              <div :class="$style.block">
                <div :class="$style.title">
                  {{ $text("S_MOBILE_NUMBER", "手机号码") }}
                </div>
                <div :class="$style['input-wrap']">
                  <select
                    v-model="oldCode"
                    :class="[$style.select, $style['phone-select']]"
                    :readonly="true"
                    :disabled="true"
                  >
                    <template v-for="option in countryCodes.options">
                      <option :key="option" :value="option">{{
                        option
                      }}</option>
                    </template>
                  </select>

                  <input
                    v-model="newValue"
                    :placeholder="
                      $text('S_PLEASE_ENTER_MOBILE_NUMBER', '请输入手机号码')
                    "
                    :class="$style.input"
                    type="text"
                  />
                </div>
              </div>
            </template>

            <template v-if="checkCode.isShow">
              <div :class="$style.block">
                <div :class="$style.title">
                  {{ $text("S_MAIL_CHECK_CODE", "手机验证码") }}
                </div>
                <div :class="$style['input-wrap']">
                  <input
                    v-model="codeValue"
                    :placeholder="$text('S_MOBILE_CAPTCHA', '请输入手机验证码')"
                    :class="$style.input"
                    type="text"
                  />

                  <div
                    v-if="sendBtn.isShow"
                    :class="[$style['btn-send'], { [$style.active]: newValue }]"
                    @click="handleSend(onSend)"
                  >
                    {{ sendBtn.label }}
                    <template v-if="sendBtn.countdownSec">
                      (<span>{{ countdownSec }}</span
                      >)
                    </template>
                  </div>
                </div>
              </div>
            </template>

            <!-- <div :class="$style['btn-wrap']">
              <div :class="$style['btn-cancel']" @click="$emit('cancel')">
                {{ $text("S_CANCEL", "取消") }}
              </div>
              <div
                :class="$style['btn-confirm']"
                @click="handleSubmit(onSubmit)"
              >
                {{ $text("S_CONFIRM", "確認") }}
              </div>
            </div> -->
          </div>
          <div
            v-if="sendMsg"
            :class="[$style['bottom-tips'], { [$style.active]: sendMsg }]"
          >
            {{ sendMsg }}
          </div>

          <service-tips />
        </template>
      </edit-phone>
    </div>
  </mobile-container>
</template>

<script>
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import editPhone from '@/components/common/editPhone';
import member from '@/api/member';
import mobileContainer from '../../../../../common/new/mobileContainer';
import serviceTips from '../../serviceTips'

export default {
  components: {
    editPhone,
    mobileContainer,
    serviceTips
  },
  // props: {
  //     info: {
  //         type: Object,
  //         required: true
  //     }
  // },
  data() {
    return {
      oldCode: '',
      newCode: '',
      oldValue: '',
      newValue: '',
      codeValue: '',
      sendMsg: '',
      errMsg: '',
      info: {
        key: 'phone',
        text: 'S_TEL',
        status: '',
        value: '',
        btnText: '',
        btnShow: true,
        type: 'bind',
        verification: true,
        isShow: true,
        popTitle: ''
      }
    };
  },
  created() {
    ajax({
      method: 'get',
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then((response) => {
      if (response && response.result === 'ok') {
        this.info.verification = response.ret.config['phone'].code;
        this.setData(response.ret);
      }
    });
  },
  mounted() {
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      webInfo: 'getWebInfo'
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text("S_TEL", "手机号码"),
        // onClickFunc: () => {
        // },
        // funcBtn: this.$text("S_COMPLETE", "完成"),
        // funcBtnActive: this.codeVaue && this.newValue,
      };
    },
  },
  methods: {
    ...mapActions(['actionSetUserdata']),
    handleSend(send) {
      if (!this.newValue) return;

      send().then((response) => {
        if (response.status) {
          this.sendMsg = response.msg;

          setTimeout(() => {
            this.sendMsg = '';
          }, 3000);
        }
      });
    },
    handleSubmit(submit) {
      submit().then((response) => {
        if (response.status) {
          this.$emit('cancel');
        }
      });
    },
    setData(userConfig = {}) {
      if (Object.keys(userConfig).length === 0) {
        return;
      }

      const keyValue = this.memInfo.user.phone;

      let val = this.$t('S_YET_SET');
      let text = this.$t('S_SET_CL');
      let confirmSt = 'yet';

      if (keyValue) {
        val = `${this.$t('S_YET_VERIFIED')}(${keyValue})`;
        text = this.$t('S_VERIFY');
        confirmSt = 'ok';
        if (userConfig.user['phone']) {
          val = keyValue;
          text = this.$t('S_CS_EDIT');
          confirmSt = 'already';
        }
      }
      this.info = {
        ...this.info,
        status: confirmSt,
        value: val,
        btnText: text,
        btnShow: true,
        verification: true,
        isShow: userConfig.config['phone'].display
      };
      this.oldValue = val
    }
  }
};
</script>
<style src="../../css/index.module.scss" lang="scss" module>
