<template>
  <div :class="$style['withdraw-wrap']">
    <div :class="$style['status-wrap']">
      <div
        :class="[$style.status, { [$style.active]: curStatus == 0 }]"
        @click="curStatus = 0"
      >
        {{ $text("S_APPLY", "已申请") }}
      </div>
      <div
        :class="[$style.status, { [$style.active]: curStatus == 1 }]"
        @click="curStatus = 1"
      >
        {{ $text("S_NOT_FINISH", "未完成") }}
      </div>
      <div
        :class="$style['active-slider']"
        :style="{
          left: `calc(calc(25% - 25px + 50% * ${curStatus}))`
        }"
      />
    </div>
    <div v-if="list" :class="$style['withdraw-content-wrap']">
      <div v-for="(item, index) in list" :class="$style['withdraw-block']">
        <div :class="[$style['withdraw-cell'], $style['item-status']]">
          <div :class="$style['title']">
            {{ $text("S_STATUS", "状态") }}
          </div>
          <div :class="$style['value']">
            {{ getStatus(item.status) }}
          </div>
        </div>
        <div :class="$style['item-status-border']" />
        <div v-for="(col, index) in columns" :class="$style['withdraw-cell']">
          <div :class="$style['title']">
            {{ item.hasOwnProperty(col.key) && $text(col.title) }}
          </div>
          <div :class="$style['value']">
            {{ item[col.key] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
      list: [],
      curStatus: 0,
      columns: [{ key: "at", title: "S_DATE" },
      { key: "id", title: "S_ORDER_NUMBER" },
      { key: "amount", title: "S_WITHDRAW_MONEY" },
      { key: "deduction", title: "S_DEDUCTION_MONEY" },
      { key: "real_amount", title: "S_REAL_WITHDRAW" }]
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

      let cid = getCookie('cid') ?
        getCookie('cid') :
        setCookie('cid', this.cid)
      if (!cid) return

      // RD7 BBOS API
      //   params['cid'] = this.cid || getCookie('cid');
      //   params['vendor'] = this.vendor || this.memInfo.user.domain
      //   console.log(params)

      ajax({
        method: 'get',
        url: API_WITHDRAW_RECORD,
        errorAlert: false,
        params: this.params
      }).then((res) => {
        if (res.result === 'ok') {
          this.list = res.ret;
          this.total = res.pagination.total;
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
    getStatus(status, color) {
      if (!status) {
        return "";
      }
      status = status.toLowerCase();

      switch (status) {
        case 'processing':
          return color ? true : this.$text('S_PROCESSING_TEXT', '处理中');
        case 'cancel':
          return color ? false : this.$text('S_CANCEL', '取消');
        case 'reject':
          return color ? false : this.$text('S_CANCEL_TEXT', '拒绝');
        default:
          return this.$text('S_CR_SUCCESS', '成功');
      }
    }
  },
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
