<template>
  <div
    :class="[
      {
        [$style['bankcard-item']]: type === 'bankCard' || themeTPL === 'porn1',
      },
      {
        [$style['virtual-bankcard-item']]:
          themeTPL === 'ey1' && type === 'wallet',
      },
      $style[`colorIndex-${colorRepeatIndex}`],
    ]"
    @click="handleItem"
  >
    <!-- 銀行卡 -->
    <template v-if="type === 'bankCard'">
      <div :class="[$style['card-top'], 'clearfix']">
        <div :class="$style['card-logo']">
          <img v-lazy="getBankImage(data.swift_code)" />
        </div>

        <div :class="$style['card-info']">
          <div :class="$style['card-name']">
            {{ data.bank_name }}
          </div>

          <div :class="$style['card-type']">
            {{ data.type }}
          </div>
        </div>
      </div>

      <div :class="$style['card-number']">
        {{ data.account.slice(0, 4) }} **** ****
        <span>{{ data.account.slice(-4) }}</span>
      </div>
    </template>

    <!-- 錢包 -->
    <template v-if="type === 'wallet'">
      <div :class="[$style['card-top'], 'clearfix']">
        <div :class="$style['card-logo']">
          <img v-lazy="getBankImage(data.swift_code)" />
        </div>

        <div :class="$style['card-info']">
          <div :class="$style['card-name']">
            {{ data.virtual_bank_name }}
          </div>

          <template v-if="themeTPL === 'ey1'">
            <div :class="$style['card-number']">
              {{ data.address.slice(0, 4) }} **** ****
              <span>{{ data.address.slice(-4) }}</span>
            </div>
          </template>
        </div>
      </div>

      <template v-if="themeTPL === 'porn1'">
        <div :class="$style['card-number']">
          {{ data.address.slice(0, 4) }} **** ****
          <span>{{ data.address.slice(-4) }}</span>
        </div>
      </template>
    </template>

    <div v-if="!isDetailPage && data.auditing" :class="$style['audit-tip']">
      删除审核中
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    data: {
      type: Object,
      require: true
    },
    index: {
      type: Number,
      require: true
    },
    isDetailPage: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      require: true
    }
  },
  data() {
    return {};
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
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    colorRepeatIndex() {
      return this.index % 3;
    }
  },
  methods: {
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath(
          `/static/image/${this.themeTPL}/default/bank_default_2.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/${this.themeTPL}/default/bank_default_2.png`
        )
      };
    },
    handleItem() {
      if (!this.isDetailPage) {
        this.$emit("onClick");
        this.$emit("setPageStatus");
      }
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/bankCard/porn1.cardInfo.module.scss"
  module="$style_porn1"
></style>

<style
  lang="scss"
  src="@/css/page/bankCard/ey1.cardInfo.module.scss"
  module="$style_ey1"
></style>
