<template>
  <div
    v-if="isReceive"
    ref="home-wrap"
    :class="[$style['home-wrap'], 'clearfix']"
  >
    <!-- 上方功能列 -->
    <div
      :class="$style['top-wrap']"
      :style="{
        'background-image': `url(
                ${$getCdnPath(`/static/image/ey1/home/nav01_bg.png`)}
              )`
      }"
    >
      <!-- 會員中心連結 -->
      <div :class="[$style['mcenter-func-wrap'], 'clearfix']">
        <div :class="$style['mcenter-login-status-wrap']">
          <!-- 尚未登入 -->
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

          <!-- 已登入 -->
          <div v-else :class="$style['is-login-wrap']">
            <div :class="$style['username']">
              {{ memInfo.user.username }}
            </div>
            <div :class="$style['vip-level']">
              <div>VIP&nbsp;{{ userViplevel }}</div>
            </div>
            <div :class="$style['balance-wrap']">
              <span :class="$style['wallet']">
                {{ $text("S_MCENTER_WALLET") }}
              </span>
              <span :class="$style['balance']">
                {{
                  `¥${membalance && membalance.total ? membalance.total : ""}`
                }}
              </span>
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
            <template v-else-if="info.name !== 'makemoney' || showPromotion">
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

      <!-- 上方自選列表 -->
      <div :class="$style['type-wrap-container']">
        <div
          v-for="(type, index) in newTypeList"
          :key="`type-${index}`"
          :class="[
            $style['type-item'],
            { [$style.active]: currentType.key === type.key }
          ]"
          :id="`type-${index}`"
          @click="onChangeSelectType(type, true)"
          :style="{ width: `${typeItemWidth}px` }"
        >
          <div
            :class="[
              $style['type-name'],
              { [$style.active]: currentType.key === type.key }
            ]"
          >
            {{ type.name }}
          </div>
        </div>

        <div
          v-if="typeBarPosition !== null"
          :class="[$style['type-slide-bar']]"
          :style="{
            left: `${typeBarPosition}px`
          }"
        >
          <div :class="[$style['type-slide-bar-hover']]">
            <img :src="$getCdnPath(`/static/image/ey1/home/navhover.png`)" />
          </div>

          <div :class="[$style['type-slide-bar-name']]">
            <img
              :src="$getCdnPath(`/static/image/ey1/home/navbtn_bg_active.png`)"
            />
            <div>
              {{ currentType.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      :class="$style['new-game-wrap']"
      :style="{
        height: `${eyWrapHeight}px`
      }"
    >
      <swiper
        ref="gameSwiper"
        :updatedKey="gameSwiperUpdatedKey"
        :options="gameSwiperOptions"
        :class="$style['new-game-container']"
      >
        <swiperSlide
          v-for="(list, key) in allGameList"
          :key="`game-swiper-${key}`"
          :class="[$style['game-swiper-slide'], 'swiper-slide']"
        >
          <template>
            <div
              v-for="(game, i) in list.vendors"
              :key="`game-${i}-${game.image}`"
              :data-img-type="game.imageType"
              :data-type="game.type"
              :class="[
                $style.game,
                { [$style['is-full']]: [1, 2, 3].includes(game.imageType) },
                { [$style['is-third']]: [4].includes(game.imageType) },
                { [$style['is-activity']]: [5].includes(game.imageType) }
              ]"
            >
              <template v-if="game.imageType === 4">
                <div
                  :class="[$style['third-iamge-wrap']]"
                  @click="onOpenGame(game)"
                >
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
                <img
                  v-lazy="getImg(game)"
                  :alt="game.name"
                  @click="onOpenGame(game)"
                />
              </template>
            </div>
          </template>

          <!-- 子項目 -->
          <!-- <swiper
            :key="`sub-ganme-swiper-${key}`"
            :class="[$style['sub-game-container']]"
            :options="subGameSwiperOptions(list)"
            :updatedKey="subGameSwiperUpdatedKey"
          >
            <swiperSlide
              v-for="(game, index) in list.vendors"
              :key="`sub-ganme-swiper-slide-${index}`"
              :class="['swiper-slide', $style['sub-game-swiper-slider']]"
            >
              <div
                :class="[
                  $style.game,
                  { [$style['is-full']]: [1, 2, 3].includes(game.imageType) },
                  { [$style['is-third']]: [4].includes(game.imageType) },
                  { [$style['is-activity']]: [5].includes(game.imageType) }
                ]"
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
            </swiperSlide>
          </swiper>
          -->
        </swiperSlide>
      </swiper>

      <!-- <div
        ref="game-wrap"
        :class="[$style['game-list-wrap'], 'clearfix']"
        :style="{
          height: `${wrapHeight}px`,
          'overflow-y': `${stopScroll ? 'hidden' : 'auto'}`,
          opacity: stopScroll ? 0 : 1
        }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <template>
          <div
            v-for="(game, i) in currentGame.vendors"
            :key="`game-${i}-${game.image}`"
            :data-img-type="game.imageType"
            :data-type="game.type"
            :class="[
              $style.game,
              { [$style['is-full']]: [1, 2, 3].includes(game.imageType) },
              { [$style['is-third']]: [4].includes(game.imageType) },
              { [$style['is-activity']]: [5].includes(game.imageType) }
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
      </div> -->
    </div>
    <page-loading :isShow="isLoading" />
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import mixin from "@/mixins/homeContent";

