<template>
  <div
    v-if="isReceive"
    ref="home-wrap"
    :class="[$style['home-wrap'], 'clearfix']"
  >
    <!-- 左側分類 -->
    <div
      v-show="isShow"
      ref="type-wrap"
      :class="$style['type-wrap']"
      @touchstart="onTypeTouchStart"
      @touchmove="onTypeTouchMove"
    >
      <div
        v-for="(type, index) in typeList"
        :key="`type-${index}`"
        :class="[
          $style['type-swiper'],
          { [$style.active]: typeList[selectedIndex].icon === type.icon }
        ]"
        @click="onChangeSelectIndex(index)"
      >
        <img
          v-if="typeList[selectedIndex].icon === type.icon"
          :src="
            $getCdnPath(
              `/static/image/_new/platform/icon/icon_${type.icon}_h.png`
            )
          "
        />
        <img
          v-else
          :src="
            $getCdnPath(
              `/static/image/_new/platform/icon/icon_${type.icon}_n.png`
            )
          "
        />
        <div
          :class="[
            $style['type-title'],
            { [$style.active]: typeList[selectedIndex].icon === type.icon }
          ]"
        >
          {{ type.name }}
        </div>
      </div>
    </div>
    <!-- 右側內容 -->
    <div v-show="isShow" :class="$style['all-game-wrap']">
      <!-- 上方功能列 -->
      <div :class="$style['top-wrap']">
        <!-- 會員中心連結 -->
        <div :class="[$style['mcenter-func-wrap'], 'clearfix']">
          <div
            v-for="(info, index) in mcenterList"
            :key="`mcenter-${index}`"
            :class="$style['mcenter-wrap']"
            @click="onGoToMcenter(info.name)"
          >
            <template v-if="info.name === 'grade'">
              <img
                :src="
                  $getCdnPath(
                    `/static/image/_new/level/icon_level_${vipLevel}.png`
                  )
                "
              />
              <div>{{ vipLevel === "max" ? vipLevel : info.text }}</div>
            </template>
            <template v-else>
              <img
                :src="
                  $getCdnPath(
                    `/static/image/_new/wallet/icon_wallet_${info.name}.png`
                  )
                "
              />
              <div>{{ info.text }}</div>
            </template>
          </div>
        </div>
      </div>
      <!-- 下方影片與遊戲 -->
      <div
        ref="game-wrap"
        :class="[$style['game-list-wrap'], 'clearfix']"
        :style="{
          height: `${wrapHeight - 50}px`,
          'overflow-y': `${stopScroll ? 'hidden' : 'auto'}`,
          opacity: stopScroll ? 0 : 1
        }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- 遊戲 -->
        <template>
          <div
            v-for="(game, i) in currentGame.vendors"
            :key="`game-${i}-${game.image}`"
            :class="[$style.game, { [$style['is-full']]: game.imageType > 0 }]"
            @click.stop="onOpenGame(game)"
          >
            <img v-lazy="getImg(game)" />
            <!-- <span v-if="!['D', 'R'].includes(game.type) && game.name">{{
              game.name
            }}</span> -->
          </div>
        </template>
        <div ref="wrap-buffer" :class="$style['wrap-buffer']" />
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { API_GET_VENDOR } from '@/config/api';
import { getCookie, setCookie } from '@/lib/cookie';
import { mapGetters, mapActions } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import ajax from '@/lib/ajax';
import axios from 'axios';
import common from '@/api/common';
import find from 'lodash/find';
import mcenter from '@/api/mcenter';
import openGame from '@/lib/open_game';
import pornRequest from '@/api/pornRequest';
import querystring from 'querystring';
import yaboRequest from '@/api/yaboRequest';

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      stopScroll: false,
      isReceive: false,
      isShowAllTag: false,
      isSliding: false,
      isTop: false,
      isShow: false,
      isBottom: false,
      typeStartTouchY: 0,
      startTouchY: 0,
      slideDirection: '',
      wrapHeight: 0,
      allGame: [],
      selectedIndex: 0,
      currentLevel: 0,
      mcenterList: [
        { name: 'deposit', text: '充值' },
        { name: 'balanceTrans', text: '转帐' },
        { name: 'withdraw', text: '提现' },
        { name: 'accountVip', text: 'VIP' },
        { name: 'grade', text: '等级' }
      ],
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo'
    }),
    isAdult() {
      return (
        this.memInfo.config.content_rating && this.memInfo.user.content_rating
      );
    },
    typeList() {
      if (this.allGame) {
        let typeList = this.allGame
          .map(game => ({
            icon: game.iconName,
            name: game.name
          }))
          .filter(type => {
            return this.isAdult ? type : type.icon !== 'Welfare';
          });

        // 業主說左側選單前後要各複製一份...
        return [...typeList, ...typeList, ...typeList];
      }
    },
    options() {
      return {
        slidesPerView: "auto",
        spaceBetween: 4,
        slideClass: this.$style.tag
      };
    },
    allGameList() {
      const gameList = this.allGame
        .map(game => game)
        .filter(item => {
          return this.isAdult ? item : item.iconName !== 'Welfare';
        });
      return gameList;
    },
    currentGame() {
      const length = this.typeList.length / 3;
      const index = this.selectedIndex % length;
      return { ...this.allGameList[index] };
    },
    vipLevel() {
      return this.currentLevel <= 10 ? this.currentLevel : 'max';
    }
  },
  created() {
  },
  mounted() {
    $(window).on('resize', this.onResize);

    // const params = this.isAdult ? [this.getVideoTag(), this.getVideoSort(), this.getVideoRecommand(), this.getVideoList(), this.getAllGame()] : [this.getAllGame()];

    // 首頁選單列表預設拿local
    const cache = this.getAllGameFromCache();
    const setDefaultSelected = () => {
      this.$nextTick(() => {
        this.isReceive = true;
        setTimeout(() => {
          $(window).trigger('resize');
          const defaultType = localStorage.getItem('type') || 'Welfare';
          const defaultIndex = this.typeList.findIndex(
            type => type.icon === defaultType
          );
          const selectIndex = this.typeList.length / 3 + defaultIndex;
          this.onChangeSelectIndex(selectIndex);
          this.isShow = true;
        }, 300);
      });
    };

    if (!cache) {
      const params = [this.getAllGame()];
      Promise.all(params).then(() => {
        setDefaultSelected();
      });
    } else {
      setDefaultSelected();
      this.getAllGame(true)
    }

    if (!this.loginStatus) {
      return;
    }

    mcenter.vipUserDetail({
      success: ({ result, ret }) => {
        if (result !== 'ok') {
          return;
        }

        this.currentLevel = ret.find(item => item.complex).now_level_seq;
      }
    });
  },
  beforeDestroy() {
    $(window).off('resize', this.onResize);
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    getImg(info) {
      return {
        src: info.image,
        error: this.$getCdnPath(
          `/static/image/_new/common/default_${info.imageType}.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/_new/common/default_${info.imageType}.png`
        )
      };
    },
    // 取得所有遊戲
    getAllGameFromCache() {
      let result = false;
      try {
        let videolistStorage = localStorage.getItem('game-list');
        if (videolistStorage) {
          this.allGame = JSON.parse(localStorage.getItem('game-list'));
          result = true;
        }
      } catch (e) {
        console.log(e);
      }

      return result;
    },
    // 取得所有遊戲
    getAllGame(setLocal) {
      return yaboRequest({
        method: 'get',
        url: `${this.siteConfig.YABO_API_DOMAIN}/game/list`,
        headers: {
          'x-domain': this.memInfo.user.domain
        }
      }).then(response => {
        if (!response.data) {
          return;
        }

        this.isReceive = true;

        try {
          localStorage.setItem('game-list', JSON.stringify(response.data));
          localStorage.setItem('game-list-timestamp', Date.now());
        } catch (e) {
          console.log(e);
        }

        if (!setLocal) {
          this.allGame = [...response.data];
        }
      });
    },
    onResize() {
      // 計算外框高度
      this.wrapHeight =
        window.innerHeight - this.$refs['home-wrap'].offsetTop - 60;
    },
    onTypeTouchStart(e) {
      if (this.isSliding) {
        return;
      }

      // 取得touch起始位置
      this.typeStartTouchY = e.touches[0].clientY;
    },
    onTypeTouchMove(e) {
      if (this.isSliding) {
        return;
      }

      const ele = this.$refs['type-wrap'];
      const isGoBottom = this.typeStartTouchY > e.touches[0].clientY;

      if (
        isGoBottom &&
        ele.scrollHeight - 10 <= ele.scrollTop + ele.clientHeight
      ) {
        e.preventDefault();
      }
    },
    onTouchStart(e) {
      if (this.isSliding) {
        return;
      }

      // 取得touch起始位置
      this.startTouchY = e.touches[0].clientY;
    },
    onTouchMove(e) {
      let wrap = this.$refs['game-wrap'];
      if (this.isSliding) {
        return;
      }

      // 判斷滑動方向
      this.slideDirection =
        this.startTouchY > e.touches[0].clientY ? 'down' : 'up';
      // 判斷是否置頂
      this.isTop = this.slideDirection === 'up' && wrap.scrollTop <= 10;
      // 判斷是否置底
      this.isBottom =
        this.slideDirection === 'down' &&
        wrap.scrollHeight - 10 <= wrap.scrollTop + wrap.clientHeight;
      if (this.isTop || this.isBottom) {
        e.preventDefault();
      }
    },
    onTouchEnd() {
      if (this.isSliding) {
        return;
      }

      if (this.slideDirection === '') {
        return;
      }

      if (this.isTop) {
        const index =
          this.selectedIndex <= 0
            ? this.typeList.length - 1
            : this.selectedIndex - 1;
        this.onChangeSelectIndex(index, true);
        return;
      }

      if (this.isBottom) {
        const index =
          this.selectedIndex >= this.typeList.length - 1
            ? 0
            : this.selectedIndex + 1;
        this.onChangeSelectIndex(index);
      }
    },
    // 切換當前分類
    onChangeSelectIndex(index, isSetEnd = false) {
      this.isSliding = true;
      this.isTop = false;
      this.isBottom = false;
      this.typeStartTouchY = 0;
      this.startTouchY = 0;
      this.slideDirection = '';
      this.selectedIndex = index;
      this.stopScroll = true;

      $(this.$refs['type-wrap']).animate({ scrollTop: index * 63 }, 300);
      $(this.$refs['game-wrap']).animate({ scrollTop: 0 }, 0);

      this.$nextTick(() => {
        this.isSliding = false;
      });

      localStorage.setItem('type', this.typeList[index].icon);

      setTimeout(() => {
        this.stopScroll = false;
        if (isSetEnd) {
          this.$refs['game-wrap'].scrollTop =
            this.$refs['game-wrap'].scrollHeight -
            this.$refs['game-wrap'].clientHeight -
            this.$refs['wrap-buffer'].offsetHeight;
        }
      }, 100);
    },
    // 前往會員中心
    onGoToMcenter(path) {
      if (!this.loginStatus) {
        this.$router.push('/mobile/login');
        return;
      }

      if (path === 'deposit') {
        yaboRequest({
          method: 'get',
          url: `${
            this.siteConfig.YABO_API_DOMAIN
            }/AccountBank/GetBankBindingStatus/${getCookie('cid')}`,
          headers: {
            'x-domain': this.memInfo.user.domain
          }
        }).then(res => {
          if (res.data && res.data) {
            this.$router.push(`/mobile/mcenter/deposit`);
          } else {
            this.actionSetGlobalMessage({ type: 'bindcard', code: 'C50099' });
          }
        });
      } else if (path === 'grade') {
        this.$router.push('/mobile/mcenter/accountVip');
        return;
      } else {
        this.$router.push(`/mobile/mcenter/${path}`);
      }
    },
    // 開啟遊戲
    onOpenGame(game) {
      // Game Type
      // L => 遊戲大廳
      // G => 遊戲
      // BL => 美女直播
      // SL => 體育直播
      // D => 代理
      // T => 敬请期待
      // YV => 鴨脖視頻
      // PV => 小豬視頻
      // BB => 男男視頻
      // GG => 女女視頻

      if (game.type === 'D') {
        return;
      }

      if (game.type === 'T') {
        this.actionSetGlobalMessage({ type: 'incoming' });
        return;
      }

      // 福利
      if (['YV', 'PV', 'BB', 'GG'].includes(game.type)) {
        switch (game.type) {
          case 'YV':
            this.$router.push({
              name: 'videoList',
              query: { source: 'yabo' }
            });
            break;

          case 'PV':
            this.$router.push({
              name: 'videoList',
              query: { source: 'smallPig' }
            });
            break;

          case 'BB':
            this.$router.push({
              name: 'videoList',
              query: { source: 'gay' }
            });
            break;

          case 'GG':
            this.$router.push({
              name: 'videoList',
              query: { source: 'les' }
            });
            break;

          default:
            break;
        }
        return;
      }

      if (!this.loginStatus) {
        this.$router.push('/mobile/login');
        return;
      }

      // 大廳
      if (game.type === 'L' && [3, 5, 6].includes(game.kind)) {
        const trans = { 3: 'casino', 5: 'card', 6: 'mahjong' };
        this.$router.push(`/mobile/${trans[game.kind]}/${game.vendor}`);
        return;
      }


      // 直播
      if (['BL', 'SL'].includes(game.type)) {
        switch (game.type) {
          case 'BL':
            this.$router.push({
              name: 'liveStream',
              params: { type: 'cutiesLive' }
            });
            break;
          case 'SL':
            this.$router.push({
              name: 'liveStream',
              params: { type: 'ballLive' }
            });
            break;
          default:
            break;
        }
        return;
      }

      //   if (game.type === 'R') {
      //     let urlParams =
      //       game.vendor === 'lg_live' ? '&customize=yabo&tableType=3310' : '';
      //     let newWindow = '';
      //     // 辨別裝置是否為ios寰宇瀏覽器
      //     const isUBMobile =
      //       navigator.userAgent.match(/UBiOS/) !== null &&
      //       navigator.userAgent.match(/iPhone/) !== null;
      //     // 暫時用來判斷馬甲包
      //     const webview = window.location.hostname === 'yaboxxxapp02.com';

      //     // ios寰宇瀏覽器目前另開頁面需要與電腦版開啟方式相同
      //     if (!isUBMobile && !webview) {
      //       newWindow = window.open('', '_blank');
      //     }
      //     ajax({
      //       method: 'get',
      //       url: `${API_GET_VENDOR}/${game.vendor}/game/launch`,
      //       errorAlert: false,
      //       params: { kind: game.kind },
      //       success: ({ result, ret }) => {
      //         if (result !== 'ok') {
      //           if (!isUBMobile && !webview) {
      //             newWindow.close();
      //           }
      //           return;
      //         }

      //         if (webview) {
      //           window.location.href = ret.url + urlParams;
      //           return;
      //         }
      //         if (!isUBMobile) {
      //           newWindow.location.href = ret.url + urlParams;
      //           return;
      //         }

      //         window.open(ret.url + urlParams);
      //       },
      //       fail: error => {
      //         if (!isUBMobile || !webview) {
      //           newWindow.alert(
      //             `${error.data.msg} ${
      //             error.data.code ? `(${error.data.code})` : ''
      //             }`
      //           );
      //         }
      //         newWindow.close();
      //         window.location.reload();
      //       }
      //     });
      //     return;
      //   }
      const openGameFailFunc = (res) => {
        if (res && res.data) {
          let data = res.data;
          this.actionSetGlobalMessage({ msg: data.msg, code: data.code, origin: 'home' })
        }
      };
      if (game.type === "R") {
        openGame({ kind: game.kind, vendor: game.vendor, code: game.code, gameType: game.type }, openGameFailFunc);
      } else {
        openGame({ kind: game.kind, vendor: game.vendor, code: game.code }, openGameFailFunc);
      }
    }
  }
};
</script>

