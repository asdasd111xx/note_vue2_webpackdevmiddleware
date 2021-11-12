<template>
  <div>
    <money-detail :pageType="'swag'" @showDetail="showDetail" />
    <recoard-detail-slider
      v-if="detailInfo"
      :detail-type="{ text: '转让' }"
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
      siteConfig: "getSiteConfig"
    })
  },
  methods: {
    showDetail(info) {
      this.detailInfo = info;
    }
  }
};
</script>
