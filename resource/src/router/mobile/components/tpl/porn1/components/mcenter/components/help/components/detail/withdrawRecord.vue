<template>
  <div
    :class="[
      $style['detail-wrap'],
      {
        [$style['ey1']]: theme === 'ey1',
      },
    ]"
  >
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
    <div v-if="data" :class="$style['detail-content-wrap']">
      <div v-for="(item, index) in data" :class="$style['detail-block']">
        <div :class="[$style['detail-cell'], $style['item-status']]">
          <div :class="[$style['title']]">
            {{ $text("S_STATUS", "状态") }}
          </div>
          <div
            v-if="item.status !== 'processing' && item.memo"
            :class="$style['processing-icon']"
            @click="showDetailPop(item)"
          >
            <img :src="`/static/image/${theme}/mcenter/ic_remark.png`" />
          </div>
          <div
            v-if="!item.locked"
            :class="[$style['value'], $style['edit']]"
            :style="
              item.status !== 'processing' && item.memo ? { right: '24px' } : {}
            "
            @click="openEdit(item)"
          >
            {{ $text("S_SUBMIT_WITHDRAW", "重新提交") }}
          </div>
          <div
            v-else
            @click="
              () => {
                item.status !== 'processing' && item.memo
                  ? showDetailPop(item)
                  : '';
              }
            "
            :class="[
              $style['value'],
              { [$style['processing']]: item.status === 'processing' },
            ]"
            :style="
              item.status !== 'processing' && item.memo ? { right: '24px' } : {}
            "
          >
            {{ getStatus(item.status) }}
          </div>
        </div>
        <div :class="$style['item-status-border']" />
        <template v-for="(col, index) in columns">
          <div
            v-if="item.hasOwnProperty(col.key)"
            :class="$style['detail-cell']"
          >
            <div :class="$style['title']">
              {{ $text(col.title) }}
            </div>
            <div :class="$style['value']">
              {{ item[col.key] }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="detailRate" :class="$style['tips-wrap']">
      <div :class="$style['tips-mask']" @click="detailRate = null" />

      <div :class="$style['tips-block']">
        <div
          :class="$style['tips-content']"
          v-html="detailRate.memo.replace(/\n/gi, '<br/>')"
        />
        <!-- <div :class="$style['tips-cell']">
          實際匯率:&nbsp;{{ detailRate && detailRate.withdraw_rate }}
        </div>
        <div :class="$style['tips-cell']">
          入帳數量:&nbsp;{{ detailRate && detailRate.real_amount }}
        </div> -->
        <div :class="[$style['close']]" @click="detailRate = null">关闭</div>
      </div>
    </div>
    <edit-withdraw-field
      v-if="editOpen"
      :third-url.sync="thirdUrl"
      :withdraw-data="withdrawData"
      :close-fuc="() => (editOpen = false)"
    />

    <div v-if="!data.length" :class="$style['no-data-wrap']">
      <img :src="$getCdnPath(`/static/image/${theme}/mcenter/no_data.png`)" />
      <div v-if="curStatus === 0" :class="$style['tips']">
        暂时没有新的提现记录
      </div>
      <div v-else :class="$style['tips']">还没有任何记录</div>
    </div>
  </div>
</template>

<script>
import { getCookie } from '@/lib/cookie';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import editWithdrawField from './editWithdrawField'
import member from '@/api/member';

export default {
  components: {
    editWithdrawField
  },
  props: {
    isApp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      total: 0,
      data: [],
      detailRate: null,
      curStatus: 0,
      columns: [
        // 日期
        { key: "at", title: "S_DATE" },
        // 单号
        { key: "id", title: "S_ORDER_NUMBER" },
        // 提现金额
        { key: "amount", title: "S_WITHDRAW_MONEY" },
        // 扣除金额
        { key: "deduction", title: "S_DEDUCTION_MONEY" },
        // 实际到账
        { key: "real_amount", title: "S_REAL_WITHDRAW" },
        // 提现类型
        { key: "bank_name", title: "S_WITHDRAW_TYPE" }
      ],
      editOpen: false,
      withdrawData: {},
      thirdUrl: ''
    };
  },
  mounted() {
    this.getData();
    document.title = "近10笔提现记录";
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
      siteConfig: "getSiteConfig",
    }),
    theme() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    // isApp() {
    //   let isApp = !!((this.$route.query && this.$route.query.app) || (this.$route.query && this.$route.query.APP))
    //   return isApp
    // },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    showDetailPop(item) {
      // withdraw_rate
      this.detailRate = item;
    },
    filterStatus(status) {
      this.curStatus = status;

      // 已申請
      if (status == 0) {
        this.data = this.data.filter((info) => info.status === 'finished' || info.locked)
        return
      }

      // 未完成
      if (status == 1) {
        this.data = this.data.filter((info) => info.process && !info.locked)
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

      axios({
        method: 'get',
        url: '/api/payment/v1/c/withdraw/list',
        errorAlert: false,
        params: params
      }).then((res) => {
        if (res && res.data && res.data.result === 'ok') {
          this.data = res.data.ret;
          this.total = res.data.pagination.total;
          this.filterStatus();
        }
      }).catch((error) => {
        this.actionSetGlobalMessage({ msg: error.response.data.msg, code: error.response.data.code });
      });
    },
    getStatus(status) {
      status = status.toLowerCase();
      switch (status) {
        //   (處理中/processing、已完成/finished、已確認/confirm、已取消/cancel、已拒絕/reject)
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
