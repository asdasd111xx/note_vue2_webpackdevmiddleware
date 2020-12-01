<template>
  <div class="card-wrap">
    <template v-for="slotKey in slotSort">
      <template v-if="slotKey === 'list'">
        <div :key="`slot-${slotKey}`" class="game-item-wrap clearfix">
          <template v-for="(gameInfo, index) in gameData">
            <game-item
              :key="`game-${gameInfo.vendor}-${index}`"
              :theme="gameTheme"
              :game-info="gameInfo"
              :show-vendor="gameShowVendor"
              :show-jackpot="gameShowJackpot"
              :show-favor="gameShowFavor"
              :show-button="gameShowButton"
              :redirect-card="redirectBankCard"
            />
          </template>
          <!-- 捲動加載 -->
          <infinite-loading
            v-if="showInfinite"
            ref="infiniteLoading"
            @infinite="infiniteHandler"
          >
            <span slot="no-more" />
            <span slot="no-results" />
          </infinite-loading>
        </div>
      </template>
    </template>
    <template v-if="gameData === favoriteData && gameData.length === 0">
      <div :class="$style['empty-wrap']">
        <div :class="$style['empty-icon']" />
        <div>{{ $text("S_NO_GAME", "未查询到相关游戏") }}</div>
      </div>
    </template>
    <gameSearch
      v-if="isShowSearch"
      :text="paramsData.name"
      :set-search-text="setSearchText"
      :update-search-status="updateSearchStatus"
      :theme="gameTheme"
      :game-data="gameData"
      :game-show-vendor="gameShowVendor"
      :game-show-jackpot="gameShowJackpot"
      :game-show-favor="gameShowFavor"
      :game-show-button="gameShowButton"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import ajax from '@/lib/ajax';
import { gameType, gameList } from '@/config/api';
import gameItem from '../gameItem';
import gameSearch from '../gameSearch';

/**
 * 共用元件 - 手機網頁版電子遊戲頁共用框 (邏輯共用)
 * @param {Array} [slotSort=['search', 'label', 'list']] - slot 的區塊順序調整
 * @param {Boolean} [gameShowVendor=true] - 遊戲列表(gameItem)，是否顯示平台名稱
 * @param {Boolean} [gameShowJackpot=false] - 遊戲列表(gameItem)，是否顯示彩金區塊
 * @param {Boolean} [gameShowFavor=true] - 遊戲列表(gameItem)，是否顯示最愛按鈕
 * @param {Boolean} [gameShowButton=true] - 遊戲列表(gameItem)，是否顯示進入遊戲按鈕
 */
export default {
  components: {
    gameSearch,
    gameItem,
    InfiniteLoading,
  },
  props: {
    slotSort: {
      type: Array,
      default: () => (['search', 'label', 'list'])
    },
    labelTheme: {
      type: String,
      default: 'porn1'
    },
    gameTheme: {
      type: String,
      default: 'porn1'
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
    },
    isShowSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isReceive: false,
      showInfinite: true,
      paramsData: {
        kind: 6,
        label: 'hot',
        enable: true,
        first_result: 0,
        max_results: 36,
        name: ''
      },
      searchText: '',
      isLabelReceive: false,
      labelData: [],
      isGameDataReceive: false,
      gameData: [],
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      favoriteGame: 'getFavoriteGame'
    }),
    vendor() {
      return (this.$route.params.vendor === 'all') ? '' : (this.$route.params.vendor || '');
    },
    // 依平台篩選出最愛的遊戲列表
    favoriteData() {
      if (this.vendor) {
        return this.favoriteGame.filter((element) => element.vendor === this.vendor);
      }

      return this.favoriteGame.filter((element) => element.kind === this.paramsData.kind);
    }
  },
  watch: {
    vendor() {
      this.updateGameData();
      this.getGameLabelList();
    },
    isShowSearch() {
      if (this.isShowSearch) {
        this.gameData = [];
        return;
      }

      this.setSearchText('');
    }
  },
  created() {
    this.getGameLabelList();
  },
  methods: {
    ...mapActions([
      'actionSetFavoriteGame'
    ]),
    redirectBankCard() {
      return `mahjonglobby-${this.vendor}-${this.paramsData.label}`;
    },
    /**
     * 取得遊戲平台分類
     */
    getGameLabelList() {
      // 電子分類預設資料
      const defaultData = [
        {
          label: '',
          name: this.$t('S_ALL')
        },
        {
          label: 'new',
          name: this.$t('S_NEW_GAMES')
        },
        {
          label: 'hot',
          name: this.$t('S_HOT')
        }
      ];

      // 抓取遊戲導覽清單
      ajax({
        method: 'get',
        url: `${gameType}?kind=${this.paramsData.kind}&vendor=${this.vendor}`
      }).then((response) => {
        this.labelData = defaultData.concat(response.ret);

        // 最愛統一放在最後面
        if (this.loginStatus) {
          this.labelData.push({ label: 'favorite', name: this.$t('S_FAVORITE') });
        }
        this.isLabelReceive = true;
      });
    },
    /**
     * 設定搜尋文字
     * @param {string} value - 搜尋的文字
     */
    setSearchText(value) {
      this.paramsData.first_result = 0;
      this.paramsData.name = value;
      if (this.isShowSearch && !value) {
        this.gameData = [];
        return;
      }

      this.updateGameData();
      this.getGameLabelList();
    },
    /**
     * 設定遊戲分類
     * @param {string} value - 設定的分類
     */
    changeGameLabel(value) {
      this.paramsData = {
        ...this.paramsData,
        label: value
      };
      this.updateGameData();
    },
    /**
     * 重新取得遊戲資料
     */
    updateGameData() {
      this.showInfinite = false;
      this.isGameDataReceive = false;
      this.gameData = [];

      if (this.paramsData.label === 'favorite') {
        this.gameData = this.favoriteData;
        return;
      }

      this.$nextTick(() => {
        this.showInfinite = true;
      });
    },
    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state, index = 1) {
      // 防止在切換類別的時候馬上觸發捲動加載，造成有遊戲重複出現的情況
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;

      if (index > 3) {
        return;
      }

      let _params = { ...this.paramsData };
      // 進到搜索頁面，Label = '' 為搜索全部
      if (this.isShowSearch) {
        _params = { ..._params, label: "" };
      }

      new Promise((resolve) => {
        ajax({
          method: 'get',
          url: gameList,
          errorAlert: false,
          params: {
            ..._params,
            vendor: this.vendor
          }
        }).then((response) => {
          if (response && response.result === 'ok') {
            resolve(response);
            return;
          }

          setTimeout(() => {
            this.isReceive = false;
            this.infiniteHandler($state, index + 1);
          }, 3000);
        });
      }).then((response) => {
        this.gameData.push(...response.ret);
        this.paramsData.first_result = this.gameData.length;
        this.isReceive = false;
        this.isGameDataReceive = true;

        $state.loaded();

        if (this.gameData.length >= response.pagination.total) {
          $state.complete();
        }
      });
    },
    updateSearchStatus() {
      this.$emit('update:isShowSearch');
    }
  }
};
</script>

<style lang="scss" module>
.game-item-wrap {
  background: #f8f8f7;
  min-height: calc(100vh - 88px);
}

.empty-wrap {
  padding-top: 90px;
  color: #a6a9b2;
  font-size: 16px;
  text-align: center;
}

.empty-icon {
  margin: 0 auto 20px;
  width: 62px;
  height: 62px;
  background: url("/static/image/_new/common/search_none.png") 0 0 / contain
    no-repeat;
}
</style>
