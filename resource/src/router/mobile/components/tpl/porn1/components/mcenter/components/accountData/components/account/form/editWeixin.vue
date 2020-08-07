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
        <div :class="$style.title">{{ $text("WECHAT") }}</div>
        <div :class="$style['input-wrap']">
          <input
            ref="input"
            :value="value"
            :placeholder="$text('WECHAT')"
            :class="$style.input"
            :maxlength="30"
            type="text"
            @input="onInput"
          />
        </div>
      </div>
    </div>
    <service-tips />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import member from '@/api/member';
import mcenter from '@/api/mcenter';
import serviceTips from '../../serviceTips';
import accountHeader from '../../accountHeader';

export default {
  components: {
    accountHeader,
    serviceTips
  },
  data() {
    return {
      value: '',
      tipMsg: '',
    };
  },
  mounted() {
    this.$refs.input.focus()
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
        title: this.$text('WECHAT'),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text('S_COMPLETE', '完成'),
        funcBtnActive: !!(this.value) && !this.tipMsg
      };
    }
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetＭcenterBindMessage'
    ]),
    onInput(e) {
      this.tipMsg = '';
      this.value = e.target.value;
      if (this.value === '') {
        this.tipMsg = this.$text('S_CR_NUT_NULL');
      }
    },
    handleSubmit() {
      if (this.tipMsg) {
        return;
      }

      mcenter.accountDataSet({
        params: {
          weixin: this.value
        },
        success: () => {
          this.actionSetUserdata(true);
          this.$router.push('/mobile/mcenter/accountData');
          this.successMessage();
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.tipMsg = `${res.data.msg}`;
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
  }
};
</script>
<style src="../../../css/index.module.scss" lang="scss" module>
