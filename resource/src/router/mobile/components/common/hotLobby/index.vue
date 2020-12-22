<template>
  <div :class="$style['hot-lobby']">
    <!-- 遊戲列表 -->
    <div :class="$style['game-item-wrap']">
      <template v-for="(item, index) in gameData">
        <game-item
          :game-data="item"
          :lobby-info="lobbyInfo"
          :key="'image-' + index"
        />
      </template>
    </div>

    <!-- 無資料 -->
    <template v-if="gameData && gameData.length <= 0">
      <div :class="$style['empty-wrap']">
        <div :class="$style['empty-icon']" />
        <div>{{ $text("S_NO_GAME", "未查询到相关游戏") }}</div>
      </div>
    </template>

    <template v-if="isShowSearch">
      <game-search
        :text="searchText"
        :set-search-text="setSearchText"
        :update-search-status="updateSearchStatus"
        :game-list="gameData"
        :lobby-info="lobbyInfo"
      />
    </template>
  </div>
</template>

<script>
import axios from "axios";
import { gameList } from "@/config/api";
import { mapGetters, mapActions } from "vuex";
import gameItem from "./components/gameItem";
import gameSearch from "./components/gameSearch";

export default {
  components: {
    gameSearch,
    gameItem
  },
  props: {
    isShowSearch: {
      type: Boolean,
      default: false
    },
    lobbyName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isReceive: false,
      gameData: [],
      searchText: ""
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return this[`$style_${this.theme}`] || this.$style_porn1;
    },
    lobbyInfo() {
      let info = {};
      const vendor = this.$route.params.vendor;

      switch (vendor) {
        case "lg_yb_casino":
          info = {
            alias: "casino",
            name: "热门电子",
            vendor,
            kind: "3"
          };
          break;

        case "lg_yb_card":
          info = {
            alias: "card",
            name: "热门棋牌",
            vendor,
            kind: "5"
          };
          break;
      }

      return info;
    }
  },
  created() {
    this.$emit("update:lobbyName", this.lobbyInfo.name);
  },
  mounted() {
    if (!this.loginStatus) {
      this.$router.push("/mobile/login");
    }

    this.getGameList();
  },
  watch: {
    isShowSearch() {
      if (this.isShowSearch) {
        this.gameData = [];
        return;
      }
      this.setSearchText("");
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    getGameList() {
      if (this.isReceive) return;

      this.isReceive = true;

      let params = {
        vendor: this.lobbyInfo.vendor,
        kind: this.lobbyInfo.kind,
        firstResult: 0,
        maxResults: 36
      };

      return axios({
        method: "get",
        url: gameList,
        params: {
          ...params,
          name: this.searchText
        }
      })
        .then(res => {
          const { result, ret } = res.data;
          this.isReceive = false;
          if (result !== "ok") {
            return;
          }

          this.gameData = ret;
        })
        .catch(error => {
          this.isReceive = false;
          this.actionSetGlobalMessage(error.response.data.msg);
        });
    },
    /**
     * 設定搜尋文字
     * @param {string} value - 搜尋的文字
     */
    setSearchText(value) {
      this.searchText = value;

      if (this.isShowSearch && !value) {
        this.gameData = [];
        return;
      }

      this.getGameList();
    },
    updateSearchStatus() {
      this.$emit("update:isShowSearch");
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
