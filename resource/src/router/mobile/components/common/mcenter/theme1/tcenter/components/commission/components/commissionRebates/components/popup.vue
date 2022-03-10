<template>
  <transition name="fade">
    <div :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" />
      <div :class="[$style['pop-block'], { [$style.pathblock]: path }]">
        <!-- 我的推廣 -->
        <template v-if="!path">
          <div v-if="!computeState" :class="$style['close-img']" @click="close">
            <img
              :src="$getCdnPath('/static/image/common/btn_close_white.png')"
              alt="close"
            />
          </div>
          <div :class="$style['title']">
            实时返利
          </div>
          <div :class="[$style['content-wrap']]">
            <div :class="$style['content']">
              <h1>
                {{
                  computeState
                    ? $t("S_DISTRIBUTION_COMPLETED")
                    : $t("S_SYSTEM_COMPUTE_WAGER")
                }}
              </h1>

              <template v-if="computeState">
                <div :class="[$style['rebate-title']]">
                  结算返利金额
                </div>
                <div :class="$style['rebate-value']">
                  {{ amount ? amount : "--" }}
                </div>
                <div :class="[$style['rebate-entry-button-wrap']]">
                  <div :class="$style['button-entry-close']" @click="close">
                    {{ $t("S_CLOSE") }}
                  </div>
                  <div
                    :class="$style['button-entry-history']"
                    @click="handleClick"
                  >
                    {{ $t("S_COMMISSION_SEND_RECORD") }}
                  </div>
                </div>
              </template>
              <template v-else>
                <p>
                  如欲离开本画面, 请稍候至派发记录查看记录
                </p>
              </template>
            </div>
          </div>
        </template>
        <!-- 返利管理 -->
        <div v-if="path">
          <div
            :class="[$style['content-wrap'], { [$style.pathcontent]: path }]"
          >
            <div :class="$style['content']">
              <h1>
                {{
                  computeState
                    ? $t("S_DISTRIBUTION_COMPLETED")
                    : $t("S_SYSTEM_COMPUTE_WAGER")
                }}
              </h1>

              <template v-if="computeState">
                <div :class="[$style['rebate-title']]">
                  结算返利金额
                </div>
                <div :class="$style['rebate-value']">
                  {{ amount ? amount : "--" }}
                </div>
              </template>
              <template v-else>
                <p :class="[$style['rebate-wait']]">
                  如欲离开本画面, <br />请稍候至派发记录查看记录
                </p>
              </template>
            </div>
          </div>
          <div v-if="computeState" :class="[$style['path-bottom']]">
            <div :class="$style['path-close']" @click="close">
              {{ $t("S_CLOSE") }}
            </div>
            <div :class="$style['path-back']" @click="handleRebateClick">
              {{ $t("S_BACK") }}
            </div>
          </div>
          <div v-else :class="[$style['path-bottom']]">
            <div :class="$style['path-only-close']" @click="close">
              {{ $t("S_CLOSE") }}
            </div>
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
      type: Number | String,
      require: true
    },
    isShowPopup: {
      type: Boolean,
      require: true
    },
    path: {
      type: String,
      default: ""
    },
    currentInfo: {
      type: Object,
      required: true
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
    },
    handleClick() {
      this.$router.push("/mobile/mcenter/tcenter/commission/record");

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
    handleRebateClick() {
      this.$router.push({
        params: {
          title: "record",
          item: "detail"
        },
        query: {
          assign: "assign",
          ...this.currentInfo
        }
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.popup.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.popup.scss" module="$style_sg1"></style>
