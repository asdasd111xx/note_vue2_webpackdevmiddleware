<template>
  <div slot="content" :class="$style['content-wrap']">
    <account-header :header-config="headerConfig" />
    <div :class="[$style.wrap, 'clearfix']">
      <!-- 錯誤訊息 -->
      <div :class="$style['top-tips']">
        <div v-show="tipMsg">
          {{ tipMsg }}
        </div>
      </div>
      <template v-if="memInfo.user.has_withdraw_password">
        <div :class="[$style.block, $style['withdraw-password']]">
          <div :class="$style.title">{{ "原密码" }}</div>
          <div :class="$style['input-wrap']">
            <input
              v-for="(item, index) in formData['old_withdraw_password'].value"
              v-model="formData['old_withdraw_password'].value[index]"
              :key="`widthdrawPwd-${index}`"
              @input="verification('old_withdraw_password', index)"
              @blur="verification('old_withdraw_password', index, true)"
              :data-key="`old_withdraw_password_${index}`"
              :class="$style['withdraw-pwd-input']"
              :maxlength="1"
              :minlength="1"
              :placeholder="formData['old_withdraw_password'].placeholder"
              type="tel"
            />
          </div>
        </div>
      </template>
      <div :class="[$style.block, $style['withdraw-password']]">
        <div :class="$style.title">
          {{ memInfo.user.has_withdraw_password ? "新密碼" : "设定密码" }}
        </div>
        <div :class="$style['input-wrap']">
          <input
            v-for="(item, index) in formData['new_withdraw_password'].value"
            v-model="formData['new_withdraw_password'].value[index]"
            :key="`widthdrawPwd-${index}`"
            @input="verification('new_withdraw_password', index)"
            @blur="verification('new_withdraw_password', index, true)"
            :data-key="`new_withdraw_password_${index}`"
            :class="$style['withdraw-pwd-input']"
            :maxlength="1"
            :minlength="1"
            :placeholder="formData['new_withdraw_password'].placeholder"
            type="tel"
          />
        </div>
      </div>
    </div>
    <div
      :class="$style['service-tip']"
      :style="{ 'text-align': 'left', 'padding-left': '35px','color': '#414655' }"
    >
      {{ "请输入0-9数字" }}
    </div>
  </div>
</template>

<script>
import accountHeader from '../../accountHeader';
import serviceTips from '../../serviceTips';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  components: {
    accountHeader,
    serviceTips
  },
  data() {
    return {
      tipMsg: '',
      checkFormData: false,
      formData: {
        old_withdraw_password: {
          value: ['', '', '', ''],
          placeholder: '--'
        },
        new_withdraw_password: {
          value: ['', '', '', ''],
          placeholder: '--'
        }
      },
    };
  },
  mounted() {
    if (this.memInfo.user.has_withdraw_password) {
      document.querySelector('input[data-key="old_withdraw_password_0"]').focus();
    } else {
      document.querySelector('input[data-key="new_withdraw_password_0"]').focus();
    }
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: '提现密码',
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text('S_COMPLETE', '完成'),
        funcBtnActive: this.checkFormData
      };
    },
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetGlobalMessage',
      'actionSetＭcenterBindMessage'
    ]),
    verification(key, index, blur = false) {
      let target = this.formData[key];
      let errorMsg = '';
      let correct_value = target.value[index]
        .replace(' ', '')
        .trim()
        .replace(/[^\d+]$/g, '');

      if (!blur) {
        if (target.value[index] === correct_value && correct_value !== '') {
          if (index < 3) {
            document.querySelector(`input[data-key="${key}_${index + 1}"]`).focus();
          }
        } else if (target.value[index] === correct_value && correct_value === '') {
          if (index > 0) {
            document.querySelector(`input[data-key="${key}_${index - 1}"]`).focus();
          }
        }
      }

      target.value[index] = correct_value

      if (target.value[index].length > 1) {
        target.value[index] = target.value[index].substring(0, 1);
      }

      if (this.memInfo.user.has_withdraw_password) {
        for (let i = 0; i < 4; i++) {
          if (!this.formData['old_withdraw_password'].value[i]) {
            this.checkFormData = false;
            return;
          }
        }
      }

      for (let i = 0; i < 4; i++) {
        if (!this.formData['new_withdraw_password'].value[i]) {
          this.checkFormData = false;
          return;
        }
      }

      this.checkFormData = true;
    },
    onInput(e, field, index) {
      this.$set(this[field], index, e.target.value);

      if (!/^[0-9]$/.test(this[field][index])) {
        this.$set(this[field], index, '');
      }
    },
    handleSubmit() {
      axios({
        method: 'put',
        url: '/api/v1/c/withdraw_password',
        data: {
          old_password: this.memInfo.user.has_withdraw_password ? this.formData['old_withdraw_password'].value.join('') : '',
          new_password: this.formData['new_withdraw_password'].value.join(''),
        }
      }).then(res => {
        localStorage.setItem('set-account-success', true);
        this.$router.push('/mobile/mcenter/accountData');
        this.$emit('success');
      }).catch(error => {
        this.tipMsg = `${error.response.data.msg}`;
      })
    },
  }
};
</script>
<style src="../../../css/index.module.scss" lang="scss" module>
