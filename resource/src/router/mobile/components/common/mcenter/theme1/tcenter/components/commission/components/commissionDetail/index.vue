<template>
  <div
    :class="[
      $style['commission-detail-wrap'],
      $style['commission-detail-wrap-' + path]
    ]"
  >
    <div
      v-if="!$route.query.oauth2 && !$route.query.depth && !$route.query.user"
      :class="$style['tab-wrap']"
    >
      <div
        v-for="(item, index) in tabItem"
        :key="`tab-${item.key}`"
        :class="[
          $style['tab-item'],
          { [$style['is-current']]: currentTab === index }
        ]"
        @click="setCurrentTab(index)"
      >
        {{ item.text }}
      </div>

      <div
        :class="$style['active-slider']"
        :style="{ left: `calc(25% + 50% * ${currentTab})` }"
      />
    </div>

    <assign v-if="currentTemplate === 'assign'" :currentInfo="currentInfo" />
    <record
      v-if="currentTemplate === 'record' && !path"
      :currentInfo="currentInfo"
    />
    <rebate-record
      v-if="currentTemplate === 'record' && path"
      :currentInfo="currentInfo"
      :set-header-title="setHeaderTitle"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import assign from "./assign";
import record from "./record";
import rebateRecord from "./rebateRecord";
import Vue, { nextTick } from "vue";
export default {
  components: {
    assign,
    record,
    rebateRecord
  },
  props: {
    currentInfo: {
      type: Object,
      required: true
    },
    setHeaderTitle: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      currentTab: 0,
      currentTemplate: "assign",
      path: this.$route.params.title ?? ""
    };
  },

  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    tabItem() {
      return [
        {
          key: "assign",
          text: this.path ? "派发" : this.$text("S_ASSIGIN_DETAIL", "派发详情")
        },
        {
          key: "record",
          text: this.path ? "详情" : this.$text("S_RECORD_DETAIL", "统计详情")
        }
      ];
    }
  },
  created() {
    //　第三方
    if (this.currentInfo.oauth2) {
      this.currentTemplate = "record";
      return;
    }

    this.setHeaderTitle(this.rebateDateFormat(this.currentInfo.period));
  },
  watch: {
    "$route.query": {
      handler: function(item) {
        if (item.assign) {
          this.currentTemplate = "assign";
          this.currentTab = 0;
        } else if (item.record || item.inner) {
          this.currentTemplate = "record";
          this.currentTab = 1;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setCurrentTab(index) {
      switch (index) {
        case 0:
          this.$router.push({
            params: {
              title: "record",
              item: "detail"
            },
            query: {
              assign: "assign",
              period: this.$route.query.period,
              start_at: this.$route.query.start_at,
              end_at: this.$route.query.end_at,
              oauth2_detail: this.$route.query.oauth2_detail,
              type: this.$route.query.type,
              amount: this.$route.query.amount,
              current_entry_id: this.$route.query.current_entry_id,
              show_detail: this.$route.query.show_detail,
              oauth2: this.$route.query.oauth2
            }
          });
          break;

        case 1:
          this.$router.push({
            params: {
              title: "record",
              item: "detail"
            },
            query: {
              record: "record",
              period: this.$route.query.period,
              start_at: this.$route.query.start_at,
              end_at: this.$route.query.end_at,
              oauth2_detail: this.$route.query.oauth2_detail,
              type: this.$route.query.type,
              amount: this.$route.query.amount,
              current_entry_id: this.$route.query.current_entry_id,
              show_detail: this.$route.query.show_detail,
              oauth2: this.$route.query.oauth2
            }
          });
          break;
      }
    },
    rebateDateFormat(date) {
      return Vue.moment(date).format("YYYY-MM-DD");
    },
    setTitle(val) {
      this.showTitle = val;
      return;
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
