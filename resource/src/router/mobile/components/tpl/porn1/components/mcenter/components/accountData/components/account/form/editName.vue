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
      <div :class="$style.block">
        <div :class="$style.title">{{ $text("S_REAL_NAME") }}</div>
        <div :class="$style['input-wrap']">
          <input
            ref="input"
            v-model="value"
            :placeholder="$text('S_ENTER_REAL_NAME', '请输入您的真实姓名')"
            :class="$style.input"
            :maxlength="50"
            type="text"
            @input="onInput"
          />
          <div :class="$style['clear-input']" v-if="value">
            <img
              :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
              @click="value = ''"
            />
          </div>
        </div>
      </div>
    </div>
    <service-tips />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import ajax from '@/lib/ajax';
import member from '@/api/member';
import serviceTips from '../../serviceTips';
import mcenter from '@/api/mcenter';
import accountHeader from '../../accountHeader';

export default {
  components: {
    serviceTips,
    accountHeader
  },
  data() {
    return {
      value: '',
      tipMsg: '',
      info: {
        key: 'name',
        text: 'S_REAL_NAME',
        status: '',
        value: '',
        verification: true,
        isShow: true
      }
    };
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
        title: this.$text('S_REAL_NAME', '真实姓名'),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text('S_COMPLETE', '完成'),
        funcBtnActive: !!(this.value) && !this.tipMsg
      };
    }
  },
  created() {
    if (this.memInfo.user.name) {
      this.$router.push('/mobile/mcenter/accountData');
    }
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetＭcenterBindMessage',
      'actionVerificationFormData'
    ]),
    onInput(e) {
      this.tipMsg = '';
      this.actionVerificationFormData({ target: 'name', value: e.target.value }).then((val => {
        this.value = val
      }));
    },
    handleSubmit() {
      if (!this.value || !this.value.length > 0) {
        this.tipMsg = this.$t('S_CR_NUT_NULL');
        return;
      }

      const re = /^[^A-Za-z0-9\uFF10-\uFF19\uFF41-\uFF5A\uFF21-\uFF3A，:;！@#$%^&*?<>()+=`|[\]{}\\"/\s~\-_']*$/;
      //   const re = /[,:;!”@#$%^&*?<>()+=`|[\]{}\\"/~\-_'A-Za-z0-9\uFF10-\uFF19\uFF41-\uFF5A\uFF21-\uFF3A\uFF01-\uFF5E]/g;
      const msg = this.$text('S_NO_SYMBOL_DIGIT_CHEN', '请勿输入数字、空白及特殊符号');

      if (!re.test(this.value)) {
        this.tipMsg = msg;
        return;
      }

      mcenter.accountDataSet({
        params: {
          name: this.value.substring(0, 50)
        },
        success: () => {
          localStorage.setItem('set-account-success', true);
          this.$router.push('/mobile/mcenter/accountData');
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.tipMsg = `${res.data.msg}`;
          }
        }
      });
    },
  }
};
</script>
<style src="../../../css/index.module.scss" lang="scss" module>
