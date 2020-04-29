<template> </template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import ajax from '@/lib/ajax';
import { API_WITHDRAW_RECORD } from '@/config/api';
export default {
  components: {
  },
  data() {
    return {
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
  },
  methods: {
    getData() {
      let params = {
        first_result: 0,
        max_results: 10
      }

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
    },
  },
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
