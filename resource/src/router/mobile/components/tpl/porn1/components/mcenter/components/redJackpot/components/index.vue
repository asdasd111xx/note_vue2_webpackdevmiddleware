<template>
  <div>
    <div :class="$style['option']">
      <div
        v-if="optionType === 0"
        :class="[$style['option0'], $style[siteConfig.ROUTER_TPL]]"
        @click="getRedJackpotMoney"
      >
        领取
      </div>
      <div v-if="optionType === 1" :class="$style['option1']">任务进行中</div>
      <div v-if="optionType === 2" :class="$style['option2']">
        <div :class="$style['title']">领取倒计时</div>
        <div :class="$style['time']">{{ outPutYime }}</div>
      </div>
      <div v-if="optionType === 3" :class="$style['option1']">任务完成</div>
    </div>
    <div :class="$style['redJackpot']">
      <div :class="$style['top']">
        <div :class="$style['menu-wrap']">
          <p :class="$style['small']">锁定中彩金</p>
          <p :class="[$style['money-text'], $style[siteConfig.ROUTER_TPL]]">
            {{
              redJackpotData !== null
                ? formatThousandsCurrency(redJackpotData.remain_bonus)
                : "0.00"
            }}
          </p>
        </div>
        <div :class="$style['menu-wrap']">
          <p :class="$style['small']">累计已领取</p>
          <p :class="$style['money-text']">
            {{
              redJackpotData !== null
                ? formatThousandsCurrency(redJackpotData.receive_bonus)
                : "0.00"
            }}
          </p>
        </div>
        <div :class="$style['menu-wrap']">
          <p :class="$style['small']">每日赠送最高</p>
          <p :class="$style['money-text']">
            {{
              redJackpotData !== null
                ? formatThousandsCurrency(redJackpotData.daily_bonus)
                : "0.00"
            }}
          </p>
        </div>
      </div>
      <div :class="$style['tip']" v-html="tips"></div>
      <div :class="$style['record']">
        <money-detail :pageType="'internal_memo'" @showDetail="showDetail" />
        <recoard-detail-slider
          v-if="detailInfo"
          :detail-info="detailInfo"
          :detail-type="{ text: '红利' }"
          @close="showDetail(null)"
        />
      </div>
    </div>
    <div v-if="redEnvelopeType" :class="$style['all-view']">
      <div :class="$style['envelope-box']">
        <div :class="[$style['envelope-top']]"></div>
        <div :class="$style['envelope-middle']">
          <div :class="$style['envelope-message']" v-html="redEnvelopeText" />
          <div :class="$style['envelope-button']" @click="closeRedEnvelope">
            领取
          </div>
        </div>
        <div :class="$style['envelope-ground']"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getCookie } from "@/lib/cookie";
import Vue from "vue";
import InfiniteLoading from "vue-infinite-loading";
import EST from "@/lib/EST";
import ajax from "@/lib/ajax";
import axios from "axios";
import detailInfo from "@/router/mobile/components/common/mcenter/theme1/moneyDetail/components/detailInfo/";
import common from "@/api/common";
import recoardDetailSlider from "../../creditTrans/compontents/recoardDetailSilder";
import goLangApiRequest from "@/api/goLangApiRequest";
import { thousandsCurrency } from "@/lib/thousandsCurrency";

export default {
  components: {
    InfiniteLoading,
    moneyDetail: () =>
      import(
        /* webpackChunkName: 'moneyDetail' */ "@/router/mobile/components/common/mcenter/theme1/moneyDetail"
      ),
    recoardDetailSlider,
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    detailInfo
  },

  data() {
    return {
      isLoading: false,
      isReceive: false,
      showInfinite: false,
      redJackpotData: {},
      total: {},
      tips: "",
      detailInfo: null,
      optionType: null,
      outPutYime: "",
      timer: null,
      eventKind: "",
      redEnvelopeType: false,
      redEnvelopeText: "恭喜您获得红包彩金</br>9,999,999,999,999 元",
      buttonType: true
    };
  },
  watch: {
    noticeData() {
      //收到推播後重取任務狀態
      this.getRedJackpot();
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      noticeData: "getNoticeData"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    headerConfig() {
      return {
        prev: true,
        title: "红包彩金",
        onClick: () => {
          this.$router.back();
        }
      };
    }
  },
  created() {
    this.isLoading = true;
    this.getRedJackpot();
    this.getTime();
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    showDetail(info) {
      this.detailInfo = info;
    },

    getRedJackpot() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Event/Info`,
        headers: {
          cid: getCookie("cid")
        },
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res.errorCode === "00" && res.status === "000") {
          this.redJackpotData = res.data;
          this.tips = res.data.default_text;
          this.optionType = res.data.receive_option;
          this.eventKind = res.data.event_kind;
          // this.optionType = 0;
          this.timer = setInterval(this.getTime, 1000);
        } else {
          this.redJackpotData = null;
        }
      });
    },
    getTime() {
      var nowTime = Vue.moment(new Date())
        .utcOffset(-4)
        .format("HH:mm:ss");
      // console.log(nowTime);
      let sec = nowTime.split(":")[2];
      let min = 60 - nowTime.split(":")[1];
      let hour = 24 - nowTime.split(":")[0] - 1;
      if (sec > 0) {
        if (min === 0) {
          min = 59;
          hour -= 1;
        } else {
          min -= 1;
        }
      }
      if (min === 60) {
        min = 0;
        hour += 1;
      }
      min = min <= 9 ? "0" + min : min;
      hour = hour <= 9 ? "0" + hour : hour;
      this.outPutYime = `${hour}:${min}`;
      // console.log(this.outPutYime);
      if (hour < 0 || (hour === 0 && min === 0)) {
        window.location.reload();
      }
    },
    getRedJackpotMoney() {
      if (!this.buttonType) {
        return;
      }
      this.buttonType = false;
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Drawing/GetEventDraw/${this.eventKind}`,
        headers: {
          cid: getCookie("cid")
        },
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res.errorCode === "00" && res.status === "000") {
          this.redEnvelopeType = true;
          this.redEnvelopeText = `恭喜您获得红包彩金</br>${this.getNoRoundText(
            res.data.prizeAmount
          )} 元`;
          this.buttonType = true;
        } else {
          switch (res.code) {
            case "M00001":
              this.actionSetGlobalMessage({
                msg: "请重新登入",
                code: res.code
              });
              break;
            case "M00002":
              window.location.reload();
              break;
            case "E02486":
              this.actionSetGlobalMessage({
                msg: "活动未开放",
                code: res.code,
                cb: () => {
                  this.$router.back();
                }
              });
              break;
            default:
              break;
          }
        }
      });
    },
    closeRedEnvelope() {
      this.redEnvelopeType = false;
      this.getRedJackpot();
    },
    getNoRoundText(value) {
      //千分位＋小數點後兩位
      return `${Number(value)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    formatThousandsCurrency(value) {
      return thousandsCurrency(value);
    }
  },
  beforeDestroy() {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.index.scss" module="$style_sg1"></style>
