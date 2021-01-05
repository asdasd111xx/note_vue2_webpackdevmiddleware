<template>
  <transition :name="'fade'">
    <div :class="[$style['deposit-alert-wrap']]">
      <template v-if="['sg1'].includes(themeTPL)">
        <div :class="$style['alert-wrap']">
          <div :class="$style['alert-body-wrap']">
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
              <li>
                {{ $text("S_DEPOSIT_TIP02", "财务将尽快为您添加额度，请稍候") }}
              </li>
              <li>
                {{ $text("S_DEPOSIT_TIP03", "若长时间未到帐请联络客服") }}
              </li>
            </div>

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
                {{ $text("S_DEPOSIT_TIP02", "财务将尽快为您添加额度，请稍候") }}
              </li>
              <li>
                {{ $text("S_DEPOSIT_TIP03", "若长时间未到帐请联络客服") }}
              </li>
            </div>
            <div :class="$style['confirm-btn']" @click="closeFuc(false)">
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
  src="../css/depositAlert/ey1.scss"
  module="$style_ey1"
></style>
<style
  lang="scss"
  src="../css/depositAlert/sg1.scss"
  module="$style_sg1"
></style>
