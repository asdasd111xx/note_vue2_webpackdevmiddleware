<template>
  <transition name="fade">
    <div :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" />
      <div :class="$style['pop-block']">
        <div v-if="!computeState" :class="$style['close-img']" @click="close">
          <img
            :src="$getCdnPath('/static/image/_new/common/btn_close_w.png')"
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
              <span>{{ data.start_at }}~{{ data.end_at }}</span>
            </div>

            <template v-if="computeState">
              <div :class="$style['result-item']">
                <div>{{ $text("S_COMPUTING_VALID_BET", "结算有效投注") }}</div>
                <span>{{ data.total }}</span>
              </div>

              <div :class="$style['result-item']">
                <div>
                  {{ $text("S_COMPUTING_PREMIUM_AMOUNT", "結算返水金额") }}
                </div>
                <span>{{ data.rebate }}</span>
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
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import EST from "@/lib/EST";
import mcenter from "@/api/mcenter";

export default {
  props: {
    data: {
      type: Object,
      default: {}
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
    }
  },
  created() {
    console.log(this.data);
    setTimeout(() => {
      this.computeState = true;
    }, 3000);
  },

  methods: {
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
<style lang="scss" src="./css/ey1.popup.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.popup.scss" module="$style_sg1"></style>
