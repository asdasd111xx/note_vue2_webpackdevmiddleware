<template>
  <transition name="fade">
    <div :class="[$style['pop-wrap'], $style[siteConfig.ROUTER_TPL]]">
      <div :class="$style['pop-mask']" />
      <div :class="$style['pop-block']">
        <div v-if="!computeState" :class="$style['close-img']" @click="close">
          <img
            :src="$getCdnPath('/static/image/common/btn_close_white.png')"
            alt="close"
          />
        </div>

        <div :class="$style['title']">
          实时返水
        </div>

        <div :class="$style['content-wrap']">
          <div :class="$style['content']">
            <h1>
              {{
                computeState
                  ? $text("S_DISTRIBUTION_COMPLETED")
                  : $text("S_SYSTEM_COMPUTE_WAGER")
              }}
            </h1>

            <div :class="$style['result-item']">
              <div>{{ $text("S_COMPUTE_WAGER_INTERVAL", "结算区间") }}</div>
              <span>{{ filterDate }}</span>
            </div>

            <template v-if="computeState">
              <div :class="$style['result-item']">
                <div>{{ $text("S_COMPUTING_VALID_BET", "结算有效投注") }}</div>
                <span>{{ formatThousandsCurrency(data.total) }}</span>
              </div>

              <div :class="$style['result-item']">
                <div>
                  {{ $text("S_COMPUTING_PREMIUM_AMOUNT", "结算返水金额") }}
                </div>
                <span>{{ formatThousandsCurrency(data.rebate) }}</span>
              </div>

              <div :class="$style['button-wrap']">
                <div
                  :class="[$style['button-item'], $style['close']]"
                  @click="close"
                >
                  {{ $text("S_CLOSE") }}
                </div>

                <div
                  :class="[$style['button-item'], $style['confirm']]"
                  @click="confirm"
                >
                  {{ $text("S_REBATE_HISTORY", "返水历史") }}
                </div>
              </div>
            </template>

            <template v-else>
              <div :class="$style['tips']">
                如欲离开本画面, 请稍候至返水历史查看记录
              </div>
              <div
                v-if="['porn1'].includes(this.routerTPL)"
                :class="$style['tips-close']"
              >
                {{ $text("S_CLOSE") }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import EST from "@/lib/EST";
import mcenter from "@/api/mcenter";
import { thousandsCurrency } from "@/lib/thousandsCurrency";

export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    caculateData: {
      type: Object | Array,
      default: {}
    },
    clickAllReceive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      computeState: false
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    filterDate() {
      //領取取當前時間顯示 一鍵領取取當前時間的整點為主來顯示
      if (this.caculateData) {
        let startTime = this.caculateData[0]
          ? this.caculateData[0].start_at
          : this.caculateData.start_at;
        let endTime = this.caculateData[0]
          ? this.caculateData[0].end_at
          : this.caculateData.end_at;

        if (this.clickAllReceive) {
          return `${Vue.moment(startTime).format(
            "YYYY-MM-DD 00:00:00"
          )}~${Vue.moment(endTime).format("YYYY-MM-DD 23:59:59")}`;
        } else {
          return `${startTime}~${endTime}`;
        }
      }

      return "";
    }
  },
  created() {
    console.log(this.data);
    setTimeout(() => {
      this.computeState = true;
    }, 3000);
  },

  methods: {
    formatThousandsCurrency(value) {
      return thousandsCurrency(value);
    },
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("close");
      this.$emit("confirm");
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.popup.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.popup.scss" module="$style_sg1"></style>
