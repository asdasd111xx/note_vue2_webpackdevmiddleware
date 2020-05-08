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
        @click="onChangeSelectInedx(index)"
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
    <div :class="$style['all-game-wrap']">
      <!-- 上方功能列 -->
      <div :class="$style['top-wrap']">
        <!-- 影片分類 -->
        <div
          v-if="isAdult && selectedIndex === 0"
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
              :src="$getCdnPath('/static/image/_new/common/icon_more.png')"
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
        :style="{ height: `${wrapHeight - 50}px` }"
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
            :key="`game-${i}`"
            :class="[$style.game, { [$style['is-full']]: game.imageType > 0 }]"
            @click.stop="onOpenGame(game)"
          >
            <img :src="game.image" />
            <span v-if="!['D', 'R'].includes(game.type) && game.name">{{
              game.name
            }}</span>
          </div>
        </template>
      </div>
    </div>
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">{{ msg }}</div>
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
import { API_PORN1_DOMAIN, API_GET_VENDOR } from '@/config/api';
import ajax from '@/lib/ajax';
import openGame from '@/lib/open_game';
import message from '../../common/new/message';

export default {
  components: {
    message,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
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
      msg: ''
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
      const typeList = [...adultVideo, ...this.allGame.map((game) => ({ icon: game.iconName, name: game.name }))];
      // 業主說左側選單前後要各複製一份...
      return [...typeList, ...typeList, ...typeList];
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
  mounted() {
    $(window).on('resize', this.onResize);

    const params = this.isAdult ? [this.getVideoTag(), this.getVideoSort(), this.getVideoRecommand(), this.getVideoList(), this.getAllGame()] : [this.getAllGame()];

    Promise.all(params).then(() => {
      this.isReceive = true;

      this.$nextTick(() => {
        setTimeout(() => {
          $(window).trigger('resize');
          const defaultType = localStorage.getItem('type') || 'Tv';
          const defaultIndex = this.typeList.findIndex((type) => type.icon === defaultType);
          const selectIndex = (this.typeList.length / 3) + defaultIndex;
          this.onChangeSelectInedx(selectIndex);
          this.isShow = true;
        }, 300);
      });
    });

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
    // 取得影片分類
    getVideoTag() {
      return axios({
        method: 'get',
        url: `${API_PORN1_DOMAIN}/api/v1/video/tag`,
        timeout: 30000,
        headers: {
          Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
          Version: 1
        }
      }).then((response) => {
        if (response.status !== 200) {
          return;
        }

        this.videoTag = [{ id: 0, title: '全部' }, ...response.data.result];
      });
    },
    // 取得影片排序
    getVideoSort() {
      return axios({
        method: 'get',
        url: `${API_PORN1_DOMAIN}/api/v1/video/sort`,
        timeout: 30000,
        headers: {
          Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
          Version: 1
        }
      }).then((response) => {
        if (response.status !== 200) {
          return;
        }

        this.videoSort = [...response.data.result];
      });
    },
    // 取得熱門推薦影片
    getVideoRecommand() {
      return axios({
        method: 'get',
        url: `${API_PORN1_DOMAIN}/api/v1/video/recommand`,
        timeout: 30000,
        headers: {
          Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
          Version: 1
        }
      }).then((response) => {
        if (response.status !== 200) {
          return;
        }

        this.videoRecommand = [...response.data.result];
      });
    },
    // 取得所有影片(熱門推薦除外)
    getVideoList() {
      return axios({
        method: 'post',
        url: `${API_PORN1_DOMAIN}/api/v1/video/videolist`,
        timeout: 30000,
        data: querystring.stringify({ tag: this.videoType.title }),
        headers: {
          Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
          Version: 1
        }
      }).then((response) => {
        if (response.status !== 200) {
          return;
        }

        this.videoList = [...response.data.result];
      });
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
      if (this.isSliding) {
        return;
      }

      // 判斷滑動方向
      this.slideDirection = this.startTouchY > e.touches[0].clientY ? 'down' : 'up';
      // 判斷是否置頂
      this.isTop = this.slideDirection === 'up' && this.$refs['game-wrap'].scrollTop <= 10;
      // 判斷是否置底
      this.isBottom = this.slideDirection === 'down' && this.$refs['game-wrap'].scrollHeight - 10 <= this.$refs['game-wrap'].scrollTop + this.$refs['game-wrap'].clientHeight;

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
        this.onChangeSelectInedx(index);
        return;
      }

      if (this.isBottom) {
        const index = this.selectedIndex >= this.typeList.length - 1 ? 0 : this.selectedIndex + 1;
        this.onChangeSelectInedx(index);
      }
    },
    // 切換當前分類
    onChangeSelectInedx(index) {
      this.isSliding = true;
      this.isTop = false;
      this.isBottom = false;
      this.typeStartTouchY = 0;
      this.startTouchY = 0;
      this.slideDirection = '';
      this.selectedIndex = index;

      $(this.$refs['type-wrap']).animate({ scrollTop: index * 63 }, 300);

      this.$nextTick(() => {
        if (this.$refs['game-wrap']) {
          this.$refs['game-wrap'].scrollTop = 0
        }
        this.isSliding = false;
      });
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

      if (path === 'grade') {
        this.$router.push('/mobile/mcenter/accountVip');
        return;
      }

      this.$router.push(`/mobile/mcenter/${path}`);
    },
    // 開啟遊戲
    onOpenGame(game) {
      localStorage.setItem('type', this.typeList[this.selectedIndex].icon);

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

      if (game.type === 'R') {
        const win = window.open('about:blank');

        ajax({
          method: 'get',
          url: `${API_GET_VENDOR}/${game.vendor}/game/launch`,
          errorAlert: false,
          params: { kind: game.kind },
          success: ({ result, ret }) => {
            if (result !== 'ok') {
              win.close();
              return;
            }
            win.location.href = `${ret.url}&customize=yabo&tableType=3310`;
          },
          fail: () => {
            win.close();
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
  width: calc(100% - 52px);
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
  width: 19px;
  height: 19px;
  margin-top: 16px;
  transition: all 0.1s;

  > img {
    display: block;
    width: 100%;
  }

  &.active {
    transform: rotate(180deg);
  }
}

.all-tag-wrap {
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  z-index: 2;
  background-color: #fff;
  opacity: 0.9;

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
</style>
