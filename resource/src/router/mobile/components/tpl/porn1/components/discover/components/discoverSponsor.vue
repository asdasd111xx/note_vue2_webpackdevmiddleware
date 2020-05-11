<template>
  <div :class="$style['discover-sponsor-wrap']">
    <div v-for="info in list" :key="info.key" :class="$style.list">
      <div :class="$style.wrap" @click="open(info)">
        <img :src="$getCdnPath(`/static/image/_new/sponsor/${info.key}.jpg`)" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    open(info) {
      window.open(info.requestUrl, '_blank')
    }
  },
  computed: {
    list() {
      return [
        {
          key: 'manchester',
          requestUrl: 'http://mau2l.com/jAfxWuN',
          titleName: '英超曼联'
        },
        {
          key: 'yidali',
          requestUrl: 'http://wagc8.com/X8TKaSM',
          titleName: '意甲联赛'
        },
        {
          key: 'bayern',
          requestUrl: 'http://y3az6.com/wSxyKTu',
          titleName: '拜仁慕尼黑'
        },
        {
          key: 'stevevGerrard',
          requestUrl: 'http://wagc8.com/gjNOpQU',
          titleName: '杰拉德'
        },
        {
          key: 'leicester',
          requestUrl: 'http://eqfyl.com/tjGo9Tz',
          titleName: '莱斯特城'
        },
        {
          key: 'argentina',
          requestUrl: 'http://q3vcf.com/DQkCAFB',
          titleName: '阿根廷国家队'
        },
        {
          key: 'monaco',
          requestUrl: 'http://q7g1l.com/iJhNMLo',
          titleName: '法甲摩纳哥'
        },
        {
          key: 'bundesliga',
          requestUrl: 'http://y3az6.com/OLTMz2G',
          titleName: '德甲柏林赫塔'
        },

      ];
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.discover-sponsor-wrap {
  background-color: $main_background_white1;
}

.list {
  padding: 3px 13px 0;
}

.wrap {
  display: block;

  img {
    display: block;
    border-radius: 6px;
    width: 100%;
  }
}
</style>
