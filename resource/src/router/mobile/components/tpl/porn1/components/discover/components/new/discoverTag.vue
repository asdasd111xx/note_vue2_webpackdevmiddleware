<template>
  <div :class="$style['discover-tag-wrap']">
    <div :class="[$style['tag-wrap'], 'clearfix']">
      <div
        v-for="tag in tags"
        :key="tag.id"
        :class="[$style.tag, { [$style.active]: tag.id === active }]"
        @click="onClick(tag.id)"
      >
        <div>{{ tag.name }}</div>
      </div>
    </div>
    <div :class="[$style['list-wrap'], 'clearfix']">
      <div
        v-for="info in list"
        :key="info.id"
        :class="[$style.list, { [$style.active]: selected.includes(info.id) }]"
        @click="onSelect(info.id)"
      >
        <span v-if="selected.includes(info.id)" :class="$style['icon-wrap']">
          <icon name="check-circle" width="14" height="14" />
        </span>
        <span>{{ info.title }}</span>
      </div>
    </div>
    <div :class="[$style['select-wrap'], 'clearfix']">
      <div :class="$style.amount">{{ selected.length }}</div>
      <div :class="$style.tips">{{ $text("S_TAG_SELECTED", "已选标签") }}</div>
    </div>
    <div :class="$style['btn-confirm']" @click="onConfirm">
      {{ $text("S_CONFIRM", "确认") }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import find from 'lodash/find';
import join from 'lodash/join';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
  data() {
    return {
      tags: [],
      active: 0,
      selected: []
    };
  },
  computed: {
    list() {
      return this.active ? find(this.tags, (tag) => tag.id === this.active).list : [];
    }
  },
  created() {
    axios({
      method: 'get',
      url: `${API_PORN1_DOMAIN}/api/v1/video/alltag`,
      timeout: 30000,
      headers: {
        Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
        Version: 1
        // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // origin: 'http://127.0.0.1'
      }
    }).then((response) => {
      if (response.data.status !== 200) {
        return;
      }

      this.tags = [...response.data.result.tags];
      this.active = this.tags[0].id;
    });
  },
  methods: {
    onClick(id) {
      this.active = id;
      this.selected = [];
    },
    onSelect(id) {
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter((value) => value !== id);
        return;
      }

      this.selected = [...this.selected, id];
    },
    onConfirm() {
      if (!this.selected.length) {
        return;
      }

      const keyWord = this.selected.reduce((init, id) => [...init, find(this.list, (info) => info.id === id).title], []);

      this.$router.push({ name: 'tag', params: { key: join(keyWord, ',') } });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.discover-tag-wrap {
  padding: 11px 0 30px;
}

.tag {
  float: left;
  width: 25%;
  margin-bottom: 11px;
  border-radius: 3px;
  border-color: #d5bea4;

  &.active {
    > div {
      border-color: #ffffff;
      color: #ffffff;
      background: -webkit-linear-gradient(right, #bd9d7d, #f9ddbd);
      background: -o-linear-gradient(left, #bd9d7d, #f9ddbd);
      background: -moz-linear-gradient(left, #bd9d7d, #f9ddbd);
      background: linear-gradient(to left, #bd9d7d, #f9ddbd);
    }
  }

  > div {
    overflow: hidden;
    width: 65px;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    color: #d5bea4;
    border-radius: 3px;
    border-color: #d5bea4;
    font-size: 14px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.list-wrap {
  margin-bottom: 40px;
  padding: 0 10%;
}

.list {
  float: left;
  width: 40%;
  height: 46px;
  margin-left: 10%;
  color: #9a9da4;
  font-size: 14px;

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  &.active {
    color: #face15;
  }

  > span {
    display: inline-block;
    vertical-align: middle;
  }
}

.icon-wrap {
  margin-right: 3px;

  > svg {
    display: block;
  }
}

.select-wrap {
  margin: 0 25% 10px;

  > div {
    float: right;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
  }
}

.amount {
  padding: 0 4px;
  border-radius: 50%;
  background-color: #ff004f;
  color: #fff;
}

.tips {
  margin-right: 3px;
  color: #9a9da4;
  font-weight: 500;
}

.btn-confirm {
  width: 60%;
  height: 44px;
  line-height: 44px;
  margin: 0 auto;
  border-radius: 22px;
  color: #ffffff;
  background: -webkit-linear-gradient(right, #bd9d7d, #f9ddbd);
  background: -o-linear-gradient(left, #bd9d7d, #f9ddbd);
  background: -moz-linear-gradient(left, #bd9d7d, #f9ddbd);
  background: linear-gradient(to left, #bd9d7d, #f9ddbd);
  font-weight: 700;
  font-size: 18px;
  text-align: center;
}

@media screen and (min-width: $phone) {
  .tag {
    > div {
      font-size: 15px;
    }
  }

  .list {
    font-size: 15px;
  }

  .select-wrap {
    > div {
      font-size: 13px;
    }
  }
}

@media screen and (min-width: $pad) {
  .tag {
    > div {
      font-size: 16px;
    }
  }

  .list {
    font-size: 16px;
  }

  .select-wrap {
    > div {
      font-size: 14px;
    }
  }

  .btn-confirm {
    font-size: 20px;
  }
}
</style>
