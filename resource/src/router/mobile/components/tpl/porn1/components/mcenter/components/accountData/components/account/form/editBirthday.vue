<template>
  <div :class="[$style['field-editer'], 'clearfix']">
    <div :class="$style['field-title']">{{ $text("S_BIRTHDAY_DATE") }}</div>
    <div :class="$style['input-wrap']">
      <div :class="[$style['field-value'], $style['date-field']]">
        <span
          :class="[$style['birthday-text'], { [$style['unset']]: !value }]"
          @click="handleClickText"
          >{{ dateFormat }}</span
        >
        <input
          id="birthday-input"
          ref="input"
          :class="$style['birthday-input']"
          v-model="value"
          type="date"
          placeholder=""
          @input="onInput"
        />
      </div>
      <div :class="$style['btn-wrap']">
        <span :class="$style['btn-cancel']" @click="$emit('cancel')">
          {{ $text("S_CANCEL", "取消") }}
        </span>
        <span :class="$style['btn-confirm']" @click="handleSubmit()">
          {{ $text("S_CONFIRM", "確認") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { format } from 'date-fns';
import datepickerLang from '@/lib/datepicker_lang';
import mcenter from '@/api/mcenter';
import { API_MCENTER_USER_CONFIG } from '@/config/api';
export default {
  components: {
  },
  data() {
    return {
      value: '',
      dateLang: datepickerLang(this.$i18n.locale),
      tipMsg: '',
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      webInfo: 'getWebInfo',
      systemTime: 'getSystemTime',
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_BIRTHDAY_DATE'),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text('S_COMPLETE', '完成'),
        funcBtnActive: !!(this.value)
      };
    },
    dateFormat() {
      if (this.value) {
        return Vue.moment(this.value).format('YYYY年MM月DD日')
      } else {
        // return '年 / 月 / 日';
        return '';
      }
    }
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetＭcenterBindMessage',
      'actionSetGlobalMessage'
    ]),
    handleClickText() {
      document.getElementById('birthday-input').click();
    },
    onInput(e) {
      this.tipMsg = '';
      this.value = e.target.value;
      if (this.value === '') {
        this.tipMsg = this.$text('S_CR_NUT_NULL');
      }

      const valueDate = new Date(this.value);
      const limit = new Date(Vue.moment(this.systemTime).add(-18, 'year'));
      if (valueDate > limit && this.firstInit) {
        this.actionSetGlobalMessage({ msg: '年龄未满十八岁,无法游戏' })
        this.value = '';
      }

      this.firstInit = true;
    },
    handleSubmit() {
      const valueDate = new Date(this.value);
      const limit = new Date(Vue.moment(this.systemTime).add(-18, 'year'));
      if (valueDate > limit) {
        this.actionSetGlobalMessage({ msg: '年龄未满十八岁,无法游戏' });
        this.value = '';
        return;
      }

      mcenter.accountDataSet({
        params: {
          birthday: Vue.moment(this.value).format()
        },
        success: () => {
          this.actionSetUserdata(true);
          this.$router.push('/mobile/mcenter/accountData');
          this.successMessage();
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.actionSetGlobalMessage({ msg: `${res.data.msg}` })
          }
        }
      });
    },
    successMessage() {
      this.actionSetＭcenterBindMessage({
        msg: this.$text('S_BIND_SUCCESSFULLY', '绑定成功'),
        msgIcon: true
      });
    }
  },
};

</script>
<style src="../../../css/index.module.scss" lang="scss" module />
