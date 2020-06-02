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
        <!-- 影片分類 -->
        <div
          v-if="isAdult && typeList[selectedIndex].icon === 'Tv'"
          :class="[$style['video-tag-wrap'], 'clearfix']"
        >
          <div
            :class="$style['btn-search']"
            @click="$router.push({ name: 'search' })"
          >
            <img
              :src="$getCdnPath('/static/image/_new/common/icon_search.png')"
            />
          </div>
          <div :class="[$style['video-tag'], 'clearfix']">
            <swiper ref="tag-swiper" :options="options">
              <swiper-slide
                v-for="(tag, index) in videoTag"
                :key="`tag-${index}`"
              >
                <div
                  :class="{ [$style.active]: tag.id === videoType.id }"
                  @click="onChangeVideoType(index)"
                >
                  {{ tag.title }}
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <div
            :class="[$style['icon-arrow'], { [$style.active]: isShowAllTag }]"
            @click.stop="onShowAllTag(!isShowAllTag)"
          >
            <img
              :src="
                $getCdnPath(
                  `/static/image/_new/common/icon_more${
                    isShowAllTag ? '_close' : ''
                  }.png`
                )
              "
            />
          </div>
          <div
            v-if="isShowAllTag"
            :class="[$style['all-tag-wrap'], 'clearfix']"
          >
            <template v-for="(tag, index) in videoTag">
              <div :key="`all-tag-${index}`" @click="onChangeVideoType(index)">
                {{ tag.title }}
              </div>
            </template>
          </div>
        </div>
        <!-- 會員中心連結 -->
        <div v-else :class="[$style['mcenter-func-wrap'], 'clearfix']">
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
        <!-- 影片 -->
        <template v-if="currentGame.isVideo">
          <div
            v-for="(videoData, i) in currentGame.data"
            :key="`video-type-${i}`"
            :class="$style['video-list-wrap']"
          >
            <div :class="[$style['video-type'], 'clearfix']">
              <div :class="$style['type-name']">{{ videoData.name }}</div>
              <div
                :class="$style['btn-more']"
                @click.stop="
                  openVideo('videoList', {
                    query: { tagId: videoType.id, sortId: videoData.id || 0 }
                  })
                "
              >
                更多
              </div>
            </div>
            <div :class="['video-wrap', 'clearfix']">
              <div
                v-for="video in videoData.list.slice(0, 2)"
                :key="`video-${video.id}`"
                :href="`/mobile/videoPlay/${video.id}`"
                :class="$style.video"
                @click.stop="
                  openVideo('videoPlay', { params: { id: video.id } })
                "
              >
                <img :src="video.image" />
                <div>{{ video.title }}</div>
              </div>
            </div>
          </div>
        </template>
        <!-- 遊戲 -->
        <template v-else>
          <div
            v-for="(game, i) in currentGame.vendors"
            :key="`game-${i}-${game.image}`"
            :class="[$style.game, { [$style['is-full']]: game.imageType > 0 }]"
            @click.stop="onOpenGame(game)"
          >
            <img v-lazy="getImg(game)" />
            <span v-if="!['D', 'R'].includes(game.type) && game.name">{{
              game.name
            }}</span>
          </div>
        </template>
        <div ref="wrap-buffer" :class="$style['wrap-buffer']" />
      </div>
    </div>
    <message v-if="msg" @close="clearMsg">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
  </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import axios from 'axios';
import querystring from 'querystring';
import find from 'lodash/find';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import mcenter from '@/api/mcenter';
import { API_GET_VENDOR } from '@/config/api';
import ajax from '@/lib/ajax';
import openGame from '@/lib/open_game';
import message from '../../common/new/message';
import common from '@/api/common';
import pornRequest from '@/api/pornRequest';
import { getCookie, setCookie } from '@/lib/cookie';

