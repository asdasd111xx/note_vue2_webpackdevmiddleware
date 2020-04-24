<template>
  <swiper
    v-if="avList.length && allGame"
    :options="swiperOptionContent"
    :style="contentStyle"
    class="swiper gellery-content"
  >
    <swiper-slide key="av">
      <div
        v-for="(info, index) in avList"
        :key="`av-${index}`"
        class="content-cells"
      >
        <div class="desc">
          <div class="title">
            <img
              :src="$getCdnPath('/static/image/_new/common/icon_item.png')"
              alt="icon_item"
            />
            <span>{{ info.name }}</span>
          </div>
          <div
            class="more"
            @click="
              $router.push({
                name: 'videoList',
                query: {
                  tagId: videoTab.id,
                  sortId: info.id || 0
                }
              })
            "
          >
            {{ $text("S_MORE", "更多") }}
          </div>
        </div>
        <div class="content clearfix">
          <div
            v-for="(item, i) in info.list"
            :key="`av-list-${i}`"
            class="content-cell-block"
            @click="
              $router.push({ name: 'videoPlay', params: { id: info.id } })
            "
          >
            <img :src="item.image" alt="img" />
            <div class="video-text">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </swiper-slide>

    <swiper-slide v-for="(info, key) in allGame" :key="key">
      <div class="content-cells">
        <div class="content clearfix">
          <div
            v-for="(item, index) in info"
            :key="`game-list-${index}`"
            :class="['content-cell-block', { 'is-full': item.isFull }]"
            @click="onClick(item)"
          >
            <img :src="item.image" alt="img" />
            <span v-if="item.hasName">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { mapGetters } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import axios from 'axios';
