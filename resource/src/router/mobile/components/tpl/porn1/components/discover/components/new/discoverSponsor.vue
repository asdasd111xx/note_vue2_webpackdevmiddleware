<template>
  <div :class="$style['discover-sponsor-wrap']">
    <div v-for="info in list" :key="info.key" :class="$style.list">
      <a :class="$style.wrap" :href="info.requestUrl">
        <img :src="$getCdnPath(`/static/image/_new/sponsor/${info.key}.jpg`)" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    list() {
      return [
        {
          key: 'manchester',
          requestUrl: 'https://www.guangzhouhl.com/sponsor/manchester/manchester.html',
          titleName: '英超曼联'
        },
        {
          key: 'yidali',
          requestUrl: 'https://www.guangzhouhl.com/sponsor/yidali/yidali.html',
          titleName: '意甲联赛'
        },
        {
          key: 'bayern',
          requestUrl: 'https://www.guangzhouhl.com/sponsor/bayern/bayern.html',
          titleName: '拜仁慕尼黑'
        },
        {
          key: 'stevevGerrard',
          requestUrl: 'https://www.guangzhouhl.com/sponsor/stevevGerrard/stevevGerrard.html',
          titleName: '杰拉德'
        },
        {
          key: 'leicester',
          requestUrl: 'https://www.guangzhouhl.com//sponsor/leicester/leicester.html',
          titleName: '莱斯特城'
        },
        {
          key: 'argentina',
          requestUrl: 'https://www.guangzhouhl.com/sponsor/argentina.html',
          titleName: '阿根廷国家队'
        },
        {
          key: 'monaco',
          requestUrl: 'https://www.guangzhouhl.com/sponsor/monaco.html',
          titleName: '法甲摩纳哥'
        },
        {
          key: 'bundesliga',
          requestUrl: 'https://www.guangzhouhl.com/sponsor/bundesliga.html',
          titleName: '德甲柏林赫塔'
        },
        {
          key: 'americaCup',
          requestUrl: 'https://www.guangzhouhl.com/sponsor/americaCup.html',
          titleName: '美洲杯'
        }
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
  padding: 3px 13px 0 ;
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
