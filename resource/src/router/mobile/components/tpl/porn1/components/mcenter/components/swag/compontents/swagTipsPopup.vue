<template>
  <transition name="fade">
    <div :class="$style['check-wrap']">
      <div :class="[$style['check-container']]">
        <div :class="$style['check-header']">
          <div :class="$style['title']">温馨提示</div>
          <!-- <div :class="$style['btn-close']" @click="closeTips">
            <img
              :src="$getCdnPath('/static/image/common/btn_close_white.png')"
              alt="close"
            />
          </div> -->
        </div>

        <div v-if="tipsType === 'deposit'" :class="$style['check-content']">
          <div :class="$style['title']">
            只需充值一次 开通兑换功能
          </div>
        </div>

        <div :class="$style['check-button-wrap']">
          <template v-if="tipsType === 'deposit'">
            <div
              :class="$style['check-btn']"
              @click="handleClickBtn('buymethod')"
            >
              如何购买
            </div>
            <div :class="$style['check-btn']" @click="handleClickBtn('usage')">
              使用方法
            </div>
            <div
              :class="[$style['check-btn'], $style['submit']]"
              @click="handleClickBtn('deposit')"
            >
              立即充值
            </div>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import mixin from "@/mixins/mcenter/swag/swag";
import { mapGetters } from "vuex";

export default {
  mixins: [mixin],
  data() {
    return {
      tipsType: "deposit"
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
  methods: {
    closeTips() {
      this.$emit("close");
    },
    handleClickBtn(target) {
      switch (target) {
        case "buymethod":
          localStorage.setItem("help-center-back", "mcenter/");
          this.$router.push("/mobile/mcenter/help/detail?type=buymethod");
          return;
        case "usage":
          localStorage.setItem("help-center-back", "mcenter/");
          this.$router.push("/mobile/mcenter/help/detail?type=usage&key=2");
          return;
        case "deposit":
          this.$router.push("/mobile/mcenter/deposit");
          return;
      }
    }
  }
};
</script>
<style lang="scss" src="../css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
