<template>
  <div :class="$style['detail-wrap']">
    <!-- 狀態暫時移除 -->
    <!-- <div :class="$style['status-wrap']">
      <div
        :class="[$style.status, { [$style.active]: curStatus == 0 }]"
        @click="filterStatus(0)"
      >
        {{ $text("S_APPLY", "已申请") }}
      </div>
      <div
        :class="[$style.status, { [$style.active]: curStatus == 1 }]"
        @click="filterStatus(1)"
      >
        {{ $text("S_NOT_FINISH", "未完成") }}
      </div>
      <div
        :class="$style['active-slider']"
        :style="{
          left: `calc(calc(25% - 25px + 50% * ${curStatus}))`
        }"
      />
    </div> -->
    <div v-if="list" :class="$style['detail-content-wrap']">
      <div v-for="(item, index) in list" :class="$style['detail-block']">
        <div :class="[$style['detail-cell'], $style['item-status']]">
          <div :class="$style['title']">
            {{ $text("S_STATUS", "状态") }}
          </div>
          <div
            v-if="!item.locked"
            :class="[$style['value'], $style['edit']]"
            @click="openEdit(item)"
          >
            {{ $text("S_SUBMIT_WITHDRAW", "重新提交") }}
          </div>
          <div v-else="" :class="$style['value']">
            {{ getStatus(item.status) }}
          </div>
        </div>
        <div :class="$style['item-status-border']" />
        <div v-for="(col, index) in columns" :class="$style['detail-cell']">
          <div :class="$style['title']">
            {{ item.hasOwnProperty(col.key) && $text(col.title) }}
          </div>
          <div :class="$style['value']">
            {{ item[col.key] }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!list.length" :class="$style['no-data-wrap']">
      <img
        :src="$getCdnPath('/static/image/_new/mcenter/moneyDetail/no_data.png')"
      />
      <div v-if="curStatus === 0" :class="$style['tips']">
        暂时没有新的提现记录
      </div>
      <div v-else :class="$style['tips']">还没有任何记录</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import ajax from '@/lib/ajax';
import bbosRequest from "@/api/bbosRequest";
import { getCookie } from '@/lib/cookie';
import { API_WITHDRAW_RECORD } from '@/config/api';
export default {
  data() {
    return {
      total: 0,
      data: [],
      list: [],
      curStatus: 0,
      columns: [{ key: "at", title: "S_DATE" },
      { key: "id", title: "S_ORDER_NUMBER" },
      { key: "amount", title: "S_WITHDRAW_MONEY" },
      { key: "deduction", title: "S_DEDUCTION_MONEY" },
      { key: "real_amount", title: "S_REAL_WITHDRAW" }],

      editOpen: false,
      withdrawData: {},
      thirdUrl: ''
    };
  },
  mounted() {
    this.getData();
    document.title = "近10笔提现纪录";
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo'
    }),
    isApp() {
      let isApp = !!((this.$route.query && this.$route.query.app) || (this.$route.query && this.$route.query.APP))
      return isApp
    },
  },
  watch: {
    data() {
      this.filterStatus(this.curStatus)
    }
  },
  methods: {
    filterStatus(status) {
      this.curStatus = status;

      // 已申請
      if (status == 0) {
        this.list = this.data.filter((info) => info.status === 'finished' || info.locked)
        return
      }

      // 未完成
      if (status == 1) {
        this.list = this.data.filter((info) => info.process && !info.locked)
        return
      }
    },
    getData() {
      let params = {
        first_result: 0,
        max_results: 10,
      }

      let cid = getCookie('cid');
      if (!cid) return

      // RD7 BBOS API
      //   params['cid'] = this.cid || getCookie('cid');
      //   params['vendor'] = this.vendor || this.memInfo.user.domain
      //   console.log(params)

      ajax({
        method: 'get',
        url: API_WITHDRAW_RECORD,
        errorAlert: false,
        params: params
      }).then((res) => {
        if (res.result === 'ok') {
          this.data = res.ret;
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
    getStatus(status) {
      status = status.toLowerCase();
      switch (status) {
        case 'processing':
          return this.$text('S_PROCESSING_TEXT', '处理中');
        case 'cancel':
          return this.$text('S_CANCEL', '取消');
        case 'reject':
          return this.$text('S_CANCEL_TEXT', '拒绝');
        default:
          return this.$text('S_CR_SUCCESS', '成功');
      }
    },
    openEdit(info) {
      this.editOpen = true;
      this.withdrawData = info;
      this.getData();
    }
  },
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
