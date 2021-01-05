<template>
  <div
    :style="{
      'overflow-x': 'hidden',
      'overflow-y': 'auto',
      position: 'relative',
      width: '100%;'
    }"
  >
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
import mixin from "@/mixins/mcenter/recharge/recharge";
import recoardDetailSlider from "./recoardDetailSilder";

export default {
  mixins: [mixin],
  components: {
    moneyDetail: () =>
      import(
        /* webpackChunkName: 'moneyDetail' */ "@/router/mobile/components/common/mcenter/theme1/moneyDetail"
      ),
    recoardDetailSlider
  },
  data() {
    return {
      detailInfo: null
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    })
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
    }
  }
};
</script>
