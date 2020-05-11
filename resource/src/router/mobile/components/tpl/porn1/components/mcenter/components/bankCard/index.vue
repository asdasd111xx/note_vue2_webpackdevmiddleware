<template>
  <div :class="$style.wrap">
    <div :class="$style.header">
      <div :class="$style['btn-prev']" @click="backPre">
        <img src="/static/image/_new/common/btn_back.png" />
      </div>
      <div :class="[$style['content'], 'clearfix']">
        <div :class="$style.title">{{ headerTitle }}</div>
      </div>
      <div
        v-if="showDetail && !hideDeatilIcon"
        :class="$style['icon-edit']"
        @click="editDeatilStatus = true"
      >
        <icon name="ellipsis-h" />
      </div>
    </div>
    <component
      :is="currentPage"
      :change-page="changePage"
      :show-detail.sync="showDetail"
      :edit-status.sync="editStatus"
      :add-bank-card-step.sync="addBankCardStep"
    />
  </div>
</template>

<script>
import mobileContainer from '../../../common/new/mobileContainer';

export default {
  components: {
    mobileContainer,
    bankCardInfo: () => import(/* webpackChunkName: 'bankCardInfo' */ './bankCardInfo'),
    addBankCard: () => import(/* webpackChunkName: 'addBankCard' */ './addBankCard')
  },
  data() {
    return {
      currentPage: 'bankCardInfo',
      showDetailStatus: false,
      hideDeatilIcon: false,
      editDeatilStatus: false,
      step: 'one'
    };
  },
  computed: {
    headerTitle() {
      const { query } = this.$route;
      if (query.lobby || query.withdraw || query.balanceTrans || query.home || query.cardlobby || query.mahjonglobby) {
        return '提现银行卡';
      }
      return this.$text(...this.currentPage === 'bankCardInfo' ? ['S_CARD_MANAGEMENT', '卡片管理'] : ['S_ADD_BANKCARD', '添加银行卡']);
    },
    showDetail: {
      get() {
        return this.showDetailStatus;
      },
      set(value) {
        this.showDetailStatus = value;
      }
    },
    editStatus: {
      get() {
        return this.editDeatilStatus;
      },
      set(value) {
        this.editDeatilStatus = value;
      }
    },
    addBankCardStep: {
      get() {
        return this.step;
      },
      set(value) {
        this.step = value;
      }
    }
  },
  created() {
    const { query } = this.$route;
    if (query.lobby || query.withdraw || query.balanceTrans || query.home || query.cardlobby || query.mahjonglobby) {
      this.currentPage = 'addBankCard';
    }
  },
  methods: {
    changePage(value) {
      this.currentPage = value;
    },
    backPre() {
      if (this.currentPage === 'bankCardInfo') {
        if (this.showDetail) {
          this.showDetail = false;
          return;
        }
        this.$router.back();
        return;
      }

      if (this.addBankCardStep === 'two') {
        this.step = 'one';
        return;
      }

      if (this.$route.query) {
        this.$router.back();
      }

      this.currentPage = 'bankCardInfo';
    }
  }
};
</script>

<style lang="scss" module>
.wrap {
  padding-top: 43px;
  background: #f8f8f8;
  min-height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  background: #fefffe;
  text-align: center;
  border-bottom: 1px solid #eee;

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
}

.btn-prev {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  width: 20px;
  height: 20px;
  margin: auto;

  > img {
    display: block;
    width: 100%;
  }
}

.title {
  float: left;
  height: 22px;
  line-height: 22px;
  color: #000;
  font-size: 17px;
}

.content {
  display: inline-block;
  margin: 0 24px;
  vertical-align: middle;
}

.icon-edit {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 12px;
  width: 20px;
  height: 20px;
  margin: auto;

  > svg {
    display: block;
    width: 100%;
  }
}
</style>
