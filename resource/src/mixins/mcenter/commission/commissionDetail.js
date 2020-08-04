import { format } from 'date-fns';
import ajax from '@/lib/ajax';
import { API_COMMISSION_LEVEL_LIST, API_COMMISSION_FIRST_LEVEL_LIST } from '@/config/api';

export default {
  props: {
    currentInfo: {
      type: Object | null,
      required: true
    }
  },
  data() {
    return {
      sort: '',
      order: '',
      levelTrans: {
        1: this.$text('S_FIRST_LEVEL_FRIEND', '一级好友'),
        2: this.$text('S_SECOND_LEVEL_FRIEND', '二级好友'),
        3: this.$text('S_THIRD_LEVEL_FRIEND', '三级好友'),
        4: this.$text('S_FOURTH_LEVEL_FRIEND', '四级好友'),
        5: this.$text('S_FIFTH_LEVEL_FRIEND', '五级好友')
      },
      detailList: null, // 第三方返利資料
      summaryList: [], // 本站返利各級好友資料
      summaryTotal: null, // 本站返利所有好友統計
      friendsList: [], // 本站返利一級好友資料
      pageTotal: null,
      allTotal: null,
      isLoading: false,
      showInfinite: true,
      maxResults: 10, // 每頁限制筆數
      showPage: 0
    };
  },
  computed: {
    controlData() {
      return this.friendsList.filter((item, index) => index < this.maxResults * this.showPage)
    }
  },
  filters: {
    commaFormat(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    dateFormat(date) {
      const est = format(new Date(date), 'yyyy/MM/dd HH:mm:ss+20:00');
      return format(new Date(est), 'MM/dd');
    }
  },
  created() {
    // oauth2 = 是否為第三方 (true：第三方，false：本站)

    if (this.currentInfo.oauth2) {
      // 第三方返利只取第三方返利資料
      this.getDetail();
      return;
    }

    this.getSummary();
    this.getFriends();
  },
  methods: {
    /**
     * 本站返利各級好友統計
     */
    getSummary() {
      ajax({
        method: 'get',
        url: API_COMMISSION_LEVEL_LIST,
        errorAlert: false,
        params: { period: this.currentInfo.period },
        success: ({ result, ret, total }) => {
          if (result !== 'ok') {
            return;
          }

          this.summaryList = ret;
          this.summaryTotal = total;
        }
      });
    },
    /**
     * 本站返利一級好友資料
     */
    getFriends() {
      this.showInfinite = false;
      this.isLoading = true;
      this.showPage = 0;

      const params = {
        // max_results: this.maxResults,
        // first_result: this.firstResult
      };

      if (this.sort !== '') {
        params.sort = this.sort;
        params.order = this.order;
      }

      ajax({
        method: 'get',
        url: `${API_COMMISSION_FIRST_LEVEL_LIST}/${this.currentInfo.current_entry_id}/friends`,
        errorAlert: false,
        params,
        success: (response) => {
          this.showInfinite = true;
          if (response.result !== 'ok' || response.ret.length === 0) {
            return;
          }

          this.isLoading = false
          this.friendsList = response.ret; // 第一級好友佣金資料列表
          this.pageTotal = response.sub_total; // 小計
          this.allTotal = response.total; // 總計
        }
      });
    },
    /**
     * 取得第三方返利資料
     */
    getDetail() {
      ajax({
        method: 'get',
        url: `${API_COMMISSION_FIRST_LEVEL_LIST}/${this.currentInfo.current_entry_id}/oauth2/detail`,
        errorAlert: false,
        success: ({ result, ret }) => {
          if (result !== 'ok') {
            return;
          }

          this.detailList = ret;
        }
      });
    },
    onSort(sortValue) {
      let orderState = 'asc';

      if (this.sort === sortValue) {
        orderState = (this.order === 'asc') ? 'desc' : 'asc';
      }

      this.showPage = 1;
      this.sort = sortValue;
      this.order = orderState;

      this.getFriends();
    },
    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state) {
      setTimeout(() => {
        if (this.friendsList.length === 0) {
          this.isLoading = false;
          $state.complete();
          return
        }

        if (this.friendsList.length / this.maxResults > this.showPage) {
          this.showPage += 1;
          $state.loaded()

          if (Math.ceil(this.friendsList.length / this.maxResults) === this.showPage) {
            $state.complete();
          }
        }
      }, 300)
    }
  }
};
