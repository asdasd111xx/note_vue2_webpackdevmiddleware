<template>
  <div
    v-if="isReceive"
    ref="home-wrap"
    :class="[$style['home-wrap'], 'clearfix']"
  >
    <!-- 上方功能列 -->
    <div :class="$style['top-wrap']">
      <!-- 會員中心連結 -->
      <div :class="[$style['mcenter-func-wrap'], 'clearfix']">
        <div :class="$style['mcenter-login-status-wrap']">
          <div
            v-if="!loginStatus"
            :class="$style['not-login-wrap']"
            @click="$router.push('/mobile/login')"
          >
            <div>
              您还未登录
            </div>
            <div>
              请先登录&nbsp;/&nbsp;注册后查看
            </div>
          </div>
          <div v-else :class="$style['is-login-wrap']">
            <div>
              {{ memInfo.user.username }}
            </div>
            <div :class="$style['vip-level']">
              <div>VIP&nbsp;{{ userViplevel }}</div>
            </div>
            <div
              :class="{ [$style['normal']]: memInfo.user.username.length < 11 }"
            >
              {{ `¥${membalance && membalance.total ? membalance.total : ""}` }}
            </div>
          </div>
        </div>
        <div :class="$style['mcenter-func']">
          <div
            v-for="(info, index) in mcenterEy1List"
            :key="`mcenter-${index}`"
            :class="$style['mcenter-cell']"
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
                    `/static/image/ey1/wallet/icon_wallet_${info.name}.png`
                  )
                "
              />
              <div>{{ info.text }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>
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
        :data-seq="`${type.sequence}`"
        :key="`type-${index}`"
        :class="[
          $style['type-swiper'],
          { [$style.active]: typeList[selectedIndex].icon === type.icon }
        ]"
        @click="onChangeSelectIndex(index)"
      >
        <img
          :src="
            $getCdnPath(
              `/static/image/ey1/platform/icon/icon2_${type.icon.toLowerCase()}_${
                typeList[selectedIndex].icon === type.icon ? 'h' : 'n'
              }.png`
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
                <div :class="[$style['third-iamge-bg']]">
                  <div :class="[$style['vendor']]">
                    {{ game.vendor_abridge }}
                  </div>
                  <div :class="[$style['third-iamge']]">
                    <img v-lazy="getImg(game)" />
                  </div>
                </div>
                <div :class="[$style['name']]">{{ game.name }}</div>
              </div>
            </template>
            <template v-else>
              <img v-lazy="getImg(game)" :alt="game.name" />
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
  data() {
    return {
      userViplevel: ""
    }
  },
  ...mapGetters({
    loginStatus: 'getLoginStatus',
  }),
  mounted() {
    if (this.loginStatus) {
      this.getUserViplevel();
    }
  },
};
</script>

<style lang="scss" module>
.home-wrap {
  overflow: hidden;
  position: relative;
  padding: 0 18px 0 13px;
  margin-top: 1px;
}

.type-wrap {
  overflow-y: auto;
  position: absolute;
  top: 72px;
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
  background-image: url("/static/image/ey1/platform/icon/btn_menu_n.png");
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
    background-image: url("/static/image/ey1/platform/icon/btn_menu_h.png");
  }
}

.type-title {
  position: absolute;
  top: 32px;
  right: 0;
  left: 0;
  color: #ff7171;
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
  height: 72px;
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

@media only screen and (max-width: 374px) {
  .mcenter-login-status-wrap {
    max-width: 33%;
  }
}

.mcenter-login-status-wrap {
  position: relative;
  padding-left: 5px;
  float: left;
  height: 100%;
  width: 140px;

  > .not-login-wrap {
    > div {
      height: 50%;
      line-height: 25px;
    }

    font-size: 17px;
    font-weight: 700;
    text-align: left;
    color: #fe9154;

    > div:last-of-type {
      height: 50%;
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      color: #4e5159;
    }
  }

  .is-login-wrap {
    position: relative;

    > div:first-of-type {
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      color: #4e5159;
      position: relative;
      word-break: break-all;
      display: inline-block;
      margin-right: 4px;
    }

    > div:last-of-type {
      font-size: 16px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      text-align: left;
      color: #4e5159;

      &.normal {
        margin-top: 5px;
      }
    }
  }
}

.vip-level {
  color: #ffffff;
  font-weight: 700;
  display: inline-block;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 16px;
    width: 40px;
    font-size: 12px;
    background: linear-gradient(#ffd68a, #fe9154);
    border-radius: 3px;
  }
}

.mcenter-func-wrap {
  width: 100%;
  height: 72px;
  transition: all 0.5s;
}

.mcenter-func {
  position: absolute;
  right: 14px;
}

.mcenter-cell {
  float: left;
  margin: 0 5px;

  > img {
    display: block;
    width: 40px;
    height: 40px;
    margin: 0 auto 1px;
  }

  > div {
    height: 16px;
    line-height: 16px;
    color: #ff8400;
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
    max-height: 150px;
    position: relative;
    min-height: 126px;
    margin: 0 1%;
  }
}

.third-iamge-wrap {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

  > div:not(.third-iamge):not(.third-iamge-bg) {
    height: 14px;
    color: #4e5159;
    font-size: 11px;
  }

  .vendor {
    text-align: left;
    padding-left: 10%;
    padding-top: 10%;
  }

  .name {
    text-align: center;
    position: absolute;
    bottom: 4px;
    width: 100%;
  }
}

.third-iamge-bg {
  background: url("/static/image/ey1/game/pic_gamebg.png");
  background-size: 115% 100%;
  background-repeat: no-repeat;
  background-position: -7px -5px;
  width: 100%;
  height: 100%;
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
