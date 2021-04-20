<template>
  <!-- 卡片區塊 -->
  <div
    :class="[
      $style['card'],
      $style['card--rounded'],
      {
        [getClass(
          'card--shape-square',
          `card--bg-repeat-gradient-${colorRepeatIndex}`
        )]: isSquare
      },
      {
        [getClass(
          'card--shape-rectangle',
          'card--bg-common-gradient'
        )]: isRectangle
      },
      {
        [$style['card--bg-history-gradient']]: isRectangle && !isCommon
      }
    ]"
    @click="handleItem"
  >
    <!-- 卡片內容 -->
    <div
      :class="[
        $style['card__logo'],
        {
          [$style['card__logo--top-20']]: isSquare
        },
        {
          [$style['card__logo--top-15']]: isRectangle
        }
      ]"
    >
      <img
        :class="$style['card__logo-img']"
        v-lazy="getBankImage(data.image_url)"
      />
    </div>

    <div :class="$style['card__name']">
      {{
        data.bank_name
          ? data.bank_name
          : data.virtual_bank_name
          ? data.virtual_bank_name
          : ""
      }}
    </div>

    <div
      v-if="data.type"
      :class="[
        $style['card__type'],
        $style[`card__type--color-${colorRepeatIndex}`]
      ]"
    >
      {{ data.type }}
    </div>

    <div
      :class="[
        $style['card__number'],
        {
          [$style[`card__number--color-${colorRepeatIndex}`]]: isSquare
        },
        {
          [getClass('card__number--small', 'mt-3')]: isRectangle
        },
        {
          [$style['mt-10']]: data.type
        },
        {
          [$style['mt-30']]: !data.type && isSquare
        }
      ]"
    >
      <span>
        {{
          data.account
            ? data.account.slice(0, 4)
            : data.address
            ? data.address.slice(0, 4)
            : ""
        }}
        **** ****
      </span>

      <span
        :class="{
          [$style['card__number--color-pointer']]: isSquare
        }"
      >
        {{
          data.account
            ? data.account.slice(-4)
            : data.address
            ? data.address.slice(-4)
            : ""
        }}
      </span>
    </div>

    <div
      v-if="!isDetailPage && data.auditing"
      :class="[
        $style['card__status-audit'],
        {
          [$style['card__status-audit--theme-square']]: isSquare
        },
        {
          [$style['card__status-audit--theme-rectangle']]: isRectangle
        }
      ]"
    >
      删除审核中
    </div>

    <div v-if="isStopped" :class="[$style['card__status-stopped']]">
      停用
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
    },
    isCommon() {
      // 是否為常用(true) or 歷史(false)
      return this.$route.meta.common;
    },
    isStopped() {
      let isStop = false;

      switch (this.type) {
        case "bankCard":
          isStop = !this.data?.enable;
          break;

        case "wallet":
          isStop = !this.data?.virtual;
          break;

        default:
          break;
      }

      return isStop || this.data?.banned;
    },
    isSquare() {
      return (
        ["porn1", "sg1"].includes(this.themeTPL) || this.type === "bankCard"
      );
    },
    isRectangle() {
      return ["ey1"].includes(this.themeTPL) && this.type === "wallet";
    }
  },
  methods: {
    getClass(...args) {
      let classArr = [];
      args.forEach(item => {
        classArr.push(this.$style[`${item}`]);
      });

      classArr = classArr.join(" ");
      return classArr;
    },
    getBankImage(image_url) {
      return {
        src: image_url,
        error: this.$getCdnPath(
          `/static/image/common/default/bank_card_default.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/common/default/bank_card_default.png`
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
  src="@/css/page/bankCard/cardItem.module.scss"
  module="$style_porn1"
></style>
