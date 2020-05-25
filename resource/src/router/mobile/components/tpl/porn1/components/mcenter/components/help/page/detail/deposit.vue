<template>
  <div :class="$style['detail-wrap']">
    <div v-if="recordData" :class="$style['detail-content-wrap']">
      <div v-for="(item, index) in recordData" :class="$style['detail-block']">
        <div :class="[$style['detail-cell'], $style['item-status']]">
          <div :class="$style['title']">
            {{ $text("S_STATUS", "状态") }}
          </div>
          <div
            v-if="item.status === 'submit_data'"
            :class="[$style['value'], $style['edit']]"
            @click="getDepositInfo(item.order_number)"
          >
            {{ $text("S_SUBMIT_DEPOSIT", "重新提交") }}
          </div>
          <div v-else="" :class="$style['value']">
            {{ getStatus(item.status) }}
          </div>
        </div>
        <div :class="$style['item-status-border']" />
        <div
          v-for="(col, index) in recordHeader"
          :class="$style['detail-cell']"
        >
          <div :class="$style['title']">
            {{ item.hasOwnProperty(col.objKey) && col.value }}
          </div>
          <div :class="$style['value']">
            {{ item[col.objKey] }}
          </div>
        </div>
      </div>
    </div>

    <edit-deposit-field
      v-if="isShowDepositInfo"
      :required-fields="requiredFields"
      :deposit-data="singleDeposit"
      :close-fuc="showDepositInfo"
    />

    <div v-if="!recordData.length" :class="$style['no-data-wrap']">
      <img :src="$getCdnPath('/static/image/_new/mcenter/moneyDetail/no_data.png')" />
      <div :class="$style['tips']">暂时没有新的充值记录</div>
      <div :class="$style['btn-deposit']" @click="$router.push('/mobile/mcenter/deposit')">
        立即充值
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import ajax from '@/lib/ajax';
import { getCookie } from '@/lib/cookie';
import mixin from '@/mixins/mcenter/deposit/recordDeposit';
import editDepositField from './editDepositField'
export default {
  mixins: [mixin],
  components: {
    editDepositField
  },
  data() {
    return {
      editOpen: false,
      depositData: {},
      isShowDepositInfo: false
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
    getDepositInfo(entryId) {
      this.getSingleInfo(entryId);
      this.showDepositInfo();
    },
    getData() {
      let params = {
        first_result: 0,
        max_results: 10,
      }

      let cid = getCookie('cid');
      if (!cid) return

      this.getRecordData();
    },
    getStatus(status, color) {
      if (!status) {
        return "";
      }
      status = status.toLowerCase();

      switch (status) {
        case 'submit_data':
          return this.$text('S_SUBMIT_DEPOSIT', '提交资料');
        case 'cancel':
          return this.$text('S_CANCEL_TEXT', '拒绝');
        case 'complete':
          return this.$text('S_CR_SUCCESS', '成功');
        default:
          return this.$text('S_PROCESSING_TEXT', '处理中');
      }
    },
    showDepositInfo() {
      this.isShowDepositInfo = !this.isShowDepositInfo;
      this.editOpen = true;
      this.getData();
    }
  },
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
