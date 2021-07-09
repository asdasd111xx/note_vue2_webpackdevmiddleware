<template>
  <!-- 卡片內容 -->
  <div v-if="cardItemList !== undefined && cardItemList.length > 0">
    <div
      v-for="(info, index) in cardItemList"
      :key="index"
      :class="$style['info-item']"
    >
      <div :class="$style['item-header']">
        <div :class="$style['friend-name']">
          {{ info.title }}
        </div>

        <div
          v-if="info.img"
          :class="$style['friend-money']"
          @click="clickCard(info.paramsValue, info.isClick)"
        >
          <span>{{ info.childTitle }}</span>
          <div :class="$style['arrow-next']">
            <img
              :src="$getCdnPath('/static/image/common/arrow_next.png')"
              alt="arrow-next"
            />
          </div>
        </div>
      </div>

      <div :class="$style['item-content']">
        <div v-for="(childItem, index) in info.list" :key="index">
          <div
            v-if="childItem.item != undefined"
            :class="$style['item-detail']"
          >
            <div :class="$style['item-detail-title']">
              {{ childItem.name }}
            </div>
            <div v-if="childItem.color" :class="$style[`${childItem.color}`]">
              {{ childItem.item }}
            </div>
            <div v-else>
              {{ childItem.item }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    cardItemList: {
      type: Array,
      default: undefined
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return this[`$style_${this.themeTPL}`] || this.$style_porn1;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    tabCurrent() {
      let tab = this.childItem.findIndex(item =>
        this.$route.path.includes(item.key)
      );
      return tab === -1 ? 0 : tab;
    }
  },
  methods: {
    clickCard(value, isClick = false) {
      if (!isClick) return;
      this.$emit("click-card", value);
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