export default {
  components: {
    message,
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
      videoTag: [],
      videoSort: [],
      videoRecommand: [],
      videoList: [],
      allGame: [],
      videoType: { id: 0, title: '' },
      selectedIndex: 0,
      currentLevel: 0,
      mcenterList: [
        { name: 'deposit', text: '充值' },
        { name: 'balanceTrans', text: '转帐' },
        { name: 'withdraw', text: '提现' },
        { name: 'accountVip', text: 'VIP' },
        { name: 'grade', text: '等级' }
      ],
      msg: '',
      hasBankCard: false,
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo'
    }),
    isAdult() {
      return this.memInfo.config.content_rating && this.memInfo.user.content_rating;
    },
    typeList() {
      const adultVideo = this.isAdult ? [{ icon: 'Tv', name: '影片' }] : [];
      if (this.allGame) {
        const typeList = [...adultVideo, ...this.allGame.map((game) => ({ icon: game.iconName, name: game.name }))];
        // 業主說左側選單前後要各複製一份...
        return [...typeList, ...typeList, ...typeList];
      } else {
        return [...adultVideo];
      }
    },
    options() {
      return { slidesPerView: 'auto', spaceBetween: 4, slideClass: this.$style.tag };
    },
    allGameList() {
      const gameList = this.allGame.map((game) => ({ ...game, isVideo: false }));

      if (!this.isAdult) {
        return [...gameList];
      }

      const videoRecommand = this.videoType.id === 0 ? [...this.videoRecommand] : [];
      const videoList = this.videoSort.reduce((init, sort) => {
        const data = find(this.videoList, (video) => video.id === sort.id);

        if (!data) {
          return init;
        }

        return [...init, { ...data }];
      }, [...videoRecommand]);

      return [{ isVideo: true, data: videoList }, ...gameList];
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
  watch: {
    videoType() {
      this.getVideoList();
    }
  },
  created() {
    if (this.loginStatus) {
      ajax({
        method: 'get',
        url: '/api/v1/c/player/user_bank/list',
        errorAlert: false
      }).then((res) => {
        this.hasBankCard = res.ret && res.ret.length > 0
      });
    }
  },
  mounted() {
    $(window).on('resize', this.onResize);

    // const params = this.isAdult ? [this.getVideoTag(), this.getVideoSort(), this.getVideoRecommand(), this.getVideoList(), this.getAllGame()] : [this.getAllGame()];

    if (this.isAdult) {
      this.getVideoTag();
      this.getVideoSort();
      this.getVideoRecommand();
      this.getVideoList()
    }

    // 首頁選單列表預設拿local
    const cache = this.getAllGameFromCache();
    const setDefaultSelected = () => {
      this.$nextTick(() => {
        this.isReceive = true;
        setTimeout(() => {
          $(window).trigger('resize');
          const defaultType = localStorage.getItem('type') || 'Tv';
          const defaultIndex = this.typeList.findIndex((type) => type.icon === defaultType);
          const selectIndex = (this.typeList.length / 3) + defaultIndex;
          this.onChangeSelectIndex(selectIndex);
          this.isShow = true;
        }, 300);
      });
    }

    if (!cache) {
      const params = [this.getAllGame()]
      Promise.all(params).then(() => {
        setDefaultSelected();
      });
    } else {
      setDefaultSelected();
    }

    if (!this.loginStatus) {
      return;
    }

    mcenter.vipUserDetail({
      success: ({ result, ret }) => {
        if (result !== 'ok') {
          return;
        }

        this.currentLevel = ret.find((item) => item.complex).now_level_seq;
      }
    });
  },
  beforeDestroy() {
    $(window).off('resize', this.onResize);
  },
  methods: {
    getImg(info) {
      return {
        src: info.image,
        error: this.$getCdnPath(`/static/image/_new/common/default_${info.imageType}.png`),
        loading: this.$getCdnPath(`/static/image/_new/common/default_${info.imageType}.png`)
      };
    },
    clearMsg() {
      if (this.msg.includes('银行卡')) {
        this.$router.push('/mobile/mcenter/bankCard?redirect=home');
      }

      this.msg = '';
    },
    // 取得影片分類
    getVideoTag() {
      try {
        let videolistStorage = localStorage.getItem('video-tag');
        if (videolistStorage) {
          this.videoTag = JSON.parse(localStorage.getItem('video-tag'));
        }

      } catch (e) {
        console.log(e)
      }

      return pornRequest({
        url: '/video/tag',
        method: 'get',
      }).then((response) => {
        if (response.status !== 200) {
          return;
        }

        try {
          localStorage.setItem('video-tag', JSON.stringify([{ id: 0, title: '全部' }, ...response.result]))
          localStorage.setItem('video-tag-timestamp', Date.now())
        } catch (e) {
          console.log(e)
        }

        this.videoTag = [{ id: 0, title: '全部' }, ...response.result];
      });

    },
    // 取得影片排序
    getVideoSort() {
      try {
        let videolistStorage = localStorage.getItem('video-sort');
        if (videolistStorage) {
          this.videoSort = JSON.parse(localStorage.getItem('video-sort'));
        }

      } catch (e) {
        console.log(e)
      }

      return pornRequest({
        method: 'get',
        url: '/video/sort',
      }).then((response) => {
        if (response.status !== 200) {
          return;
        }

        try {
          localStorage.setItem('video-sort', JSON.stringify(response.result))
          localStorage.setItem('video-sort-timestamp', Date.now())
        } catch (e) {
          console.log(e)
        }

        this.videoSort = [...response.result];
      });
    },
    // 取得熱門推薦影片
    getVideoRecommand() {
      return pornRequest({
        url: `/video/recommand`,
      }).then((response) => {
        if (response.status !== 200) {
          return;
        }

        this.videoRecommand = [...response.result];
      });
    },
    // 取得所有影片(熱門推薦除外)
    getVideoList() {
      try {
        let videolistStorage = localStorage.getItem('video-list');
        if (videolistStorage) {
          this.videoList = JSON.parse(localStorage.getItem('video-list'));
        }

      } catch (e) {
        console.log(e)
      }

      return pornRequest({
        method: 'post',
        url: `/video/videolist`,
        data: { tag: this.videoType.title === '全部' ? '' : this.videoType.title },
      }).then((response) => {
        if (response.status !== 200) {
          return;
        }

        try {
          localStorage.setItem('video-list', JSON.stringify(response.result))
          localStorage.setItem('video-list-timestamp', Date.now())
        } catch (e) {
          console.log(e)
        }

        this.videoList = [...response.result];
      });
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
        console.log(e)
      }

      return result;
    },
    // 取得所有遊戲
    getAllGame() {
      return axios({
        method: 'get',
        url: `${this.siteConfig.YABO_API_DOMAIN}/game/list`,
        timeout: 30000,
        headers: {
          Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
          Version: 1,
          'x-domain': this.memInfo.user.domain
        }
      }).then((response) => {
        if (response.status !== 200) {
          return;
        }
        this.isReceive = true;

        try {
          localStorage.setItem('game-list', JSON.stringify(response.data.data))
          localStorage.setItem('game-list-timestamp', Date.now())
        } catch (e) {
          console.log(e)
        }

        this.allGame = [...response.data.data];
      });
    },
    onResize() {
      // 計算外框高度
      this.wrapHeight = window.innerHeight - this.$refs['home-wrap'].offsetTop - 60;
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

      if (isGoBottom && ele.scrollHeight - 10 <= ele.scrollTop + ele.clientHeight) {
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
      this.slideDirection = this.startTouchY > e.touches[0].clientY ? 'down' : 'up';
      // 判斷是否置頂
      this.isTop = this.slideDirection === 'up' && wrap.scrollTop <= 10;
      // 判斷是否置底
      this.isBottom = this.slideDirection === 'down' && wrap.scrollHeight - 10 <= wrap.scrollTop + wrap.clientHeight;
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
        const index = this.selectedIndex <= 0 ? this.typeList.length - 1 : this.selectedIndex - 1;
        this.onChangeSelectIndex(index, true);
        return;
      }

      if (this.isBottom) {
        const index = this.selectedIndex >= this.typeList.length - 1 ? 0 : this.selectedIndex + 1;
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
          this.$refs['game-wrap'].scrollTop = this.$refs['game-wrap'].scrollHeight - this.$refs['game-wrap'].clientHeight - this.$refs['wrap-buffer'].offsetHeight;
        }
      }, 100);
    },
    // 切換當前影片分類
    onChangeVideoType(index) {
      this.onShowAllTag(false);
      this.videoType = { ...this.videoTag[index] };

      this.$nextTick(() => {
        this.$refs['tag-swiper'].$swiper.slideTo(index);
      });
    },
    // 開啟影片分類選單
    onShowAllTag(value) {
      this.isShowAllTag = value;
    },
    // 前往會員中心
    onGoToMcenter(path) {
      if (!this.loginStatus) {
        this.$router.push('/mobile/login');
        return;
      }

      if (path === 'deposit') {
        axios({
          method: 'get',
          url: `${this.siteConfig.YABO_API_DOMAIN}/AccountBank/GetBankBindingStatus/${getCookie('cid')}`,
          timeout: 30000,
          headers: {
            Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
            Version: 1,
            'x-domain': this.memInfo.user.domain
          }
        }).then((res) => {
          if (res.data && res.data.data) {
            this.$router.push(`/mobile/mcenter/deposit`);
          }
          else {
            this.msg = "请先绑定提现银行卡"
          }
        });
      }

      else if (path === 'grade') {
        this.$router.push('/mobile/mcenter/accountVip');
        return;
      }

      else {
        this.$router.push(`/mobile/mcenter/${path}`);
      }
    },
    // 開啟遊戲
    onOpenGame(game) {
      if (process.env.NODE_ENV === 'development') {
        console.log(game)
      }

      // Game Type
      // L => 遊戲大廳
      // G => 遊戲
      // BL => 美女直播
      // SL => 體育直播
      // D => 代理
      // T => 敬请期待
      if (game.type === 'D') {
        return;
      }

      if (!this.loginStatus) {
        this.$router.push('/mobile/login');
        return;
      }

      if (game.type === 'L' && [3, 5, 6].includes(game.kind)) {
        const trans = { 3: 'casino', 5: 'card', 6: 'mahjong' };
        this.$router.push(`/mobile/${trans[game.kind]}/${game.vendor}`);
        return;
      }

      if (game.type === 'T') {
        this.msg = '正在上线 敬请期待';
        return;
      }

      if (['BL', 'SL'].includes(game.type)) {
        switch (game.type) {
          case 'BL':
            this.$router.push({ name: 'liveStream', params: { type: 'cutiesLive' } });
            break;
          case 'SL':
            this.$router.push({ name: 'liveStream', params: { type: 'ballLive' } });
            break;
          default:
            break;
        }
        return;
      }

      if (!this.hasBankCard) {
        this.msg = "请先绑定提现银行卡"
        return;
      }

      if (game.type === 'R') {
        let urlParams = game.vendor === 'lg_live' ? '&customize=yabo&tableType=3310' : '';
        let newWindow = '';
        // 辨別裝置是否為ios寰宇瀏覽器
        const isUBMobile = navigator.userAgent.match(/UBiOS/) !== null && navigator.userAgent.match(/iPhone/) !== null;
        // 暫時用來判斷馬甲包
        const webview = window.location.hostname === 'yaboxxxapp02.com';

        // ios寰宇瀏覽器目前另開頁面需要與電腦版開啟方式相同
        if (!isUBMobile && !webview) {
          newWindow = window.open('', '_blank');
        }
        ajax({
          method: 'get',
          url: `${API_GET_VENDOR}/${game.vendor}/game/launch`,
          errorAlert: false,
          params: { kind: game.kind },
          success: ({ result, ret }) => {
            if (result !== 'ok') {
              if (!isUBMobile && !webview) {
                newWindow.close();
              }
              return;
            }

            if (webview) {
              window.location.href = ret.url + urlParams;
              return;
            }
            if (!isUBMobile) {
              newWindow.location.href = ret.url + urlParams;
              return;
            }

            window.open(ret.url + urlParams);
          },
          fail: (error) => {
            if (!isUBMobile || !webview) {
              newWindow.alert(`${error.data.msg} ${error.data.code ? `(${error.data.code})` : ''}`);
            }
            newWindow.close();
            window.location.reload();
          }
        });
        return;
      }

      openGame({ kind: game.kind, vendor: game.vendor, code: game.code });
    },
    openVideo(name, routerParam) {
      localStorage.setItem('type', 'Tv');
      this.$router.push({ name, ...routerParam });
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

.video-tag-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  transition: all 0.5s;
}

