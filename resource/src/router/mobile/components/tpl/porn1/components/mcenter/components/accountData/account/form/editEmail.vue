<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <edit-email
        :old-value="oldValue"
        :new-value="newValue"
        :code-value="codeValue"
        :info="info"
      >
        <template
          scope="{ oldEmail, newEmail, checkCode, sendBtn, countdownSec, onSend, onSubmit }"
        >
          <div :class="[$style.wrap, 'clearfix']">
            <!-- 錯誤訊息 -->
            <div :class="$style['top-tip']">
              <div v-if="countdownSec" :class="$style.important">
                {{ $text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", 5) }}
                {{ $text("S_FIND_TRASH") }}
              </div>
            </div>

            <template v-if="oldEmail.isShow">
              <div :class="$style.block">
                <div :class="$style.title">{{ oldEmail.label }}</div>
                <div :class="$style['input-wrap']">
                  <input
                    v-model="oldValue"
                    :placeholder="oldEmail.label"
                    :class="$style.input"
                    type="text"
                  />
                </div>
              </div>
            </template>

            <template v-if="newEmail.isShow">
              <div :class="$style.block">
                <div :class="$style.title">
                  {{ $text("S_NEW_EMAIL2", "邮箱账号") }}
                </div>
                <div :class="$style['input-wrap']">
                  <input
                    v-model="newValue"
                    :placeholder="
                      $text('S_PLS_ENTER_NEW_EMAIL', '请输入邮箱账号')
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
                  {{ $text("S_MAIL_CHECK_CODE", "邮箱验证码") }}
                </div>
                <div :class="$style['input-wrap']">
                  <input
                    v-model="codeValue"
                    :placeholder="
                      $text('S_PLS_ENTER_MAIL_CODE', '请输入邮箱验证码')
                    "
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

          <div v-if="sendMsg" :class="$style['send-email']">
            {{ sendMsg }}
          </div>
          <service-tips />
        </template>
      </edit-email>
    </div>
  </mobile-container>
</template>

<script>
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import editEmail from '@/components/common/editEmail';
import member from '@/api/member';
import mobileContainer from '../../../../../common/new/mobileContainer';
import serviceTips from '../../serviceTips'

export default {
  components: {
    editEmail,
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
      oldValue: '',
      newValue: '',
      codeValue: '',
      sendMsg: '',
      info: {
        key: 'email',
        text: 'SS_E_MAIL',
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
        this.info.verification = response.ret.config['email'].code;
        this.setData(response.ret);
      }
    });
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
        onSave: () => { this.handleSubmit(); },
        saveBtnActive: this.codeVaue && this.newValue,
        title: this.$text("S_E_MAIL", "电子邮箱"),
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
    handleSubmit() {
      this.onSubmit().then((response) => {
        if (response.status) {
          this.$emit('cancel');
        }
      });
    },
    setData(userConfig = {}) {
      if (Object.keys(userConfig).length === 0) {
        return;
      }

      const keyValue = this.memInfo.user.email;

      let val = this.$t('S_YET_SET');
      let text = this.$t('S_SET_CL');
      let confirmSt = 'yet';

      if (keyValue) {
        val = `${this.$t('S_YET_VERIFIED')}(${keyValue})`;
        text = this.$t('S_VERIFY');
        confirmSt = 'ok';
        if (userConfig.user['email']) {
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
        isShow: userConfig.config['email'].display
      };
      this.oldValue = val
    }
  }
};
</script>
<style src="../../css/form.module.scss" lang="scss" module>
