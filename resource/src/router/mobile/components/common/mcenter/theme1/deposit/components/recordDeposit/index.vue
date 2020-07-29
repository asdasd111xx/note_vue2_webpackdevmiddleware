<template>
  <div :class="$style['deposit-record-wrap']">
    <div class="clearfix">
      <div :class="$style['record-info-table']">
        <div :class="$style['record-info-theard']">
          <div :class="$style['record-info-tr']">
            <div
              v-for="(theadInfo, index) in recordHeader"
              :key="`record-thead-td-${index}`"
              :class="[$style['record-info-td'], theadInfo.className]"
            >
              {{ theadInfo.value }}
            </div>
          </div>
        </div>
        <div
          v-for="info in resultRecord"
          :key="`record-item-${info.order_number}`"
          :class="$style['record-info-tr']"
        >
          <div
            v-for="(theadInfo, index) in recordHeader"
            :key="`record-thead-td-${index}`"
            :class="[$style['record-info-td'], theadInfo.className]"
          >
            <div
              v-if="theadInfo.objKey === 'status'"
              :class="$style[`info-${info[theadInfo.objKey]}`]"
            >
              <span
                v-if="info[theadInfo.objKey] === 'submit_data'"
                @click="getDepositInfo(info.order_number)"
                >{{ getSerialValue(info, theadInfo.objKey) }}</span
              >
              <span v-else>{{ getSerialValue(info, theadInfo.objKey) }}</span>
            </div>
            <span v-else>{{ getSerialValue(info, theadInfo.objKey) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isShow" :class="$style['loading-wrap']">
      <div :class="$style['loading-item']">
        <ele-loading />
      </div>
    </div>
    <edit-deposit-field
      v-if="isDepositInfo && !isShow"
      :required-fields="requiredFields"
      :deposit-data="singleDeposit"
      :close-fuc="showDepositInfo"
    />
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        <div
          style="background-color: transparent ; margin: 0 ; padding: 0"
          v-html="msg"
        />
      </div>
    </message>
  </div>
</template>

<script>
import mixin from '@/mixins/mcenter/deposit/recordDeposit';
import message from '@/router/mobile/components/common/message';

export default {
  components: {
    message,
    eleLoading: () => import(/* webpackChunkName: 'eleLoading' */ '@/router/web/components/tpl/common/element/loading/circle'),
    editDepositField: () => import(/* webpackChunkName: 'editDepositField' */ './components/editDepositField')
  },
  mixins: [mixin],
  data() {
    return {
      isDepositInfo: false,
      msg: ''
    };
  },
  methods: {
    getDepositInfo(entryId) {
      this.getSingleInfo(entryId);
      this.showDepositInfo(true);
    },
    showDepositInfo(showView = '') {
      if (showView !== '') {
        this.isDepositInfo = showView;
        return;
      }

      this.isDepositInfo = !this.isDepositInfo;
    }
  }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
