<template>
  <div>
    <div :class="$style['menu-wrap']">
      <div
        :class="[
          $style['menu-select-game'],
          { [$style.active]: selectMenu === 'game' }
        ]"
        @click="selectMenu = selectMenu === 'game' ? '' : 'game'"
      >
        <span>{{ selectType.name }}</span>
      </div>

      <div
        :class="[
          $style['menu-select-time'],
          { [$style.custom]: isCustomTime },
          { [$style.active]: selectMenu === 'time' }
        ]"
        @click="selectMenu = selectMenu === 'time' ? '' : 'time'"
      >
        <div v-if="isCustomTime" :class="$style['select-custom']">
          <p>{{ selectTime.split(" ")[0] }}</p>
          <p>{{ selectTime.split(" ")[1] }}</p>
        </div>
        <span v-else>{{ selectTime }}</span>
      </div>
      <ul
        v-if="selectMenu === 'game'"
        :class="[$style['dropdown-wrap'], 'clearfix']"
      >
        <li
          v-for="(item, index) in options"
          :key="`options-${index}`"
          :class="{ [$style.active]: item.key === selectType.key }"
          @click="getLabel(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <div v-if="selectMenu === 'time'" :class="$style['search-tips']">
        当前系统支持查询最近30日的投注纪录
      </div>
      <div
        v-if="selectMenu === 'time'"
        :class="[
          $style['dropdown-wrap'],
          $style['dropdown-wrap-time'],
          'clearfix'
        ]"
      >
        <ul
          :class="[
            { [$style['default-active']]: !isShowDatePicker },
            'clearfix'
          ]"
        >
          <li
            v-for="(time, key) in allTotalData"
            :key="`date-${key}`"
            :class="{ [$style.active]: currentSelectTime === time.text }"
            @click="getTimeRecord(time)"
          >
            {{ time.text }}
          </li>
        </ul>
        <template v-if="isShowDatePicker">
          <div :class="$style['custom-wrap']">
            <div
              :class="[$style['custom-date'], 'clearfix']"
              @click="
                currentCustomDate = currentCustomDate === 'start' ? '' : 'start'
              "
            >
              <p :class="$style['custom-title']">
                {{ $text("S_START_DATE", "开始日期") }}
              </p>
              <p :class="$style['custom-time']">{{ startTime }}</p>
            </div>
            <date-picker
              v-if="currentCustomDate === 'start'"
              :key="`date${currentCustomDate}`"
              :min-limit.sync="limitDate"
              :max-limit.sync="estToday"
              :date.sync="setStartTime"
            />
            <div
              :class="[$style['custom-date'], 'clearfix']"
              @click="
                currentCustomDate = currentCustomDate === 'end' ? '' : 'end'
              "
            >
              <p :class="$style['custom-title']">
                {{ $text("S_END_DATE", "结束日期") }}
              </p>
              <p :class="$style['custom-time']">{{ endTime }}</p>
            </div>
            <date-picker
              v-if="currentCustomDate === 'end'"
              :key="`date${currentCustomDate}`"
              :min-limit.sync="limitDate"
              :max-limit.sync="estToday"
              :date.sync="setEndTime"
            />
          </div>
          <div :class="[$style['time-button-group'], 'clearfix']">
            <div :class="$style['time-cancel']" @click="cancelCustomTime">
              {{ $text("S_CANCEL", "取消") }}
            </div>
            <div :class="$style['time-confirm']" @click="setCustomTime">
              {{ $text("S_CONFIRM_2", "确定") }}
            </div>
          </div>
        </template>
        <div
          v-if="setStartTime.valueOf() > setEndTime.valueOf()"
          :class="[$style['date-tip']]"
        >
          开始日期不能大于结束日期
        </div>
      </div>
      <div
        v-if="selectMenu !== ''"
        :class="$style['dropdown-mask']"
        @click="selectMenu = ''"
      />
    </div>
    <template v-if="!isLoading">
      <template v-if="mainListData.length > 0">
        <div :class="$style['total-wrap']">
          <div>首存金额: {{ mainTotal.amount }}</div>
          <div>礼金: {{ mainTotal.total_invite_gift }}</div>
        </div>
        <div :class="$style['info-list']">
          <div
            v-for="info in mainListData"
            :key="info.upper_id"
            :class="$style['info-item']"
          >
            <div :class="$style['item-header']">
              <div :class="$style['friend-name']">
                {{ info.username }}
              </div>
              <div>礼金: {{ info.total_invite_gift }}</div>
            </div>
            <div :class="$style['item-content']">
              <div :class="$style['item-detail']">
                <div :class="$style['item-detail-title']">
                  注册时间
                </div>
                <div :class="$style['item-detail-result']">
                  {{ info.user_created_at }}
                </div>
              </div>
              <div :class="$style['item-detail']">
                <div :class="$style['item-detail-title']">
                  首存金额
                </div>
                <div :class="$style['item-detail-result']">
                  {{ info.amount }}
                </div>
              </div>
              <div :class="$style['item-detail']">
                <div :class="$style['item-detail-title']">
                  推荐礼金
                </div>
                <div :class="$style['item-detail-result']">
                  {{ info.deposit_gift }}
                </div>
              </div>
              <div
                v-if="parseFloat(info.invite_gift) > 0"
                :class="$style['item-detail']"
              >
                <div :class="$style['item-detail-title']">
                  推荐人奖励
                </div>
                <div :class="$style['item-detail-result']">
                  {{ info.invite_gift }}
                </div>
              </div>
              <div :class="$style['item-detail']">
                <div :class="$style['item-detail-title']">
                  审核状态
                </div>
                <div :class="$style['item-detail-result']">
                  {{ getStatus(info) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else :class="$style['no-data-wrap']">
        <img
          :src="
            $getCdnPath('/static/image/_new/mcenter/moneyDetail/no_data.png')
          "
        />
        <div :class="$style.tips">还没有任何记录</div>
        <div
          :class="$style['btn-money']"
          @click="$router.push('/mobile/mcenter/makeMoney')"
        >
          一键快赚
        </div>
      </div>
    </template>
    <infinite-loading
      v-if="showInfinite"
      ref="infiniteLoading"
      @infinite="infiniteHandler"
    >
      <span slot="no-more" />
      <span slot="no-results" />
    </infinite-loading>
  </div>
</template>

<script>
import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';
import EST from '@/lib/EST';
import ajax from '@/lib/ajax';
import datePicker from '@/router/mobile/components/common/datePicker';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    datePicker,
    InfiniteLoading
  },
  props: {
    setTabState: {
      type: Function,
      required: true
    },
    setHeaderTitle: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      hasFooter: false,
      options: [
        {
          name: '全部',
          key: 'all',
          status: 0
        },
        {
          name: '已派发',
          key: 'dispatch',
          status: 1
        },
        {
          name: '已撤销',
          key: 'revoked',
          status: 2
        },
        {
          name: '资格不符',
          key: 'allow',
          status: 3
        }
      ],
      selectMenu: '',
      selectType: { name: '全部', key: 'all', status: 0 },
      isCustomTime: false,
      currentSelectTime: this.$t('S_TODDAY'),
      selectTime: this.$t('S_TODDAY'),
      estToday: EST(new Date(), '', true),
      limitDate: '',
      startTime: '',
      endTime: '',
      mainListData: [],
      mainTotal: {},
      mainNoData: true,
      currentCustomDate: '',
      isShowDatePicker: false,
      allTotalData: [
        {
          text: this.$text('S_TODDAY', '今日'),
          name: 'today',
          value: 0
        },
        {
          text: this.$text('S_YESTERDAY', '昨日'),
          name: 'yesterday',
          value: 1
        },
        {
          text: this.$text('S_SEVEN_DAY', '近7日'),
          name: 'week',
          value: 7
        },
        {
          text: this.$text('S_THIRTY_DAY', '近30日'),
          name: 'month',
          value: 29
        },
        {
          text: this.$text('S_CUSTOM_DATE', '自定义'),
          name: 'custom',
          value: 29
        }
      ],
      pagination: {},
      isLoading: false,
      isReceive: false,
      showInfinite: false,
      maxResults: 10, // 一頁顯示幾筆
      showPage: 0 // 顯示幾頁
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
    }),
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    setStartTime: {
      get() {
        return new Date(this.startTime);
      },
      set(value) {
        this.startTime = Vue.moment(value).format('YYYY-MM-DD');
      }
    },
    setEndTime: {
      get() {
        return new Date(this.endTime);
      },
      set(value) {
        this.endTime = Vue.moment(value).format('YYYY-MM-DD');
      }
    },
    showData() {
      if (this.mainData.length === 0) {
        return false;
      }
      return this.mainData.some((item) => this.controlData.some((data) => item.day === data.day));
    }
  },
  watch: {
    selectMenu() {
      document.querySelector('#mobile-wrap').style = this.selectMenu ? 'overflow: hidden' : '';
    }
  },
  created() {
    this.startTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
    this.endTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
    this.limitDate = new Date(Vue.moment(this.estToday).add(-29, 'days').format('YYYY-MM-DD'));
    this.isLoading = true;
    this.getGiftList();
  },
  methods: {
    getStatus(info) {
      if (!info.allow) {
        return '资格不符';
      }

      if (info.revoked) {
        return '已撤销';
      }

      return '已派发';
    },
    getLabel(data) {
      this.selectMenu = '';
      this.selectType = data;
      this.showPage = 0;
      this.mainTotal = {};
      this.pagination = {};
      this.mainListData = [];
      this.isLoading = true;
      this.updateGame();
    },
    getTimeRecord(data) {
      this.currentSelectTime = data.text;

      this.startTime = Vue.moment(this.estToday).add(-data.value, 'days').format('YYYY-MM-DD');
      this.endTime = Vue.moment(this.estToday).format('YYYY-MM-DD');

      if (data.name === 'yesterday') {
        this.endTime = Vue.moment(this.estToday).add(-data.value, 'days').format('YYYY-MM-DD');
      }

      if (data.name === 'custom') {
        this.isShowDatePicker = true;
        return;
      }

      this.selectTime = data.text;
      this.isShowDatePicker = false;
      this.isCustomTime = false;
      this.selectMenu = '';
      this.showPage = 0;
      this.pagination = {};
      this.mainTotal = {};
      this.mainListData = [];
      this.isLoading = true;
      this.updateGame();
    },
    getGiftList() {
      const params = {
        dispatch_start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
        dispatch_end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00'),
        max_results: this.maxResults,
        first_result: this.maxResults * this.showPage
      };

      if (this.selectType.status > 0) {
        params.status = this.selectType.status;
      }

      this.startTime = Vue.moment(this.startTime).format('YYYY-MM-DD');
      this.endTime = Vue.moment(this.endTime).format('YYYY-MM-DD');

      return ajax({
        method: 'get',
        url: '/api/v1/c/festival/entry/list',
        params,
        success: (response) => {
          this.isLoading = false;
          if (response.ret.length === 0) {
            return;
          }

          this.mainListData.push(...response.ret);
          this.mainTotal = response.total;
          this.pagination = response.pagination;
          this.mainNoData = false;
        }
      });
    },
    updateGame() {
      this.showInfinite = false;

      this.mainNoData = true;

      this.$nextTick(() => {
        this.showInfinite = true;
      });
    },
    cancelCustomTime() {
      if (this.allTotalData.some((item) => item.text === this.selectTime)) {
        this.currentSelectTime = this.selectTime;
        this.isShowDatePicker = false;
      }

      this.selectMenu = '';
    },
    setCustomTime() {
      if (this.setStartTime > this.setEndTime) {
        return;
      }

      this.startTime = Vue.moment(this.setStartTime).format('YYYY-MM-DD');
      this.endTime = Vue.moment(this.setEndTime).format('YYYY-MM-DD');
      this.selectTime = `${this.startTime} ${this.endTime}`;
      this.isCustomTime = true;
      this.currentCustomDate = '';
      this.selectMenu = '';
      this.updateGame();
    },
    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state) {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;
      this.getGiftList().then(({ result }) => {
        this.isReceive = false;
        if (result !== 'ok') {
          return;
        }

        if (!this.pagination.total || this.mainListData.length === +this.pagination.total) {
          $state.complete();
          return;
        }

        this.showPage += 1;

        $state.loaded();
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
