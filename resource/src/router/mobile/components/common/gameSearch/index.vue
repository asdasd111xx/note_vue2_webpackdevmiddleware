<template>
  <div :class="$style['search-wrap']">
    <div :class="[$style['search-header'], 'clearfix']">
      <div :class="$style['search-input-img']" />
      <input
        v-model="searchText"
        :class="$style['search-input']"
        :placeholder="$text('S_SEARCH_KEYWORD2')"
        type="text"
      />
      <div :class="$style['search-cancel']" @click="updateSearchStatus()">
        {{ $text("S_CANCEL", "取消") }}
      </div>
    </div>
    <div v-if="gameData.length === 0" :class="$style['empty-wrap']">
      <div :class="$style['empty-icon']" />
      <div>{{ $text("S_NO_GAME", "未查询到相关游戏") }}</div>
    </div>
    <div v-else :class="$style['game-item-content']">
      <template v-for="(gameInfo, index) in gameData">
        <game-item
          v-if="gameInfo.is_mobile"
          :key="`game-${gameInfo.vendor}-${index}`"
          :theme="theme"
          :game-info="gameInfo"
          :show-vendor="gameShowVendor"
          :show-jackpot="gameShowJackpot"
          :show-favor="gameShowFavor"
          :show-button="gameShowButton"
          :redirect-card="redirectBankCard"
        />
      </template>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import gameItem from "../gameItem";
import { mapGetters } from "vuex";
/**
 * 共用元件 - 手機網頁版 遊戲大廳使用搜尋框
 * @param {String} [text] - 搜尋文字
 * @param {Number} [gameNum] - 搜尋到的遊戲數量
 * @param {Function} [setSearchText] - 更新搜尋文字
 */
export default {
  data() {
    return {};
  },
  components: {
    gameItem
  },
  props: {
    type: {
      type: String,
      default: "casino"
    },
    text: {
      type: String,
      default: ""
    },
    setSearchText: {
      type: Function,
      required: true
    },
    updateSearchStatus: {
      type: Function,
      default: () => {}
    },
    gameData: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: "porn1"
    },
    gameShowVendor: {
      type: Boolean,
      default: true
    },
    gameShowJackpot: {
      type: Boolean,
      default: false
    },
    gameShowFavor: {
      type: Boolean,
      default: true
    },
    gameShowButton: {
      type: Boolean,
      default: true
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
    searchText: {
      get() {
        return this.text;
      },
      set(value) {
        throttle(() => {
          this.setSearchText(value);
        }, 800)();
      }
    }
  },
  created() {},
  methods: {
    redirectBankCard() {
      return `casino`;
    }
  }
};
</script>

<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
