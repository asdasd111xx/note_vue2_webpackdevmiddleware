<template>
  <div :class="$style['discover-tag-wrap']">
    <div :class="$style['banner-wrap']">
      <img :src="$getCdnPath('/static/image/_new/search/banner.png')" />
    </div>
    <div :class="$style['search-wrap']">
      <input
        v-model="keyWord"
        :placeholder="$text('S_PLEASE_INPUT_AV', '请输入片名, 女优或番号')"
        type="text"
        @keydown.enter="onClick({ title: keyWord })"
      />
      <div :class="$style['icon-search']" @click="onClick({ title: keyWord })">
        <img
          :src="$getCdnPath(`/static/image/_new/search/ic_search.png`)"
          alt="search"
        />
      </div>
    </div>
    <div v-if="historyList.length" :class="$style.history">
      <div :class="$style.title">
        {{ $text("S_SEARCH_HISTORY", "历史搜索") }}
      </div>
      <div :class="$style['icon-trash']" @click="onDelete" />
      <div :class="[$style['history-search'], 'clearfix']">
        <div
          v-for="(title, index) in historyList"
          :key="`key-word-${index}`"
          :class="$style.wrap"
          @click="onClick({ title })"
        >
          <span>{{ title }}</span>
        </div>
      </div>
    </div>
    <div :class="$style.hot">
      <div :class="$style.title">
        {{ $text("S_SEARCH_HOT", "热门搜索") }}
      </div>
      <div :class="[$style['hot-search'], 'clearfix']">
        <div
          v-for="info in hotList"
          :key="info.id"
          :class="$style.wrap"
          @click="onClick(info)"
        >
          <span>{{ info.title }}</span>
        </div>
      </div>
    </div>
    <div :class="$style.recommend">
      <div :class="$style.title">
        {{ $text("S_RECOMMANDED", "推荐") }}
      </div>
      <div :class="[$style['recommend-search'], 'clearfix']">
        <div
          v-for="info in recommendList"
          :key="info.id"
          :class="$style.wrap"
          @click="onClick(info)"
        >
          <span>{{ info.title }}</span>
        </div>
      </div>
    </div>
    <div :class="$style['tips']">
      <div :class="$style['tips-title']">
        <span>老司机课堂</span>
      </div>
      <div :class="$style['tips-content']">
        {{
          $text(
            "S_ADULT_VIDEO_TIPS",
            "车牌又叫电影番号或编号。在爱情动作电影的故乡岛国，老师将同学们喜爱的各形各色的爱情动作片按厂商、制作风、有无码、质量参数、发表时间、版本等特征性的内容编码分类。车牌是经验老道的老司机们对电影番号的另外壹种充满爱的诠释。"
          )
        }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import split from "lodash/split";
import join from "lodash/join";
import pornRequest from '@/api/pornRequest';

export default {
  props: {
    setKeyWord: {
      type: Function,
      required: true
    }
  },
  data() {
    const historyKeyWord = localStorage.getItem("history-search");

    return {
      historyList: historyKeyWord ? split(historyKeyWord, ",") : [],
      hotList: [],
      recommendList: [],
      keyWord: ""
    };
  },
  created() {
    pornRequest({
      method: "get",
      url: `/video/getsearchkey`,
    }).then(response => {
      if (response.status !== 200) {
        return;
      }

      this.hotList = [...response.result.hot];
      this.recommendList = [...response.result.recommend];
    });
  },
  methods: {
    onClick({ title }) {
      const historyKeyWord = this.historyList.includes(title)
        ? [...this.historyList]
        : [...this.historyList, title];

      localStorage.setItem("history-search", join(historyKeyWord));

      this.setKeyWord(title);
      this.$router.push({ name: "search", params: { key: title } });
    },
    onDelete() {
      this.historyList = [];

      localStorage.removeItem("history-search");
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

@mixin tip-wage-style {
  content: "";
  position: absolute;
  bottom: 0;
  right: 100px;
  width: 90px;
  height: 15px;
  background-image: url(/static/image/_new/search/wave_left.png);
  background-size: contain;
  background-repeat: no-repeat;
}

.discover-tag-wrap {
  padding: 10px 15px 12px;
}

.banner-wrap {
  margin-bottom: 5px;

  > img {
    display: block;
    width: 100%;
  }
}

.search-wrap {
  position: relative;
  margin-bottom: 5px;

  > input {
    width: 100%;
    height: 35px;
    line-height: 32px;
    padding: 0 40px 0 7px;
    border: none;
    border-radius: 5px;
    background-color: #eeeeee;
    color: $main_text_color2;
    font-size: 14px;
    outline: none;

    &::placeholder {
      color: $main_text_color2;
    }
  }
}

.icon-search {
  position: absolute;
  top: 0;
  right: 0;
  width: 35px;
  height: 35px;
  padding: 6px 0;
  border-radius: 0 5px 5px 0;
  background: linear-gradient(to left, #bd9d7d, #f9ddbd);
  color: white;
  margin: 0 auto;
  text-align: center;

  > img {
    width: 21px;
    height: 21px;
  }
}

.history,
.hot,
.recommend {
  margin: 15px 0;
}

.history {
  position: relative;

  .wrap {
    color: #9a9da4;
  }
}

.hot,
.recommend {
  position: relative;
  .wrap {
    color: #bf8646;
  }
}

.title {
  height: 30px;
  line-height: 30px;
  color: #5e626d;
  font-weight: 400;
  font-size: 12px;
  margin-left: 8px;

  &::before {
    content: "";
    position: absolute;
    width: 3px;
    height: 16px;
    left: 0px;
    top: 7px;
    border-radius: 2px;
    background: linear-gradient(to left, #d2bba4, #f1e5db);
  }
}

.icon-trash {
  position: absolute;
  top: 2px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: url("/static/image/_new/search/btn_delete.png") 50% 50% no-repeat;
  background-size: 22px 22px;
}

.history-search,
.hot-search,
.recommend-search {
  margin-top: 7px;
}

.wrap {
  overflow: hidden;
  float: left;
  width: 22%;
  height: 28px;
  line-height: 28px;
  margin: 0 9px 9px 0;
  padding: 0 3px;
  border-radius: 15px;
  background-color: #eeeeee;
  font-size: 12px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:nth-child(4n) {
    margin-right: 0;
  }
}

.tips {
  width: 100%;
  height: 150px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);

  .tips-title {
    position: relative;
    font-size: 14pt;
    text-align: center;
    color: #bf8646;
    padding: 15px 0;

    > span {
      position: relative;

      &::before {
        @include tip-wage-style;
        background-image: url(/static/image/_new/search/wave_left.png);
        right: 100px;
      }

      &::after {
        @include tip-wage-style;
        background-image: url(/static/image/_new/search/wave_right.png);
        left: 100px;
      }
    }
  }

  .tips-content {
    position: relative;
    height: auto;
    padding: 0 10px;
    font-size: 11px;
    line-height: 17px;
    color: #5e626d;
  }
}

@media screen and (min-width: $phone) {
  .wrap {
    font-size: 14px;
  }

  .title {
    font-size: 16px;
  }
}

@media screen and (min-width: $pad) {
  .search-wrap {
    > input {
      font-size: 14px;
    }
  }

  .wrap {
    font-size: 16px;
  }

  .title {
    font-size: 18px;
  }

  .tips {
    font-size: 14px;
  }
}
</style>
