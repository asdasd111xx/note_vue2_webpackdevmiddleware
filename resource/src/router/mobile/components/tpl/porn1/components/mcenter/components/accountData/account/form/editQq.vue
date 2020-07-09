<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
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
              :maxlength="30"
              type="text"
              @input="onInput"
            />
          </div>
        </div>
      </div>
      <service-tips />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import member from '@/api/member';
import mobileContainer from '../../../../../common/new/mobileContainer';
import mcenter from '@/api/mcenter';
import serviceTips from '../../serviceTips';

export default {
  components: {
    mobileContainer,
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

<style src="../../css/index.module.scss" lang="scss" module>
