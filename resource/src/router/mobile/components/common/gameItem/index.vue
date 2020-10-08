<template>
  <div
    :class="
      getClass([
        `${
          !gameInfo.code && gameInfo.status ? 'game-item-activity' : 'game-item'
        }`,
        `game-type-${gameInfo.kind}`,
        `${!gameInfo.url && !gameInfo.code ? 'no-activity' : 'show'}`
      ])
    "
    @click="onEnter"
  >
    <div
      v-if="gameInfo.code && gameInfo.status < 4"
      :class="getClass(['game-active'])"
    >
      <img :src="$getCdnPath(getActivityImg)" />
    </div>
    <!-- vendor 標示 -->
    <div v-if="showVendor" :class="getClass(['game-vendor'])">
      {{ vendorName }}
    </div>
    <!-- 遊戲圖片區塊 -->
    <div :class="getClass(['game-box-wrap'])">
      <!-- 行動裝置點擊圖片開啟遊戲 -->
      <div :class="[getClass(['game-box']), 'clearfix']">
        <img v-lazy="getImg" />
      </div>
      <div :class="getClass(['mask'])" />
    </div>
    <!-- 遊戲彩金 -->
    <div
      v-if="showJackpot && getAmount"
      :class="getClass(['game-jackpot', 'jackpot-img'])"
    >
      <div :class="getClass(['game-jackpot-img'])">
        <img :src="getJackpotImg" />
      </div>
      <span>{{ getAmount }}</span>
    </div>
    <!-- 遊戲標題 -->
    <div
      :class="getClass(['game-title', 'is-login'], { 'is-login': loginStatus })"
    >
      {{ resultGameName }}
    </div>
    <!-- 最愛 -->
    <div :class="getClass(['icon-star-wrap'])" @click.stop="toggleFavorite">
      <div
        v-if="showFavor && loginStatus"
        :class="
          getClass(['icon-star', 'is-favorite'], {
            'is-favorite': isFavorite
          })
        "
      />
    </div>
    <!-- PC 版點擊按鈕開啟遊戲 -->
    <div v-if="showButton" :class="getClass(['btn-enter'])">
      {{ getBtnName }}
    </div>
    <page-loading :is-show="isShowLoading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import game from '@/api/game';
import openGame from '@/lib/open_game';
import isMobile from '@/lib/is_mobile';

