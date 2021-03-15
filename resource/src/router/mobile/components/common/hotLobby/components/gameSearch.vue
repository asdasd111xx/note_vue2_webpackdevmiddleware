<template>
  <div :class="$style['search-wrap']">
    <div :class="[$style['search-header']]">
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

    <!-- 無相關遊戲 -->
    <div v-if="searchList.length === 0" :class="$style['empty-wrap']">
      <div :class="$style['empty-icon']" />
      <div>{{ $text("S_NO_GAME", "未查询到相关游戏") }}</div>
    </div>

    <!-- render game item -->
    <div v-else :class="$style['game-item-wrap']">
      <template v-for="(item, index) in searchList">
        <game-item
          :game-data="item"
          :lobby-info="lobbyInfo"
          :key="'image-' + index"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from "lodash/throttle";
import gameItem from "./gameItem";
import mixin from "@/mixins/hotLobby";

export default {
  components: {
    gameItem
  },
  props: {
    updateSearchStatus: {
      type: Function,
      default: () => {}
    }
  },
  mixins: [mixin],
  data() {
    return {
      searchText: "",
      searchList: []
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return (
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1
      );
    }
  },
  created() {
    this.getUserViplevel();
    // this.getGameList();
  },
  watch: {
    searchText(value) {
      throttle(() => {
        this.setSearchText(value);
      }, 800)();
    }
  },
  methods: {
    /**
     * 設定搜尋文字
     * @param {string} value - 搜尋的文字
     */
    setSearchText(value) {
      this.searchText = value;

      if (!value) {
        this.searchList = [];
        return;
      }

      this.searchList = this.gameData.filter(item => {
        return item.name.indexOf(value) !== -1;
      });

      // 如需搜尋時要重呼叫一次 API
      // this.getGameList(this.searchText);
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