export default {
  mixins: [mixin],
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      userViplevel: "",
      newTypeList: [],
      currentType: { key: 0 },
      gameSwiperUpdatedKey: 0,
      subGameSwiperUpdatedKey: 0,
      eyWrapHeight: 420,
      typeBarPosition: null
    };
  },
  computed: {
    gameSwiperOptions() {
      return {
        direction: "vertical",
        loop: true,
        observer: true,
        observeParents: true,
        // slidesPerView: "auto",
        lazy: {
          loadPrevNext: true
        },
        // mousewheel: true,
        on: {
          slideChangeTransitionStart: () => {
            if (
              this.newTypeList &&
              this.$refs["gameSwiper"] &&
              this.$refs["gameSwiper"].$swiper
            ) {
              let realIndex = this.$refs["gameSwiper"].$swiper.realIndex;
              this.onChangeSelectType(this.newTypeList[realIndex], false);
            }
          }
        }
      };
    },

    typeItemWidth() {
      return "48";
    }
  },
  ...mapGetters({
    loginStatus: "getLoginStatus"
  }),
  watch: {
    allGame() {
      // const list = [
      //   { key: 0, name: "我的自选" },
      //   { key: 1, name: "视讯" },
      //   { key: 2, name: "彩票" },
      //   { key: 3, name: "体育" },
      //   { key: 4, name: "棋牌" },
      //   { key: 5, name: "电子" }
      // ];
      if (this.allGame) {
        this.newTypeList = this.allGame.map((game, key) => ({
          key: key,
          category: game.category,
          id: game.id,
          icon: game.iconName.toLowerCase(),
          name: game.name
        }));

        // 預設第一個選單
        if (this.newTypeList) {
          this.currentType = this.newTypeList[0];
          this.$nextTick(() => {
            this.onChangeSelectType(this.currentType, false, true);
          });
        }
      }
    }
  },
  methods: {
    onResize() {
      let homeSliderHeight =
        document.getElementById("home-slider") &&
        document.getElementById("home-slider").offsetHeight
          ? document.getElementById("home-slider").offsetHeight
          : 120;

      // header + footer 上方功能列
      let extraHeight = 30 + 120 + 60 + homeSliderHeight + 10;
      this.eyWrapHeight =
        document.body.offsetHeight - extraHeight > 0
          ? document.body.offsetHeight - extraHeight
          : 420;

      // this.onChangeSelectType(this.currentType, true, true);
    },
    subGameSwiperOptions(item) {
      // console.log(item);
      return {
        direction: "vertical",
        nested: true,
        slidesPerGroup: item.vendors.length
      };
    },
    onChangeSelectType(item, slide = false, focus = false) {
      if (this.currentType == item && !focus) {
        return;
      }

      this.currentType = item;

      let target = document.getElementById(`type-${this.currentType.key}`);
      if (target) {
        let rect = target.getBoundingClientRect();
        this.typeBarPosition = rect.x - 15;
      } else {
        this.typeBarPosition = 0;
      }

      if (
        slide &&
        this.$refs["gameSwiper"] &&
        this.$refs["gameSwiper"].$swiper
      ) {
        this.$refs["gameSwiper"].$swiper.slideTo(+item.key + 1);
      }
    }
  },
  beforeMount() {
    window.removeEventListener("resize", this.onResize);
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    if (this.loginStatus) {
      this.getUserViplevel();
    }
  }
};
</script>

