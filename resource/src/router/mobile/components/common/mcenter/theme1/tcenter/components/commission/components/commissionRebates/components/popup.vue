<template>
  <transition name="fade">
    <div :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" />
      <div :class="$style['pop-block']">
        <div v-if="!computeState" :class="$style['close-img']" @click="close">
          <img
            :src="$getCdnPath('/static/image/common/btn_close_white.png')"
            alt="close"
          />
        </div>
        <div :class="$style['title']">
          实时返利
        </div>
        <div :class="$style['content-wrap']">
          <div :class="$style['content']">
            <h1>
              {{
                computeState
                  ? $t("S_DISTRIBUTION_COMPLETED")
                  : $t("S_SYSTEM_COMPUTE_WAGER")
              }}
            </h1>

            <template v-if="computeState">
              <div :class="$style['rebate-title']">
                结算返利金额
              </div>
              <div :class="$style['rebate-value']">
                {{ amount ? amount : "--" }}
              </div>
              <div :class="$style['rebate-entry-button-wrap']">
                <div :class="$style['button-entry-close']" @click="close">
                  {{ $t("S_CLOSE") }}
                </div>
                <div
                  :class="$style['button-entry-history']"
                  @click="
                    $router.push('/mobile/mcenter/tcenter/commission/record')
                  "
                >
                  {{ $t("S_COMMISSION_SEND_RECORD") }}
                </div>
              </div>
            </template>
            <template v-else>
              <p>如欲离开本画面, 请稍候至派发记录查看记录</p>
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
    amount: {
      type: Number,
      require: true
    },
    isShowPopup: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      computeState: false,
      receiveEntryData: {}
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
    setTimeout(() => {
      this.computeState = true;
    }, 3000);
  },
  methods: {
    close() {
      this.$emit("update:isShowPopup", false);
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.popup.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.popup.scss" module="$style_sg1"></style>
