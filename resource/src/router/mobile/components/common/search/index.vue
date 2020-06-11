<template>
  <div :class="$style['search-wrap']">
    <div :class="[$style['search-header'], 'clearfix']">
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
          :key="`game-${gameInfo.vendor}-${index}`"
          :theme="gameTheme"
          :game-info="gameInfo"
          :show-vendor="gameShowVendor"
          :show-jackpot="gameShowJackpot"
          :show-favor="gameShowFavor"
          :show-button="gameShowButton"
          :before-on-enter="beforeOnEnter"
        />
      </template>
    </div>
    <message
      v-if="msg"
      @close="msg = ''"
      :callback="
        () => {
          $router.push(`/mobile/mcenter/bankcard?redirect=casino`);
        }
      "
    >
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import gameItem from '@/router/web/components/common/gameItem';
import ajax from '@/lib/ajax';
import message from "@/router/mobile/components/tpl/porn1/components/common/new/message"

/**
 * 共用元件 - 手機網頁版 遊戲大廳使用搜尋框
 * @param {String} [theme=1] - 樣式; 值：1
 * @param {String} [text] - 搜尋文字
 * @param {Number} [gameNum] - 搜尋到的遊戲數量
 * @param {Function} [setSearchText] - 更新搜尋文字
 */
export default {
  data() {
    return {
      hasBankCard: false,
      msg: ''
    }
  },
  components: {
    gameItem,
    message
  },
  props: {
    type: {
      type: String,
      default: 'casino'
    },
    text: {
      type: String,
      default: ''
    },
    setSearchText: {
      type: Function,
      required: true
    },
    updateSearchStatus: {
      type: Function,
      default: () => { }
    },
    gameData: {
      type: Array,
      default: () => []
    },
    gameTheme: {
      type: String,
      default: ''
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
    searchText: {
      get() {
        return this.text;
      },
      set(value) {
        debounce(() => { this.setSearchText(value); }, 800)();
      }
    }
  },
  created() {
    ajax({
      method: 'get',
      url: '/api/v1/c/player/user_bank/list',
      errorAlert: false
    }).then((res) => {
      this.hasBankCard = res.ret && res.ret.length > 0
    });
  },
  methods: {
    beforeOnEnter() {
      if (this.hasBankCard) {
        return true
      } else {
        this.msg = "请先绑定提现银行卡"
        return false
      }
    },
  },
};
</script>

<style lang="scss" module>
.search-wrap {
  width: 100%;
  min-height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 99;
  background: #f8f8f7;
  overflow-y: scroll;
}

.search-header {
  padding: 6px 10px;
  background: #fff;
}

.search-input {
  float: left;
  width: calc(100% * 15 / 17);
  height: 30px;
  padding-left: 42px;
  background: #eee url("/static/image/_new/common/icon_search_n.png") no-repeat
    3px center;
  border: none;
  border-radius: 5px;

  &::-webkit-input-placeholder {
    color: #a6a9b2;
  }

  &::-moz-placeholder {
    color: #a6a9b2;
  }

  &:-ms-input-placeholder {
    color: #a6a9b2;
  }

  &::placeholder {
    color: #a6a9b2;
  }
}

.search-cancel {
  float: left;
  width: calc(100% * 2 / 17);
  line-height: 30px;
  text-align: right;
  font-size: 14px;
  font-weight: 700;
  color: #5e626d;
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

.game-item-content {
  padding: 18px 10px;
  margin: 0 auto;
}
</style>
