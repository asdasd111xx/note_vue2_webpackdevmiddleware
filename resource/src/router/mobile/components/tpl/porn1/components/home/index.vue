<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" class="content-wrap">
      <home-slider :hall-tab="hallTab" />
      <home-new :data="newsData" />
      <!--
      <home-content
        :hall-list="hallList"
        :hall-tab="hallTab"
        :video-tab="videoTab"
      /> -->
    </div>
  </mobile-container>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters } from 'vuex';
import find from 'lodash/find';
import gameCategory from '@/config/gameCategory';
import hallTab from './components/hallTab';
import homeSlider from './components/new/homeSlider';
import homeContent from './components/homeContent';
import mobileContainer from '../common/new/mobileContainer';
import homeNew from './components/new/homeNew'
export default {
  components: {
    mobileContainer,
    hallTab,
    homeSlider,
    homeNew,
    homeContent,
    videoTab: () => import(/* webpackChunkName: 'videoTab' */ './components/videoTab')
  },
  data() {
    return {
      hall: this.$route.query.type || 'home',
      video: { id: 0, title: '' }
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      gameData: 'getGameData',
      newsPopControl: 'getNewsPopControl',
      memNewsData: 'getNews',
      agentNewsData: 'getAgentNews',
    }),
    newsData() {
      console.log(this.memNewsData)
      return (this.newsPopControl.type === 'mem') ? this.memNewsData : this.agentNewsData;
    },
    // 當前大廳
    hallTab: {
      get() {
        return this.hall;
      },
      set(value) {
        this.hall = value;
      }
    },
    // 當前影片分類
    videoTab: {
      get() {
        return this.video;
      },
      set(value) {
        this.video = { ...value };
      }
    },
    isAdult() {
      return this.memInfo.config.content_rating && this.memInfo.user.content_rating;
    },
    headerConfig() {
      return {
        hasLogo: true,
        hasMemInfo: true,
        hasSearchBtn: true,
        isBackgroundGradient: true,
        onClick: () => {
          if (!this.isAdult) {
            return;
          }

          this.setHall('home');
        }
      };
    },
    // 大廳列表
    hallList() {
      const vendors = Object.keys(this.sortHallList).reduce((init, info) => {
        if (this.sortHallList[info].switch !== 'Y') {
          return init;
        }

        return { ...init, [this.sortHallList[info].category]: [...init[this.sortHallList[info].category], this.sortHallList[info]] };
      }, {
        'E-sports': [], sport: [], live: [], slots: [], lottery: [], card: [], mahjong: []
      });

      const trans = {
        esport: 'E-sports', sports: 'sport', live: 'live', casino: 'slots', lottery: 'lottery', card: 'card'
      };

      return ['sports', 'live', 'lottery', 'esport', 'casino', 'card'].reduce((init, hall) => {
        const kind = trans[hall];

        if (!vendors[kind].length) {
          return init;
        }

        if (hall === 'esport') {
          return [...init, {
            kind: 0, vendor: hall, name: 'S_ESPORTS_SHORT', list: vendors[kind]
          }];
        }

        if (hall === 'live') {
          return [...init, {
            kind: 2, vendor: hall, name: 'S_REAL_SHORT', list: vendors[kind]
          }];
        }

        return [...init, { ...find(gameCategory, (info) => info.vendor === hall), list: vendors[kind] }];
      }, []);
    },
    sortHallList() {
      // 調整 gameData 順序
      const sort = ['boe', 'crown', 'bbsport', 'sunplus', 'tgp', 'gf188', 'csc', 'ag', 'ebet', 'bblive', 'bg', 'gd', 'lg_live', 'ab', 'evo', 'mg_live', 'sexy', 'bbcasino', 'jdb', 'cq9', 'mg2', 'mg', 'lg_casino', 'ag_casino', 'pt', 'pg', 'aw', 'mw', 'fg', 'ka', 'bng', 'sw', 'gns', 'pp', 'sg', 'hb', 'isb', 'wm', 'yg_casino', 'rt', 'allwin', 'xbb_lottery', 'lottery', 'lg_lottery', 'vr', 'ky', 'jdb_card', 'fg_card', 'xbb_mj', 'lg_card', 'mt', 'yg'];
      const result = {};
      const missData = cloneDeep(this.gameData);

      sort.forEach((info) => {
        if (Object.keys(missData).includes(info)) {
          result[info] = missData[info];
          delete missData[info];
        }
      });

      return {
        ...result,
        ...missData
      };
    }
  },
  watch: {
    // eslint-disable-next-line
    '$route.query.type'(value) {
      if (!value) {
        if (!this.isAdult) {
          return;
        }
        this.setHall('home');
      }
    }
  },
  created() {
    if (this.isAdult) {
      return;
    }

    this.setHall(this.hallList[0].vendor);
  },
  methods: {
    setHall(value) {
      if (value === 'home') {
        this.$router.push({ query: {} });
      }

      this.hallTab = value;

    }
  }
};
</script>

<style lang="scss" module>
div.container {
  background-color: white;
}
</style>
