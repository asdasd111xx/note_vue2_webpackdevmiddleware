<template>
  <transition :name="'fade'">
    <div :class="[$style['deposit-alert-wrap']]">
      <template v-if="['sg1', 'porn1'].includes(themeTPL)">
        <div :class="$style['alert-wrap']">
          <div :class="$style['alert-body-wrap']">
            <!-- 手動配卡成功彈窗標題 -->
            <div :class="$style['deposit-title']">
              {{ manualcard ? "存款申请" : "" }}
            </div>
            <div :class="$style['success-icon-wrap']">
              <img
                :class="$style['success-icon']"
                :src="
                  $getCdnPath(
                    `/static/image/common/mcenter/deposit/icon_ok.png`
                  )
                "
                alt="check"
              />
              <span :class="$style['success-title']">{{
                $text("S_ENTER_SUCCESS", "提交成功")
              }}</span>
            </div>

            <div :class="$style['tip-wrap']">
              <!-- 手動配卡成功彈窗文案/一般充值成功彈窗文案 -->
              <li>
                {{
                  manualcard
                    ? $text("S_DEPOSIT_TIP08", "极速存款通道建置中")
                    : $text("S_DEPOSIT_TIP02", "财务将尽快为您添加额度,请稍后")
                }}
              </li>
              <li>
                {{
                  manualcard
                    ? $text(
                        "S_DEPOSIT_TIP09",
                        "请5分钟后至充值纪录查看汇款帐号"
                      )
                    : $text("S_DEPOSIT_TIP03", "若长时间未到帐请联络客服")
                }}
              </li>
            </div>
            <hr style="background-color:#ddd; height:0.5px; border:none;" />
            <div :class="$style['confirm-btn']" @click="closeFuc(false)">
              知道了
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div :class="$style['alert-wrap']">
          <div :class="$style['alert-title']">
            充值申请
            <div :class="$style['alert-close-wrap']" @click="closeFuc(false)">
              <div>
                <icon name="times" width="20" height="20" />
              </div>
            </div>
          </div>
          <div :class="$style['alert-body-wrap']">
            <div :class="$style['success-icon-wrap']">
              <!-- <icon :class="$style['success-icon']" name="regular/check-circle" /> -->
              <img
                :class="$style['success-icon']"
                :src="
                  $getCdnPath(`/static/image/${themeTPL}/mcenter/ic_check.png`)
                "
                alt="check"
              />
              <span :class="$style['success-title']">{{
                $text("S_ENTER_SUCCESS", "提交成功")
              }}</span>
            </div>
            <div :class="$style['tip-wrap']">
              <li>
                {{ $text("S_DEPOSIT_TIP02", "财务将尽快为您添加额度,请稍后") }}
              </li>
              <li>
                {{ $text("S_DEPOSIT_TIP03", "若长时间未到帐请联络客服") }}
              </li>
            </div>
            <div :class="[$style['confirm-btn']]" @click="closeFuc(false)">
              {{ $text("S_ENTER01", "我知道了") }}
            </div>
          </div>
        </div>
      </template>
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
    manualcard: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  }
};
</script>

<style
  lang="scss"
  src="../css/depositAlert/porn1.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="../css/depositAlert/sg1.scss"
  module="$style_sg1"
></style>
