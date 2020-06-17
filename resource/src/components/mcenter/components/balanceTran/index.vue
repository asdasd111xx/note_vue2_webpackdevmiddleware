<template>
  <div>
    <slot
      :balanceTran="scopeData"
      :enableAutotransfer="enableAutotransfer"
      :closeAutotransfer="closeAutotransfer"
      :getBalanceAll="getBalanceAll"
      :balanceBack="balanceBack"
      :setTranOut="setTranOut"
      :setTranIn="setTranIn"
      :setMoney="setMoney"
      :balanceTransfer="balanceTran"
      :getDefaultTran="getDefaultTran"
    >
      <div class="bank-balance-tran">
        <h1>{{ $t("S_TRAN_BALANCE") }}</h1>
        <div class="main-radio-wrap clearfix">
          <div class="main-radio">
            <input
              id="auto-transfer"
              :checked="isAutotransfer === true"
              type="radio"
              name="transfer-type"
              @click="enableAutotransfer()"
            />{{ $t("S_AUTO_TRANSFER") }}
            <label for="auto-transfer">
              <span class="radio-style" />
            </label>
          </div>
          <div class="main-radio">
            <input
              id="manual-transfer"
              :checked="isAutotransfer === false"
              type="radio"
              name="transfer-type"
              @click="closeAutotransfer()"
            />{{ $t("S_MANUAL_TRANSFER") }}
            <label for="manual-transfer">
              <span class="radio-style" />
            </label>
          </div>
        </div>
        <div class="balance-detail-inner">
          <div class="balance-total-price clearfix">
            {{ $t("S_TOTAL_BALANCE") }}：
            <span class="price">{{ membalance.total }}</span>
            <span
              :class="`icon-refresh ${balanceLock ? 'disable' : ''}`"
              @click="getBalanceAll('lockStatus')"
            >
              <icon name="sync" width="12" />
            </span>
            <div
              :class="
                `main-btn btn-back-account ${balanceBackLock ? 'disable' : ''}`
              "
              @click="balanceBack()"
            >
              {{ balanceBackLock ? "" : $t("S_ONE_CLICK_TO_ACCOUNT") }}
            </div>
          </div>
          <div class="main-account-price">
            {{ $t("S_MAIN_BALANCE") }}：
            <span class="price">{{
              membalance.vendor.default ? membalance.vendor.default.amount : ""
            }}</span>
          </div>

          <div class="main-balance-inner">
            <!-- 僅在手動自動轉換才有額度轉換的步驟 -->
            <div v-if="!isAutotransfer" class="manual-transfer-setting-inner">
              <div class="balance-field-wrap clearfix">
                <div class="balance-field">
                  <label>{{ $t("S_TRANS_OUT") }}</label>
                  <input v-show="false" v-model="tranOut" name="tranOut" />
                  <model-select
                    v-model="tranOut"
                    :options="transOut"
                    :placeholder="$t('S_SELECT_ACCOUNT')"
                  />
                </div>
                <div class="balance-field middle">
                  <label>{{ $t("S_TRANS_IN") }}</label>
                  <input v-show="false" v-model="tranIn" name="tranIn" />
                  <model-select
                    v-model="tranIn"
                    :options="transIn"
                    :placeholder="$t('S_SELECT_ACCOUNT')"
                  />
                </div>
                <div class="balance-field money">
                  <label>{{ $t("S_GOLD2") }}</label>
                  <input v-model="money" type="text" class="main-input money" />
                </div>
                <div
                  :class="`main-btn tran-btn ${btnLock ? 'lock' : ''}`"
                  @click="balanceTran()"
                >
                  {{ $t("S_CONFIRM_TRANS_BALANCE") }}
                </div>
              </div>
            </div>
            <div class="balance-field-wrap clearfix">
              <div
                v-for="(item, key, index) in balanceInfo"
                :key="index"
                :class="[
                  'balance-info',
                  { right: index % 2 === 1 },
                  'clearfix'
                ]"
              >
                <span class="balance-info-text">
                  <span
                    v-if="key === recentlyData.vendor && isAutotransfer"
                    class="balance-recently-opened"
                    >*</span
                  >
                  {{ item.text }}
                </span>
                <span class="balance-info-money">{{ item.amount }}</span>
                <span
                  v-if="item.maintain"
                  class="balance-info-maintain tooltip"
                >
                  ({{ $t("S_MAINTAIN") }})
                  <span class="tooltiptext">
                    {{ $t("S_TIME_OF_EAST_US") }}：<br />
                    {{ item.maintain.etc_start_at }} -
                    {{ item.maintain.etc_end_at }}<br />
                    {{ $t("S_TIME_OF_BEIJING") }}：<br />
                    {{ item.maintain.start_at }} - {{ item.maintain.end_at }}
                  </span>
                </span>
              </div>
            </div>
            <p
              v-if="
                recentlyData.vendor &&
                  recentlyData.vendor != '--' &&
                  isAutotransfer
              "
              class="balance-recently-opened-notice"
            >
              {{ $t("S_FINALLY_OPENED_PLATFORM") }}
            </p>
          </div>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-if="isAutotransfer" class="tip-text clear">
          {{ $t("S_TIPS") }}: <br />
          <span v-html="tipText" />
        </p>
      </div>
    </slot>
    <message v-if="msg" @close="clearMsg">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
    <confirm
      v-if="showIntegerBackConfirm"
      @confirm="confirmIntegerBack"
      @cancel="showIntegerBackConfirm = false"
    >
      <div slot="msg">
        {{ $t("S_INTEGER_BACK_ACCOUNT_CONFIRM") }}
      </div>
    </confirm>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { ModelSelect } from 'vue-search-select';
