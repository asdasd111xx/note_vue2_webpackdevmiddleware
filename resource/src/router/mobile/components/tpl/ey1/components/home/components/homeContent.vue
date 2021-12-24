<template>
  <div>
    <popup v-if="isShowPop" @close="closePop" :sitePostList="sitePostList" />
    <div ref="home-wrap" :class="[$style['home-wrap'], 'clearfix']">
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
              <div
                :class="[
                  $style['username'],
                  {
                    [$style['long']]:
                      memInfo.user.username && memInfo.user.username.length > 15
                  }
                ]"
              >
                {{ memInfo.user.username }}
              </div>
              <div :class="$style['vip-level']">
                <div>VIP&nbsp;{{ userViplevel }}</div>
              </div>
              <div
                :class="[
                  $style['balance-wrap'],
                  {
                    [$style['long']]: membalanceDefaultAmount.length > 18
                  }
                ]"
              >
                <span :class="$style['wallet']">
                  {{ $text("S_MCENTER_WALLET") }}
                </span>
                <span :class="$style['balance']">
                  {{ `¥${membalanceDefaultAmount}` }}
                </span>
              </div>
            </div>
          </div>
          <div :class="$style['mcenter-func']">
            <template v-for="(info, index) in mcenterEy1List">
              <div
                v-if="info.name === 'grade'"
                :key="`mcenter-${index}`"
                :class="$style['mcenter-cell']"
                @click="onGoToMcenter(info.path)"
              >
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/_new/level/icon_level_${vipLevel}.png`
                    )
                  "
                />
                <div>{{ vipLevel === "max" ? vipLevel : info.text }}</div>
              </div>

              <div
                v-else-if="info.name !== 'makemoney' || showPromotion"
                :key="`mcenter-${index}`"
                :class="$style['mcenter-cell']"
                @click="onGoToMcenter(info.path)"
              >
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/ey1/wallet/icon_wallet_${info.name}.png`
                    )
                  "
                />
                <div>{{ info.text }}</div>
              </div>
            </template>
          </div>
        </div>

        <!-- 上方自選列表 -->
        <div
          v-if="allGameList && allGameList.length > 1"
          :class="$style['type-wrap-container']"
        >
          <!-- active -->
          <div
            v-if="typeBarPosition !== null"
            :class="[$style['type-slide-bar']]"
            :style="{
              right: `${typeBarPosition}px`
            }"
          >
            <div :class="[$style['type-slide-bar-hover']]">
              <img :src="$getCdnPath(`/static/image/ey1/home/navhover.png`)" />
            </div>

            <div :class="[$style['type-slide-bar-name']]">
              <img
                :src="
                  $getCdnPath(`/static/image/ey1/home/navbtn_bg_active.png`)
                "
              />
              <div>
                {{ currentType.name }}
              </div>
            </div>
          </div>

          <div :class="['type-slide-pagination']"></div>
        </div>
      </div>

      <div
        v-if="isReceive"
        :class="$style['new-game-wrap']"
        :style="{
          height: `${eyWrapHeight}px`
        }"
      >
        <swiper
          :ref="'game-swiper'"
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
              <swiper
                :ref="`sub-game-swiper-${key}`"
                :data-key="`sub-game-swiper-${key}`"
                :options="subGameSwiperOptions"
                :class="$style['sub-game-container']"
              >
                <template v-for="(game, i) in list.vendors">
                  <swiperSlide
                    v-if="
                      !(list.vendors[i - 1] && list.vendors[i - 1].imageFlag)
                    "
                    :key="`sub-game-swiper-${i}`"
                    :class="[
                      'swiper-slide',
                      $style['sub-game-swiper-slide'],
                      {
                        [$style['flex']]: game.imageFlag
                      }
                    ]"
                  >
                    <div
                      :key="`game-${i}-${game.image}`"
                      :data-img-type="`${game.imageType}`"
                      :data-type="game.type"
                      :class="[
                        $style.game,
                        {
                          [$style['is-full']]: [1, 2, 3].includes(
                            game.imageType
                          )
                        },
                        { [$style['is-third']]: [4].includes(game.imageType) },
                        {
                          [$style['is-activity']]: [5].includes(game.imageType)
                        }
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
                        <template>
                          <img
                            v-lazy="getImg(game)"
                            :alt="game.name"
                            @click="onOpenGame(game)"
                          />
                          <img
                            v-if="
                              ['game_lobby', 'game'].includes(game.type) &&
                                game.vendor &&
                                trialList.find(
                                  i =>
                                    i.vendor === game.vendor &&
                                    +i.kind === +game.kind &&
                                    i.mobile_trial
                                )
                            "
                            :class="[$style['free-image']]"
                            :src="
                              $getCdnPath(
                                `/static/image/common/home/ic_freegame.png`
                              )
                            "
                          />
                        </template>
                      </template>
                    </div>

                    <!-- imageType === 0, 50% 並排 -->
                    <div
                      v-if="game.imageFlag"
                      :key="`game-${i}-${list.vendors[i + 1].image}-2`"
                      :data-img-type="0"
                      :data-type="list.vendors[i + 1].type"
                      :class="[$style.game]"
                    >
                      <img
                        v-lazy="getImg(list.vendors[i + 1])"
                        :alt="list.vendors[i + 1].name"
                        @click="onOpenGame(list.vendors[i + 1])"
                      />
                      <img
                        v-if="
                          ['game_lobby', 'game'].includes(
                            list.vendors[i + 1].type
                          ) &&
                            trialList.find(
                              x =>
                                x.vendor === list.vendors[i + 1].vendor &&
                                +x.kind === list.vendors[i + 1].kind &&
                                x.mobile_trial
                            )
                        "
                        :class="[$style['free-image']]"
                        :src="
                          $getCdnPath(
                            `/static/image/common/home/ic_freegame.png`
                          )
                        "
                      />
                    </div>
                  </swiperSlide>
                </template>
              </swiper>
            </template>
          </swiperSlide>
        </swiper>
      </div>
      <page-loading :isShow="isLoading" />
    </div>
    <div v-if="showRedirectJump">
      <div :class="$style['mask']" />

      <div :class="$style['modal-wrap']">
        <div :class="$style['modal-content']">
          {{
            `尊敬的会员您好，${siteName}为进行线路与安全分流，将为您导至${siteName}子网址，并请您以后利用此网址登入，如有疑虑，欢迎洽询线上客服!`
          }}
        </div>

        <div
          :class="[
            $style['modal-button-center'],
            $style[siteConfig.MOBILE_WEB_TPL]
          ]"
          @click="closeRedirect_url()"
        >
          确定
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import mixin from "@/mixins/homeContent";
import popup from "@/router/mobile/components/common/home/popup";

