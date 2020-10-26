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
        <div :class="$style.title">{{ $text("S_QQ") }}</div>
        <div :class="$style['input-wrap']">
          <input
            ref="input"
            :value="value"
            :placeholder="$text('S_QQ')"
            :class="$style.input"
            :maxlength="20"
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
        title: this.$text('S_QQ'),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text('S_COMPLETE', '完成'),
        funcBtnActive: !!(this.value) && !this.tipMsg
      };
    }
  },
  created() {
    if (this.memInfo.user.qq_num) {
      this.$router.push('/mobile/mcenter/accountData');
    }
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetＭcenterBindMessage'
    ]),
    onInput(e) {
      e.target.value = e.target.value.replace(/[^0-9]/, '');
      this.tipMsg = '';
      this.value = e.target.value;
      if (this.value === '') {
        this.tipMsg = this.$text('S_CR_NUT_NULL');
      }

      if (!/^[0-9]+$/.test(this.value)) {
        this.tipMsg = this.$text('S_JM_AGENT_INPUT_NUMBER', '仅允许输入数字');
      }

    },
    handleSubmit() {
      if (this.tipMsg) {
        return;
      }

      mcenter.accountDataSet({
        params: {
          qq_num: this.value
        },
        success: () => {
          localStorage.setItem('set-account-success', true);
          this.$router.push('/mobile/mcenter/accountData');
          this.$emit('success');
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
