<template>
  <transition :name="'fade'">
    <div :class="$style['withdraw-alert-wrap']">
      <div :class="[$style['alert-wrap'], $style[`alert-${type}`]]">
        <div :class="$style['alert-title']" v-if="title !== ''">
          {{ title }}
          <div :class="$style['alert-close-wrap']" @click="closeFuc(false)">
            <icon
              :class="$style['alert-close-btn']"
              width="30"
              height="30"
              name="times"
            />
          </div>
        </div>
        <div :class="$style['alert-body-wrap']">
          <div :class="[$style['success-icon-wrap'], 'clearfix']">
            <!-- <icon
              v-if="type === 'successTip'"
              :class="$style['success-icon']"
              width="60"
              height="60"
              name="regular/check-circle"
            /> -->
            <img
              :src="
                $getCdnPath(`/static/image/common/mcenter/withdraw/ic_ok.png`)
              "
              :class="$style['success-img']"
            />
            <span :class="$style['success-title']">提交成功</span>
          </div>
          <div v-if="type === 'successTip'" :class="$style['tip-wrap']">
            <li>财务将尽快为您审核出款,请稍后</li>
            <li>若长时间未到帐请联络客服</li>
          </div>
          <!-- <div v-else :class="$style['tip-wrap']">
            <li>
              {{
                $text("S_CGPAY_TIP01", "请使用 CG Pay 内建扫描器扫描QR code")
              }}
            </li>
            <li>
              {{ $text("S_CGPAY_TIP02", "成功绑定钱包后，此视窗自动关闭") }}
            </li>
            <li>
              {{ $text("S_CGPAY_TIP03", "没有 CG Pay 帐号？") }}
              <a :class="$style['go-text']" @click="openCGPay">{{
                $text("S_ENTER03", "立即申请")
              }}</a>
            </li>
          </div> -->
          <hr style="background-color:#ddd; height:0.5px; border:none;" />
          <div :class="[$style['confirm-btn']]" @click="closeFuc(false)">
            知道了
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    closeFuc: {
      type: Function,
      default: () => {}
    },
    title: {
      type: String,
      default: ""
    },
    closeBtnText: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "successTip"
    },
    tipTitle: {
      type: String,
      default: ""
    },
    tipImgSrc: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      timeFuc: 0
    };
  },
  created() {
    this.timeFuc = setTimeout(() => {
      this.closeFuc(false);
    }, 30000);
  },
  beforeDestroy() {
    clearTimeout(this.timeFuc);
  },
  methods: {
    openCGPay() {
      window.open("https://cgpay.pw/", "cgpay");
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  }
};
</script>

<style lang="scss" src="../css/withdrawSuccess.module.scss" module></style>