import mcenter from '@/api/mcenter';
import ajax from '@/lib/ajax';
import message from '@/router/mobile/components/tpl/porn1/components/common/new/message';
import confirm from '@/router/mobile/components/tpl/porn1/components/common/new/confirm';
import { getCookie } from '@/lib/cookie';
import axios from 'axios';
export default {
  components: {
    ModelSelect,
    message,
    confirm
  },
  data() {
    return {
      msg: '',
      balanceLock: true,
      btnLock: false,
      balanceBackLock: false,
      timer: null,
      lockSec: 0,
      tranOut: '',
      tranIn: '',
      money: '',
      balanceList: {},
      total: 0,
      isAutotransfer: '',
      AutotransferLock: false,
      recentlyData: {},
      tranOutList: {},
      getDefaultTran: {
        out: '',
        in: ''
      },
      showIntegerBackConfirm: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      membalance: 'getMemBalance',
      siteConfig: 'getSiteConfig'
    }),
    /**
     * 組轉出列表
     *
     * @return array
     */
    transOut() {
      const list = [{ value: '', text: this.$t('S_SELECT_ACCOUNT') }];
      // 轉出列表只塞有額度的平台（額度需>=1，只有小數位不允許轉）
      // 維護時不可轉出
      Object.keys(this.membalance.vendor).forEach((index) => {
        if (this.membalance.vendor[index].amount !== '--'
          && +this.membalance.vendor[index].amount >= 1
          && !this.membalance.vendor[index].maintain
        ) {
          const text = index === 'default' ? '中心钱包' : this.membalance.vendor[index].text;
          list.push({ value: index, text });
        }
      });
      return list;
    },
    /**
     * 組轉入列表
     *
     * @return array
     */
    transIn() {
      const list = [{ value: '', text: this.$t('S_SELECT_ACCOUNT') }];
      // 維護時不可轉入
      Object.keys(this.membalance.vendor).forEach((index) => {
        if (!this.membalance.vendor[index].maintain) {
          const text = index === 'default' ? '中心钱包' : this.membalance.vendor[index].text;
          list.push({ value: index, text });
        }
      });
      return list;
    },
    balanceInfo() {
      const data = {};

      Object.keys(this.membalance.vendor).forEach((key) => {
        if (key === 'default') {
          return;
        }

        data[key] = this.membalance.vendor[key];
      });

      return data;
    },
    firstThirdBalanceInfo() {
      const data = {};
      Object.keys(this.membalance.vendor).slice(0, 4).forEach((key) => {
        if (key === 'default') {
          return;
        }

        data[key] = this.membalance.vendor[key];
      });

      return data;
    },
    tipText() {
      return this.$text('S_AUTO_SWITCH', {
        text: '切换为【自动转换】模式重新开启游戏平台，系统会自动将主帐户余额转入正在进行中的游戏 (包含新入款成功)。',
        replace: [
          { target: '%s', value: '<br/>' },
          { target: '%s', value: '<br/>' }
        ]
      });
    },
    scopeData() {
      return {
        // data
        balanceLock: this.balanceLock,
        btnLock: this.btnLock,
        balanceBackLock: this.balanceBackLock,
        timer: this.timer,
        lockSec: this.lockSec,
        tranOut: this.tranOut,
        tranIn: this.tranIn,
        money: this.money,
        balanceList: this.balanceList,
        total: this.total,
        isAutotransfer: this.isAutotransfer,
        AutotransferLock: this.AutotransferLock,
        recentlyData: this.recentlyData,
        tranOutList: this.tranOutList,
        // getter
        memInfo: this.memInfo,
        membalance: this.membalance,
        // computed
        transOut: this.transOut,
        transIn: this.transIn,
        balanceInfo: this.balanceInfo,
        firstThirdBalanceInfo: this.firstThirdBalanceInfo
      };
    }
  },
  created() {
    this.actionSetIsLoading(true);
    const params = [this.getBalanceAll(), this.getRecentlyOpened(), this.setDefaultTran()];
    Promise.all(params).then(() => {
      this.actionSetIsLoading(false);
    });

    this.isAutotransfer = this.memInfo.auto_transfer.enable;
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions([
      'actionSetUserBalance',
      'actionSetUserdata',
      'actionSetIsLoading'
    ]),
    enableAutotransfer() {
      if (this.isAutotransfer || this.AutotransferLock) {
        return;
      }
      this.AutotransferLock = true;
      mcenter.balanceTranAutoEnable({
        success: () => {
          this.msg = '切换成功';
          // alert(this.$t('S_SWITCH_AUTO_TRANSFER'));
          this.isAutotransfer = true;
          this.backAccount({}, true);
          this.actionSetUserdata(true);

          this.AutotransferLock = false;
        },
        fail: () => {
          this.AutotransferLock = false;
        }
      });

      this.getRecentlyOpened();
    },
    closeAutotransfer() {
      if (!this.isAutotransfer || this.AutotransferLock) {
        return;
      }
      this.AutotransferLock = true;
      mcenter.balanceTranAutoClose({
        success: () => {
          this.msg = '切换成功';
          this.isAutotransfer = false;
          this.actionSetUserdata(true);

          this.AutotransferLock = false;
        },
        fail: () => {
          this.AutotransferLock = false;
        }
      });
    },
    getBalanceAll(status) {
      if (status === 'lockStatus' && this.balanceLock) {
        return;
      }

      this.balanceLock = true;
      this.actionSetUserBalance().then(() => {
        this.timer = setInterval(() => {
          if (this.lockSec >= 15) {
            clearInterval(this.timer);
            this.lockSec = 0;
            this.balanceLock = false;
            return;
          }
          this.lockSec += 1;
        }, 1000);
      });
    },
    balanceBack({ afterSetUserBalance } = {}) {
      this.showIntegerBackConfirm = true;
      // 阻擋連續點擊
      if (this.balanceBackLock) {
        return;
      }
    },
    confirmIntegerBack() {
      this.showIntegerBackConfirm = false;
      this.backAccount();
    },
    backAccount({ afterSetUserBalance } = {}, fromAuto) {
      mcenter.balanceTranBack({
        success: () => {
          this.lockSec = 0;
          this.actionSetUserBalance()
            .then(() => {
              if (!fromAuto) {
                this.msg = '回收成功'
              }
              this.tranOut = '';
              if (afterSetUserBalance) {
                afterSetUserBalance();
              }
            });
          this.balanceBackLock = false;
        },
        fail: (res) => {
          this.msg = res.data.msg || '系统错误';
          this.balanceBackLock = false;
        }
      });
    },
    checkBankCard() {
      return axios({
        method: 'get',
        url: `${this.siteConfig.YABO_API_DOMAIN}/AccountBank/GetBankBindingStatusTrans/${getCookie('cid')}`,
        headers: {
          'AuthToken': 'YaboAPIforDev0nly',
          'x-domain': this.memInfo.user.domain
        }
      }).then((res) => {
        return res.data && res.data.data
      });
    },
    clearMsg() {
      if (this.msg.includes('银行卡')) {
        this.$router.push('/mobile/mcenter/bankCard?redirect=balanceTrans');
      }

      this.msg = '';
    },
    balanceTran({ customSucessAlert } = {}) {
      // 阻擋連續點擊
      if (this.btnLock) {
        return;
      }

      this.btnLock = true;

      this.checkBankCard().then((res) => {
        if (!res) {
          this.msg = '请先绑定提现银行卡';
          return;
        }
        const re = /^[1-9]*[1-9][0-9]*$/;
        const source = this.tranOut;
        const target = this.tranIn;
        const { money } = this;

        if (+source === 0 || +target === 0) {
          this.msg = this.$t('S_SELECT_ACCOUNT');
          // alert(this.$t('S_SELECT_ACCOUNT'));
          return;
        }
        if (money === '') {
          this.msg = this.$t('S_AMOUNT_NULL_VALUE');
          // alert(this.$t('S_AMOUNT_NULL_VALUE'));
          return;
        }
        if (!re.test(money)) {
          this.msg = this.$t('S_DAW_ONLY_INT');
          // alert(this.$t('S_DAW_ONLY_INT'));
          return;
        }

        mcenter.balanceTran({
          params: {
            amount: money
          },
          success: () => {
            if (customSucessAlert) {
              customSucessAlert();
            }
            if (!customSucessAlert) {
              this.msg = this.$t('S_CR_SUCCESS');
              // alert(this.$t('S_CR_SUCCESS'));
            }

            this.lockSec = 0;
            this.balanceBackLock = false;
            this.actionSetUserBalance();

            this.tranIn = 0;
            this.tranOut = 0;
            this.money = '';
            this.getDefaultTran.out = '';
            this.getDefaultTran.in = '';

            this.btnLock = false;
          },
          fail: () => {
            this.btnLock = false;
          }
        }, source, target);
      });
    },
    getRecentlyOpened() {
      mcenter.lastVendor({
        success: (response) => {
          this.recentlyData = response.ret;
        }
      });
    },
    /**
     * 設定轉出對象
     * @param {String} vendor
     */
    setTranOut(vendor) {
      this.tranOut = vendor;
    },
    /**
     * 設定轉入對象
     * @param {String} vendor
     */
    setTranIn(vendor) {
      this.tranIn = vendor;
    },
    /**
     * 設定轉入金額
     * @param {Number} money
     */
    setMoney(money) {
      this.money = money;
    },
    setDefaultTran() {
      const tranIndx = this.scopeData.transOut.length < 2 ? 0 : 1;
      const transInIndex = this.scopeData.transIn.length < 3 ? 0 : 2;

      this.getDefaultTran = {
        out: this.scopeData.transOut[tranIndx].value,
        in: this.scopeData.transIn[transInIndex].value
      };

      if (this.siteConfig.MOBILE_WEB_TPL === 'porn1') {
        this.tranOut = this.getDefaultTran.out;
        this.tranIn = this.getDefaultTran.in;
      }
    }
  }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
