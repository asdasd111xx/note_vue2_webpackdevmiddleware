<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :is-app="isApp"
  >
    <div slot="content" :class="$style['detail-wrap']">
      <div :class="$style['table-container']">
        <div :class="$style['title']">返水比例</div>

        <div :class="$style['table-wrap']">
          <div :class="$style['table-header']">
            <div
              v-for="(item, index) in titleList"
              :key="`titleList-${index}`"
              :class="$style['header-item']"
            >
              {{ item }}
            </div>
          </div>

          <div :class="$style['table-body']">
            <div
              v-for="(cells, index) in list"
              :key="`list-${index}`"
              :class="$style['content']"
            >
              <div
                v-for="(item, num) in cells"
                :key="`cells-${num}`"
                :class="$style['item']"
              >
                {{ item }}
              </div>
            </div>
          </div>

          <div :class="$style['table-desc']">
            ※每日返水将会在每日04:00-04:30派发
          </div>
        </div>

        <div :class="$style['desc-wrap']">
          <div :class="$style['title']">活动的一般条款与规则</div>
          <div :class="$style['content']">
            <div
              v-for="(item, index) in contentList"
              :key="`contentList-${index}`"
              :class="$style['cell']"
            >
              <span>{{ item.number }}</span>
              <span>{{ item.title }}</span>
              <div>{{ item.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <div :class="$style['back-top']" @click="backToTop">
        <img
          :src="$getCdnPath(`/static/image/_new/mcenter/vip/detail/ic_top.png`)"
          alt="top"
        />
        <p>回到顶部</p>
      </div>
    </div>
  </mobile-container>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import { getCookie } from "@/lib/cookie";
import mobileContainer from '../../../../common/mobileContainer';

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      titleList: [
        'VIP等级',
        '体育返水',
        '电竞返水',
        '视讯返水',
        '电子返水',
        '棋牌返水',
        '返水上限'
      ],
      list: [
        ['VIP0', '0.38%', '0.48%', '0.40%', '0.80%', '0.55%', '10,888'],
        ['VIP1', '0.38%', '0.48%', '0.45%', '0.90%', '0.60%', '12,888'],
        ['VIP2', '0.38%', '0.48%', '0.45%', '0.90%', '0.75%', '16,888'],
        ['VIP3', '0.40%', '0.55%', '0.55%', '0.95%', '0.80%', '18,888'],
        ['VIP4', '0.45%', '0.55%', '0.55%', '0.95%', '0.85%', '28,888'],
        ['VIP5', '0.45%', '0.55%', '0.60%', '1.00%', '0.90%', '38,888'],
        ['VIP6', '0.50%', '0.60%', '0.65%', '1.00%', '0.95%', '58,888'],
        ['VIP7', '0.55%', '0.70%', '0.70%', '1.10%', '1.00%', '88,888'],
        ['VIP8', '0.68%', '0.80%', '0.75%', '1.10%', '1.05%', '128,888'],
        ['VIP9', '0.80%', '0.90%', '0.85%', '1.20%', '1.10%', '188,888'],
        ['VIP10', '1.00%', '1.10%', '1.00%', '1.20%','1.20%',  '388,888']
      ],
      contentList: [
        {
          number: '❶',
          title: '晋级标准',
          content:
            '会员的累计充值以及累计流水达到相应级别的要求。即可在次日04点晋级相应的VIP等级。'
        },
        {
          number: '❷',
          title: '晋级顺序',
          content:
            'VIP等级达到相应的要求可每天晋级一级，但VIP等级不可越级晋级。'
        },
        {
          number: '❸',
          title: '保级要求',
          content:
            '会员在达到某VIP等级后，90天内需达到相对应的推广会员人数，如果在此期间完成晋级保级要求。'
        },
        {
          number: '❹',
          title: '降级标准',
          content:
            '如果会员在一个季度(90天计算)内没有完成相应的保级要求，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级。'
        },
        {
          number: '❺',
          title: '晋级礼金',
          content:
            '晋级礼金在会员达到该会员等级后系统自动派发，每个级别的晋级礼金，每位会员仅能领取1次。'
        },
        {
          number: '❻',
          title: '生日礼金',
          content:
            '将会在生日的隔月5日前，系统自动派发。每年仅可领取一次。(生日彩金1倍流水即可提現)'
        },
        {
          number: '❼',
          title: '每月红包',
          content:
            '会员在上个月有过至少1次的成功充值，即可在每月1号获得上个月相应等级的每月红包彩金。'
        },
        {
          number: '❽',
          title: '鸭博娱乐保留对活动的修改，停止及最终解释权。',
          content: ''
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    isApp() {
      const isApp = !!(
        (this.$route.query && this.$route.query.app)
        || (this.$route.query && this.$route.query.APP)
      );
      if (isApp) {
        document.title = 'VIP详请';
      }
      return isApp;
    },
    headerConfig() {
      if (this.isApp) {
        return {};
      }

      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: 'VIP详请'
      };
    }
  },
  created() {
    if (getCookie("cid")) {
      return
    }

    if (!this.loginStatus) {
      this.$router.push("/mobile/login");
    }
  },
  methods: {
    backToTop() {
      $('#mobile-wrap').animate({ scrollTop: 0 }, 1000);
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

@mixin grid-style {
  display: grid;
  grid-template-columns: 68px repeat(6, 1fr);
  height: 43px;
  text-align: center;
}

@mixin grid-item-style {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.detail-wrap {
  padding-top: 10px;
  padding-bottom: 30px;
  background: #eee;
  overflow: hidden auto;
}

.table-container {
  position: relative;
  width: 100%;
  background: $main_background_white1;
}

.title {
  font-size: 18px;
  padding: 12px 17px;
  font-weight: 700;
  color: #424654;

  &::before {
    content: "";
    position: relative;
    display: inline-block;
    width: 3px;
    height: 20px;
    top: 2.5px;
    margin-right: 12px;
    background: linear-gradient(#d2bba4, #f1e5db);
  }
}

.table-wrap {
  font-size: 12px;
  font-weight: 700;
  background: #fff;
}

.table-header {
  @include grid-style();
  background: #e2e5ed;

  .header-item {
    @include grid-item-style();
    width: 30px;
    margin: 0 auto;

    &:first-of-type {
      width: 100%;
      background: #d3c3b4;
    }
  }
}

.table-body {
  width: 100%;
  height: auto;

  .content {
    @include grid-style();
    color: #a0a7c2;

    // content的偶數欄
    &:nth-child(even) {
      background: #f6f9fc;
    }

    // 每個item
    .item {
      @include grid-item-style();
    }

    // 每一個content 且 第一個 item
    & .item:first-of-type {
      color: $main_white_color1;
      padding-left: 25px;
    }

    // 每一個奇數的content 且 第一個 item
    &:nth-child(odd) .item:first-of-type {
      background: #656d80;
    }

    // 每一個偶數的content 且 第一個 item
    &:nth-child(even) .item:first-of-type {
      background: #555b6e;
    }
  }
}

// render 每個 level 的 icon
@for $i from 0 through 10 {
  .content:nth-child(#{$i + 1}) .item:first-of-type::before {
    content: "";
    position: absolute;
    background-image: url("/static/image/_new/mcenter/vip/detail/ic_vip#{$i}.png");
    background-size: contain;
    width: 25px;
    height: 25px;
    left: 3px;
  }
}

.table-desc {
  width: 100%;
  padding: 16px 0;
  font-size: 14px;
  text-align: center;
  color: #5c91d8;
}

.desc-wrap {
  position: relative;
  width: 100%;
  background: white;
  margin-top: 10px;

  .content {
    position: relative;
    width: 100%;
    height: auto;
    padding: 0 25px 0 30px;

    .cell {
      font-size: 12px;
      padding-bottom: 20px;
      color: #a2a8c2;

      // 編號順序
      span:first-of-type {
        color: #cdb599;
      }

      // 編號text
      span:last-of-type {
        color: #656565;
      }
    }
  }
}

.back-top {
  width: 110px;
  height: 45px;
  background: #fff;
  position: relative;
  border-radius: 23px;
  font-size: 12px;
  font-weight: 700;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 15px;

  img {
    width: 12px;
    height: 12px;
  }

  p {
    color: #9ca3bf;
    line-height: 14px;
  }
}
</style>