<style lang="scss" module>
.home-wrap {
  overflow: hidden;
  position: relative;
  padding: 0 18px 0 13px;
}

.type-wrap {
  overflow-y: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 13px;
  z-index: 1;
  width: 63px;
  touch-action: default; // 誤刪，否則在touchmove事件會有cancelable錯誤
  -webkit-overflow-scrolling: touch; // 誤刪，維持touchmove滾動順暢
}

.type-swiper {
  position: relative;
  width: 63px;
  height: 63px;
  background-image: url("/static/image/_new/platform/icon/icon_bg_n.png");
  background-position: 0 0;
  background-size: 63px 63px;
  background-repeat: no-repeat;

  > img {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 40px;
    height: 40px;
    margin: 0 auto;
  }

  &.active {
    background-image: url("/static/image/_new/platform/icon/icon_bg_h.png");
  }
}

.type-title {
  position: absolute;
  top: 32px;
  right: 0;
  left: 0;
  color: #a6a9b2;
  font-size: 12px;
  text-align: center;

  &.active {
    color: #fff;
  }
}

.all-game-wrap {
  margin-left: 63px;
}

.top-wrap {
  height: 50px;
}

.tag {
  width: auto;

  > div {
    width: 60px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #d5bea4;
    border-radius: 3px;
    color: #bf8646;
    font-size: 12px;
    text-align: center;

    &.active {
      height: 30px;
      line-height: 30px;
      border: none;
      background: linear-gradient(to left, #bd9d7d, #f9ddbd);
      color: #fff;
    }
  }
}

.mcenter-func-wrap {
  width: 100%;
  transition: all 0.5s;
}

.mcenter-wrap {
  float: left;
  width: 20%;

  > img {
    display: block;
    width: 33px;
    height: 33px;
    margin: 0 auto 1px;
  }

  > div {
    height: 16px;
    line-height: 16px;
    color: #ad9982;
    font-size: 12px;
    text-align: center;
  }
}

.game-list-wrap {
  overflow-y: auto;
  touch-action: default; // 誤刪，否則在touchmove事件會有cancelable錯誤
  -webkit-overflow-scrolling: touch; // 誤刪，維持touchmove滾動順暢
}

.wrap {
  overflow: hidden;
  position: relative;
  float: left;
  width: 50%;
  margin-bottom: 3px;
  border-radius: 7px;
  box-sizing: border-box;

  > img {
    display: block;
    width: 100%;
    padding: 0 2px;
  }

  > span {
    position: absolute;
    top: 2px;
    left: 22px;
    color: #9ca3bf;
    font-weight: 700;
    font-size: 12px;
  }

  > div {
    overflow: hidden;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    line-height: 20px;
    border-radius: 0 0 7px 7px;
    background-color: #fff;
    color: #3d3d3d;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.8;
  }
}

.game {
  composes: wrap;

  &.is-full {
    width: 100%;
  }
}

.wrap-buffer {
  width: 100%;
  height: 12%;
  display: block;
  overflow: hidden;
  position: relative;
  float: left;
  box-sizing: border-box;
}
</style>
