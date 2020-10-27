<template>
  <div
    :class="[
      $style['detail-wrap'],
      {
        [$style['ey1']]: theme === 'ey1',
      },
    ]"
  >
    <div v-if="data" :class="$style['detail-content-wrap']">
      <div v-for="(item, index) in data" :class="$style['detail-block']">
        <div :class="[$style['detail-cell'], $style['item-status']]">
          <div :class="[$style['title']]">
            {{ $text("S_STATUS", "状态") }}
          </div>

          <div :class="$style['value']">
            <div
              v-if="item.status === 'submit_data'"
              :class="$style['edit']"
              @click="openEdit(item)"
            >
              {{ $text("S_SUBMIT_WITHDRAW", "重新提交") }}
            </div>

            <div
              v-else
              @click="
                () => {
                  (item.status !== 'processing' && item.memo) ||
                  item.method_id === 25 ||
                  item.method_id === 402
                    ? showDetailPop(item)
                    : '';
                }
              "
              :class="[
                { [$style['processing']]: item.status === 'processing' },
              ]"
            >
              {{ getStatus(item.status) }}
            </div>

            <div
              v-if="
                (item.status !== 'processing' && item.memo) ||
                item.method_id === 25 ||
                item.method_id === 402
              "
              :class="$style['processing-icon']"
              @click="showDetailPop(item)"
            >
              <img :src="`/static/image/${theme}/mcenter/ic_remark.png`" />
            </div>
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
        <div :class="$style['tips-cell']">
          實際匯率:&nbsp;{{ detailRate && detailRate.crypto_rate }}
        </div>
        <div :class="$style['tips-cell']">
          入帳數量:&nbsp;{{ detailRate && detailRate.crypto_num }}
        </div>
        <div :class="$style['tips-content']" v-html="detailRate.memo" />
        <div :class="[$style['close']]" @click="detailRate = null">关闭</div>
      </div>
    </div>

    <edit-deposit-field
      v-if="editOpen"
      :required-fields="requiredFields"
      :depositData="singleDeposit"
      :close-fuc="
        () => {
          editOpen = false;
        }
      "
    />

    <div v-if="!data.length" :class="$style['no-data-wrap']">
      <img :src="$getCdnPath(`/static/image/${theme}/mcenter/no_data.png`)" />
      <div :class="$style['tips']">暂时没有新的充值记录</div>
      <div
        v-if="!isApp"
        :class="[
          $style['btn-deposit'],
          {
            [$style['ey1']]: theme === 'ey1',
          },
        ]"
        @click="$router.push('/mobile/mcenter/deposit')"
      >
        立即充值
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie } from '@/lib/cookie';
import { mapGetters, mapActions } from 'vuex';
import editDepositField from './editDepositField';
import member from '@/api/member';
import mixin from '@/mixins/mcenter/deposit/recordDeposit';
import axios from 'axios';

export default {
  mixins: [mixin],
  components: {
    editDepositField
  },
  props: {
    isApp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: [],
      detailRate: null,
      editOpen: false,
      isShowDepositInfo: false,
      columns: [
        // 日期
        { key: "created_at", title: "S_DATE" },
        // 单号
        { key: "order_number", title: "S_ORDER_NUMBER" },
        // 实际到账
        { key: "method_name", title: "S_DEPOSIT_METHOD" },
        // 申请金额
        { key: "amount", title: "S_APPLICATION_AMOUNT" },
        // 实际到账
        { key: "actual_deposit", title: "S_REAL_ENTER" },
      ],
    };
  },
  mounted() {
    this.getData();
    document.title = "8日内充值记录"
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
      siteConfig: "getSiteConfig",
    }),
    theme() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    showDetailPop(item) {
      this.detailRate = item;
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
        url: '/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/stat/list',
        errorAlert: false,
        params: params
      }).then((res) => {
        if (res && res.data && res.data.result === 'ok') {
          this.data = res.data.ret;
          this.total = res.data.pagination.total;
        }
      }).catch((error) => {
        this.actionSetGlobalMessage({ msg: error.response.data.msg, code: error.response.data.code });
      });
    },
    getStatus(status) {
      status = status.toLowerCase();

      switch (status) {
        case 'submit_data':
          return this.$text('S_SUBMIT_DEPOSIT', '提交资料');
        case 'cancel':
          return this.$text('S_CANCEL', '取消');
        case 'complete':
          return this.$text('S_CR_SUCCESS', '成功');
        default:
          return this.$text('S_PROCESSING_TEXT', '处理中');
      }
    },
    openEdit(info) {
      this.editOpen = true;
      this.getSingleInfo(info.order_number);
      this.getData();
    }
  },
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
