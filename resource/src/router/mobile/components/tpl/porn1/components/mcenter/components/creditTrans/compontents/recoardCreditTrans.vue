<template>
  <div :class="[$style['recoard-credit-trans'], ['clearfix']]">
    <money-detail :pageType="'ingroup_transfer'" @showDetail="showDetail" />
    <recoard-detail-slider
      v-if="detailInfo"
      :detail-info="detailInfo"
      @close="showDetail(null)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mixin from '@/mixins/mcenter/creditTrans/creditTrans';
import recoardDetailSlider from './recoardDetailSilder';

export default {
  mixins: [mixin],
  components: {
    moneyDetail: () => import(/* webpackChunkName: 'recordDeposit' */'@/router/mobile/components/common/mcenter/theme1/moneyDetail'),
    recoardDetailSlider
  },
  data() {
    return {
      detailInfo: null,
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
  },
  created() {
    // const promise = [this.getRechargeRecoard()]
    // Promise.all(promise).then(() => {
    //   this.isShowLoading = false;
    // });
  },
  methods: {
    showDetail(info) {
      this.detailInfo = info;
    },
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
</style>