export default {
  components: {
    pageLoading: () => import(/* webpackChunkName: 'pageLoading' */ '@/router/mobile/components/common/pageLoading'),
  },
  data() {
    return {
      isShowLoading: false,
      isFavorite: false // 客端顯示是否最愛
    };
  },
  mounted() {
    this.isFavorite = !!this.favoriteGame.find(i => i.vendor === this.gameInfo.vendor && i.code === this.gameInfo.code);
  },
  props: {
    theme: {
      type: String,
      default: "porn1"
    },
    gameInfo: {
      type: Object,
      required: true
    },
    showVendor: {
      type: Boolean,
      default: true
    },
    showJackpot: {
      type: Boolean,
      default: true
    },
    showFavor: {
      type: Boolean,
      default: true
    },
    showButton: {
      type: Boolean,
      default: true
    },
    redirectCard: {
      type: Function,
      required: true
    },
    jackpotData: {
      type: Object,
    }
  },
  computed: {
    ...mapGetters({
      isBackEnd: 'getIsBackEnd',
      cdnDomain: 'getCdnDomain',
      favoriteGame: 'getFavoriteGame',
      loginStatus: 'getLoginStatus',
      curLang: 'getCurLang',
      siteConfig: 'getSiteConfig'
    }),
    /**
     * 平台名稱顯示特例
     * @method vendorName
     * @returns {string} 平台名稱
     */
    vendorName() {
      return this.gameInfo.vendor_abridge;
    },
    /**
     * 遊戲名稱顯示
     * @method resultGameName
     * @returns {string} 平台名稱
     */
    resultGameName() {
      let gameName = this.gameInfo.name;

      if (!this.gameInfo.code) {
        switch (this.gameInfo.status) {
          case 2:
            gameName = this.$text('S_ACTIVITY_PREVIEW', '活动预告');
            break;
          case 3:
            gameName = this.$text('S_ACTIVITY_PERIOD', '活动中');
            break;
          case 4:
            gameName = this.$text('S_ACTIVITY_FINISH', '结果查询');
            break;
          default:
            break;
        }
      }
      return gameName;
    },
    /**
     * 取得圖片路徑
     * @method getImg
     * @returns {object} 圖片路徑
    */
    getImg() {
      const imgConverter = {
        3: 'casino',
        5: 'card',
        6: 'mahjong'
      };
      // cdn 機制
      // let resultUrl = this.$getCdnPath(`${this.cdnDomain}/image/${imgConverter[this.gameInfo.kind]}/${this.gameInfo.vendor}/Game_${this.gameInfo.code}.png`);

      // cdn 未完善先調整至同APP
      //  let resultUrl = `/static/cdn-image/${imgConverter[this.gameInfo.kind]}/${this.gameInfo.vendor}/Game_${this.gameInfo.code}.png`;

      let type = "";
      switch (Number(this.gameInfo.kind)) {
        case 3:
          type = "casino";
          break;
        case 6:
          type = "mahjong";
          break;
        default:
          type = "card";
          break;
      }

      let resultUrl = `https://b1.xf0371.com/cdn/image/${type}/${this.gameInfo.vendor}/Game_${this.gameInfo.code}.png`;

      if (!this.gameInfo.code && this.gameInfo.status > 1) {
        resultUrl = this.$getCdnPath('/static/image/casino/event_icon.png');
      }

      const ey1_default_img = '/static/image/ey1/default/bg_gamecard_d.png'

      return {
        src: `${resultUrl}?v=${Date.now().toString()}`,
        error: this.theme === "ey1" ? ey1_default_img : this.$getCdnPath('/static/image/game_loading_s.gif'),
        loading: this.theme === "ey1" ? ey1_default_img : this.$getCdnPath('/static/image/game_loading_s.gif')
      };
    },
    /**
     * 取得活動圖片
     * @method getActivityImg
     * @returns {string} 圖片路徑
     */
    getActivityImg() {
      return `/static/image/casino/theme/brilliant/lang/${this.curLang}/${this.gameInfo.status !== 2 ? 'upcoming_ribbon' : 'activity_ribbon'}.png`;
    },
    getJackpotImg() {
      let src = '/static/image/casino/jackpot/';
      switch (this.gameInfo.vendor) {
        // 單一彩金+名單
        case 'bbin':
        case "gns":
        case "isb":
        case "ag":
        case "sg":
        case "fg":
        case "mg":
          return src + 'ic_minor.png';
        case 'pt':
        case "hb":
        case "wm":
          return src + 'ic_jackpot.png';
        default:
          return;
      }
    },
    /**
     * 個別遊戲彩金金額
     * @method getAmount
     * @returns {string} 彩金金額
     */
    getAmount() {
      if (!this.jackpotData || !this.jackpotData.jpMinor) {
        return '';
      }

      const data = this.jackpotData.jpMinor.find((info) => info.code === this.gameInfo.code);

      if (!data) {
        return '';
      }

      // toFixed => 取到小數點第二位
      // replace => 新增千分位逗點符號
      return (Math.round(data.amount * 100) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    /**
     * 重組最愛列表 List
     * @method favoriteList
     * @returns {object} 最愛列表
     */
    favoriteList() {
      const result = {};

      this.favoriteGame.forEach((info) => {
        if (!result[info.vendor]) {
          result[info.vendor] = {};
        }

        result[info.vendor][info.code] = info;
      });

      return result;
    },
    /**
     * 檢查是否為最愛
     * @method checkFavorite
     * @returns {boolean} 是否為最愛
     */
    checkFavorite() {
      try {
        return !!this.favoriteList[this.gameInfo.vendor][this.gameInfo.code];
      } catch (err) {
        return false;
      }
    },
    /**
     * 取得遊戲按鈕文字
     * @method getBtnName
     * @returns {string} 遊戲按鈕文字
    */
    getBtnName() {
      let name = 'S_PLAY_NOW';
      const trialKey = isMobile() ? 'mobile_trial' : 'trial';

      if (!this.gameInfo.code) {
        return this.$i18n.t('S_ACTIVITY_DETAIL');
      }

      if (this.loginStatus) {
        return this.$i18n.t(name);
      }

      if (this.gameInfo[trialKey]) {
        name = 'S_FREE_GAME';
      }

      return this.$i18n.t(name);
    },
  },
  methods: {
    ...mapActions([
      'actionSetFavoriteGame',
      'actionSetGlobalMessage'
    ]),
    /**
     * 取得Class名稱
     * @method getClass
     * @param {array} className - 要取得的Class名稱
     * @param {object} classInfo - 判斷是否要取得此Class
     * @returns {object} Class Object
    */
    getClass(className, classInfo) {
      const style = this[`$style_${this.theme}`] || this.$style_porn1;
      const classObj = {};

      className.forEach((name) => {
        if (!style[name]) {
          return;
        }

        const value = classInfo && name in classInfo ? classInfo[name] : true;
        classObj[style[name]] = value;
      });
      return classObj;
    },
    /**
     * 點擊立即遊戲
     * @method onEnter
    */
    onEnter() {
      if (localStorage.getItem('is-open-game')) {
        return
      }
      if (this.isBackEnd) {
        return;
      }

      let isMobileView;

      try {
        isMobileView = this.$route.matched[0].meta.isMobile;
      } catch (e) {
        isMobileView = false;
      }

      const {
        vendor, kind, code, url
      } = this.gameInfo;

      // 活動
      if (Object.keys(this.gameInfo).includes('url')) {
        if (!url) {
          return;
        }

        if (!this.loginStatus) {
          alert(this.$i18n.t('S_LOGIN_TIPS'));
          return;
        }

        window.open(url, 'game');
        return;
      }

      if (!this.loginStatus && !(isMobile() ? this.gameInfo.mobile_trial : this.gameInfo.trial)) {
        if (isMobileView) {
          this.$router.push('/mobile/login');
        } else {
          alert(this.$i18n.t('S_LOGIN_TIPS'));
        }

        return;
      }

      this.isShowLoading = true;

      const openGameSuccessFunc = (res) => {
        this.isShowLoading = false;
      };

      const openGameFailFunc = (res) => {
        this.isShowLoading = false;

        if (res && res.data) {
          let data = res.data;
          this.actionSetGlobalMessage({ msg: data.msg, code: data.code, origin: this.redirectCard() });
        }
      };
      openGame({ vendor, kind, code }, openGameSuccessFunc, openGameFailFunc);
    },
    /**
     * 切換最愛遊戲
     * @method toggleFavorite
     */
    toggleFavorite() {

      if (this.isBackEnd || this.isSetFavorite) {
        return;
      }
      this.isSetFavorite = true;
      const actionType = this.checkFavorite ? 'deleteFavoriteGame' : 'setFavoriteGame';
      const { vendor, kind, code } = this.gameInfo;

      game[actionType]({
        params: {
          vendor,
          kind,
          code
        }
      }).then(() => {
        this.isFavorite = !this.isFavorite;
        this.actionSetFavoriteGame().then(() => {
          setTimeout(() => {
            this.isSetFavorite = false;
          }, 300)
        });
      });
    }
  }
};
</script>


<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
