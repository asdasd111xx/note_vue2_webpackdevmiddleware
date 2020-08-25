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
            @click="onGoToMcenter(info.path)"
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
            :data-img-type="game.imageType"
            :data-type="game.type"
            :class="[
              $style.game,
              { [$style['is-full']]: [1, 2, 3].includes(game.imageType) },
              { [$style['is-third']]: [4].includes(game.imageType) }
            ]"
            @click.stop="onOpenGame(game)"
          >
            <template v-if="game.imageType === 4">
              <div :class="[$style['third-iamge-wrap']]">
                <div :class="[$style['vendor']]">{{ game.vendor_abridge }}</div>
                <div :class="[$style['third-iamge']]">
                  <img v-lazy="getImg(game)" />
                </div>
                <div :class="[$style['name']]">{{ game.name }}</div>
              </div>
            </template>
            <template v-else>
              <img v-lazy="getImg(game)" />
            </template>
          </div>
        </template>
        <div ref="wrap-buffer" :class="$style['wrap-buffer']" />
      </div>
    </div>
    <page-loading :isShow="isShowLoading" />
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import mixin from '@/mixins/homeContent';

export default {
  mixins: [mixin],
  components: {
    pageLoading: () => import(/* webpackChunkName: 'pageLoading' */ '@/router/mobile/components/common/pageLoading'),
    Swiper,
    SwiperSlide
  },
  mounted() { },
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

  > div:not(.third-iamge-wrap) {
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

  &.is-third {
    width: 31%;
    height: 25%;
    position: relative;
    min-height: 126px;
    background-image: url("/static/image/ey1/game/pic_gamebg.png");
    background-size: 100% 100%;
    background-position: center;
    background-size: auto;
    margin: 0 1%;
  }
}

.third-iamge-wrap {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background-image: url("/static/image/ey1/game/pic_gamebg.png") no-repeat
    center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100%;

  .third-iamge {
    position: absolute;
    left: 0;
    top: 14px;
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      display: block;
      margin: 0 auto;
      max-height: 100%;
      padding: 5px;
      width: 100%;
    }
  }

  > div:not(.third-iamge) {
    height: 14px;
    color: #4e5159;
    font-size: 11px;
    width: 100%;
  }

  > .vendor {
    text-align: left;
    margin: 5px;
  }

  > .name {
    text-align: center;
    position: absolute;
    bottom: 5px;
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
