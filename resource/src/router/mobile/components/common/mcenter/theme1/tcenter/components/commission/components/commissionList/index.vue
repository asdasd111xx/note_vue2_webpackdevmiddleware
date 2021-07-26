<template>
  <div
    :class="[
      $style['commission-list-wrap'],
      $style['commission-list-wrap-' + path]
    ]"
  >
    <div :class="[$style['total-block'], $style['total-block-' + path]]">
      <span>笔数：{{ commissionList.length }}</span>
      <span>返利总计：{{ allTotal.amount | amountFormat }}</span>
    </div>
    <div v-if="path" :class="[$style['date']]">{{ timeTitle }}</div>
    <template v-if="!mainNoData">
      <div :class="[$style['list-block']]">
        <div
          :class="$style['card']"
          v-for="(info, index) in controlData"
          :key="'item-' + index"
          @click="onClick(info)"
        >
          <div :class="[$style['card-title'], $style['card-title-' + path]]">
            <span :class="[$style['card-name'], $style['card-name-' + path]]">{{
              path ? rebateDateFormat(info.period) : info.period
            }}</span>
            <span
              :class="[
                $style['card-getNumber'],
                { [$style['has-detail']]: !path && info.show_detail },
                $style['card-getNumber-' + path]
              ]"
              >{{ info.amount | amountFormat }}

              <div v-if="path && info.amount > 0" :class="$style['arrow-next']">
                <img
                  :src="$getCdnPath('/static/image/common/arrow_next.png')"
                  alt="arrow-next"
                />
              </div>
            </span>
          </div>

          <div :class="[$style['total-gap-' + path]]">
            <span>{{ $text("S_COMPUTE_WAGER_INTERVAL", "结算区间") }}</span>
            <div :class="$style['period']">
              <span>{{ EST(info.start_at) }} </span>
              <span>{{ EST(info.end_at) }} </span>
            </div>
          </div>

          <div :class="[$style['last-item']]">
            <span :class="[$style['color-' + path]]">{{
              $text("S_COMPUTE_METHOD", "结算方式")
            }}</span>
            <span>{{ typeText(info.type) }}</span>
          </div>
        </div>
      </div>
      <infinite-loading
        v-if="showInfinite"
        ref="infiniteLoading"
        @infinite="infiniteHandler"
      >
        <span slot="no-more" />
        <span slot="no-results" />
      </infinite-loading>
    </template>

    <template v-else>
      <div v-if="mainNoData && !path" :class="$style['no-data']">
        <img src="/static/image/_new/mcenter/ic_nodata.png" />
        <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
      </div>
      <div v-else-if="mainNoData && path" :class="$style['no-data-path']">
        <img
          :src="
            $getCdnPath(
              `/static/image/${themeTPL}/mcenter/img_default_no_data.png`
            )
          "
        />
        <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import commissionList from "@/mixins/mcenter/commission/commissionList";
import { mapGetters } from "vuex";

export default {
  components: {
    InfiniteLoading
  },
  mixins: [commissionList],
  props: {
    setTabState: {
      type: Function,
      required: true
    },
    setHeaderTitle: {
      type: Function,
      required: true
    },
    currentInfo: {
      type: Object | null,
      required: true
    },
    timeTitle: {
      type: String,
      default: ""
    },
    path: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      pathItem: this.$route.params.item ?? ""
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    }
  },
  methods: {
    onClick(info) {
      if (info.show_detail) {
        this.info = info;
        this.setTabState(false);
        this.$emit("update:currentInfo", info);

        if (this.$route.params.title) {
          this.setHeaderTitle(this.rebateDateFormat(info.end_at));
          this.$router.push({
            params: {
              title: "record",
              item: "detail"
            }
          });
        } else {
          this.setHeaderTitle(info.period);
          this.$router.push({
            path: "/mobile/mcenter/tcenter/commission/detail"
          });
        }
      }
    },
    typeText(type) {
      switch (type) {
        case 0:
          return "盈亏返利";
          break;

        case 1:
          return "投注返利";
          break;

        case 2:
          return "损益返利";
          break;
      }
    },
    updateData() {
      this.showInfinite = false;

      this.mainNoData = true;

      this.$nextTick(() => {
        this.showInfinite = true;
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
