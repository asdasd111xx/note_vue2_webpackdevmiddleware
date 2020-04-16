<template>
  <div :class="$style['discover-tag-wrap']">
    <div :class="[$style['tag-wrap']]">
      <div
        v-for="tag in tags"
        :key="tag.id"
        :class="[$style.tag, { [$style.active]: tag.id === active }]"
        @click="onClick(tag.id)"
      >
        {{ tag.name }}
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
          <img
            :class="$style['discover-icon']"
            :src="$getCdnPath(`/static/image/_new/common/icon_remember.png`)"
          />
        </span>
        <span>{{ info.title }}</span>
      </div>
    </div>
    <div :class="[$style['select-wrap']]">
      <div>
        <div :class="$style.tips">
          {{ $text("S_TAG_SELECTED", "已选标签") }}
        </div>
        <div :class="$style.amount">{{ selected.length }}</div>
      </div>
      <div :class="$style['btn-confirm']" @click="onConfirm">
        {{ $text("S_CONFIRM", "确认") }}
      </div>
    </div>
    <message v-if="msg" @close="msg = ''"
      ><div slot="msg">{{ msg }}</div>
    </message>
  </div>
</template>

<script>
import axios from 'axios';
import find from 'lodash/find';
import join from 'lodash/join';
import { API_PORN1_DOMAIN } from '@/config/api';
import message from '../../../common/new/message'
export default {
  components: {
    message
  },
  data() {
    return {
      tags: [],
      active: 0,
      selected: [],
      msg: ''
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

      if (this.selected.length == 5) {
        this.msg = "一次最多选5个标签"
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
}

.tag-wrap {
  overflow-x: auto;
  width: 100%;
  display: flex;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag {
  color: #d5bea4;
  border: 1px #d5bea4 solid;
  display: inline-flex;
  min-width: 54px;
  height: 100%;
  overflow: hidden;
  line-height: 30px;
  margin: 0 1.5px;
  border-radius: 3px;
  font-size: 14px;
  text-align: center;
  text-overflow: ellipsis;
  align-items: center;
  justify-content: center;

  &.active {
    border-color: #ffffff;
    color: #ffffff;
    background: -webkit-linear-gradient(right, #bd9d7d, #f9ddbd);
    background: -o-linear-gradient(left, #bd9d7d, #f9ddbd);
    background: -moz-linear-gradient(left, #bd9d7d, #f9ddbd);
    background: linear-gradient(to left, #bd9d7d, #f9ddbd);
  }
}

.list-wrap {
  margin-top: 14px;
  margin-bottom: 20px;
  background-color: $main_background_white1;
  padding: 0 14px;
}

.list {
  float: left;
  width: 50%;
  height: 20px;
  line-height: 20px;
  margin-bottom: 10px;
  color: $main_text_color4;
  font-size: 14px;

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  &.active {
    color: $main_text_color4;
  }

  > span {
    display: inline-block;
    vertical-align: middle;
  }
}

.icon-wrap {
  margin-right: 3px;
  width: 17px;
  height: 17px;

  > img {
    height: 100%;
  }
}

.select-wrap {
  height: 120px;
  padding: 5px 0;
  > div:first-child {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
  }
}

.amount {
  padding: 0 4px;
  font-size: 12px;
  text-align: center;
  border-radius: 50%;
  background-color: #ff004f;
  color: #fff;
  width: 17px;
  height: 17px;
  line-height: 17px;
}

.tips {
  margin-right: 4px;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  color: $main_text_color2;
}

.btn-confirm {
  max-width: 325px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  margin: 0 auto;
  border-radius: 3px;
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
    margin: 0 1%;
  }

  .list {
    height: 24px;
    line-height: 24px;
    font-size: 17px;
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
