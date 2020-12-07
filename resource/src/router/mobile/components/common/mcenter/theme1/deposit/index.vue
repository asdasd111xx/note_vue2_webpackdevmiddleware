<template>
  <div :class="$style['bank-deposit']">
    <bank-card-deposit
      v-if="nowTabCurrent === 'deposit'"
      :header-setting.sync="resultHeaderSetting"
      ref="bankCardDeposit"
    />
    <record-deposit v-if="nowTabCurrent === 'record'" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getCookie } from '@/lib/cookie';
import yaboRequest from '@/api/yaboRequest';

export default {
  components: {
    bankCardDeposit: () => import(/* webpackChunkName: 'bankCardDeposit' */'./components/bankCardDeposit'),
    recordDeposit: () => import(/* webpackChunkName: 'recordDeposit' */'./components/recordDeposit')
  },

  data() {
    return {
      tabCurrent: 'deposit',
      headerSetting: {
        title: this.$text('S_ONLINE_DEPOSIT', '线上存款'),
        leftBtns: {
          icon: 'arrow',
          onClick: () => {
            if (this.nowTabCurrent === 'deposit') {
              this.$router.push('/mobile/mcenter');
              return;
            }
            this.actionSetUserBalance();
            this.nowTabCurrent = 'deposit';
          }
        },
        balance: true,
        submitStatus: ""
      }
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      siteConfig: 'getSiteConfig',
      loginStatus: 'getLoginStatus',
    }),
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    nowTabCurrent: {
      get() {
        return this.tabCurrent;
      },
      set(val) {
        this.tabCurrent = val;
        if (val === 'record') {
          this.headerSetting = {
            title: this.$text('S_DEPOSIT_RECORD', '8日内存款纪录'),
            leftBtns: this.headerSetting.leftBtns,
            balance: true
          };
          return;
        }
        this.headerSetting = {
          title: this.$text('S_ONLINE_DEPOSIT', '线上存款'),
          leftBtns: this.headerSetting.leftBtns,
          rightBtns: {
            icon: 'regular/calendar-check',
            onClick: () => {
              this.actionSetUserBalance();
              this.nowTabCurrent = 'record';
            }
          }
        };
      }
    },
    resultHeaderSetting: {
      get() {
        return this.headerSetting;
      },
      set(value) {
        this.headerSetting = value;
      }
    }
  },
  created() {
    if (!this.loginStatus) {
      this.$router.push('/mobile/login');
    }

    this.isFastPay();
  },
  methods: {
    ...mapActions([
      'actionSetUserBalance'
    ]),
    isFastPay() {
      if (this.memInfo.config.deposit.includes('迅付')) {
        this.headerSetting = {
          title: this.headerSetting.title,
          leftBtns: this.headerSetting.leftBtns,
          rightBtns: {
            icon: 'regular/calendar-check',
            onClick: () => {
              this.actionSetUserBalance();
              this.nowTabCurrent = 'record';
            }
          }
        };
      }
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
