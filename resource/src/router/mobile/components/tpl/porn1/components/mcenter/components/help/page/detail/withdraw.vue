<template> </template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import ajax from '@/lib/ajax';
import bbosRequest from '@/lib/bbosRequest';
import { getCookie, setCookie } from '@/lib/cookie';

import { API_WITHDRAW_RECORD } from '@/config/api';
export default {
  components: {
  },
  props: {
    cid: {
      type: String,
      default: ''
    },
    vendor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      total: 0,
      list: []
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo'
    }),
  },
  methods: {
    getData() {
      let params = {
        first_result: 0,
        max_results: 10,
      }
      if (this.cid)
        setCookie('cid', this.cid);

      //   params['cid'] = this.cid || getCookie('cid');
      //   params['vendor'] = this.vendor || this.memInfo.user.domain
      //   console.log(params)

      ajax({
        method: 'get',
        url: API_WITHDRAW_RECORD,
        errorAlert: false,
        params: this.params
      }).then((res) => {
        console.log(res)
        if (res.result === 'ok') {
          this.recordData = res.ret;
          this.totalRecord = res.pagination.total;
        }
      });

      //   bbosRequest({
      //     method: 'post',
      //     url: this.siteConfig.BBOS_DOMIAN + '/Payment/Withdraw/List',
      //     reqHeaders: {
      //       'vendor': this.memInfo.user.domain
      //     },
      //     params: {
      //       ...params,
      //       "lang": "zh-cn",
      //     },
      //   }).then((res) => {
      //     console.log(res)
      //   });

    },
  },
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
