<template>
  <div :class="[$style['recoard-credit-trans'], ['clearfix']]">
    <template v-if="recoardList">
      <div v-for="recoard in recoardList" :class="[$style['recoard-block']]">
        <div :class="[$style['recoard-date']]">{{ recoard._date }}</div>

        <div
          v-for="item in recoard.list"
          :class="[$style['recoard-cell']]"
          @click="showDetail(item)"
        >
          <div :class="[$style['icon']]">
            <img
              src="/static/image/_new/mcenter/creditTrans/ic_transaction_transfer.png"
            />
          </div>
          <div :class="[$style['recoard-content']]">
            <div :class="[$style['title']]">
              <div>
                转让
              </div>
              <div>
                转让優惠
              </div>
            </div>
            <div :class="[$style['recoard-create-at']]">
              {{ item.created_at }}
            </div>

            <div :class="[$style['recoard-amount']]">
              {{ item.amount }}
            </div>
          </div>
          <div :class="$style['btn-next']">
            <img
              :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
            />
          </div>
        </div>
      </div>
    </template>
    <page-loading :is-show="isShowLoading || isSendRecharge" />
    <recoard-detail v-if="detailRecoard" @close="closeDetail" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mixin from '@/mixins/mcenter/creditTrans/creditTrans'
import recoardDetail from './recoardDetail'
export default {
  mixins: [mixin],
  components: {
    pageLoading: () => import(/* webpackChunkName: 'pageLoading' */ '@/router/mobile/components/tpl/porn1/components/common/new/pageLoading'),
    recoardDetail
  },
  data() {
    return {
      recoardList: null
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
  },
  watch: {
    rechargeRecoard(val) {
      if (val && val.length > 0) {
        let result = [];
        let dateArray = [];
        val.map((item, index) => {
          if (item.created_at.split("T") && item.created_at.split("T")[0]) {
            let day = item.created_at.split("T")[0];
            if (dateArray.includes(day)) {
              result.find(i => i._date == day).list.push({ ...item })
            } else {
              dateArray.push(day);
              result.push(
                {
                  _date: day,
                  list: [{ ...item }]
                }
              )
            }
          }
        })
        console.log(result)
        this.recoardList = result;
      }
    }
  },
  created() {
    const promise = [this.getRechargeRecoard()]
    Promise.all(promise).then(() => {
      this.isShowLoading = false;
    });
  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      'actionSetGlobalMessage'
    ]),

  }
};
</script>

<style lang="scss" module>
@import "../css/index.module.scss";
.recoard-credit-trans {
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  width: 100%;
}

.recoard-block {
}

.recoard-date {
  background: #f8f8f7;
  color: #414655;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
  font-size: 16px;
  font-weight: 700;
  height: 24px;
  line-height: 24px;
  margin: 12px 0;
  padding: 0 13px;
  text-align: left;
}

.recoard-cell {
  background: #fefffe;
  color: #414655;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
  margin-top: 1px;
  padding: 0 13px;
  text-align: left;
  position: relative;
  height: 70px;
  display: flex;
  align-items: center;
  width: 100%;

  > .icon {
    width: 30px;
    height: 100%;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      height: 30px;
      width: 30px;
    }
  }
}

.recoard-content {
  position: relative;
  width: 100%;

  .title {
    display: flex;
    align-items: center;
    height: 50%;
    font-size: 16px;
    font-weight: 700;
    text-align: left;
    color: #414655;

    > div:last-of-type {
      margin-left: 10px;
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      color: #414655;
    }
  }
}

.recoard-create-at {
  height: 50%;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #a6a9b2;
  width: 100%;
}

.recoard-amount {
  font-size: 14px;
  font-family: Arial, Arial-Bold;
  font-weight: 700;
  color: #414655;
  position: absolute;
  right: 3px;
  height: 100%;
  top: 0;
  line-height: 40px;
}

.btn-next {
  width: 14px;
  height: 100%;
  display: flex;
  align-items: center;
  > img {
    height: 14px;
    width: 14px;
  }
}
</style>
