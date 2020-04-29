<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :is-app="isApp"
    :class="$style.container"
  >
    <div slot="content" :class="$style['setting-wrap']">
      <template v-if="type == 'withdraw'">
        <withdraw :cid="cid" :vendor="vendor" />
      </template>
      <template v-else>
        <deposit :cid="cid" :vendor="vendor" />
      </template>
    </div>
  </mobile-container>
</template>

<script>
import { API_WITHDRAW_RECORD } from '@/config/api';
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';
import deposit from './detail/deposit'
import member from '@/api/member';
import mobileContainer from '../../../../common/new/mobileContainer';
import withdraw from './detail/withdraw'

export default {
  components: {
    mobileContainer,
    deposit,
    withdraw
  },
  data() {
    return {
      type: 'withdraw' | 'deposit',
      cid: '',
      vendor: ''
    };
  },
  created() {
    let query = this.$route.query;
    if (['withdraw', 'deposit'].includes(query.type)) {
      this.type = query.type;
    } else {
      this.$router.push('/mobile/mcenter/help')
    }
    this.cid = query.cid || '';
    this.vendor = query.vendor || '';
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    isWithdraw() {
      return this.type ? this.type.toLocaleLowerCase() === 'withdraw' : false;
    },
    isApp() {
      let isApp = !!((this.$route.query && this.$route.query.app) || (this.$route.query && this.$route.query.APP))
      if (isApp && this.isWithdraw)
        document.title = this.$text("S_RECENTLY_WITHDRAW", "近10笔提现纪录")
      else if (isApp && !this.isWithdraw) {
        document.title = this.$text("S_RECENTLY_DEPOSIT", "8日内充值记录")
      }
      return isApp
    },
    headerConfig() {
      let title = this.isWithdraw ? this.$text("S_RECENTLY_WITHDRAW", "近10笔提现纪录") : this.$text("S_RECENTLY_DEPOSIT", "近10笔充值纪录");
      if (!this.isApp) {
        return {
          prev: true,
          onClick: () => { this.$router.back(); },
          title: title,
        };
      }
    },
  }
};
</script>

<style src="../css/index.module.scss" lang="scss" module>