export default {
  mixins: [mixin],
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    Swiper,
    SwiperSlide,
    popup
  },
  data() {
    return {
      userViplevel: "",
      newTypeList: [],
      currentType: { key: 0 },
      gameSwiperUpdatedKey: 0,
      subGameSwiperUpdatedKey: 0,
      eyWrapHeight: 420,
      typeBarPosition: null,
      typeItemWidth: 48
    };
  },
  computed: {
    membalanceDefaultAmount() {
      return this.membalance &&
        this.membalance.vendor.default &&
        this.membalance.vendor.default.amount
        ? this.membalance.vendor.default.amount
        : "";
    },
    subGameSwiperOptions() {
      return {
        watchSlidesVisibility: true,
        direction: "vertical",
        freeMode: true,
        autoHeight: true,
        observer: true,
        observeParents: true,
        nested: true,
        slidesPerView: document.body.clientHeight < 812 ? 2 : 3,
        spaceBetween: 3,
        mousewheel: false,
        speed: 100
      };
    },
    gameSwiperOptions() {
      // 強制刷新swiper
      this.gameSwiperUpdatedKey += 1;
      this.subGameSwiperUpdatedKey += 1;

      return {
        direction: "vertical",
        loop: this.allGameList && this.allGameList.length > 1 ? true : false,
        observer: true,
        observeParents: true,
        mousewheel: false,
        watchSlidesVisibility: true,
        autoHeight: true,
        spaceBetween: Math.min(document.body.clientHeight / 2.5, 300),
        pagination: {
          el: ".type-slide-pagination",
          clickable: true,
          bulletActiveClass: "type-slide-pagination-bullet-active",
          bulletClass: "type-slide-pagination-bullet",
          renderBullet: (index, className) => {
            return `<div id="type-${index}" class="${className}" style="width:${this.typeItemWidth}px">
            <div class="type-slide-name">${this.newTypeList[index].name}</div>
            </div>`;
          }
        },
        on: {
          transitionStart: () => {
            if (
              this.newTypeList &&
              this.$refs["game-swiper"] &&
              this.$refs["game-swiper"].$swiper
            ) {
              let realIndex = this.$refs["game-swiper"].$swiper.realIndex;
              this.setSlideTypeBar(this.newTypeList[realIndex]);
            }
          }
        }
      };
    }
  },
  ...mapGetters({
    loginStatus: "getLoginStatus"
  }),
  watch: {
    allGame() {
      this.gameSwiperUpdatedKey += 1;
      this.subGameSwiperUpdatedKey += 1;

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
          let defult = +localStorage.getItem("default-home-menu-type") || 0;
          this.currentType = this.newTypeList[defult] || this.newTypeList[0];

          this.$nextTick(() => {
            this.setSlideTypeBar(this.currentType);
            if (this.$refs[`game-swiper`]) {
              this.$refs[`game-swiper`].$swiper.slideTo(defult + 1);
            }
          });

          this.typeItemWidth =
            (document.body.clientWidth - 10) / this.newTypeList.length;
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
      let typeHeight = this.allGameList && this.allGameList.length > 1 ? 30 : 5;
      let extraHeight = typeHeight + 120 + 60 + homeSliderHeight + 12;

      this.eyWrapHeight =
        document.body.offsetHeight - extraHeight > 420
          ? document.body.offsetHeight - extraHeight
          : 420;

      this.gameSwiperUpdatedKey += 1;
      this.subGameSwiperUpdatedKey += 1;
      this.setSlideTypeBar(this.currentType, true);
    },
    setSlideTypeBar(item, resize = false) {
      if (this.allGameList && this.allGameList.length <= 1) {
        return;
      }

      if (!resize) {
        localStorage.setItem("default-home-menu-type", item.key);
      }

      if (
        item &&
        this.currentType &&
        this.$refs[`sub-game-swiper-${+this.currentType.key}`]
      ) {
        const setPosition = () => {
          let target = document.getElementById(`type-${item.key}`);

          if (target) {
            let offsetLeft = target.offsetLeft;
            let offsetWidth = target.offsetWidth;

            this.typeBarPosition =
              document.body.clientWidth -
              (offsetLeft + offsetWidth) +
              (offsetWidth - 68) / 2;
          } else {
            this.typeBarPosition = 0;
          }

          // 置頂原本的swiper
          this.$refs[
            `sub-game-swiper-${+this.currentType.key}`
          ][0].$swiper.slideTo(0);
          this.currentType = item;
        };

        if (resize) {
          setTimeout(() => {
            setPosition();
          }, 300);
        } else {
          setPosition();
        }
      }
    }
  },
  beforeMount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("orientationchange", this.onResize);
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("orientationchange", this.onResize);
    if (this.loginStatus) {
      this.getUserViplevel();
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.home-wrap {
  overflow: hidden;
  position: relative;
  padding: 0;
  margin-top: 1px;
  background: #f1f1f1;
  z-index: 4;
}

.type-wrap-container {
  padding: 0px;
  width: 100%;
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

:global {
  .type-slide-pagination {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .type-slide-pagination-bullet {
    height: 100%;
    display: inline-block;

    width: auto;
    padding: 0 4px;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -moz-tap-highlight-color: rgba(0, 0, 0, 0);
    user-select: none;

    > .type-slide-name {
      color: #e42a30;
      font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
    }
  }

  .type-slide-pagination-bullet-active {
    > .type-slide-name {
      z-index: -1;
      // color: #ffffff;
      font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
    }
  }
}

.type-slide-bar {
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
  height: 35px;
  right: -100vw;
  top: 0;
  position: absolute;
  transition: right 0.31s;
  -webkit-transition: right 0.31s;
  width: 68px;

  > img {
    width: 100%;
    height: 100%;
  }
}

.type-slide-bar-hover {
  width: 100%;
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
  width: calc(80%);
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
  box-sizing: border-box;
}

.new-game-container {
  width: 100%;
  height: 100%;
  max-height: 100%;
  touch-action: default; // 誤刪，否則在touchmove事件會有cancelable錯誤
  -webkit-overflow-scrolling: touch; // 誤刪，維持touchmove滾動順暢
}

.sub-game-container {
  width: auto;
  height: 100%;
  position: relative;
  overflow-y: scroll;
  max-height: 100%;
  touch-action: default; // 誤刪，否則在touchmove事件會有cancelable錯誤
  -webkit-overflow-scrolling: touch; // 誤刪，維持touchmove滾動順暢
}

.game-swiper-slide {
  height: 100%;
  width: 100%;
  // padding-bottom: 10%;
  // overflow-x: hidden;
  // overflow-y: scroll;
}

.sub-game-swiper-slide {
  height: auto !important;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 7px;

  &.flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.game {
  width: 48%;
  padding: 0 2px;
  position: relative;

  &.is-full {
    width: 100%;
  }

  &.is-third {
    width: 31%;
    height: 25%;
    max-height: 150px;
    min-height: 126px;
    margin: 0 1%;
  }

  &.is-activity {
    width: 100%;
  }

  > img:first-child {
    display: block;
    width: 100%;
    max-height: 160px;
  }
}

@media (orientation: landscape) {
  .new-game-wrap {
    width: 95%;
  }
}

@media screen and (min-width: 375px) {
  .top-wrap {
    background-image: url("/static/image/ey1/home/nav01_bg@2x.png");
    background-position: bottom !important;
    background-size: contain !important;
  }
}

@media screen and (max-width: 374px) {
  .new-game-wrap {
    padding: 0 14px;
  }

  .game {
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      display: block;
      width: 98%;
    }
  }
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
      background: linear-gradient(to left, #bd9d7d 0%, #f9ddbd 100%);
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
      position: absolute;
      top: 0;
      right: 17px;

      &.long {
        display: grid;

        > span {
          line-height: 20px;
          height: 20px;
        }
      }
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
      max-width: 25%;

      &.long {
        line-height: initial;
        word-break: break-all;
      }
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
  display: inline-flex;
  margin: 10px 0;
}

.mcenter-cell {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  text-align: center;
  flex: 1;

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

.free-image {
  position: absolute;
  bottom: 0px;
  left: 3px;
  width: 60px;
  height: 25px;
}

.wrap-buffer {
  width: 100%;
  height: 200px;
  display: block;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  background-color: red;
}

.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.modal-wrap {
  width: 270px;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 100;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 10px;
}

.modal-content {
  padding: 15px 15px 10px 15px;
  // border-bottom: 1px solid #eee;
}

.modal-button-center {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;

  &:last-child {
    color: var(--member_color100);
  }

  &.ey1:last-child {
    color: #e42a30;
  }

  &.porn1:last-child {
    color: var(--member_color100);
  }
}
</style>
