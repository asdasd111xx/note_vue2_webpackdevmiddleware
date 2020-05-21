<template>
  <div class="card-wrap">
    <template v-for="slotKey in slotSort">
      <template v-if="slotKey === 'list'">
        <div :key="`slot-${slotKey}`" class="game-item-wrap clearfix">
          <message
            v-if="msg"
            @close="msg = ''"
            :callback="
              () => {
                $router.push(`/mobile/mcenter/mahjong?mahjonglobby=${vendor}`);
              }
            "
          >
            <div slot="msg">
              {{ msg }}
            </div>
          </message>

          <template v-for="(gameInfo, index) in gameData">
            <game-item
              :key="`game-${gameInfo.vendor}-${index}`"
              :game-info="gameInfo"
              :show-vendor="gameShowVendor"
              :show-jackpot="gameShowJackpot"
              :show-favor="gameShowFavor"
              :show-button="gameShowButton"
              :before-on-enter="beforeOnEnter"
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
    <gameSearch
      v-if="isShowSearch"
      :text="paramsData.name"
      :set-search-text="setSearchText"
      :update-search-status="updateSearchStatus"
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
import gameItem from '@/router/web/components/common/gameItem';
import gameSearch from '../search';
import message from "@/router/mobile/components/tpl/porn1/components/common/new/message"

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
    message
  },
  props: {
    slotSort: {
      type: Array,
      default: () => (['search', 'label', 'list'])
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
      msg: '',
      hasBankCard: false
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
    if (this.loginStatus) {
      this.actionSetFavoriteGame();
      ajax({
        method: 'get',
        url: '/api/v1/c/player/user_bank/list',
        errorAlert: false
      }).then((res) => {
        this.hasBankCard = res.ret && res.ret.length > 0
      });
    }
  },
  methods: {
    ...mapActions([
      'actionSetFavoriteGame'
    ]),
    beforeOnEnter() {
      if (this.hasBankCard) {
        return true
      } else {
        this.msg = "请先绑定提现银行卡(C50099)"
        return false
      }
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

      new Promise((resolve) => {
        ajax({
          method: 'get',
          url: gameList,
          errorAlert: false,
          params: {
            ...this.paramsData,
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

<style lang="scss" scoped>
.game-item-wrap {
  background: #f8f8f7;
  min-height: calc(100vh - 88px);
}
</style>