<style lang="scss" module>
.home-wrap {
  overflow: hidden;
  position: relative;
  padding: 0;
  margin-top: 1px;
  background: #f1f1f1;
  z-index: 4;

  // 陰影缺美術
  // border-radius: 17.5px;
  // border: 1px solid gray;
  // box-shadow: 2px 2px 2px 2px gray;
}

.type-wrap-container {
  position: relative;
  height: 35px;
  line-height: 35px;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-align: center;

  // 修正背景色
  background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, white 100%);
}

.type-item {
  display: inline-block;
  width: calc(100% / 6);
  margin: 0 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -moz-tap-highlight-color: rgba(0, 0, 0, 0);
  user-select: none;
}

.type-name {
  color: #e42a30;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
  font-size: 12px;
  font-weight: 700;
  text-align: center;

  &.active {
    color: #ffffff;
  }
}

.type-slide-bar {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
  height: 35px;
  left: 0;
  top: 0;
  position: absolute;
  transition: left 0.31s;
  width: 82px;

  > img {
    width: 100%;
    height: 100%;
  }
}

.type-slide-bar-hover {
  width: 82px;
  height: 35px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  margin: 0 auto;
  right: 0;

  > img {
    width: 100%;
    height: 100%;
  }
}

.type-slide-bar-name {
  text-align: center;
  width: 68px;
  height: 35px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 101;
  margin: 0 auto;
  right: 0;

  > img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
  }

  > div {
    color: #ffffff;
    font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
    font-size: 12px;
    font-weight: 700;
    position: relative;
    z-index: 101;
  }
}

.new-game-wrap {
  margin-top: 10px;
  padding: 0 18px;
  height: 420px;
}

.new-game-container {
  width: 100%;
  height: 100%;
  touch-action: default; // 誤刪，否則在touchmove事件會有cancelable錯誤
  -webkit-overflow-scrolling: touch; // 誤刪，維持touchmove滾動順暢
}

.game-swiper-slide {
  // height: auto;
  // width: auto;
  overflow-x: hidden;
  overflow-y: scroll;
  touch-action: default; // 誤刪，否則在touchmove事件會有cancelable錯誤
  -webkit-overflow-scrolling: touch; // 誤刪，維持touchmove滾動順暢
  z-index: 2;
}

.top-wrap {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
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

.mcenter-login-status-wrap {
  background-color: #f9f9f9;
  height: 33px;
  line-height: 33px;

  > .not-login-wrap {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 17px;

    > div {
      width: 50%;

      &:first-child {
        text-align: left;
        font-size: 17px;
        font-weight: 700;
        color: #fe9154;
      }

      &:last-child {
        text-align: right;
        font-size: 13px;
        font-weight: 400;
        color: #8d8d8d;
      }
    }
  }

  > .is-login-wrap {
    padding: 0 17px;

    > div {
      display: inline-block;
    }

    .balance-wrap {
      float: right;
    }

    .wallet,
    .username {
      color: #8d8d8d;
      font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
      font-size: 12px;
      font-weight: 400;
      margin-right: 6px;
      text-align: left;
      vertical-align: middle;
    }

    .username {
      color: #4e5159;
      font-family: Arial, Arial-Regular;
    }

    .balance {
      color: #4e5159;
      font-family: Arial, Arial-Bold;
      font-size: 15px;
      font-weight: 700;
      text-align: right;
      vertical-align: middle;
    }
  }
}

.vip-level {
  color: #ffffff;
  font-weight: 700;
  display: inline-block;
  vertical-align: middle;

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
  background: white;
}

.mcenter-func {
  width: 100%;
  display: inline-block;
  margin: 10px 0;
}

.mcenter-cell {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  text-align: center;
  width: 25%;

  > img {
    width: 27px;
    height: 27px;
    display: inline-block;
  }

  > div {
    color: #ff8400;
    display: inline-block;
    font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
    font-size: 14px;
    font-weight: 400;
    margin-left: 3px;
    text-align: left;
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

  &.is-activity {
    width: 100%;
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
      max-height: 85%;
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