import find from 'lodash/find';
import querystring from 'querystring';
import { API_PORN1_DOMAIN } from '@/config/api';
import openGame from '@/lib/open_game';

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    contentStyle: {
      type: Object,
      required: true
    },
    hallTab: {
      type: Array,
      required: true
    },
    videoTab: {
      type: Object,
      required: true
    },
    selectedIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      trans: {
        1: 'sports',
        2: 'live',
        3: 'casino',
        4: 'lottery',
        5: 'card',
        6: 'mahjong'
      },
      videoRecommand: [],
      videoList: [],
      videoSort: [],
      allGame: null
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      gameData: 'getGameData',
      memInfo: 'getMemInfo'
    }),
    swiperThumbs() {
      return this.$parent.$refs.swiperThumbs.$el.swiper;
    },
    swiperContent() {
      return this.$parent.$refs.swiperContent.$el.swiper;
    },
    swiperOptionContent() {
      return {
        loop: true,
        loopedSlides: this.hallTab.length, // looped slides should be the same
        spaceBetween: 10,
        direction: 'vertical',
        freeMode: true,
        mousewheel: true,
        autoHeight: true, // 自適應內容的高度: autoHeight + slidesPerView 必備
        slidesPerView: 'auto',
        thumbs: {
          swiper: this.swiperThumbs
        },
        on: {
          init: () => {
            this.$emit('update:selectedIndex', 0);
            this.swiperContent.slideTo(0, 0, false);
          },
          slideChange: () => {
            this.$emit('update:selectedIndex', this.swiperContent.realIndex);
          }
        }
      };
    },
    avList() {
      if (!this.videoList.length) {
        return [];
      }

      // 全部才顯示熱門推薦
      // 影片只顯示兩部
      const recommand = this.videoTab.id ? [] : [...this.videoRecommand.map((info) => ({ ...info, list: info.list.slice(0, 2) }))];

      return this.videoSort.reduce((init, sort) => {
        // 影片只顯示前三筆
        if (init.length >= 3) {
          return init;
        }

        const data = find(this.videoList, (info) => info.id === sort.id);

        if (!data) {
          return init;
        }

        // 影片只顯示兩部
        return [...init, { ...data, list: data.list.slice(0, 2) }];
      }, [...recommand]);
    }
  },
  watch: {
    videoTab() {
      this.getList();
    }
  },
  created() {
    this.getSort();
    this.getRecommand();
    this.getList();
    this.getGame();
  },
  methods: {
    getSort() {
      axios({
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
    getRecommand() {
      axios({
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
    getList() {
      axios({
        method: 'post',
        url: `${API_PORN1_DOMAIN}/api/v1/video/videolist`,
        timeout: 30000,
        data: querystring.stringify({ tag: this.videoTab.title }),
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
    getGame() {
      axios({
        method: 'get',
        url: 'https://yaboapi.bbin-asia.com/api/game/list',
        timeout: 30000,
        headers: {
          Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
          Version: 1,
          'Content-Type': 'application/x-www-form-urlencoded',
          origin: 'http://127.0.0.1'
        }
      }).then((response) => {
        if (response.status !== 200) {
          return;
        }

        // 因API無對應的Key，但是順序會固定，故使用此方法取得當前的類別
        const trans = {
          0: 'live-stream',
          1: 'sport',
          2: 'live',
          3: 'lottery',
          4: 'e-sports',
          5: 'slots',
          6: 'card',
          7: 'fish',
          8: 'bubu',
          9: 'mahjong',
          10: 'agents'
        };

        this.allGame = response.data.data.reduce((init, info, index) => {
          const category = trans[index];
          const games = info.vendors.map((game, i) => {
            // 代理大廳
            if (game.kind === 0 && game.type === 'D') {
              return { ...game, isFull: true, hasName: false };
            }

            // 美女直播、體育直播
            if (game.kind === 0 && ['BL', 'SL'].includes(game.type)) {
              return { ...game, isFull: true, hasName: true };
            }

            // IM电竞、泛亚电竞，因順序固定加上泛亞電競尚未介接無vendor故使用所以值判斷，但後續介接因使用vendor做判斷
            if (category === 'e-sports' && game.kind === 1 && [0, 1].includes(i)) {
              return { ...game, isFull: true, hasName: true };
            }

            // 視訊 亞博直播
            if (game.kind === 2 && game.vendor === 'lg_live' && i === 0) {
              return { ...game, isFull: true, hasName: false };
            }

            // BB電子
            if (game.kind === 3 && game.vendor === 'bbin' && game.code === '') {
              return { ...game, isFull: true, hasName: true };
            }

            return { ...game, isFull: false, hasName: true };
          });

          return { ...init, [category]: [...init[category], ...games] };
        }, {
          fish: [], bubu: [], mahjong: [], slots: [], card: [], 'e-sports': [], live: [], lottery: [], sport: [], agents: [], 'live-stream': []
        });
      });
    },
    onClick(game) {
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

      if (game.type === 'T') {
        if (!this.loginStatus) {
          this.$router.push('/mobile/login');
          return;
        }
        alert('正在上线 敬请期待！');
        return;
      }

      if (['BL', 'SL'].includes(game.type)) {
        if (!this.loginStatus) {
          this.$router.push('/mobile/login');
          return;
        }
        this.$router.push('/mobile/liveStream');
        return;
      }

      if (game.code) {
        if (!this.loginStatus) {
          this.$router.push('/mobile/login');
          return;
        }
        openGame({ kind: game.kind, vendor: game.vendor, code: game.code });
        return;
      }

      const trans = { 3: 'casino', 5: 'card', 6: 'mahjong' };

      this.$router.push(`/mobile/${trans[game.kind]}`);
    }
  }
};
</script>

<style lang="scss" scoped>
$border-radius: 7px;
$main-color: #b1987f;
$main-linear-background: linear-gradient(to left, #BD9D7D, #F9DDBD);
$animation-time: 1s;

.content-cells {
  position: relative;
  font-size: 14px;

  .desc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0px;
    color: #be9e7f;

    .more {
      border-radius: $border-radius;
      font-size: 14px;
      padding: 2.5px 17.5px;
      color: white;
      background: $main-linear-background;
    }
  }

  .content {
    position: relative;
    width: 100%;
    height: auto;
  }

  .content-cell-block {
    position: relative;
    float: left;
    width: 50%;
    padding: 0 2px 3px;
    box-sizing: border-box;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: $border-radius;
    }

    span {
      position: absolute;
      top: 2px;
      left: 22px;
      color: #9ca3bf;
      font-weight: 700;
      font-size: 12px;
    }

    .video-text {
      overflow: hidden;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 20px;
      border-radius: 0 0 7px 7px;
      background-color: #fff;
      color: #3d3d3d;
      font-size: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
      opacity: 0.8;
    }

    &.is-full {
      width: 100%;
    }
  }
}
</style>
