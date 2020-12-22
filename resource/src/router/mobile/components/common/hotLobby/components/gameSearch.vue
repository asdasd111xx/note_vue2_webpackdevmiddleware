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
    <div v-if="gameList.length === 0" :class="$style['empty-wrap']">
      <div :class="$style['empty-icon']" />
      <div>{{ $text("S_NO_GAME", "未查询到相关游戏") }}</div>
    </div>

    <!-- render game item -->
    <div v-else :class="$style['game-item-wrap']">
      <template v-for="(item, index) in gameList">
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
import debounce from "lodash/debounce";
import gameItem from "./gameItem";

export default {
  data() {
    return {};
  },
  components: {
    gameItem
  },
  props: {
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
    gameList: {
      type: Array,
      default: () => []
    },
    lobbyInfo: {
      type: Object,
      default: {}
    }
  },
  computed: {
    $style() {
      return this[`$style_${this.theme}`] || this.$style_porn1;
    },
    searchText: {
      get() {
        return this.text;
      },
      set(value) {
        debounce(() => {
          this.setSearchText(value);
        }, 1000)();
      }
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