.btn-search {
  float: left;
  width: 20px;
  height: 22px;
  margin: 14px 9px 14px 1px;

  > img {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.video-tag {
  float: left;
  width: calc(100% - 32px);
  height: 30px;
  margin: 10px 0;
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

.icon-arrow {
  float: right;
  width: 30px;
  height: 100%;
  position: absolute;
  right: 0;
  transition: all 0.1s;
  align-items: center;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: -webkit-linear-gradient(
    left,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 1)
  );
  background: -o-linear-gradient(
    right,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 1)
  );
  background: -moz-linear-gradient(
    right,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 1)
  );
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 1)
  );

  > img {
    display: block;
    width: 19px;
  }

  &.active {
  }
}

.all-tag-wrap {
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  z-index: 2;
  background-color: #fff;

  > div {
    float: left;
    width: 23%;
    height: 28px;
    line-height: 28px;
    margin: 0 1% 4px;
    border: 1px solid #d5bea4;
    border-radius: 5px;
    color: #d5bea4;
    font-size: 14px;
    text-align: center;
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

.video-list-wrap {
  padding: 8px 0 1px;
}

.video-type {
  margin-bottom: 5px;
}

.type-name {
  float: left;
  height: 20px;
  line-height: 20px;
  padding-left: 20px;
  background: url("/static/image/_new/common/icon_item.png") 0 50% no-repeat;
  background-size: 15px 15px;
  color: #be9e7f;
  font-weight: 700;
  font-size: 12px;
}

.btn-more {
  float: right;
  width: 53px;
  height: 20px;
  line-height: 20px;
  border-radius: 3px;
  background: linear-gradient(to left, #bd9d7d, #f9ddbd);
  color: #fff;
  font-size: 12px;
  text-align: center;

  &:hover {
    color: #fff;
  }
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

.video {
  composes: wrap;
  height: 117px;

  > img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    min-height: 100%;
    margin: auto;
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
