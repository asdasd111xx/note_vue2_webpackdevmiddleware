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
import mobileContainer from '../../../../common/mobileContainer';
import vipDetailMixin from "@/mixins/mcenter/accountVip/vipDetail"

export default {
  components: {
    mobileContainer
  },
  mixins: [vipDetailMixin],
  created() {
    this.platformName = '亿元'
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

@mixin grid-style {
  display: grid;
  grid-template-columns: 68px repeat(5, 1fr);
  height: 40px;
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
    &:first-of-type {
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
