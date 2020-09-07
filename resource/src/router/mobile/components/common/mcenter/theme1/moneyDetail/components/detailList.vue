<template>
  <div v-if="detailList" :class="$style['detail-list-wrap']">
    <div v-for="(info, date) in detailList" :key="date">
      <div :class="$style['detail-date']">{{ date }}</div>
      <div
        v-for="item in info"
        :key="item.id"
        :class="[$style['detail-wrap'], 'clearfix']"
        @click="onClick(item)"
      >
        <div :class="$style['detail-icon']">
          <img
            :src="
              $getCdnPath(
                `/static/image/_new/mcenter/moneyDetail/icon_${currentCategory.key}.png`
              )
            "
          />
        </div>
        <div :class="[$style['detail-info'], 'clearfix']">
          <div :class="$style.wrap">
            <div class="title-wrap">
              <span :class="$style.title">{{ currentCategory.text }}</span>
              <span :class="$style.tips">{{ opcodeList[item.opcode] }}</span>
            </div>
            <div :class="$style.time">{{ item.created_at | timeFormat }}</div>
          </div>
          <div :class="$style.amount">{{ item.amount }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else :class="$style['no-data-wrap']">
    <img
      :src="$getCdnPath('/static/image/_new/mcenter/moneyDetail/no_data.png')"
    />
    <div :class="$style.tips">暂时没有新的{{ currentCategory.text }}记录</div>
    <div
      v-if="currentCategory.key === 'deposit'"
      :class="$style['btn-deposit']"
      @click="$router.push('/mobile/mcenter/deposit')"
    >
      立即充值
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
export default {
  filters: {
    timeFormat(date) {
      return Vue.moment(date).utcOffset(-4).format('HH:mm:ss');
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
  },
  props: {
    currentCategory: {
      type: Object,
      required: true
    },
    opcodeList: {
      type: Object,
      required: true
    },
    detailList: {
      type: Object,
      default: null
    },
    detailInfo: {
      type: Object,
      default: null
    },
    pageType: {
      default: ''
    }
  },
  methods: {
    onClick(info) {
      this.$emit('update:detailInfo', info);
      if (this.pageType !== 'ingroup_transfer') {
        this.$router.push('/mobile/mcenter/moneyDetail/detail?id=' + info.id);
      }
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.list.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.list.scss" module="$style_ey1"></style>
